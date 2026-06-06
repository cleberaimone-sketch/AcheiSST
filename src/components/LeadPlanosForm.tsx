'use client';
import { useState, useEffect } from 'react';
import { Mail, Loader2, CheckCircle2, Bell } from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

interface Props {
  plano: 'profissional' | 'premium';
}

export function LeadPlanosForm({ plano }: Props) {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Pré-preenche se já tem usuário logado
  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErro('Informe um email válido');
      return;
    }
    setEnviando(true);
    setErro(null);

    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('lead_planos')
      .insert({
        email: email.trim().toLowerCase(),
        plano_interesse: plano,
        user_id: user?.id ?? null,
      });

    setEnviando(false);

    // Ignora erro de duplicação (UNIQUE constraint) — trata como sucesso
    if (error && !error.message.toLowerCase().includes('duplicate')) {
      setErro(`Erro: ${error.message}`);
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-green-800">Pronto!</p>
          <p className="text-[11px] text-green-700">Você será avisado quando ativarmos esse plano.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-2">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
        />
      </div>
      <button
        type="submit"
        disabled={enviando}
        className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-colors disabled:opacity-60"
      >
        {enviando ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Bell className="w-3.5 h-3.5" />
            Quero ser avisado
          </>
        )}
      </button>
      {erro && <p className="text-[10px] text-red-600">{erro}</p>}
    </form>
  );
}
