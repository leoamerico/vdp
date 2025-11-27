import React from 'react';
import { useVDPStore } from '@/stores/vdpStore';
import { CardPrazo } from '@/components/dashboard/CardPrazo';
import { CardConsistencia } from '@/components/dashboard/CardConsistencia';
import { CardPerformance } from '@/components/dashboard/CardPerformance';
import { CardSkills } from '@/components/dashboard/CardSkills';
import { CardSimulado } from '@/components/dashboard/CardSimulado';
import { CardRecomendacao } from '@/components/dashboard/CardRecomendacao';

export default function Dashboard() {
    const dados = useVDPStore((state) => state.dados);
    const atualizarDados = useVDPStore((state) => state.atualizarDados);

    // Trigger update on mount (simulating polling start or initial fetch)
    React.useEffect(() => {
        atualizarDados();
    }, [atualizarDados]);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CardPrazo
                prazo={dados.prazoProjetado}
                status={dados.status}
                diferenca={dados.diferenca}
                historyData={dados.historyData}
            />
            <CardConsistencia
                horas={dados.horasSemana}
                meta={dados.metaHoras}
                diferenca={3.5} // Mock difference for now
                weeklyData={dados.weeklyData}
            />
            <CardPerformance
                taxaAcerto={dados.taxaAcerto}
                breakdownData={dados.breakdownData}
            />
            <CardSkills
                dominadas={dados.skillsDominadas}
                total={dados.totalSkills}
                skillsData={dados.skillsData}
            />
            <CardSimulado
                tipo={dados.ultimoSimulado.tipo}
                acerto={dados.ultimoSimulado.acerto}
                tempo={dados.ultimoSimulado.tempo}
                progresso={dados.ultimoSimulado.progresso}
            />
            <CardRecomendacao
                recomendacao={dados.recomendacao}
                onAction={() => console.log('Action clicked')}
            />
        </div>
    );
}
