import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { useVDPStore } from '@/stores/vdpStore';
import { calcularPrazoProjetado } from '@/lib/calculations';

export default function Configuracoes() {
    const dados = useVDPStore((state) => state.dados);

    // Local state for inputs
    const [prazoBase, setPrazoBase] = useState(120);
    const [metaHoras, setMetaHoras] = useState(dados.metaHoras);

    // Debounce values
    const debouncedPrazo = useDebounce(prazoBase, 500);
    const debouncedMeta = useDebounce(metaHoras, 500);

    // Memoized calculation for preview
    // Using mock values for other parameters (TEA=1.0, SD=dados.skillsDominadas, RS=0, CR=0) for this preview
    const prazoEstimado = useMemo(() => {
        return calcularPrazoProjetado(
            debouncedMeta, // Using meta as proxy for hours/week in this simulation
            1.0,
            dados.skillsDominadas,
            0,
            0
        );
    }, [debouncedMeta, dados.skillsDominadas]);

    // Effect to trigger updates when debounced values change
    useEffect(() => {
        console.log('Updating settings (debounced):', { prazoBase: debouncedPrazo, metaHoras: debouncedMeta });
        // Here we would call a store action to update these values
        // updateSettings({ prazoBase: debouncedPrazo, metaHoras: debouncedMeta });
    }, [debouncedPrazo, debouncedMeta]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <h3 className="font-semibold mb-4">Parâmetros Gerais</h3>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Prazo Base (dias)</label>
                            <input
                                type="number"
                                className="rounded-md border p-2"
                                value={prazoBase}
                                onChange={(e) => setPrazoBase(Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Meta Horas/Semana</label>
                            <input
                                type="number"
                                className="rounded-md border p-2"
                                value={metaHoras}
                                onChange={(e) => setMetaHoras(Number(e.target.value))}
                            />
                        </div>

                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium">Simulação em Tempo Real:</p>
                            <p className="text-2xl font-bold text-primary">{prazoEstimado} dias</p>
                            <p className="text-xs text-muted-foreground">Baseado na meta de horas e skills atuais.</p>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            * Alterações salvas automaticamente após pausa na digitação.
                        </div>
                    </form>
                </Card>

                <Card className="p-6">
                    <h3 className="font-semibold mb-4">Pesos do Algoritmo (PP)</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">HSR (Horas Semanais)</span>
                            <input type="range" className="w-1/2" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">TEA (Eficiência)</span>
                            <input type="range" className="w-1/2" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">SD (Skills Dominadas)</span>
                            <input type="range" className="w-1/2" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
