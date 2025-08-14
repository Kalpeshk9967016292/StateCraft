// src/components/game/TurnFeedback.tsx
"use client";

import type { GameState } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, MessageSquare, Megaphone, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TurnFeedbackProps {
    gameState: GameState;
}

const getSentimentVariant = (sentiment: 'Positive' | 'Negative' | 'Mixed') => {
    switch(sentiment) {
        case 'Positive': return 'default';
        case 'Negative': return 'destructive';
        case 'Mixed': return 'secondary';
        default: return 'outline';
    }
}

export default function TurnFeedback({ gameState }: TurnFeedbackProps) {

    // Don't show this component on the very first turn
    if (gameState.turn <= 1 || !gameState.lastEventMessage) {
        return null;
    }

    return (
        <Card className="bg-card/50 animate-fade-in shadow-md">
            <CardHeader>
                <CardTitle className="font-bold">Turn {gameState.turn - 1} Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">Key Events</h3>
                    <p className="text-muted-foreground">{gameState.lastEventMessage}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* News Headlines */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2"><Newspaper size={18} className="text-accent" /> News Headlines</h4>
                        <div className="space-y-2">
                        {gameState.newsHeadlines.map((item, index) => (
                            <div key={index} className="text-sm p-2 bg-background rounded-md">
                                <p className="font-bold">{item.headline}</p>
                                <p className="text-xs text-muted-foreground italic">- {item.source}</p>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2"><MessageSquare size={18} className="text-accent" /> Social Media</h4>
                        <div className="space-y-2">
                        {gameState.socialMediaTrends.map((item, index) => (
                             <div key={index} className="text-sm p-2 bg-background rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{item.topic}</p>
                                    <p className="text-xs text-muted-foreground italic">- {item.platform}</p>
                                </div>
                                <Badge variant={getSentimentVariant(item.sentiment)}>{item.sentiment}</Badge>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Opposition Statement */}
                    {gameState.oppositionStatement && (
                        <div className="space-y-3">
                           <h4 className="font-semibold flex items-center gap-2"><Megaphone size={18} className="text-accent" /> Opposition Reacts</h4>
                             <div className="text-sm p-3 bg-background rounded-md border-l-4 border-destructive/50">
                                <blockquote className="italic">"{gameState.oppositionStatement.statement}"</blockquote>
                                <p className="text-xs text-right text-muted-foreground mt-2">- {gameState.oppositionStatement.speaker}</p>
                            </div>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}
