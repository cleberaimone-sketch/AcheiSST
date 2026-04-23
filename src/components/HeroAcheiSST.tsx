'use client'

import { useState } from 'react'
import {
  Search, Users, Stethoscope, ShoppingBag, Cpu, BookOpen, Mic,
  ScanSearch, GraduationCap, PlayCircle, School, Building2, HardHat,
  CalendarDays, Briefcase, ClipboardList, Bot, Award, Newspaper,
  ArrowRight, Phone, Star, Youtube, Instagram, Facebook, Globe, Rss,
  ShieldCheck, Sparkles, MapPin, CheckCircle2, Medal,
} from 'lucide-react'
import { ProfissionaisDestaques } from './ProfissionaisDestaques'

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const CATEGORIES = [
  { icon: '👤', label: 'Profissionais',  href: '/profissionais',                accent: 'bg-blue-100 text-blue-700' },
  { icon: '🏥', label: 'Clínicas',       href: '/fornecedores?cat=clinica',     accent: 'bg-red-100 text-red-700' },
  { icon: '🏪', label: 'Lojas',          href: '/fornecedores?cat=loja',        accent: 'bg-orange-100 text-orange-700' },
  { icon: '💻', label: 'Software',       href: '/fornecedores?cat=software',    accent: 'bg-purple-100 text-purple-700' },
  { icon: '📰', label: 'Revista',        href: '/informativos',                 accent: 'bg-pink-100 text-pink-700' },
  { icon: '🎙️', label: 'Podcast',        href: '/conteudo?tipo=podcast',        accent: 'bg-green-100 text-green-700' },
  { icon: '🔍', label: 'Peritos',        href: '/profissionais?esp=perito',     accent: 'bg-cyan-100 text-cyan-700' },
  { icon: '👨‍🏫', label: 'Professores',    href: '/profissionais?esp=professor',  accent: 'bg-indigo-100 text-indigo-700' },
  { icon: '🎓', label: 'Cursos',         href: '/cursos',                       accent: 'bg-sst-100 text-sst-600' },
  { icon: '🏫', label: 'Escola',         href: '/cursos?tipo=escola',           accent: 'bg-teal-100 text-teal-700' },
  { icon: '🎯', label: 'Faculdade',      href: '/cursos?tipo=faculdade',        accent: 'bg-amber-100 text-amber-700' },
  { icon: '⚙️', label: 'Equipamentos',   href: '/fornecedores?cat=epi',         accent: 'bg-yellow-100 text-yellow-700' },
  { icon: '📅', label: 'Eventos',        href: '/eventos',                      accent: 'bg-fuchsia-100 text-fuchsia-700' },
  { icon: '💼', label: 'Vagas',          href: '/vagas',                        accent: 'bg-sky-100 text-sky-700' },
  { icon: '💰', label: 'Orçamentos',     href: '/solicitar-orcamento',          accent: 'bg-lime-100 text-lime-700' },
  { icon: '🤖', label: 'Ferramentas IA', href: '/ferramentas',                  accent: 'bg-rose-100 text-rose-700' },
  { icon: '🎓', label: 'Treinamentos',   href: '/fornecedores?cat=treinamento', accent: 'bg-red-100 text-red-700' },
  { icon: '📄', label: 'Artigos',        href: '/informativos',                 accent: 'bg-slate-100 text-slate-700' },
]

const PLATFORM_STATS = [
  { value: '5.000+', label: 'Fornecedores' },
  { value: '50k+',   label: 'Profissionais' },
  { value: '1M+',    label: 'Conexões' },
]

const ACTIONS = [
  { icon: Phone,  label: 'Contratar', href: '/solicitar-orcamento' },
  { icon: Search, label: 'Buscar',    href: '/busca' },
  { icon: Star,   label: 'Ranking',   href: '/ranking' },
]

const REGULATORS = [
  { label: 'MTE',        href: 'https://www.gov.br/trabalho-e-emprego' },
  { label: 'CREA',       href: 'https://www.crea.org.br' },
  { label: 'CRM / CFM',  href: 'https://portal.cfm.org.br' },
  { label: 'Fundacentro',href: 'https://www.fundacentro.gov.br' },
  { label: 'e-Social',   href: 'https://www.esocial.gov.br' },
]

const SOCIAL = [
  { icon: Rss,       label: 'Blog',       href: '/informativos' },
  { icon: Youtube,   label: 'YouTube',    href: '#' },
  { icon: Instagram, label: 'Instagram',  href: '#' },
  { icon: Facebook,  label: 'Facebook',   href: '#' },
  { icon: Globe,     label: 'Comunidade', href: '#' },
]

export function HeroAcheiSST() {
  const [query, setQuery] = useState('')
  const [uf, setUf] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (uf) params.set('uf', uf)
    window.location.href = `/busca?${params.toString()}`
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── HERO + SEARCH + CATEGORIES ────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="max-w-5xl mx-auto">

          {/* Brand */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Achei<span className="text-sst-400">SST</span>
            </h1>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Pesquisar profissional, produto, serviço..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-600/20 focus:border-navy-600 text-sm shadow-sm"
              />
            </div>
            <select
              value={uf}
              onChange={e => setUf(e.target.value)}
              className="py-3.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-600/20 focus:border-navy-600 text-sm cursor-pointer sm:w-36 shadow-sm"
            >
              <option value="">Todo Brasil</option>
              {UF_LIST.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button
              type="submit"
              className="bg-navy-600 hover:bg-navy-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm whitespace-nowrap"
            >
              Pesquisar <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* CATEGORY GRID */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {CATEGORIES.map(({ icon: Icon, label, href, accent }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl border border-slate-100 hover:border-navy-200 bg-slate-50 hover:bg-navy-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-600 group-hover:text-navy-600 text-center leading-tight transition-colors">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────── */}
      <div className="border-y border-navy-700 bg-navy-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 divide-x divide-navy-500">
          {PLATFORM_STATS.map(({ value, label }) => (
            <div key={label} className="py-4 flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white tabular-nums">{value}</span>
              <span className="text-xs text-navy-200 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROFISSIONAIS DESTAQUES ─────────────────────── */}
      <ProfissionaisDestaques />

      {/* ── CTA FORNECEDOR ────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-navy-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-full opacity-5">
              <div className="w-64 h-64 bg-white rounded-full -translate-y-1/3 translate-x-1/3" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-sst-400" />
                <p className="text-navy-200 text-sm font-semibold">É fornecedor de SST?</p>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
                Cadastre-se e alcance milhares de empresas
              </h3>
              <p className="text-navy-200 text-sm">
                Junte-se ao maior ecossistema de SST do Brasil e conecte-se com quem precisa dos seus serviços.
              </p>
            </div>
            <a
              href="/cadastrar"
              className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 bg-sst-400 hover:bg-sst-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              Cadastrar meu negócio <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── RODAPÉ ────────────────────────────────────── */}
      <section className="border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Ações rápidas</p>
            <ul className="space-y-2">
              {ACTIONS.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a href={href} className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-navy-600 transition-colors group">
                    <Icon className="w-4 h-4 group-hover:text-navy-600 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Órgãos reguladores</p>
            <ul className="space-y-2">
              {REGULATORS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sst-400 flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Comunidade</p>
            <ul className="space-y-2">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a href={href} className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <img src="/logo-compact.png" alt="AcheiSST" className="h-10 w-auto opacity-70" />
            <span>© 2026 AcheiSST. Todos os direitos reservados.</span>
          </div>
          <span>Informações verificadas — sempre consulte a fonte oficial.</span>
        </div>
      </section>

      {/* ── BOTTOM NAVIGATION (Mobile Only) ───────────── */}
      <nav className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-around">
        <a
          href="/"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-600 transition-colors"
        >
          <Users className="w-6 h-6" />
          <span className="text-xs font-medium">Início</span>
        </a>
        <a
          href="/fornecedores"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-600 transition-colors"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Explorar</span>
        </a>
        <a
          href="/informativos"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-600 transition-colors"
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-xs font-medium">Serviços</span>
        </a>
        <a
          href="/profissionais"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-600 transition-colors"
        >
          <ShieldCheck className="w-6 h-6" />
          <span className="text-xs font-medium">Perfil</span>
        </a>
      </nav>

      {/* Padding para bottom nav no mobile */}
      <div className="sm:hidden h-20" />

    </div>
  )
}
