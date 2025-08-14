"use client";

import { useState } from 'react';
import type { GameState, State, PolicyDecision } from '@/lib/types';
import { initialStates, policyDecisions } from '@/data/game-data';
import StateSelection from '@/components/game/StateSelection';
import Dashboard from '@/components/game/Dashboard';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getNewPolicies(): PolicyDecision[] {
    return shuffleArray(policyDecisions).slice(0, 3);
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStateSelect = (selectedState: State) => {
    setGameState({
      stateDetails: selectedState,
      currentStats: selectedState.initialStats,
      statsHistory: [{ turn: 0, stats: selectedState.initialStats }],
      turn: 1,
      isGameOver: false,
      gameOverReason: '',
      currentPolicies: getNewPolicies(),
      lastEventMessage: `You have been elected as the Chief Minister of ${selectedState.name}. The people have high hopes for your leadership.`
    });
  };

  const handleRestart = () => {
    setGameState(null);
  };
  
  const updateGameState = (newGameState: GameState) => {
    if (newGameState.isGameOver) {
      setGameState(newGameState);
      return;
    }
    setGameState({
        ...newGameState,
        currentPolicies: getNewPolicies()
    });
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        {!gameState ? (
          <StateSelection states={initialStates} onStateSelect={handleStateSelect} />
        ) : (
          <Dashboard gameState={gameState} setGameState={updateGameState} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}
