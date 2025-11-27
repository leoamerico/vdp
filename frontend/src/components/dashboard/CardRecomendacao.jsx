import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function CardRecomendacao({ recomendacao, onAction }) {
    return (
        <Card className="flex flex-col justify-between bg-gradient-to-br from-card to-secondary/20 p-6">
            <div>
                <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-semibold">Recomendação IA</h3>
                </div>

                <p className="mt-4 text-lg font-medium leading-relaxed text-foreground">
                    {recomendacao}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                    Baseado na sua performance recente em Mindset PMI e Processos.
                </p>
            </div>

            <Button onClick={onAction} className="mt-6 w-full gap-2">
                Ver Questões Focadas
                <ArrowRight className="h-4 w-4" />
            </Button>
        </Card>
    );
}
