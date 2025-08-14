"use client";

import { useState }from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb } from 'lucide-react';

export default function PlayerNotes() {
    const [notes, setNotes] = useState('');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-accent" />
                    My Notes
                </CardTitle>
                <CardDescription>
                    Jot down your strategy, thoughts, and plans for the future. This is for your eyes only.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="The opposition is getting stronger, I need to focus on public opinion..."
                    className="min-h-[120px] resize-y"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </CardContent>
        </Card>
    );
}
