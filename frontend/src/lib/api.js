import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

// Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    params: {
        key: API_KEY,
    },
});

// Retry logic (3x) with exponential backoff
axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on network errors or 429 (Too Many Requests) or 5xx
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
    },
});

// Simple rate limiting (1 request per second average to stay safe within 100/100s)
// Using a promise-based delay queue
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

api.interceptors.request.use(async (config) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    lastRequestTime = Date.now();
    return config;
});

// Caching helper
const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch (e) {
            console.error('Error parsing cached data', e);
            return null;
        }
    }
    return null;
};

const setCachedData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving to cache', e);
    }
};

// API Functions

export const buscarDadosDashboard = async () => {
    const cacheKey = 'vdp_dashboard_data';
    try {
        // Batch get for multiple ranges: Dashboard!A1:Z, Daily_Tracking!A1:Z
        const response = await api.get('/values:batchGet', {
            params: {
                ranges: ['Dashboard!A1:Z20', 'Daily_Tracking!A1:Z100'],
            },
        });

        const data = response.data;
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const cached = getCachedData(cacheKey);
        if (cached) {
            console.warn('Serving cached dashboard data due to API error.');
            return cached;
        }
        throw error;
    }
};

export const salvarDadosDiarios = async (dados) => {
    try {
        // Append to Daily_Tracking sheet
        // Note: This requires OAuth 2.0 token usually, API Key is read-only for private sheets usually.
        // Assuming for this MVP we might be using a proxy or the user has set up appropriate auth.
        // If strictly API Key, we can only READ public sheets. 
        // For WRITE, we need an access token.
        // For now, implementing the call structure.

        const response = await api.post('/values/Daily_Tracking!A1:append', {
            values: [dados],
        }, {
            params: {
                valueInputOption: 'USER_ENTERED',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving daily data:', error);
        throw error;
    }
};

export const buscarHistoricoSimulados = async () => {
    const cacheKey = 'vdp_simulados_data';
    try {
        const response = await api.get('/values/Simulados!A1:Z');
        const data = response.data;
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching simulados:', error);
        const cached = getCachedData(cacheKey);
        if (cached) return cached;
        throw error;
    }
};

export const buscarSkillsProgress = async () => {
    const cacheKey = 'vdp_skills_data';
    try {
        const response = await api.get('/values/Skills_Progress!A1:Z');
        const data = response.data;
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching skills:', error);
        const cached = getCachedData(cacheKey);
        if (cached) return cached;
        throw error;
    }
};
