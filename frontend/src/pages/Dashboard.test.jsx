import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useVDPStore } from '@/stores/vdpStore';
import { vi } from 'vitest';

// Mock store
vi.mock('@/stores/vdpStore');

// Mock child components to simplify test (shallow render-ish)
vi.mock('@/components/dashboard/CardPrazo', () => ({ CardPrazo: () => <div data-testid="card-prazo">Prazo</div> }));
vi.mock('@/components/dashboard/CardConsistencia', () => ({ CardConsistencia: () => <div data-testid="card-consistencia">Consistencia</div> }));
vi.mock('@/components/dashboard/CardPerformance', () => ({ CardPerformance: () => <div data-testid="card-performance">Performance</div> }));
vi.mock('@/components/dashboard/CardSkills', () => ({ CardSkills: () => <div data-testid="card-skills">Skills</div> }));
vi.mock('@/components/dashboard/CardSimulado', () => ({ CardSimulado: () => <div data-testid="card-simulado">Simulado</div> }));
vi.mock('@/components/dashboard/CardRecomendacao', () => ({ CardRecomendacao: () => <div data-testid="card-recomendacao">Recomendacao</div> }));

describe('Dashboard', () => {
    it('renders all 6 cards', () => {
        // Mock store return
        useVDPStore.mockReturnValue({
            prazoProjetado: 100,
            status: 'Ok',
            diferenca: 0,
            historyData: [],
            horasSemana: 10,
            metaHoras: 15,
            weeklyData: [],
            taxaAcerto: 80,
            breakdownData: [],
            skillsDominadas: 5,
            totalSkills: 10,
            skillsData: [],
            ultimoSimulado: { tipo: 'A', acerto: 80, tempo: '1h', progresso: '1/1' },
            recomendacao: 'Test'
        });

        // Also mock the updating function selector if used separately
        // But in our component we use state => state.dados and state => state.atualizarDados
        // So we need to adjust the mock implementation to handle selector
        useVDPStore.mockImplementation((selector) => {
            const state = {
                dados: {
                    prazoProjetado: 100,
                    status: 'Ok',
                    diferenca: 0,
                    historyData: [],
                    horasSemana: 10,
                    metaHoras: 15,
                    weeklyData: [],
                    taxaAcerto: 80,
                    breakdownData: [],
                    skillsDominadas: 5,
                    totalSkills: 10,
                    skillsData: [],
                    ultimoSimulado: { tipo: 'A', acerto: 80, tempo: '1h', progresso: '1/1' },
                    recomendacao: 'Test'
                },
                atualizarDados: vi.fn()
            };
            return selector(state);
        });

        render(<Dashboard />);

        expect(screen.getByTestId('card-prazo')).toBeInTheDocument();
        expect(screen.getByTestId('card-consistencia')).toBeInTheDocument();
        expect(screen.getByTestId('card-performance')).toBeInTheDocument();
        expect(screen.getByTestId('card-skills')).toBeInTheDocument();
        expect(screen.getByTestId('card-simulado')).toBeInTheDocument();
        expect(screen.getByTestId('card-recomendacao')).toBeInTheDocument();
    });
});
