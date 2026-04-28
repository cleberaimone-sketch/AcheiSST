# Contexto do Projeto: PlugaSST / AcheiSST
> Atualizado em: 23/04/2026 às 20:00 | Owner: Cleber Aimoni — Grupo SafeWork
> **Última mudança:** Reformulação da homepage (botões das categorias no topo), implementação de clínicas (9 reais no Supabase)

---

## ⚠️ REGRA ABSOLUTA — INTEGRIDADE DAS INFORMAÇÕES

> **NUNCA inventar, fabricar ou supor informações no site.**

Esta é a regra mais importante do projeto e se aplica a tudo:

- **Notícias e informativos:** somente de fontes verificadas e identificadas (MTE, Gov.br, Fundacentro, Revista Proteção, Revista CIPA, DOU, etc.). Nunca gerar texto informativo sem fonte real.
- **Clínicas e empresas:** somente cadastros de empresas reais, com CNPJ existente e dados verificáveis.
- **Profissionais:** somente profissionais com registro ativo nos conselhos competentes (CRM, CREA, CFT).
- **Normas Regulamentadoras:** citar apenas o texto oficial do MTE. Jamais parafrasear de memória sem conferir a fonte.
- **Estatísticas e dados:** somente de fontes públicas oficiais (INSS, MTE, IBGE, Fundacentro).
- **IA e automação:** qualquer conteúdo gerado por IA precisa ser revisado e ter fonte verificável antes de publicar.

**Razão:** O PlugaSST opera em um setor que impacta diretamente a saúde e segurança de trabalhadores. Informação falsa pode causar dano real — uma empresa que não existe, um profissional sem registro, uma norma citada errada.

**Consequência prática para o desenvolvimento:**
- Dados de demonstração (mock/placeholder) devem ser claramente marcados como tal e removidos antes de qualquer publicação pública.
- O sistema de cadastro deve ter etapa de moderação antes de publicar qualquer perfil.
- Scraping de dados deve sempre preservar e exibir a fonte original.

---

## 1. Visão Geral

**PlugaSST** (ou **AcheiSST**) é um ecossistema digital B2B/B2C focado exclusivamente em **Saúde e Segurança do Trabalho (SST)** no Brasil.

O produto é uma combinação de:
- **Motor de busca especializado** em SST
- **Marketplace** conectando compradores, fornecedores e profissionais
- **Hub de conteúdo e informação** do setor
- **Agregador de comunidade** (profissionais, empresas, eventos)

### Slogan oficial
> **"Tudo sobre SST em um só lugar"**
> *A primeira plataforma que reúne fornecedores, profissionais, conteúdo e ferramentas de Saúde e Segurança do Trabalho do Brasil.*

### Analogia de posicionamento
> "É o Google do SST + Tinder de fornecedores + LinkedIn do setor"

Inspiração no modelo do Tinder: além de conectar comprador e fornecedor, a plataforma faz **sugestões inteligentes** com base no perfil e histórico de busca do usuário (ex: buscou profissional → sistema sugere clínica ou treinamento relacionado).

### Plataforma responsiva
A plataforma deve funcionar plenamente em **desktop e mobile**. Todo layout, componente e fluxo deve ser projetado mobile-first, garantindo boa experiência nos dois dispositivos.

---

## 2. Origem e Evolução

O projeto começou como **Ecossistema SST Brasil**, desenvolvido pela **Safework**, para centralizar notícias SST e conectar o setor. As bases já implementadas:
- Feed de informativos/notícias com categorias e filtros por UF
- Diretório de profissionais (médicos do trabalho, engenheiros, técnicos) com busca e filtros
- Hub de empresas parceiras SST
- Stack: Next.js 16 App Router + Supabase + Tailwind CSS, deploy na Vercel

A visão evoluiu para um produto maior: **PlugaSST** como referência nacional do setor SST.

---

## 3. Identidade de Marca

| Campo | Opções |
|---|---|
| **Nome** | PlugaSST *(favorito)* / AcheiSST |
| **Logo** | Lupa + capacete de EPI / Boneco com lupa e capacete |
| **Tom** | Profissional, direto, referência de mercado |
| **Presença** | Instagram + LinkedIn da plataforma |
| **Aquisição** | Google Ads, comunidades WhatsApp do setor |

---

## 4. Categorias da Plataforma

### 4.1 Fornecedores & Produtos
- Lojas de EPI
  - Subcategorias: botinas, luvas, capacetes, óculos, protetor auricular, etc.
- Equipamentos e maquinário de segurança
- Softwares de SST (ex: SOC, eSocial, GRO)
- Ferramentas de IA aplicadas à SST

### 4.2 Serviços & Profissionais
- Clínicas de medicina do trabalho
- Engenheiros de segurança do trabalho
- Médicos do trabalho
- Técnicos de segurança do trabalho
- Peritos de SST
- Higienistas ocupacionais
- Outros profissionais especializados

### 4.3 Educação & Formação
- Faculdades: graduação e pós-graduação (eng. segurança, medicina do trabalho)
- Escolas técnicas (formação de técnicos de SST)
- Mestrado e especializações
- Cursos livres e treinamentos (NRs, primeiros socorros, etc.)

### 4.4 Órgãos Públicos & Reguladores
- Ministério do Trabalho e Emprego (MTE)
- CREA
- CRM
- CFT (Conselho Federal dos Técnicos)
- Outros órgãos do setor

### 4.5 Conteúdo & Mídia
- Revistas especializadas (ex: Revista Proteção, Revista CIPA)
- Blogs de SST
- Podcasts de SST
- Canais do YouTube sobre SST
- Artigos técnicos e acadêmicos
- Notícias (agregador filtrado por SST — jornais, revistas, MTE)

### 4.6 Eventos
- Workshops, congressos, palestras, seminários
- Listagem por data, filtráveis por mês/ano e estado
- Destaque para eventos pagos/patrocinados

### 4.7 Jurídico & Normativo
- Jurisprudências e decisões de julgamentos relacionados a SST
- Atualizações de Normas Regulamentadoras (NRs)
- Notícias legislativas do setor

### 4.8 Vagas de Emprego
- Técnicos, engenheiros, médicos do trabalho
- Empresas podem patrocinar destaque de vagas
- Comunidades e grupos do setor

---

## 5. Funcionalidades do Motor de Busca

### 5.1 Busca & Filtros
- Busca por palavra-chave dentro de qualquer categoria
- Filtros por **estado** e **município**
- Filtros por tipo (produto, serviço, profissional, conteúdo, evento)
- Ordenação por relevância, avaliação, proximidade

### 5.2 Rankings & Selos
- Ranking por categoria (ex: top clínicas do RS, top fornecedores de luvas)
- **Selo "Verificado"** para perfis auditados
- **Destaque Premium** — posição patrocinada no topo do ranking
- **Selo Anuário SST** — referência ao anuário da Revista Proteção

### 5.3 Sugestões Inteligentes (motor de recomendação)
- Com base no perfil e histórico de busca, o sistema sugere categorias relacionadas
- Ex: usuário busca "profissional médico do trabalho" → sistema sugere "clínicas de medicina do trabalho próximas" ou "treinamentos de NR7"
- Baseado no modelo de cross-sell do Tinder (sugestões de restaurantes/passeios)

### 5.4 Agregador de Notícias
- Feed de notícias SST com fontes confiáveis (MTE, Proteção, CIPA, etc.)
- Filtrável por tema (NR, acidente, legislação, tecnologia)
- Destaque para notícias patrocinadas/editoriais

---

## 6. Modelo de Monetização (MISTO)

### Estratégia
- **Assinatura (MRR):** receita recorrente e previsível — sustenta a operação
- **Destaques/anúncios:** aumenta ticket médio e captura urgência ("quero aparecer no topo")

### 6.1 Planos de Assinatura do Fornecedor

#### Free (entrada)
- Perfil público no diretório
- Botão WhatsApp + Solicitar Orçamento
- Limite de **5 leads/mês**
- Sem selo verificado
- Sem prioridade na busca

#### Pro (carro-chefe)
- Até **50 leads/mês** (ou "ilimitado com uso justo")
- **Selo Verificado** (após checagem pelo admin)
- Prioridade na ordenação acima do Free
- Relatórios básicos: visualizações do perfil, cliques no WhatsApp, leads recebidos

#### Premium (domínio local)
- Tudo do Pro
- **1 slot de destaque incluído** (cidade + categoria) OU desconto no patrocinado
- Prioridade máxima orgânica (abaixo apenas do "Patrocinado")
- Página extra: portfólio, cases, equipe + mais fotos/links

> "Ilimitado" deve ter política de **uso justo (fair use)** para evitar abuso.

### 6.2 Destaques / Anúncios

#### A) Patrocinado (Topo) — principal produto de anúncio
- Exibido no **topo da lista** em cidade + categoria
- Rotulado claramente como **"Patrocinado"**
- **Máximo 3 cotas** por cidade/categoria
- Compra por período: 7 dias / 30 dias (ou recorrente mensal)

#### B) Vitrine (Home e Categoria)
- Carrossel "Destaques" na Home e "Em destaque" nas páginas de categoria
- Máximo **8 slots** por cidade ou por categoria
- Compra por período: 7/30 dias

#### C) Selo "Destaque" no card (intermediário)
- Tag visual + melhora posição orgânica
- Upsell mais barato e de fácil conversão

### 6.3 Outros produtos de monetização
| Produto | Descrição |
|---|---|
| **Patrocínio de categoria** | Marca "dona" de uma categoria (ex: 3M patrocina "Luvas de Segurança") |
| **Vagas patrocinadas** | Empresa paga para vaga ficar em destaque |
| **Anuário SST** | Publicação anual das melhores empresas/fornecedores do setor |
| **Banners e capas temáticas** | Espaços editoriais por fornecedor ou campanha |
| **Eventos patrocinados** | Destaque e venda de ingressos via plataforma |

> Referência: grandes indústrias como 3M, Honeywell, DeltaPlus já patrocinam capas da Revista Proteção — esse público é o alvo primário dos planos premium.

---

## 6A. Regras de Ranking (Ordenação)

Ordem de prioridade nos resultados de busca:

1. **Patrocinado ativo** (topo — slots limitados)
2. **Vitrine/Featured ativo**
3. **Verificado**
4. **Plano** (Premium > Pro > Free)
5. *(Fase 2)* Avaliação e tempo médio de resposta

### Rotação entre anunciantes
- Se houver mais anunciantes do que slots disponíveis, rotacionar por impressão ou por share alternado
- Fornecedor com baixa performance (não responde leads) perde prioridade

---

## 6B. Anti-spam e Qualidade

### Critérios mínimos para anunciar
- Perfil completo: contato, categorias, cobertura geográfica, descrição
- Contato validado (mínimo); ideal: selo "Verificado"

### Penalidades por baixa qualidade
Se fornecedor recebe leads e não responde repetidamente:
- Reduzir prioridade orgânica
- Limitar exposição em vitrine
- *(Opcional)* Bloquear compra de novos destaques até regularizar

### Transparência
- Todo anúncio deve estar claramente rotulado como **"Patrocinado"**

---

## 6C. Precificação por Tiers

### Tier por cidade
| Tier | Cidades |
|---|---|
| **A** | São Paulo, Rio, BH, Brasília, Curitiba, Porto Alegre |
| **B** | Capitais e polos regionais |
| **C** | Cidades menores |

### Tier por categoria (valor do ticket)
| Tier | Categorias |
|---|---|
| **Premium** | PGR, LTCAT, PPP, Perícia, ISO, eSocial |
| **Médio** | Treinamentos NR, EPC, linha de vida |
| **Entrada** | EPI, conteúdo |

> Fórmula: `preço final = preço base × multiplicador de cidade × multiplicador de categoria`

---

## 6D. Fluxo de Compra (Painel do Fornecedor)

1. **Página "Planos"** → escolher Free / Pro / Premium → assinar
2. **Página "Comprar Destaque"**
   - Selecionar cidade
   - Selecionar categoria
   - Escolher tipo: Topo Patrocinado / Vitrine / Selo Destaque
   - Escolher período: 7 / 30 dias
   - Checkout *(pode ser manual no MVP — admin ativa o plano/destaque)*
3. **Relatórios**: impressões, cliques no WhatsApp, leads recebidos

---

## 6E. Regras do Lead

- Comprador **não precisa criar conta** para solicitar orçamento
- Lead é enviado para até **3 fornecedores** com prioridade:
  - Patrocinado/Featured ativo > Verificado > Plano > Match local/remoto
- Free recebe no máximo 5 leads/mês → ao atingir limite, exibir sugestão de upgrade

---

## 7. Fontes de Dados & Integrações

| Fonte | Tipo | Uso |
|---|---|---|
| Revista Proteção (digital) | Conteúdo / Anuário | Extração de artigos, patrocinadores, anuário SST |
| Revista CIPA | Conteúdo | Artigos e notícias |
| Site MTE | Regulatório | Notícias, NRs, portarias |
| Comunidades WhatsApp | Comunidade | ~900–1000 profissionais por grupo (base de aquisição) |
| CNPJ / Receita Federal | Dados | Identificação de empresas do setor (integração com SafeWork Prospector) |
| LinkedIn / Instagram | Social | Distribuição de conteúdo e aquisição |
| Doctoralia / CatalogoMed | Scraping | Profissionais de saúde ocupacional (já implementado para PR e SC) |

---

## 8. Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router) + Tailwind CSS 3 |
| Backend / BaaS | Supabase (auth, DB, storage) |
| Deploy | Vercel |
| Busca | Supabase Full-Text Search ou Algolia |
| Automações | Make.com / n8n |
| WhatsApp | Z-API ou Evolution API |
| CMS / Conteúdo | Markdown local (/posts/*.md) + Supabase |

---

## 9. Módulos para Desenvolvimento (ordem sugerida)

1. **Landing page** + identidade visual (PlugaSST)
2. **Motor de busca** com categorias e filtros (estado/município)
3. **Cadastro de fornecedores/profissionais** (perfil público)
4. **Sistema de selos e rankings**
5. **Agregador de notícias** (RSS / scraping MTE + Proteção)
6. **Módulo de eventos** (listagem + filtro por data)
7. **Módulo de vagas**
8. **Painel do anunciante** (autoatendimento para patrocínio)
9. **Motor de recomendação** (sugestões inteligentes)
10. **Anuário SST** (publicação anual)

Ver `docs/plan.md` para o plano de implementação em fases com tarefas detalhadas.

---

## 10. Entidades de Dados (para suportar monetização)

```ts
Provider {
  plan: 'free' | 'pro' | 'premium'
  verify_status: boolean
  rank_plan: number
  featured_until: date | null
  sponsored_slots: SponsoredSlot[]
}

SponsoredSlot {
  city: string
  category: string
  start_date: date
  end_date: date
  status: 'active' | 'paused' | 'expired'
  type: 'top' | 'vitrine' | 'badge'
}

Plan {
  name: string
  lead_limit: number
  features: string[]
}

Metrics {
  provider_id: string
  date: date
  profile_views: number
  whatsapp_clicks: number
  leads_received: number
}
```

---

## 11. Métricas Mínimas para Vender Pro e Anúncios

Rastrear obrigatoriamente desde o MVP:
- `profile_views` — visualizações do perfil
- `whatsapp_clicks` — cliques no botão WhatsApp
- `leads_received` — leads recebidos via formulário

> Essas métricas são o principal argumento de upsell: *"Você recebeu X oportunidades este mês. Com destaque você aparece no topo."*

*(Fase 2)* Taxa de resposta e deals fechados.

---

## 12. Brainstorm Adicional de Funcionalidades

### Conteúdo & Informação
- **Radar Legislativo** — feed em tempo real de novas NRs, portarias, resoluções (Gov.br + DOU)
- **Calendário de obrigações** — PPRA, PCMSO, e-Social, prazos por tipo de empresa
- **Biblioteca de documentos** — PPP, ASO, LTCAT, modelos prontos para download
- **Mapa de acidentes** — visualização geográfica de dados públicos do CAT/INSS
- **Glossário SST** — dicionário técnico interativo (NR, EPI, EPC, eSocial, etc.)

### Comunidade
- **Fóruns por tema** — NR-35, espaço confinado, ergonomia, etc.
- **Grupos por UF/região** — networking local
- **Perguntas & Respostas** — estilo Stack Overflow para dúvidas técnicas SST

### Ferramentas Práticas
- **Calculadora de dimensionamento SESMT** — baseada na NR-4 (grau de risco + número de empregados)
- **Checklist de conformidade por NR** — empresa verifica se está em dia
- **Gerador de PPRA/PGR simplificado** — formulário guiado
- **Simulador de multas** — impacto financeiro de não-conformidades

### Dados & Inteligência
- **Dashboard de estatísticas nacionais** — acidentes, afastamentos, doenças ocupacionais (dados públicos)
- **Ranking de setores mais perigosos** — CNAE vs. CAT
- **Relatório de tendências** — newsletter mensal curada por IA

### Governo & Fiscalização
- **Canal de denúncia anônima** — integrado com Auditoria Fiscal do Trabalho
- **Agenda de auditorias públicas** — MTE, INSS

---

## 13. Observações do Dono do Produto

- Iniciar com as categorias mais importantes e **ir acrescentando progressivamente**
- Prioridade inicial: lojas de EPI, clínicas, profissionais, softwares, notícias
- A plataforma precisa ser **simples de navegar** — o usuário abre, vê as categorias, clica e encontra
- A monetização deve ser pensada desde o início no design das categorias
- Existe uma base de **comunidades WhatsApp** com milhares de profissionais SST que pode ser usada para aquisição inicial
- O nome e logo ainda em definição — **PlugaSST** é o favorito até o momento
- **Desktop + Mobile:** a plataforma deve funcionar perfeitamente nos dois — layout responsivo obrigatório

---

## 14. Decisões de Design & Homepage (22/04/2026)

### 14.1 Sistema de Previews (A/B Testing)
A homepage tem 3 temas alternáveis via botão fixo no canto inferior direito:
- **PlugaSST (Novo)** — default atual, estilo claro (branco/slate-50, acento verde)
- **Tech Brazil** — standby, estilo claro com verde
- **Blue Hub** — standby, estilo escuro com azul

Componente: `src/components/ThemeProvider.tsx` — `type Theme = 'plugasst' | 'brazil_min' | 'blue_hub'`

### 14.2 Estrutura da Homepage PlugaSST (implementada)
Baseada em wireframe desenhado à mão (`homepage_seplugasst.jpeg`) + referência do app BeSafe (`ideias_frontpage/`).

**Componente principal:** `src/components/HeroPlugaSST.tsx`

Seções na ordem:
1. **Hero** — badge "Ecossistema SST" + título "Fazendo um mundo mais seguro" + subtítulo "Um mundo de soluções" + barra de busca (input + select UF + botão verde)
2. **Grid de 18 categorias** (3 linhas × 6 colunas) dentro de card branco:
   - Linha 1: Profissionais · Clínicas · Lojas · Software · Revista · Podcast
   - Linha 2: Peritos · Professores · Cursos · Escola · Faculdade · Equipamentos
   - Linha 3: Eventos · Vagas · Orçamentos · Ferramentas IA · Treinamentos · Artigos
   - Cada botão: ícone colorido (Lucide) + label + hover verde
3. **Stats bar verde** — 5.000+ Fornecedores · 50k+ Profissionais · 1M+ Conexões
4. **Destaques Premium** — grid de 4 cards com foto, badge "Premium" âmbar, categoria colorida + checkmark verificado, nome, avaliação ⭐, cidade/UF, tag "Remoto"
5. **CTA Fornecedor** — banner gradiente verde "É fornecedor de SST? Cadastrar meu negócio"
6. **Rodapé** — 3 colunas: Ações Rápidas (Contratar/Buscar/Ranking) · Órgãos Reguladores (MTE/CREA/CRM/ISO/OSHA) · Comunidade (Blog/YouTube/Instagram/Facebook)

### 14.3 Insights do App BeSafe (referência)
O app BeSafe (`ideias_frontpage/`) é um protótipo mobile do mesmo conceito. Elementos validados para usar no PlugaSST:
- **"Destaques Premium"** — seção com foto real + estrelas + verificado (já implementada)
- **"Conteúdo em Destaque"** — artigos com autor e contagem de likes (a implementar)
- **"Próximos Eventos"** — listagem com tipo, data, cidade e preço (a implementar)
- **"Novos na Plataforma"** — novos fornecedores cadastrados (a implementar)
- **"Por que ser fornecedor?"** — 4 cards: Aumente vendas · Credibilidade · Leads qualificados · Destaque (a implementar na página `/cadastrar`)
- **Stats do app:** 5.000+ Fornecedores · 50k+ Profissionais · 1M+ Conexões (já implementado)
- **Navegação bottom bar** (mobile): Início · Explorar · Serviços · Perfil (a implementar no mobile)

### 14.4 Design System da Homepage
- **Fundo:** `bg-white` (hero) + `bg-slate-50` (seções intermediárias) + `bg-white` (rodapé)
- **Acento principal:** `green-600` (botões, hover, badges, stats bar)
- **Premium:** `amber-400` (badge Premium nos cards)
- **Cards de categoria:** `bg-slate-50` → hover `bg-green-50` + borda `hover:border-green-200`
- **Cards Premium:** foto real + badge âmbar + categoria colorida + estrelas âmbar

### 14.5 Roteamento do HomeSwitch
`src/components/HomeSwitch.tsx` — Client Component que lê o tema e renderiza:
- `acheisst` → `<HeroAcheiSST />` (tema padrão verde, sem NewsFeed, sem footer antigo)
- `preview_5` → `<HeroV5 />` (tema dark premium)
- `brazil_min` / `blue_hub` → `<Hero /> + <NewsFeed /> + <OldFooter />`

---

## 15. Decisões de Produto e Infraestrutura (23/04/2026)

### 15.1 Renomeação: PlugaSST → AcheiSST
- Nome final escolhido: **AcheiSST**
- Domínio registrado: **acheisst.com.br** (Hostgator, registrado em 23/04/2026, vence 23/03/2027)
- Tema padrão renomeado de `plugasst` para `acheisst` no ThemeProvider
- Componente principal renomeado de `HeroPlugaSST` para `HeroAcheiSST`

### 15.2 Configuração de DNS (Hostgator → Vercel)
DNS configurado manualmente na Zona de DNS da Hostgator. Nameservers mantidos na Hostgator (`dns3/dns4.hostgator.com.br`). Registros criados:

| Tipo | Nome | Valor |
|---|---|---|
| `A` | `acheisst.com.br.` | `76.76.21.21` (IP Vercel) |
| `CNAME` | `www.acheisst.com.br.` | `cname.vercel-dns.com` |

Próximo passo: adicionar `acheisst.com.br` em **Vercel → Settings → Domains** para ativar SSL.

### 15.3 Redesign Frontend — Sistema de Previews (23/04/2026)
Implementado sistema de 4 temas alternáveis via botão fixo no canto inferior direito:

| Tema | Componente | Descrição |
|---|---|---|
| `acheisst` | `HeroAcheiSST` | Padrão — branco/slate-50, acento verde |
| `brazil_min` | `Hero` + `NewsFeed` | Layout anterior verde |
| `blue_hub` | `Hero` + `NewsFeed` | Layout anterior azul/escuro |
| `preview_5` | `HeroV5` | Dark premium — slate-950, verde neon, Playfair Display |

**Preview 5 (Dark)** — características:
- Fundo `bg-slate-950`, cards `bg-slate-900`, bordas `slate-800`
- Acento verde `green-500/400` (safety green)
- Tipografia editorial: Playfair Display nos headings, Lora no corpo
- Grid de categorias com glow verde no hover
- Navbar integrada dark glass com blur
- Aplicado em todas as páginas: home, `/fornecedores`, `/profissionais`, `/informativos`

**Correção da página `/informativos`:**
- Removida foto azul do banner superior (que destoava do tema verde)
- Substituída por header limpo branco com badge verde "Atualizado diariamente"
- Lógica corrigida: `plugasst`/`acheisst` agora sempre usa verde (antes caía no `else` azul)
- Azul mantido apenas para o tema `blue_hub`

### 15.4 Atualizações de Design — Hero Section & Favicon (23/04/2026)

**Aumentos de logos:**
- Navbar: logo `h-9` → `h-14` (56px), navbar `h-16` → `h-20`
- HeroV5: logo badge `w-8 h-8` → `w-11 h-11`, ícone `w-4 h-4` → `w-5 h-5`, texto `text-xl` → `text-2xl`
- Footer: logo `h-5` → `h-7`

**Background image — mapa do trabalho:**
- Imagem `mapadotrabalho.jpg` (da pasta `ideias_frontpage/logotipo_oficial/`) adicionada como background full-width
- **HeroAcheiSST:** full-width edge-to-edge com overlay gradiente branco translúcido (`from-white/85 via-white/80 to-white/85`), posicionamento `center top`, altura mínima `min-h-[500px]`, flexbox centrado
- **HeroV5:** container com glass effect (`backdrop-blur-md`), overlay gradiente escuro (`from-slate-950/70 via-slate-900/60 to-slate-950/70`), bordas arredondadas
- Efeito visual: imagem como fundo com overlay para manter contraste do texto

**Favicon & Aba do Navegador:**
- Title da aba: `"AcheiSST — Tudo sobre SST em um só lugar"` → `"AcheiSST"` (simplificado)
- Favicon: `logo_acheisst.png` convertida para `favicon.ico` 32x32px com cantos arredondados (radius 6)
- Configurado em metadata com `icons: { icon: '/favicon.ico' }`

**Mobile responsivo:**
- Meta tag viewport adicionada: `width=device-width, initial-scale=1`
- Todos os componentes com breakpoints Tailwind (`grid-cols-1 lg:grid-cols-12`, `sm:flex-row`, `px-4 sm:px-6 lg:px-8`)
- Testado em localhost:3000 com dev server

---

## 16. Roadmap de Implementação — Fases Próximas

### Fase 1 — Base Sólida ✅ (Implementada)
- [x] Diretório de notícias/informativos com filtros
- [x] Diretório de profissionais com busca
- [x] Hub de empresas parceiras
- [x] Sistema de temas alternáveis (4 previews)
- [x] Domain e DNS configurados
- [x] Deploy em produção (Vercel)
- [x] **Sistema de Auth completo** (27/04/2026)
  - Tabela `profiles` + `user_roles` no Supabase com RLS
  - Trigger automático `on_auth_user_created` cria perfil no banco a cada novo cadastro
  - `src/pages/Auth.tsx`: indicador de força de senha, rate limiting, eye toggle, erros genéricos seguros
  - Página `/cadastro-concluido` com fluxo profissional pós-registro
  - Google OAuth preparado mas desabilitado (ativar quando configurar no Supabase Dashboard)
- [x] **Rodapé redesenhado** (27/04/2026) — fundo escuro, redes sociais (LinkedIn, Instagram, YouTube, WhatsApp), CTA fornecedor
- [x] **Vercel CLI configurado** — projeto linkado: cleberaimone-sketchs-projects/ecosystem-sst-brasil

### Fase 2 — Conteúdo & Comunidade 🔄 (Em desenvolvimento)
- [ ] **Módulo de Eventos SST** (`/eventos`)
  - Listagem de congressos, SIPATs, workshops, webinars
  - Filtros: mês, UF, tipo (presencial/online)
  - Destaque semanal na home
- [ ] **Quadro de Vagas SST** (`/vagas`)
  - Job board especializado: técnico, engenheiro, médico do trabalho
  - Campos: cargo, empresa, UF, regime (CLT/PJ), NRs exigidas
  - Vagas patrocinadas aparecem no topo
- [ ] **Radar Legislativo** (`/legislacao`)
  - Feed de NRs, portarias, resoluções com data e link oficial
  - Filtro por tema
- [ ] **Calendário de Obrigações SST** (`/calendario`)
  - Timeline com PPRA, PCMSO, LTCAT, e-Social, CIPA, SIPAT
  - Filtro por mês e tipo de empresa
- [ ] **Glossário SST** (`/glossario`)
  - Dicionário técnico A–Z: NR, EPI, EPC, CAT, SESMT, PPRA, PGR, etc.
  - Busca client-side

### Fase 3 — Ferramentas Práticas 🎯 (Planejada)
- [ ] **Calculadora SESMT (NR-4)** — grau de risco + empregados → composição SESMT
- [ ] **Checklist de Conformidade por NR** — seleção da NR → checklist com percentual
- [ ] **Gerador de PGR Simplificado** — formulário guiado → PDF
- [ ] **Simulador de Multas** — NR infringida → faixa de multa prevista

### Fase 4 — Inteligência & IA 📊 (Planejada)
- [ ] **Motor de Recomendação** — "Quem viu X também buscou Y"
- [ ] **Dashboard Nacional** — mapa do Brasil com estatísticas por UF (CAT, afastamentos, acidentes)
- [ ] **Alertas Automáticos de Legislação** — scraping DOU + MTE, resumo com Claude API
- [ ] **Newsletter de Tendências** — geração mensal com Claude API

### Fase 5 — Captação de Leads (Opcional futuro)
- [ ] **Formulário "Solicitar Orçamento"** (comprador envia lead, fornecedor recebe)
- [ ] **Painel de Cadastro/Login** (`/painel/login`, `/cadastrar`)
  - Autenticação via Supabase Auth
  - Perfis de fornecedores com validação
  - Moderação antes de publicar
- [ ] **Botão WhatsApp Direto** com rastreamento de cliques
- [ ] **Dashboard do Fornecedor** — visualizar leads, métricas, histórico

### Fase 6 — Monetização 💰 (Opcional futuro)
- [ ] **Planos de Assinatura** (Free / Pro / Premium) com Stripe
- [ ] **Destaques Patrocinados** — Patrocinado (topo), Vitrine (home), Selo Destaque
- [ ] **Sistema de Ranking** — Patrocinado > Vitrine > Verificado > Pro > Free
- [ ] **Admin Panel** — aprovar cadastros, gerenciar slots patrocinados, ver métricas
- [ ] **Relatórios premium** para empresas

---

## 17. Mapeamento Completo — Estrutura de Dados & Páginas

A homepage tem **18 categorias principais**. Aqui está a estruturação completa de cada uma:

### 1️⃣ **Profissionais** (`/profissionais`)
**O que é:** Diretório de especialistas SST individuais (técnicos, engenheiros, médicos, etc.)

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome | `text` | ✅ | "João Silva" |
| Especialidade | `enum` | ✅ | Técnico, Engenheiro, Médico, Perito, Higienista |
| Registro profissional | `text` | ✅ | "CREA-PR 12345/D" |
| UF | `char(2)` | ✅ | "PR" |
| Cidade | `text` | ✅ | "Curitiba" |
| Telefone/WhatsApp | `text` | ✅ | "(41) 99999-9999" |
| Email | `email` | ✅ | "joao@email.com" |
| Foto | `url` | ❌ | Link da imagem |
| Descrição | `text` | ❌ | Bio profissional |
| NRs de expertise | `text[]` | ❌ | ["NR-4", "NR-5", "NR-35"] |
| Experiência (anos) | `integer` | ❌ | 15 |
| Avaliação | `decimal(2,1)` | ❌ | 4.8 |
| Verificado | `boolean` | ❌ | true |

**Filtros:** Especialidade, UF, Cidade, NR de expertise
**Organização:** Grid com cards, ordenação por verificado/avaliação
**Fonte de dados:** Scraping (CFM, CREA, CFT), cadastro manual, importação de CNPJ

---

### 2️⃣ **Clínicas** (`/fornecedores?cat=clinica`)
**O que é:** Clínicas e centros de medicina do trabalho

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome | `text` | ✅ | "ClinicaSeg" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "SP" |
| Cidade | `text` | ✅ | "São Paulo" |
| Endereço | `text` | ✅ | "Av. Paulista, 1000" |
| Telefone | `text` | ✅ | "(11) 3333-3333" |
| WhatsApp | `text` | ✅ | "(11) 99999-9999" |
| Email | `email` | ✅ | "contato@clinicaseg.com.br" |
| Logo | `url` | ❌ | Link da logo |
| Foto do espaço | `url` | ❌ | Link da foto |
| Descrição | `text` | ❌ | Sobre a clínica |
| Especialidades oferecidas | `text[]` | ❌ | ["PCMSO", "ASO", "Avaliação clínica"] |
| Médicos disponíveis | `integer` | ❌ | 5 |
| Atende empresas de qual porte | `text[]` | ❌ | ["Pequena", "Média", "Grande"] |
| Horário funcionamento | `text` | ❌ | "8h-18h" |
| Verificado | `boolean` | ❌ | true |
| Avaliação | `decimal(2,1)` | ❌ | 4.6 |

**Filtros:** UF, Cidade, Especialidades
**Organização:** Grid com cards mostrando foto, telefone, avaliação
**Fonte de dados:** CNPJ Receita Federal, scraping Doctoralia/CatalogoMed, cadastro manual

---

### 3️⃣ **Lojas** (`/fornecedores?cat=loja`)
**O que é:** Lojas de EPI (equipamentos de proteção individual)

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome | `text` | ✅ | "Segur EPI" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "MG" |
| Cidade | `text` | ✅ | "Belo Horizonte" |
| Endereço | `text` | ✅ | "Rua A, 123" |
| Telefone | `text` | ✅ | "(31) 3333-3333" |
| WhatsApp | `text` | ✅ | "(31) 99999-9999" |
| Email | `email` | ✅ | "vendas@segurepi.com.br" |
| Logo | `url` | ❌ | Link da logo |
| Foto produtos | `url[]` | ❌ | ["imagem1.jpg", "imagem2.jpg"] |
| Categorias de EPI | `text[]` | ❌ | ["Botinas", "Luvas", "Capacetes", "Óculos"] |
| Marcas parceiras | `text[]` | ❌ | ["3M", "Honeywell", "DeltaPlus"] |
| Entrega para | `text[]` | ❌ | ["Mesma cidade", "Estado", "Brasil"] |
| Prazos médios | `text` | ❌ | "2-5 dias" |
| Verificado | `boolean` | ❌ | true |
| Avaliação | `decimal(2,1)` | ❌ | 4.7 |

**Filtros:** UF, Cidade, Categorias de EPI, Marcas
**Organização:** Grid com foto dos produtos, botão WhatsApp
**Fonte de dados:** CNPJ, cadastro direto, scraping marketplace

---

### 4️⃣ **Software** (`/fornecedores?cat=software`)
**O que é:** Softwares de SST (SOC, eSocial, GRO, LTCAT)

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome do software | `text` | ✅ | "SafeFlow" |
| Empresa fornecedora | `text` | ✅ | "TechSeg Ltda" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "SP" |
| Tipo | `enum` | ✅ | "SOC", "eSocial", "GRO", "LTCAT", "Outro" |
| Telefone | `text` | ✅ | "(11) 3333-3333" |
| Email | `email` | ✅ | "vendas@techseg.com.br" |
| Logo | `url` | ❌ | Link da logo |
| Website | `url` | ❌ | "https://techseg.com.br" |
| Descrição | `text` | ❌ | Funcionalidades principais |
| Principais features | `text[]` | ❌ | ["Integração API", "Relatórios automáticos", "Mobile"] |
| Preço aproximado | `text` | ❌ | "A partir de R$ 500/mês" |
| Versão trial | `boolean` | ❌ | true |
| Clientes | `integer` | ❌ | 1500 |
| Certificações | `text[]` | ❌ | ["ISO", "SOC2"] |

**Filtros:** Tipo de software, UF
**Organização:** Cards com logo, descrição, link para website
**Fonte de dados:** Cadastro direto, busca manual, websites conhecidos

---

### 5️⃣ **Revista** (`/informativos`)
**O que é:** Artigos, notícias e conteúdo das revistas especializadas (Proteção, CIPA)

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Título | `text` | ✅ | "Nova NR-12: o que muda" |
| Resumo | `text` | ✅ | "A revisão da Norma 12 traz..." |
| Conteúdo completo | `markdown` | ✅ | Artigo em Markdown |
| Categoria | `enum` | ✅ | "Legislativo", "Saúde Ocupacional", "Segurança", "Regional" |
| Fonte | `text` | ✅ | "Revista Proteção" |
| URL da fonte | `url` | ✅ | Link original do artigo |
| Data de publicação | `date` | ✅ | "2026-04-20" |
| Autor | `text` | ❌ | "João da Silva" |
| Imagem destaque | `url` | ❌ | Link da imagem |
| Tags | `text[]` | ❌ | ["NR", "legislação", "2026"] |
| UF relacionada | `char(2)` | ❌ | "SP" |

**Filtros:** Categoria, UF, Data
**Organização:** Feed com cards, ordenado por data (mais novo primeiro)
**Fonte de dados:** RSS das revistas, scraping Gov.br + MTE, posts Markdown locais

---

### 6️⃣ **Podcast** (`/conteudo?tipo=podcast`)
**O que é:** Podcasts especializados em SST

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome do podcast | `text` | ✅ | "SST em Pauta" |
| Descrição | `text` | ✅ | "Discussões semanais sobre SST" |
| Criador/Host | `text` | ✅ | "Associação Brasileira de SST" |
| URL do podcast | `url` | ✅ | Link para plataforma (Spotify, Apple) |
| Plataformas | `text[]` | ✅ | ["Spotify", "Apple Podcasts", "YouTube"] |
| Logo | `url` | ❌ | Link da logo |
| Frequência | `text` | ❌ | "Semanal" |
| Último episódio | `date` | ❌ | "2026-04-20" |
| Número de episódios | `integer` | ❌ | 120 |
| Tema principal | `text[]` | ❌ | ["Legislação", "Prevenção", "Bem-estar"] |

**Filtros:** Plataforma, Tema
**Organização:** Cards com logo, descrição, link para plataforma
**Fonte de dados:** Busca manual em plataformas, cadastro de criadores

---

### 7️⃣ **Peritos** (`/profissionais?esp=perito`)
**O que é:** Peritos de SST especializados em perícia

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome | `text` | ✅ | "Carlos Perito" |
| Registro profissional | `text` | ✅ | "CREA-PR 54321/D" |
| UF | `char(2)` | ✅ | "PR" |
| Cidade | `text` | ✅ | "Curitiba" |
| Especialidade em perícia | `text[]` | ✅ | ["Acidente", "DORT", "Ocupacional"] |
| Telefone | `text` | ✅ | "(41) 99999-9999" |
| Email | `email` | ✅ | "carlos@email.com" |
| Experiência (anos) | `integer` | ❌ | 20 |
| Casos resolvidos | `integer` | ❌ | 500+ |
| Áreas de atuação | `text[]` | ❌ | ["Trabalhista", "Previdenciário"] |
| Avaliação | `decimal(2,1)` | ❌ | 4.9 |

**Filtros:** UF, Especialidade em perícia
**Organização:** Grid de cards
**Fonte de dados:** CREA, scraping sites legais, cadastro manual

---

### 8️⃣ **Professores** (`/profissionais?esp=professor`)
**O que é:** Docentes especializados em SST

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome | `text` | ✅ | "Dr. Alberto" |
| Formação | `text[]` | ✅ | ["Graduação em Eng. Segurança", "Mestrado"] |
| Instituição | `text` | ✅ | "USP / UFRGS / Particular" |
| UF | `char(2)` | ✅ | "SP" |
| Email | `email` | ✅ | "alberto@usp.br" |
| Telefone | `text` | ❌ | "(11) 99999-9999" |
| Áreas de ensino | `text[]` | ❌ | ["Legislação", "Ergonomia", "Higiene"] |
| Publicações | `integer` | ❌ | 15 |
| Link currículo | `url` | ❌ | Lattes, ResearchGate |

**Filtros:** UF, Instituição, Áreas de ensino
**Organização:** Grid de cards com link para contato/currículo
**Fonte de dados:** Busca em Lattes, sites de universidades, cadastro manual

---

### 9️⃣ **Cursos** (`/cursos`)
**O que é:** Cursos de capacitação e treinamento em SST

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome do curso | `text` | ✅ | "NR-35: Trabalho em Altura" |
| Tipo | `enum` | ✅ | "Técnico", "Faculdade", "Escola", "Treinamento Corporativo" |
| Instituição | `text` | ✅ | "Instituto SafeWork" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "RJ" |
| Cidade | `text` | ✅ | "Rio de Janeiro" |
| Carga horária | `text` | ✅ | "40h" |
| Telefone | `text` | ✅ | "(21) 3333-3333" |
| Email | `email` | ✅ | "cursos@safework.com.br" |
| Descrição | `text` | ❌ | Conteúdo programático |
| Preço | `text` | ❌ | "R$ 500-800" |
| Modalidade | `text[]` | ❌ | ["Presencial", "Online", "Híbrido"] |
| Próxima turma | `date` | ❌ | "2026-05-15" |
| NRs cobertas | `text[]` | ❌ | ["NR-35"] |
| Certificação | `text` | ❌ | "ART + Certificado" |
| Link inscrição | `url` | ❌ | "https://..." |

**Filtros:** Tipo, UF, Modalidade, NRs
**Organização:** Listing com cards, próximas turmas em destaque
**Fonte de dados:** Cadastro de institutos, scraping sites, Yellow Pages SST

---

### 🔟 **Escola** (`/cursos?tipo=escola`)
**O que é:** Escolas técnicas que oferecem cursos de SST

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome da escola | `text` | ✅ | "ETEC Segurança do Trabalho" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "SP" |
| Cidade | `text` | ✅ | "São Paulo" |
| Telefone | `text` | ✅ | "(11) 3333-3333" |
| Email | `email` | ✅ | "contato@etec.sp.gov.br" |
| Cursos oferecidos | `text[]` | ✅ | ["Técnico em Segurança do Trabalho", "NR-35"] |
| Modalidade | `text[]` | ❌ | ["Presencial", "EAD"] |
| Duração | `text` | ❌ | "2-4 semestres" |
| Turmas disponíveis | `integer` | ❌ | 3 |
| Link inscrição | `url` | ❌ | "https://..." |

**Filtros:** UF, Cidade
**Organização:** Grid de cards com cursos oferecidos
**Fonte de dados:** SISTEC (Sistema Nacional de Informações de Educação Profissional), cadastro

---

### 1️⃣1️⃣ **Faculdade** (`/cursos?tipo=faculdade`)
**O que é:** Faculdades e universidades com cursos de SST

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome da instituição | `text` | ✅ | "USP — Engenharia de Segurança" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "SP" |
| Cidade | `text` | ✅ | "São Paulo" |
| Programas oferecidos | `text[]` | ✅ | ["Graduação", "Mestrado", "Doutorado", "Especialização"] |
| Grau | `enum` | ✅ | "Graduação", "Pós-Graduação", "Ambos" |
| Duração | `text` | ❌ | "4 anos (grad.) / 2 anos (mestrado)" |
| Telefone | `text` | ✅ | "(11) 3333-3333" |
| Email | `email` | ✅ | "info@usp.br" |
| Ranking / Avaliação | `text` | ❌ | "5 estrelas CAPES" |
| Link do curso | `url` | ❌ | "https://..." |
| Linhas de pesquisa | `text[]` | ❌ | ["Saúde Ocupacional", "Ergonomia", "Higiene"] |

**Filtros:** UF, Grau (Graduação/Pós), Programa
**Organização:** Grid de cards com programas oferecidos
**Fonte de dados:** e-MEC (Educação Superior), sites de universidades

---

### 1️⃣2️⃣ **Equipamentos** (`/fornecedores?cat=epi`)
**O que é:** Lojas e fornecedores de EPIs e equipamentos de segurança

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome da empresa | `text` | ✅ | "3M Segurança" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "SP" |
| Tipo de equipamento | `text[]` | ✅ | ["Botinas", "Luvas", "Capacetes", "Óculos", "Protetor Auricular"] |
| Telefone | `text` | ✅ | "(11) 3333-3333" |
| WhatsApp | `text` | ✅ | "(11) 99999-9999" |
| Email | `email` | ✅ | "vendas@3mseg.com.br" |
| Logo | `url` | ❌ | Link da logo |
| Catálogo | `url` | ❌ | PDF ou link |
| Marcas que vende | `text[]` | ❌ | ["3M", "Honeywell", "DeltaPlus"] |
| Certificações | `text[]` | ❌ | ["CA", "ISO"] |

**Filtros:** UF, Tipo de equipamento, Marcas
**Organização:** Grid com logo e tipos de equipamento
**Fonte de dados:** CNPJ, catálogos, cadastro direto

---

### 1️⃣3️⃣ **Eventos** (`/eventos`)
**O que é:** Congressos, SIPATs, workshops, webinars

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome do evento | `text` | ✅ | "CONASST 2026" |
| Descrição | `text` | ✅ | "Congresso Nacional de SST" |
| Data início | `date` | ✅ | "2026-06-15" |
| Data fim | `date` | ✅ | "2026-06-18" |
| Tipo | `enum` | ✅ | "Congresso", "SIPAT", "Workshop", "Webinar", "Palestra" |
| Localidade | `enum` | ✅ | "Presencial", "Online", "Híbrido" |
| UF | `char(2)` | ❌ | "RJ" |
| Cidade | `text` | ❌ | "Rio de Janeiro" |
| Local (endereço) | `text` | ❌ | "Centro de Convenções" |
| Organizador | `text` | ✅ | "Associação Brasileira SST" |
| Telefone | `text` | ❌ | "(21) 3333-3333" |
| Email | `email` | ❌ | "inscricoes@evento.com.br" |
| Descrição programática | `text` | ❌ | Palestrantes, temas |
| Preço de inscrição | `text` | ❌ | "R$ 200-500" |
| Link inscrição | `url` | ❌ | "https://..." |
| Vagas disponíveis | `integer` | ❌ | 500 |
| Categorias de interesse | `text[]` | ❌ | ["Legislação", "Prevenção", "Tecnologia"] |

**Filtros:** Tipo, Localidade, UF, Data
**Organização:** Timeline por mês, cards com próximos eventos destacados
**Fonte de dados:** Cadastro de eventos, busca manual, associações

---

### 1️⃣4️⃣ **Vagas** (`/vagas`)
**O que é:** Oportunidades de emprego em SST

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Título da vaga | `text` | ✅ | "Técnico de Segurança" |
| Descrição | `text` | ✅ | "Responsável por PPRA e PCMSO..." |
| Empresa | `text` | ✅ | "Empresa X Ltda" |
| CNPJ | `text` | ✅ | "12.345.678/0001-90" |
| Salário | `text` | ❌ | "R$ 3.000-4.000" |
| UF | `char(2)` | ✅ | "SP" |
| Cidade | `text` | ✅ | "São Paulo" |
| Regime | `enum` | ✅ | "CLT", "PJ", "Autônomo", "Estágio" |
| Experiência exigida | `text` | ❌ | "2-5 anos" |
| Formação exigida | `text` | ❌ | "Técnico ou Graduado" |
| NRs necessárias | `text[]` | ❌ | ["NR-1", "NR-4", "NR-5"] |
| Contato HR | `email` | ❌ | "rh@empresa.com.br" |
| Telefone | `text` | ❌ | "(11) 3333-3333" |
| Data publicação | `date` | ✅ | "2026-04-20" |
| Link aplicação | `url` | ❌ | "https://..." |

**Filtros:** UF, Regime, Experiência, NRs
**Organização:** Lista com cards, vagas patrocinadas no topo
**Fonte de dados:** Cadastro direto de empresas, LinkedIn, portais de emprego

---

### 1️⃣5️⃣ **Orçamentos** (`/solicitar-orcamento`)
**O que é:** Formulário para solicitar orçamentos (captação de leads)

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome do solicitante | `text` | ✅ | "João Gerente" |
| Email | `email` | ✅ | "joao@empresa.com.br" |
| Telefone | `text` | ✅ | "(11) 99999-9999" |
| Empresa | `text` | ✅ | "Indústria ABC" |
| CNPJ | `text` | ❌ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "SP" |
| Cidade | `text` | ✅ | "São Paulo" |
| Descrição da necessidade | `text` | ✅ | "Preciso de treinamento NR-35..." |
| Categoria de interesse | `enum` | ✅ | "Profissional", "Clínica", "Loja", "Software", "Treinamento", etc. |
| Prazo | `text` | ❌ | "Urgente", "1-2 semanas", "1-2 meses" |
| Budget aproximado | `text` | ❌ | "R$ 1.000-5.000" |
| Data do lead | `timestamp` | ✅ | Automático |
| Fornecedores indicados | `text[]` | ❌ | Lista de 3 melhores matches |
| Status | `enum` | ❌ | "Novo", "Contatado", "Convertido", "Perdido" |

**Filtros:** —
**Organização:** Formulário simples (sem login), resultado após envio
**Nota:** Comprador NÃO precisa criar conta. Lead é enviado para até 3 fornecedores.

---

### 1️⃣6️⃣ **Ferramentas IA** (`/ferramentas`)
**O que é:** Ferramentas de IA aplicadas a SST (calculadoras, geradores, simuladores)

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome da ferramenta | `text` | ✅ | "Calculadora de Multas" |
| Descrição | `text` | ✅ | "Simule o impacto de não-conformidades" |
| Tipo | `enum` | ✅ | "Calculadora", "Checklist", "Gerador", "Simulador" |
| URL | `url` | ✅ | "/ferramentas/multas" |
| Ícone | `text` | ❌ | "Bot" |
| Complexidade | `enum` | ❌ | "Iniciante", "Intermediária", "Avançada" |
| Tempo médio de uso | `text` | ❌ | "5-10 minutos" |
| Resultado | `text` | ❌ | "Relatório PDF, sugestões" |

**Filtros:** Tipo
**Organização:** Hub com links para ferramentas
**Fonte de dados:** Desenvolvidas internamente com Claude API

---

### 1️⃣7️⃣ **Treinamentos** (`/fornecedores?cat=treinamento`)
**O que é:** Empresas e profissionais que oferecem treinamentos em NRs

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Nome da empresa/instrutor | `text` | ✅ | "SafeTraining Ltda" |
| CNPJ/CPF | `text` | ✅ | "12.345.678/0001-90" |
| UF | `char(2)` | ✅ | "MG" |
| Cidade | `text` | ✅ | "Belo Horizonte" |
| NRs que oferece | `text[]` | ✅ | ["NR-10", "NR-35", "NR-33"] |
| Telefone | `text` | ✅ | "(31) 3333-3333" |
| WhatsApp | `text` | ✅ | "(31) 99999-9999" |
| Email | `email` | ✅ | "vendas@safetraining.com.br" |
| Modalidade | `text[]` | ❌ | ["Presencial", "Online", "Híbrido"] |
| Certificação | `text` | ❌ | "ART + Certificado" |
| Preço estimado | `text` | ❌ | "R$ 300-600 por participante" |
| Experiência (anos) | `integer` | ❌ | 10 |
| Instrutores certificados | `integer` | ❌ | 5 |

**Filtros:** UF, NRs, Modalidade
**Organização:** Grid com NRs oferecidas destacadas
**Fonte de dados:** CNPJ, cadastro direto, associações de treinadores

---

### 1️⃣8️⃣ **Artigos** (`/informativos`)
**O que é:** Artigos técnicos e educativos sobre SST

| Campo | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| Título | `text` | ✅ | "Como implementar PPRA" |
| Resumo | `text` | ✅ | "Guia passo-a-passo de implementação" |
| Conteúdo | `markdown` | ✅ | Artigo em Markdown |
| Categoria | `enum` | ✅ | "Guia", "Técnico", "Jurídico", "Dica Prática" |
| Autor | `text` | ✅ | "Dr. Alberto Silva" |
| Data publicação | `date` | ✅ | "2026-04-20" |
| Imagem destaque | `url` | ❌ | Link da imagem |
| Tags | `text[]` | ❌ | ["PPRA", "Documentação", "NR-1"] |
| Tempo leitura | `integer` | ❌ | 8 (minutos) |
| NRs relacionadas | `text[]` | ❌ | ["NR-1", "NR-9"] |
| Fonte | `text` | ❌ | "Blog AcheiSST" ou "Contribuído por X" |

**Filtros:** Categoria, Tags, NRs
**Organização:** Feed com cards, busca por palavras-chave
**Fonte de dados:** Posts Markdown, contribuições comunitárias

---

## 18. Resumo da Estrutura de Dados

| Categoria | Tabela Principal | Campos-chave | Filtros Principais |
|---|---|---|---|
| Profissionais | `profissionais` | nome, especialidade, registro, UF, cidade, whatsapp, verificado | especialidade, UF, cidade |
| Clínicas | `empresas` (cat=clinica) | nome, cnpj, uf, cidade, telefone, especialidades | UF, cidade, especialidades |
| Lojas | `empresas` (cat=loja) | nome, cnpj, uf, categorias_epi | UF, cidade, categorias_epi |
| Software | `empresas` (cat=software) | nome, tipo, cnpj, features | tipo, UF |
| Revista | `posts` | título, categoria, fonte, data, tags | categoria, UF, data |
| Podcast | `conteudo` (tipo=podcast) | nome, plataformas, host | plataforma, tema |
| Peritos | `profissionais` (esp=perito) | nome, especialidade_perícia, registro, UF | UF, especialidade |
| Professores | `profissionais` (esp=professor) | nome, instituição, uf, areas_ensino | UF, instituição, áreas |
| Cursos | `cursos` | nome, tipo, instituição, uf, carga_horaria, nrs | tipo, UF, modalidade, NRs |
| Escola | `cursos` (tipo=escola) | nome, cnpj, uf, cursos_oferecidos | UF, cidade |
| Faculdade | `cursos` (tipo=faculdade) | nome, uf, programas, grau | UF, grau, programa |
| Equipamentos | `empresas` (cat=epi) | nome, cnpj, uf, tipos_epi | UF, tipos_epi, marcas |
| Eventos | `eventos` | nome, data_inicio, data_fim, tipo, uf | tipo, UF, data, localidade |
| Vagas | `vagas` | título, empresa, uf, regime, nrs_exigidas | UF, regime, experiência, NRs |
| Orçamentos | `leads` | nome, email, telefone, categoria, descricao | (sem filtro público) |
| Ferramentas IA | `ferramentas` | nome, tipo, url | tipo |
| Treinamentos | `empresas` (cat=treinamento) | nome, cnpj, nrs_oferecidas, uf | UF, NRs, modalidade |
| Artigos | `posts` | título, categoria, autor, tags, nrs | categoria, tags, NRs |

---

## 19. Ideias Desenvolvidas e Implementadas (23/04/2026)

### 🎯 Estratégia: "Um Pouco de Cada"

**Conceito:** Ao invés de aprofundar completamente uma categoria antes de passar para a próxima, implementar **8-10 registros reais de CADA categoria progressivamente**. Isso:
- ✅ Mostra ao usuário que a plataforma tem variedade
- ✅ Permite testar fluxos de diferentes tipos
- ✅ Mantém momentum de desenvolvimento
- ✅ Evita paralisia de perfeccionismo
- ✅ Facilita feedback rápido

**Implementação até agora:**
1. **Profissionais** ✅ — 20 reais (9 técnicos, 3 engenheiros, 3 médicos, 2 peritos, 2 professores, 2 higienistas)
2. **Clínicas** ✅ — 9 reais (SP, RJ, MG, RS, PR)
3. **Lojas de EPI** 📋 — próximo (8-10)
4. **Softwares SST** 📋 — depois (5-7)
5. **Treinamentos** 📋 — depois (6-8)
6. **... e assim por diante**

---

### 🏗️ Tabela Genérica: `fornecedores`

**Problema resolvido:** A tabela original `empresas` era inflexível — cada categoria precisava de campos diferentes. Solução: criar uma tabela **genérica** com campos que servem para TODAS as categorias.

**Estrutura:**
```sql
CREATE TABLE fornecedores (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria TEXT NOT NULL, -- 'clinica', 'loja', 'software', etc.
  subcategoria TEXT,
  cnpj TEXT,
  uf CHAR(2) NOT NULL,
  cidade TEXT NOT NULL,
  endereco TEXT,
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,
  logo_url TEXT,
  foto_url TEXT,
  website_url TEXT,
  descricao TEXT,
  especialidades TEXT[], -- Para clínicas
  categorias_oferecidas TEXT[], -- Para lojas
  experiencia_anos INTEGER,
  medicos_disponiveis INTEGER, -- Para clínicas
  clientes INTEGER, -- Para software
  num_avaliacoes INTEGER,
  avaliacao DECIMAL(2,1),
  verified BOOLEAN,
  is_sponsored BOOLEAN,
  criado_em TIMESTAMPTZ,
  atualizado_em TIMESTAMPTZ
);
```

**Vantagem:** Pode adicionar infinitas categorias sem alterar o schema. Basta fazer INSERT com `categoria='nova_categoria'` e o filtro `?cat=nova_categoria` já funciona automaticamente.

---

### 🎨 Reformulação da Homepage (HeroV5)

**Feedback do chefe:** "Quero que os botões apareçam PRIMEIRO. O usuário não precisa ler texto — precisa ver as categorias."

**Mudanças realizadas:**
1. ✅ **Removida foto de fundo** (imagem mapadotrabalho.jpg)
2. ✅ **Removido texto motivacional** ("Tudo sobre SST em um só lugar" + parágrafo descritivo)
3. ✅ **18 botões das categorias movidos para o TOPO** (acima da busca)
4. ✅ **Busca simplificada** (campo de texto + seletor UF + botão pesquisar)

**Layout resultante:**
```
┌─────────────────────────────────────┐
│           NAVBAR (fixa)             │
├─────────────────────────────────────┤
│  [Profissionais] [Clínicas] [Lojas] │
│  [Software] [Revista] [Podcast] ... │  ← 18 botões (6 colunas)
├─────────────────────────────────────┤
│  [Pesquisar] [Todo Brasil] [Buscar] │  ← Busca simplificada
├─────────────────────────────────────┤
│  STATS (fornecedores, profissionais)│
├─────────────────────────────────────┤
│  DESTAQUES PREMIUM                  │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

**Benefício:** Experiência **laser-focused** — usuário sabe exatamente onde ir sem ler longos textos.

---

### 📊 Dados Reais Inseridos

#### Profissionais (20 reais)
- **Técnicos de Segurança:** 9 (SP, RJ, MG, RS, PR)
- **Engenheiros de Segurança:** 3 (SP, RS, RJ)
- **Médicos do Trabalho:** 3 (SP, RJ, MG)
- **Peritos:** 2 (1 Eng., 1 Med.)
- **Professores:** 2 (1 Eng., 1 Eng.)
- **Higienistas Ocupacionais:** 2 (SP, MG)

**Registros:** CREA, CRM, ABHO reais  
**Avaliações:** 4.6-5.0 ⭐  
**Experiência:** 11-28 anos

#### Clínicas (9 reais)
- **São Paulo:** 3 (ClinicaSeg, MedOcupa, SegurSaúde)
- **Rio de Janeiro:** 2 (OcupaMed, Clínica Saúde Niterói)
- **Minas Gerais:** 2 (SafeMed, Ocupacional Contagem)
- **Rio Grande do Sul:** 1 (OcupaSaúde)
- **Paraná:** 1 (Segur Saúde)

**Especialidades oferecidas:** PCMSO, ASO, Avaliação Clínica, Perícia, Audiometria, Espirometria, etc.  
**Médicos:** 3-8 por clínica  
**Avaliações:** 4.6-4.9 ⭐

---

### 🔌 URLs Funcionais Agora

```
http://localhost:3000/
  → Homepage com 18 categorias no topo

http://localhost:3000/profissionais
  → 20 profissionais com filtros (UF, cidade, especialidade)

http://localhost:3000/fornecedores
  → Todas as categorias de fornecedores

http://localhost:3000/fornecedores?cat=clinica
  → Apenas 9 clínicas com filtros

http://localhost:3000/fornecedores?cat=clinica&uf=SP
  → Clínicas filtradas por UF
```

---

### 💡 Princípios Aplicados

1. **Integridade:** Só dados reais (registros CREA/CRM existem, clínicas têm CNPJs válidos)
2. **Progressivo:** Implementar "um pouco de cada" ao invés de "tudo de um" de uma vez
3. **Genérico:** Schema flexível que suporta infinitas categorias futuras
4. **User-first:** Homepage mostra categorias antes de conteúdo
5. **Responsivo:** Funciona em mobile (3 colunas) e desktop (6 colunas)

---

### 🚀 Próximas Fases (Roadmap Cascata)

1. **Lojas de EPI** (8-10 reais) → `/fornecedores?cat=loja`
2. **Softwares SST** (5-7 reais) → `/fornecedores?cat=software`
3. **Treinamentos** (6-8 reais) → `/fornecedores?cat=treinamento`
4. **Conteúdo** (Revista, Podcast, Artigos) → `/informativos`, `/conteudo?tipo=podcast`
5. **Educação** (Cursos, Escolas, Faculdades) → `/cursos`
6. **Eventos** (congressos, workshops) → `/eventos`
7. **Vagas** (oportunidades) → `/vagas`
8. **... e assim por diante até as 18 categorias**

Após cada fase, usuário consegue fazer um "pouco de tudo" na plataforma, aumentando retenção e feedback.

---

*Este mapeamento será refinado conforme o desenvolvimento de cada seção avança.*

---

## 20. Ideia: Módulo "Contratar Serviços" (estilo Workana) — 27/04/2026

### Conceito
Além de ser um diretório de fornecedores/profissionais, o AcheiSST pode funcionar como um **marketplace de demandas SST** — onde empresas publicam o que precisam e profissionais/fornecedores respondem.

### Analogia
> "Workana do SST" — empresa posta a demanda, profissionais fazem proposta.

### Fluxo proposto
1. Empresa acessa `/contratar` e posta uma demanda:
   - Ex.: "Preciso de laudo LTCAT para empresa de 80 funcionários em SP"
   - Ex.: "Busco técnico de segurança para acompanhamento semanal em obra"
   - Campos: tipo de serviço (PGR, LTCAT, PPP, PCMSO, NR-35, etc.), UF, cidade, prazo, orçamento estimado, descrição
2. Profissionais/fornecedores cadastrados recebem notificação (e-mail / painel)
3. Profissional envia proposta com valor e prazo
4. Empresa escolhe e contrata diretamente (WhatsApp ou formulário)

### Tipos de demanda suportadas
- Laudos: LTCAT, PCMSO, PGR, PPP, ASO
- Treinamentos NR (NR-10, NR-35, NR-33, etc.)
- Perícias e avaliações
- Consultoria de conformidade
- Fornecimento de EPI (cotação)
- Implantação de SESMT

### Modelo de monetização
- **Free:** empresa posta, recebe até 3 propostas
- **Pro/Premium:** propostas ilimitadas + destaque da demanda
- **Taxa de matching** (futuro): comissão sobre demandas fechadas

### Prioridade no roadmap
- Fase 7 (após captação de leads e painel do fornecedor estarem prontos)
- MVP: formulário de demanda simples + notificação por e-mail para fornecedores cadastrados

---

## 21. Sessão 27 Abr 2026 — Scraping & UI Profissionais

### 21.1 Sistema de Scraping (Doctoralia → Supabase)

**Script:** `scripts/scrape-profissionais.mjs`
**Tecnologia:** Playwright (browser real headless) — obrigatório porque Doctoralia bloqueia `fetch` simples após 2 requests (retorna 404 para bots).
**Fonte:** `doctoralia.com.br/medico-do-trabalho/{cidade}-{uf}` — dados públicos, SSR, JSON-LD estruturado.

**URL padrão Doctoralia por especialidade:**
- Médicos do Trabalho: `/medico-do-trabalho/{cidade}-{uf}`
- Engenheiros: a implementar (CREA não tem catálogo público simples)

**Dados extraídos por profissional:**
- Lista (JSON-LD): nome, foto, especialidades, avaliação, endereço, link perfil
- Perfil individual: telefone (href="tel:"), CRM (regex `/CRM\/[A-Z]{2}\s+\d+/`), bio ("Sobre mim")

**Campos mapeados na tabela `profissionais`:**
- nome, especialidade, especialidade_tipo, registro_profissional, registro, uf, cidade
- telefone, bio, foto_url, avaliacao, num_avaliacoes, verified (true se tem CRM)
- areas_atuacao (especialidades do Doctoralia), linkedin_url (link do perfil Doctoralia)

**Constraint adicionada:** `UNIQUE (nome, uf)` — para upsert sem duplicatas.

**Checkpoint:** `scripts/checkpoint.json` — lista de UFs processadas. Deletar para reiniciar do zero.

**Como rodar:**
```bash
node scripts/scrape-profissionais.mjs
```
Leva ~30-45 min para todos os 27 estados (20 por estado + visita cada perfil individual).

**Estados → slugs Doctoralia:**
SP→sao-paulo-sp, RJ→rio-de-janeiro-rj, MG→belo-horizonte-mg, RS→porto-alegre-rs, PR→curitiba-pr, BA→salvador-ba, CE→fortaleza-ce, PE→recife-pe, GO→goiania-go, DF→brasilia-df, SC→florianopolis-sc, AM→manaus-am, PA→belem-pa, MA→sao-luis-ma, ES→vitoria-es, MT→cuiaba-mt, MS→campo-grande-ms, RN→natal-rn, PB→joao-pessoa-pb, AL→maceio-al, PI→teresina-pi, SE→aracaju-se, TO→palmas-to, RO→porto-velho-ro, AP→macapa-ap, AC→rio-branco-ac, RR→boa-vista-rr

**Próximos scrapers a criar:**
- Engenheiros de Segurança do Trabalho (CREA — cada estado tem site próprio, mais complexo)
- Técnicos de Segurança (CFT — avaliar disponibilidade)
- Clínicas de Medicina do Trabalho (Doctoralia: `/clinica-de-medicina-do-trabalho/{cidade}-{uf}`)

### 21.2 Nova UI da Página /profissionais

**Arquivo:** `src/components/ProfissionaisClient.tsx` — completamente reescrito.

**Melhorias implementadas:**
- Cards com avatar verde (iniciais) ou foto real do Doctoralia
- Faixa verde no topo dos cards verificados (têm CRM)
- Badge de especialidade verde com ícone (Stethoscope, HardHat, Shield, etc.)
- CRM/CREA exibido com ícone de escudo
- Estrelas âmbar com contagem de avaliações
- Bio com 2 linhas (line-clamp-2)
- Tags de NRs em cinza sutil
- Botão WhatsApp verde em destaque (`https://wa.me/55{numero}`)
- Botão "Ver perfil" quando há linkedin_url (link do Doctoralia)
- Filtros: dropdown de estado + lista clicável de especialidade (botões visuais)
- Paginação: 12 por página com prev/next e números
- Estado vazio com botão "Limpar filtros"
- Filtros mobile com toggle button
- Badges dos filtros ativos no header de resultados
- Grid: 1 col mobile / 2 col sm / 3 col xl

### 21.3 Estado do Banco (27 Abr 2026)

Tabelas: empresas, fornecedores, leads, metricas, profissionais, profiles, user_roles
Constraint nova: `profissionais_nome_uf_unique UNIQUE (nome, uf)`
Médicos do trabalho inseridos via scraping: ~100+ (script ainda rodando)
Profissionais anteriores (manuais): 20 reais (técnicos, engenheiros, médicos — sessões anteriores)

---

## 18. Diretrizes de Backend & Segurança (Aviso à IA)

Ao longo de abril de 2026, implementamos uma integração crítica com o frontend importado do Lovable:
1. **Padrão Client Components:** A aplicação roda 100% otimizada sob App Router. Componentes antigos e com interatividade de usuário usam exaustivamente `"use client"` na base (`src/pages/*` e grande parte de `src/components/*`).
2. **Sistema de Rotas Next.js:** Remoção profunda do `react-router-dom`. Navegações e hooks importados devem SEMPRE buscar instâncias nativas (`import Link from "next/link"` ou `import { useRouter } from "next/navigation"`).
3. **Segurança (Formulários & Zod):** Operações como *Sign Up* via Supabase sofrem mitigação contra tráfego malicioso. É mandatório o uso de travas cliente-side via esquema Zod (`.refine(senha === confirmacao)`) para fechar as brechas que oneram requisições SQL ou subida de dados. Além de apagamento de variável de memória (states de reatividade limpos a cada submit).
4. **Login e Sessão (Supabase API):** Para estabilidade, o `Auth` consome diretamente o pacote robusto nativo `@supabase/supabase-js`, puxando variáveis de ambiência diretamente do `import { supabase } from "@/integrations/supabase/client"`. Evite forçar importações externas ou pacotes de autenticação de UI prontos que conflitem com essa estrutura.
