// src/services/state-data-service.ts
'use server';

import type { State } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
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

  for (const staticState of initialStates) {
    try {
      console.log(`Fetching latest data for ${staticState.name}...`);
      const dynamicData = await fetchStateData({ stateName: staticState.name });
      
      const newState: State = {
        ...staticState, // Start with the base static data (id, description, initialStats)
        demographics: { // Overwrite demographics with fresh data
          population: dynamicData.population,
          gdp: dynamicData.gdp,
          literacyRate: dynamicData.literacyRate,
          crimeRate: dynamicData.crimeRate,
        },
        politicalClimate: dynamicData.politicalClimate,
      };

      await setDoc(doc(db, 'states', newState.id), newState);
      updatedStates.push(newState);

    } catch (error) {
        console.error(`Failed to fetch or update data for ${staticState.name}. It will be skipped.`, error);
    }
  }
  
  if (updatedStates.length > 0) {
      const metadataDocRef = doc(db, 'metadata', 'states');
      await setDoc(metadataDocRef, { lastUpdated: new Date() });
      console.log('Firestore state data and timestamp have been updated.');
  }

  return updatedStates;
}


export async function getStatesData(): Promise<State[]> {
    if (await needsUpdate()) {
        const states = await updateStateDataInFirestore();
        // If the update fails for some reason and returns no states,
        // we try to read whatever is in the DB as a fallback.
        if (states.length > 0) {
            return states;
        }
    }

    // If data is fresh or update failed, read existing data from Firestore.
    try {
        console.log("Fetching existing state data from Firestore.");
        const statesCollection = collection(db, 'states');
        const snapshot = await getDocs(statesCollection);

        if (snapshot.empty) {
            // This should now only happen if the initial population also failed.
            console.log('Firestore is empty. Triggering an initial data population.');
            return await updateStateDataInFirestore();
        }

        return snapshot.docs.map(doc => doc.data() as State);
    } catch (error) {
        console.error("CRITICAL: Failed to read from Firestore and update failed. No data available.", error);
        return []; // Critical failure
    }
}
