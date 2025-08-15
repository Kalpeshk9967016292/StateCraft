// src/components/game/TurnFeedback.tsx
"use client";

import { useState } from 'react';
import type { GameState, NewsHeadline, OppositionStatement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, MessageSquare, Megaphone, Languages, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { translateTurnSummary } from '@/app/actions';

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
    const [isTranslating, setIsTranslating] = useState(false);
    const [isTranslated, setIsTranslated] = useState(false);
    
    // Store original and translated content
    const [content, setContent] = useState({
        keyEvents: gameState.lastEventMessage,
        newsHeadlines: gameState.newsHeadlines,
        oppositionStatement: gameState.oppositionStatement
    });
    const [originalContent] = useState({ ...content });


    // Don't show this component on the very first turn
    if (gameState.turn <= 1 || !gameState.lastEventMessage) {
        return null;
    }

    const handleTranslate = async () => {
        if (isTranslated) {
            // If already translated, revert to original
            setContent(originalContent);
            setIsTranslated(false);
            return;
        }

        setIsTranslating(true);
        const translatedContent = await translateTurnSummary(content, gameState.stateDetails.language);
        setContent(translatedContent);
        setIsTranslated(true);
        setIsTranslating(false);
    };
    
    const language = gameState.stateDetails.language;

    return (
        <Card className="bg-card/50 animate-fade-in shadow-md">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="font-bold">Turn {gameState.turn - 1} Summary</CardTitle>
                <Button variant="outline" size="sm" onClick={handleTranslate} disabled={isTranslating}>
                    {isTranslating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Languages className="mr-2 h-4 w-4" />
                    )}
                    {isTranslated ? 'Show Original' : `Translate to ${language}`}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">Key Events</h3>
                    <p className="text-muted-foreground">{content.keyEvents}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* News Headlines */}
                    <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2"><Newspaper size={18} className="text-accent" /> News Headlines</h4>
                        <div className="space-y-2">
                        {content.newsHeadlines.map((item, index) => (
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
                    {content.oppositionStatement && (
                        <div className="space-y-3">
                           <h4 className="font-semibold flex items-center gap-2"><Megaphone size={18} className="text-accent" /> Opposition Reacts</h4>
                             <div className="text-sm p-3 bg-background rounded-md border-l-4 border-destructive/50">
                                <blockquote className="italic">"{content.oppositionStatement.statement}"</blockquote>
                                <p className="text-xs text-right text-muted-foreground mt-2">- {content.oppositionStatement.speaker}</p>
                            </div>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}

    