import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

console.log('🔍 Descobrindo estrutura da planilha...\n');

async function descobrirEstrutura() {
    try {
        // Buscar metadata completa da planilha
        const url = `${BASE_URL}/${SPREADSHEET_ID}?key=${API_KEY}`;
        const response = await axios.get(url);

        const planilha = response.data;

        console.log('📊 PLANILHA:', planilha.properties.title);
        console.log('─────────────────────────────────────────\n');

        console.log('📑 ABAS ENCONTRADAS:');
        console.log('─────────────────────────────────────────');

        planilha.sheets.forEach((sheet, index) => {
            const props = sheet.properties;
            console.log(`${index + 1}. "${props.title}"`);
            console.log(`   → ID: ${props.sheetId}`);
            console.log(`   → Linhas: ${props.gridProperties.rowCount}`);
            console.log(`   → Colunas: ${props.gridProperties.columnCount}`);
            console.log('');
        });

        // Tentar ler dados de cada aba
        console.log('📋 TESTANDO LEITURA DE DADOS:');
        console.log('─────────────────────────────────────────');

        for (const sheet of planilha.sheets) {
            const sheetName = sheet.properties.title;
            const range = `${sheetName}!A1:Z10`; // Primeiras 10 linhas, 26 colunas

            try {
                const dataUrl = `${BASE_URL}/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
                const dataResponse = await axios.get(dataUrl);

                const rows = dataResponse.data.values || [];
                console.log(`✅ "${sheetName}"`);
                console.log(`   → ${rows.length} linhas com dados`);

                if (rows.length > 0) {
                    console.log(`   → Primeira linha: ${rows[0].slice(0, 5).join(', ')}${rows[0].length > 5 ? '...' : ''}`);
                }
                console.log('');
            } catch (error) {
                console.log(`❌ "${sheetName}" - Erro: ${error.message}`);
                console.log('');
            }
        }

        // Sugestão de mapeamento
        console.log('💡 SUGESTÃO DE CONFIGURAÇÃO:');
        console.log('─────────────────────────────────────────');
        console.log('Com base nas abas encontradas, você pode:');
        console.log('');
        console.log('1. Renomear as abas existentes para:');
        console.log('   - Dashboard');
        console.log('   - Daily_Tracking');
        console.log('   - Simulados');
        console.log('   - Skills_Progress');
        console.log('');
        console.log('2. OU adaptar o código api.js para usar as abas atuais.');
        console.log('');
        console.log('Qual aba você quer usar para cada tipo de dado?');

    } catch (error) {
        console.error('❌ Erro ao descobrir estrutura:', error.message);
    }
}

export default descobrirEstrutura;
