// src/services/state-data-service.ts
'use server';

import type { State } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { fetchStateData } from '@/ai/flows/state-data-fetcher';
import { initialStates } from '@/data/game-data';

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

async function needsUpdate(): Promise<boolean> {
  try {
    const metadataDocRef = doc(db, 'metadata', 'states');
    const docSnap = await getDoc(metadataDocRef);

    if (!docSnap.exists()) {
      console.log('No metadata found, update is needed.');
      return true; // No timestamp, so we need to fetch.
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

async function updateStateDataInFirestore(): Promise<State[]> {
  console.log('Starting to update state data in Firestore...');
  const updatedStates: State[] = [];
  const batch = writeBatch(db);

  for (const staticState of initialStates) {
    try {
      console.log(`Fetching latest data for ${staticState.name}...`);
      const dynamicData = await fetchStateData({ stateName: staticState.name });
      
      const newState: State = {
        ...staticState,
        demographics: {
          population: dynamicData.population,
          gdp: dynamicData.gdp,
          literacyRate: dynamicData.literacyRate,
          crimeRate: dynamicData.crimeRate,
        },
        politicalClimate: dynamicData.politicalClimate,
      };
      
      const stateDocRef = doc(db, 'states', newState.id);
      batch.set(stateDocRef, newState);
      updatedStates.push(newState);

    } catch (error) {
        console.error(`Failed to fetch or update data for ${staticState.name}. Using fallback static data.`, error);
        // Fallback: use the static data if AI fetch fails
        const fallbackState: State = {
            ...staticState,
            demographics: { // Use placeholder data for demographics
                population: 0,
                gdp: 0,
                literacyRate: 0,
                crimeRate: 0,
            },
            politicalClimate: "Could not fetch latest data.",
        };
        const stateDocRef = doc(db, 'states', fallbackState.id);
        batch.set(stateDocRef, fallbackState);
        updatedStates.push(fallbackState); // Still add it to the list
    }
  }
  
  if (updatedStates.length > 0) {
      const metadataDocRef = doc(db, 'metadata', 'states');
      batch.set(metadataDocRef, { lastUpdated: new Date() });
      await batch.commit();
      console.log('Firestore state data and timestamp have been updated.');
  }

  return updatedStates;
}


export async function getStatesData(): Promise<State[]> {
    if (await needsUpdate()) {
        console.log("Update required. Fetching new data for all states.");
        return await updateStateDataInFirestore();
    }

    try {
        console.log("Data is fresh. Fetching existing state data from Firestore.");
        const statesCollection = collection(db, 'states');
        const snapshot = await getDocs(statesCollection);

        if (snapshot.empty || snapshot.docs.length < initialStates.length) {
            console.log('Firestore is empty or incomplete. Triggering a data population.');
            return await updateStateDataInFirestore();
        }

        return snapshot.docs.map(doc => doc.data() as State);
    } catch (error) {
        console.error("CRITICAL: Failed to read from Firestore. No data available.", error);
        return []; // Critical failure
    }
}
