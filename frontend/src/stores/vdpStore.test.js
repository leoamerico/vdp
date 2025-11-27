import { describe, it, expect, beforeEach } from 'vitest';
import { useVDPStore } from '../stores/vdpStore';

describe('vdpStore', () => {
    beforeEach(() => {
        useVDPStore.setState({
            dados: {
                prazoProjetado: 100,
                horasSemana: 0,
                ultimoSimulado: { acerto: 0 },
                recomendacao: ''
            }
        });
    });

    it('registrarDiaEstudo atualiza horasSemana', () => {
        const { registrarDiaEstudo } = useVDPStore.getState();
        registrarDiaEstudo(5);
        expect(useVDPStore.getState().dados.horasSemana).toBe(5);
        registrarDiaEstudo(3);
        expect(useVDPStore.getState().dados.horasSemana).toBe(8);
    });

    it('salvarSimulado atualiza dados e gera recomendação', () => {
        const { salvarSimulado } = useVDPStore.getState();
        salvarSimulado({ acerto: 60, tipo: 'Test' });

        const state = useVDPStore.getState().dados;
        expect(state.ultimoSimulado.acerto).toBe(60);
        expect(state.recomendacao).toContain('Alerta'); // Based on logic < 70%
    });
});
