-- Criação da tabela fornecedores com suporte a múltiplas categorias
-- Profissionais, Clínicas, Lojas, Software, Equipamentos, etc.

-- Dropar tabela se existir (apenas para reset)
-- DROP TABLE IF EXISTS fornecedores CASCADE;

-- Criar tabela fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação básica
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria TEXT NOT NULL, -- 'clinica', 'loja', 'software', 'equipamento', 'treinamento', etc.
  subcategoria TEXT,

  -- Dados legais
  cnpj TEXT,

  -- Localização
  uf CHAR(2) NOT NULL,
  cidade TEXT NOT NULL,
  endereco TEXT,

  -- Contato
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,

  -- Imagens e URLs
  logo_url TEXT,
  foto_url TEXT,
  website_url TEXT,

  -- Informações gerais
  descricao TEXT,
  especialidades TEXT[], -- Para clínicas: ['PCMSO', 'ASO', ...]
  categorias_oferecidas TEXT[], -- Para lojas: ['Botinas', 'Luvas', ...]

  -- Números e avaliação
  experiencia_anos INTEGER,
  medicos_disponiveis INTEGER, -- Para clínicas
  clientes INTEGER, -- Para software
  num_avaliacoes INTEGER DEFAULT 0,
  avaliacao DECIMAL(2,1),

  -- Metadados
  verified BOOLEAN DEFAULT FALSE,
  is_sponsored BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_fornecedores_categoria ON fornecedores(categoria);
CREATE INDEX IF NOT EXISTS idx_fornecedores_uf ON fornecedores(uf);
CREATE INDEX IF NOT EXISTS idx_fornecedores_cidade ON fornecedores(cidade);
CREATE INDEX IF NOT EXISTS idx_fornecedores_verified ON fornecedores(verified);
CREATE INDEX IF NOT EXISTS idx_fornecedores_avaliacao ON fornecedores(avaliacao DESC);
CREATE INDEX IF NOT EXISTS idx_fornecedores_slug ON fornecedores(slug);

-- Índice para full-text search (português)
CREATE INDEX IF NOT EXISTS idx_fornecedores_fts ON fornecedores
USING GIN(to_tsvector('portuguese', nome || ' ' || COALESCE(descricao, '')));

-- Trigger para atualizar atualizado_em
CREATE OR REPLACE FUNCTION atualizar_fornecedores_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_fornecedores_atualizado_em
BEFORE UPDATE ON fornecedores
FOR EACH ROW
EXECUTE FUNCTION atualizar_fornecedores_atualizado_em();

-- Row Level Security
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;

-- Policy: Todos podem ler
CREATE POLICY IF NOT EXISTS fornecedores_select ON fornecedores
FOR SELECT USING (true);

-- Policy: Apenas admin pode inserir/atualizar/deletar (futuro)
-- CREATE POLICY fornecedores_insert ON fornecedores
-- FOR INSERT WITH CHECK (auth.role() = 'admin');
