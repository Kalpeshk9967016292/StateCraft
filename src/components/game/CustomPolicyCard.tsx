// src/components/game/CustomPolicyCard.tsx
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Gavel } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomPolicyCardProps {
  onDecision: (policyText: string) => void;
  isLoading: boolean;
}

export default function CustomPolicyCard({ onDecision, isLoading }: CustomPolicyCardProps) {
  const [policyText, setPolicyText] = useState('');
  const { toast } = useToast();

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

  return (
    <Card className="h-full flex flex-col sticky top-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-bold flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary"/>
            Propose a New Law
        </CardTitle>
        <CardDescription>Draft a new law or executive order. The AI will simulate its impact on your state.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Textarea
            placeholder="e.g., 'Declare a state-wide ban on single-use plastics to improve our environment.' or 'Launch a new scholarship program for girls pursuing higher education...'"
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
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enact Law"}
        </Button>
      </CardFooter>
    </Card>
  );
}
