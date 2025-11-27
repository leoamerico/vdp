import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LineChart } from '@/components/charts/LineChart';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function CardPrazo({ prazo, status, diferenca, historyData }) {
    const isPositive = diferenca < 0; // Negative difference means earlier date (good)

    return (
        <Card className="flex flex-col p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Prazo Projetado</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tight">{prazo}</span>
                        <span className="text-sm text-muted-foreground">dias</span>
                    </div>
                </div>
                <Badge variant={status === 'Excelente' ? 'success' : 'default'}>
                    {status}
                </Badge>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <Badge variant={isPositive ? 'success' : 'destructive'} className="gap-1 px-1.5 py-0.5 text-xs">
                    {isPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {Math.abs(diferenca)} dias
                </Badge>
                <span className="text-xs text-muted-foreground">vs. prazo inicial</span>
            </div>

            <div className="mt-4 h-[80px] w-full">
                {/* Mini chart version */}
                <LineChart data={historyData} className="h-full" />
            </div>
        </Card>
    );
}
