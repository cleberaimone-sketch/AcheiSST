'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign, Calendar, User, CheckCircle2, X, Loader2,
  MessageSquare, Phone, AlertCircle, Star,
} from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

interface Prestador {
  user_id: string;
  display_name: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  ocupacao: string | null;
  whatsapp: string | null;
  is_verified: boolean | null;
}

interface Proposta {
  id: string;
  prestador_user_id: string;
  valor: number;
  prazo_dias: number;
  mensagem: string;
  status: string;
  created_at: string;
}

interface PropostaComPrestador extends Proposta {
  prestador: Prestador | null;
}

interface Props {
  projetoId: string;
  propostas: PropostaComPrestador[];
  projetoStatus: string;
}

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (min < 60) return `há ${min} min`;
  if (hour < 24) return `há ${hour}h`;
  return `há ${day} dia${day > 1 ? 's' : ''}`;
}

function whatsappUrl(num: string, contexto: string): string {
  const limpo = num.replace(/\D/g, '');
  const numero = limpo.length === 11 || limpo.length === 10 ? `55${limpo}` : limpo;
  const msg = encodeURIComponent(`Olá! Aceitei sua proposta no AcheiSST para o projeto "${contexto}". Vamos conversar?`);
  return `https://wa.me/${numero}?text=${msg}`;
}

export function ListaPropostas({ projetoId, propostas, projetoStatus }: Props) {
  const router = useRouter();
  const [acaoEmCurso, setAcaoEmCurso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const propostaAceita = propostas.find((p) => p.status === 'aceita');
  const projetoEscolhido = projetoStatus === 'escolhido' || projetoStatus === 'concluido';

  async function notificarPorEmail(propostaId: string) {
    // Fire-and-forget — não trava UI se falhar
    fetch('/api/notify-proposta-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propostaId }),
    }).catch(() => { /* silencioso */ });
  }

  async function aceitar(propostaId: string) {
    if (!confirm('Aceitar essa proposta? O projeto será marcado como "Prestador escolhido", as outras propostas serão recusadas e os prestadores serão notificados por email.')) return;
    setAcaoEmCurso(propostaId);
    setErro(null);

    const supabase = createSupabaseBrowser();
    // 1. Aceita a proposta selecionada
    const { error: e1 } = await supabase
      .from('propostas')
      .update({ status: 'aceita', respondida_em: new Date().toISOString() })
      .eq('id', propostaId);

    if (e1) {
      setErro(`Erro ao aceitar: ${e1.message}`);
      setAcaoEmCurso(null);
      return;
    }

    // 2. Recusa todas as outras propostas do mesmo projeto
    const { data: outrasPropostas } = await supabase
      .from('propostas')
      .update({ status: 'recusada', respondida_em: new Date().toISOString() })
      .eq('projeto_id', projetoId)
      .neq('id', propostaId)
      .select('id');

    // 3. Marca projeto como 'escolhido' e grava o prestador
    const proposta = propostas.find((p) => p.id === propostaId);
    if (proposta) {
      await supabase
        .from('projetos_servico')
        .update({
          status: 'escolhido',
          prestador_escolhido_id: proposta.prestador_user_id,
        })
        .eq('id', projetoId);
    }

    // 4. Notifica por email — aceita + todas as recusadas
    notificarPorEmail(propostaId);
    (outrasPropostas ?? []).forEach((p) => notificarPorEmail(p.id));

    setAcaoEmCurso(null);
    startTransition(() => router.refresh());
  }

  async function recusar(propostaId: string) {
    if (!confirm('Recusar essa proposta? O prestador será notificado por email.')) return;
    setAcaoEmCurso(propostaId);
    setErro(null);

    const supabase = createSupabaseBrowser();
    const { error } = await supabase
      .from('propostas')
      .update({ status: 'recusada', respondida_em: new Date().toISOString() })
      .eq('id', propostaId);

    setAcaoEmCurso(null);
    if (error) {
      setErro(`Erro ao recusar: ${error.message}`);
      return;
    }

    notificarPorEmail(propostaId);
    startTransition(() => router.refresh());
  }

  if (propostas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-700 font-bold mb-1">Aguardando propostas</p>
        <p className="text-sm text-slate-500">
          Quando um prestador enviar uma proposta, ela vai aparecer aqui.
          Você receberá email com o resumo diário.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {erro && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      {/* Banner quando alguma proposta foi aceita */}
      {propostaAceita && propostaAceita.prestador?.whatsapp && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-extrabold text-green-900">Você escolheu um prestador! 🎉</p>
              <p className="text-sm text-green-700 mt-0.5">
                Agora é só entrar em contato pelo WhatsApp e combinar os próximos passos.
              </p>
            </div>
          </div>
          <a
            href={whatsappUrl(propostaAceita.prestador.whatsapp, `projeto ${projetoId.slice(0, 8)}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            Falar no WhatsApp com {propostaAceita.prestador.display_name ?? 'prestador'}
          </a>
        </div>
      )}

      {propostas.map((p) => {
        const isAceita    = p.status === 'aceita';
        const isRecusada  = p.status === 'recusada';
        const podeAgir    = !projetoEscolhido && !isAceita && !isRecusada;
        const carregando  = acaoEmCurso === p.id;

        return (
          <div
            key={p.id}
            className={`bg-white rounded-2xl border p-5 transition-all ${
              isAceita    ? 'border-green-300 ring-2 ring-green-100' :
              isRecusada  ? 'border-slate-200 opacity-60' :
                            'border-slate-200 hover:border-slate-300'
            }`}
          >

            {/* Cabeçalho do card */}
            <div className="flex items-start gap-3 mb-3 pb-3 border-b border-slate-100">
              {p.prestador?.avatar_url ? (
                <img
                  src={p.prestador.avatar_url}
                  alt={p.prestador.display_name ?? 'Prestador'}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-slate-900 truncate">
                    {p.prestador?.display_name ?? 'Prestador AcheiSST'}
                  </p>
                  {p.prestador?.is_verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {p.prestador?.ocupacao && <>{p.prestador.ocupacao} · </>}
                  {p.prestador?.city && p.prestador?.state && (
                    <>{p.prestador.city}, {p.prestador.state}</>
                  )}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Proposta enviada {tempoRelativo(p.created_at)}
                </p>
              </div>

              {isAceita && (
                <span className="text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full">
                  ✓ Aceita
                </span>
              )}
              {isRecusada && (
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                  Recusada
                </span>
              )}
            </div>

            {/* Valor + Prazo */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Valor</p>
                <p className="text-base font-extrabold text-slate-900">
                  R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Prazo</p>
                <p className="text-base font-extrabold text-slate-900">
                  {p.prazo_dias} dia{p.prazo_dias > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Mensagem */}
            <div className="mb-4">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Mensagem</p>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {p.mensagem}
              </p>
            </div>

            {/* Ações */}
            {podeAgir && (
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => recusar(p.id)}
                  disabled={carregando}
                  className="flex-1 inline-flex items-center justify-center gap-1 border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-3.5 h-3.5" /> Recusar</>}
                </button>
                <button
                  onClick={() => aceitar(p.id)}
                  disabled={carregando}
                  className="flex-[2] inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5" /> Aceitar essa proposta</>}
                </button>
              </div>
            )}

            {isAceita && p.prestador?.whatsapp && (
              <a
                href={whatsappUrl(p.prestador.whatsapp, `projeto ${projetoId.slice(0, 8)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Falar no WhatsApp
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
