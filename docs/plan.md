# Roadmap PlugaSST — Plano de Evolução
> Atualizado: 22/04/2026 | Stack: Next.js 16 + TypeScript + Tailwind + Supabase + Vercel

---

## Estado Atual (O que já está pronto)

| Item | Status | Rota |
|---|---|---|
| Feed de informativos/notícias | ✅ Feito | `/informativos` |
| Diretório de profissionais (SST) | ✅ Feito | `/profissionais` |
| Hub de empresas parceiras | ✅ Feito | `/empresas` |
| Supabase conectado | ✅ Feito | — |
| Deploy na Vercel | ✅ Feito | — |
| Responsivo (desktop + mobile) | ✅ Revisado | todas as páginas |
| Homepage PlugaSST (HeroPlugaSST) | ✅ Feito | `/` |
| Slogan: "Tudo sobre SST em um só lugar" | ✅ Feito | hero + context.md |
| `/fornecedores` com 7 categorias + filtros | ✅ Feito | `/fornecedores` |
| Perfil rico de fornecedor | ✅ Feito | `/fornecedores/[slug]` |
| 24 fornecedores reais no Supabase | ✅ Feito | — |
| Migration: campos plano/whatsapp/FTS/RLS | ✅ Feito | — |
| Busca unificada FTS (empresas + profissionais) | ✅ Feito | `/busca` |
| Estética unificada verde em todas as páginas | ✅ Feito | — |

---

## Fase 1 — Identidade & Expansão do Catálogo *(Fundação PlugaSST)*

**Objetivo:** Transformar o "Ecossistema SST Brasil" em **PlugaSST** — com identidade visual clara, categorias completas e catálogo robusto. Esta é a vitrine do produto.

**Por que primeiro?** Sem categorias completas e identidade, não há produto para monetizar. O motor de busca só tem valor se houver profundidade de catálogo.

### 1.1 Redesign da Landing Page (home)
- Nova identidade: nome PlugaSST, logo, tagline
- Hero section com busca central por categoria + localidade
- Grid de categorias principais: EPI, Clínicas, Profissionais, Softwares, Treinamentos, Notícias
- Seção "Destaques" (vitrine para futuros anúncios patrocinados)
- Seção de estatísticas (ex: 430 mil técnicos, R$ 21bi de mercado, X empresas cadastradas)
- Mobile-first obrigatório

### 1.2 Expandir Diretório de Empresas por Categoria
- Rota: `/fornecedores` (substituir ou complementar `/empresas`)
- Categorias a cobrir (da seção 4 do context.md):
  - Lojas de EPI (botinas, luvas, capacetes, óculos, protetor auricular)
  - Clínicas de Medicina do Trabalho
  - Softwares SST (SOC, eSocial, GRO)
  - Empresas de Treinamento (NR-10, NR-35, NR-33, CIPA)
  - Consultorias e Engenharia de Segurança
  - Higiene Ocupacional e Laboratórios
- Campo adicional na tabela `empresas`: `categoria`, `subcategoria`, `descricao_longa`, `whatsapp`
- Página de perfil rico por empresa (SEO: "Clínica de Medicina do Trabalho em Curitiba")
- Filtros: categoria, UF, município

### 1.3 Expandir Diretório de Profissionais
- Adicionar mais profissionais via scraping (CREA-PR, CREA-SC para engenheiros)
- Cobrir todas as especialidades do context.md:
  - Técnicos de Segurança
  - Engenheiros de Segurança
  - Médicos do Trabalho *(já em andamento)*
  - Higienistas Ocupacionais
  - Peritos de SST
- Campo `whatsapp` nos perfis

### 1.4 Motor de Busca Central
- Barra de busca global na home e no header
- Busca unificada em profissionais + empresas/fornecedores por nome, categoria, cidade
- Supabase Full-Text Search (`tsvector`) para português
- URL amigável: `/busca?q=clinica&uf=PR&cidade=Curitiba`

**Entregáveis Fase 1:**
- [x] Nova home com identidade PlugaSST + busca central
- [x] Rota `/fornecedores` com todas as categorias
- [x] Perfil rico de empresa (`/fornecedores/[slug]`)
- [x] Campos adicionais na tabela `empresas` (Supabase migration)
- [x] Busca unificada com FTS
- [x] Responsividade revisada em todas as rotas
- [ ] *(pendente)* Expandir profissionais via scraping (CFM, CREA — ver ideia abaixo)

---

## Fase 2 — Captação de Leads *(Motor de Receita)*

**Objetivo:** Criar o mecanismo de geração de valor concreto — o comprador encontra o fornecedor e pede orçamento. Este é o argumento central para monetização (o lead é o produto que vende o plano Pro).

**Por que segundo?** Sem lead capture, não há argumento para vender planos pagos. A Fase 3 (monetização) depende desta.

### 2.1 Formulário "Solicitar Orçamento"
- Botão nos perfis de empresa e profissional
- Comprador preenche: nome, email/telefone, descrição da necessidade, UF, prazo
- **Comprador NÃO precisa criar conta**
- Lead armazenado em tabela `leads` no Supabase
- Notificação por email ao fornecedor (Resend)
- Lead enviado para até 3 fornecedores (regra do context.md §6E)

### 2.2 Botão WhatsApp Direto
- CTA primário nos cards de empresa/profissional
- Link `wa.me/{numero}?text=Olá, vi seu perfil no PlugaSST...`
- Rastrear cliques para métricas (campo `whatsapp_clicks` em analytics)

### 2.3 Painel Básico do Fornecedor (autenticado)
- Supabase Auth (magic link ou email+senha)
- Rota protegida: `/painel`
- Visualizar leads recebidos (nome, contato, descrição, data)
- Ver métricas básicas: visualizações do perfil, cliques no WhatsApp, leads recebidos
- Estas métricas são o argumento de upsell para o plano Pro

### 2.4 Formulário de Autocadastro de Empresa
- Rota: `/cadastrar`
- Empresa/profissional preenche os próprios dados
- Status inicial: `pendente` → admin revisa e publica
- Reduz trabalho manual de inserção de dados

**Entregáveis Fase 2:**
- [x] Tabela `leads` + `metricas` no Supabase (com RLS)
- [x] Funções SQL: incrementar_whatsapp_click, incrementar_profile_view, incrementar_lead_recebido
- [x] Formulário `/solicitar-orcamento` (sem login, comprador envia lead)
- [x] Rota `/api/whatsapp/[slug]` (tracking de cliques + redirect)
- [x] Página `/cadastrar` com formulário de autocadastro (status pendente → admin aprova)
- [x] `@supabase/ssr` instalado + middleware de proteção de rotas
- [x] Helpers: `supabase-server.ts`, `supabase-browser.ts`
- [ ] Supabase Auth configurado (magic link por email)
- [ ] Rota `/painel` com login + dashboard de leads + métricas
- [ ] Integração Resend (emails transacionais) — opcional MVP

---

## Fase 3 — Monetização *(Receita Recorrente)*

**Objetivo:** Converter a base de fornecedores em receita. Implementar planos Free/Pro/Premium e sistema de destaques patrocinados.

**Por que terceiro?** Precisamos de leads reais acontecendo (Fase 2) para usar como argumento de venda dos planos pagos.

### 3.1 Planos de Assinatura (Free / Pro / Premium)
- Integração Stripe (checkout + webhooks)
- Tabela `assinaturas` no Supabase com plano ativo, data de vencimento
- Limites por plano:
  - Free: 5 leads/mês, sem verificado, sem destaque
  - Pro: 50 leads/mês, selo verificado, métricas completas
  - Premium: ilimitado, 1 slot destaque incluído, página rica
- Middleware de controle de acesso por plano
- Página `/planos` com comparativo e CTA

### 3.2 Destaques Patrocinados
- Tipos (do context.md §6.2): Patrocinado (topo), Vitrine (home/categoria), Selo Destaque
- Tabela `sponsored_slots` no Supabase
- Controle de slots por cidade + categoria (máx. 3 patrocinados por combinação)
- Admin ativa/desativa manualmente no MVP
- Rotação automática se houver mais de 1 anunciante
- Label "Patrocinado" obrigatório e visível

### 3.3 Regras de Ranking Implementadas
- Ordenação na busca/listagem: Patrocinado > Vitrine > Verificado > Pro > Free
- Campo `rank_score` calculado e indexado no Supabase

### 3.4 Admin Panel
- Rota protegida: `/admin` (apenas email do owner)
- Aprovar cadastros pendentes
- Ativar/desativar slots patrocinados
- Ver volume de leads e métricas da plataforma

**Entregáveis Fase 3:**
- [ ] Stripe integrado (checkout + webhooks)
- [ ] Tabelas: `assinaturas`, `sponsored_slots`
- [ ] Middleware de plano (Free/Pro/Premium)
- [ ] Página `/planos` com comparativo
- [ ] Sistema de ranking implementado
- [ ] Admin panel básico

---

## Fase 4 — Conteúdo & Comunidade *(Retenção)*

**Objetivo:** Aumentar o tempo na plataforma e visitas recorrentes com módulos de conteúdo vivo e comunidade.

### 4.1 Módulo de Eventos SST
- Rota: `/eventos`
- Listagem de congressos, SIPATs, workshops, webinars
- Filtros: mês, UF, tipo (presencial/online)
- Destaque semanal na home
- Cadastro por formulário (eventos patrocinados em destaque)

### 4.2 Quadro de Vagas SST
- Rota: `/vagas`
- Job board especializado: técnico, engenheiro, médico do trabalho
- Campos: cargo, empresa, UF, regime (CLT/PJ), NRs exigidas
- Vagas patrocinadas aparecem no topo

### 4.3 Radar Legislativo
- Rota: `/legislacao`
- Feed de NRs, portarias, resoluções com data e link oficial
- Fonte inicial: posts Markdown `/posts/` com `category: 'Legislativo'`
- Evolução: scraping Gov.br + MTE

### 4.4 Calendário de Obrigações SST
- Rota: `/calendario`
- Timeline com PPRA, PCMSO, LTCAT, e-Social, CIPA, SIPAT
- Dados estáticos em `/data/calendario.json`
- Filtro por mês e tipo de empresa

### 4.5 Glossário SST
- Rota: `/glossario`
- Dicionário técnico A–Z: NR, EPI, EPC, CAT, SESMT, PPRA, PGR, etc.
- Busca client-side
- Dados estáticos em `/data/glossario.json`

**Entregáveis Fase 4:**
- [ ] Rotas: `/eventos`, `/vagas`, `/legislacao`, `/calendario`, `/glossario`
- [ ] Tabelas: `eventos`, `vagas`
- [ ] JSONs: `calendario.json`, `glossario.json`
- [ ] Destaque de eventos na home

---

## Fase 5 — Ferramentas Práticas *(Autoridade Técnica)*

**Objetivo:** Tornar o PlugaSST a caixa de ferramentas do profissional SST. Aumentar autoridade e tempo de sessão.

### 5.1 Calculadora SESMT (NR-4)
- Rota: `/ferramentas/sesmt`
- Input: grau de risco + número de empregados
- Output: composição mínima obrigatória do SESMT

### 5.2 Checklist de Conformidade por NR
- Rota: `/ferramentas/checklist`
- Seleção da NR → checklist com percentual de conformidade
- Export para PDF

### 5.3 Gerador de PGR Simplificado
- Rota: `/ferramentas/pgr`
- Formulário guiado → PDF com estrutura mínima (NR-1)

### 5.4 Simulador de Multas
- Rota: `/ferramentas/multas`
- Input: NR infringida, porte da empresa, grau de infração
- Output: faixa de multa prevista (CLT + NR)

**Entregáveis Fase 5:**
- [ ] Hub `/ferramentas` com as 4 calculadoras
- [ ] `@react-pdf/renderer` para exports
- [ ] JSONs: `checklists/nr-*.json`, `multas.json`

---

## Fase 6 — Inteligência & IA *(Diferenciação)*

**Objetivo:** Transformar dados acumulados em inteligência de mercado.

### 6.1 Motor de Recomendação
- "Quem viu X também buscou Y"
- Sugestões baseadas em perfil: buscou profissional → sugere clínica próxima
- Implementar com Supabase + lógica de scoring (MVP sem ML)

### 6.2 Dashboard de Estatísticas Nacionais
- Rota: `/dados`
- Acidentes CAT/INSS, afastamentos, mortes por setor
- Gráficos com `recharts`

### 6.3 Alertas Automáticos de Legislação
- Scraping DOU + MTE para detectar novas NRs/portarias
- Claude API transforma texto em resumo acessível
- Email automático para usuários inscritos por tema
- Cron via Supabase Edge Functions ou Vercel Cron

### 6.4 Newsletter de Tendências
- Geração mensal com Claude API
- Preview público do último relatório

**Entregáveis Fase 6:**
- [ ] Claude API integrada
- [ ] Dashboard `/dados` com gráficos
- [ ] Cron de alertas legislativos
- [ ] Sistema de newsletter

---

## Visão Geral do Roadmap

| Fase | Foco | Prioridade | Impacto de Negócio |
|---|---|---|---|
| 1 — Identidade & Catálogo | Vitrine do produto | **Alta** | Credibilidade + SEO |
| 2 — Leads | Motor de receita | **Alta** | Argumento de venda dos planos |
| 3 — Monetização | Receita recorrente | **Alta** | MRR |
| 4 — Conteúdo | Retenção + SEO | Média | Tráfego orgânico |
| 5 — Ferramentas | Autoridade técnica | Média | Retenção + upsell |
| 6 — IA | Diferenciação | Baixa | Vantagem competitiva longo prazo |

## Dependências

```
Fase 1 (catálogo completo + identidade)
  → Fase 2 (leads e painel — precisam de fornecedores cadastrados)
    → Fase 3 (monetização — precisa de leads reais como argumento)
      → Fase 4 (pode rodar em paralelo com F3)
        → Fase 5 (pode rodar em paralelo com F4)
          → Fase 6 (requer volume de dados acumulado)
```

## Próxima Ação

Iniciar **Fase 1.1 — Redesign da Landing Page** com identidade PlugaSST:
1. Definir nome final (PlugaSST?)
2. Criar hero com busca central por categoria + UF
3. Grid de categorias principais
4. Mobile-first
