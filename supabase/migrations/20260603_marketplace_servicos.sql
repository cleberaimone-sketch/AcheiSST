-- ============================================================================
-- AcheiSST — Marketplace de Serviços SST (Fase 1: Schema)
-- ============================================================================
-- Cria toda a base de dados do marketplace estilo Workana focado em SST.
-- Idempotente: pode rodar várias vezes sem quebrar (usa IF NOT EXISTS).
-- ============================================================================

-- ============================================================================
-- 0. ADICIONAR VALORES AO ENUM account_type (FORA da transação — exigência do PG)
-- ============================================================================
ALTER TYPE public.account_type ADD VALUE IF NOT EXISTS 'contratante_pf';
ALTER TYPE public.account_type ADD VALUE IF NOT EXISTS 'contratante_pj';
ALTER TYPE public.account_type ADD VALUE IF NOT EXISTS 'prestador_profissional';
ALTER TYPE public.account_type ADD VALUE IF NOT EXISTS 'prestador_empresa';

BEGIN;

-- ============================================================================
-- 1. CATEGORIAS DE SERVIÇO SST
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categorias_sst (
  id text PRIMARY KEY,
  nome text NOT NULL,
  descricao text,
  icon text,
  ordem int DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.categorias_sst (id, nome, descricao, icon, ordem) VALUES
  ('clinica-medicina-ocupacional', 'Clínica de Medicina Ocupacional', 'Exames admissionais, periódicos, demissionais', '🏥', 1),
  ('pcmso-aso', 'PCMSO / ASO', 'Programa de Controle Médico de Saúde Ocupacional e Atestados', '📋', 2),
  ('pgr-ppra', 'PGR / PPRA', 'Programa de Gerenciamento de Riscos (NR-1)', '⚠️', 3),
  ('nr-01-psicossocial', 'NR-01 / Avaliação Psicossocial', 'Riscos psicossociais e gerenciamento (NR-1 revisada)', '🧠', 4),
  ('treinamentos-nr', 'Treinamentos NR', 'NR-6, 10, 12, 33, 35 e demais treinamentos regulamentados', '🎓', 5),
  ('engenharia-seguranca', 'Engenharia de Segurança', 'Laudos LTCAT, PPP, projetos de segurança', '🔧', 6),
  ('tecnico-seguranca', 'Técnico de Segurança do Trabalho', 'Atuação direta em obras e empresas', '👷', 7),
  ('psicologo-organizacional', 'Psicólogo Organizacional', 'Avaliação psicológica ocupacional', '💬', 8),
  ('sesmt-terceirizado', 'SESMT Terceirizado', 'Serviço Especializado em Segurança e Medicina do Trabalho', '🛡️', 9),
  ('laudos-pericias', 'Laudos e Perícias Trabalhistas', 'Insalubridade, periculosidade, ergonômico, pericial', '📑', 10)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.categorias_sst ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categorias_publicas_leitura" ON public.categorias_sst;
CREATE POLICY "categorias_publicas_leitura" ON public.categorias_sst
  FOR SELECT USING (true);


-- ============================================================================
-- 2. PROJETOS DE SERVIÇO (pedidos publicados pelos contratantes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projetos_servico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contratante_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteúdo do pedido
  titulo text NOT NULL CHECK (length(titulo) BETWEEN 10 AND 120),
  descricao text NOT NULL CHECK (length(descricao) >= 30),
  categoria_id text NOT NULL REFERENCES public.categorias_sst(id),

  -- Localização
  cidade text NOT NULL,
  uf text NOT NULL CHECK (length(uf) = 2),
  atende_remoto boolean DEFAULT false,

  -- Orçamento (público — exibido para os prestadores)
  orcamento_min numeric(10,2),
  orcamento_max numeric(10,2),
  prazo_dias int CHECK (prazo_dias > 0),

  -- Status e ciclo de vida
  status text NOT NULL DEFAULT 'aberto'
    CHECK (status IN ('aberto', 'em_analise', 'escolhido', 'concluido', 'cancelado', 'expirado')),
  prestador_escolhido_id uuid REFERENCES auth.users(id),
  motivo_cancelamento text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS idx_projetos_status ON public.projetos_servico(status);
CREATE INDEX IF NOT EXISTS idx_projetos_categoria ON public.projetos_servico(categoria_id);
CREATE INDEX IF NOT EXISTS idx_projetos_uf ON public.projetos_servico(uf);
CREATE INDEX IF NOT EXISTS idx_projetos_contratante ON public.projetos_servico(contratante_user_id);
CREATE INDEX IF NOT EXISTS idx_projetos_created ON public.projetos_servico(created_at DESC);

-- Trigger pra atualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_projetos_updated ON public.projetos_servico;
CREATE TRIGGER trg_projetos_updated BEFORE UPDATE ON public.projetos_servico
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.projetos_servico ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ver projetos abertos (SEO + atrair prestador)
DROP POLICY IF EXISTS "projetos_abertos_publicos" ON public.projetos_servico;
CREATE POLICY "projetos_abertos_publicos" ON public.projetos_servico
  FOR SELECT USING (status IN ('aberto', 'em_analise', 'escolhido', 'concluido'));

-- Contratante vê seus próprios projetos em qualquer status
DROP POLICY IF EXISTS "projetos_proprio_dono" ON public.projetos_servico;
CREATE POLICY "projetos_proprio_dono" ON public.projetos_servico
  FOR ALL USING (auth.uid() = contratante_user_id);

-- Qualquer usuário autenticado pode publicar pedido
DROP POLICY IF EXISTS "projetos_publicar_autenticado" ON public.projetos_servico;
CREATE POLICY "projetos_publicar_autenticado" ON public.projetos_servico
  FOR INSERT WITH CHECK (auth.uid() = contratante_user_id);


-- ============================================================================
-- 3. PROPOSTAS (enviadas pelos prestadores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.propostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id uuid NOT NULL REFERENCES public.projetos_servico(id) ON DELETE CASCADE,
  prestador_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  valor numeric(10,2) NOT NULL CHECK (valor > 0),
  prazo_dias int NOT NULL CHECK (prazo_dias > 0),
  mensagem text NOT NULL CHECK (length(mensagem) BETWEEN 30 AND 2000),

  status text NOT NULL DEFAULT 'enviada'
    CHECK (status IN ('enviada', 'visualizada', 'aceita', 'recusada', 'retirada')),

  visualizada_em timestamptz,
  respondida_em timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Regra: 1 proposta por prestador por projeto (mas pode editar a sua)
  UNIQUE (projeto_id, prestador_user_id)
);

CREATE INDEX IF NOT EXISTS idx_propostas_projeto ON public.propostas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_propostas_prestador ON public.propostas(prestador_user_id);
CREATE INDEX IF NOT EXISTS idx_propostas_status ON public.propostas(status);

DROP TRIGGER IF EXISTS trg_propostas_updated ON public.propostas;
CREATE TRIGGER trg_propostas_updated BEFORE UPDATE ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;

-- Prestador vê suas próprias propostas
DROP POLICY IF EXISTS "propostas_prestador_proprias" ON public.propostas;
CREATE POLICY "propostas_prestador_proprias" ON public.propostas
  FOR ALL USING (auth.uid() = prestador_user_id);

-- Contratante vê todas propostas dos SEUS projetos
DROP POLICY IF EXISTS "propostas_contratante_ve_seu_projeto" ON public.propostas;
CREATE POLICY "propostas_contratante_ve_seu_projeto" ON public.propostas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projetos_servico p
      WHERE p.id = propostas.projeto_id AND p.contratante_user_id = auth.uid()
    )
  );

-- Contratante pode atualizar status (aceitar/recusar)
DROP POLICY IF EXISTS "propostas_contratante_aceita" ON public.propostas;
CREATE POLICY "propostas_contratante_aceita" ON public.propostas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projetos_servico p
      WHERE p.id = propostas.projeto_id AND p.contratante_user_id = auth.uid()
    )
  );


-- ============================================================================
-- 4. AVALIAÇÕES (P2: review do contratante sobre o prestador após concluir)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.avaliacoes_servico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id uuid NOT NULL REFERENCES public.projetos_servico(id) ON DELETE CASCADE,
  avaliador_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avaliado_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  estrelas int NOT NULL CHECK (estrelas BETWEEN 1 AND 5),
  comentario text CHECK (length(comentario) <= 1000),

  created_at timestamptz DEFAULT now(),

  UNIQUE (projeto_id, avaliador_user_id)
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_avaliado ON public.avaliacoes_servico(avaliado_user_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_projeto ON public.avaliacoes_servico(projeto_id);

ALTER TABLE public.avaliacoes_servico ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "avaliacoes_publicas" ON public.avaliacoes_servico;
CREATE POLICY "avaliacoes_publicas" ON public.avaliacoes_servico
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "avaliacoes_proprio_autor" ON public.avaliacoes_servico;
CREATE POLICY "avaliacoes_proprio_autor" ON public.avaliacoes_servico
  FOR ALL USING (auth.uid() = avaliador_user_id);


-- ============================================================================
-- 5. INDICAÇÕES (P10: programa de referral — estrutura pronta, sem trigger ativo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.indicacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicador_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  indicado_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  codigo text NOT NULL,
  email_indicado text,
  convertido boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  convertido_em timestamptz
);

CREATE INDEX IF NOT EXISTS idx_indicacoes_codigo ON public.indicacoes(codigo);
CREATE INDEX IF NOT EXISTS idx_indicacoes_indicador ON public.indicacoes(indicador_user_id);

ALTER TABLE public.indicacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "indicacoes_dono" ON public.indicacoes;
CREATE POLICY "indicacoes_dono" ON public.indicacoes
  FOR ALL USING (auth.uid() = indicador_user_id);


-- ============================================================================
-- 6. CAMPOS EXTRAS EM PROFILES (valores do enum já adicionados no passo 0)
-- ============================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf_cnpj text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS receita_verificado boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS codigo_indicacao text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notificacoes_email_resumo_diario boolean DEFAULT true;


-- ============================================================================
-- 7. VIEW: avaliacao_media por prestador (pra exibir estrelas no perfil)
-- ============================================================================
CREATE OR REPLACE VIEW public.prestador_reputacao AS
SELECT
  avaliado_user_id AS user_id,
  COUNT(*)::int AS num_avaliacoes,
  ROUND(AVG(estrelas)::numeric, 2) AS media_estrelas
FROM public.avaliacoes_servico
GROUP BY avaliado_user_id;


-- ============================================================================
-- 8. FUNÇÃO: expirar projetos automaticamente após 30 dias
-- ============================================================================
-- Pode ser chamada via cron job (pg_cron) ou diariamente via /api route.
CREATE OR REPLACE FUNCTION public.expirar_projetos_vencidos()
RETURNS int LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  qtd int;
BEGIN
  UPDATE public.projetos_servico
    SET status = 'expirado'
    WHERE status IN ('aberto', 'em_analise')
      AND expires_at < now();
  GET DIAGNOSTICS qtd = ROW_COUNT;
  RETURN qtd;
END $$;


COMMIT;

-- ============================================================================
-- ✅ Schema do Marketplace AcheiSST pronto.
-- Próximos passos (Fase 2 em diante):
--   • Formulário "Publicar pedido" → /projetos/novo
--   • Listagem com filtros → /projetos
--   • Detalhe + form de proposta → /projetos/[id]
--   • Painéis dos 2 lados
-- ============================================================================
