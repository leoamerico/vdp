import React from 'react';
import { Card } from '@/components/ui/Card';
import { DonutChart } from '@/components/charts/DonutChart';

export function CardPerformance({ taxaAcerto, breakdownData }) {
    // Prepare data for donut if not provided in exact format, but assuming breakdownData matches
    // breakdownData example: [{ name: 'Acertos', value: 82, color: '...' }, { name: 'Erros', value: 18, color: '...' }]

    return (
        <Card className="flex flex-col p-6">
            <p className="text-sm font-medium text-muted-foreground">Performance Geral</p>

            <div className="relative mt-4 flex flex-1 items-center justify-center">
                <DonutChart data={breakdownData} innerRadius={50} outerRadius={70} className="h-[160px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{taxaAcerto}%</span>
                    <span className="text-xs text-muted-foreground">Acerto</span>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {breakdownData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-muted-foreground">{item.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
