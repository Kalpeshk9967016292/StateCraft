'use server';

/**
 * @fileOverview The main "Game Master" AI flow that processes a single turn of the game.
 *
 * - `processGameTurn` - A function that takes the current game state and player's action and returns the updated state.
 * - `GameTurnInput` - The input type for the processGameTurn function.
 * - `GameTurnOutput` - The return type for the processGameTurn function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
    StatsSchema,
    NewsHeadlineSchema,
    SocialMediaTrendSchema,
    OppositionStatementSchema,
    CrisisSchema,
} from '@/lib/types';


const GameTurnInputSchema = z.object({
  stateName: z.string(),
  turn: z.number(),
  currentStats: StatsSchema,
  politicalClimate: z.string(),
  playerAction: z.string().describe("The law, policy, or action the player has taken this turn."),
  statsHistory: z.array(z.object({
      turn: z.number(),
      stats: StatsSchema,
  })),
});
export type GameTurnInput = z.infer<typeof GameTurnInputSchema>;

const GameTurnPromptInputSchema = z.object({
  stateName: z.string(),
  turn: z.number(),
  currentStatsString: z.string(),
  politicalClimate: z.string(),
  playerAction: z.string(),
  statsHistoryString: z.string(),
});


const GameTurnOutputSchema = z.object({
  updatedStats: StatsSchema.describe("The new state statistics after the player's action."),
  keyEvents: z.string().describe("A summary of the key events and developments that occurred this turn as a result of the player's action."),
  newsHeadlines: z.array(NewsHeadlineSchema).describe("An array of 2-3 realistic news headlines from different media outlets (state, national, etc.)."),
  socialMediaTrends: z.array(SocialMediaTrendSchema).describe("An array of 1-2 social media trends with topics and sentiment."),
  oppositionStatement: OppositionStatementSchema.describe("A statement from a prominent opposition leader or party reacting to the player's move."),
  newCrisis: CrisisSchema.nullable().describe("A new random crisis event if one occurs, otherwise null. Crises can be natural disasters, scandals, policy failures, major protests, etc. Should be rare but impactful."),
});
export type GameTurnOutput = z.infer<typeof GameTurnOutputSchema>;

export async function processGameTurn(input: GameTurnInput): Promise<GameTurnOutput> {
  return gameTurnFlow(input);
}

const gameMasterPrompt = ai.definePrompt({
  name: 'gameMasterPrompt',
  input: {schema: GameTurnPromptInputSchema},
  output: {schema: GameTurnOutputSchema},
  prompt: `You are the Game Master for StateCraft, a political simulation game where the player is the Chief Minister of an Indian state. Your role is to act as a realistic simulation of politics, governance, the economy, and public sentiment.

GAME CONTEXT:
- Player: Chief Minister of {{{stateName}}}, India.
- Current Turn: {{{turn}}}
- Current State Stats: {{{currentStatsString}}}
- Political Situation: {{{politicalClimate}}}
- Player's Action This Turn: {{{playerAction}}}
- Recent History: The last few turns of stats were {{{statsHistoryString}}}
- Goal: Win re-election by maintaining economic stability, law & order, and public approval.

YOUR TASK:
Simulate the outcome of the player's action for this turn.
1.  **Calculate Effects & Update Stats**: Based on the player's action, calculate the short-term effects and update all state statistics (Budget, Public Opinion, Police Strength, Opposition Strength, Unemployment). The changes should be realistic. For example, a popular but expensive welfare scheme might increase public opinion but decrease the budget. A crackdown on protests might increase police strength perception but decrease public opinion.
2.  **Generate Realistic Feedback**: Create immersive in-game feedback based on the action.
    -   **Key Events**: Write a brief narrative summary of what happened this turn.
    -   **News Headlines**: Generate 2-3 diverse headlines from different types of media (e.g., national, local, pro-government, critical).
    -   **Social Media**: Come up with 1-2 trending topics on social media, reflecting public reaction.
    -   **Opposition Statement**: Write a plausible, critical statement from an opposition leader.
3.  **Introduce a Crisis (Optional)**: There is a small chance (around 15-20%) that a random event or crisis occurs. This could be a natural disaster, a corruption scandal, a major protest, etc. If no crisis occurs, return null for this field. The crisis should feel like a consequence of the game state or be a plausible random event.

RULES:
- Use realistic Indian political, cultural, and economic context.
- The opposition should react strategically. A popular move might be criticized for its cost; an unpopular one will be heavily attacked.
- Public reactions can be mixed and differ by demographic (rural, urban, etc.), which should be reflected in the media and social media trends.
- Do not make the game impossible, but it should be challenging.

OUTPUT FORMAT:
Return a single JSON object matching the specified output schema.`,
});

const gameTurnFlow = ai.defineFlow(
  {
    name: 'gameTurnFlow',
    inputSchema: GameTurnInputSchema,
    outputSchema: GameTurnOutputSchema,
  },
  async input => {
    const promptInput = {
      ...input,
      currentStatsString: JSON.stringify(input.currentStats),
      statsHistoryString: JSON.stringify(input.statsHistory),
    };
    
    // The prompt is powerful enough to do all the work in one go.
    const {output} = await gameMasterPrompt(promptInput);
    return output!;
  }
);
