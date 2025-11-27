import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { buscarDadosDashboard } from './api';

vi.mock('axios');

describe('api client', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock axios create to return a mocked instance
        axios.create.mockReturnThis();
    });

    it('buscarDadosDashboard returns data on success', async () => {
        const mockData = { values: [['Test']] };
        axios.get.mockResolvedValue({ data: mockData });

        const data = await buscarDadosDashboard();
        expect(data).toEqual(mockData);
    });

    it('buscarDadosDashboard falls back to cache on error', async () => {
        const mockCache = { values: [['Cached']] };
        localStorage.setItem('vdp_dashboard_data', JSON.stringify(mockCache));

        axios.get.mockRejectedValue(new Error('Network Error'));

        // Mock console.error/warn to keep output clean
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'warn').mockImplementation(() => { });

        const data = await buscarDadosDashboard();
        expect(data).toEqual(mockCache);
    });
});
