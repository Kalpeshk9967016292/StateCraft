'use server';

import { calculatePolicyOutcomes } from '@/ai/flows/outcome-calculation';
import { getAiAdvice as getAiAdviceFlow } from '@/ai/flows/ai-advisor';
import { generateCrisis } from '@/ai/flows/crisis-generator';
import { GameState, PolicyDecision, Stats, CrisisEvent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

function applyChanges(currentValue: number, change: number): number {
  return Math.max(0, Math.min(100, currentValue + change));
}

export async function handleDecision(
  gameState: GameState,
  decision: PolicyDecision
): Promise<GameState> {
  const currentStateString = JSON.stringify({
    stats: gameState.currentStats,
    politicalClimate: gameState.stateDetails.politicalClimate,
  });

  try {
    const outcomes = await calculatePolicyOutcomes({
      decision: `${decision.title}: ${decision.description}`,
      currentState: currentStateString,
    });

    const newStats: Stats = {
      budget: applyChanges(gameState.currentStats.budget, outcomes.budgetChange),
      publicOpinion: applyChanges(gameState.currentStats.publicOpinion, outcomes.approvalRatingChange),
      policeStrength: applyChanges(gameState.currentStats.policeStrength, outcomes.lawAndOrderChange),
      oppositionStrength: applyChanges(gameState.currentStats.oppositionStrength, outcomes.oppositionMoraleChange),
      // For now, unemployment is a metric not directly affected by single decisions in this model
      unemploymentRate: gameState.currentStats.unemploymentRate,
    };

    const newHistory = [...gameState.statsHistory, { turn: gameState.turn + 1, stats: newStats }];
    
    let isGameOver = false;
    let gameOverReason = "";

    if (newStats.publicOpinion <= 10) {
        isGameOver = true;
        gameOverReason = "Public opinion has plummeted, leading to mass protests and a vote of no confidence. Your government has fallen.";
    } else if (newStats.budget <= 5) {
        isGameOver = true;
        gameOverReason = "The state is bankrupt. With no funds to run the administration, your government has been dismissed.";
    }

    // After a decision, check for a new crisis
    let newCrisis: CrisisEvent | null = null;
    // Let's say there's a 30% chance of a crisis after turn 3
    if (!isGameOver && gameState.turn > 2 && Math.random() < 0.3) {
      try {
        console.log("Attempting to generate a crisis...");
        newCrisis = await generateCrisis({ currentState: JSON.stringify({ stats: newStats, politicalClimate: gameState.stateDetails.politicalClimate }) });
        console.log("Generated crisis:", newCrisis.title);
      } catch (crisisError) {
        console.error("Error generating crisis:", crisisError);
        // Don't let a crisis generation error stop the game
      }
    }

    return {
      ...gameState,
      currentStats: newStats,
      statsHistory: newHistory,
      turn: gameState.turn + 1,
      isGameOver,
      gameOverReason,
      lastEventMessage: outcomes.mediaCoverage || "The latest policy decision has been implemented.",
      // If a crisis was handled, currentCrisis is set to null. If a new one is generated, it's set here.
      currentCrisis: newCrisis, 
    };
  } catch (error) {
    console.error('Error in handleDecision:', error);
    return { ...gameState, isGameOver: true, gameOverReason: "A critical error occurred with the AI model. Unable to proceed." };
  }
}

export async function getAiAdvice(gameState: GameState): Promise<{advice: string; reasoning: string}> {
    const gameStateString = JSON.stringify(gameState.currentStats);
    let playerInquiry = "What should be my priority right now to improve my standing and govern effectively?";

    if (gameState.currentCrisis) {
        playerInquiry = `We are facing a crisis: "${gameState.currentCrisis.title} - ${gameState.currentCrisis.description}". What is the best way to handle this?`;
    }

    try {
        const result = await getAiAdviceFlow({
            gameState: gameStateString,
            playerInquiry: playerInquiry,
        });
        return result;
    } catch (error) {
        console.error('Error getting AI advice:', error);
        return {
            advice: "Could not fetch advice.",
            reasoning: "There was an error communicating with the AI advisor. Please try again later."
        };
    }
}
