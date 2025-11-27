import { create } from 'zustand';
import { calcularPrazoProjetado, gerarRecomendacao } from '@/lib/calculations';

export const useVDPStore = create((set, get) => ({
    dados: {
        prazoProjetado: 72,
        diferenca: -108,
        status: 'Excelente',
        horasSemana: 12.0,
        metaHoras: 15.0, // Added meta for consistency card
        taxaAcerto: 82,
        skillsDominadas: 8,
        totalSkills: 12, // Added total for skills card
        ultimoSimulado: {
            tipo: '180Q',
            acerto: 75,
            tempo: '3h28min',
            progresso: '4/6' // Added progresso for simulado card
        },
        recomendacao: 'Prioridade: reduzir erro Mindset PMI <15%',

        // Data for charts (mocked for now, will be populated by API later)
        historyData: [
            { name: 'Sem 1', value: 120 },
            { name: 'Sem 2', value: 110 },
            { name: 'Sem 3', value: 95 },
            { name: 'Sem 4', value: 72 },
        ],
        weeklyData: [
            { name: 'Seg', value: 2.5, active: true },
            { name: 'Ter', value: 3.0, active: true },
            { name: 'Qua', value: 1.5, active: true },
            { name: 'Qui', value: 4.0, active: true },
            { name: 'Sex', value: 0, active: false },
            { name: 'Sab', value: 0, active: false },
            { name: 'Dom', value: 0, active: false },
        ],
        breakdownData: [
            { name: 'Acertos', value: 82, color: 'hsl(var(--primary))' },
            { name: 'Erros', value: 18, color: 'hsl(var(--destructive))' },
        ],
        skillsData: [
            { name: 'Dominadas', value: 8, color: 'hsl(var(--primary))' },
            { name: 'Em Progresso', value: 3, color: 'hsl(var(--secondary))' },
            { name: 'A Melhorar', value: 1, color: 'hsl(var(--destructive))' },
        ]
    },

    atualizarDados: async () => {
        console.log('Polling: Atualizando dados...');
        // Here we would call the API
        // const novosDados = await api.buscarDadosDashboard();
        // set({ dados: novosDados });

        // For now, let's just simulate a small change to prove it works
        const current = get().dados;
        set({
            dados: {
                ...current,
                horasSemana: current.horasSemana + 0.1, // Simulate live update
            }
        });
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
