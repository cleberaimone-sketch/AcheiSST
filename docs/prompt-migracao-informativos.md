# Prompt: Migração de Informativos — Arquivos .md → Supabase

> Entregar para o agente executor (Claude Code ou similar).
> Criado em: 22/04/2026

---

## Contexto do projeto

Estamos desenvolvendo o **PlugaSST**, um hub nacional de SST (Saúde e Segurança no Trabalho) com Next.js 16 (App Router) + Supabase + Tailwind CSS, deploy na Vercel.

**Problema atual:** os informativos (notícias SST) estão armazenados como arquivos `.md` em `/posts/*.md`. Isso não escala — não permite busca eficiente, filtros em tempo real, painel de publicação, nem volume alto de conteúdo.

**Meta desta tarefa:** migrar 100% dos informativos para o banco de dados Supabase, que já está na stack, sem quebrar nenhuma rota existente.

---

## Estado atual (leia antes de executar)

### Arquivos relevantes
- `/posts/*.md` — 13 arquivos Markdown com frontmatter (são os posts que serão migrados)
- `src/lib/posts.ts` — lê os arquivos `.md` do disco (precisa ser substituído)
- `src/app/informativos/page.tsx` — chama `getAllPosts()` de `posts.ts`
- `src/app/informativos/[slug]/page.tsx` — chama `getPostBySlug(slug)` e `generateStaticParams()`
- `database/schema.sql` — schema Supabase já definido, com tabela `informativos`
- `src/lib/supabase.ts` — cliente Supabase já configurado (`supabase`)
- `src/types/index.ts` — tipo `Informativo` já definido

### O que o schema já tem (tabela `informativos`)
```
id, title, summary, content, source_url, source_name, raw_content,
category (enum), uf, tags (text[]), status (enum: draft/published/archived),
ai_model, ai_prompt_version, published_at, created_at, updated_at
```

### O que está FALTANDO no schema (precisa de migration)
O tipo `Informativo` em `src/types/index.ts` e os arquivos `.md` usam dois campos que **não existem ainda** na tabela:
- `slug` — texto único, ex: `"nr01-pgr-gerenciamento-riscos"` (é o nome do arquivo sem `.md`)
- `image_url` — URL da imagem de capa do post

### Frontmatter dos arquivos .md (exemplo)
```yaml
---
title: "Atualização NR-35: O que muda em 2026"
summary: "Resumo do post..."
category: "Legislativo"       # Legislativo | Saúde Ocupacional | Segurança | Regional
uf: null                      # string de 2 chars ou null
source_name: "Gov.br"
source_url: "https://..."
tags: ["nr35", "trabalho em altura"]
published_at: "2026-04-10T10:00:00Z"
image_url: "https://..."      # pode ser null
---
Conteúdo em Markdown aqui...
```

---

## Tarefas a executar (em ordem)

### Tarefa 1 — Migration SQL: adicionar `slug` e `image_url`

Criar o arquivo `docs/migrations/add_slug_image_to_informativos.sql` com:

```sql
alter table informativos
  add column if not exists slug text unique,
  add column if not exists image_url text;

create index if not exists informativos_slug_idx on informativos (slug);
```

**Aplicar no Supabase** via MCP (ferramenta `mcp__claude_ai_Supabase__apply_migration`) ou manualmente pelo painel do Supabase. Confirme com o usuário qual método usar se não tiver certeza.

---

### Tarefa 2 — Script de seed: importar os 13 posts para o Supabase

Criar `scripts/seed_informativos.ts` (TypeScript, executável com `npx tsx`).

O script deve:
1. Ler todos os arquivos de `/posts/*.md`
2. Parsear o frontmatter com `gray-matter`
3. Usar o nome do arquivo (sem `.md`) como `slug`
4. Inserir cada post na tabela `informativos` com `status = 'published'`
5. Usar `upsert` (conflict em `slug`) para ser idempotente — pode rodar mais de uma vez sem duplicar
6. Usar a variável de ambiente `SUPABASE_SERVICE_ROLE_KEY` (não a anon key) para bypass do RLS

**Dependências necessárias no script:**
- `@supabase/supabase-js` (já instalado)
- `gray-matter` (já instalado)
- `dotenv` (verificar se está instalado)

**Fallback de `image_url`** — se o frontmatter não tiver `image_url`, usar a mesma lógica já existente em `src/lib/posts.ts` (imagem por categoria do Unsplash).

O script deve logar: `✓ Inserido: [slug]` ou `⚠ Já existe: [slug]` para cada post.

---

### Tarefa 3 — Substituir `src/lib/posts.ts` por `src/lib/informativos.ts`

Criar `src/lib/informativos.ts` com as mesmas funções de interface (para não quebrar os imports), mas buscando do Supabase:

```typescript
// Buscar todos os posts publicados (para listagem)
export async function getAllInformativos(): Promise<InformativoCard[]>

// Buscar um post pelo slug (para página individual)
export async function getInformativoBySlug(slug: string): Promise<InformativoFull | null>

// Buscar slugs para generateStaticParams
export async function getAllSlugs(): Promise<string[]>
```

Tipos a definir no mesmo arquivo ou em `src/types/index.ts`:
- `InformativoCard` — campos para o card na listagem: `id, slug, title, summary, category, uf, tags, source_name, image_url, published_at`
- `InformativoFull` — todos os campos incluindo `content` (Markdown), para a página individual

**A query de `getAllInformativos` deve:**
- Filtrar `status = 'published'`
- Ordenar por `published_at desc`
- Selecionar apenas os campos do card (não buscar `content` na listagem — performance)

**A query de `getInformativoBySlug` deve:**
- Filtrar `slug = [valor]` e `status = 'published'`
- Retornar todos os campos incluindo `content`
- Converter o `content` (Markdown) para HTML usando `remark` + `remark-html` (mesma lógica atual de `posts.ts`)

---

### Tarefa 4 — Atualizar as páginas de informativos

#### `src/app/informativos/page.tsx`
- Trocar `getAllPosts()` por `await getAllInformativos()`
- Tornar o componente `async` se necessário

#### `src/app/informativos/[slug]/page.tsx`
- Trocar `getAllPosts()` em `generateStaticParams` por `await getAllSlugs()`
- Trocar `getPostBySlug(slug)` por `await getInformativoBySlug(slug)`
- Ajustar os tipos se necessário (o campo `contentHtml` continua existindo)

---

### Tarefa 5 — Atualizar `src/components/InformativosClient.tsx`

Verificar se o componente usa campos que mudaram de nome ou tipo. Ajustar as props para receber `InformativoCard[]` ao invés do tipo antigo `PostMeta[]`. Não mudar visual, só os tipos.

---

### Tarefa 6 — Manter `/posts/*.md` mas marcar como legado

**Não deletar** os arquivos `.md` agora — eles são o backup e fonte do seed. Adicionar um comentário `# LEGADO — dados migrados para Supabase` no início de um arquivo `posts/README.md` para documentar.

---

### Tarefa 7 — Verificação final

Após todas as mudanças:
1. Rodar `npm run type-check` — deve passar sem erros
2. Rodar `npm run dev` e acessar `/informativos` — deve listar os posts vindos do Supabase
3. Acessar `/informativos/nr01-pgr-gerenciamento-riscos` — deve abrir o post corretamente
4. Confirmar que os filtros de categoria e UF ainda funcionam

---

## Restrições importantes

- **Não quebrar** nenhuma rota existente (`/informativos`, `/informativos/[slug]`)
- **Não mudar** o visual de nenhuma página — apenas a fonte dos dados
- **Não deletar** os arquivos `.md` — apenas deixar de usá-los como fonte primária
- A chave `SUPABASE_SERVICE_ROLE_KEY` deve existir no `.env.local` — se não existir, avisar o usuário antes de rodar o seed
- Usar `upsert` no seed para ser seguro de rodar múltiplas vezes

---

## Critério de sucesso

- `npm run type-check` passa sem erros
- `/informativos` carrega com os posts vindos do banco (não dos arquivos)
- `/informativos/[slug]` abre cada post corretamente
- O script de seed pode ser rodado novamente sem duplicar dados
- O código não faz mais leitura de arquivos `.md` nas rotas de produção
