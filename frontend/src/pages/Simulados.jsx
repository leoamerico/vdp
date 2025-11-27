import React from 'react';
import { Card } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { Button } from '@/components/ui/Button';
import { useVDPStore } from '@/stores/vdpStore';

export default function Simulados() {
    const dados = useVDPStore((state) => state.dados);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Simulados</h2>
                <Button>Novo Simulado</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <h3 className="font-semibold">Evolução de Acertos</h3>
                    <div className="mt-4 h-[300px]">
                        <LineChart data={dados.historyData} />
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-semibold">Próximo Simulado</h3>
                    <div className="mt-4 space-y-4">
                        <div className="rounded-lg border p-4">
                            <p className="font-medium">Simulado Geral #5</p>
                            <p className="text-sm text-muted-foreground">180 Questões • 4 horas</p>
                        </div>
                        <Button className="w-full" variant="outline">Agendar</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
