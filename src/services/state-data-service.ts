// src/services/state-data-service.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { State } from '@/lib/types';
import { initialStates as fallbackStates } from '@/data/game-data';

const CACHE_FILE_PATH = path.join(process.cwd(), '.tmp', 'state-data-cache.json');

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
        console.warn("Cache file not found, will use fallback data.");
        return null;
    }
    console.error('Error reading cache:', error);
    return null;
  }
}

export async function getStatesData(): Promise<State[]> {
  const cachedData = await readCache();

  if (cachedData?.states) {
    console.log('Using cached state data.');
    return cachedData.states;
  }

  // Fallback to static data if cache is empty or fails to load
  console.log('Using fallback static state data.');
  return fallbackStates.map(state => {
    // In a real scenario, you might want to fill in some default fetched values here
    // but for now, we just ensure the political climate is not empty.
    if (!state.politicalClimate) {
        state.politicalClimate = `The political situation in ${state.name} is complex, with various factions vying for power.`;
    }
    return state;
  });
}
