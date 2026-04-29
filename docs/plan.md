# Roadmap AcheiSST — Plano de Evolução
> Atualizado: 29/04/2026 | Stack: Next.js 16 + TypeScript + Tailwind + Supabase + Vercel

---

## 🚀 SPRINT ATIVO — Marketplace B2B (Painel Fornecedor + Orçamento Real)
> **Prioridade máxima.** Transforma o site de diretório passivo em marketplace B2B ativo.
> Estimativa: 2–3 sessões de trabalho.

---

### O que já existe (não precisa construir do zero)

| Item | Estado | Onde |
|---|---|---|
| Tabela `leads` | ✅ Pronta | Supabase — campos: fornecedor_id, nome, email, telefone, descricao, uf, cidade, prazo, status |
| Tabela `metricas` | ✅ Pronta | Supabase — campos: fornecedor_id, data, profile_views, whatsapp_clicks, leads_received |
| `OrcamentoForm` component | ✅ Funcional | `src/components/OrcamentoForm.tsx` — salva em `leads`, chama RPC `incrementar_lead_recebido` |
| `/solicitar-orcamento` page | ✅ Existe (mas com bug) | Consulta tabela `empresas` (antiga) — deve consultar `fornecedores` |
| `/painel/login` + `/painel/cadastrar` | ✅ Funcional | Auth Supabase com email+senha e Google OAuth |
| `profiles` table | ✅ Pronta | Campos: user_id, account_type (enum: profissional, clinica, empresa_sst, empresa_epi), plan |
| `/painel` (profissional) | ✅ Existe | Usa dados mock — falta conectar Supabase real |

### O que falta construir

| Item | Prioridade | Complexidade |
|---|---|---|
| `user_id` na tabela `fornecedores` | 🔴 Bloqueador | Baixa — migration de 1 coluna |
| RLS: fornecedor edita só o próprio perfil | 🔴 Bloqueador | Baixa |
| `/painel/fornecedor` — dashboard principal | 🔴 Alta | Média |
| `/painel/fornecedor/leads` — gestão de leads | 🟠 Alta | Média |
| Redirect pós-login inteligente (profissional vs empresa) | 🟠 Alta | Baixa |
| Fix `/solicitar-orcamento` (empresas → fornecedores) | 🟡 Média | Muito baixa |
| Botão "Solicitar Orçamento" em `/fornecedores/[slug]` | 🟡 Média | Baixa |

---

### Fase A — Database (migration + RLS)

**A1. Adicionar `user_id` na tabela `fornecedores`:**
```sql
ALTER TABLE public.fornecedores
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX idx_fornecedores_user_id ON public.fornecedores(user_id);
```

**A2. RLS — Fornecedor edita apenas o próprio perfil:**
```sql
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

-- Leitura pública (como já funciona)
CREATE POLICY "public_read" ON public.fornecedores
  FOR SELECT USING (true);

-- Escrita apenas pelo dono
CREATE POLICY "owner_update" ON public.fornecedores
  FOR UPDATE USING (auth.uid() = user_id);
```

**A3. RLS — Fornecedor lê apenas os próprios leads:**
```sql
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "owner_read_leads" ON public.leads
  FOR SELECT USING (
    fornecedor_id IN (
      SELECT id FROM public.fornecedores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owner_update_lead_status" ON public.leads
  FOR UPDATE USING (
    fornecedor_id IN (
      SELECT id FROM public.fornecedores WHERE user_id = auth.uid()
    )
  );
```

**A4. RLS — Fornecedor lê próprias métricas:**
```sql
ALTER TABLE public.metricas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_read_metricas" ON public.metricas
  FOR SELECT USING (
    fornecedor_id IN (
      SELECT id FROM public.fornecedores WHERE user_id = auth.uid()
    )
  );
```

**A5. Verificar/criar RPC `incrementar_lead_recebido`:**
```sql
CREATE OR REPLACE FUNCTION public.incrementar_lead_recebido(p_fornecedor_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.metricas (fornecedor_id, data, leads_received)
  VALUES (p_fornecedor_id, CURRENT_DATE, 1)
  ON CONFLICT (fornecedor_id, data)
  DO UPDATE SET leads_received = metricas.leads_received + 1;
END;
$$;
```

---

### Fase B — Painel do Fornecedor (rotas)

#### B1. `/painel/fornecedor/page.tsx` — Dashboard principal
**Lógica:**
1. Server Component — usa `createSupabaseServer()` para pegar `user` autenticado
2. Se não logado → redirect `/painel/login`
3. Query `fornecedores WHERE user_id = auth.uid()`
4. Se nenhum fornecedor vinculado → mostrar tela "Vincule seu estabelecimento"
5. Se vinculado → mostrar dashboard

**Seções do dashboard:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo/Avatar]  Nome da Empresa              [Editar]   │
│  Categoria · Cidade, UF · ✓ Verificado                  │
├─────────────────────────────────────────────────────────┤
│  📊 Métricas (últimos 30 dias)                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ 142 views│ │ 23 WA    │ │ 7 leads  │                │
│  └──────────┘ └──────────┘ └──────────┘                │
├─────────────────────────────────────────────────────────┤
│  📋 Últimos leads recebidos (5 mais recentes)           │
│  [Nome] · [Contato] · [Prazo] · [Status] · [Ação]      │
├─────────────────────────────────────────────────────────┤
│  🔗 Links rápidos                                       │
│  [Ver perfil público] [Ver todos os leads] [Editar]     │
└─────────────────────────────────────────────────────────┘
```

#### B2. `/painel/fornecedor/editar/page.tsx` — Editar perfil
**Campos editáveis:** nome, descricao, telefone, whatsapp, email, website_url, endereco, especialidades[], categorias_oferecidas[]
**Salva via:** `UPDATE fornecedores SET ... WHERE id = fornecedor.id`
**Validação:** nome obrigatório, whatsapp formato br

#### B3. `/painel/fornecedor/leads/page.tsx` — Gestão de leads
**Lista todos os leads** do fornecedor com:
- Status: `novo` (🔴) → `em_andamento` (🟡) → `concluido` (🟢)
- Ações: marcar como contatado, concluído, arquivar
- Filtros: por status, por data
- Card do lead: nome, contato, descrição, UF/cidade, prazo, data

---

### Fase C — Auth flow inteligente

#### C1. Redirect pós-login por tipo de conta
No `/painel/login/page.tsx`, após `signInWithPassword` bem-sucedido:
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('account_type')
  .eq('user_id', user.id)
  .single()

const isEmpresa = ['clinica', 'empresa_sst', 'empresa_epi'].includes(profile?.account_type)
router.push(isEmpresa ? '/painel/fornecedor' : '/painel')
```

#### C2. Middleware de proteção de rota
Adicionar ao `middleware.ts` (ou criar):
- `/painel/fornecedor/*` → requer auth + account_type empresa
- `/painel/*` → requer auth

#### C3. Registro separado para empresas
Adicionar ao `/painel/cadastrar` campo de seleção:
```
Tipo de conta:
○ Sou profissional SST
○ Sou empresa / fornecedor SST
```
Dependendo da escolha, `account_type` no `profiles` é setado corretamente.

---

### Fase D — Botão de Orçamento nos perfis

#### D1. Fix `/solicitar-orcamento`
- Trocar query de `empresas` para `fornecedores` (1 linha de código)
- Suportar também `profissional_id` (leads para profissionais)

#### D2. Botão em `/fornecedores/[slug]`
Adicionar na página de perfil do fornecedor:
```
[💬 WhatsApp]  [📋 Solicitar Orçamento]
```
- WhatsApp: `wa.me/55{numero}?text=Olá, vi seu perfil no AcheiSST...` + tracking de clique
- Orçamento: link para `/solicitar-orcamento?fornecedor={slug}`

#### D3. Tracking de clique no WhatsApp
```typescript
// /api/whatsapp/[slug]/route.ts
// Incrementa whatsapp_clicks na tabela metricas
// Redireciona para o link real do WhatsApp
```

#### D4. Botão em `/profissionais` (cards)
Adicionar botão WhatsApp nos cards de profissionais que têm `whatsapp` preenchido.

---

### Checklist de execução

**Sprint 1 — Database e Auth (fazer primeiro)**
- [ ] A1: Migration `user_id` na tabela `fornecedores`
- [ ] A2: RLS para `fornecedores` (public_read + owner_update)
- [ ] A3: RLS para `leads`
- [ ] A4: RLS para `metricas`
- [ ] A5: Criar/verificar RPC `incrementar_lead_recebido`
- [ ] C1: Redirect inteligente no login (profissional vs empresa)

**Sprint 2 — Dashboard do Fornecedor**
- [ ] B1: `/painel/fornecedor/page.tsx` — dashboard com métricas e últimos leads
- [ ] B2: `/painel/fornecedor/editar/page.tsx` — formulário de edição de perfil
- [ ] B3: `/painel/fornecedor/leads/page.tsx` — gestão completa de leads

**Sprint 3 — Conexão no Front**
- [ ] D1: Fix `/solicitar-orcamento` (tabela empresas → fornecedores)
- [ ] D2: Botão "Solicitar Orçamento" em `/fornecedores/[slug]`
- [ ] D3: API route de tracking de clique WhatsApp
- [ ] D4: Botão WhatsApp nos cards de profissionais

---

### Resultado esperado ao final do sprint

Um fornecedor (clínica, consultoria, loja EPI) poderá:
1. Criar conta no AcheiSST como "empresa"
2. Vincular seu perfil existente (ou criar um novo)
3. Ver no painel: quantas pessoas viram o perfil, clicaram no WhatsApp, enviaram orçamentos
4. Gerenciar os leads recebidos (marcar como contatado, concluído)
5. Editar os próprios dados de contato, descrição, especialidades

Um cliente (empresa que busca SST) poderá:
1. Entrar no perfil de um fornecedor
2. Clicar em "Solicitar Orçamento" ou WhatsApp direto
3. Preencher o formulário (sem precisar criar conta)
4. O fornecedor recebe a notificação no painel

---

## Estado Atual (O que já está pronto)

| Item | Status | Rota |
|---|---|---|
| Feed de informativos/notícias | ✅ Feito | `/informativos` |
| Diretório de profissionais (20 reais) | ✅ Feito | `/profissionais` |
| Tabela fornecedores (genérica) | ✅ Feito | — |
| Hub de clínicas (9 reais) | ✅ Feito | `/fornecedores?cat=clinica` |
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

## Fase 2 — Conteúdo & Comunidade *(Retenção)*

**Objetivo:** Aumentar o tempo na plataforma e visitas recorrentes com módulos de conteúdo vivo e comunidade. Estruturar todas as 18 categorias da homepage com dados e organização.

### 2.1 Estruturação de Dados — Profissionais & Especialistas

**Rotas:**
- `/profissionais` — listing geral + filtros
- `/profissionais?esp=perito` — peritos
- `/profissionais?esp=professor` — professores

**Campos no Supabase:**
- Tabela `profissionais`: nome, especialidade, registro_profissional, uf, cidade, telefone, whatsapp, email, foto, descricao, nrs_expertise, experiencia_anos, avaliacao, verificado
- Índices: especialidade, UF, city para busca rápida
- Full-text search: nome + descrição

**Populate inicial:**
- 50-100 profissionais de SST (scraping CREA + CFM + cadastro manual)
- Pelo menos 5 peritos, 5 professores, 20 técnicos

**Entregáveis 2.1:**
- [x] Tabela `profissionais` criada com campos definidos ✅ 23/04
- [x] Seed com 20 profissionais reais (9 técnicos, 3 engenheiros, 3 médicos, 2 peritos, 2 professores, 2 higienistas) ✅ 23/04
- [x] Rota `/profissionais` com grid, filtros, busca, especialidades ✅ 23/04
- [ ] Página de detalhe individual `/profissionais/[slug]` (futuro)

---

### 2.2 Estruturação de Dados — Clínicas, Lojas, Software, Equipamentos, Treinamentos

**Estratégia:** "Um pouco de cada" — implementar progressivamente cada categoria com 8-10 registros reais.

**Rotas:**
- `/fornecedores` — listing geral (todas as categorias)
- `/fornecedores?cat=clinica` — clínicas ✅ 23/04
- `/fornecedores?cat=loja` — lojas (próximo)
- `/fornecedores?cat=software` — softwares (próximo)
- `/fornecedores?cat=epi` — equipamentos (próximo)
- `/fornecedores?cat=treinamento` — treinamentos (próximo)

**Tabela `fornecedores` (substituir `empresas`):**
- Nova tabela com campos genéricos: nome, slug, categoria, cnpj, uf, cidade, endereco, telefone, whatsapp, email, logo_url, foto_url, website_url, descricao, especialidades[], categorias_oferecidas[], experiencia_anos, medicos_disponiveis, clientes, num_avaliacoes, avaliacao, verified, is_sponsored, criado_em, atualizado_em
- Índices: categoria, uf, cidade, verified, avaliacao, slug, full-text search

**Populate inicial (cascata):**
- ✅ **Clínicas:** 9 reais (São Paulo 3, RJ 2, MG 2, RS 1, PR 1) — 23/04
- 📋 **Lojas:** 8-10 (próximo)
- 📋 **Software:** 5-7 (próximo)
- 📋 **Treinamentos:** 6-8 (próximo)
- 📋 **Equipamentos:** 6-8 (próximo)
- Meta final: 100+ fornecedores em 3-4 semanas

**Entregáveis 2.2:**
- [x] Criar tabela `fornecedores` com schema genérico ✅ 23/04
- [x] Seed com 9 clínicas reais ✅ 23/04
- [x] Rota `/fornecedores` com suporte a filtro `?cat=` ✅ 23/04
- [x] Filtros por UF, cidade, busca por nome ✅ 23/04
- [ ] Lojas de EPI (8-10 registros)
- [ ] Softwares SST (5-7 registros)
- [ ] Equipamentos/EPI (6-8 registros)
- [ ] Treinamentos (6-8 registros)
- [ ] Página de detalhe `/fornecedores/[slug]` (futuro)

---

### 2.3 Estruturação de Dados — Conteúdo (Revista, Artigos, Podcast)

**Rotas:**
- `/informativos` — feed de notícias + artigos
- `/conteudo?tipo=podcast` — podcasts

**Campos:**
- **Posts (revista + artigos):** título, resumo, conteúdo_markdown, categoria, fonte, url_fonte, data_publicacao, autor, imagem, tags, uf_relacionada
- **Podcasts:** nome, descricao, host, url_plataforma, plataformas (array), logo, frequencia, ultimo_episodio, num_episodios, tema_principal

**Populate inicial:**
- 50+ artigos Markdown em `/posts/`
- 10+ podcasts cadastrados

**Entregáveis 2.3:**
- [ ] Expandir schema `posts` com campos adicionais
- [ ] Tabela `conteudo` (podcasts) criada
- [ ] Rota `/informativos` com feed, filtros (categoria, UF, data)
- [ ] Rota `/conteudo?tipo=podcast` com listing de podcasts
- [ ] Busca por tags, categoria, fonte

---

### 2.4 Estruturação de Dados — Educação (Cursos, Escolas, Faculdades)

**Rotas:**
- `/cursos` — listing geral de cursos
- `/cursos?tipo=escola` — escolas técnicas
- `/cursos?tipo=faculdade` — faculdades

**Campos:**
- **Cursos:** nome, tipo (técnico/faculdade/escola/corporativo), instituição, uf, cidade, carga_horaria, telefone, email, descricao, preco, modalidade (array), proxima_turma, nrs_cobertas, certificacao, link_inscricao
- **Escolas:** nome, cnpj, uf, cidade, telefone, email, cursos_oferecidos, modalidade, duracao, turmas_disponiveis
- **Faculdades:** nome, uf, cidade, programas (grad/mestrado/doutorado), grau, duracao, link, linhas_pesquisa

**Populate inicial:**
- 50+ cursos de diversas instituições
- 20+ escolas técnicas
- 15+ faculdades/universidades

**Entregáveis 2.4:**
- [ ] Tabela `cursos` criada com campos
- [ ] Tabelas `escolas` e `faculdades` criadas OU nested em `cursos` com tipo
- [ ] Seed com 50+ cursos, 20+ escolas, 15+ faculdades
- [ ] Rota `/cursos` com grid filtrado por tipo, UF, modalidade, NRs
- [ ] Páginas individuais com detalhes

---

### 2.5 Estruturação de Dados — Eventos & Vagas

**Rotas:**
- `/eventos` — listagem de eventos
- `/vagas` — quadro de vagas

**Campos:**
- **Eventos:** nome, descricao, data_inicio, data_fim, tipo (congresso/sipat/workshop/webinar), localidade (presencial/online/híbrido), uf, cidade, local_endereco, organizador, telefone, email, descricao_programatica, preco_inscricao, link_inscricao, vagas_disponiveis, categorias_interesse
- **Vagas:** titulo, descricao, empresa, cnpj, salario, uf, cidade, regime (CLT/PJ/autônomo), experiencia_exigida, formacao_exigida, nrs_necessarias, contato_hr, data_publicacao, link_aplicacao

**Populate inicial:**
- 20+ eventos para os próximos 3 meses
- 30+ vagas de emprego

**Entregáveis 2.5:**
- [ ] Tabelas `eventos` e `vagas` criadas
- [ ] Seed com 20+ eventos, 30+ vagas
- [ ] Rota `/eventos` com timeline/calendar, filtros por tipo/UF/data
- [ ] Rota `/vagas` com listing, filtros por regime/experiência/NRs
- [ ] Cards com informações principais
- [ ] Destaque de próximos eventos na home

---

### 2.6 Estruturação de Dados — Legislação & Calendário & Glossário

**Rotas:**
- `/legislacao` — radar legislativo
- `/calendario` — calendário de obrigações
- `/glossario` — glossário SST

**Dados:**
- **Legislação:** posts Markdown com `category: 'Legislativo'` ou tabela `legislacao` com NRs, portarias, resoluções, datas, links oficiais (Gov.br/MTE)
- **Calendário:** JSON estático `/data/calendario.json` com timeline: PPRA (anual), PCMSO (anual), LTCAT (eventual), e-Social (mensal), CIPA (anual), SIPAT (anual)
- **Glossário:** JSON estático `/data/glossario.json` com A-Z de termos técnicos SST (NR, EPI, EPC, CAT, SESMT, PPRA, PGR, etc.)

**Entregáveis 2.6:**
- [ ] Rota `/legislacao` com feed de portarias/NRs atualizadas
- [ ] Rota `/calendario` com timeline interativa, filtro por mês/tipo empresa
- [ ] Rota `/glossario` com dicionário A-Z, busca client-side
- [ ] JSONs: `calendario.json`, `glossario.json` com dados iniciais

---

### 2.7 Integração na Homepage

**Entregáveis 2.7:**
- [ ] Todos os 18 botões navegando para páginas corretas
- [ ] Destaques de eventos na seção hero ou abaixo do grid de categorias
- [ ] Link para `/vagas` no rodapé ou CTA auxiliar
- [ ] Destaque para "Últimos artigos" ou "Últimas notícias"

---

**Entregáveis Fase 2 (Resumo):**
- [ ] Tabelas Supabase: `profissionais`, expandir `empresas`, `conteudo` (podcasts), `cursos`, `eventos`, `vagas`
- [ ] Seeds com dados iniciais: 50+ profissionais, 100+ empresas, 50+ cursos, 10+ podcasts, 20+ eventos, 30+ vagas
- [ ] Rotas principais: `/profissionais`, `/fornecedores`, `/informativos`, `/conteudo`, `/cursos`, `/eventos`, `/vagas`, `/legislacao`, `/calendario`, `/glossario`
- [ ] Filtros funcionais em cada rota
- [ ] Busca FTS em profissionais e empresas
- [ ] Homepage integrada com todas as categorias
- [ ] Responsivo (desktop + mobile)

---

## Fase 3 — Ferramentas Práticas *(Autoridade Técnica)*

**Objetivo:** Tornar o AcheiSST a caixa de ferramentas do profissional SST. Aumentar autoridade e tempo de sessão.

### 3.1 Calculadora SESMT (NR-4)
- Rota: `/ferramentas/sesmt`
- Input: grau de risco + número de empregados
- Output: composição mínima obrigatória do SESMT

### 3.2 Checklist de Conformidade por NR
- Rota: `/ferramentas/checklist`
- Seleção da NR → checklist com percentual de conformidade
- Export para PDF

### 3.3 Gerador de PGR Simplificado
- Rota: `/ferramentas/pgr`
- Formulário guiado → PDF com estrutura mínima (NR-1)

### 3.4 Simulador de Multas
- Rota: `/ferramentas/multas`
- Input: NR infringida, porte da empresa, grau de infração
- Output: faixa de multa prevista (CLT + NR)

**Entregáveis Fase 3:**
- [ ] Hub `/ferramentas` com as 4 calculadoras
- [ ] `@react-pdf/renderer` para exports
- [ ] JSONs: `checklists/nr-*.json`, `multas.json`

---

## Fase 4 — Inteligência & IA *(Diferenciação)*

**Objetivo:** Transformar dados acumulados em inteligência de mercado.

### 4.1 Motor de Recomendação
- "Quem viu X também buscou Y"
- Sugestões baseadas em perfil: buscou profissional → sugere clínica próxima
- Implementar com Supabase + lógica de scoring (MVP sem ML)

### 4.2 Dashboard de Estatísticas Nacionais
- Rota: `/dados`
- Acidentes CAT/INSS, afastamentos, mortes por setor
- Gráficos com `recharts`

### 4.3 Alertas Automáticos de Legislação
- Scraping DOU + MTE para detectar novas NRs/portarias
- Claude API transforma texto em resumo acessível
- Email automático para usuários inscritos por tema
- Cron via Supabase Edge Functions ou Vercel Cron

### 4.4 Newsletter de Tendências
- Geração mensal com Claude API
- Preview público do último relatório

**Entregáveis Fase 4:**
- [ ] Claude API integrada
- [ ] Dashboard `/dados` com gráficos
- [ ] Cron de alertas legislativos
- [ ] Sistema de newsletter

---

## Fase 5 — Criação de Contas & Captação de Leads *(Opcional futuro)*

**Objetivo:** Estruturar autenticação e captação de leads quando o site estiver pronto e funcional.

### 5.1 Sistema de Autenticação & Contas
- Supabase Auth (magic link ou email+senha)
- Tipos de conta: Fornecedor, Profissional, Usuário Comum
- Validação e moderação de perfis antes de publicar
- Rota: `/painel/login`, `/cadastrar`

### 5.2 Painel do Fornecedor (autenticado)
- Rota protegida: `/painel`
- Visualizar e editar próprio perfil
- Visualizar leads recebidos (nome, contato, descrição, data)
- Ver métricas básicas: visualizações do perfil, cliques no WhatsApp, leads recebidos
- Histórico de interações

### 5.3 Formulário "Solicitar Orçamento"
- Botão nos perfis de empresa e profissional
- Comprador preenche: nome, email/telefone, descrição da necessidade, UF, prazo
- **Comprador NÃO precisa criar conta**
- Lead armazenado em tabela `leads` no Supabase
- Lead enviado para até 3 fornecedores (regra do context.md §6E)

### 5.4 Botão WhatsApp Direto
- CTA primário nos cards de empresa/profissional
- Link `wa.me/{numero}?text=Olá, vi seu perfil no AcheiSST...`
- Rastrear cliques para métricas

### 5.5 Integração Resend
- Emails transacionais: nova conta, lead recebido, notificações

**Entregáveis Fase 5:**
- [ ] Supabase Auth configurado (magic link)
- [ ] Rotas `/painel/login`, `/cadastrar` com formulários
- [ ] Tabelas: `leads`, `user_profiles`, `metricas`
- [ ] Funções SQL: incrementar_whatsapp_click, incrementar_profile_view, incrementar_lead_recebido
- [ ] Rota `/api/whatsapp/[slug]` (tracking de cliques)
- [ ] Integração Resend para emails
- [ ] Middleware de proteção de rotas autenticadas

---

## Fase 6 — Monetização *(Receita Recorrente — Opcional futuro)*

**Objetivo:** Converter a base de fornecedores em receita quando o site estiver consolidado. Implementar planos Free/Pro/Premium e sistema de destaques patrocinados.

### 6.1 Planos de Assinatura (Free / Pro / Premium)
- Integração Stripe (checkout + webhooks)
- Tabela `assinaturas` no Supabase com plano ativo, data de vencimento
- Limites por plano:
  - Free: 5 leads/mês, sem verificado, sem destaque
  - Pro: 50 leads/mês, selo verificado, métricas completas
  - Premium: ilimitado, 1 slot destaque incluído, página rica
- Middleware de controle de acesso por plano
- Página `/planos` com comparativo e CTA

### 6.2 Destaques Patrocinados
- Tipos: Patrocinado (topo), Vitrine (home/categoria), Selo Destaque
- Tabela `sponsored_slots` no Supabase
- Controle de slots por cidade + categoria (máx. 3 patrocinados por combinação)
- Admin ativa/desativa manualmente no MVP
- Rotação automática se houver mais de 1 anunciante
- Label "Patrocinado" obrigatório e visível

### 6.3 Regras de Ranking Implementadas
- Ordenação na busca/listagem: Patrocinado > Vitrine > Verificado > Pro > Free
- Campo `rank_score` calculado e indexado no Supabase

### 6.4 Admin Panel
- Rota protegida: `/admin` (apenas email do owner)
- Aprovar cadastros pendentes
- Ativar/desativar slots patrocinados
- Ver volume de leads e métricas da plataforma
- Gestão de usuários e planos

**Entregáveis Fase 6:**
- [ ] Stripe integrado (checkout + webhooks)
- [ ] Tabelas: `assinaturas`, `sponsored_slots`
- [ ] Middleware de plano (Free/Pro/Premium)
- [ ] Página `/planos` com comparativo
- [ ] Sistema de ranking implementado
- [ ] Admin panel funcional
- [ ] Relatórios premium para empresas

---

## Visão Geral do Roadmap

| Fase | Foco | Prioridade | Status |
|---|---|---|---|
| 1 — Identidade & Catálogo | Vitrine do produto | **Alta** | ✅ Completa |
| 2 — Conteúdo & Comunidade | Retenção + SEO | **Alta** | 🔄 Próxima |
| 3 — Ferramentas Práticas | Autoridade técnica | Média | Planejada |
| 4 — IA & Inteligência | Diferenciação | Média | Planejada |
| 5 — Autenticação & Leads | *Opcional — só após site pronto* | — | Futuro |
| 6 — Monetização | *Opcional — só após funcionando* | — | Futuro |

## Dependências

```
Fase 1 (catálogo completo + identidade) ✅
  → Fase 2 (conteúdo: eventos, vagas, legislação, glossário)
    → Fase 3 (ferramentas: calculadoras, checklists, PGR)
      → Fase 4 (IA: motor recomendação, dashboard, newsletter)
        → [Site pronto e funcional — agora sim, estudar autenticação]
          → Fase 5 (autenticação + captação de leads)
            → Fase 6 (monetização com Stripe e planos)
```

## Estratégia

1. **Focar em desenvolvimento e funcionalidade** — Fase 1 até 4 criam um produto sólido
2. **Estudar e estruturar auth/contas** — Entender fluxos de autenticação antes de implementar
3. **Captação de leads** — Apenas quando o site estiver pronto e funcional
4. **Monetização** — Implementar pagamentos e planos apenas depois que tudo estiver operacional

## Próxima Ação

Iniciar **Fase 2 — Conteúdo & Comunidade**:
1. Estruturar dados de eventos, vagas, legislação
2. Criar rotas `/eventos`, `/vagas`, `/legislacao`, `/calendario`, `/glossario`
3. Integrar com home (destaques de eventos)
