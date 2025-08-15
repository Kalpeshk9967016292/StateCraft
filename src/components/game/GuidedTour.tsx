
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const tourSteps = [
  {
    title: "Welcome to the Dashboard!",
    description: "This is your command center. Let's take a quick look at the key tools at your disposal.",
    highlight: "header",
  },
  {
    title: "📊 State Vital Signs",
    description: "These are your state's key metrics. Your goal is to keep these balanced. Watch your Budget and Public Approval closely—if either hits zero, your term is over!",
    highlight: "stats",
  },
  {
    title: "📈 Performance Chart",
    description: "This chart tracks your key stats over time. Use it to analyze the long-term impact of your policies and identify trends before they become problems.",
    highlight: "chart",
  },
  {
    title: "📋 Your Agenda",
    description: "This is where you take action. Each turn, you'll face specific challenges or have the opportunity to propose your own laws. Your choices here drive the game.",
    highlight: "actions",
  },
  {
    title: "💡 AI Advisor",
    description: "Feeling stuck? Use the AI Advisor button anytime for strategic guidance based on your current situation. It's like having a seasoned political strategist on your team.",
    highlight: "advisor",
  },
   {
    title: "Ready to Govern?",
    description: "You're all set. The future of the state is in your hands. Good luck, Chief Minister!",
    highlight: "final",
  },
];

interface GuidedTourProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function GuidedTour({ open, onOpenChange }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTour = () => {
      onOpenChange(false);
  }

  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;
  const step = tourSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{step.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {step.description}
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 my-4">
            {tourSteps.map((_, index) => (
                <div 
                    key={index} 
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${currentStep === index ? 'w-4 bg-primary' : 'bg-muted'}`} 
                />
            ))}
        </div>

        <DialogFooter className="justify-between">
          {!isFirstStep ? (
            <Button variant="outline" onClick={goToPrev}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          ) : <div />}
          
          {isLastStep ? (
            <Button onClick={closeTour}>
               <Check className="mr-2 h-4 w-4" /> Got It!
            </Button>
          ): (
            <Button onClick={goToNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
