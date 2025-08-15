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
const CACHE_PATH = path.join(process.cwd(), '.tmp', 'state-data-cache.json');

/**
 * Reads the state data from the local JSON cache file.
 * @returns {Promise<State[]>} - An array of states from the cache.
 */
async function getCachedStates(): Promise<State[]> {
    try {
        const fileContent = await fs.readFile(CACHE_PATH, 'utf-8');
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
 * Writes the current state data to the local JSON cache file.
 * @param {State[]} states - The array of states to cache.
 */
async function writeToCache(states: State[]): Promise<void> {
    try {
        await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
        await fs.writeFile(CACHE_PATH, JSON.stringify({ timestamp: Date.now(), states: states.map(serializeState) }, null, 2), 'utf-8');
    } catch (error) {
        console.error("Failed to write to state data cache:", error);
    }
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
 * Populates Firestore from scratch using the initial game data and enriching it with AI.
 * This is a critical, one-time operation when the database is empty.
 * @returns {Promise<State[]>}
 */
async function populateFirestoreFromScratch(): Promise<State[]> {
    console.log('Firestore is empty. Populating from source data...');
    const stateShells = initialStates;
    if (stateShells.length === 0) {
        console.error('CRITICAL: Firestore is empty and initialStates data is empty. Cannot start game.');
        return [];
    }

    const populatedStates: State[] = [];
    
    // Use Promise.allSettled to fetch all data without failing the entire process if one fetch fails.
    const results = await Promise.allSettled(
        stateShells.map(shell => fetchStateData({ stateName: shell.name }))
    );

    const batch = writeBatch(db);

    for (let i = 0; i < stateShells.length; i++) {
        const shell = stateShells[i];
        const result = results[i];
        let fullState: State;

        if (result.status === 'fulfilled') {
            const dynamicData = result.value;
            fullState = {
                ...shell,
                demographics: {
                    population: dynamicData.population,
                    gdp: dynamicData.gdp,
                    literacyRate: dynamicData.literacyRate,
                    crimeRate: dynamicData.crimeRate,
                },
                politicalClimate: dynamicData.politicalClimate,
                lastUpdated: Timestamp.now(),
            };
            console.log(`Successfully fetched data for ${shell.name}.`);
        } else {
            // If the AI fetch failed, create a state with placeholder data.
            // It will be updated on the next load because its `lastUpdated` will be old.
            console.error(`Failed to fetch initial data for ${shell.name}. It will be saved with placeholder data.`, result.reason);
            fullState = {
                ...shell,
                demographics: { population: 0, gdp: 0, literacyRate: 0, crimeRate: 0 },
                politicalClimate: 'Could not fetch latest data.',
                lastUpdated: Timestamp.fromMillis(0), // Set to a very old date to trigger update next time.
            };
        }
        
        const stateDocRef = doc(db, 'states', fullState.id);
        batch.set(stateDocRef, fullState);
        populatedStates.push(fullState);
    }

    try {
        await batch.commit();
        console.log(`Firestore has been populated with ${populatedStates.length} states.`);
        const serializableStates = populatedStates.map(serializeState);
        await writeToCache(serializableStates);
        return serializableStates.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("CRITICAL: Failed to commit the batch to Firestore.", error);
        return [];
    }
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
            console.log("Firestore is empty. Forcing repopulation from scratch.");
            // If the DB is empty, the cache is invalid. Delete it before repopulating.
            try {
                await fs.unlink(CACHE_PATH);
                console.log("Deleted stale cache file.");
            } catch (error: any) {
                if (error.code !== 'ENOENT') { // ENOENT means file doesn't exist, which is fine.
                    console.warn("Could not delete cache file:", error);
                }
            }
            return await populateFirestoreFromScratch();
        }
        
        let states = snapshot.docs.map(doc => doc.data() as State);
        const updatePromises: Promise<State>[] = [];
        const now = Date.now();

        for (const state of states) {
            const lastUpdated = state.lastUpdated?.toDate?.().getTime() || (state.lastUpdated as number) || 0;
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

            await writeToCache(states);

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
