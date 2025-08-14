// src/components/game/CrisisAlert.tsx
import type { CrisisEvent } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface CrisisAlertProps {
    crisis: CrisisEvent;
}

export default function CrisisAlert({ crisis }: CrisisAlertProps) {
    return (
        <Alert variant="destructive" className="border-2 animate-fade-in">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-xl font-bold">{crisis.title}</AlertTitle>
            <AlertDescription className="mt-2 text-base">
                {crisis.description}
            </AlertDescription>
        </Alert>
    );
}
