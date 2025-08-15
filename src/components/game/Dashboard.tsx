"use client";

import { useState } from 'react';
import type { GameState, PolicyOption, Challenge } from '@/lib/types';
import { handleDecision } from '@/app/actions';
import StatsDisplay from './StatsDisplay';
import PerformanceChart from './PerformanceChart';
import CustomPolicyCard from './CustomPolicyCard';
import GameOverDialog from './GameOverDialog';
import CrisisAlert from './CrisisAlert';
import AdvisorDialog from './AdvisorDialog';
import TurnFeedback from './TurnFeedback';
import { Button } from '@/components/ui/button';
import { Repeat, Loader2 } from 'lucide-react';
import DecisionCard from './DecisionCard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


interface DashboardProps {
  gameState: GameState;
  setGameState: (newGameState: GameState) => void;
  onRestart: () => void;
}

export default function Dashboard({ gameState, setGameState, onRestart }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('challenges');

  const onDecision = async (decision: {title: string; description: string}) => {
    setIsLoading(true);
    const newGameState = await handleDecision(gameState, decision);
    setGameState(newGameState);
    // After a decision, if there are new challenges, stay on the challenges tab.
    // Otherwise, it implies a custom law was made, so we can switch back.
    if(newGameState.turnOptions && newGameState.turnOptions.length > 0) {
        setActiveTab('challenges');
    }
    setIsLoading(false);
  };
  
  const onCustomDecision = async (policyText: string) => {
    await onDecision({
        title: gameState.currentCrisis ? 'Crisis Response' : 'Custom Policy Initiative',
        description: policyText,
    });
  }

  const onChallengeDecision = async (challenge: Challenge, option: PolicyOption) => {
    await onDecision({
        title: `Re: ${challenge.title} - ${option.title}`,
        description: option.description,
    });
  }

  const turnNumber = gameState.turn;
  const year = Math.floor((turnNumber - 1) / 4) + 1;
  const quarter = ((turnNumber - 1) % 4) + 1;


  return (
    <div className="space-y-8 animate-fade-in">
      <GameOverDialog isOpen={gameState.isGameOver} reason={gameState.gameOverReason} onRestart={onRestart} />

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-primary tracking-tight">{gameState.stateDetails.name}</h1>
          <p className="text-muted-foreground font-medium">Year {year}, Q{quarter} | Turn {gameState.turn} | Chief Minister's Dashboard</p>
        </div>
        <div className="flex-grow flex items-center justify-center h-24 bg-muted/50 rounded-lg min-w-[300px]">
          <span className="text-muted-foreground text-sm">Ad Placeholder</span>
        </div>
        <div className="flex gap-2">
            <AdvisorDialog gameState={gameState} />
            <Button variant="outline" onClick={onRestart}>
                <Repeat className="mr-2 h-4 w-4" /> Restart
            </Button>
        </div>
      </header>
      
      {gameState.currentCrisis && <CrisisAlert crisis={gameState.currentCrisis} />}

      <StatsDisplay stats={gameState.currentStats} />

      {gameState.turn > 1 && <TurnFeedback gameState={gameState} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
           <PerformanceChart history={gameState.statsHistory} />
        </div>
        <div className="lg:col-span-1">
          { isLoading ? (
             <div className="h-full flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-8 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="text-lg font-semibold">Simulating Turn...</h3>
                <p className="text-sm text-center text-muted-foreground">The AI is processing your decision, calculating outcomes, and generating news from across the state.</p>
            </div>
          ) : gameState.currentCrisis ? (
             <CustomPolicyCard
                onDecision={onCustomDecision}
                isLoading={isLoading}
                crisis={gameState.currentCrisis}
             />
          ) : (
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="challenges">This Quarter's Agenda</TabsTrigger>
                <TabsTrigger value="custom">Propose a Law</TabsTrigger>
              </TabsList>
              <TabsContent value="challenges">
                 <DecisionCard 
                    challenges={gameState.turnOptions}
                    onDecision={onChallengeDecision}
                    isLoading={isLoading}
                 />
              </TabsContent>
              <TabsContent value="custom">
                <CustomPolicyCard
                    onDecision={onCustomDecision}
                    isLoading={isLoading}
                    crisis={null}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
