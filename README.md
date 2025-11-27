```markdown
# VDP - Visor Dinâmico de Progresso | PMP Tracker

## Objetivo
Sistema inteligente de acompanhamento e otimização de estudos para certificação PMP, baseado em Prática Deliberada (Ericsson). Calcula dinamicamente o prazo de aprovação através de algoritmos de análise de performance, oferecendo feedback imediato e recomendações personalizadas para acelerar a certificação de 180 dias (padrão) para 60-90 dias (otimizado).

## Stack Tecnológica

### Frontend
- **Framework**: React 18+ com Vite
- **Linguagem**: JavaScript (ES6+) / TypeScript (opcional)
- **Styling**: TailwindCSS 3.4+
- **State Management**: Zustand
- **Charts**: Recharts
- **Routing**: React Router 6
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

### Backend / Data Layer
- **Primary Data Source**: Google Sheets API v4
- **Authentication**: Google OAuth 2.0
- **Real-time Updates**: Polling (5min interval)
- **Alternative Backend** (futuro): Node.js + Express ou Python + FastAPI

### Infra
- **Desenvolvimento**: Windows 10/11 (local dev server)
- **Build Tool**: Vite (HMR + optimized builds)
- **Package Manager**: npm ou yarn
- **Deployment**: Netlify / Vercel (frontend) + Google Cloud (backend)
- **Version Control**: Git + GitHub

## Arquitetura do Sistema

### Visão Geral
```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Dashboard  │  │  Simulados  │  │   Skills    │    │
│  │    Page     │  │    Page     │  │  Progress   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│         │                │                │             │
│         └────────────────┴────────────────┘             │
│                          ↓                               │
│              ┌──────────────────────┐                   │
│              │   Zustand Store      │                   │
│              │  (State Management)  │                   │
│              └──────────────────────┘                   │
│                          ↓                               │
└──────────────────────────│───────────────────────────────┘
                           │
                           ↓ (API Calls)
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER (API)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Google Sheets API v4                      │  │
│  │  • Daily_Tracking (entrada diária)                │  │
│  │  • Simulados (histórico de mock exams)            │  │
│  │  • Skills_Progress (matriz 12 habilidades)        │  │
│  │  • Dashboard (métricas calculadas)                │  │
│  │  • Configurações (parâmetros do sistema)          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              CÁLCULOS (Business Logic)                   │
│  • calcularPrazoProjetado(HSR, TEA, SD, RS, CR)        │
│  • gerarRecomendacao(erroDominante, skillsFracas)      │
│  • calcularConsistencia(horasDiarias)                   │
│  • calcularTaxaErro(questoesFeitas, acertos)           │
└─────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios
```
vdp-pmp-tracker/
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx              # Cabeçalho com logo + user
│   │   │   ├── Sidebar.jsx             # Navegação lateral (futuro)
│   │   │   └── Layout.jsx              # Container principal
│   │   ├── cards/
│   │   │   ├── Card.jsx                # Componente base (white bg + shadow)
│   │   │   ├── CardPrazo.jsx           # Prazo Projetado (72 dias)
│   │   │   ├── CardConsistencia.jsx    # Horas/semana + bar chart
│   │   │   ├── CardPerformance.jsx     # Donut chart 82%
│   │   │   ├── CardSkills.jsx          # Skills 8/12 dominadas
│   │   │   ├── CardSimulado.jsx        # Último simulado 180Q
│   │   │   └── CardRecomendacao.jsx    # IA recommendations
│   │   ├── charts/
│   │   │   ├── LineChart.jsx           # Recharts wrapper
│   │   │   ├── DonutChart.jsx          # Pie chart customizado
│   │   │   ├── BarChart.jsx            # Barra vertical/horizontal
│   │   │   └── ProgressBar.jsx         # Barra de progresso linear
│   │   └── ui/
│   │       ├── Badge.jsx               # Pills coloridos (status)
│   │       ├── Button.jsx              # CTA buttons
│   │       └── Avatar.jsx              # User avatar circle
│   ├── pages/
│   │   ├── Dashboard.jsx               # Grid 2x3 cards principais
│   │   ├── Simulados.jsx               # Histórico + gráfico evolução
│   │   ├── SkillsProgress.jsx          # Tabela 12 skills
│   │   └── Configuracoes.jsx           # Parâmetros do sistema
│   ├── services/
│   │   ├── api.js                      # Google Sheets API client
│   │   ├── calculations.js             # Fórmulas de PP, TEA, etc
│   │   └── recommendations.js          # Lógica de IA (recomendações)
│   ├── stores/
│   │   └── vdpStore.js                 # Zustand global state
│   ├── utils/
│   │   ├── constants.js                # Constantes (cores, pesos)
│   │   ├── helpers.js                  # Funções auxiliares
│   │   └── validators.js               # Validação de dados
│   ├── hooks/
│   │   ├── usePolling.js               # Hook para polling 5min
│   │   └── useCalculations.js          # Hook para cálculos
│   ├── App.jsx                         # Root component + Router
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Global styles + Tailwind
├── .env.example                         # Template de variáveis
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── README.md
```

## Regras de Desenvolvimento

### Código
- **JavaScript/React**:
  - Usar componentes funcionais (hooks only, no class components)
  - Props devem ser destruct no parâmetro: `function Card({ title, children })`
  - Preferir `const` sobre `let`
  - Nomes de componentes: PascalCase (`CardPrazo.jsx`)
  - Nomes de funções: camelCase (`calcularPrazo()`)
  - Usar arrow functions para callbacks: `onClick={() => handleClick()}`
  
- **TailwindCSS**:
  - Usar classes utilitárias (não criar CSS customizado)
  - Responsive: mobile-first (mas VDP é desktop-only por enquanto)
  - Cores: usar tokens do tema (`text-primary`, não `text-blue-500`)
  - Espaçamento: múltiplos de 4px (`p-4`, `gap-6`, `mt-8`)

- **Performance**:
  - Lazy load de páginas: `const Simulados = lazy(() => import('./pages/Simulados'))`
  - Memoização quando necessário: `useMemo`, `useCallback`
  - Evitar re-renders desnecessários
  - Chunks de bundle < 500kb

### Commits
- Seguir **Conventional Commits**:
  ```
  feat: adiciona card de recomendação inteligente
  fix: corrige cálculo de prazo projetado quando HSR < 8.5h
  docs: atualiza README com stack tecnológica
  style: ajusta espaçamento do header
  refactor: extrai lógica de cálculo para service
  test: adiciona testes para calcularPrazoProjetado
  chore: atualiza dependências do Recharts
  ```

### Branches
- `main`: código de produção (sempre estável)
- `develop`: branch de desenvolvimento ativo
- `feature/nome-feature`: novas funcionalidades
- `fix/descricao-bug`: correções de bugs
- `docs/topico`: documentação

### Code Review
- Todo PR deve ter:
  - Descrição clara do que foi feito
  - Screenshots (se UI)
  - Testes (quando aplicável)
  - Checklist de QA

## Algoritmos Principais

### 1. Cálculo do Prazo Projetado (PP)

**Fórmula:**
```javascript
PP = PP_BASE - Ajuste_HSR - Ajuste_SD - Ajuste_TEA - Ajuste_RS + Ajuste_CR
```

**Variáveis:**
- `PP_BASE`: 180 dias (6 meses - padrão)
- `HSR`: Horas Semanais Reais (ex: 12h)
- `TEA`: Taxa de Erro Ajustada (ex: 0.18 = 18%)
- `SD`: Skills Dominadas de 12 (ex: 8/12)
- `RS`: Resiliência em Simulados (% último simulado)
- `CR`: Consistência de Ritmo (0 a 1)

**Ajustes:**
```javascript
Ajuste_HSR = (HSR - 8.5) * 5        // Cada 1h extra = 5 dias menos
Ajuste_SD  = (SD / 12) * 60         // Cada skill = 5 dias menos
Ajuste_TEA = (0.25 - TEA) * 100     // Quanto menor erro, menor prazo
Ajuste_RS  = (RS - 0.70) * 80       // Performance em simulados
Ajuste_CR  = (1 - CR) * 20          // Penalidade por inconsistência
```

**Limites:**
- Mínimo: 60 dias (2 meses)
- Máximo: 270 dias (9 meses)

### 2. Sistema de Recomendações

**Lógica de decisão:**
```javascript
function gerarRecomendacao(dados) {
  // Prioridade 1: Erro dominante alto
  if (dados.erroDominante.tipo === "Mindset PMI" && dados.erroDominante.taxa > 0.15) {
    return {
      tipo: "CRÍTICO",
      acao: "Fazer 50Q focadas em conflito stakeholder vs processo",
      objetivo: "Reduzir Mindset PMI para <15%"
    }
  }
  
  // Prioridade 2: Skills fracas
  if (dados.skillsFracas.length > 0) {
    return {
      tipo: "IMPORTANTE",
      acao: `Dominar skill ${dados.skillsFracas[0]}`,
      objetivo: "Atingir ≥80% em todas as skills"
    }
  }
  
  // Prioridade 3: Performance em simulados
  if (dados.ultimoSimulado < 0.75) {
    return {
      tipo: "ATENÇÃO",
      acao: "Refazer simulado 180Q",
      objetivo: "Atingir ≥75% de acerto"
    }
  }
  
  // Estado ideal
  return {
    tipo: "MANUTENÇÃO",
    acao: "Manter consistência semanal",
    objetivo: "Preservar ritmo atual"
  }
}
```

### 3. Cálculo de Consistência

**Fórmula:**
```javascript
Consistência = 1 - (diasSemEstudo / 7)

// Exemplos:
// 0 dias sem estudo → Consistência = 1.0 (100%)
// 1 dia sem estudo  → Consistência = 0.86 (86%)
// 3 dias sem estudo → Consistência = 0.57 (57%)
```

## Design System

### Paleta de Cores
```javascript
const colors = {
  // Primárias
  primary: '#3B82F6',        // Azul (botões, highlights)
  success: '#10B981',        // Verde (status OK, aprovado)
  warning: '#F59E0B',        // Amarelo (atenção, progresso)
  danger: '#EF4444',         // Vermelho (erro, crítico)
  
  // Neutras
  'bg-light': '#F8FAFC',     // Fundo da página
  'bg-card': '#FFFFFF',      // Fundo dos cards
  'text-dark': '#1E293B',    // Texto principal
  'text-muted': '#64748B',   // Texto secundário
  border: '#E2E8F0',         // Bordas
  
  // Gráficos
  'chart-blue': '#60A5FA',
  'chart-purple': '#A78BFA',
  'chart-green': '#34D399',
  'chart-orange': '#FB923C',
  'chart-red': '#F87171',
}
```

### Tipografia
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif']
}

fontSize: {
  'hero': '48px',      // Números grandes (72 dias)
  'title': '24px',     // Títulos de seção
  'subtitle': '18px',  // Títulos de cards
  'body': '14px',      // Texto padrão
  'caption': '12px',   // Labels pequenos
}

fontWeight: {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

### Componentes Base

**Card:**
```css
background: #FFFFFF
border-radius: 16px
padding: 24px
box-shadow: 0 1px 3px rgba(0,0,0,0.1)
border: 1px solid #E2E8F0
```

**Badge (Status Pills):**
```css
padding: 4px 12px
border-radius: 9999px (full)
font-size: 12px
font-weight: 500
background: {color}/10
color: {color}
```

**Button (CTA):**
```css
padding: 12px 24px
border-radius: 8px
font-size: 14px
font-weight: 600
background: #3B82F6
color: #FFFFFF
transition: all 0.2s
hover:background: #2563EB
```

## API Integration

### Google Sheets API v4

**Authentication:**
```javascript
// Usando API Key (read-only)
const API_KEY = process.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = process.env.VITE_SPREADSHEET_ID;

// Base URL
https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}
```

**Endpoints Principais:**

1. **Buscar dados do Dashboard:**
```javascript
GET /values:batchGet?ranges=Dashboard!B7:B10&ranges=Daily_Tracking!H2:J2&key={API_KEY}

Response:
{
  "valueRanges": [
    {
      "range": "Dashboard!B7:B10",
      "values": [
        ["72"],        // Prazo Projetado
        ["Excelente"], // Status
        ["-108"],      // Diferença
        ["12.0"]       // Horas/semana
      ]
    },
    ...
  ]
}
```

2. **Registrar entrada diária:**
```javascript
POST /values/Daily_Tracking!A:G:append?valueInputOption=USER_ENTERED&key={API_KEY}

Body:
{
  "values": [
    ["25/11/2025", 2.0, 20, 16, "EVM", "Conceitual", "Revisar fórmulas"]
  ]
}
```

3. **Buscar histórico de simulados:**
```javascript
GET /values/Simulados!A2:F?key={API_KEY}

Response:
{
  "values": [
    ["28/11", "Curto", 20, 16, "80%", "✅ OK"],
    ["05/12", "Médio", 50, 38, "76%", "✅ OK"],
    ...
  ]
}
```

### Polling Strategy

```javascript
// Atualizar dados a cada 5 minutos
const POLLING_INTERVAL = 5 * 60 * 1000;

useEffect(() => {
  // Buscar dados inicialmente
  atualizarDados();
  
  // Configurar polling
  const interval = setInterval(atualizarDados, POLLING_INTERVAL);
  
  return () => clearInterval(interval);
}, []);
```

## Métricas de Performance

### Benchmarks
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500kb (gzipped)

### Otimizações
- Code splitting por rota
- Lazy loading de gráficos
- Debounce em inputs (300ms)
- Throttle em scroll listeners (100ms)
- Cache de API calls (5min)

## Testes

### Tipos de Teste

**Unit Tests (Jest + React Testing Library):**
```javascript
// calcularPrazoProjetado.test.js
test('calcula PP corretamente com dados padrão', () => {
  const dados = {
    horasSemanais: 12.0,
    taxaErro: 0.18,
    skillsDominadas: 8,
    ultimoSimulado: 0.75,
    consistencia: 0.90
  };
  
  expect(calcularPrazoProjetado(dados)).toBe(108);
});
```

**Integration Tests:**
```javascript
// Dashboard.test.jsx
test('renderiza todos os 6 cards', () => {
  render(<Dashboard />);
  
  expect(screen.getByText('Prazo Projetado')).toBeInTheDocument();
  expect(screen.getByText('Consistência')).toBeInTheDocument();
  expect(screen.getByText('Performance 7 dias')).toBeInTheDocument();
  // ...
});
```

**E2E Tests (Playwright):**
```javascript
test('fluxo completo de registro diário', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Registrar Dia');
  await page.fill('#horas', '2');
  await page.fill('#questoes', '20');
  await page.click('button:has-text("Salvar")');
  
  await expect(page.locator('.success-toast')).toBeVisible();
});
```

## Deployment

### Build para Produção
```bash
# Instalar dependências
npm install

# Build otimizado
npm run build

# Output: /dist (HTML + CSS + JS minificados)
```

### Deploy Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Variáveis de Ambiente (Produção)
```bash
VITE_GOOGLE_SHEETS_API_KEY=AIza...
VITE_SPREADSHEET_ID=1a2b3c...
VITE_APP_TITLE=VDP - PMP Tracker
VITE_POLLING_INTERVAL=300000
```

## Roadmap

### Fase 1 (Atual) - MVP Desktop
- [x] Dashboard com 6 cards principais
- [x] Integração Google Sheets API
- [x] Cálculo de Prazo Projetado
- [x] Sistema de Recomendações
- [ ] Página Simulados
- [ ] Página Skills Progress

### Fase 2 - Features Avançadas
- [ ] Dark Mode
- [ ] Filtros e busca
- [ ] Exportar relatórios PDF
- [ ] Notificações por email
- [ ] Gráficos interativos avançados

### Fase 3 - Mobile + PWA
- [ ] Layout responsivo mobile
- [ ] Progressive Web App (offline)
- [ ] Sync automático (Service Workers)
- [ ] Push notifications

### Fase 4 - Analytics + IA
- [ ] Dashboard de analytics avançado
- [ ] ML para predição de aprovação
- [ ] Recomendações adaptativas
- [ ] A/B testing de estratégias

## Contato e Suporte

**Desenvolvedor:** Leonardo Américo  
**Email:** leoamericojr@gmail.com  
**Objetivo:** Passar no PMP em 60-90 dias usando Prática Deliberada

---

**Última atualização:** 27/11/2025  
**Versão:** 1.0.0-alpha
```

---

## **🎯 EXPLICAÇÃO DA ESTRUTURA**

Este README serve como **documento de contexto completo** para qualquer gerador de código (Claude, GitHub Copilot, ChatGPT Code Interpreter, Antigravity) porque contém:

### **1. Contexto de Negócio**
- O que é o VDP (não apenas "um sistema")
- Por que existe (acelerar certificação PMP)
- Qual o problema resolve (reduzir de 180 para 60-90 dias)

### **2. Arquitetura Completa**
- Stack detalhada (não apenas "React")
- Diagrama ASCII da arquitetura
- Estrutura de diretórios comentada
- Fluxo de dados (Frontend → API → Data)

### **3. Algoritmos Documentados**
- Fórmulas matemáticas (PP, TEA, Consistência)
- Lógica de negócio (Sistema de Recomendações)
- Exemplos práticos com números reais

### **4. Design System**
- Paleta de cores com HEX codes
- Tipografia com tamanhos exatos
- Componentes base com CSS
- Permite ao gerador criar UI consistente

### **5. Regras Claras**
- Convenções de código (camelCase, PascalCase)
- Padrões de commit (Conventional Commits)
- Estrutura de componentes React
- Performance benchmarks

### **6. API Integration**
- Endpoints documentados
- Request/Response examples
- Estratégia de polling
- Error handling

### **7. Testes**
- Exemplos de unit tests
- Integration tests
- E2E tests
- Coverage targets

### **8. Deployment**
- Scripts de build
- Configuração Netlify
- Variáveis de ambiente

---

## **💡 COMO USAR COM GERADORES DE CÓDIGO**

### **Com Claude (Artifacts):**
```
Contexto: [cole o README completo]

Tarefa: Crie o componente CardPrazo.jsx seguindo exatamente 
o design system e estrutura documentados no README.
```

### **Com GitHub Copilot:**
```javascript
// @file: CardPrazo.jsx
// @context: Ver README.md seção "Design System" e "Componentes Base"
// Criar card de Prazo Projetado com:
// - Número grande (72 dias)
// - Badge verde (Excelente)
// - Mini line chart

export default function CardPrazo() {
  // Copilot autocompleta baseado no README
}
```

### **Com Antigravity:**
```
Sistema: VDP - Visor Dinâmico de Progresso
Contexto completo: [cole seção "Design System" + "Estrutura"]

Gere o código React do Dashboard.jsx com grid 2x3 
seguindo exatamente o design system documentado.
```

---

## **✅ RESULTADO**

Qualquer gerador de código agora tem:
- **Contexto completo** (não vai "inventar" coisas)
- **Regras claras** (segue padrões do projeto)
- **Exemplos práticos** (sabe exatamente o que gerar)
- **Design system** (UI consistente)