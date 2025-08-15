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
    GameTurnOutputSchema,
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

export type GameTurnOutput = z.infer<typeof GameTurnOutputSchema>;

export async function processGameTurn(input: GameTurnInput): Promise<GameTurnOutput> {
  return gameTurnFlow(input);
}

const gameMasterPrompt = ai.definePrompt({
  name: 'gameMasterPrompt',
  input: {schema: GameTurnPromptInputSchema},
  output: {schema: GameTurnOutputSchema},
  prompt: `You are the Game Master for StateCraft, a political simulation game where the player is the Chief Minister of an Indian state. Your role is to act as a realistic simulation of politics, governance, the economy, and public sentiment. Each turn represents one quarter (3 months).

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
1.  **Analyze the Action & Its Nuances**:
    -   **Demographic Impact**: How will different groups react? (e.g., a new factory might excite urban youth but anger farmers who lose land). Consider rural, urban, business owners, minorities, etc.
    -   **Opposition's Strategy**: The opposition is not a monolith. They will strategically react. A popular move might be criticized for its cost or implementation details. An unpopular move will be heavily attacked.
    -   **Bureaucratic Reality**: Implementation isn't instant. A complex policy might face bureaucratic delays or inefficiencies, slightly reducing its immediate impact.
2.  **Calculate Effects & Update Stats**: Based on the nuanced analysis above, calculate both the short-term (this quarter) and potential long-term (1-2 years) effects. Update all state statistics (Budget, Revenue, Public Approval, Law & Order, Economic Health, Opposition Strength, Corruption Level).
    -   *Example Logic*: Cutting fuel taxes might give a +7% boost to Public Approval with urban voters and +3% with rural voters, but it will reduce monthly revenue, leading to a significant drop in the Budget stat. The opposition will praise the relief for citizens but attack the fiscal irresponsibility.
3.  **Check for Game Over Scenarios**: After updating stats, check if a game-ending condition is met. One key scenario is a political coup. This should be a RARE but dramatic event. If Opposition Strength is very high (e.g., > 75) and Public Approval is very low (e.g., < 30), the opposition may conspire to cause defections from your party, leading to a collapse of your government. Only trigger this in extreme circumstances. If a coup or another game-ending event occurs, set 'isGameOver' to true and provide a compelling 'gameOverReason'.
4.  **Generate Realistic Feedback**: Create immersive in-game feedback based on the action.
    -   **Key Events**: Write a brief narrative summary of what happened this turn, reflecting the nuanced analysis.
    -   **News Headlines**: Generate 2-3 diverse headlines from different types of media (e.g., national, local, pro-government, critical).
    -   **Social Media**: Come up with 1-2 trending topics on social media, reflecting the mixed public reaction.
    -   **Opposition Statement**: Write a plausible, critical statement from an opposition leader based on their strategy.
5.  **Introduce a Crisis (Optional)**: If the game is not over, there is a small chance (around 15-20%) that a random event or crisis occurs. This could be a natural disaster, a corruption scandal, a major protest, etc. If no crisis occurs, return null for this field. The crisis should feel like a consequence of the game state or be a plausible random event.

RULES:
- Use realistic Indian political, cultural, and economic context.
- Public reactions can be mixed and differ by demographic, which should be reflected in the media and social media trends.
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
