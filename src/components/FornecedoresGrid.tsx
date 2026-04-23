'use client'

import { useState } from 'react'
import {
  Search, MapPin, Globe, CheckCircle2, Star, MessageCircle,
  Building2, Shield, FlaskConical, Laptop, GraduationCap,
  ShoppingBag, Wrench, ChevronRight,
} from 'lucide-react'
import type { Fornecedor, FornecedorCategoria } from '@/types'
import { useTheme } from '@/components/ThemeProvider'

const CATEGORIAS: { label: string; value: FornecedorCategoria | 'Todos' }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'EPI & Equipamentos', value: 'EPI & Equipamentos' },
  { label: 'Clínicas Médicas', value: 'Clínicas Médicas' },
  { label: 'Consultorias SST', value: 'Consultorias SST' },
  { label: 'Treinamentos', value: 'Treinamentos' },
  { label: 'Softwares SST', value: 'Softwares SST' },
  { label: 'Laboratórios', value: 'Laboratórios' },
  { label: 'Engenharia de Segurança', value: 'Engenharia de Segurança' },
  { label: 'Outros', value: 'Outros' },
]

const CATEGORIA_ICON: Record<string, React.ElementType> = {
  'EPI & Equipamentos': ShoppingBag,
  'Clínicas Médicas': Shield,
  'Consultorias SST': Building2,
  'Treinamentos': GraduationCap,
  'Softwares SST': Laptop,
  'Laboratórios': FlaskConical,
  'Engenharia de Segurança': Wrench,
  'Outros': Building2,
}

const CATEGORIA_COLOR: Record<string, string> = {
  'EPI & Equipamentos': 'bg-orange-100 text-orange-700',
  'Clínicas Médicas': 'bg-teal-100 text-teal-700',
  'Consultorias SST': 'bg-blue-100 text-blue-700',
  'Treinamentos': 'bg-violet-100 text-violet-700',
  'Softwares SST': 'bg-cyan-100 text-cyan-700',
  'Laboratórios': 'bg-pink-100 text-pink-700',
  'Engenharia de Segurança': 'bg-amber-100 text-amber-700',
  'Outros': 'bg-slate-100 text-slate-600',
}

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function whatsappUrl(numero: string, nome: string) {
  const texto = encodeURIComponent(`Olá! Vi seu perfil no AcheiSST e gostaria de mais informações sobre os serviços de ${nome}.`)
  return `https://wa.me/55${numero.replace(/\D/g, '')}?text=${texto}`
}

function FornecedorCard({ f }: { f: Fornecedor }) {
  const Icon = CATEGORIA_ICON[f.categoria] ?? Building2
  const colorClass = CATEGORIA_COLOR[f.categoria] ?? 'bg-slate-100 text-slate-600'

  return (
    <article className={`relative bg-white rounded-2xl border flex flex-col gap-0 hover:shadow-lg transition-all duration-200 overflow-hidden ${
      f.is_sponsored
        ? 'border-amber-300 ring-1 ring-amber-200'
        : f.verificado
        ? 'border-green-200 ring-1 ring-green-100'
        : 'border-slate-200'
    }`}>
      {f.is_sponsored && (
        <span className="absolute top-3 right-3 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider z-10">
          Patrocinado
        </span>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Cabeçalho */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
            {f.logo_url
              ? <img src={f.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
              : getInitials(f.nome)
            }
          </div>
          <div className="min-w-0 flex-1 pr-16">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate">{f.nome}</h3>
              {f.verificado && (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" aria-label="Verificado" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{f.cidade}, {f.uf}</span>
            </div>
          </div>
        </div>

        {/* Categoria + plano */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
            <Icon className="w-3 h-3" />
            {f.categoria}
          </span>
          {f.plano === 'premium' && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Premium
            </span>
          )}
          {f.plano === 'pro' && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Pro
            </span>
          )}
        </div>

        {/* Descrição */}
        {f.descricao && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{f.descricao}</p>
        )}
      </div>

      {/* Ações */}
      <div className="px-5 pb-4 flex items-center gap-2">
        {f.whatsapp ? (
          <a
            href={whatsappUrl(f.whatsapp, f.nome)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        ) : f.site_url ? (
          <a
            href={f.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Site
          </a>
        ) : null}
        <a
          href={`/fornecedores/${f.slug}`}
          className="inline-flex items-center justify-center gap-1 border border-slate-200 hover:border-green-300 hover:text-green-700 text-slate-600 text-xs font-medium py-2 px-3 rounded-xl transition-colors"
        >
          Ver perfil
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  )
}

interface FornecedoresGridProps {
  fornecedores: Fornecedor[]
}

export function FornecedoresGrid({ fornecedores }: FornecedoresGridProps) {
  const { theme } = useTheme()
  const isV5 = theme === 'preview_5'
  const [categoria, setCategoria] = useState<FornecedorCategoria | 'Todos'>('Todos')
  const [uf, setUf] = useState('')
  const [search, setSearch] = useState('')

  const filtered = fornecedores.filter((f) => {
    const matchCat = categoria === 'Todos' || f.categoria === categoria
    const matchUf = !uf || f.uf === uf
    const matchSearch =
      !search ||
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.cidade.toLowerCase().includes(search.toLowerCase()) ||
      (f.descricao ?? '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchUf && matchSearch
  })

  // Patrocinados primeiro, depois verificados, depois plano, depois nome
  const sorted = [...filtered].sort((a, b) => {
    if (a.is_sponsored !== b.is_sponsored) return a.is_sponsored ? -1 : 1
    if (a.verificado !== b.verificado) return a.verificado ? -1 : 1
    const planOrder = { premium: 0, pro: 1, free: 2 }
    if (a.plano !== b.plano) return planOrder[a.plano] - planOrder[b.plano]
    return a.nome.localeCompare(b.nome)
  })

  return (
    <section className={`${isV5 ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Filtros */}
        <div className={`${isV5 ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border p-4 mb-6 flex flex-col sm:flex-row gap-3 transition-colors`}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar por nome, cidade ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isV5 ? 'border border-slate-700 bg-slate-800 text-slate-100' : 'border border-slate-200 bg-slate-50 text-slate-900'
              }`}
            />
          </div>
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className={`px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer ${
              isV5 ? 'border border-slate-700 bg-slate-800 text-slate-300' : 'border border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <option value="">Todos os estados</option>
            {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* Tabs de categoria */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist">
          {CATEGORIAS.map(({ label, value }) => (
            <button
              key={value}
              role="tab"
              aria-selected={categoria === value}
              onClick={() => setCategoria(value)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                categoria === value
                  ? isV5 ? 'bg-green-500 text-slate-950 shadow-sm shadow-green-500/25' : 'bg-green-600 text-white shadow-sm'
                  : isV5 ? 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-green-500/40 hover:text-green-400' : 'bg-white border border-slate-200 text-slate-600 hover:border-green-200 hover:text-green-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Resultado */}
        <div className="flex items-center justify-between mb-5">
          <p className={`text-sm ${isV5 ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={`font-semibold ${isV5 ? 'text-white' : 'text-slate-900'}`}>{sorted.length}</span> fornecedor{sorted.length !== 1 ? 'es' : ''} encontrado{sorted.length !== 1 ? 's' : ''}
          </p>
          {(search || uf || categoria !== 'Todos') && (
            <button
              onClick={() => { setSearch(''); setUf(''); setCategoria('Todos') }}
              className="text-xs text-green-500 hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((f) => <FornecedorCard key={f.id} f={f} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Nenhum fornecedor encontrado com esses filtros.</p>
            <button
              onClick={() => { setSearch(''); setUf(''); setCategoria('Todos') }}
              className="mt-3 text-sm text-green-600 hover:underline"
            >
              Ver todos
            </button>
          </div>
        )}

        {/* CTA cadastro */}
        <div className="mt-14 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
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
