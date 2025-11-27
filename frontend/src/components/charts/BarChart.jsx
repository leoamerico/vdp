import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { cn } from '@/lib/utils';

export function BarChart({ data, className }) {
    return (
        <div className={cn("h-[200px] w-full", className)}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <span className="text-sm font-bold text-foreground">
                                            {payload[0].payload.name}: {payload[0].value}h
                                        </span>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.active ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
