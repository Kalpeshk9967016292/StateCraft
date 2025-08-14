// src/components/game/CustomPolicyCard.tsx
"use client";

import { useState, useEffect } from 'react';
import type { CrisisEvent } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Gavel, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomPolicyCardProps {
  onDecision: (policyText: string) => void;
  isLoading: boolean;
  crisis: CrisisEvent | null;
}

export default function CustomPolicyCard({ onDecision, isLoading, crisis }: CustomPolicyCardProps) {
  const [policyText, setPolicyText] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Clear policy text when a new crisis appears or is resolved
    setPolicyText('');
  }, [crisis]);


  const handleEnact = () => {
    if (policyText.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Policy Too Vague",
        description: "Please describe your policy in more detail (at least 10 characters).",
      });
      return;
    }
    onDecision(policyText);
    setPolicyText(''); // Clear after submission
  };
  
  const cardTitle = crisis ? 'Crisis Response' : 'Propose a New Law';
  const cardIcon = crisis ? <AlertTriangle className="h-6 w-6 text-destructive"/> : <Gavel className="h-6 w-6 text-primary"/>;
  const cardDescription = crisis 
    ? "You must respond to the ongoing crisis. What is your decision?"
    : "Draft a new law or executive order. The AI will simulate its impact on your state.";
  const buttonText = crisis ? 'Enact Crisis Response' : 'Enact Law';


  return (
    <Card className={`h-full flex flex-col sticky top-8 shadow-lg ${crisis ? 'border-destructive border-2' : ''}`}>
      <CardHeader>
        <CardTitle className="font-bold flex items-center gap-2">
            {cardIcon}
            {cardTitle}
        </CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Textarea
            placeholder={crisis ? `e.g., 'Deploy riot police to disperse the crowds and declare a curfew.' or 'Agree to meet with protest leaders and negotiate their demands.'` : `e.g., 'Declare a state-wide ban on single-use plastics...'`}
            className="min-h-[180px] resize-y flex-grow"
            value={policyText}
            onChange={(e) => setPolicyText(e.target.value)}
            disabled={isLoading}
        />
      </CardContent>
      <CardFooter>
        <Button 
            onClick={handleEnact} 
            className="w-full font-bold py-6 text-base"
            disabled={isLoading}
            variant={crisis ? 'destructive' : 'default'}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
