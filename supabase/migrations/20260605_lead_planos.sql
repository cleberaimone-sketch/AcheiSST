-- ============================================================================
-- AcheiSST — Lead de Planos (captura de interesse durante beta)
-- ============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.lead_planos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  plano_interesse text NOT NULL CHECK (plano_interesse IN ('profissional', 'premium', 'ambos')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  origem text DEFAULT 'pagina_planos',
  created_at timestamptz DEFAULT now(),
  UNIQUE (email, plano_interesse)
);

CREATE INDEX IF NOT EXISTS idx_lead_planos_email ON public.lead_planos(email);
CREATE INDEX IF NOT EXISTS idx_lead_planos_plano  ON public.lead_planos(plano_interesse);

ALTER TABLE public.lead_planos ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode CADASTRAR seu interesse (mas não consultar a tabela)
DROP POLICY IF EXISTS "lead_planos_insert_publico" ON public.lead_planos;
CREATE POLICY "lead_planos_insert_publico" ON public.lead_planos
  FOR INSERT WITH CHECK (true);

-- Usuário autenticado vê só os próprios leads
DROP POLICY IF EXISTS "lead_planos_select_proprio" ON public.lead_planos;
CREATE POLICY "lead_planos_select_proprio" ON public.lead_planos
  FOR SELECT USING (auth.uid() = user_id);

COMMIT;
