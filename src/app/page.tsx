"use client";

import { useState, useEffect } from 'react';
import type { GameState, State } from '@/lib/types';
import StateSelection from '@/components/game/StateSelection';
import Dashboard from '@/components/game/Dashboard';
import { getStatesData } from '@/services/state-data-service';
import { Loader2 } from 'lucide-react';

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
      lastEventMessage: `You have been elected as the Chief Minister of ${selectedState.name}. The people have high hopes for your leadership.`,
      currentCrisis: null,
      newsHeadlines: [],
      socialMediaTrends: [],
      oppositionStatement: null,
    });
  };

  const handleRestart = () => {
    setGameState(null);
  };
  
  const updateGameState = (newGameState: GameState) => {
    setGameState(newGameState);
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
