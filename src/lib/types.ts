import { z } from 'zod';

export interface State {
  id: string;
  name: string;
  description: string;
  demographics: {
    population: number;
    gdp: number;
    literacyRate: number;
    crimeRate: number;
  };
  initialStats: Stats;
  politicalClimate: string;
  lastUpdated?: any; // Firestore Timestamp
}

export const StatsSchema = z.object({
  budget: z.number().describe("in ₹ crore, represents the state's available funds."),
  revenue: z.number().describe("in ₹ crore, represents the state's income."),
  publicApproval: z.number().describe("0-100%, public's approval of the player's performance."),
  lawAndOrder: z.number().describe("0-100%, represents the stability and safety in the state."),
  economicHealth: z.number().describe("0-100%, represents the overall health of the state's economy."),
  oppositionStrength: z.number().describe("0-100%, represents the influence and power of the opposition."),
  corruptionLevel: z.number().describe("0-100% (lower is better), represents the perceived level of corruption."),
});
export type Stats = z.infer<typeof StatsSchema>;

export const PolicyOptionSchema = z.object({
  id: z.string(),
  title: z.string().describe("A short, clear title for the policy option."),
  description: z.string().describe("A brief description of the action."),
});
export type PolicyOption = z.infer<typeof PolicyOptionSchema>;

export const ChallengeSchema = z.object({
  id: z.string(),
  title: z.string().describe("The title of the challenge or opportunity."),
  description: z.string().describe("A detailed description of the situation."),
  options: z.array(PolicyOptionSchema).describe("An array of 2-3 possible actions the player can take."),
});
export type Challenge = z.infer<typeof ChallengeSchema>;

export const CrisisSchema = z.object({
    title: z.string().describe('The title of the crisis event.'),
    description: z.string().describe('A detailed description of the crisis, explaining what is happening and why.'),
});
export type CrisisEvent = z.infer<typeof CrisisSchema>;

export const NewsHeadlineSchema = z.object({
  source: z.string().describe("The name of the news publication (e.g., 'The Times of India', 'State Times')."),
  headline: z.string().describe("The news headline."),
});
export type NewsHeadline = z.infer<typeof NewsHeadlineSchema>;

export const SocialMediaTrendSchema = z.object({
  platform: z.string().describe("The social media platform (e.g., 'Twitter', 'Facebook')."),
  topic: z.string().describe("The trending topic or hashtag."),
  sentiment: z.enum(['Positive', 'Negative', 'Mixed']).describe("The overall sentiment of the trend."),
});
export type SocialMediaTrend = z.infer<typeof SocialMediaTrendSchema>;

export const OppositionStatementSchema = z.object({
  speaker: z.string().describe("The name of the opposition leader or party making the statement."),
  statement: z.string().describe("The content of the opposition's statement."),
});
export type OppositionStatement = z.infer<typeof OppositionStatementSchema>;

export const GameTurnOutputSchema = z.object({
  updatedStats: StatsSchema.describe("The state's statistics after the player's action."),
  keyEvents: z.string().describe("A summary of the key events that occurred this turn as a result of the player's action."),
  newsHeadlines: z.array(NewsHeadlineSchema).describe("A list of generated news headlines."),
  socialMediaTrends: z.array(SocialMediaTrendSchema).describe("A list of generated social media trends."),
  oppositionStatement: OppositionStatementSchema.nullable().describe("A statement from the opposition, or null if they are silent."),
  newCrisis: CrisisSchema.nullable().describe("A new crisis that has emerged this turn, or null if none."),
  isGameOver: z.boolean().describe("Set to true if a game-ending condition has been met."),
  gameOverReason: z.string().nullable().describe("The reason for the game ending, or null if the game is not over."),
});

export interface GameState {
  stateDetails: State;
  currentStats: Stats;
  statsHistory: { turn: number; stats: Stats }[];
  turn: number;
  isGameOver: boolean;
  gameOverReason: string;
  lastEventMessage: string;
  currentCrisis: CrisisEvent | null;
  newsHeadlines: NewsHeadline[];
  socialMediaTrends: SocialMediaTrend[];
  oppositionStatement: OppositionStatement | null;
  turnOptions: Challenge[];
}
