// src/services/state-data-service.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { State } from '@/lib/types';
import { initialStates as fallbackStates } from '@/data/game-data';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';


const CACHE_FILE_PATH = path.join(process.cwd(), '.tmp', 'state-data-cache.json');

interface CachedData {
  timestamp: number;
  states: State[];
}

// --- Firestore Integration ---
// This function now fetches data from Firestore and populates it if it's empty.

async function fetchStatesFromFirestore(): Promise<State[] | null> {
  try {
    const statesCollection = collection(db, 'states');
    const snapshot = await getDocs(statesCollection);
    
    if (snapshot.empty) {
      console.log('No states found in Firestore. Populating with initial data.');
      // Populate Firestore with the fallback data
      const populatedStates = fallbackStates.map(state => {
          if (!state.politicalClimate) {
              state.politicalClimate = `The political situation in ${state.name} is complex, with various factions vying for power.`;
          }
          return state;
      });

      for (const state of populatedStates) {
        await setDoc(doc(db, 'states', state.id), state);
      }
      console.log('Firestore populated with initial state data.');
      return populatedStates;
    }

    const states = snapshot.docs.map(doc => doc.data() as State);
    return states;
  } catch (error) {
    console.error("Error fetching or populating states from Firestore:", error);
    // This might happen if Firestore isn't set up yet or due to permissions.
    return null;
  }
}


async function readCache(): Promise<CachedData | null> {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE_PATH), { recursive: true });
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
    return JSON.parse(data) as CachedData;
  } catch (error) {
    if (error instanceof Error && 'code' in error && 'code' in error && error.code === 'ENOENT') {
        console.warn("Cache file not found, will use fallback data.");
        return null;
    }
    console.error('Error reading cache:', error);
    return null;
  }
}

export async function getStatesData(): Promise<State[]> {
  
  // STEP 1: Use Firestore
  const firestoreStates = await fetchStatesFromFirestore();
  if (firestoreStates) {
    console.log("Using data from Firestore.");
    return firestoreStates;
  }
  console.log("Could not fetch from Firestore, falling back to local cache/static data.");
  

  // Fallback 1: Read from local file cache
  const cachedData = await readCache();

  if (cachedData?.states) {
    console.log('Using cached state data.');
    return cachedData.states;
  }

  // Fallback 2: Use static data if cache is empty or fails to load
  console.log('Using fallback static state data.');
  return fallbackStates.map(state => {
    if (!state.politicalClimate) {
        state.politicalClimate = `The political situation in ${state.name} is complex, with various factions vying for power.`;
    }
    return state;
  });
}
