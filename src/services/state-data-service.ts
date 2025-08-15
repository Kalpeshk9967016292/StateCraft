// src/services/state-data-service.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { State } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';


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
    if (error instanceof Error && 'code' in error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn("Cache file not found, will use fallback data.");
        return null;
    }
    console.error('Error reading cache:', error);
    return null;
  }
}

// --- Firestore Integration ---
async function fetchStatesFromFirestore(): Promise<State[] | null> {
  try {
    const statesCollection = collection(db, 'states');
    const snapshot = await getDocs(statesCollection);
    
    if (snapshot.empty) {
      console.log('No states found in Firestore. Populating with initial data from cache file...');
      
      // Read from the rich cache file to populate firestore
      const cachedData = await readCache();
      const statesToPopulate = cachedData?.states;

      if (!statesToPopulate || statesToPopulate.length === 0) {
        console.error("Cache is empty. Cannot populate Firestore.");
        return null;
      }

      for (const state of statesToPopulate) {
        // Ensure political climate has a default value if missing
        if (!state.politicalClimate) {
            state.politicalClimate = `The political situation in ${state.name} is complex, with various factions vying for power.`;
        }
        await setDoc(doc(db, 'states', state.id), state);
      }
      console.log('Firestore populated with initial state data from cache.');
      return statesToPopulate;
    }

    const states = snapshot.docs.map(doc => doc.data() as State);
    return states;
  } catch (error) {
    console.error("Error fetching or populating states from Firestore:", error);
    // This might happen if Firestore isn't set up yet or due to permissions.
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
  
  // Fallback: Read from local file cache if Firestore fails for any reason other than being empty
  const cachedData = await readCache();
  if (cachedData?.states) {
    console.log('Using cached state data as a final fallback.');
    return cachedData.states;
  }

  // Absolute fallback - should not be reached if cache exists
  console.error("CRITICAL: Firestore and local cache failed. No data available to start game.");
  return [];
}
