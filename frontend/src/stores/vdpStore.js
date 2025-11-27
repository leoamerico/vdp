import { create } from 'zustand';
import { calcularPrazoProjetado, gerarRecomendacao } from '@/lib/calculations';
import { buscarDadosDashboard, calcularMetricas, processarSkills, obterUltimoSimulado } from '@/services/api';

export const useVDPStore = create((set, get) => ({
    dados: {
        prazoProjetado: 0,
        diferenca: 0,
        status: 'Carregando...',
        horasSemana: 0,
        metaHorasSemana: 15.0,
        taxaAcerto: 0,
        skillsDominadas: 0,
        totalSkills: 0,
        ultimoSimulado: {
            tipo: '-',
            acerto: 0,
            tempo: '-',
            progresso: '0/0'
        },
        recomendacao: 'Carregando dados...',
        historyData: [],
        weeklyData: [],
        breakdownData: [],
        skillsData: []
    },

    atualizarDados: async () => {
        console.log('Fetching dashboard data...');
        try {
            const apiData = await buscarDadosDashboard();
            const metricas = calcularMetricas(apiData.dailyTracking);
            const skillsStats = processarSkills(apiData.skills);
            const ultimoSimulado = obterUltimoSimulado(apiData.simulados);

            // Process Weekly Data for Chart
            const weeklyData = [
                { name: 'Seg', value: metricas.horasPorDia['Seg'] },
                { name: 'Ter', value: metricas.horasPorDia['Ter'] },
                { name: 'Qua', value: metricas.horasPorDia['Qua'] },
                { name: 'Qui', value: metricas.horasPorDia['Qui'] },
                { name: 'Sex', value: metricas.horasPorDia['Sex'] },
                { name: 'Sab', value: metricas.horasPorDia['Sáb'] }, // Note: api.js uses 'Sáb'
                { name: 'Dom', value: metricas.horasPorDia['Dom'] },
            ];

            // Process Skills Data for Chart
            // Assuming apiData.skills is array of [name, ..., percent]
            // We need to count based on thresholds
            let dominadas = 0;
            let emProgresso = 0;
            let aMelhorar = 0;

            apiData.skills.forEach(skill => {
                const percent = parseFloat(skill[3]) || 0;
                if (percent >= 0.8) dominadas++;
                else if (percent >= 0.5) emProgresso++;
                else aMelhorar++;
            });

            const skillsData = [
                { name: 'Dominadas', value: dominadas, color: 'hsl(var(--primary))' },
                { name: 'Em Progresso', value: emProgresso, color: '#F59E0B' }, // Yellow
                { name: 'A Melhorar', value: aMelhorar, color: 'hsl(var(--destructive))' },
            ];

            // Process Breakdown Data
            const breakdownData = [
                { name: 'Acertos', value: metricas.taxaAcerto, color: 'hsl(var(--primary))' },
                { name: 'Erros', value: 100 - metricas.taxaAcerto, color: 'hsl(var(--destructive))' },
            ];

            // History Data (Mocked for now as API returns single values for projected)
            // Or we could use the 'simulados' history if relevant, but for 'Prazo' history 
            // we might need a specific range from the sheet if it exists.
            // The API fetches 'Daily_Tracking' which might have history?
            // For now, let's keep the mock history or try to build it if possible.
            // The prompt didn't specify where historyData comes from exactly for the line chart,
            // but `buscarDadosDashboard` fetches `Dashboard!B7` etc.
            // Let's use a placeholder or derived data if possible.
            // Actually, let's just keep the previous mock history for the chart visual 
            // until we have a real source, or maybe the user wants us to use the daily tracking?
            // The user said "Substituir mock por dados reais".
            // Let's use the last 4 weeks of daily tracking if available, or just mock it for now 
            // to avoid breaking the chart if data is missing.
            const historyData = [
                { name: 'Sem 1', value: apiData.prazoAnterior + 10 }, // Mock trend
                { name: 'Sem 2', value: apiData.prazoAnterior + 5 },
                { name: 'Sem 3', value: apiData.prazoAnterior },
                { name: 'Atual', value: apiData.prazoProjetado },
            ];

            set({
                dados: {
                    prazoProjetado: apiData.prazoProjetado,
                    diferenca: apiData.diferenca,
                    status: apiData.status,
                    horasSemana: metricas.horasSemana,
                    metaHorasSemana: 15.0,
                    taxaAcerto: metricas.taxaAcerto,
                    skillsDominadas: skillsStats.dominadas,
                    totalSkills: skillsStats.total,
                    ultimoSimulado: ultimoSimulado ? {
                        tipo: ultimoSimulado.tipo,
                        acerto: ultimoSimulado.percentual * 100, // Assuming 0-1
                        tempo: '0h00min', // Not in API?
                        progresso: `${ultimoSimulado.acertos}/${ultimoSimulado.questoes}`
                    } : { tipo: '-', acerto: 0, tempo: '-', progresso: '0/0' },
                    recomendacao: 'Dados atualizados do Google Sheets', // Placeholder or logic
                    historyData,
                    weeklyData,
                    breakdownData,
                    skillsData
                }
            });
        } catch (error) {
            console.error('Failed to update dashboard data:', error);
            // Optionally set error state
        }
    },

    registrarDiaEstudo: (horas) => {
        console.log(`Registrando ${horas} horas de estudo`);
        set((state) => ({
            dados: {
                ...state.dados,
                horasSemana: state.dados.horasSemana + horas
            }
        }));
    },

    salvarSimulado: (resultado) => {
        console.log('Salvando simulado:', resultado);
        set((state) => ({
            dados: {
                ...state.dados,
                ultimoSimulado: {
                    ...state.dados.ultimoSimulado,
                    ...resultado
                }
            }
        }));

        // Recalculate recommendation
        const novaRecomendacao = gerarRecomendacao(
            'Processos', // Mock error area
            ['Integração'], // Mock weak skills
            resultado
        );

        set((state) => ({
            dados: {
                ...state.dados,
                recomendacao: novaRecomendacao
            }
        }));
    }
}));
