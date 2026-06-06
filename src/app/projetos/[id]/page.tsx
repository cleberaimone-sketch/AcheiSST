import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Navbar } from '@/components/Navbar';
import { EnviarPropostaForm } from '@/components/EnviarPropostaForm';
import { ListaPropostas } from '@/components/ListaPropostas';
import {
  MapPin, Calendar, DollarSign, CheckCircle2, Clock,
  Sparkles, ArrowLeft, User, LogIn, MessageSquare,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string }>;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  aberto:     { label: 'Aberto para propostas',  color: 'bg-green-100 text-green-800 border-green-200' },
  em_analise: { label: 'Em análise',              color: 'bg-blue-100 text-blue-800 border-blue-200' },
  escolhido:  { label: 'Prestador escolhido',     color: 'bg-amber-100 text-amber-800 border-amber-200' },
  concluido:  { label: 'Concluído',               color: 'bg-slate-100 text-slate-700 border-slate-200' },
  cancelado:  { label: 'Cancelado',               color: 'bg-red-100 text-red-700 border-red-200' },
  expirado:   { label: 'Expirado',                color: 'bg-slate-100 text-slate-500 border-slate-200' },
};

function formataData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServer>>;

async function buscarPropostasCompletas(supabase: SupabaseClient, projetoId: string) {
  const { data: propostas } = await supabase
    .from('propostas')
    .select('id, prestador_user_id, valor, prazo_dias, mensagem, status, created_at')
    .eq('projeto_id', projetoId)
    .order('created_at', { ascending: false });

  if (!propostas || propostas.length === 0) return [];

  const userIds = [...new Set(propostas.map((p) => p.prestador_user_id))];
  const { data: prestadores } = await supabase
    .from('profiles')
    .select('user_id, display_name, city, state, avatar_url, ocupacao, whatsapp, is_verified')
    .in('user_id', userIds);

  type Prestador = NonNullable<typeof prestadores>[number];
  const prestadoresMap = (prestadores ?? []).reduce<Record<string, Prestador>>((acc, p) => {
    acc[p.user_id] = p;
    return acc;
  }, {});

  return propostas.map((p) => ({
    ...p,
    valor: Number(p.valor),
    prestador: prestadoresMap[p.prestador_user_id] ?? null,
  }));
}

export default async function ProjetoDetalhePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { novo } = await searchParams;
  const supabase = await createSupabaseServer();

  const { data: projeto } = await supabase
    .from('projetos_servico')
    .select('*')
    .eq('id', id)
    .single();

  if (!projeto) {
    notFound();
  }

  const { data: categoria } = await supabase
    .from('categorias_sst')
    .select('nome, icon, descricao')
    .eq('id', projeto.categoria_id)
    .single();

  const { data: contratante } = await supabase
    .from('profiles')
    .select('display_name, city, state, avatar_url, is_verified')
    .eq('user_id', projeto.contratante_user_id)
    .maybeSingle();

  const { data: { user } } = await supabase.auth.getUser();
  const isDono = user?.id === projeto.contratante_user_id;
  const statusInfo = STATUS_LABEL[projeto.status] ?? STATUS_LABEL.aberto;
  const projetoFechado = ['escolhido', 'concluido', 'cancelado', 'expirado'].includes(projeto.status);

  // Conta propostas (resumo)
  const { count: totalPropostas } = await supabase
    .from('propostas')
    .select('*', { count: 'exact', head: true })
    .eq('projeto_id', id);

  // Se for o dono: busca TODAS propostas com dados do prestador (RLS permite)
  let propostasCompletas: Awaited<ReturnType<typeof buscarPropostasCompletas>> = [];
  if (isDono) {
    propostasCompletas = await buscarPropostasCompletas(supabase, id);
  }

  // Se NÃO for o dono e está logado: verifica se já tem proposta enviada
  let propostaDoUsuario: {
    id: string;
    valor: number;
    prazo_dias: number;
    mensagem: string;
    status: string;
    created_at: string;
  } | null = null;
  if (user && !isDono) {
    const { data } = await supabase
      .from('propostas')
      .select('id, valor, prazo_dias, mensagem, status, created_at')
      .eq('projeto_id', id)
      .eq('prestador_user_id', user.id)
      .maybeSingle();
    propostaDoUsuario = data;
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Banner de sucesso (após publicar) */}
          {novo === '1' && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-green-900">Pedido publicado com sucesso! 🎉</p>
                <p className="text-sm text-green-700 mt-0.5">
                  Os prestadores qualificados já podem ver e enviar propostas. Você será notificado por email quando chegarem.
                </p>
              </div>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
            <Link href="/" className="hover:text-green-600 transition-colors">Início</Link>
            <span>/</span>
            <Link href="/projetos" className="hover:text-green-600 transition-colors">Projetos</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium truncate max-w-[200px]">{projeto.titulo}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ─── COLUNA PRINCIPAL ─── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Card do projeto */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">

                  {/* Header com categoria */}
                  <div className="flex items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{categoria?.icon}</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                          {categoria?.nome}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Publicado em {formataData(projeto.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Título */}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 leading-tight">
                    {projeto.titulo}
                  </h1>

                  {/* Metadados rápidos */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {projeto.cidade}, {projeto.uf}
                    </span>
                    {projeto.atende_remoto && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                        💻 Aceita remoto
                      </span>
                    )}
                    {projeto.prazo_dias && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Prazo: {projeto.prazo_dias} dias
                      </span>
                    )}
                    {(projeto.orcamento_min || projeto.orcamento_max) && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                        R$ {projeto.orcamento_min ?? '?'} – R$ {projeto.orcamento_max ?? '?'}
                      </span>
                    )}
                  </div>

                  {/* Descrição */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">
                      Descrição do serviço
                    </h2>
                    <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                      {projeto.descricao}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card do contratante */}
              {contratante && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Publicado por
                  </p>
                  <div className="flex items-center gap-3">
                    {contratante.avatar_url ? (
                      <img
                        src={contratante.avatar_url}
                        alt={contratante.display_name ?? 'Contratante'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        {contratante.display_name ?? 'Contratante AcheiSST'}
                        {contratante.is_verified && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </p>
                      {(contratante.city || contratante.state) && (
                        <p className="text-xs text-slate-500">
                          {contratante.city}{contratante.city && contratante.state && ', '}{contratante.state}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de propostas — só dono vê (RLS já bloqueia outros) */}
              {isDono && (
                <div id="propostas" className="space-y-3 scroll-mt-24">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Propostas recebidas
                    </h2>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                      {propostasCompletas.length} no total
                    </span>
                  </div>
                  <ListaPropostas
                    projetoId={projeto.id}
                    propostas={propostasCompletas}
                    projetoStatus={projeto.status}
                  />
                </div>
              )}
            </div>

            {/* ─── SIDEBAR ─── */}
            <aside className="space-y-4">

              {/* Painel do DONO — resumo + ações */}
              {isDono && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-24">
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">
                    Seu pedido
                  </p>
                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Propostas recebidas</span>
                      <span className="text-2xl font-extrabold text-green-600">{totalPropostas ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Status</span>
                      <span className="text-xs font-bold text-slate-700">{statusInfo.label}</span>
                    </div>
                  </div>
                  <Link
                    href="#propostas"
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Ver propostas abaixo
                  </Link>
                  <Link
                    href="/projetos/novo"
                    className="block w-full text-center mt-2 border border-slate-200 hover:border-green-400 text-slate-700 hover:text-green-700 font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Publicar outro pedido
                  </Link>
                </div>
              )}

              {/* PRESTADOR LOGADO — form ou proposta atual */}
              {user && !isDono && !projetoFechado && (
                <div className="sticky top-24">
                  <EnviarPropostaForm
                    projetoId={projeto.id}
                    userId={user.id}
                    propostaExistente={propostaDoUsuario}
                  />
                </div>
              )}

              {/* PRESTADOR LOGADO em projeto JÁ FECHADO */}
              {user && !isDono && projetoFechado && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                  <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 mb-1">Projeto não disponível</p>
                  <p className="text-xs text-slate-500 mb-4">
                    Esse projeto já {projeto.status === 'escolhido' ? 'tem um prestador escolhido' : 'foi encerrado'}.
                  </p>
                  <Link
                    href="/projetos"
                    className="inline-flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700"
                  >
                    Ver outros projetos abertos
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </Link>
                </div>
              )}

              {/* VISITANTE não logado */}
              {!user && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                      Quer fazer este serviço?
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Faça login ou crie sua conta grátis para enviar uma proposta.
                  </p>
                  <Link
                    href={`/auth?next=/projetos/${projeto.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar / Cadastrar grátis
                  </Link>
                </div>
              )}

              {/* Validade */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Válido até</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {formataData(projeto.expires_at)}
                  </p>
                </div>
              </div>

              {/* Voltar */}
              <Link
                href="/projetos"
                className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para listagem
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
