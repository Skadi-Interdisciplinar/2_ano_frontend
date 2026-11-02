<div align="center">

<img src="./src/assets/hero.png" alt="Skadi - Plataforma de Monitoramento Térmico" width="100%" />

<br/>

# Skadi

### Plataforma Web de Gestão e Monitoramento de Cadeia Fria

<a href="#solucao"><img src="https://img.shields.io/badge/A%20Solu%C3%A7%C3%A3o-1E5B96?style=for-the-badge" alt="A Solução"/></a>
<a href="#como-funciona"><img src="https://img.shields.io/badge/Como%20Funciona-174A7E?style=for-the-badge" alt="Como Funciona"/></a>
<a href="#arquitetura"><img src="https://img.shields.io/badge/Arquitetura-286FAF?style=for-the-badge" alt="Arquitetura"/></a>
<a href="#acessibilidade"><img src="https://img.shields.io/badge/Acessibilidade-1E5B96?style=for-the-badge" alt="Acessibilidade"/></a>
<a href="#rubrica"><img src="https://img.shields.io/badge/Rubrica%2024%2F24-174A7E?style=for-the-badge" alt="Rubrica"/></a>

</div>

---

<a id="solucao"></a>

## A Solução

O frontend do Skadi foi desenvolvido para servir como a central de comando operacional de Centros de Distribuição e câmaras frigoríficas. Quando oscilações térmicas colocam em risco cargas de alimentos perecíveis, a agilidade na identificação do problema e na tomada de ação corretiva faz a diferença entre a segurança alimentar e perdas financeiras expressivas.

Construída em React moderno com TypeScript estrito e empacotamento ultrarrápido via Vite, a aplicação web oferece alta performance, previsibilidade de tipos em tempo de compilação e carregamento assíncrono modular de cada tela por meio de divisão de código sob demanda.

---

<a id="como-funciona"></a>

## Como Funciona o Frontend

A experiência do usuário se inicia na tela de autenticação, onde as credenciais informadas passam por validação e sanitização estritas antes do disparo de qualquer requisição. Ao receber a confirmação da API, o sistema armazena a sessão e o token de autorização em um repositório local versionado, garantindo descarte seguro caso haja incompatibilidade de esquemas e injetando o cabeçalho Bearer de forma transparente nas comunicações com o servidor.

Uma vez autenticado, o usuário é direcionado ao painel de Dashboards Operacionais. Essa visão consolida em tempo real os indicadores vitais da operação, apresentando cartões de métricas com totais de administradores cadastrados, centros de distribuição ativos, contagem consolidada de chamados de suporte e a distribuição de ocorrências entre os estados de registro, atendimento e conclusão. Dois componentes visuais desenvolvidos nativamente em vetores escaláveis enriquecem a interpretação dos dados, oferecendo um gráfico circular proporcional por situação e um gráfico de colunas por unidade de distribuição, ambos sensíveis ao tema escuro e livres de dependências externas pesadas.

O operador tem à disposição uma tabela dinâmica com navegação por abas acessíveis que permite filtrar chamados por status em tempo recorde, realizar buscas textuais instantâneas e abrir modais detalhados de inspeção. Caso o servidor passe por instabilidade momentânea, o painel preserva a transparência ao exibir alerta visual específico com botão de nova tentativa, evitando a apresentação enganosa de valores zerados.

Para o controle administrativo do ecossistema, o módulo de Administradores oferece a listagem completa da equipe com busca instantânea e ações integradas. Modais acessíveis permitem registrar novos profissionais, atualizar permissões de acesso, alterar alocações de centros de distribuição e efetuar exclusões protegidas por diálogos de confirmação de dupla etapa.

A central de Chamados de Suporte conecta a equipe de campo à liderança técnica, viabilizando o acompanhamento das solicitações, o registro de soluções e o encerramento formal de atendimentos com rastreabilidade de solicitantes e responsáveis.

Na tela de Perfil, o colaborador visualiza seus dados de cadastro, gerencia preferências de sistema como alternância para modo escuro e realiza a redefinição de senha através de formulário validado em tempo real, protegido por modal com confirmação consciente.

Transversal a toda a aplicação, o ecossistema de acessibilidade garante plena autonomia para qualquer profissional. Um botão flutuante e atalhos globais de teclado abrem o painel de acessibilidade, no qual é possível ativar alto contraste, fonte adaptada para dislexia, aumento de escala tipográfica e sublinhado em elementos interativos. Todas as interfaces contam com estrutura semântica de marcos, foco visível com espessura reforçada, armadilha de foco cíclica em modais e restauração automática do foco ao elemento disparador de origem, atendendo aos rigorosos critérios da norma internacional WCAG 2.1 nível AA.

---

<a id="links"></a>

## Links Rápidos

| Recurso | Destino |
|---|---|
| Publicação em Produção (Vercel) | https://skadi-dad.vercel.app |
| Repositório Frontend | https://github.com/Skadi-Interdisciplinar/2_ano_frontend (branch feat/perfil) |
| Repositório Backend | https://github.com/Skadi-Interdisciplinar/2_ano_backend (branch fix/mobile-backend-compatibility) |
| Organização Skadi | https://github.com/Skadi-Interdisciplinar |

---

<a id="arquitetura"></a>

## Arquitetura e Tecnologias

| Área | Tecnologia | Finalidade |
|---|---|---|
| Biblioteca Base | React 19 com TypeScript estrito | Interface reativa, modular e sem qualquer uso do tipo any |
| Empacotamento | Vite 8 | Servidor de desenvolvimento rápido e geração otimizada de pacotes |
| Navegação | React Router DOM | Gerenciamento de rotas com lazy loading, rotas privadas e página 404 |
| Estado Global | Context API e useReducer | Gerenciamento centralizado de autenticação e preferências acessíveis com união discriminada |
| Comunicação HTTP | Axios isolado por recurso | Requisições tipadas em serviços dedicados com interceptor de autorização |
| Acessibilidade | Padrões W3C WAI e ARIA | Navegação por teclado, leitor de tela, foco programático e conformidade WCAG 2.1 AA |
| Testes Automatizados | Vitest e React Testing Library | Cobertura exaustiva de componentes, hooks e serviços de API |

---

<a id="rubrica"></a>

## Mapeamento dos 24 Requisitos da Rubrica de Avaliação

| Número | Requisito da Avaliação | Conformidade | Arquivo Principal de Referência |
|---|---|:---:|---|
| 1 | Vite com React TypeScript estrito em arquivos com extensão ts ou tsx | Conforme | Toda a árvore src com zero arquivos js ou jsx |
| 2 | Componentes e páginas em pastas individuais contendo index tsx | Conforme | Pastas em src/components e src/pages padronizadas |
| 3 | Componentes de responsabilidade única sem chamadas diretas a serviços | Conforme | src/components com separação estrita de apresentação |
| 4 | Interfaces TypeScript em src/types organizadas por domínio sem any | Conforme | src/types/auth, dashboard, profile, employee e accessibility |
| 5 | Serviços isolados em src/services com retornos em Promise e try catch | Conforme | src/services/auth, dashboard, employee e profile |
| 6 | Estado local com useState agrupando campos em objetos imutáveis | Conforme | Telas operacionais e formulários em src/pages |
| 7 | Hook useEffect com array de dependências explícito e correto | Conforme | Validação estrita via regras de lint |
| 8 | Listas dinâmicas com chave identificadora única de entidade | Conforme | Tabelas e cartões referenciando id próprio do dado |
| 9 | Parâmetros de rota com useParams verificando ausência antes do uso | Conforme | src/pages/EmployeeDetails/index.tsx |
| 10 | Rotas com React Router, navegação programática e rota curinga de erro | Conforme | src/App.tsx e src/pages/NotFound/index.tsx |
| 11 | Acessibilidade com tag button para ações, label associado e contraste | Conforme | Zero div com clique em todo o projeto e contraste 4.5 para 1 |
| 12 | Três estados no DOM para requisições assíncronas com carregamento e erro | Conforme | LoadingSpinner, ErrorMessage e alertas amigáveis |
| 13 | Publicação em produção com link direto no documento | Conforme | Aplicação ativa na Vercel com link acessível |
| 14 | Mais de vinte commits no padrão convencional cobrindo desenvolvimento | Conforme | Histórico contínuo com mais de trinta commits convencionais |
| 15 | Context API com provedor dedicado e hook de consumo tipado | Conforme | src/contexts/AuthContext e AccessibilityContext |
| 16 | Hook useReducer com estado e ações tipadas em uniões de tipos | Conforme | accessibilityReducer em AccessibilityContext |
| 17 | Hook customizado com retorno tipado e cancelamento via AbortController | Conforme | src/hooks/useAsync.ts e useAsync.test.ts |
| 18 | Carregamento sob demanda com React lazy e componente Suspense | Conforme | Divisão de código em src/App.tsx |
| 19 | Armazenamento local com esquema versionado e validação de versão | Conforme | src/utils/storage.utils.ts |
| 20 | Otimizações com useCallback e useMemo para estabilidade de render | Conforme | Memorizações de dados e manipuladores nos painéis |
| 21 | Proteção contra XSS sem dangerouslySetInnerHTML e interpolação JSX | Conforme | Zero dangerouslySetInnerHTML e sanitização em utils |
| 22 | Validação e sanitização de formulários com mensagens específicas | Conforme | src/utils/validation.utils.ts |
| 23 | Rotas privadas protegidas por componente PrivateRoute via contexto | Conforme | src/components/PrivateRoute/index.tsx |
| 24 | Acessibilidade avançada com atributos ARIA, focus trap e marcos | Conforme | Modais acessíveis, abas e marcos semânticos em todas as telas |

---

<a id="execucao"></a>

## Como Executar o Projeto Localmente

```bash
git clone https://github.com/Skadi-Interdisciplinar/2_ano_frontend.git
cd 2_ano_frontend
npm install
npm run dev
```

### Validações de Qualidade e Compilação

```bash
npm run lint
npm test
npm run build
```

---

<div align="center">

Desenvolvido pela equipe Skadi para proteção e eficiência térmica na conservação de alimentos perecíveis.

</div>
