
'use server';

import type { GameState, Challenge, NewsHeadline, OppositionStatement, TranslateRequest } from '@/lib/types';
import { processGameTurn } from '@/ai/flows/game-turn';
import { generateTurnOptions as genOptions } from '@/ai/flows/turn-options-generator';
import { translateText as translateTextFlow } from '@/ai/flows/translator';

export async function handleDecision(
  gameState: GameState,
  decision: {title: string; description: string}
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
    
    const newStats = turnResult.updatedStats;
    const newHistory = [...gameState.statsHistory, { turn: gameState.turn + 1, stats: newStats }];
    
    let isGameOver = turnResult.isGameOver;
    let gameOverReason = turnResult.gameOverReason || "";

    // The AI can now set the gameOver flag, but we keep these client-side checks as a fallback.
    // Also, add a "grace period" for the first turn to prevent an immediate game over.
    if (gameState.turn <= 1) {
        isGameOver = false;
        gameOverReason = "";
    } else if (!isGameOver) {
        if (newStats.publicApproval <= 5) {
            isGameOver = true;
            gameOverReason = "Public approval has plummeted to near zero, leading to mass protests and a vote of no confidence. Your government has fallen.";
        } else if (newStats.budget <= 0) {
            isGameOver = true;
            gameOverReason = "The state is bankrupt. With no funds to run the administration, your government has been dismissed.";
        }
    }

    const nextTurnOptions = !isGameOver ? await generateTurnOptions(gameState) : [];

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
      turnOptions: nextTurnOptions,
    };
  } catch (error) {
    console.error('Error in handleDecision:', error);
    return { ...gameState, isGameOver: true, gameOverReason: "A critical error occurred with the AI model. Unable to proceed." };
  }
}

export async function generateTurnOptions(gameState: GameState): Promise<Challenge[]> {
  try {
    const options = await genOptions({
      stateName: gameState.stateDetails.name,
      turn: gameState.turn,
      currentStats: JSON.stringify(gameState.currentStats),
      politicalClimate: gameState.stateDetails.politicalClimate,
      statsHistory: JSON.stringify(gameState.statsHistory.slice(-3)), // only last 3 for brevity
    });
    return options;
  } catch (error) {
    console.error('Error generating turn options:', error);
    // Return a default "safe" option in case of error
    return [
      {
        id: 'fallback-1',
        title: 'Review Administrative Budget',
        description: 'Your advisors suggest a routine review of the administrative budget to ensure efficiency.',
        options: [
          { id: 'fallback-1-opt-1', title: 'Approve Review', description: 'Begin a standard review of department budgets.' },
        ],
      },
    ];
  }
}

export async function getAiAdvice(gameState: GameState): Promise<{advice: string; reasoning: string}> {
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

export async function translateTurnSummary(
    content: {
        keyEvents: string;
        newsHeadlines: NewsHeadline[];
        oppositionStatement: OppositionStatement | null;
    },
    language: string
): Promise<{
    keyEvents: string;
    newsHeadlines: NewsHeadline[];
    oppositionStatement: OppositionStatement | null;
}> {
    try {
        const translate = async (text: string) => {
            if (!text) return text;
            const response = await translateTextFlow({ textToTranslate: text, targetLanguage: language });
            return response.translatedText;
        };

        const translatedKeyEvents = await translate(content.keyEvents);
        
        const translatedNewsHeadlines = await Promise.all(
            content.newsHeadlines.map(async (item) => ({
                ...item,
                headline: await translate(item.headline),
            }))
        );

        let translatedOppositionStatement = null;
        if (content.oppositionStatement) {
            translatedOppositionStatement = {
                ...content.oppositionStatement,
                statement: await translate(content.oppositionStatement.statement),
            };
        }

        return {
            keyEvents: translatedKeyEvents,
            newsHeadlines: translatedNewsHeadlines,
            oppositionStatement: translatedOppositionStatement,
        };

    } catch (error) {
        console.error("Error translating content:", error);
        // Return original content if translation fails
        return content;
    }
}
