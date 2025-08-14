'use server';

/**
 * @fileOverview Fetches simulated real-time data for a given state.
 *
 * - `fetchStateData` - A function that returns demographic and political data for a state.
 * - `FetchStateDataInput` - The input type for the fetchStateData function.
 * - `FetchStateDataOutput` - The return type for the fetchStateData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchStateDataInputSchema = z.object({
  stateName: z.string().describe('The name of the Indian state.'),
});
export type FetchStateDataInput = z.infer<typeof FetchStateDataInputSchema>;

const FetchStateDataOutputSchema = z.object({
  population: z.number().describe('The total population of the state.'),
  gdp: z.number().describe('The Gross Domestic Product of the state in INR.'),
  literacyRate: z.number().describe('The literacy rate of the state as a percentage.'),
  crimeRate: z.number().describe('The crime rate per 100,000 population.'),
  politicalClimate: z.string().describe('A brief summary of the current political climate, key issues, and voter concerns.'),
});
export type FetchStateDataOutput = z.infer<typeof FetchStateDataOutputSchema>;

export async function fetchStateData(input: FetchStateDataInput): Promise<FetchStateDataOutput> {
  return fetchStateDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fetchStateDataPrompt',
  input: {schema: FetchStateDataInputSchema},
  output: {schema: FetchStateDataOutputSchema},
  prompt: `You are a data provider API. Your task is to return the latest, realistic, real-world data for the Indian state of {{{stateName}}}.
  
  Provide the following information:
  - Population
  - GDP (in INR)
  - Literacy Rate (%)
  - Crime Rate (per 100,000 population)
  - A short, realistic summary of the current political climate.

  Return the data in the specified JSON format.
  `,
});

const fetchStateDataFlow = ai.defineFlow(
  {
    name: 'fetchStateDataFlow',
    inputSchema: FetchStateDataInputSchema,
    outputSchema: FetchStateDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
