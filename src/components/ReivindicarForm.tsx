'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { CheckCircle2, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  fornecedorId: string;
  fornecedorSlug: string;
  fornecedorNome: string;
}

export function ReivindicarForm({ fornecedorId, fornecedorSlug, fornecedorNome }: Props) {
  const router = useRouter();
  const [confirmou, setConfirmou] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function reivindicar() {
    if (!confirmou) {
      setErro('Marque a caixa de confirmação antes de continuar');
      return;
    }
    setSalvando(true);
    setErro(null);

    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErro('Sessão expirou. Faça login novamente.');
      setSalvando(false);
      return;
    }

    // RLS já valida que o fornecedor está com auth_user_id NULL e que auth.uid() = user.id
    const { error, count } = await supabase
      .from('fornecedores')
      .update({
        auth_user_id: user.id,
        reivindicado_em: new Date().toISOString(),
      }, { count: 'exact' })
      .eq('id', fornecedorId)
      .is('auth_user_id', null);

    if (error) {
      setErro(`Não foi possível reivindicar: ${error.message}`);
      setSalvando(false);
      return;
    }

    if (count === 0) {
      setErro('Esse perfil já foi reivindicado por outro usuário.');
      setSalvando(false);
      return;
    }

    // Sucesso → redireciona pro perfil reivindicado
    router.push(`/fornecedores/${fornecedorSlug}?reivindicado=1`);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Confirme que você é responsável por:</p>
          <p className="text-sm text-green-700 font-extrabold mt-0.5">{fornecedorNome}</p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmou}
          onChange={(e) => setConfirmou(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0"
        />
        <span className="text-sm text-slate-700 leading-relaxed">
          Declaro que sou o representante legal ou autorizado pela empresa <strong>{fornecedorNome}</strong> e
          assumo a responsabilidade pela gestão deste perfil no AcheiSST.
        </span>
      </label>

      {erro && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      <button
        onClick={reivindicar}
        disabled={salvando || !confirmou}
        className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {salvando ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Reivindicando...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Reivindicar este perfil agora
          </>
        )}
      </button>
    </div>
  );
}
