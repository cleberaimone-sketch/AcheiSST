'use client'

import { useState } from 'react'
import {
  Search, Users, Stethoscope, ShoppingBag, Cpu, BookOpen, Mic,
  ScanSearch, GraduationCap, PlayCircle, School, Building2, HardHat,
  CalendarDays, Briefcase, ClipboardList, Bot, Award, Newspaper,
  ArrowRight, MapPin, Star, Heart, Share2, MessageCircle, ChevronRight,
  Menu, X, Zap, CheckCircle2, Shield, Bell, AlertCircle,
} from 'lucide-react'

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const CATEGORIES = [
  { icon: Users,         label: 'Profissionais',  href: '/profissionais',                color: 'bg-blue-100 text-blue-700' },
  { icon: Stethoscope,   label: 'Clínicas',       href: '/fornecedores?cat=clinica',     color: 'bg-green-100 text-green-700' },
  { icon: ShoppingBag,   label: 'Lojas',          href: '/fornecedores?cat=loja',        color: 'bg-amber-100 text-amber-700' },
  { icon: Cpu,           label: 'Software',       href: '/fornecedores?cat=software',    color: 'bg-indigo-100 text-indigo-700' },
  { icon: BookOpen,      label: 'Revista',        href: '/informativos',                 color: 'bg-rose-100 text-rose-700' },
  { icon: Mic,           label: 'Podcast',        href: '/conteudo?tipo=podcast',        color: 'bg-pink-100 text-pink-700' },
  { icon: ScanSearch,    label: 'Peritos',        href: '/profissionais?esp=perito',     color: 'bg-cyan-100 text-cyan-700' },
  { icon: GraduationCap, label: 'Professores',    href: '/profissionais?esp=professor',  color: 'bg-purple-100 text-purple-700' },
]

const TOP_EVENTS = [
  {
    badge: 'CONGRESSO',
    badgeColor: 'text-green-600',
    title: '23º Congresso Brasileiro de SST',
    date: '14 de ago.',
    location: 'São Paulo, SP',
    price: 'R$ 890',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
  },
  {
    badge: 'WORKSHOP',
    badgeColor: 'text-green-600',
    title: 'Workshop: Ergonomia no Home Office',
    date: '19 de mar.',
    location: 'Online',
    price: 'Gratuito',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
  },
]

const PREMIUM_PROVIDERS = [
  {
    name: 'Clínica Saúde Ocupacional Integral',
    category: 'CLÍNICAS E SAÚDE',
    categoryColor: 'text-red-500',
    rating: 4.9, reviews: 127,
    city: 'São Paulo, SP', remote: true,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
    verified: true,
  },
  {
    name: 'Treinamento Seguro Total',
    category: 'TREINAMENTOS E CURSOS',
    categoryColor: 'text-red-500',
    rating: 4.9, reviews: 178,
    city: 'Belo Horizonte, MG', remote: true,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    verified: true,
  },
]

const FEATURED_CONTENT = [
  {
    badge: 'ARTIGO',
    badgeColor: 'text-red-500',
    title: 'Guia Completo da NR-35: Trabalho em Altura',
    author: 'Eng. Ricardo Mendes',
    reads: 892,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
  },
  {
    badge: 'ARTIGO',
    badgeColor: 'text-red-500',
    title: 'eSocial: O que mudou em 2024?',
    author: 'SoftSST',
    reads: 654,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  },
]

const STATS = [
  { value: '5.000+', label: 'Fornecedores' },
  { value: '50k+',   label: 'Profissionais' },
  { value: '1M+',    label: 'Conexões' },
]

export function HeroPreview6() {
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
    <div className="bg-white min-h-screen text-slate-900">

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair font-bold text-slate-900 text-xl tracking-tight hidden sm:inline">
                Achei<span className="text-blue-600">SST</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/fornecedores" className="text-slate-600 hover:text-blue-600 transition-colors">Fornecedores</a>
              <a href="/profissionais" className="text-slate-600 hover:text-blue-600 transition-colors">Profissionais</a>
              <a href="/informativos" className="text-slate-600 hover:text-blue-600 transition-colors">Notícias</a>
            </nav>

            {/* Mobile button */}
            <button
              className="md:hidden text-slate-600 hover:text-slate-900"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden py-3 flex flex-col gap-2 text-sm font-medium border-t border-slate-200">
              <a href="/fornecedores" className="py-2 text-slate-600 hover:text-blue-600">Fornecedores</a>
              <a href="/profissionais" className="py-2 text-slate-600 hover:text-blue-600">Profissionais</a>
              <a href="/informativos" className="py-2 text-slate-600 hover:text-blue-600">Notícias</a>
            </div>
          )}
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest text-blue-100">AcheiSST</span>
          </div>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold mb-3 leading-tight">
            O ecossistema completo de SST
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl">
            Conecte-se com profissionais, fornecedores e serviços especializados em Saúde e Segurança no Trabalho.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
                <div className="text-xs sm:text-sm text-blue-100">{label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Buscar fornecedores, serviços..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
            <select
              value={uf}
              onChange={e => setUf(e.target.value)}
              className="py-3 px-3 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm cursor-pointer sm:w-40"
            >
              <option value="">Todo Brasil</option>
              {UF_LIST.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button
              type="submit"
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
            >
              Buscar <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* ── CATEGORIES GRID ───────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Categorias</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 text-center">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP EVENTS ────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Próximos Eventos</h2>
            <a href="/eventos" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {TOP_EVENTS.map((event) => (
              <a
                key={event.title}
                href="#"
                className="flex gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-white transition-all group"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-bold uppercase tracking-wide ${event.badgeColor}`}>
                    {event.badge}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                    <span>{event.date}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {event.location}
                    </span>
                  </div>
                  <div className="mt-2">
                    {event.isFree ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                        {event.price}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-500">{event.price}</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM HIGHLIGHTS ────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Destaques Premium</h2>
            <a href="/fornecedores?destaque=premium" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PREMIUM_PROVIDERS.map((p) => (
              <a
                key={p.name}
                href="/fornecedores"
                className="group overflow-hidden border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="relative h-40 overflow-hidden bg-slate-200">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {p.verified && (
                      <div className="flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verificada
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <span className={`text-xs font-bold uppercase tracking-wide ${p.categoryColor}`}>
                    {p.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-2 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-900">{p.rating}</span>
                      <span className="text-xs text-slate-600">({p.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="w-3 h-3" /> {p.city}
                    </div>
                    {p.remote && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
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
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-10 text-white">
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">É fornecedor de SST?</h3>
              <p className="text-blue-100 mb-6">
                Cadastre-se e alcance milhares de empresas que buscam seus serviços
              </p>
              <a
                href="/cadastrar"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-all"
              >
                Cadastrar meu negócio <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CONTENT ──────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Conteúdo em Destaque</h2>
            <a href="/informativos" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver mais <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-3">
            {FEATURED_CONTENT.map((content) => (
              <a
                key={content.title}
                href="/informativos"
                className="flex gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-bold uppercase tracking-wide ${content.badgeColor}`}>
                    {content.badge}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-2">
                    {content.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-600">
                    <span>{content.author}</span>
                    <span className="flex items-center gap-1">
                      ★ {content.reads}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">AcheiSST</span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm">
              Hub independente de Saúde e Segurança no Trabalho. Conectando profissionais e empresas.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Plataforma</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/fornecedores" className="hover:text-blue-600">Fornecedores</a></li>
                <li><a href="/profissionais" className="hover:text-blue-600">Profissionais</a></li>
                <li><a href="/informativos" className="hover:text-blue-600">Notícias</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Suporte</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Contato</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-600">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Privacidade</a></li>
                <li><a href="#" className="hover:text-blue-600">Termos</a></li>
                <li><a href="#" className="hover:text-blue-600">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-xs text-slate-600">
            <span>© 2026 AcheiSST — Ecossistema SST Brasil. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* ── BOTTOM NAVIGATION (Mobile Only) ───────────── */}
      <nav className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-around">
        <a
          href="/"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Users className="w-6 h-6" />
          <span className="text-xs font-medium">Início</span>
        </a>
        <a
          href="/fornecedores"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Explorar</span>
        </a>
        <a
          href="/informativos"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-xs font-medium">Serviços</span>
        </a>
        <a
          href="/profissionais"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <Shield className="w-6 h-6" />
          <span className="text-xs font-medium">Perfil</span>
        </a>
      </nav>

      {/* Padding para bottom nav no mobile */}
      <div className="sm:hidden h-20" />

    </div>
  )
}
