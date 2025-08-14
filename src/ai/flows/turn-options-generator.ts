'use server';
/**
 * @fileOverview Generates a set of challenges and opportunities for a game turn.
 *
 * - generateTurnOptions - Generates 3-5 challenges for the player.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ChallengeSchema } from '@/lib/types';
import type { Challenge } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const TurnOptionsInputSchema = z.object({
  stateName: z.string(),
  turn: z.number(),
  currentStats: z.string().describe("The current state of the game as a JSON string."),
  politicalClimate: z.string(),
  statsHistory: z.string().describe("The stats from the last 3 turns as a JSON string."),
});

const TurnOptionsOutputSchema = z.object({
    challenges: z.array(z.object({
        title: z.string().describe("The title of the challenge or opportunity."),
        description: z.string().describe("A detailed description of the situation."),
        options: z.array(z.object({
            title: z.string().describe("A short, clear title for the policy option."),
            description: z.string().describe("A brief description of the action."),
        })).describe("An array of 2-3 possible actions the player can take."),
    })),
});


export async function generateTurnOptions(input: z.infer<typeof TurnOptionsInputSchema>): Promise<Challenge[]> {
  const result = await turnOptionsFlow(input);
  
  // The AI doesn't generate stable IDs, so we add them here.
  return result.challenges.map(challenge => ({
    id: uuidv4(),
    ...challenge,
    options: challenge.options.map(option => ({
      id: uuidv4(),
      ...option,
    })),
  }));
}

const turnOptionsPrompt = ai.definePrompt({
  name: 'turnOptionsPrompt',
  input: { schema: TurnOptionsInputSchema },
  output: { schema: TurnOptionsOutputSchema },
  prompt: `You are the Game Master for StateCraft, a political simulation game. Your task is to generate 3-5 distinct and realistic challenges or opportunities for the player, who is the Chief Minister of the Indian state of {{{stateName}}}. Each turn represents one quarter.

The challenges should be based on the current game state. They can be political, economic, or social issues. For each challenge, provide 2-3 distinct, actionable choices for the player.

CURRENT GAME STATE:
- Turn: {{{turn}}}
- State: {{{stateName}}}
- Political Climate: {{{politicalClimate}}}
- Current Stats: {{{currentStats}}}
- Recent History: {{{statsHistory}}}

INSTRUCTIONS:
1.  **Generate 3-5 Challenges**: Based on the current game state, create a list of challenges. These should feel like real issues a Chief Minister would face. Examples: "Rising unemployment in urban areas," "Farmer protests demanding loan waivers," "A neighboring state proposes a controversial water-sharing agreement," "A multinational corporation wants to set up a factory but requires environmental clearances."
2.  **Create Actionable Options**: For each challenge, provide 2-3 clear, distinct policy options. These should represent different approaches to the problem. For example, for farmer protests, the options could be "Negotiate with farm leaders," "Deploy police to clear protests," or "Announce a partial loan waiver."
3.  **Be Realistic and Diverse**: The challenges should reflect the complexities of Indian governance. Avoid generic or repetitive options. The options should have clear potential trade-offs that the main game simulation can later interpret.

OUTPUT FORMAT:
Return a single JSON object containing a 'challenges' array, matching the specified output schema.
`,
});

const turnOptionsFlow = ai.defineFlow(
  {
    name: 'turnOptionsFlow',
    inputSchema: TurnOptionsInputSchema,
    outputSchema: TurnOptionsOutputSchema,
  },
  async (input) => {
    const { output } = await turnOptionsPrompt(input);
    return output!;
  }
);
