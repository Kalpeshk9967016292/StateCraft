"use client";

import { useState } from 'react';
import type { GameState } from '@/lib/types';
import { handleDecision } from '@/app/actions';
import StatsDisplay from './StatsDisplay';
import PerformanceChart from './PerformanceChart';
import DecisionCard from './DecisionCard';
import GameOverDialog from './GameOverDialog';
import AdvisorDialog from './AdvisorDialog';
import { Button } from '@/components/ui/button';
import { Repeat, Newspaper } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DashboardProps {
  gameState: GameState;
  setGameState: (newGameState: GameState) => void;
  onRestart: () => void;
}

export default function Dashboard({ gameState, setGameState, onRestart }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDecision = async (decisionId: string) => {
    setIsLoading(true);
    const decision = gameState.currentPolicies.find(p => p.id === decisionId);
    if (decision) {
      const newGameState = await handleDecision(gameState, decision);
      setGameState(newGameState);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <GameOverDialog isOpen={gameState.isGameOver} reason={gameState.gameOverReason} onRestart={onRestart} />

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-primary tracking-tight">{gameState.stateDetails.name}</h1>
          <p className="text-muted-foreground font-medium">Turn {gameState.turn} | Chief Minister's Dashboard</p>
        </div>
        <div className="flex gap-2">
            <AdvisorDialog gameState={gameState} />
            <Button variant="outline" onClick={onRestart}>
                <Repeat className="mr-2 h-4 w-4" /> Restart
            </Button>
        </div>
      </header>
      
      {gameState.lastEventMessage && (
        <Alert className="bg-card border-l-4 border-accent">
            <Newspaper className="h-5 w-5 text-accent" />
            <AlertTitle className="text-accent-foreground font-semibold">News Flash!</AlertTitle>
            <AlertDescription>
                {gameState.lastEventMessage}
            </AlertDescription>
        </Alert>
      )}

      <StatsDisplay stats={gameState.currentStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <PerformanceChart history={gameState.statsHistory} />
        </div>
        <div className="lg:col-span-1">
          <DecisionCard 
            policies={gameState.currentPolicies} 
            onDecision={onDecision}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
