// This file is new
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { State } from '@/lib/types';
import { initialStates as fallbackStates } from '@/data/game-data';
import { fetchStateData } from '@/ai/flows/state-data-fetcher';

const CACHE_FILE_PATH = path.join(process.cwd(), '.tmp', 'state-data-cache.json');
const CACHE_DURATION_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

interface CachedData {
  timestamp: number;
  states: State[];
}

async function readCache(): Promise<CachedData | null> {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE_PATH), { recursive: true });
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    return JSON.parse(data) as CachedData;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null; // File not found, which is fine
    }
    console.error('Error reading cache:', error);
    return null;
  }
}

async function writeCache(data: CachedData): Promise<void> {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE_PATH), { recursive: true });
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

async function fetchAndCacheStates(): Promise<State[]> {
  console.log('Fetching new state data from AI...');
  try {
    const fetchedStates = await Promise.all(
      fallbackStates.map(async (baseState) => {
        try {
          const fetchedData = await fetchStateData({ stateName: baseState.name });
          return {
            ...baseState,
            demographics: {
              population: fetchedData.population,
              gdp: fetchedData.gdp,
              literacyRate: fetchedData.literacyRate,
              crimeRate: fetchedData.crimeRate,
            },
            politicalClimate: fetchedData.politicalClimate,
          };
        } catch (fetchError) {
          console.error(`Failed to fetch data for ${baseState.name}, using fallback.`, fetchError);
          // Return base state with some default values to indicate error but not crash
          return {
            ...baseState,
            politicalClimate: "Could not fetch latest data."
          };
        }
      })
    );

    await writeCache({
      timestamp: Date.now(),
      states: fetchedStates,
    });
    console.log('Successfully fetched and cached new state data.');
    return fetchedStates;
  } catch(e) {
    console.error("Failed to fetch state data. Using fallback.", e)
    return fallbackStates;
  }
}

export async function getStatesData(forceRefresh: boolean = false): Promise<State[]> {
  const cachedData = await readCache();

  if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
    console.log('Using cached state data.');
    return cachedData.states;
  }

  return await fetchAndCacheStates();
}
