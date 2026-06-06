'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, Calendar, DollarSign, Filter, X,
  Sparkles, ArrowRight, Clock, MessageSquare, ChevronRight,
} from 'lucide-react';

interface Categoria {
  id: string;
  nome: string;
  icon: string | null;
  ordem: number;
}

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  categoria_id: string;
  cidade: string;
  uf: string;
  atende_remoto: boolean;
  prazo_dias: number | null;
  orcamento_min: number | null;
  orcamento_max: number | null;
  status: string;
  created_at: string;
  expires_at: string;
  contratante_user_id: string;
  num_propostas: number;
}

interface Props {
  projetos: Projeto[];
  categorias: Categoria[];
  stats: { total: number; estados: number; remoto: number };
}

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
];

type PeriodoFiltro = 'todos' | 'hoje' | '7' | '30';
type PropostasFiltro = 'todos' | 'sem' | 'poucas' | 'muitas';

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `há ${min} min`;
  if (hour < 24) return `há ${hour}h`;
  if (day < 30) return `há ${day} dia${day > 1 ? 's' : ''}`;
  return `há ${Math.floor(day / 30)} mês${day >= 60 ? 'es' : ''}`;
}

function formatBRL(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function ProjetosListClient({ projetos, categorias, stats }: Props) {
  const [busca, setBusca] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [ufSelecionado, setUfSelecionado] = useState('');
  const [apenasRemoto, setApenasRemoto] = useState(false);
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('todos');
  const [filtroPropostas, setFiltroPropostas] = useState<PropostasFiltro>('todos');
  const [filtrosMobileOpen, setFiltrosMobileOpen] = useState(false);

  const categoriasMap = useMemo(() => {
    return categorias.reduce<Record<string, Categoria>>((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
  }, [categorias]);

  const projetosFiltrados = useMemo(() => {
    const agora = Date.now();
    return projetos.filter((p) => {
      // Busca textual
      if (busca) {
        const q = busca.toLowerCase();
        if (
          !p.titulo.toLowerCase().includes(q) &&
          !p.descricao.toLowerCase().includes(q) &&
          !p.cidade.toLowerCase().includes(q)
        ) return false;
      }
      // Categorias
      if (categoriasSelecionadas.length > 0 && !categoriasSelecionadas.includes(p.categoria_id)) {
        return false;
      }
      // UF
      if (ufSelecionado && p.uf !== ufSelecionado) return false;
      // Remoto
      if (apenasRemoto && !p.atende_remoto) return false;
      // Período
      if (periodo !== 'todos') {
        const idade = agora - new Date(p.created_at).getTime();
        const limite =
          periodo === 'hoje' ? 86400000 :
          periodo === '7'    ? 7 * 86400000 :
          30 * 86400000;
        if (idade > limite) return false;
      }
      // Propostas
      if (filtroPropostas !== 'todos') {
        if (filtroPropostas === 'sem' && p.num_propostas !== 0) return false;
        if (filtroPropostas === 'poucas' && (p.num_propostas < 1 || p.num_propostas > 4)) return false;
        if (filtroPropostas === 'muitas' && p.num_propostas < 5) return false;
      }
      return true;
    });
  }, [projetos, busca, categoriasSelecionadas, ufSelecionado, apenasRemoto, periodo, filtroPropostas]);

  function toggleCategoria(id: string) {
    setCategoriasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function limparFiltros() {
    setBusca('');
    setCategoriasSelecionadas([]);
    setUfSelecionado('');
    setApenasRemoto(false);
    setPeriodo('todos');
    setFiltroPropostas('todos');
  }

  const filtrosAtivos =
    categoriasSelecionadas.length > 0 || ufSelecionado || apenasRemoto ||
    periodo !== 'todos' || filtroPropostas !== 'todos' || busca;

  return (
    <>
      {/* HEADER da página */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                <Link href="/" className="hover:text-green-600 transition-colors">Início</Link>
                <span>/</span>
                <span className="text-slate-700 font-medium">Projetos abertos</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Projetos abertos de <span className="text-green-600">SST</span>
              </h1>
              <p className="text-slate-500 text-base max-w-2xl">
                Empresas e profissionais buscando prestadores de saúde e segurança do trabalho.
                Encontre seu próximo projeto e envie sua proposta.
              </p>
              <div className="flex flex-wrap gap-5 mt-4 text-sm">
                <span><strong className="text-2xl font-extrabold text-green-600">{stats.total}</strong> <span className="text-slate-500">abertos</span></span>
                <span><strong className="text-2xl font-extrabold text-green-600">{stats.estados}</strong> <span className="text-slate-500">estados</span></span>
                <span><strong className="text-2xl font-extrabold text-green-600">{stats.remoto}</strong> <span className="text-slate-500">remotos</span></span>
              </div>
            </div>
            <Link
              href="/projetos/novo"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl shadow-sm transition-colors text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Publicar pedido grátis
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Botão mobile pra abrir filtros */}
        <button
          onClick={() => setFiltrosMobileOpen(true)}
          className="lg:hidden mb-4 w-full inline-flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {filtrosAtivos && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Ativos</span>}
        </button>

        <div className="flex gap-6 items-start">

          {/* ─── SIDEBAR DE FILTROS (desktop sticky) ─── */}
          <aside className={`
            ${filtrosMobileOpen
              ? 'fixed inset-0 z-50 bg-white p-5 overflow-y-auto'
              : 'hidden lg:block lg:w-72 lg:shrink-0 lg:sticky lg:top-24'}
          `}>
            {/* Header mobile */}
            {filtrosMobileOpen && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 lg:hidden">
                <h2 className="text-lg font-extrabold text-slate-900">Filtros</h2>
                <button onClick={() => setFiltrosMobileOpen(false)} aria-label="Fechar">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto">

              {/* Busca */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="search"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="PGR, treinamento NR-35..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Categorias */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Categoria
                </label>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {categorias.map((c) => {
                    const isSel = categoriasSelecionadas.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          isSel ? 'bg-green-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleCategoria(c.id)}
                          className="w-4 h-4 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0"
                        />
                        <span className="text-base">{c.icon}</span>
                        <span className={`text-xs leading-tight ${isSel ? 'font-bold text-green-800' : 'text-slate-700'}`}>
                          {c.nome}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* UF */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Estado
                </label>
                <select
                  value={ufSelecionado}
                  onChange={(e) => setUfSelecionado(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
                >
                  <option value="">Todos os estados</option>
                  {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              {/* Remoto */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Modalidade
                </label>
                <label className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={apenasRemoto}
                    onChange={(e) => setApenasRemoto(e.target.checked)}
                    className="w-4 h-4 rounded text-green-600 focus:ring-green-500 focus:ring-offset-0"
                  />
                  <span className="text-xs text-slate-700">💻 Apenas aceita remoto</span>
                </label>
              </div>

              {/* Período */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Publicado
                </label>
                <div className="space-y-1">
                  {([
                    { v: 'todos', l: 'Qualquer período' },
                    { v: 'hoje',  l: 'Hoje' },
                    { v: '7',     l: 'Últimos 7 dias' },
                    { v: '30',    l: 'Últimos 30 dias' },
                  ] as { v: PeriodoFiltro; l: string }[]).map(({ v, l }) => (
                    <label key={v} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      periodo === v ? 'bg-green-50' : 'hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="periodo"
                        checked={periodo === v}
                        onChange={() => setPeriodo(v)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                      />
                      <span className={`text-xs ${periodo === v ? 'font-bold text-green-800' : 'text-slate-700'}`}>{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Propostas recebidas */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Propostas recebidas
                </label>
                <div className="space-y-1">
                  {([
                    { v: 'todos',  l: 'Todas' },
                    { v: 'sem',    l: 'Nenhuma (0)' },
                    { v: 'poucas', l: 'Poucas (1–4)' },
                    { v: 'muitas', l: 'Muitas (5+)' },
                  ] as { v: PropostasFiltro; l: string }[]).map(({ v, l }) => (
                    <label key={v} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      filtroPropostas === v ? 'bg-green-50' : 'hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="propostas"
                        checked={filtroPropostas === v}
                        onChange={() => setFiltroPropostas(v)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                      />
                      <span className={`text-xs ${filtroPropostas === v ? 'font-bold text-green-800' : 'text-slate-700'}`}>{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              {filtrosAtivos && (
                <button
                  onClick={limparFiltros}
                  className="w-full text-xs font-bold text-red-600 hover:text-red-700 py-2 border border-red-200 hover:border-red-300 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Limpar todos os filtros
                </button>
              )}

              {filtrosMobileOpen && (
                <button
                  onClick={() => setFiltrosMobileOpen(false)}
                  className="lg:hidden w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm"
                >
                  Ver {projetosFiltrados.length} projeto{projetosFiltrados.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </aside>

          {/* ─── LISTAGEM ─── */}
          <div className="flex-1 min-w-0">

            {/* Contagem */}
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-sm text-slate-500">
                <strong className="text-slate-900">{projetosFiltrados.length}</strong>{' '}
                projeto{projetosFiltrados.length !== 1 ? 's' : ''} encontrado{projetosFiltrados.length !== 1 ? 's' : ''}
              </p>
            </div>

            {projetosFiltrados.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold mb-1">Nenhum projeto encontrado</p>
                <p className="text-sm text-slate-400 mb-4">Tente ajustar os filtros ou veja todos os projetos</p>
                {filtrosAtivos && (
                  <button onClick={limparFiltros} className="text-sm text-green-600 font-bold hover:underline">
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {projetosFiltrados.map((p) => {
                  const cat = categoriasMap[p.categoria_id];
                  return (
                    <Link
                      key={p.id}
                      href={`/projetos/${p.id}`}
                      className="group block bg-white border border-slate-200 hover:border-green-300 hover:shadow-md rounded-2xl p-5 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1 min-w-0">

                          {/* Categoria pill */}
                          {cat && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded-full mb-2">
                              <span>{cat.icon}</span>
                              {cat.nome}
                            </span>
                          )}

                          {/* Título */}
                          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-green-700 leading-snug mb-2 transition-colors">
                            {p.titulo}
                          </h2>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Publicado {tempoRelativo(p.created_at)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {p.num_propostas} proposta{p.num_propostas !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Descrição truncada */}
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                            {p.descricao}
                          </p>

                          {/* Tags / metadados */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {p.cidade}, {p.uf}
                            </span>
                            {p.atende_remoto && (
                              <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                                💻 Remoto
                              </span>
                            )}
                            {p.prazo_dias && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {p.prazo_dias} dias
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Lateral direita: preço + CTA */}
                        <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-start gap-2 sm:gap-3 sm:shrink-0 sm:text-right">
                          {(p.orcamento_min || p.orcamento_max) ? (
                            <div className="flex items-center gap-1 text-sm font-extrabold text-slate-900">
                              <DollarSign className="w-3.5 h-3.5 text-green-600" />
                              R$ {p.orcamento_min ? formatBRL(p.orcamento_min) : '?'}
                              <span className="text-slate-400 font-normal mx-0.5">–</span>
                              R$ {p.orcamento_max ? formatBRL(p.orcamento_max) : '?'}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">A combinar</span>
                          )}
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-green-600 group-hover:text-green-700">
                            Ver detalhes
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* CTA pra contratante no fim da lista */}
            {projetosFiltrados.length > 0 && (
              <div className="mt-10 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  <h3 className="text-xl font-extrabold mb-1">É contratante? Publique seu pedido grátis</h3>
                  <p className="text-green-100 text-sm">
                    Receba propostas de prestadores qualificados em todo o Brasil. Sem mensalidade, sem comissão.
                  </p>
                </div>
                <Link
                  href="/projetos/novo"
                  className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm shrink-0"
                >
                  Publicar agora
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
