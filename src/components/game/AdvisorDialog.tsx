"use client";

import { useState } from 'react';
import type { GameState } from '@/lib/types';
import { getAiAdvice } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { BrainCircuit, Loader2 } from 'lucide-react';

interface AdvisorDialogProps {
  gameState: GameState;
}

export default function AdvisorDialog({ gameState }: AdvisorDialogProps) {
  const [advice, setAdvice] = useState<{ advice: string; reasoning: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAdvice = async () => {
    if (advice) return; // Don't re-fetch if advice is already there
    setIsLoading(true);
    const result = await getAiAdvice(gameState);
    setAdvice(result);
    setIsLoading(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setAdvice(null); // Reset advice when closing
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={fetchAdvice}>
          <BrainCircuit className="mr-2 h-4 w-4 text-accent" /> AI Advisor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Advisor</span>
          </DialogTitle>
          <DialogDescription>
            Strategic guidance from your AI political advisor.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[12rem] flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span>Analyzing state data...</span>
            </div>
          )}
          {advice && (
            <div className="space-y-4 text-sm animate-fade-in">
              <div>
                <h4 className="font-semibold text-base text-primary">Suggestion:</h4>
                <blockquote className="mt-1 border-l-2 border-primary pl-3 italic">
                    {advice.advice}
                </blockquote>
              </div>
              <div>
                <h4 className="font-semibold text-base text-primary">Reasoning:</h4>
                <p className="mt-1 text-muted-foreground">{advice.reasoning}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Close
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
