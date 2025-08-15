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
 * @param {Omit<State, 'demographics' | 'politicalClimate'>} stateShell - The base state object to update.
 * @returns {Promise<State>} - The newly updated state.
 */
async function updateSingleState(stateShell: Omit<State, 'demographics' | 'politicalClimate' | 'lastUpdated'>): Promise<State> {
    console.log(`Updating data for ${stateShell.name}...`);
    try {
        const dynamicData = await fetchStateData({ stateName: stateShell.name });
        const updatedState: State = {
            ...stateShell,
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
        console.log(`Successfully updated ${stateShell.name}.`);
        return serializeState(updatedState);
    } catch (error) {
        console.error(`AI fetch failed for ${stateShell.name}. Data will remain stale.`, error);
        // Return a shell state if update fails, which will be retried on next load
        const fallbackState: State = {
             ...stateShell,
             demographics: { population: 0, gdp: 0, literacyRate: 0, crimeRate: 0 },
             politicalClimate: 'Could not fetch latest data.',
             lastUpdated: Timestamp.fromMillis(0)
        }
        return serializeState(fallbackState);
    }
}


/**
 * Populates Firestore from the local cache file if the database is empty.
 * @returns {Promise<State[]>}
 */
async function populateFirestoreFromCache(): Promise<State[]> {
    console.log('Firestore is empty. Populating from source data...');
    const cachedStates = initialStates;
    if (cachedStates.length === 0) {
        console.error('CRITICAL: Firestore is empty and initialStates data is empty. Cannot start game.');
        return [];
    }

    const updatePromises: Promise<State>[] = [];

    // All states are fetched on first go now to ensure data integrity
    for (const stateShell of cachedStates) {
        updatePromises.push(updateSingleState(stateShell));
    }
    
    const populatedStates = await Promise.all(updatePromises);
    
    const cachePath = path.join(process.cwd(), '.tmp', 'state-data-cache.json');
    await fs.mkdir(path.dirname(cachePath), { recursive: true });
    await fs.writeFile(cachePath, JSON.stringify({ timestamp: Date.now(), states: populatedStates }, null, 2), 'utf-8');
    
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
            const lastUpdated = state.lastUpdated?.toDate?.()?.getTime() || state.lastUpdated as number || 0;
            const isStale = !lastUpdated || (now - lastUpdated > TWO_DAYS_IN_MS);
            const isDataMissing = !state.demographics || state.demographics.population === 0;

            if (isStale || isDataMissing) {
                if (isDataMissing) console.log(`Data for ${state.name} is missing. Queuing for immediate update.`);
                else console.log(`Data for ${state.name} is stale. Queuing for update.`);
                
                updatePromises.push(updateSingleState(state));
            }
        }

        if (updatePromises.length > 0) {
            console.log(`Updating ${updatePromises.length} states...`);
            const updatedStates = await Promise.all(updatePromises);
            
            const updatedStatesMap = new Map(updatedStates.map(s => [s.id, s]));

            states = states.map(s => serializeState(updatedStatesMap.get(s.id) || s));
            console.log("State updates complete.");

            const cachePath = path.join(process.cwd(), '.tmp', 'state-data-cache.json');
            await fs.mkdir(path.dirname(cachePath), { recursive: true });
            await fs.writeFile(cachePath, JSON.stringify({ timestamp: Date.now(), states: states }, null, 2), 'utf-8');

        } else {
            console.log("All state data is fresh. No updates needed.");
            states = states.map(serializeState);
        }

        return states.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("CRITICAL: Could not connect to Firestore. Falling back to local cache.", error);
        return getCachedStates();
    }
}

    