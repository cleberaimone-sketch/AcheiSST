import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Navbar } from '@/components/Navbar';
import {
  Send, MessageSquare, Clock, DollarSign, Calendar,
  ChevronRight, CheckCircle2, XCircle, Search, MapPin,
} from 'lucide-react';

export const metadata = {
  title: 'Minhas propostas — AcheiSST',
};

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, { label: string; classe: string; icon: typeof CheckCircle2 }> = {
  enviada:     { label: 'Aguardando resposta', classe: 'bg-blue-50 text-blue-700 border-blue-200',       icon: Clock },
  visualizada: { label: 'Visualizada',          classe: 'bg-violet-50 text-violet-700 border-violet-200', icon: CheckCircle2 },
  aceita:      { label: '✓ Aceita',             classe: 'bg-green-50 text-green-700 border-green-200',    icon: CheckCircle2 },
  recusada:    { label: 'Recusada',             classe: 'bg-red-50 text-red-700 border-red-200',          icon: XCircle },
  retirada:    { label: 'Retirada',             classe: 'bg-slate-50 text-slate-500 border-slate-200',    icon: XCircle },
};

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (h < 24) return `há ${h}h`;
  if (d < 30) return `há ${d} dia${d > 1 ? 's' : ''}`;
  return `há ${Math.floor(d / 30)} mês${d >= 60 ? 'es' : ''}`;
}

export default async function PainelPropostasPage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth?next=/painel/propostas');
  }

  const { data: propostas } = await supabase
    .from('propostas')
    .select('id, projeto_id, valor, prazo_dias, mensagem, status, created_at')
    .eq('prestador_user_id', user.id)
    .order('created_at', { ascending: false });

  // Busca projetos relacionados
  const projetoIds = (propostas ?? []).map((p) => p.projeto_id);
  let projetos: Record<string, {
    id: string;
    titulo: string;
    cidade: string;
    uf: string;
    categoria_id: string;
    status: string;
  }> = {};
  if (projetoIds.length > 0) {
    const { data } = await supabase
      .from('projetos_servico')
      .select('id, titulo, cidade, uf, categoria_id, status')
      .in('id', projetoIds);
    projetos = (data ?? []).reduce<typeof projetos>((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});
  }

  // Busca categorias
  const { data: categorias } = await supabase
    .from('categorias_sst')
    .select('id, nome, icon');
  const categoriasMap = (categorias ?? []).reduce<Record<string, { nome: string; icon: string | null }>>((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  const stats = {
    total:    propostas?.length ?? 0,
    pendentes: propostas?.filter((p) => ['enviada', 'visualizada'].includes(p.status)).length ?? 0,
    aceitas:  propostas?.filter((p) => p.status === 'aceita').length ?? 0,
    recusadas: propostas?.filter((p) => p.status === 'recusada').length ?? 0,
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
                <span className="text-slate-700 font-medium">Minhas propostas</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Minhas <span className="text-green-600">propostas</span>
              </h1>
              <p className="text-slate-500 mt-1">Acompanhe o status de tudo que você enviou no marketplace.</p>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
              Buscar projetos abertos
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total enviadas', valor: stats.total,     color: 'text-slate-900' },
              { label: 'Aguardando',     valor: stats.pendentes, color: 'text-blue-600' },
              { label: 'Aceitas',        valor: stats.aceitas,   color: 'text-green-600' },
              { label: 'Recusadas',      valor: stats.recusadas, color: 'text-red-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4">
                <p className={`text-3xl font-extrabold ${s.color} leading-none`}>{s.valor}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Lista */}
          {!propostas || propostas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Send className="w-12 h-12 text-green-200 mx-auto mb-3" />
              <p className="text-slate-700 font-bold text-lg mb-1">Você ainda não enviou propostas</p>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Explore os projetos abertos no marketplace e envie sua proposta.
                Quanto antes, mais chance de ser visto.
              </p>
              <Link
                href="/projetos"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                <Search className="w-4 h-4" />
                Ver projetos abertos
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {propostas.map((p) => {
                const projeto = projetos[p.projeto_id];
                const cat = projeto && categoriasMap[projeto.categoria_id];
                const status = STATUS_LABEL[p.status] ?? STATUS_LABEL.enviada;
                const StatusIcon = status.icon;
                return (
                  <Link
                    key={p.id}
                    href={`/projetos/${p.projeto_id}`}
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
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold border px-2 py-0.5 rounded-full ${status.classe}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-green-700 leading-snug mb-2 transition-colors">
                          {projeto?.titulo ?? 'Projeto removido'}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Enviada {tempoRelativo(p.created_at)}
                          </span>
                          {projeto && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {projeto.cidade}, {projeto.uf}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {p.mensagem}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-start gap-2 sm:gap-2 sm:shrink-0 sm:text-right">
                        <div className="bg-slate-50 rounded-xl px-3 py-2 text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Sua proposta</p>
                          <p className="text-base font-extrabold text-slate-900 mt-1 leading-none">
                            R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">{p.prazo_dias} dias</p>
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
        </div>
      </main>
    </>
  );
}
