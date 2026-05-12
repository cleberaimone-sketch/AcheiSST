# AcheiSST — CLAUDE.md

## Projeto
**AcheiSST** (acheisst.com.br) — marketplace B2B/B2C de SST (Saúde e Segurança do Trabalho) do Brasil.
Posicionamento: "Google do SST + diretório de fornecedores + perfil profissional".
Empresa: **Safework** / dono do produto: Cleber Aimoni.

## Stack
- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 3**
- **Supabase** (PostgreSQL + Auth + RLS) — projeto ID: `ufuxerlqhsskynhnwjeb` (sa-east-1)
- **Vercel** — deploy automático via GitHub push (projeto: `ecosystem-sst-brasil`)
- **Resend** — email transacional (noreply@acheisst.com.br)
- Fontes: Inter (`--font-inter`), Playfair Display (`--font-playfair`), Lora (`--font-lora`)

## Comandos
- `npm run dev` — dev server (porta 3001 se 3000 estiver ocupada pelo LM Studio)
- `npm run build` — build de produção (SEMPRE rodar antes de fazer push)
- `npm run type-check` — `tsc --noEmit`
- `npm run lint` — ESLint

## Deploy
```bash
# 1. Verificar build local antes de subir
npm run build

# 2. Commit e push (usa token do GitHub)
git add <arquivos>
git commit -m "mensagem"
git remote set-url origin https://cleberaimone-sketch:<TOKEN>@github.com/cleberaimone-sketch/AcheiSST.git
git push origin main
git remote set-url origin https://github.com/cleberaimone-sketch/AcheiSST.git
```
Token GitHub: gerado em github.com → Settings → Developer settings → Personal access tokens.
Após push, Vercel deploya automaticamente em ~2 min.

---

## Mapa do Repositório

```
src/
├── app/                        # Next.js App Router — todas as rotas
│   ├── page.tsx                # Homepage (usa HeroSection.tsx)
│   ├── layout.tsx              # Layout global (fontes, analytics GA4+Clarity)
│   ├── auth/
│   │   ├── page.tsx            # Página de login/signup (importa src/pages/Auth.tsx)
│   │   └── callback/route.ts   # Handler OAuth Google + magic link
│   ├── painel/
│   │   ├── page.tsx            # Painel do profissional (edição de perfil)
│   │   ├── layout.tsx          # Layout com proteção de rota via middleware
│   │   ├── login/page.tsx      # Login específico do painel
│   │   ├── fornecedor/         # Dashboard do fornecedor (leads, métricas)
│   │   ├── cadastrar/page.tsx  # Autocadastro de empresa/fornecedor
│   │   ├── resetar-senha/      # Solicitar reset de senha
│   │   └── redefinir-senha/    # Formulário nova senha (com Suspense)
│   ├── api/
│   │   └── notify-lead/route.ts  # POST /api/notify-lead — envia email via Resend ao profissional/fornecedor
│   ├── profissionais/
│   │   ├── page.tsx            # Listagem (lê tabela `profissionais`)
│   │   ├── [id]/page.tsx       # Perfil individual (lê tabela `profissionais`)
│   │   └── p/[id]/page.tsx     # Perfil público de usuários cadastrados (lê tabela `profiles`)
│   ├── fornecedores/
│   │   ├── page.tsx            # Listagem com filtros
│   │   └── [slug]/page.tsx     # Perfil individual
│   ├── informativos/           # Posts Markdown (/posts/*.md)
│   ├── eventos/page.tsx        # Eventos SST
│   ├── planos/page.tsx         # Planos de assinatura
│   ├── busca/page.tsx          # Busca unificada (FTS português)
│   └── cadastrar/page.tsx      # Cadastro de empresa (formulário público)
│
├── components/                 # Componentes reutilizáveis
│   ├── HeroSection.tsx         # Hero da homepage (GetNinjas-style, split layout)
│   ├── Navbar.tsx              # Navbar com auth state
│   ├── Logo.tsx                # Componente Logo (JSX puro, sem PNG)
│   ├── EventsSection.tsx       # Seção de eventos na homepage
│   ├── NewsSection.tsx         # Feed de notícias
│   ├── FeaturedSection.tsx     # Destaques
│   ├── EPICalloutSection.tsx   # Seção EPI
│   ├── CadastrarForm.tsx       # Formulário multi-step de cadastro
│   ├── OrcamentoForm.tsx       # Formulário de lead (fornecedor ou profissional)
│   └── ThemeProvider.tsx       # A/B testing de temas
│
├── pages/                      # Páginas legadas (Pages Router — NÃO adicionar aqui)
│   └── Auth.tsx                # Componente de auth (importado pelo app/auth/page.tsx)
│
├── lib/
│   ├── supabase-browser.ts     # Cliente Supabase para Client Components
│   ├── supabase-server.ts      # Cliente Supabase para Server Components
│   └── posts.ts                # Leitura de posts Markdown
│
├── hooks/
│   └── useAuth.ts              # Hook de autenticação (wraps Supabase auth state)
│
├── integrations/supabase/
│   └── client.ts               # Cliente Supabase legado (usar supabase-browser.ts)
│
├── middleware.ts               # Proteção de rotas /painel/* (redirect para /painel/login)
└── types/index.ts              # Tipos centrais TypeScript

posts/                          # Conteúdo estático (Markdown)
public/                         # Assets estáticos (boneco_acheisst.png, favicon.ico)
```

---

## Banco de Dados Supabase

### Tabelas principais
| Tabela | Registros | Descrição |
|---|---|---|
| `profissionais` | ~119 | Profissionais scraped (Doctoralia etc.) |
| `profiles` | ~2 | Perfis de usuários cadastrados no site |
| `fornecedores` | ~2341 | Fornecedores scraped (EPI, SST, etc.) |
| `empresas` | ~26 | Empresas com auth_user_id (cadastro manual) |
| `leads` | — | Leads de contato — campos: id, profissional_id, fornecedor_id, nome, email, telefone, cidade, uf, prazo, descricao, status (novo\|visualizado\|respondido), created_at |
| `metricas` | — | Métricas de visualização (RLS ativo) |
| `videos` | ~31 | Vídeos SST do YouTube |

### Storage Supabase
- Bucket `avatars` — público, 2 MB max, JPG/PNG/WebP
- Path: `{user_id}/avatar.{ext}` — cada usuário sobrescreve com `upsert: true`

### Clientes Supabase — qual usar quando
- **Client Components** (`'use client'`): `import { createSupabaseBrowser } from '@/lib/supabase-browser'`
- **Server Components / Route Handlers**: `import { createSupabaseServer } from '@/lib/supabase-server'`
- **Legado (não usar em código novo)**: `import { supabase } from '@/integrations/supabase/client'`

### Campos importantes de `profiles`
`id, user_id, display_name, account_type (profissional|clinica|empresa_sst|empresa_epi), plan (free|pro|premium), avatar_url, public_email, phone, whatsapp, website, city, state, about, is_verified, ocupacao, registro_prof, anos_experiencia, linkedin_url, atende_remoto, especialidades[], nrs_atendidas[]`

---

## Convenções de Código

### Arquivos e pastas
- Componentes React: `PascalCase.tsx` (ex: `HeroSection.tsx`)
- Rotas App Router: `kebab-case/page.tsx` (ex: `painel/login/page.tsx`)
- Utilitários/libs: `kebab-case.ts` (ex: `supabase-browser.ts`)
- Hooks: `camelCase.ts` com prefixo `use` (ex: `useAuth.ts`)

### Client Components
- `'use client'` SEMPRE na **primeira linha** do arquivo, antes de qualquer import
- Usar `createSupabaseBrowser()` para queries dentro de Client Components
- Usar `useSearchParams()` sempre dentro de `<Suspense>` (obrigatório no Next.js 16)

### Estética
- Cores: **verde** como primária (`green-600`, `green-700`) — NUNCA usar `navy-*` (não existe no Tailwind padrão)
- Background padrão: `bg-slate-50` ou `bg-white`
- Textos: `text-slate-900` (títulos), `text-slate-500` (subtextos)
- Bordas: `border-slate-200`
- Botões primários: `bg-green-600 hover:bg-green-700 text-white rounded-xl`
- Inputs: `border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500`

### Conteúdo
- Idioma UI: **pt-BR**
- Tom: profissional, técnico, acessível — sem sensacionalismo
- **NUNCA inventar dados** (empresas, profissionais, métricas) — regra absoluta
- Fontes confiáveis: Gov.br, Ministério do Trabalho, portais SST reconhecidos

---

## Estado Atual do Produto

### Implementado ✅
- Homepage com HeroSection (GetNinjas-style), categorias com mega menu, busca
- `/profissionais` — listagem com 119 registros scraped
- `/profissionais/p/[id]` — perfil público de usuários cadastrados (lê `profiles`)
- `/fornecedores` — listagem com 2341 registros + filtros + perfil individual
- `/auth` — login/signup com email+senha e Google OAuth (AuthProvider em layout.tsx)
- `/painel` — edição completa do perfil (6 seções: Perfil, Contato, Localização, Serviços, NRs, Leads)
  - Upload de foto via Supabase Storage (bucket `avatars`)
  - Leads recebidos com status (novo/visualizado/respondido)
  - Salvar redireciona para perfil público
- `/solicitar-orcamento` — aceita `?fornecedor=slug` e `?profissional=UUID`
- `POST /api/notify-lead` — notificação por email via Resend ao receber lead
- `/painel/fornecedor` — dashboard do fornecedor
- `/eventos`, `/planos`, `/videos`, `/informativos`
- Google Analytics 4 (G-4CD7SWYTZY) + Microsoft Clarity (wo136wf3be)
- Deploy automático Vercel + domínio acheisst.com.br

### Pendente ⏳
- Listagem unificada profissionais (scraped + cadastrados)
- Checkout Stripe para planos
- Painel admin para aprovar cadastros
- Scraping clínicas (Doctoralia) e empresas SST (oHub)
- Avaliações / reviews

---

## Erros Conhecidos e Soluções

| Erro | Causa | Solução |
|---|---|---|
| `'use client' not at top` | Import antes da diretiva | Mover `'use client'` para linha 1 |
| `useSearchParams() needs Suspense` | Next.js 16 obriga Suspense | Envolver page com `<Suspense>` |
| `navy-600 not found` | Cor inválida Tailwind | Trocar por `green-600` |
| Build ERROR na Vercel | Ver logs em vercel.com/deployments | Rodar `npm run build` local primeiro |
| Google OAuth cai em `/?code=...` | redirectTo não está na allowlist Supabase | Adicionar URL em Supabase → Auth → URL Configuration |
| Painel trava em loading infinito | `AuthProvider` não estava no layout | `useAuth()` precisa de `<AuthProvider>` em `layout.tsx` — já corrigido |
| Build error `Missing API key` (Resend) | `new Resend()` no módulo level sem env var | Instanciar dentro do handler, não fora |
| Foto não abre picker ao clicar | `button.onClick → ref.click()` não dispara | Usar `<label htmlFor>` + `<input className="sr-only">` |
| TypeScript: `catch` não existe em PromiseLike | `.then().catch()` não funciona em PromiseLike do Supabase | Usar `.then(success, error)` two-argument form |
