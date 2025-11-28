# 🔧 CORREÇÃO URGENTE - Erro 400 Bad Request

## ❌ Problema Identificado

O erro **400 Bad Request** está acontecendo porque o **Spreadsheet ID no arquivo `.env` está incorreto**.

### IDs Encontrados

1. **ID no `.env.example`**: [SEU_SPREADSHEET_ID]
2. **ID sendo usado pela aplicação**: [SEU_SPREADSHEET_ID]

---

## ✅ Solução Imediata

### Passo 1: Identificar o ID Correto da Sua Planilha

Abra sua planilha no Google Sheets e copie o ID da URL:

```
https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
```

**Exemplo:**

```
https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
                                       ↑ Este é o ID ↑
```

### Passo 2: Atualizar o Arquivo `.env`

1. Abra o arquivo: `d:\antigravity\vdp\frontend\.env`
2. Atualize a linha do `VITE_SPREADSHEET_ID` com o ID correto:

```env
VITE_GOOGLE_API_KEY=[SEU_API_KEY]
VITE_SPREADSHEET_ID=[SEU_ID_CORRETO_AQUI]
```

**⚠️ IMPORTANTE**: Substitua `SEU_ID_CORRETO_AQUI` pelo ID real da sua planilha!

### Passo 3: Reiniciar o Servidor

Depois de salvar o `.env`, **você DEVE reiniciar o servidor**:

```bash
# No terminal onde está rodando "bun dev":
# 1. Pressione Ctrl+C para parar
# 2. Execute novamente:
bun dev
```

---

## 🔍 Como Verificar se Funcionou

Depois de reiniciar o servidor:

1. Acesse: `http://localhost:5173/`
2. Abra o DevTools (F12) → Console
3. Você **NÃO** deve mais ver erros 400
4. Os cards devem carregar com dados reais da planilha

---

## 📋 Checklist de Verificação

Antes de reiniciar, confirme:

- [ ] Copiei o ID correto da URL da minha planilha
- [ ] Atualizei o arquivo `.env` em `frontend/.env` (não `.env.example`)
- [ ] Salvei o arquivo `.env`
- [ ] Vou reiniciar o servidor com Ctrl+C e depois `bun dev`

---

## 🆘 Se Ainda Não Funcionar

Se após seguir os passos acima o erro persistir, verifique:

### 1. Permissões da Planilha

A planilha está compartilhada publicamente?

1. Abra a planilha no Google Sheets
2. Clique em **"Compartilhar"**
3. Em **"Acesso geral"**, selecione: **"Qualquer pessoa com o link"**
4. Permissão: **"Leitor"**

### 2. API Key Válida

A API Key está ativa?

1. Acesse: <https://console.cloud.google.com/apis/credentials>
2. Verifique se a API Key `[SEU_API_KEY]` está ativa
3. Confirme que a **Google Sheets API v4** está habilitada

### 3. Arquivo `.env` no Lugar Certo

O arquivo `.env` está em `frontend/.env`? (NÃO na raiz do projeto)

```
d:\antigravity\vdp\
├── frontend/
│   ├── .env          ← AQUI!
│   ├── .env.example
│   ├── src/
│   └── ...
└── ...
```

---

## 💡 Dica Rápida

Para descobrir qual planilha você está usando, execute no terminal:

```bash
cd d:\antigravity\vdp\frontend
type .env
```

Isso mostrará o conteúdo do seu `.env` atual.

---

## 🎯 Próximo Passo

1. **Atualize o `.env` com o ID correto**
2. **Reinicie o servidor** (Ctrl+C e `bun dev`)
3. **Teste novamente** em `http://localhost:5173/`

O erro 400 deve desaparecer! 🚀
