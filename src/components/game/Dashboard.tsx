"use client";

import { useState, useEffect } from 'react';
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
import AdBanner from './AdBanner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Show dashboard tour only once per session when a new game starts
    const hasSeenTour = sessionStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour) {
      setShowTour(true);
      sessionStorage.setItem('hasSeenDashboardTour', 'true');
    }
  }, []);


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
      <Dialog open={showTour} onOpenChange={setShowTour}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Your Chief Minister's Dashboard</DialogTitle>
            <DialogDescription className="text-base pt-2">
              This is your command center. Here's a quick look at what's important:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <p>📊 <span className="font-semibold">Stats Display:</span> Your state's vital signs are at the top. Keep a close eye on Public Approval and your Budget!</p>
            <p>📈 <span className="font-semibold">Performance Chart:</span> This chart tracks your key metrics over time. Use it to see the long-term impact of your decisions.</p>
            <p>📋 <span className="font-semibold">Decision Cards:</span> On the right, you'll find this quarter's agenda with specific challenges or the option to propose your own laws. Your choices here drive the game.</p>
            <p>💡 <span className="font-semibold">AI Advisor:</span> Feeling stuck? Use the AI Advisor for strategic guidance based on your current situation.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTour(false)}>Got It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GameOverDialog isOpen={gameState.isGameOver} reason={gameState.gameOverReason} onRestart={onRestart} />

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-primary tracking-tight">{gameState.stateDetails.name}</h1>
          <p className="text-muted-foreground font-medium">Year {year}, Q{quarter} | Turn {gameState.turn} | Chief Minister's Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
            <AdvisorDialog gameState={gameState} />
            <Button variant="outline" onClick={onRestart}>
                <Repeat className="mr-2 h-4 w-4" /> Restart
            </Button>
        </div>
      </header>
      
       <div className="my-4 p-4 min-h-[90px] w-full flex items-center justify-center bg-card rounded-lg shadow-sm">
        <AdBanner />
      </div>
      
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
