'use server';

import { GameState, PolicyDecision, Stats, CrisisEvent, NewsHeadline, SocialMediaTrend, OppositionStatement } from '@/lib/types';
import { processGameTurn } from '@/ai/flows/game-turn';

export async function handleDecision(
  gameState: GameState,
  decision: PolicyDecision
): Promise<GameState> {
  
  const gameTurnInput = {
    stateName: gameState.stateDetails.name,
    turn: gameState.turn,
    currentStats: gameState.currentStats,
    politicalClimate: gameState.stateDetails.politicalClimate,
    playerAction: `${decision.title}: ${decision.description}`,
    statsHistory: gameState.statsHistory,
  };

  try {
    const turnResult = await processGameTurn(gameTurnInput);

    const newStats: Stats = turnResult.updatedStats;

    const newHistory = [...gameState.statsHistory, { turn: gameState.turn + 1, stats: newStats }];
    
    let isGameOver = false;
    let gameOverReason = "";

    if (newStats.publicOpinion <= 10) {
        isGameOver = true;
        gameOverReason = "Public opinion has plummeted, leading to mass protests and a vote of no confidence. Your government has fallen.";
    } else if (newStats.budget <= 5) {
        isGameOver = true;
        gameOverReason = "The state is bankrupt. With no funds to run the administration, your government has been dismissed.";
    } else if (newStats.oppositionStrength >= 80 && newStats.publicOpinion <= 20) {
        isGameOver = true;
        gameOverReason = "Political instability is rampant and your administration has lost control. The Central Government has dismissed your government and imposed President's Rule.";
    }


    return {
      ...gameState,
      currentStats: newStats,
      statsHistory: newHistory,
      turn: gameState.turn + 1,
      isGameOver,
      gameOverReason,
      lastEventMessage: turnResult.keyEvents || "The latest policy decision has been implemented.",
      currentCrisis: turnResult.newCrisis, 
      newsHeadlines: turnResult.newsHeadlines,
      socialMediaTrends: turnResult.socialMediaTrends,
      oppositionStatement: turnResult.oppositionStatement,
    };
  } catch (error) {
    console.error('Error in handleDecision:', error);
    return { ...gameState, isGameOver: true, gameOverReason: "A critical error occurred with the AI model. Unable to proceed." };
  }
}

export async function getAiAdvice(gameState: GameState): Promise<{advice: string; reasoning: string}> {
    // This function can be updated to use a more sophisticated prompt in the future
    // or be replaced by insights from the main game-turn flow.
    // For now, keeping the simple version.
    const gameStateString = JSON.stringify(gameState.currentStats);
    let playerInquiry = "What should be my priority right now to improve my standing and govern effectively?";

    if (gameState.currentCrisis) {
        playerInquiry = `We are facing a crisis: "${gameState.currentCrisis.title} - ${gameState.currentCrisis.description}". What is the best way to handle this?`;
    }

    try {
        const { getAiAdvice: getAiAdviceFlow } = await import('@/ai/flows/ai-advisor');
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
