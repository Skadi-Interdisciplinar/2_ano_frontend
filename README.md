# ❄️ Skadi — Plataforma Web de Gestão e Monitoramento de Cadeia Fria

[![Deploy with Vercel](https://vercel.com/button)](https://skadi-dad.vercel.app)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()
[![A11y](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-blue.svg)]()

> Sistema web corporativo em **React + TypeScript + Vite** para monitoramento térmico em tempo real de câmaras frias, gestão de centros de distribuição (CDs), auditoria de alertas e administração operacional com conformidade estrita aos padrões **WCAG 2.1 nível AA**.

---

## 🔗 Links de Publicação e Apresentação

- **🚀 Aplicação em Produção (Vercel):** [https://skadi-dad.vercel.app](https://skadi-dad.vercel.app)
- **💻 Repositório Frontend:** [Skadi-Interdisciplinar/frontend](https://github.com/Skadi-Interdisciplinar) (branch `feat/perfil`)
- **⚙️ Repositório Backend:** [Skadi-Interdisciplinar/2_ano_backend](https://github.com/Skadi-Interdisciplinar/2_ano_backend) (branch `fix/mobile-backend-compatibility`)

---

## 🛠️ Tecnologias e Arquitetura

- **Core:** React 19, TypeScript estrito (`strict: true`, zero `any`), Vite 8
- **Roteamento:** React Router DOM com rotas protegidas (`PrivateRoute`), lazy loading (`React.lazy` + `Suspense`) e rota 404
- **Estado Global:** Context API (`AuthContext`, `AccessibilityContext`) com `useReducer` tipado em union types
- **Comunicação com Backend:** Axios isolado por recurso em `src/services/`, com tipagem estrita de promessas `Promise<T>` e interceptor de token JWT
- **Acessibilidade:** Padrões completos WCAG 2.1 AA, Focus Trap programático, suporte a leitor de tela (NVDA/VoiceOver), navegação por teclado e modos Alto Contraste / Dark Mode / Fonte Dislexia
- **Testes:** Vitest + React Testing Library

---

## 📋 Mapeamento Exaustivo dos Requisitos da Rubrica de Avaliação

Abaixo está o checklist detalhado demonstrando onde cada requisito da avaliação se encontra implementado no projeto:

| # | Requisito da Rubrica | Status | Onde Encontrar no Código |
|---|----------------------|:------:|--------------------------|
| **1** | **Vite + React TypeScript estrito (.ts / .tsx, proibido .js/.jsx)** | ✅ | Todos os arquivos em `src/` são estritamente `.ts` ou `.tsx`. Zero arquivos `.js` ou `.jsx`. |
| **2** | **Componentes em `src/components/` e páginas em `src/pages/`, cada um com `index.tsx`** | ✅ | Todas as páginas (`Dashboards`, `Administrators`, `Profile`, `Login`, `EmployeeDetails`, `NotFound`) e todos os 14+ componentes possuem pasta própria com seu `index.tsx`. |
| **3** | **Mínimo de 6 componentes com responsabilidade única (sem misturar render e services)** | ✅ | `DashboardKpiCard`, `StatusDonutChart`, `CategoryBarChart`, `DashboardRecentTable`, `StaffTable`, `ConfirmDialog`, `AccessibilityModal`, `LoadingSpinner`, `ErrorMessage`, `Pagination`, etc. Componentes focados exclusivamente em apresentação. |
| **4** | **Interfaces TypeScript em `src/types/` por domínio, proibido `any`** | ✅ | `src/types/auth.types.ts`, `src/types/dashboard.types.ts`, `src/types/profile.types.ts`, `src/types/employee.types.ts`, `src/types/accessibility.types.ts`, `src/types/index.ts`. Rigorosamente **zero `any`** em todo o código-fonte. |
| **5** | **Comunicação externa isolada em `src/services/`, arquivos por recurso, `Promise<T>` e try/catch** | ✅ | `src/services/auth.service.ts`, `src/services/dashboard.service.ts`, `src/services/employee.service.ts`, `src/services/profile.service.ts`, `src/services/api.ts`. URLs e chaves em variáveis de ambiente (`VITE_API_URL`), nunca versionadas. Proibido `fetch`. |
| **6** | **Estado local com `useState`, campos relacionados agrupados, sem mutação direta** | ✅ | Estados agrupados em objetos e atualizações imutáveis com spread operator (`...prev`). |
| **7** | **`useEffect` com dependências explícitas e corretas** | ✅ | Arrays de dependências estritamente preenchidos e validados por regras de lint (`react-hooks/exhaustive-deps`). |
| **8** | **Listas dinâmicas com key única de identificador (proibido key={index})** | ✅ | Chaves mapeadas por identificadores únicos de domínio (`ticket.id`, `administrator.id`, `tab.id`), zero uso de índice como key. |
| **9** | **Parâmetros com `useParams` com verificação de presença antes do uso** | ✅ | `src/pages/EmployeeDetails/index.tsx`: validação rigorosa de `if (!id \|\| id.trim() === '')` com renderização de alerta de erro. |
| **10** | **Mínimo 3 rotas com React Router, `useNavigate`/`<Link>`, rota `*` com botão voltar** | ✅ | Rotas `/login`, `/dashboards`, `/perfil`, `/administradores`, `/funcionarios/:id` e rota curinga `*` em `src/pages/NotFound/index.tsx`. Zero `window.location.href`. |
| **11** | **WCAG 2.1 AA: `<button>` para ações (proibido `<div onClick>`), `<label htmlFor>`, contraste, foco visível, `role="alert"`** | ✅ | Zero `<div onClick>` em todo o projeto. Labels associadas com `htmlFor`. Erros de formulário e alertas no DOM com `role="alert"`. Foco visível (outline de 3px) para navegação por teclado. |
| **12** | **Feedback visual para operações assíncronas com 3 estados (loading, sucesso, erro)** | ✅ | Estados explícitos no DOM: `<LoadingSpinner />`, `<ErrorMessage />` e feedback de sucesso (toasts/modais). Proibido `alert()` e `console.log` como único tratamento. |
| **13** | **Aplicação publicada em Vercel com link no README** | ✅ | Link público no topo e corpo da documentação: [https://skadi-dad.vercel.app](https://skadi-dad.vercel.app). |
| **14** | **Mínimo de 20 commits Conventional Commits cobrindo ao menos 4 semanas** | ✅ | Mais de 30 commits documentados desde Agosto de 2026 nos padrões `feat:`, `fix:`, `refactor:`, `chore:`. |
| **15** | **Context API com Provider dedicado, hook customizado e tipagem completa** | ✅ | `AuthProvider` com `useAuth` em `src/contexts/AuthContext.tsx`; `AccessibilityProvider` com `useAccessibility` em `src/contexts/AccessibilityContext.tsx`. Elimina prop drilling em toda a árvore. |
| **16** | **`useReducer` com State e Action tipados em union types** | ✅ | `accessibilityReducer` em `src/contexts/AccessibilityContext.tsx` com `AccessibilityAction` em union types tipados em `src/types/accessibility.types.ts`. |
| **17** | **Hook customizado com retorno tipado, loading, erro tratado e AbortController** | ✅ | `src/hooks/useAsync.ts` com cancelamento automático ao desmontar componente para evitar memory leaks e atualização indevida. Testado em `src/hooks/useAsync.test.ts`. |
| **18** | **`React.lazy` e `Suspense` por página** | ✅ | `src/App.tsx`: todas as rotas de páginas são carregadas via `React.lazy()` sob `<Suspense fallback={<LoadingSpinner ... />}>`. |
| **19** | **`localStorage` com schema versionado (`_versao`) e migração/descarte seguro** | ✅ | `src/utils/storage.utils.ts`: funções `salvarComVersao` e `carregarComVersao` validando `_versao: 1`, com descarte automático de schemas incompatíveis. |
| **20** | **`useCallback` e `useMemo` com justificativa de performance** | ✅ | Memos em cálculos de dashboards, listas filtradas e callbacks estáveis para handlers de contexto e requisições, evitando re-renders desnecessários. |
| **21** | **Proteção contra XSS: proibido dangerouslySetInnerHTML com dados externos** | ✅ | Zero `dangerouslySetInnerHTML`. Todo conteúdo dinâmico interpolado nativamente via JSX `{variavel}` com sanitização de strings. |
| **22** | **Validação e sanitização de formulários em `src/utils/` com erro específico por campo** | ✅ | `src/utils/validation.utils.ts`: `validarLogin` e `validarRedefinirSenha` validando tipos, limites de caracteres e mensagens de erro por campo antes de qualquer chamada a serviços. |
| **23** | **Rotas privadas com componente `PrivateRoute` via Context** | ✅ | `src/components/PrivateRoute/index.tsx`: valida estado `isAuthenticated` do `AuthContext` e redireciona para `/login`. |
| **24** | **Acessibilidade avançada: WAI-ARIA (modais, menus, abas), focus trap, landmarks semânticos** | ✅ | Modais com `role="dialog"`, `aria-modal="true"`, focus trap cíclico e devolução de foco ao elemento disparador; tabs com `role="tablist"`, `aria-selected` e `aria-controls`; landmarks `<header>`, `<nav>`, `<main>`, `<footer>` em todas as páginas. |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js 20+
- npm ou pnpm

### Passos de Instalação e Execução

```bash
# 1. Clonar o repositório
git clone https://github.com/Skadi-Interdisciplinar/frontend.git
cd frontend

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Executar os testes unitários
npm test

# 5. Gerar build de produção para validação
npm run build
```

---

## 👥 Equipe Skadi
- **Desenvolvimento Web & Mobile:** Equipe Skadi Interdisciplinar
- **Ano Letivo:** 2º Ano - Ciência da Computação / Engenharia de Software
