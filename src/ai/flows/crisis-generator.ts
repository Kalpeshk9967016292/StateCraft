// src/ai/flows/crisis-generator.ts
'use server';

/**
 * @fileOverview Generates a random crisis event based on the current game state.
 *
 * - `generateCrisis` - A function that returns a new crisis.
 * - `CrisisGeneratorInput` - The input type for the generateCrisis function.
 * - `Crisis` - The return type (the crisis itself).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Crisis } from '@/lib/types';
import { CrisisSchema } from '@/lib/types';

const CrisisGeneratorInputSchema = z.object({
  currentState: z.string().describe('The current state of the game as a JSON string, including stats and political climate.'),
});
export type CrisisGeneratorInput = z.infer<typeof CrisisGeneratorInputSchema>;

export async function generateCrisis(input: CrisisGeneratorInput): Promise<Crisis> {
  return crisisGeneratorFlow(input);
}

const crisisGeneratorPrompt = ai.definePrompt({
  name: 'crisisGeneratorPrompt',
  input: {schema: CrisisGeneratorInputSchema},
  output: {schema: CrisisSchema},
  prompt: `You are a game master in a political simulation game. Your role is to introduce unexpected crises to make the game more challenging.

  Based on the current game state, create a realistic and challenging crisis. The crisis should be a direct or indirect consequence of the state's situation. For example, low public opinion could lead to protests, high unemployment could lead to riots, or a weak budget could trigger a financial crisis. Avoid generic events.

  Current game state:
  {{currentState}}

  Generate a crisis with a compelling title and a detailed description. The player will need to respond to this crisis by proposing a new law or policy. Your description should set the scene for their decision.
  
  Do not include any choices in your response. The player must come up with their own solution.`,
});

const crisisGeneratorFlow = ai.defineFlow(
  {
    name: 'crisisGeneratorFlow',
    inputSchema: CrisisGeneratorInputSchema,
    outputSchema: CrisisSchema,
  },
  async input => {
    const {output} = await crisisGeneratorPrompt(input);
    return output!;
  }
);
