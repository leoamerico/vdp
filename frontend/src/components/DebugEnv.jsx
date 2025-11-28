import React, { useEffect, useState } from 'react';

export function DebugEnv() {
    const [envVars, setEnvVars] = useState({});

    useEffect(() => {
        setEnvVars({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
        });
    }, []);

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            background: '#1e293b',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 9999
        }}>
            <div>🔑 API Key: {envVars.apiKey ? `${envVars.apiKey.substring(0, 8)}...` : '❌ NÃO CARREGADA'}</div>
            <div>📄 Sheet ID: {envVars.spreadsheetId ? `${envVars.spreadsheetId.substring(0, 8)}...` : '❌ NÃO CARREGADO'}</div>
        </div>
    );
}
