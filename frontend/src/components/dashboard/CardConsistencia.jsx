import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/charts/BarChart';
import { Clock } from 'lucide-react';

export function CardConsistencia({ horas, meta, diferenca, weeklyData }) {
    const isPositive = diferenca > 0;

    return (
        <Card className="flex flex-col p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Consistência Semanal</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tight">{horas}h</span>
                        <span className="text-sm text-muted-foreground">/ {meta}h meta</span>
                    </div>
                </div>
                <div className="rounded-full bg-muted p-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <Badge variant={isPositive ? 'success' : 'warning'} className="gap-1 px-1.5 py-0.5 text-xs">
                    {isPositive ? '+' : ''}{diferenca}h
                </Badge>
                <span className="text-xs text-muted-foreground">vs. semana anterior</span>
            </div>

            <div className="mt-4 h-[100px] w-full">
                <BarChart data={weeklyData} className="h-full" />
            </div>
        </Card>
    );
}
