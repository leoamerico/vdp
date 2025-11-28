# 📊 Template de Planilha VDP - Google Sheets

## Instruções para Criar a Planilha

### 1. Criar Nova Planilha

1. Acesse: <https://sheets.google.com>
2. Crie uma nova planilha
3. Renomeie para "VDP - Visor Dinâmico de Progresso"

### 2. Criar as Abas (Sheets)

Crie 4 abas com os seguintes nomes:

- `Dashboard`
- `Daily_Tracking`
- `Simulados`
- `Skills_Progress`

---

## 📋 ABA 1: Dashboard

### Estrutura

| A | B | C |
|---|---|---|
| **Métrica** | **Valor** | **Observação** |
| Prazo Inicial | 180 | dias |
| Prazo Projetado | 72 | dias |
| Prazo Anterior | 180 | dias |
| Diferença | -108 | dias |
| Status | Excelente | |
| Meta Horas/Semana | 15 | horas |

### Células Importantes

- `B7`: Prazo Projetado (ex: 72)
- `B8`: Prazo Anterior (ex: 180)
- `B9`: Diferença (ex: -108)
- `B10`: Status (ex: "Excelente")

---

## 📋 ABA 2: Daily_Tracking

### Estrutura

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Data** | **Horas** | **Questões** | **Acertos** | **Taxa** | **Área** | **Observações** |
| 2025-11-20 | 2.5 | 50 | 41 | 82% | Processos | |
| 2025-11-21 | 3.0 | 60 | 50 | 83% | Integração | |
| 2025-11-22 | 1.5 | 30 | 25 | 83% | Escopo | |
| 2025-11-23 | 4.0 | 80 | 66 | 82% | Tempo | |
| 2025-11-24 | 0 | 0 | 0 | 0% | - | Descanso |
| 2025-11-25 | 0 | 0 | 0 | 0% | - | Descanso |
| 2025-11-26 | 0 | 0 | 0 | 0% | - | Descanso |

### Colunas

- **B**: Horas de estudo
- **C**: Questões feitas
- **D**: Questões acertadas
- **E**: Taxa de acerto (calculada)
- **F**: Área de conhecimento
- **G**: Observações

---

## 📋 ABA 3: Simulados

### Estrutura

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **Data** | **Tipo** | **Questões** | **Acertos** | **%** | **Status** |
| 2025-11-01 | 180Q | 180 | 120 | 67% | Em progresso |
| 2025-11-08 | 180Q | 180 | 128 | 71% | Em progresso |
| 2025-11-15 | 180Q | 180 | 132 | 73% | Em progresso |
| 2025-11-22 | 180Q | 180 | 135 | 75% | Em progresso |

### Colunas

- **A**: Data do simulado
- **B**: Tipo (180Q, 90Q, etc.)
- **C**: Total de questões
- **D**: Questões acertadas
- **E**: Percentual de acerto
- **F**: Status

---

## 📋 ABA 4: Skills_Progress

### Estrutura

| A | B | C | D | E |
|---|---|---|---|---|
| **Skill** | **Questões** | **Acertos** | **%** | **Status** |
| Integração | 120 | 102 | 85% | Dominada |
| Escopo | 100 | 85 | 85% | Dominada |
| Cronograma | 110 | 92 | 84% | Dominada |
| Custos | 95 | 80 | 84% | Dominada |
| Qualidade | 88 | 73 | 83% | Dominada |
| Recursos | 90 | 74 | 82% | Dominada |
| Comunicações | 85 | 69 | 81% | Dominada |
| Riscos | 92 | 74 | 80% | Dominada |
| Aquisições | 75 | 52 | 69% | Em Progresso |
| Partes Interessadas | 70 | 45 | 64% | Em Progresso |
| Mindset PMI | 65 | 35 | 54% | Em Progresso |
| Processos | 60 | 30 | 50% | A Melhorar |

### Colunas

- **A**: Nome da skill
- **B**: Total de questões feitas
- **C**: Questões acertadas
- **D**: Percentual (C/B)
- **E**: Status (Dominada ≥80%, Em Progresso ≥50%, A Melhorar <50%)

---

## 🔧 Configuração Final

### 1. Compartilhar Planilha

1. Clique em "Compartilhar" (canto superior direito)
2. Em "Acesso geral", selecione: **"Qualquer pessoa com o link"**
3. Permissão: **Leitor**
4. Copie o link da planilha

### 2. Obter o ID da Planilha

O ID está na URL da planilha:

```
https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit
```

Exemplo:

```
https://docs.google.com/spreadsheets/d/[SEU_ID_AQUI]/edit
                                      ↑ Este é o ID
```

### 3. Atualizar .env

```env
VITE_GOOGLE_API_KEY=[SEU_API_KEY]
VITE_SPREADSHEET_ID=[SEU_ID_AQUI]
```

### 4. Reiniciar o Servidor

```bash
# Ctrl+C para parar
bun dev
```

---

## ✅ Verificação

Após configurar, acesse:

- `http://localhost:5173/diagnostico.html`
- Clique em "🔎 Descobrir Estrutura"
- Deve mostrar as 4 abas com dados

---

## 📌 Notas Importantes

1. **Fórmulas Úteis** (para a aba Dashboard):
   - Taxa de Acerto Geral: `=AVERAGE(Daily_Tracking!E:E)`
   - Horas Semana Atual: `=SUM(Daily_Tracking!B2:B8)`

2. **Atualização Automática**:
   - O VDP busca dados a cada vez que você abre o dashboard
   - Basta atualizar a planilha e recarregar a página

3. **Segurança**:
   - Nunca compartilhe sua API Key
   - O arquivo `.env` está no `.gitignore` (não vai para o GitHub)
