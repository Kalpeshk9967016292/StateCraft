// src/services/state-data-service.ts
'use server';

import type { State } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { fetchStateData } from '@/ai/flows/state-data-fetcher';
import { initialStates } from '@/data/game-data';
import fs from 'fs/promises';
import path from 'path';

// This is a temporary solution to prevent the AI from running on every startup.
// In a real app, this would be a scheduled job.
const USE_AI_DATA_FETCHER = false; 
const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * Checks if the Firestore data is stale and needs to be updated.
 * @returns {Promise<boolean>} - True if an update is needed.
 */
async function needsUpdate(): Promise<boolean> {
  if (!USE_AI_DATA_FETCHER) return false;
  
  try {
    const metadataDocRef = doc(db, 'metadata', 'states');
    const docSnap = await getDoc(metadataDocRef);

    if (!docSnap.exists()) {
      console.log('No metadata found, update is needed.');
      return true;
    }

    const lastUpdated = docSnap.data().lastUpdated?.toDate();
    if (!lastUpdated) {
        console.log('Metadata exists but lastUpdated field is missing, update is needed.');
        return true;
    }

    const isStale = (new Date().getTime() - lastUpdated.getTime()) > TWO_DAYS_IN_MS;
    console.log(isStale ? "Data is stale, update is needed." : "Data is fresh.");
    return isStale;

  } catch (error) {
    console.error("Error checking metadata for update:", error);
    return true; // Assume update is needed on error.
  }
}

/**
 * Reads the state data from the local JSON cache file.
 * @returns {Promise<State[]>} - An array of states from the cache.
 */
async function getCachedStates(): Promise<State[]> {
    const cachePath = path.join(process.cwd(), '.tmp', 'state-data-cache.json');
    try {
        const fileContent = await fs.readFile(cachePath, 'utf-8');
        const cacheData = JSON.parse(fileContent);
        if (cacheData.states && cacheData.states.length > 0) {
            return cacheData.states;
        }
        return [];
    } catch (error) {
        // This is not a critical error, cache might not exist on first run.
        console.warn("Could not read state data cache:", error);
        return [];
    }
}

/**
 * Fetches fresh data using the AI and updates Firestore.
 * This function is expensive and should be used sparingly.
 * @returns {Promise<State[]>} - The newly fetched states.
 */
async function updateStateDataInFirestore(): Promise<State[]> {
  console.log('Starting to update state data in Firestore using AI...');
  const updatedStates: State[] = [];
  const batch = writeBatch(db);
  
  // Use the rich cache as the primary source for fallbacks
  const cachedStates = await getCachedStates();
  const cachedStatesMap = new Map(cachedStates.map(s => [s.id, s]));

  for (const staticState of initialStates) {
    let finalState: State | undefined;
    try {
      console.log(`Fetching latest data for ${staticState.name}...`);
      const dynamicData = await fetchStateData({ stateName: staticState.name });
      
      finalState = {
        ...staticState,
        demographics: {
          population: dynamicData.population,
          gdp: dynamicData.gdp,
          literacyRate: dynamicData.literacyRate,
          crimeRate: dynamicData.crimeRate,
        },
        politicalClimate: dynamicData.politicalClimate,
      };

    } catch (error) {
        console.error(`AI fetch failed for ${staticState.name}. Using fallback cache data.`, error);
        finalState = cachedStatesMap.get(staticState.id);
    }
    
    // If we have a state to write (either from AI or cache), add it to the batch.
    if (finalState) {
        const stateDocRef = doc(db, 'states', finalState.id);
        batch.set(stateDocRef, finalState);
        updatedStates.push(finalState);
    } else {
        console.error(`CRITICAL: No data found for ${staticState.name} in AI or cache.`);
    }
  }
  
  if (updatedStates.length > 0) {
      const metadataDocRef = doc(db, 'metadata', 'states');
      batch.set(metadataDocRef, { lastUpdated: new Date() });
      await batch.commit();
      console.log(`Firestore state data updated for ${updatedStates.length} states.`);
  }

  return updatedStates;
}


/**
 * Populates Firestore from the local cache file if the database is empty.
 * @returns {Promise<State[]>}
 */
async function populateFirestoreFromCache(): Promise<State[]> {
    console.log('Firestore is empty. Populating from local cache file...');
    const cachedStates = await getCachedStates();
    if (cachedStates.length === 0) {
        console.error('CRITICAL: Firestore is empty and local cache is empty. Cannot start game.');
        return [];
    }

    const batch = writeBatch(db);
    cachedStates.forEach(state => {
        const stateDocRef = doc(db, 'states', state.id);
        batch.set(stateDocRef, state);
    });
    
    const metadataDocRef = doc(db, 'metadata', 'states');
    batch.set(metadataDocRef, { lastUpdated: new Date() });
    
    await batch.commit();
    console.log('Firestore has been populated from cache.');
    return cachedStates;
}


/**
 * The main data fetching service for the application.
 * It orchestrates fetching from Firestore, updating from AI, and using local cache.
 * @returns {Promise<State[]>}
 */
export async function getStatesData(): Promise<State[]> {
    try {
        const needsAiUpdate = await needsUpdate();
        if (needsAiUpdate) {
            console.log("Data is stale. Fetching fresh data from AI.");
            return await updateStateDataInFirestore();
        }

        console.log("Data is fresh. Fetching existing state data from Firestore.");
        const statesCollection = collection(db, 'states');
        const snapshot = await getDocs(statesCollection);

        if (snapshot.empty) {
            return await populateFirestoreFromCache();
        }
        
        const states = snapshot.docs.map(doc => doc.data() as State);

        if (states.length < initialStates.length) {
            console.log('Firestore is incomplete. Triggering data population.');
            return await populateFirestoreFromCache();
        }

        return states.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("CRITICAL: Could not connect to Firestore. Falling back to local cache.", error);
        return getCachedStates();
    }
}
