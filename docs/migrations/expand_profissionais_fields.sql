-- Migration: Expansão da tabela profissionais com campos completos
-- Executa no Supabase: Dashboard → SQL Editor

-- Criar tabela profissionais se não existir
CREATE TABLE IF NOT EXISTS profissionais (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Dados pessoais
  nome                  TEXT NOT NULL,
  especialidade         TEXT NOT NULL,                -- 'Técnico de Segurança', 'Engenheiro', 'Médico', etc.
  especialidade_tipo    TEXT,                         -- 'Perito', 'Professor' (para filtros específicos)
  registro_profissional TEXT,                         -- CREA, CRM, CFT, etc.

  -- Localização
  uf                    CHAR(2) NOT NULL,
  cidade                TEXT,

  -- Contato
  telefone              TEXT,
  whatsapp              TEXT,
  email                 EMAIL,

  -- Profil & Redes
  bio                   TEXT,                         -- Descrição profissional
  foto_url              TEXT,                         -- URL da foto/avatar
  linkedin_url          TEXT,

  -- Expertise & Experiência
  nrs_expertise         TEXT[],                       -- Array: ['NR-4', 'NR-5', 'NR-35']
  experiencia_anos      INTEGER,
  areas_atuacao         TEXT[],                       -- Áreas de expertise

  -- Reputação & Verificação
  avaliacao             DECIMAL(2,1),                 -- 4.8 stars
  num_avaliacoes        INTEGER DEFAULT 0,
  verified              BOOLEAN NOT NULL DEFAULT FALSE,

  -- Controle
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de busca rápida
CREATE INDEX IF NOT EXISTS profissionais_especialidade_idx ON profissionais (especialidade);
CREATE INDEX IF NOT EXISTS profissionais_especialidade_tipo_idx ON profissionais (especialidade_tipo);
CREATE INDEX IF NOT EXISTS profissionais_uf_idx ON profissionais (uf);
CREATE INDEX IF NOT EXISTS profissionais_cidade_idx ON profissionais (cidade);
CREATE INDEX IF NOT EXISTS profissionais_verified_idx ON profissionais (verified);
CREATE INDEX IF NOT EXISTS profissionais_avaliacao_idx ON profissionais (avaliacao DESC);
CREATE INDEX IF NOT EXISTS profissionais_nrs_idx ON profissionais USING GIN (nrs_expertise);
CREATE INDEX IF NOT EXISTS profissionais_areas_idx ON profissionais USING GIN (areas_atuacao);

-- Full-text search em português
ALTER TABLE profissionais
  ADD COLUMN IF NOT EXISTS fts TSVECTOR
    GENERATED ALWAYS AS (
      to_tsvector('portuguese',
        coalesce(nome, '') || ' ' ||
        coalesce(especialidade, '') || ' ' ||
        coalesce(especialidade_tipo, '') || ' ' ||
        coalesce(registro_profissional, '') || ' ' ||
        coalesce(bio, '') || ' ' ||
        coalesce(cidade, '') || ' ' ||
        coalesce(uf, '')
      )
    ) STORED;

CREATE INDEX IF NOT EXISTS profissionais_fts_idx ON profissionais USING GIN (fts);

-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION set_profissionais_updated_at()
RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN
  new.atualizado_em = now();
  RETURN new;
END;
$$;

CREATE TRIGGER profissionais_updated_at
  BEFORE UPDATE ON profissionais
  FOR EACH ROW EXECUTE FUNCTION set_profissionais_updated_at();

-- Row Level Security
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de profissionais verificados"
  ON profissionais FOR SELECT
  USING (verified = true);

CREATE POLICY "Leitura pública de perfil completo"
  ON profissionais FOR SELECT
  USING (true);

CREATE POLICY "Escrita restrita a authenticated"
  ON profissionais FOR ALL
  USING (auth.role() = 'authenticated');

-- Dados iniciais de exemplo (opcional — descomente se quiser seed automático)
-- INSERT INTO profissionais (nome, especialidade, especialidade_tipo, registro_profissional, uf, cidade, email, telefone, bio, nrs_expertise, experiencia_anos, areas_atuacao, verified, avaliacao) VALUES
-- ('João Silva', 'Técnico de Segurança do Trabalho', NULL, 'CREA-PR 12345/D', 'PR', 'Curitiba', 'joao@email.com', '(41) 99999-9999', 'Especialista em NR-35 e trabalho em altura', ARRAY['NR-35', 'NR-6', 'NR-11'], 15, ARRAY['Trabalho em altura', 'Espaço confinado'], TRUE, 4.8),
-- ('Dra. Maria', 'Médico do Trabalho', NULL, 'CRM-SP 123456', 'SP', 'São Paulo', 'maria@clinica.com', '(11) 98888-8888', 'Medicina ocupacional e perícias', ARRAY['NR-7', 'NR-8'], 20, ARRAY['Ocupacional', 'Perícia'], TRUE, 4.9),
-- ('Carlos Perito', 'Engenheiro de Segurança', 'Perito', 'CREA-RJ 54321/D', 'RJ', 'Rio de Janeiro', 'carlos@pericias.com', '(21) 97777-7777', 'Perito em acidentes do trabalho', ARRAY['NR-1', 'NR-4'], 25, ARRAY['Perícia', 'Investigação'], TRUE, 5.0);
