import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Helper para fazer requests
async function fetchSheet(range) {
    try {
        const response = await axios.get(
            `${BASE_URL}/${SPREADSHEET_ID}/values/${range}`,
            { params: { key: API_KEY } }
        );
        return response.data.values || [];
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        throw error;
    }
}

// Buscar dados do Dashboard
export async function buscarDadosDashboard() {
    try {
        // Buscar múltiplas ranges de uma vez
        const response = await axios.get(
            `${BASE_URL}/${SPREADSHEET_ID}/values:batchGet`,
            {
                params: {
                    key: API_KEY,
                    ranges: [
                        'Dashboard!B7',      // Prazo Projetado
                        'Dashboard!B8',      // Prazo Anterior
                        'Dashboard!B9',      // Diferença
                        'Dashboard!B10',     // Status
                        'Daily_Tracking!B:G', // Últimos 7 dias
                        'Simulados!A2:F20',  // Histórico simulados
                        'Skills_Progress!A2:E13', // 12 Skills
                    ]
                }
            }
        );

        const ranges = response.data.valueRanges;

        // Parse dos dados
        return {
            prazoProjetado: parseInt(ranges[0].values?.[0]?.[0] || 180),
            prazoAnterior: parseInt(ranges[1].values?.[0]?.[0] || 180),
            diferenca: parseInt(ranges[2].values?.[0]?.[0] || 0),
            status: ranges[3].values?.[0]?.[0] || 'Em progresso',
            dailyTracking: ranges[4].values || [],
            simulados: ranges[5].values || [],
            skills: ranges[6].values || [],
        };
    } catch (error) {
        console.error('Erro ao buscar dashboard:', error);
        throw error;
    }
}

// Calcular dados derivados do Daily Tracking
export function calcularMetricas(dailyTracking) {
    // Últimos 7 dias
    const ultimos7Dias = dailyTracking.slice(-7);

    // Horas totais semana
    const horasSemana = ultimos7Dias.reduce((sum, dia) => {
        return sum + (parseFloat(dia[1]) || 0);
    }, 0);

    // Questões e acertos
    const questoesTotais = ultimos7Dias.reduce((sum, dia) => sum + (parseInt(dia[2]) || 0), 0);
    const acertosTotais = ultimos7Dias.reduce((sum, dia) => sum + (parseInt(dia[3]) || 0), 0);
    const taxaAcerto = questoesTotais > 0 ? (acertosTotais / questoesTotais) : 0;

    // Horas por dia da semana (Seg-Dom)
    const horasPorDia = {
        'Seg': 0, 'Ter': 0, 'Qua': 0, 'Qui': 0,
        'Sex': 0, 'Sáb': 0, 'Dom': 0
    };

    ultimos7Dias.forEach((dia, idx) => {
        const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const hoje = new Date();
        const diaData = new Date(hoje);
        diaData.setDate(hoje.getDate() - (6 - idx));
        const nomeDia = dias[diaData.getDay()];
        horasPorDia[nomeDia] = parseFloat(dia[1]) || 0;
    });

    return {
        horasSemana: parseFloat(horasSemana.toFixed(1)),
        taxaAcerto: parseFloat((taxaAcerto * 100).toFixed(0)),
        horasPorDia,
        questoesTotais,
        acertosTotais,
    };
}

// Processar dados de skills
export function processarSkills(skillsData) {
    const skillsDominadas = skillsData.filter(skill => {
        const percentual = parseFloat(skill[3]) || 0;
        return percentual >= 0.80;
    }).length;

    return {
        total: skillsData.length,
        dominadas: skillsDominadas,
        percentual: skillsData.length > 0 ? skillsDominadas / skillsData.length : 0,
    };
}

// Buscar último simulado
export function obterUltimoSimulado(simulados) {
    if (!simulados || simulados.length === 0) return null;

    const ultimo = simulados[simulados.length - 1];
    return {
        data: ultimo[0],
        tipo: ultimo[1],
        questoes: parseInt(ultimo[2]) || 0,
        acertos: parseInt(ultimo[3]) || 0,
        percentual: parseFloat(ultimo[4]) || 0,
        status: ultimo[5] || '',
    };
}

export default {
    buscarDadosDashboard,
    calcularMetricas,
    processarSkills,
    obterUltimoSimulado,
};
