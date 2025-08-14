"use client";

import { useState, useEffect } from 'react';
import type { GameState, State } from '@/lib/types';
import { policyDecisions } from '@/data/game-data';
import StateSelection from '@/components/game/StateSelection';
import Dashboard from '@/components/game/Dashboard';
import { getStatesData } from '@/services/state-data-service';
import { Loader2 } from 'lucide-react';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getNewPolicies() {
    return shuffleArray(policyDecisions).slice(0, 3);
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStateData = async () => {
      setIsLoading(true);
      const data = await getStatesData();
      setStates(data);
      setIsLoading(false);
    };
    loadStateData();
  }, []);

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
    // Optionally re-fetch data on restart if desired
    // const loadStateData = async () => {
    //   setIsLoading(true);
    //   const data = await getStatesData(true); // force refresh
    //   setStates(data);
    //   setIsLoading(false);
    // };
    // loadStateData();
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
        {isLoading ? (
           <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Fetching latest real-world data...</p>
          </div>
        ) : !gameState ? (
          <StateSelection states={states} onStateSelect={handleStateSelect} />
        ) : (
          <Dashboard gameState={gameState} setGameState={updateGameState} onRestart={handleRestart} />
        )}
      </div>
    </main>
  );
}
