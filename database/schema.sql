-- ============================================================
-- Ecossistema SST Brasil — Schema Supabase (PostgreSQL)
-- ============================================================

-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- busca full-text trigram

-- ============================================================
-- ENUM: categoria de notícias
-- ============================================================
create type news_category as enum (
  'Legislativo',
  'Saúde Ocupacional',
  'Segurança',
  'Regional'
);

create type news_status as enum (
  'draft',       -- gerado pela IA, aguardando revisão
  'published',   -- publicado na plataforma
  'archived'     -- removido do feed mas preservado
);

-- ============================================================
-- TABELA: informativos
-- ============================================================
create table informativos (
  id            uuid primary key default uuid_generate_v4(),

  -- Conteúdo gerado/revisado
  title         text not null,
  summary       text not null,                -- versão curta para cards (máx 300 chars)
  content       text not null,                -- artigo completo em Markdown

  -- Origem
  source_url    text not null,
  source_name   text not null,
  raw_content   text,                         -- HTML/texto bruto capturado antes do processamento IA

  -- Classificação
  category      news_category not null,
  uf            char(2),                      -- UF quando regional; null = nacional
  tags          text[] default '{}',

  -- Controle
  status        news_status not null default 'draft',
  ai_model      text,                         -- ex: 'claude-sonnet-4-6'
  ai_prompt_version smallint default 1,

  -- Timestamps
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Índices de consulta
create index informativos_category_idx on informativos (category);
create index informativos_uf_idx on informativos (uf);
create index informativos_status_idx on informativos (status);
create index informativos_published_at_idx on informativos (published_at desc);
create index informativos_tags_idx on informativos using gin (tags);

-- Busca full-text em português
create index informativos_fts_idx on informativos
  using gin (to_tsvector('portuguese', title || ' ' || summary || ' ' || content));

-- Trigger: atualizar updated_at automaticamente
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger informativos_updated_at
  before update on informativos
  for each row execute function set_updated_at();

-- ============================================================
-- TABELA: empresas_parceiras
-- ============================================================
create table empresas_parceiras (
  id            uuid primary key default uuid_generate_v4(),

  name          text not null,
  segment       text not null,               -- ex: 'Consultoria SST', 'EPI & EPC'
  description   text,
  city          text not null,
  uf            char(2) not null,
  logo_url      text,
  website_url   text,
  email         text,
  phone         text,

  is_featured   boolean not null default false,
  is_verified   boolean not null default false,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index empresas_uf_idx on empresas_parceiras (uf);
create index empresas_segment_idx on empresas_parceiras (segment);
create index empresas_featured_idx on empresas_parceiras (is_featured) where is_featured = true;

create trigger empresas_updated_at
  before update on empresas_parceiras
  for each row execute function set_updated_at();

-- ============================================================
-- TABELA: fontes_rss
-- Registra os feeds RSS/sites monitorados pelo scraper
-- ============================================================
create table fontes_rss (
  id            uuid primary key default uuid_generate_v4(),

  name          text not null,
  url           text not null unique,
  category      news_category not null,
  uf            char(2),                     -- null = fonte nacional
  is_active     boolean not null default true,
  check_interval_minutes int not null default 60,
  last_checked_at timestamptz,

  created_at    timestamptz not null default now()
);

-- Dados iniciais de fontes confiáveis
insert into fontes_rss (name, url, category, uf) values
  ('Gov.br — Ministério do Trabalho', 'https://www.gov.br/trabalho/pt-br/assuntos/noticias/RSS', 'Legislativo', null),
  ('Fundacentro', 'https://www.fundacentro.gov.br/rss/noticias', 'Saúde Ocupacional', null),
  ('ANAMT', 'https://www.anamt.org.br/portal/feed/', 'Saúde Ocupacional', null),
  ('ABHO', 'https://abho.org.br/feed/', 'Segurança', null);

-- ============================================================
-- TABELA: automacao_log
-- Rastreabilidade do pipeline IA (scraping → processamento → publicação)
-- ============================================================
create table automacao_log (
  id            uuid primary key default uuid_generate_v4(),

  fonte_id      uuid references fontes_rss(id) on delete set null,
  informativo_id uuid references informativos(id) on delete set null,

  stage         text not null,               -- 'scrape' | 'ai_process' | 'publish'
  status        text not null,               -- 'success' | 'error' | 'skipped'
  message       text,
  tokens_used   int,

  created_at    timestamptz not null default now()
);

create index automacao_log_stage_idx on automacao_log (stage, status);
create index automacao_log_created_at_idx on automacao_log (created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Informativos: leitura pública de publicados; escrita apenas autenticados
alter table informativos enable row level security;

create policy "Leitura pública de informativos publicados"
  on informativos for select
  using (status = 'published');

create policy "Escrita restrita a authenticated"
  on informativos for all
  using (auth.role() = 'authenticated');

-- Empresas: leitura pública; escrita autenticada
alter table empresas_parceiras enable row level security;

create policy "Leitura pública de empresas"
  on empresas_parceiras for select using (true);

create policy "Escrita restrita a authenticated"
  on empresas_parceiras for all
  using (auth.role() = 'authenticated');

-- ============================================================
-- VIEW: feed_publico
-- Consulta otimizada para o feed da landing page
-- ============================================================
create view feed_publico as
select
  id,
  title,
  summary,
  category,
  uf,
  tags,
  source_name,
  source_url,
  published_at
from informativos
where status = 'published'
order by published_at desc;
