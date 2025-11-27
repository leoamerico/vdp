/**
 * Calcula o Prazo Projetado (PP) baseado em métricas de estudo.
 * @param {number} HSR - Horas Semanais Reais (média 4 semanas)
 * @param {number} TEA - Taxa de Eficiência de Aprendizado (0.5 a 1.5)
 * @param {number} SD - Skills Dominadas (0 a 12)
 * @param {number} RS - Ritmo de Simulados (simulados/mês)
 * @param {number} CR - Complexidade Restante (0 a 100)
 * @returns {number} Dias restantes estimados
 */
export function calcularPrazoProjetado(HSR, TEA, SD, RS, CR) {
    // Fórmula base fictícia para o MVP:
    // Base: 100 dias
    // Fator HSR: quanto mais horas, menos dias. (Base 10h/sem)
    // Fator TEA: eficiência reduz tempo.
    // Fator SD: cada skill reduz 5 dias.
    // Fator RS: simulados aceleram revisão.

    const baseDias = 120;
    const fatorHoras = 10 / Math.max(HSR, 1); // Evitar divisão por zero
    const reducaoSkills = SD * 5;
    const reducaoSimulados = RS * 2;

    // Ajuste pela complexidade restante (se alta, aumenta prazo)
    const fatorComplexidade = 1 + (CR / 200);

    let diasEstimados = (baseDias * fatorHoras * (1 / TEA) * fatorComplexidade) - reducaoSkills - reducaoSimulados;

    return Math.max(Math.round(diasEstimados), 0); // Não retornar negativo
}

/**
 * Gera recomendação baseada em erros e performance.
 * @param {string} erroDominante - Área com maior taxa de erro
 * @param {Array} skillsFracas - Lista de skills com < 70% acerto
 * @param {object} ultimoSimulado - Dados do último simulado
 * @returns {string} Texto de recomendação
 */
export function gerarRecomendacao(erroDominante, skillsFracas, ultimoSimulado) {
    if (ultimoSimulado && ultimoSimulado.acerto < 70) {
        return `Alerta: Seu último simulado (${ultimoSimulado.acerto}%) indica necessidade de revisão em ${erroDominante}.`;
    }

    if (skillsFracas.length > 0) {
        return `Prioridade: Focar em elevar ${skillsFracas[0]} para > 70%.`;
    }

    if (erroDominante) {
        return `Sugestão: Realizar bateria de 20 questões de ${erroDominante} para fixação.`;
    }

    return "Excelente progresso! Mantenha o ritmo com um novo simulado esta semana.";
}
