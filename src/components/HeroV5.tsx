'use client'

import { useState } from 'react'
import {
  Search, ArrowRight, Phone, Star,
  CheckCircle2, MapPin, Sparkles, ShieldCheck, Zap, Medal, Menu, X,
  ChevronRight,
} from 'lucide-react'

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const CATEGORIES = [
  { icon: '👤', label: 'Profissionais',  href: '/profissionais',                color: 'text-green-400 bg-green-400/10' },
  { icon: '🏥', label: 'Clínicas',       href: '/fornecedores?cat=clinica',     color: 'text-red-400 bg-red-400/10' },
  { icon: '🏪', label: 'Lojas',          href: '/fornecedores?cat=loja',        color: 'text-orange-400 bg-orange-400/10' },
  { icon: '💻', label: 'Software',       href: '/fornecedores?cat=software',    color: 'text-purple-400 bg-purple-400/10' },
  { icon: '📰', label: 'Revista',        href: '/informativos',                 color: 'text-pink-400 bg-pink-400/10' },
  { icon: '🎙️', label: 'Podcast',        href: '/conteudo?tipo=podcast',        color: 'text-cyan-400 bg-cyan-400/10' },
  { icon: '🔍', label: 'Peritos',        href: '/profissionais?esp=perito',     color: 'text-indigo-400 bg-indigo-400/10' },
  { icon: '👨‍🏫', label: 'Professores',    href: '/profissionais?esp=professor',  color: 'text-emerald-400 bg-emerald-400/10' },
  { icon: '🎬', label: 'Cursos',         href: '/cursos',                       color: 'text-lime-400 bg-lime-400/10' },
  { icon: '🏫', label: 'Escola',         href: '/cursos?tipo=escola',           color: 'text-amber-400 bg-amber-400/10' },
  { icon: '🏢', label: 'Faculdade',      href: '/cursos?tipo=faculdade',        color: 'text-yellow-400 bg-yellow-400/10' },
  { icon: '⚙️', label: 'Equipamentos',   href: '/fornecedores?cat=epi',         color: 'text-fuchsia-400 bg-fuchsia-400/10' },
  { icon: '📅', label: 'Eventos',        href: '/eventos',                      color: 'text-sky-400 bg-sky-400/10' },
  { icon: '💼', label: 'Vagas',          href: '/vagas',                        color: 'text-green-400 bg-green-400/10' },
  { icon: '📋', label: 'Orçamentos',     href: '/orcamento',                    color: 'text-teal-400 bg-teal-400/10' },
  { icon: '🤖', label: 'IA Tools',       href: '/ferramentas',                  color: 'text-rose-400 bg-rose-400/10' },
  { icon: '🎓', label: 'Treinamentos',   href: '/fornecedores?cat=treinamento', color: 'text-red-400 bg-red-400/10' },
  { icon: '📄', label: 'Artigos',        href: '/informativos',                 color: 'text-slate-400 bg-slate-400/10' },
]

const PREMIUM_PROVIDERS = [
  {
    name: 'Clínica Saúde Ocupacional Integral',
    category: 'Clínicas e Saúde',
    rating: 4.9, reviews: 127,
    city: 'São Paulo, SP', remote: true,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
  },
  {
    name: 'Treinamento Seguro Total',
    category: 'Treinamentos e Cursos',
    rating: 4.9, reviews: 178,
    city: 'Belo Horizonte, MG', remote: true,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
  },
  {
    name: 'SoftSST — Software de Gestão',
    category: 'Tecnologia e Softwares',
    rating: 4.8, reviews: 215,
    city: 'Curitiba, PR', remote: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    name: 'EPI Brasil Distribuidora Nacional',
    category: 'EPIs e Equipamentos',
    rating: 4.7, reviews: 342,
    city: 'Guarulhos, SP', remote: false,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
  },
]

const STATS = [
  { value: '5.000+', label: 'Fornecedores' },
  { value: '50k+',   label: 'Profissionais' },
  { value: '1M+',    label: 'Conexões' },
]

const ACTIONS = [
  { icon: Phone,  label: 'Contratar', href: '/orcamento' },
  { icon: Search, label: 'Buscar',    href: '/busca' },
  { icon: Star,   label: 'Ranking',   href: '/ranking' },
]

const REGULATORS = [
  { label: 'MTE',  href: 'https://www.gov.br/trabalho-e-emprego' },
  { label: 'CREA', href: 'https://www.crea.org.br' },
  { label: 'CRM',  href: 'https://portal.cfm.org.br' },
  { label: 'ISO',  href: 'https://www.iso.org' },
  { label: 'OSHA', href: 'https://www.osha.gov' },
]

const SOCIAL = [
  { icon: '📰', label: 'Blog',       href: '/informativos' },
  { icon: '📺', label: 'YouTube',    href: '#' },
  { icon: '📷', label: 'Instagram',  href: '#' },
  { icon: '👥', label: 'Facebook',   href: '#' },
  { icon: '🌍', label: 'Comunidade', href: '#' },
]

export function HeroV5() {
  const [query, setQuery] = useState('')
  const [uf, setUf] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (uf) params.set('uf', uf)
    window.location.href = `/busca?${params.toString()}`
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
                <Zap className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-playfair font-bold text-white text-2xl tracking-tight">
                Pluga<span className="text-green-400">SST</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
              <a href="/fornecedores" className="hover:text-green-400 transition-colors">Fornecedores</a>
              <a href="/profissionais" className="hover:text-green-400 transition-colors">Profissionais</a>
              <a href="/informativos" className="hover:text-green-400 transition-colors">Notícias</a>
              <a href="/busca" className="hover:text-green-400 transition-colors">Buscar</a>
            </nav>

            {/* Desktop CTAs — Temporarily removed */}

            {/* Mobile button */}
            <button
              className="md:hidden text-slate-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden py-4 flex flex-col gap-3 text-sm font-medium border-t border-slate-800">
              <a href="/fornecedores" className="py-2 text-slate-300 hover:text-green-400 transition-colors">Fornecedores</a>
              <a href="/profissionais" className="py-2 text-slate-300 hover:text-green-400 transition-colors">Profissionais</a>
              <a href="/informativos" className="py-2 text-slate-300 hover:text-green-400 transition-colors">Notícias</a>
              <a href="/busca" className="py-2 text-slate-300 hover:text-green-400 transition-colors">Buscar</a>
            </div>
          )}
        </div>
      </header>

      {/* ── CATEGORY GRID (topo) ────────────────────────── */}
      <section className="pt-24 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {CATEGORIES.map(({ icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border border-slate-800 hover:border-green-500/40 bg-slate-950 hover:bg-green-500/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/5"
                >
                  <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 text-xl`}>
                    {icon}
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-500 group-hover:text-green-400 text-center leading-tight transition-colors">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH ────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="search"
                placeholder="Pesquisar profissional, produto, serviço..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 text-sm transition-all"
              />
            </div>
            <select
              value={uf}
              onChange={e => setUf(e.target.value)}
              className="py-3.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 text-sm cursor-pointer sm:w-36 transition-all"
            >
              <option value="">Todo Brasil</option>
              {UF_LIST.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-500/25 whitespace-nowrap"
            >
              Pesquisar <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <div className="border-y border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 divide-x divide-slate-800">
          {STATS.map(({ value, label }) => (
            <div key={label} className="py-6 flex flex-col items-center">
              <span className="font-playfair text-3xl font-bold text-green-400 tabular-nums">{value}</span>
              <span className="text-xs text-slate-500 font-medium mt-1 tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESTAQUES PREMIUM ────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="font-playfair text-xl font-bold text-white">Destaques Premium</h2>
            </div>
            <a
              href="/fornecedores?destaque=premium"
              className="text-sm font-semibold text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PREMIUM_PROVIDERS.map((p) => (
              <a
                key={p.name}
                href="/fornecedores"
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
              >
                {/* Photo */}
                <div className="relative h-36 overflow-hidden bg-slate-800">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-90"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                    <Medal className="w-3 h-3" />
                    Premium
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-3.5 flex flex-col gap-1.5 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{p.category}</span>
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{p.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-300">{p.rating}</span>
                    <span className="text-xs text-slate-600">({p.reviews})</span>
                    <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {p.city}
                    </div>
                    {p.remote && (
                      <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                        Remoto
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FORNECEDOR ───────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-slate-900 p-8 sm:p-10">
            {/* Glow decoration */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 left-8 w-32 h-32 bg-green-400/4 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <p className="text-green-400 text-sm font-semibold">É fornecedor de SST?</p>
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  Cadastre-se e alcance<br className="hidden sm:block" /> milhares de empresas
                </h3>
                <p className="font-lora text-slate-400 text-sm leading-relaxed">
                  Junte-se ao maior ecossistema de SST do Brasil e conecte-se com quem precisa dos seus serviços.
                </p>
              </div>
              <a
                href="/cadastrar"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-green-500 text-slate-950 font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-green-400 transition-all shadow-lg shadow-green-500/25 whitespace-nowrap"
              >
                Cadastrar meu negócio <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-900 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Col 1 */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Ações rápidas</p>
            <ul className="space-y-2.5">
              {ACTIONS.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a href={href} className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-green-400 transition-colors group">
                    <Icon className="w-4 h-4 group-hover:text-green-400 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Órgãos reguladores</p>
            <ul className="space-y-2.5">
              {REGULATORS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Comunidade</p>
            <ul className="space-y-2.5">
              {SOCIAL.map(({ icon, label, href }) => (
                <li key={label}>
                  <a href={href} className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    <span className="text-lg">{icon}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-600">
          <span>© 2026 AcheiSST — Ecossistema SST Brasil. Todos os direitos reservados.</span>
          <span>Conteúdo processado com IA — sempre verifique a fonte oficial.</span>
        </div>
      </footer>

    </div>
  )
}
