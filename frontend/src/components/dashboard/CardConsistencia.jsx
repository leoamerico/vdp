import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { useVDPStore } from '@/stores/vdpStore';
import { Clock } from 'lucide-react';

export function CardConsistencia({ horas, meta, diferenca, weeklyData }) {
    const metaStore = useVDPStore(state => state.dados.metaHorasSemana);
    // Use store value if available, otherwise fallback to prop
    const metaValue = metaStore || meta;
    const isPositive = diferenca > 0;

    return (
        <Card className="flex flex-col p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Consistência Semanal</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tight">{horas}h</span>
                        <span className="text-sm text-muted-foreground">/ {metaValue}h meta</span>
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
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {weeklyData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        entry.value >= 2 ? '#10B981' : // High (Green)
                                            entry.value >= 1 ? '#3B82F6' : // Medium (Blue)
                                                entry.value > 0 ? '#F59E0B' :  // Low (Yellow)
                                                    '#EF4444'                      // Zero (Red)
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
