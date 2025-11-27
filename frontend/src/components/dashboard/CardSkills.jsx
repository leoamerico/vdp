import React from 'react';
import { Card } from '@/components/ui/Card';
import { DonutChart } from '@/components/charts/DonutChart';

export function CardSkills({ dominadas, total, skillsData }) {
    return (
        <Card className="flex flex-col p-6">
            <p className="text-sm font-medium text-muted-foreground">Skills Dominadas</p>

            <div className="relative mt-4 flex flex-1 items-center justify-center">
                <DonutChart data={skillsData} innerRadius={50} outerRadius={70} className="h-[160px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{dominadas}</span>
                        <span className="text-sm text-muted-foreground">/{total}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Skills</span>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
                {skillsData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
