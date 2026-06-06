import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Navbar } from '@/components/Navbar';
import {
  Plus, ArrowRight, MessageSquare, Clock, MapPin, Calendar,
  DollarSign, Sparkles, ChevronRight,
} from 'lucide-react';

export const metadata = {
  title: 'Meus projetos publicados — AcheiSST',
};

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, { label: string; classe: string }> = {
  aberto:     { label: 'Aberto',          classe: 'bg-green-100 text-green-800 border-green-200' },
  em_analise: { label: 'Em análise',      classe: 'bg-blue-100 text-blue-800 border-blue-200' },
  escolhido:  { label: 'Prestador escolhido', classe: 'bg-amber-100 text-amber-800 border-amber-200' },
  concluido:  { label: 'Concluído',       classe: 'bg-slate-100 text-slate-700 border-slate-200' },
  cancelado:  { label: 'Cancelado',       classe: 'bg-red-100 text-red-700 border-red-200' },
  expirado:   { label: 'Expirado',        classe: 'bg-slate-100 text-slate-500 border-slate-200' },
};

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (h < 24) return `há ${h}h`;
  if (d < 30) return `há ${d} dia${d > 1 ? 's' : ''}`;
  return `há ${Math.floor(d / 30)} mês${d >= 60 ? 'es' : ''}`;
}

export default async function PainelProjetosPage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth?next=/painel/projetos');
  }

  const { data: projetos } = await supabase
    .from('projetos_servico')
    .select('id, titulo, categoria_id, cidade, uf, status, orcamento_min, orcamento_max, prazo_dias, created_at, expires_at')
    .eq('contratante_user_id', user.id)
    .order('created_at', { ascending: false });

  const projetoIds = (projetos ?? []).map((p) => p.id);
  let propostasCount: Record<string, number> = {};
  if (projetoIds.length > 0) {
    const { data: propostas } = await supabase
      .from('propostas')
      .select('projeto_id')
      .in('projeto_id', projetoIds);
    propostasCount = (propostas ?? []).reduce<Record<string, number>>((acc, p) => {
      acc[p.projeto_id] = (acc[p.projeto_id] ?? 0) + 1;
      return acc;
    }, {});
  }

  const { data: categorias } = await supabase
    .from('categorias_sst')
    .select('id, nome, icon');
  const categoriasMap = (categorias ?? []).reduce<Record<string, { nome: string; icon: string | null }>>((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const stats = {
    total:     projetos?.length ?? 0,
    abertos:   projetos?.filter((p) => ['aberto', 'em_analise'].includes(p.status)).length ?? 0,
    escolhido: projetos?.filter((p) => p.status === 'escolhido').length ?? 0,
    propostas: Object.values(propostasCount).reduce((a, b) => a + b, 0),
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <Link href="/painel" className="hover:text-green-600 transition-colors">Painel</Link>
                <span>/</span>
                <span className="text-slate-700 font-medium">Meus projetos</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Meus <span className="text-green-600">projetos</span>
              </h1>
              <p className="text-slate-500 mt-1">Acompanhe os pedidos que você publicou e as propostas recebidas.</p>
            </div>
            <Link
              href="/projetos/novo"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Publicar novo pedido
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Publicados',  valor: stats.total,     color: 'text-slate-900' },
              { label: 'Abertos',     valor: stats.abertos,   color: 'text-green-600' },
              { label: 'Escolhidos',  valor: stats.escolhido, color: 'text-amber-600' },
              { label: 'Propostas recebidas', valor: stats.propostas, color: 'text-blue-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4">
                <p className={`text-3xl font-extrabold ${s.color} leading-none`}>{s.valor}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Lista */}
          {!projetos || projetos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Sparkles className="w-12 h-12 text-green-200 mx-auto mb-3" />
              <p className="text-slate-700 font-bold text-lg mb-1">Você ainda não publicou pedidos</p>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Publique seu primeiro pedido de serviço SST e receba propostas de prestadores qualificados.
                É 100% grátis.
              </p>
              <Link
                href="/projetos/novo"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Publicar meu primeiro pedido
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projetos.map((p) => {
                const cat = categoriasMap[p.categoria_id];
                const status = STATUS_LABEL[p.status] ?? STATUS_LABEL.aberto;
                const numProp = propostasCount[p.id] ?? 0;
                return (
                  <Link
                    key={p.id}
                    href={`/projetos/${p.id}`}
                    className="group block bg-white border border-slate-200 hover:border-green-300 hover:shadow-md rounded-2xl p-5 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {cat && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                              <span>{cat.icon}</span>
                              {cat.nome}
                            </span>
                          )}
                          <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${status.classe}`}>
                            {status.label}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-green-700 leading-snug mb-2 transition-colors">
                          {p.titulo}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Publicado {tempoRelativo(p.created_at)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {p.cidade}, {p.uf}
                          </span>
                          {p.prazo_dias && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Prazo {p.prazo_dias}d
                            </span>
                          )}
                          {(p.orcamento_min || p.orcamento_max) && (
                            <span className="inline-flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              R$ {p.orcamento_min ?? '?'}–{p.orcamento_max ?? '?'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-start gap-2 sm:gap-3 sm:shrink-0 sm:text-right">
                        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-sm font-extrabold text-blue-700">{numProp}</span>
                          <span className="text-[10px] text-blue-600 font-medium">propostas</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-green-600 group-hover:text-green-700">
                          Ver projeto
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* CTA prestar serviço */}
          <div className="mt-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="max-w-md">
              <h3 className="text-xl font-extrabold mb-1">Também presta serviços de SST?</h3>
              <p className="text-blue-100 text-sm">
                Veja projetos abertos no Brasil e envie suas propostas grátis.
              </p>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm shrink-0"
            >
              Ver projetos abertos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
