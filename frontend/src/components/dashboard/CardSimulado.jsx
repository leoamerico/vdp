import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/charts/ProgressBar';
import { Timer, CheckCircle2 } from 'lucide-react';

export function CardSimulado({ tipo, acerto, tempo, progresso, totalSimulados }) {
    return (
        <Card className="flex flex-col p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Último Simulado</p>
                <Badge variant="outline" className="font-normal">
                    {tipo}
                </Badge>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{acerto}%</span>
                <span className="text-sm text-muted-foreground">acerto</span>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Timer className="h-4 w-4" />
                    <span>{tempo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{progresso}</span>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progresso Geral</span>
                    <span>{progresso}</span>
                </div>
                {/* Parsing "4/6" to percentage for the bar */}
                <ProgressBar
                    value={(parseInt(progresso.split('/')[0]) / parseInt(progresso.split('/')[1])) * 100}
                    className="h-2"
                />
            </div>
        </Card>
    );
}
