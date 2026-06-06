'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign, Calendar, MessageSquare, Send, Loader2, AlertCircle,
  CheckCircle2, Edit, X,
} from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

interface PropostaExistente {
  id: string;
  valor: number;
  prazo_dias: number;
  mensagem: string;
  status: string;
  created_at: string;
}

interface Props {
  projetoId: string;
  userId: string;
  propostaExistente: PropostaExistente | null;
}

const STATUS_BADGE: Record<string, { label: string; classe: string }> = {
  enviada:     { label: 'Aguardando resposta',  classe: 'bg-blue-50 text-blue-700 border-blue-200' },
  visualizada: { label: 'Visualizada',           classe: 'bg-violet-50 text-violet-700 border-violet-200' },
  aceita:      { label: '✓ Aceita',              classe: 'bg-green-50 text-green-700 border-green-200' },
  recusada:    { label: 'Recusada',              classe: 'bg-red-50 text-red-700 border-red-200' },
  retirada:    { label: 'Retirada',              classe: 'bg-slate-50 text-slate-600 border-slate-200' },
};

export function EnviarPropostaForm({ projetoId, userId, propostaExistente }: Props) {
  const router = useRouter();
  const editavel = propostaExistente && ['enviada', 'visualizada'].includes(propostaExistente.status);
  const [editando, setEditando] = useState(false);

  const [valor, setValor]       = useState(propostaExistente?.valor?.toString() ?? '');
  const [prazoDias, setPrazoDias] = useState(propostaExistente?.prazo_dias?.toString() ?? '');
  const [mensagem, setMensagem] = useState(propostaExistente?.mensagem ?? '');
  const [erro, setErro]         = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function validar(): string | null {
    const v = Number(valor);
    if (!v || v <= 0) return 'Informe um valor válido em R$';
    const p = Number(prazoDias);
    if (!p || p <= 0) return 'Informe o prazo em dias';
    if (mensagem.trim().length < 30) return 'A mensagem precisa ter no mínimo 30 caracteres';
    if (mensagem.trim().length > 2000) return 'A mensagem não pode passar de 2000 caracteres';
    return null;
  }

  async function enviarOuAtualizar(e: React.FormEvent) {
    e.preventDefault();
    const erroValidacao = validar();
    if (erroValidacao) { setErro(erroValidacao); return; }
    setErro(null);
    setSalvando(true);

    const supabase = createSupabaseBrowser();
    const payload = {
      valor: Number(valor),
      prazo_dias: Number(prazoDias),
      mensagem: mensagem.trim(),
    };

    let error;
    if (propostaExistente) {
      ({ error } = await supabase
        .from('propostas')
        .update(payload)
        .eq('id', propostaExistente.id));
    } else {
      ({ error } = await supabase
        .from('propostas')
        .insert({
          ...payload,
          projeto_id: projetoId,
          prestador_user_id: userId,
          status: 'enviada',
        }));
    }

    setSalvando(false);

    if (error) {
      setErro(`Erro: ${error.message}`);
      return;
    }

    router.refresh();
    setEditando(false);
  }

  // Mostra proposta existente (read-only) com botão editar
  if (propostaExistente && !editando) {
    const badge = STATUS_BADGE[propostaExistente.status] ?? STATUS_BADGE.enviada;
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600">
            Sua proposta
          </p>
          <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${badge.classe}`}>
            {badge.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Valor</p>
            <p className="text-lg font-extrabold text-slate-900">
              R$ {propostaExistente.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Prazo</p>
            <p className="text-lg font-extrabold text-slate-900">{propostaExistente.prazo_dias} dias</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Mensagem</p>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {propostaExistente.mensagem}
          </p>
        </div>

        {editavel ? (
          <button
            onClick={() => setEditando(true)}
            className="w-full inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-green-400 text-slate-700 hover:text-green-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            Editar minha proposta
          </button>
        ) : (
          <p className="text-xs text-slate-400 text-center pt-2">
            Esta proposta não pode mais ser editada
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={enviarOuAtualizar}
      className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-green-600">
          {propostaExistente ? 'Editar proposta' : 'Enviar proposta'}
        </p>
        {propostaExistente && (
          <button type="button" onClick={() => setEditando(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            <DollarSign className="w-3 h-3 inline mr-1" />
            Valor (R$)
          </label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="800"
            min={0}
            step="0.01"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            <Calendar className="w-3 h-3 inline mr-1" />
            Prazo (dias)
          </label>
          <input
            type="number"
            value={prazoDias}
            onChange={(e) => setPrazoDias(e.target.value)}
            placeholder="15"
            min={1}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          <MessageSquare className="w-3 h-3 inline mr-1" />
          Mensagem ao contratante
        </label>
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={5}
          placeholder="Conte por que você é a pessoa certa pra esse projeto. Experiência relevante, prazo de entrega, o que você entrega exatamente..."
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          {mensagem.length}/2000 — mínimo 30 caracteres
        </p>
      </div>

      {erro && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={salvando}
        className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {salvando ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : propostaExistente ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Salvar alterações
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Enviar proposta grátis
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        Você pode editar sua proposta até ser aceita ou recusada
      </p>
    </form>
  );
}
