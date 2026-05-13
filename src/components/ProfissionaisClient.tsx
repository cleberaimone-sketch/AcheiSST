'use client'

import { useState, useMemo } from 'react'
import {
  Search, MapPin, Filter, CheckCircle2, Phone,
  Star, ChevronLeft, ChevronRight, SlidersHorizontal,
  Users, X, ExternalLink, MessageCircle, Shield,
  Briefcase, GraduationCap, Stethoscope, HardHat, UserCheck, User,
} from 'lucide-react'
import type { ProfissionalUnificado } from '@/types'

// ── Constants ──────────────────────────────────────────────────────────────────
const PER_PAGE = 12

const ESPECIALIDADES = [
  'Todos',
  'Médico do Trabalho',
  'Técnico de Segurança do Trabalho',
  'Engenheiro de Segurança',
  'Enfermeiro do Trabalho',
  'Fisioterapeuta do Trabalho',
  'Higienista Ocupacional',
  'Perito de SST',
]

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const ESPECIALIDADE_ICON: Record<string, React.ReactNode> = {
  'Médico do Trabalho': <Stethoscope className="w-3.5 h-3.5" />,
  'Técnico de Segurança do Trabalho': <HardHat className="w-3.5 h-3.5" />,
  'Engenheiro de Segurança': <HardHat className="w-3.5 h-3.5" />,
  'Higienista Ocupacional': <Shield className="w-3.5 h-3.5" />,
  'Perito de SST': <Briefcase className="w-3.5 h-3.5" />,
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function StarRating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700">{value?.toFixed(1)}</span>
      <span className="text-xs text-slate-400">({count} avaliações)</span>
    </div>
  )
}

// ── Benefits Section ───────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: <Search className="w-6 h-6 text-green-600" />,
    title: 'Seja encontrado',
    desc: 'Empresas buscam profissionais SST diariamente. Apareça para quem precisa contratar.',
  },
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: 'Mais oportunidades',
    desc: 'Conecte-se diretamente com empresas da sua região que precisam do seu serviço.',
  },
  {
    icon: <Shield className="w-6 h-6 text-green-600" />,
    title: 'Perfil verificado',
    desc: 'Exibimos seu CRM ou CREA como garantia de credibilidade para o contratante.',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
    title: 'Cadastro gratuito',
    desc: 'Sem custo para profissionais de SST. Crie seu perfil em menos de 2 minutos.',
  },
]

function BenefitsSection() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full mb-3">
          <UserCheck className="w-3 h-3" /> Para profissionais
        </span>
        <h2 className="text-lg font-bold text-slate-900">Por que cadastrar seu perfil aqui?</h2>
        <p className="text-sm text-slate-500 mt-1">Junte-se a centenas de profissionais SST que já estão gerando oportunidades</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50 transition-colors">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
              {b.icon}
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">{b.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href="/cadastrar"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          <UserCheck className="w-4 h-4" />
          Cadastrar meu perfil grátis
        </a>
      </div>
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────────
function ProfissionalCard({ prof }: { prof: ProfissionalUnificado }) {
  const whatsappNum = prof.whatsapp?.replace(/\D/g, '') || prof.telefone?.replace(/\D/g, '')
  const telefoneDisplay = prof.telefone || prof.whatsapp
  const perfilUrl = prof.fonte === 'cadastrado' ? `/profissionais/p/${prof.id}` : `/profissionais/${prof.id}`

  return (
    <article className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Top strip */}
      <div className={`h-1 bg-gradient-to-r ${prof.fonte === 'cadastrado' ? 'from-green-500 to-emerald-400' : prof.verified ? 'from-green-500 to-emerald-400' : 'from-transparent to-transparent'}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-[68px] h-[68px] rounded-xl overflow-hidden flex items-center justify-center ${prof.foto_url ? '' : 'bg-slate-100'}`}>
              {prof.foto_url ? (
                <img
                  src={prof.foto_url}
                  alt={prof.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    t.parentElement!.classList.add('bg-slate-100')
                  }}
                />
              ) : (
                <User className="w-9 h-9 text-slate-300" />
              )}
            </div>
            {prof.verified && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-50" />
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-0.5">
              <a href={perfilUrl} className="group-hover:text-green-700 transition-colors flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-[15px] leading-snug line-clamp-1">{prof.nome}</h3>
              </a>
              {prof.fonte === 'cadastrado' && (
                <span className="flex-shrink-0 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                  AcheiSST
                </span>
              )}
            </div>

            {/* Specialty badge */}
            {prof.especialidade && (
              <div className="flex items-center gap-1.5 mt-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  {ESPECIALIDADE_ICON[prof.especialidade] ?? <UserCheck className="w-3 h-3" />}
                  {prof.especialidade}
                </span>
              </div>
            )}

            {/* Location + registro */}
            <div className="flex flex-col gap-0.5 text-xs text-slate-500">
              {(prof.cidade || prof.uf) && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" />
                  <span>{prof.cidade ? `${prof.cidade}, ` : ''}<strong className="text-slate-700">{prof.uf}</strong></span>
                </div>
              )}
              {prof.registro && (
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 flex-shrink-0 text-slate-400" />
                  <span className="font-mono text-slate-600 font-medium text-[11px]">{prof.registro}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {prof.bio && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{prof.bio}</p>
        )}

        {/* NRs */}
        {prof.nrs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {prof.nrs.slice(0, 4).map((nr) => (
              <span key={nr} className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {nr}
              </span>
            ))}
            {prof.nrs.length > 4 && (
              <span className="text-[11px] bg-slate-50 border border-slate-200 text-slate-400 px-2 py-0.5 rounded-md">
                +{prof.nrs.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-50 mt-auto">
          {whatsappNum ? (
            <a
              href={`https://wa.me/55${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          ) : telefoneDisplay ? (
            <a
              href={`tel:${telefoneDisplay}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Ligar
            </a>
          ) : null}

          <a
            href={perfilUrl}
            className="inline-flex items-center justify-center gap-1.5 border border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-600 hover:text-green-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver perfil
          </a>
        </div>
      </div>
    </article>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum profissional encontrado</h3>
      <p className="text-slate-500 text-sm mb-5 max-w-xs">
        Tente ampliar sua busca ou remover alguns filtros.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full transition-colors"
      >
        <X className="w-3.5 h-3.5" /> Limpar filtros
      </button>
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────────────────────────────
function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / PER_PAGE)
  if (pages <= 1) return null
  const start = (page - 1) * PER_PAGE + 1
  const end = Math.min(page * PER_PAGE, total)

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Mostrando <span className="font-semibold text-slate-700">{start}–{end}</span> de <span className="font-semibold text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg text-slate-500 hover:text-green-700 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          const p = pages <= 7 ? i + 1 : i < 3 ? i + 1 : i === 3 ? -1 : pages - (6 - i)
          if (p === -1) return <span key="dots" className="px-1 text-slate-300">…</span>
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-green-600 text-white'
                  : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
          className="p-2 rounded-lg text-slate-500 hover:text-green-700 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
interface Props {
  profissionais: ProfissionalUnificado[]
}

export function ProfissionaisClient({ profissionais }: Props) {
  const [search, setSearch] = useState('')
  const [uf, setUf] = useState('Todos')
  const [especialidade, setEspecialidade] = useState('Todos')
  const [page, setPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const cidadesDisponiveis = useMemo(() =>
    uf === 'Todos'
      ? []
      : [...new Set(profissionais.filter(p => p.uf === uf && p.cidade).map(p => p.cidade as string))].sort()
  , [uf, profissionais])

  const filtered = useMemo(() => {
    return profissionais.filter((p) => {
      if (uf !== 'Todos' && p.uf !== uf) return false
      if (especialidade !== 'Todos' && p.especialidade !== especialidade) return false
      if (search.trim()) {
        const t = search.toLowerCase()
        const text = [p.nome, p.especialidade, p.bio, p.registro, p.cidade]
          .filter(Boolean).join(' ').toLowerCase()
        if (!text.includes(t)) return false
      }
      return true
    })
  }, [profissionais, uf, especialidade, search])

  const paginated = useMemo(() =>
    filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  , [filtered, page])

  const activeFilters = [uf !== 'Todos' && uf, especialidade !== 'Todos' && especialidade].filter(Boolean)

  function resetFilters() {
    setUf('Todos')
    setEspecialidade('Todos')
    setSearch('')
    setPage(1)
  }

  function setFilter(fn: () => void) {
    fn()
    setPage(1)
  }

  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <SlidersHorizontal className="w-4 h-4 text-green-600" />
          Filtros
        </div>
        {activeFilters.length > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      {/* Estado */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Estado</label>
        <select
          value={uf}
          onChange={(e) => setFilter(() => setUf(e.target.value))}
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
        >
          <option value="Todos">Todos os estados</option>
          {UF_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {/* Especialidade */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Especialidade</label>
        <div className="space-y-1">
          {ESPECIALIDADES.map((esp) => (
            <button
              key={esp}
              onClick={() => setFilter(() => setEspecialidade(esp))}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                especialidade === esp
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {esp}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <section className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <BenefitsSection />

        {/* Search + Mobile Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar por nome, especialidade, CRM..."
              value={search}
              onChange={(e) => setFilter(() => setSearch(e.target.value))}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(v => !v)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium shadow-sm hover:border-green-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {activeFilters.length > 0 && (
              <span className="bg-green-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
            <SidebarContent />
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">
                  <strong className="text-slate-900">{filtered.length}</strong> profissional{filtered.length !== 1 ? 'is' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
              {activeFilters.length > 0 && (
                <div className="flex items-center gap-2">
                  {activeFilters.map((f) => (
                    <span key={String(f)} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                      {String(f)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {paginated.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200">
                <EmptyState onReset={resetFilters} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map((prof) => (
                    <ProfissionalCard key={prof.id} prof={prof} />
                  ))}
                </div>
                <Pagination page={page} total={filtered.length} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
