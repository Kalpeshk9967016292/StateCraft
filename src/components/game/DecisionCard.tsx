import type { PolicyDecision } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface DecisionCardProps {
  policies: PolicyDecision[];
  onDecision: (policyId: string) => void;
  isLoading: boolean;
}

export default function DecisionCard({ policies, onDecision, isLoading }: DecisionCardProps) {
  return (
    <Card className="h-full flex flex-col sticky top-8">
      <CardHeader>
        <CardTitle className="font-bold">Policy Decisions</CardTitle>
        <CardDescription>Choose your next course of action. Your decision will have consequences.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
            {policies.map((policy) => (
                <div key={policy.id} className="p-4 border rounded-lg bg-background/50 transition-colors hover:bg-accent/10">
                    <h4 className="font-semibold text-primary">{policy.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">{policy.description}</p>
                    <Button 
                        onClick={() => onDecision(policy.id)} 
                        className="w-full font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Enact Policy
                    </Button>
                </div>
            ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
