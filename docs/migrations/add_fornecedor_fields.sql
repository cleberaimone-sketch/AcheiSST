-- Migration: adiciona campos de fornecedor à tabela empresas
-- Execute no Supabase: Dashboard → SQL Editor

ALTER TABLE empresas
  ADD COLUMN IF NOT EXISTS categoria       TEXT,
  ADD COLUMN IF NOT EXISTS subcategoria    TEXT,
  ADD COLUMN IF NOT EXISTS descricao       TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp        TEXT,
  ADD COLUMN IF NOT EXISTS plano           TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS is_sponsored    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sponsored_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rank_score      INTEGER NOT NULL DEFAULT 0;

-- Constraint de plano
ALTER TABLE empresas
  ADD CONSTRAINT empresas_plano_check
  CHECK (plano IN ('free', 'pro', 'premium'));

-- Índices para ordenação rápida
CREATE INDEX IF NOT EXISTS empresas_rank_score_idx  ON empresas (rank_score DESC);
CREATE INDEX IF NOT EXISTS empresas_uf_idx          ON empresas (uf);
CREATE INDEX IF NOT EXISTS empresas_categoria_idx   ON empresas (categoria);

-- Atualiza rank_score existente baseado em plano + verified
UPDATE empresas SET rank_score =
  CASE
    WHEN is_sponsored THEN 100
    WHEN verified     THEN 50
    ELSE 0
  END;

-- Full-text search em português (busca unificada fase 1.4)
ALTER TABLE empresas
  ADD COLUMN IF NOT EXISTS fts TSVECTOR
    GENERATED ALWAYS AS (
      to_tsvector('portuguese',
        coalesce(nome, '') || ' ' ||
        coalesce(categoria, '') || ' ' ||
        coalesce(subcategoria, '') || ' ' ||
        coalesce(descricao, '') || ' ' ||
        coalesce(cidade, '') || ' ' ||
        coalesce(uf, '')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS empresas_fts_idx ON empresas USING GIN (fts);
