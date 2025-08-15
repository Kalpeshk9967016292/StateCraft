// src/services/state-data-service.ts
'use server';

import type { State } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, writeBatch, Timestamp } from 'firebase/firestore';
import { fetchStateData } from '@/ai/flows/state-data-fetcher';
import { initialStates } from '@/data/game-data';
import fs from 'fs/promises';
import path from 'path';

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

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
            // When reading from cache, the timestamp is already a plain number, so no conversion needed.
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
 * Converts Firestore Timestamp objects in a state object to serializable numbers.
 * @param {State} state - The state object with a potential Timestamp.
 * @returns {State} - The state object with the timestamp converted.
 */
function serializeState(state: State): State {
    if (state.lastUpdated && typeof state.lastUpdated.toDate === 'function') {
        return {
            ...state,
            lastUpdated: state.lastUpdated.toDate().getTime(),
        };
    }
    return state;
}


/**
 * Fetches fresh data for a single state using AI and updates it in Firestore.
 * @param {State} state - The state object to update.
 * @returns {Promise<State>} - The newly updated state.
 */
async function updateSingleState(state: State): Promise<State> {
    console.log(`Updating data for ${state.name}...`);
    try {
        const dynamicData = await fetchStateData({ stateName: state.name });
        const updatedState: State = {
            ...state,
            demographics: {
                population: dynamicData.population,
                gdp: dynamicData.gdp,
                literacyRate: dynamicData.literacyRate,
                crimeRate: dynamicData.crimeRate,
            },
            politicalClimate: dynamicData.politicalClimate,
            lastUpdated: Timestamp.now(),
        };
        const stateDocRef = doc(db, 'states', updatedState.id);
        await setDoc(stateDocRef, updatedState);
        console.log(`Successfully updated ${state.name}.`);
        return serializeState(updatedState);
    } catch (error) {
        console.error(`AI fetch failed for ${state.name}. Data will remain stale.`, error);
        // Return original state (serialized) if update fails
        return serializeState(state);
    }
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
    const populatedStates: State[] = [];
    const updatePromises: Promise<State>[] = [];

    for (const cachedState of cachedStates) {
        // If demographics are missing/zero, queue an immediate AI fetch.
        if (!cachedState.demographics || cachedState.demographics.population === 0 || cachedState.demographics.gdp === 0) {
             console.log(`Cached data for ${cachedState.name} is incomplete. Fetching fresh data...`);
             // We pass the shell of the state to be filled by the AI
             updatePromises.push(updateSingleState(cachedState));
        } else {
            const stateWithTimestamp = {
                ...cachedState,
                lastUpdated: Timestamp.now()
            };
            const stateDocRef = doc(db, 'states', cachedState.id);
            batch.set(stateDocRef, stateWithTimestamp);
            populatedStates.push(serializeState(stateWithTimestamp));
        }
    }
    
    await batch.commit();

     if (updatePromises.length > 0) {
        const freshlyFetchedStates = await Promise.all(updatePromises);
        populatedStates.push(...freshlyFetchedStates); // Already serialized
    }

    console.log(`Firestore has been populated with ${populatedStates.length} states.`);
    return populatedStates.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * The main data fetching service for the application.
 * It fetches from Firestore and triggers updates for stale documents.
 * @returns {Promise<State[]>}
 */
export async function getStatesData(): Promise<State[]> {
    try {
        const statesCollection = collection(db, 'states');
        const snapshot = await getDocs(statesCollection);

        if (snapshot.empty) {
            console.log("Firestore is empty, populating from source.");
            return await populateFirestoreFromCache();
        }
        
        let states = snapshot.docs.map(doc => doc.data() as State);
        const updatePromises: Promise<State>[] = [];
        const now = Date.now();

        for (const state of states) {
            const lastUpdated = state.lastUpdated?.toDate()?.getTime();
            if (!lastUpdated || (now - lastUpdated > TWO_DAYS_IN_MS)) {
                console.log(`Data for ${state.name} is stale or missing timestamp. Queuing for update.`);
                updatePromises.push(updateSingleState(state));
            }
        }

        if (updatePromises.length > 0) {
            console.log(`Updating ${updatePromises.length} stale states...`);
            const updatedStates = await Promise.all(updatePromises);
            
            // Create a map of updated states by ID for easy lookup
            const updatedStatesMap = new Map(updatedStates.map(s => [s.id, s]));

            // Merge updated states back into the main list, ensuring all are serialized
            states = states.map(s => serializeState(updatedStatesMap.get(s.id) || s));
            console.log("State updates complete.");
        } else {
            console.log("All state data is fresh. No updates needed.");
            // Ensure all states are serialized even if no updates were needed.
            states = states.map(serializeState);
        }

        return states.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("CRITICAL: Could not connect to Firestore. Falling back to local cache.", error);
        return getCachedStates();
    }
}
