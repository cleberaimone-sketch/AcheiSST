-- ============================================================================
-- AcheiSST — Reivindicação de perfil de fornecedor scraped
-- ============================================================================
-- Permite que o dono real de uma empresa scraped reivindique seu perfil
-- vinculando o auth.users.id ao registro em fornecedores.
-- ============================================================================

BEGIN;

-- 1. Coluna que vincula a conta do dono à empresa
ALTER TABLE public.fornecedores
  ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.fornecedores
  ADD COLUMN IF NOT EXISTS reivindicado_em timestamptz;

CREATE INDEX IF NOT EXISTS idx_fornecedores_auth_user
  ON public.fornecedores(auth_user_id)
  WHERE auth_user_id IS NOT NULL;

-- 2. RLS — habilita se não estiver habilitado, e cria policy do dono
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

-- Leitura pública (já deve existir, mas garante idempotência)
DROP POLICY IF EXISTS "fornecedores_leitura_publica" ON public.fornecedores;
CREATE POLICY "fornecedores_leitura_publica" ON public.fornecedores
  FOR SELECT USING (true);

-- Dono pode atualizar SEU fornecedor
DROP POLICY IF EXISTS "fornecedor_dono_pode_editar" ON public.fornecedores;
CREATE POLICY "fornecedor_dono_pode_editar" ON public.fornecedores
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Reivindicação: usuário pode setar auth_user_id pra si SÓ se ainda estiver null
-- (essa policy permite UPDATE only when current auth_user_id IS NULL)
DROP POLICY IF EXISTS "fornecedor_reivindicar" ON public.fornecedores;
CREATE POLICY "fornecedor_reivindicar" ON public.fornecedores
  FOR UPDATE
  USING (auth_user_id IS NULL)
  WITH CHECK (auth.uid() = auth_user_id);

COMMIT;

-- ============================================================================
-- ✅ Reivindicação habilitada.
-- Comportamento:
--   • Fornecedor scraped (auth_user_id = NULL) → qualquer usuário logado pode
--     reivindicar (UPDATE setando auth_user_id = auth.uid())
--   • Após reivindicado → só o dono pode editar (policy fornecedor_dono_pode_editar)
-- ============================================================================
