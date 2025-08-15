// src/components/game/DecisionCard.tsx
import type { Challenge, PolicyOption } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DecisionCardProps {
  challenges: Challenge[];
  onDecision: (challenge: Challenge, option: PolicyOption) => void;
  isLoading: boolean;
}

export default function DecisionCard({ challenges, onDecision, isLoading }: DecisionCardProps) {
  if (!challenges || challenges.length === 0) {
    return (
       <Card className="h-full flex flex-col sticky top-8">
            <CardHeader>
                <CardTitle className="font-bold">No new challenges</CardTitle>
                <CardDescription>Things are quiet this quarter. You can propose a new law.</CardDescription>
            </CardHeader>
        </Card>
    )
  }
    
  return (
    <Card className="h-full flex flex-col sticky top-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-bold">This Quarter's Agenda</CardTitle>
        <CardDescription>Address the key challenges and opportunities facing your state.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[450px] pr-4 -mr-4">
            <Accordion type="single" collapsible defaultValue={challenges[0]?.id} className="w-full">
            {challenges.map((challenge) => (
                <AccordionItem value={challenge.id} key={challenge.id}>
                    <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-semibold text-primary">{challenge.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-2 bg-background/50 rounded-md">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{challenge.description}</p>
                            <div className="space-y-2">
                                {challenge.options.map(option => (
                                    <Button 
                                        key={option.id}
                                        onClick={() => onDecision(challenge, option)}
                                        className="w-full justify-start h-auto py-2 text-left"
                                        variant="ghost"
                                        disabled={isLoading}
                                        title={option.description}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-semibold whitespace-normal">{option.title}</span>
                                            <span className="text-xs text-muted-foreground font-normal whitespace-normal">{option.description}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
