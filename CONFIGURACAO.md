# ✅ Configuração VDP - Google Sheets

## 📊 Status da Sua Planilha

Sua planilha já está **corretamente estruturada**!

### Abas Encontradas

- ✅ **Dashboard** - 7 linhas com dados
- ✅ **Daily_Tracking** - 8 linhas com dados  
- ✅ **Simulados** - 5 linhas com dados
- ✅ **Skills_Progress** - 0 linhas (vazia, mas pronta para uso)

---

## 🔧 Próximos Passos

### 1️⃣ Criar arquivo `.env` no frontend

Crie o arquivo `d:\antigravity\vdp\frontend\.env` com o seguinte conteúdo:

```env
VITE_GOOGLE_API_KEY=[SEU_API_KEY]
VITE_SPREADSHEET_ID=[SEU_SPREADSHEET_ID]
```

> **⚠️ IMPORTANTE**: Verifique se o `SPREADSHEET_ID` acima é o ID correto da **sua** planilha. Se não for, substitua pelo ID correto.

### 2️⃣ Verificar Permissões da Planilha

1. Abra sua planilha no Google Sheets
2. Clique em **"Compartilhar"** (canto superior direito)
3. Em **"Acesso geral"**, selecione: **"Qualquer pessoa com o link"**
4. Permissão: **"Leitor"**
5. Clique em **"Concluído"**

### 3️⃣ Verificar API Key

A API Key no `.env.example` é a mesma que você está usando? Se sim, verifique:

1. Acesse: <https://console.cloud.google.com/apis/credentials>
2. Verifique se a API Key está ativa
3. Confirme que a **Google Sheets API v4** está habilitada no projeto

### 4️⃣ Reiniciar o Servidor de Desenvolvimento

```bash
# No terminal, dentro da pasta frontend:
cd d:\antigravity\vdp\frontend

# Parar o servidor (Ctrl+C se estiver rodando)

# Iniciar novamente
bun dev
```

### 5️⃣ Testar a Conexão

Acesse no navegador:

```
http://localhost:5173/diagnostico.html
```

Clique em **"🔎 Descobrir Estrutura"** e verifique se os dados aparecem.

---

## 📋 Mapeamento de Dados

O código `api.js` já está configurado para buscar os dados corretamente:

| Aba Google Sheets | Range na API | Dados Buscados |
|-------------------|--------------|----------------|
| `Dashboard` | `B7` | Prazo Projetado |
| `Dashboard` | `B8` | Prazo Anterior |
| `Dashboard` | `B9` | Diferença |
| `Dashboard` | `B10` | Status |
| `Daily_Tracking` | `B:G` | Horas, Questões, Acertos, Taxa, Área |
| `Simulados` | `A2:F20` | Histórico de simulados |
| `Skills_Progress` | `A2:E13` | 12 Skills de conhecimento |

---

## 🎯 Estrutura Esperada vs Encontrada

### ✅ Tudo Está Correto

Suas abas já têm os nomes corretos que o código espera:

- ✅ `Dashboard` (não `Painel` ou `Métricas`)
- ✅ `Daily_Tracking` (não `Diário` ou `Tracking`)
- ✅ `Simulados` (não `Exames` ou `Testes`)
- ✅ `Skills_Progress` (não `Habilidades` ou `Progresso`)

**Não é necessário renomear nada!**

---

## 🔍 Verificação dos Dados

### Dashboard (Aba 1)

Certifique-se de que as células têm os valores corretos:

- `B7`: Prazo Projetado (número, ex: 72)
- `B8`: Prazo Anterior (número, ex: 180)
- `B9`: Diferença (número, ex: -108)
- `B10`: Status (texto, ex: "Excelente")

### Daily_Tracking (Aba 2)

Estrutura esperada (primeira linha = cabeçalho):

```
| Data       | Horas | Questões | Acertos | Taxa | Área      | Observações |
|------------|-------|----------|---------|------|-----------|-------------|
| 2025-11-20 | 2.5   | 50       | 41      | 82%  | Processos |             |
```

### Simulados (Aba 3)

Estrutura esperada:

```
| Data       | Tipo | Questões | Acertos | % | Status         |
|------------|------|----------|---------|---|----------------|
| 2025-11-01 | 180Q | 180      | 120     | 67% | Em progresso |
```

### Skills_Progress (Aba 4)

Estrutura esperada:

```
| Skill      | Questões | Acertos | % | Status    |
|------------|----------|---------|---|-----------|
| Integração | 120      | 102     | 85% | Dominada |
```

---

## ❓ Troubleshooting

### Erro 403 (Forbidden)

- Verifique se a planilha está compartilhada publicamente
- Confirme se a API Key está correta
- Verifique se a Google Sheets API está habilitada

### Dados não aparecem

- Verifique se o arquivo `.env` está na pasta `frontend/`
- Reinicie o servidor de desenvolvimento
- Abra o Console do navegador (F12) e veja se há erros

### "Cannot read properties of undefined"

- Verifique se as células no Google Sheets têm valores
- Confirme que os nomes das abas estão exatamente como esperado

---

## 📞 Próximo Passo

Depois de criar o arquivo `.env` e reiniciar o servidor:

1. Acesse `http://localhost:5173/diagnostico.html`
2. Clique em "🔎 Descobrir Estrutura"
3. Se os dados aparecerem corretamente, acesse o dashboard principal
4. Todos os cards devem mostrar dados reais da planilha!

---

## 🎉 Sucesso

Quando tudo estiver funcionando, você verá:

- ⏱️ **Prazo Projetado** com o valor real da célula B7
- 📊 **Gráficos** com dados reais do Daily_Tracking
- 📈 **Simulados** com histórico real
- 🎯 **Skills** com progresso real

**Sua planilha já está pronta! Só falta conectar! 🚀**
