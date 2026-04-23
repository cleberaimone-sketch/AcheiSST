'use client'

import { useState } from 'react'
import { MapPin, Globe, Building2, Search } from 'lucide-react'
import type { EmpresaParceira } from '@/types'

const SEGMENTS = ['Todos', 'Consultoria SST', 'EPI & EPC', 'Medicina do Trabalho', 'Treinamento', 'Engenharia de Segurança', 'Fornecedor de EPI', 'Clínica de Medicina do Trabalho', 'Laboratório']

const REGIOES: Record<string, string[]> = {
  Norte: ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  Nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
  Sudeste: ['ES', 'MG', 'RJ', 'SP'],
  Sul: ['PR', 'RS', 'SC'],
}

const SEGMENT_COLORS: Record<string, string> = {
  'Consultoria SST': 'bg-blue-100 text-blue-700',
  'EPI & EPC': 'bg-orange-100 text-orange-700',
  'Medicina do Trabalho': 'bg-teal-100 text-teal-700',
  Treinamento: 'bg-violet-100 text-violet-700',
  'Engenharia de Segurança': 'bg-rose-100 text-rose-700',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

interface PartnerCardProps {
  empresa: EmpresaParceira
}

function PartnerCard({ empresa }: PartnerCardProps) {
  const colorClass = SEGMENT_COLORS[empresa.segment] ?? 'bg-slate-100 text-slate-700'

  return (
    <article
      className={`relative bg-white rounded-2xl border p-5 flex flex-col gap-3 hover:shadow-md transition-all duration-200 ${
        empresa.is_featured ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'
      }`}
    >
      {empresa.is_featured && (
        <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Destaque
        </span>
      )}

      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        >
          {getInitials(empresa.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate">{empresa.name}</h3>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span>{empresa.city}, {empresa.uf}</span>
          </div>
        </div>
      </div>

      <span className={`self-start text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
        {empresa.segment}
      </span>

      {empresa.website_url && (
        <a
          href={empresa.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          aria-label={`Visitar site de ${empresa.name}`}
        >
          <Globe className="w-3 h-3" aria-hidden="true" />
          Visitar site
        </a>
      )}
    </article>
  )
}

interface PartnersGridProps {
  empresas?: EmpresaParceira[]
}

export function PartnersGrid({ empresas = [] }: PartnersGridProps) {
  const [segment, setSegment] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selectedRegiao, setSelectedRegiao] = useState<string | null>(null)

  const filtered = empresas.filter((p) => {
    const matchSegment = segment === 'Todos' || p.segment === segment
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
    const matchRegiao = !selectedRegiao || REGIOES[selectedRegiao]?.includes(p.uf)
    return matchSegment && matchSearch && matchRegiao
  })

  const stats = {
    total: empresas.length,
    estados: new Set(empresas.map((p) => p.uf)).size,
    segmentos: new Set(empresas.map((p) => p.segment)).size,
  }

  return (
    <section
      id="parceiros"
      aria-labelledby="parceiros-heading"
      className="bg-white py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">Hub de Conexões</p>
          <h2
            id="parceiros-heading"
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
          >
            Empresas Parceiras SST
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl">
            Encontre prestadores de serviço e parceiros especializados em Saúde e Segurança do Trabalho em todo o Brasil.
          </p>
        </div>

        {/* Dashboard de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Building2, label: 'Empresas cadastradas', value: stats.total },
            { icon: MapPin, label: 'Estados representados', value: stats.estados },
            { icon: Search, label: 'Segmentos disponíveis', value: stats.segmentos },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Icon className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">{value}</span>
                <p className="text-xs text-slate-500 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <label htmlFor="partner-search" className="sr-only">Buscar empresa ou cidade</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
            <input
              id="partner-search"
              type="search"
              placeholder="Buscar empresa ou cidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl bg-white placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="partner-regiao" className="sr-only">Filtrar por região</label>
            <select
              id="partner-regiao"
              value={selectedRegiao ?? ''}
              onChange={(e) => setSelectedRegiao(e.target.value || null)}
              className="px-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer"
            >
              <option value="">Todas as regiões</option>
              {Object.keys(REGIOES).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs de segmento */}
        <div role="tablist" aria-label="Segmentos de empresas" className="flex flex-wrap gap-2 mb-8">
          {SEGMENTS.map((seg) => (
            <button
              key={seg}
              role="tab"
              aria-selected={segment === seg}
              onClick={() => setSegment(seg)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                segment === seg
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            aria-live="polite"
            aria-label={`${filtered.length} empresas encontradas`}
          >
            {filtered.map((empresa) => (
              <PartnerCard key={empresa.id} empresa={empresa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" aria-live="polite">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" aria-hidden="true" />
            <p className="text-slate-500 text-sm">Nenhuma empresa encontrada com esses filtros.</p>
            <button
              onClick={() => { setSegment('Todos'); setSearch(''); setSelectedRegiao(null) }}
              className="mt-3 text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* CTA cadastro */}
        <div
          id="cadastro"
          className="mt-14 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Sua empresa ainda não está aqui?</h3>
            <p className="text-green-100 text-sm">Cadastre-se gratuitamente e conecte-se a milhares de profissionais SST.</p>
          </div>
          <a
            href="/cadastrar"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-green-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-sm"
          >
            Cadastrar meu negócio
          </a>
        </div>
      </div>
    </section>
  )
}
