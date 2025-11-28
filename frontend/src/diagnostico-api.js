import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

console.log('🔍 ========================================');
console.log('🔍 DIAGNÓSTICO COMPLETO - GOOGLE SHEETS API');
console.log('🔍 ========================================\n');

// Teste 1: Verificar variáveis de ambiente
console.log('📋 TESTE 1: Variáveis de Ambiente');
console.log('─────────────────────────────────────────');
console.log('API_KEY carregada:', API_KEY ? '✅ SIM' : '❌ NÃO');
if (API_KEY) {
    console.log('  → Primeiros 10 caracteres:', API_KEY.substring(0, 10) + '...');
    console.log('  → Tamanho:', API_KEY.length, 'caracteres');
    console.log('  → Formato válido:', API_KEY.startsWith('AIza') ? '✅ SIM' : '⚠️  Suspeito');
}
console.log('SPREADSHEET_ID carregado:', SPREADSHEET_ID ? '✅ SIM' : '❌ NÃO');
if (SPREADSHEET_ID) {
    console.log('  → Primeiros 10 caracteres:', SPREADSHEET_ID.substring(0, 10) + '...');
    console.log('  → Tamanho:', SPREADSHEET_ID.length, 'caracteres');
}
console.log('');

// Teste 2: Verificar acesso básico à planilha (metadata)
async function testeMetadata() {
    console.log('📋 TESTE 2: Acesso à Planilha (Metadata)');
    console.log('─────────────────────────────────────────');

    try {
        const url = `${BASE_URL}/${SPREADSHEET_ID}?key=${API_KEY}&fields=properties(title)`;
        console.log('  → URL:', url.replace(API_KEY, 'API_KEY_HIDDEN'));

        const response = await axios.get(url);
        console.log('✅ SUCESSO! Planilha acessível');
        console.log('  → Nome da planilha:', response.data.properties.title);
        return true;
    } catch (error) {
        console.error('❌ ERRO ao acessar metadata');
        console.error('  → Status:', error.response?.status);
        console.error('  → Mensagem:', error.response?.data?.error?.message || error.message);

        if (error.response?.status === 403) {
            console.error('\n⚠️  ERRO 403 - Possíveis causas:');
            console.error('  1. API Key inválida ou expirada');
            console.error('  2. API Key com restrições (IP/Referrer)');
            console.error('  3. Google Sheets API não ativada no projeto');
            console.error('  4. Planilha privada (sem compartilhamento público)');
        } else if (error.response?.status === 404) {
            console.error('\n⚠️  ERRO 404 - Planilha não encontrada');
            console.error('  → Verifique se o SPREADSHEET_ID está correto');
        } else if (error.response?.status === 400) {
            console.error('\n⚠️  ERRO 400 - API Key inválida');
            console.error('  → A API Key não tem o formato correto');
        }

        if (error.response?.data) {
            console.error('\n📄 Detalhes completos do erro:');
            console.error(JSON.stringify(error.response.data, null, 2));
        }

        return false;
    }
}

// Teste 3: Testar leitura de uma célula específica
async function testeLeituraCelula() {
    console.log('\n📋 TESTE 3: Leitura de Célula Específica');
    console.log('─────────────────────────────────────────');

    try {
        const range = 'Dashboard!B7'; // Prazo Projetado
        const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
        console.log('  → Range:', range);

        const response = await axios.get(url);
        console.log('✅ SUCESSO! Célula lida');
        console.log('  → Valor:', response.data.values?.[0]?.[0] || 'VAZIO');
        return true;
    } catch (error) {
        console.error('❌ ERRO ao ler célula');
        console.error('  → Status:', error.response?.status);
        console.error('  → Mensagem:', error.response?.data?.error?.message || error.message);
        return false;
    }
}

// Teste 4: Testar batchGet (múltiplas ranges)
async function testeBatchGet() {
    console.log('\n📋 TESTE 4: Leitura em Lote (batchGet)');
    console.log('─────────────────────────────────────────');

    try {
        const testRanges = [
            'Dashboard!B7',
            'Dashboard!B8',
            'Dashboard!B9',
        ];

        // Construir URL manualmente para evitar problemas com serialização de arrays
        const rangesParam = testRanges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
        const url = `${BASE_URL}/${SPREADSHEET_ID}/values:batchGet?key=${API_KEY}&${rangesParam}`;

        console.log('  → Ranges:', testRanges.join(', '));

        const response = await axios.get(url);

        console.log('✅ SUCESSO! Múltiplas células lidas');
        response.data.valueRanges.forEach((range, idx) => {
            console.log(`  → ${testRanges[idx]}: ${range.values?.[0]?.[0] || 'VAZIO'}`);
        });
        return true;
    } catch (error) {
        console.error('❌ ERRO ao ler múltiplas células');
        console.error('  → Status:', error.response?.status);
        console.error('  → Mensagem:', error.response?.data?.error?.message || error.message);
        return false;
    }
}

// Executar todos os testes
async function executarTestes() {
    console.log('🚀 Iniciando testes...\n');

    // Teste 1 é síncrono (já executado acima)

    // Teste 2
    const teste2 = await testeMetadata();

    if (!teste2) {
        console.log('\n⛔ Testes interrompidos - Falha no acesso básico à planilha');
        console.log('   Corrija o problema acima antes de continuar.\n');
        return;
    }

    // Teste 3
    const teste3 = await testeLeituraCelula();

    // Teste 4
    const teste4 = await testeBatchGet();

    // Resumo
    console.log('\n📊 ========================================');
    console.log('📊 RESUMO DOS TESTES');
    console.log('📊 ========================================');
    console.log('Teste 1 (Env Vars):', API_KEY && SPREADSHEET_ID ? '✅ PASSOU' : '❌ FALHOU');
    console.log('Teste 2 (Metadata):', teste2 ? '✅ PASSOU' : '❌ FALHOU');
    console.log('Teste 3 (Célula):', teste3 ? '✅ PASSOU' : '❌ FALHOU');
    console.log('Teste 4 (BatchGet):', teste4 ? '✅ PASSOU' : '❌ FALHOU');

    if (teste2 && teste3 && teste4) {
        console.log('\n🎉 TODOS OS TESTES PASSARAM!');
        console.log('   A integração está funcionando corretamente.');
        console.log('   Se o dashboard não está mostrando dados, o problema');
        console.log('   pode estar no mapeamento de dados no vdpStore.js\n');
    } else {
        console.log('\n⚠️  ALGUNS TESTES FALHARAM');
        console.log('   Verifique os erros acima e corrija antes de prosseguir.\n');
    }
}

export default executarTestes;
