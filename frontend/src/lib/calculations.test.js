import { describe, it, expect } from 'vitest';
import { calcularPrazoProjetado, gerarRecomendacao } from './calculations';

describe('calcularPrazoProjetado', () => {
    // HSR, TEA, SD, RS, CR

    it('Cenário Padrão: Ritmo médio', () => {
        // 10h/sem, TEA 1.0, 0 skills, 0 simulados, CR 0
        // Base 120 * 1 * 1 * 1 = 120
        expect(calcularPrazoProjetado(10, 1.0, 0, 0, 0)).toBe(120);
    });

    it('Cenário Acelerado: Alta carga horária e eficiência', () => {
        // 20h/sem (fator 0.5), TEA 1.2 (fator ~0.83), 2 skills (-10), 1 simulado (-2)
        // 120 * 0.5 * (1/1.2) = 50 - 10 - 2 = 38
        expect(calcularPrazoProjetado(20, 1.2, 2, 1, 0)).toBe(38);
    });

    it('Cenário Lento: Baixa carga e eficiência', () => {
        // 5h/sem (fator 2), TEA 0.8 (fator 1.25)
        // 120 * 2 * 1.25 = 300
        expect(calcularPrazoProjetado(5, 0.8, 0, 0, 0)).toBe(300);
    });

    it('Limite Inferior: Muitas skills e simulados (não deve ser negativo)', () => {
        // 20h/sem, TEA 1.5, 12 skills (-60), 10 simulados (-20)
        // 120 * 0.5 * 0.66 = 40 - 60 - 20 = -40 -> 0
        expect(calcularPrazoProjetado(20, 1.5, 12, 10, 0)).toBe(0);
    });

    it('Complexidade Alta: Aumenta prazo', () => {
        // 10h/sem, TEA 1.0, CR 100 (fator 1.5)
        // 120 * 1 * 1 * 1.5 = 180
        expect(calcularPrazoProjetado(10, 1.0, 0, 0, 100)).toBe(180);
    });
});

describe('gerarRecomendacao', () => {
    it('Prioriza erro em simulado recente', () => {
        const rec = gerarRecomendacao('Processos', [], { acerto: 60 });
        expect(rec).toContain('Alerta: Seu último simulado');
    });

    it('Prioriza skills fracas se simulado ok', () => {
        const rec = gerarRecomendacao('Processos', ['Agile'], { acerto: 80 });
        expect(rec).toContain('Prioridade: Focar em elevar Agile');
    });

    it('Sugere bateria se sem skills fracas', () => {
        const rec = gerarRecomendacao('Pessoas', [], { acerto: 80 });
        expect(rec).toContain('Sugestão: Realizar bateria');
    });

    it('Parabeniza se tudo ok', () => {
        const rec = gerarRecomendacao(null, [], { acerto: 80 });
        expect(rec).toContain('Excelente progresso');
    });
});
