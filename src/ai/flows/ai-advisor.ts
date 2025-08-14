// src/ai/flows/ai-advisor.ts
'use server';

/**
 * @fileOverview Provides AI-driven advice or suggestions based on the current game state.
 *
 * - `getAiAdvice` -  A function that gets AI advice based on the current state.
 * - `AiAdvisorInput` - The input type for the getAiAdvice function.
 * - `AiAdvisorOutput` - The return type for the getAiAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAdvisorInputSchema = z.object({
  gameState: z.string().describe('The current state of the game as a JSON string.'),
  playerInquiry: z.string().describe('The player\s specific question or request for advice.'),
});
export type AiAdvisorInput = z.infer<typeof AiAdvisorInputSchema>;

const AiAdvisorOutputSchema = z.object({
  advice: z.string().describe('The AI advisor\'s suggested action.'),
  reasoning: z.string().describe('The AI\'s reasoning behind the suggested action.'),
});
export type AiAdvisorOutput = z.infer<typeof AiAdvisorOutputSchema>;

export async function getAiAdvice(input: AiAdvisorInput): Promise<AiAdvisorOutput> {
  return aiAdvisorFlow(input);
}

const aiAdvisorPrompt = ai.definePrompt({
  name: 'aiAdvisorPrompt',
  input: {schema: AiAdvisorInputSchema},
  output: {schema: AiAdvisorOutputSchema},
  prompt: `You are a seasoned political advisor, offering strategic guidance based on the current state of the game.

  The current game state is as follows:
  {{gameState}}

  The player is asking for advice on the following:
  {{playerInquiry}}

  Based on this information, provide actionable advice, explain your reasoning, and set the advice field appropriately.`,  
});

const aiAdvisorFlow = ai.defineFlow(
  {
    name: 'aiAdvisorFlow',
    inputSchema: AiAdvisorInputSchema,
    outputSchema: AiAdvisorOutputSchema,
  },
  async input => {
    const {output} = await aiAdvisorPrompt(input);
    return output!;
  }
);
