# Contexto do Projeto: PlugaSST / AcheiSST
> Atualizado em: 23/04/2026 | Owner: Cleber Aimoni — Grupo SafeWork

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

---

*Este documento deve ser atualizado a cada nova decisão de produto.*
