import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/charts/ProgressBar';

// Mock data for skills table
const skillsTableData = [
    { name: 'Mindset PMI', total: 120, acerto: 95, percent: 79, status: 'warning' },
    { name: 'Processos', total: 350, acerto: 280, percent: 80, status: 'success' },
    { name: 'Pessoas', total: 200, acerto: 180, percent: 90, status: 'success' },
    { name: 'Business Env', total: 50, acerto: 30, percent: 60, status: 'destructive' },
    { name: 'Agile', total: 150, acerto: 140, percent: 93, status: 'success' },
    { name: 'Híbrido', total: 100, acerto: 75, percent: 75, status: 'warning' },
];

export default function SkillsProgress() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Progresso por Skill</h2>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-3 font-medium">Skill</th>
                                <th className="px-6 py-3 font-medium">Questões</th>
                                <th className="px-6 py-3 font-medium">Acertos</th>
                                <th className="px-6 py-3 font-medium">%</th>
                                <th className="px-6 py-3 font-medium w-1/3">Progresso</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {skillsTableData.map((skill, index) => (
                                <tr key={index} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 font-medium">{skill.name}</td>
                                    <td className="px-6 py-4">{skill.total}</td>
                                    <td className="px-6 py-4">{skill.acerto}</td>
                                    <td className="px-6 py-4 font-bold">{skill.percent}%</td>
                                    <td className="px-6 py-4">
                                        <ProgressBar value={skill.percent} className="h-2" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={skill.status}>
                                            {skill.status === 'success' ? 'Dominado' : skill.status === 'warning' ? 'Atenção' : 'Crítico'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
