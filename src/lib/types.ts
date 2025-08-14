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
}

export interface Stats {
  budget: number; // 0-100 scale, represents fiscal health
  publicOpinion: number; // 0-100
  policeStrength: number; // 0-100
  oppositionStrength: number; // 0-100
  unemploymentRate: number; // 0-100 (lower is better)
}

export interface PolicyDecision {
  id: string;
  title: string;
  description: string;
}

export const CrisisSchema = z.object({
    title: z.string().describe('The title of the crisis event.'),
    description: z.string().describe('A detailed description of the crisis, explaining what is happening and why.'),
});
export type CrisisEvent = z.infer<typeof CrisisSchema>;

export interface GameState {
  stateDetails: State;
  currentStats: Stats;
  statsHistory: { turn: number; stats: Stats }[];
  turn: number;
  isGameOver: boolean;
  gameOverReason: string;
  lastEventMessage: string;
  currentCrisis: CrisisEvent | null;
}
