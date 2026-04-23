# Ecossistema SST Brasil — CLAUDE.md

## Projeto
Plataforma web da **Safework** para centralizar notícias e conexões do setor SST (Saúde e Segurança no Trabalho) no Brasil. Hub de informações + marketplace B2B ("Tinder Corporativo SST").

## Stack
- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 3**
- **Supabase** (PostgreSQL) — cliente via `@supabase/supabase-js`
- **Conteúdo estático:** posts em Markdown em `/posts/*.md` processados com `gray-matter` + `remark`
- **Fontes:** Inter (`--font-inter`), Playfair Display (`--font-playfair`), Lora (`--font-lora`)

## Comandos
- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run type-check` — `tsc --noEmit` sem buildar
- `npm run lint` — ESLint via Next.js

## Rotas principais
- `/` — página inicial com feed de notícias
- `/informativos` — listagem de informativos
- `/informativos/[slug]` — post individual (gerado de `/posts/*.md`)
- `/empresas` — grid de empresas parceiras
- `/profissionais` — listagem de profissionais

## Tipos centrais (`src/types/index.ts`)
- `Informativo` — notícia/artigo SST
- `EmpresaParceira` — empresa do hub B2B
- `NewsFilter` — filtros de categoria e UF
- `NewsCategory`: `'Legislativo' | 'Saúde Ocupacional' | 'Segurança' | 'Regional'`

## Sistema de temas (ThemeProvider)
Dois temas alternáveis via botão fixo (A/B testing):
- `brazil_min` — layout padrão (verde)
- `blue_hub` — layout hub (azul/índigo)
Use `useTheme()` para ler o tema atual em Client Components.

## Posts (Markdown)
- Ficam em `/posts/*.md` com frontmatter: `title`, `summary`, `category`, `uf`, `source_name`, `source_url`, `tags`, `published_at`, `image_url`
- `image_url` tem fallback automático por categoria em `src/lib/posts.ts`
- Imagens remotas: apenas `*.supabase.co` está liberado em `next.config.ts`

## Convenções
- Idioma UI e docs: **pt-BR**
- Tom: profissional, técnico, acessível — sem sensacionalismo
- Fontes de dados confiáveis: Gov.br, Ministério do Trabalho, portais SST reconhecidos
- Plataforma **neutra** — não vinculada a nenhuma empresa privada

## Contexto de produto
Ver `docs/context.md` para visão completa, objetivos, brainstorm de funcionalidades e roadmap.
Ver `docs/plan.md` para o plano de implementação em fases.

## Roadmap resumido
- **Fase 1** — Base sólida: diretórios, radar legislativo, calendário de obrigações, glossário
- **Fase 2** — Conexões: match B2B, quadro de vagas, eventos, fóruns/Q&A
- **Fase 3** — Ferramentas: calculadoras NR, checklist conformidade, gerador PGR, simulador multas
- **Fase 4** — Dados & IA: dashboard nacional, relatórios de tendência, newsletter IA
- **Fase 5** — Monetização: freemium, anúncios segmentados, cursos/certificações, relatórios premium
