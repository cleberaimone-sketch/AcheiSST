'use client'

import { useState } from 'react'
import {
  Search, MapPin, Globe, CheckCircle2, MessageCircle,
  Building2, Users, ChevronRight, ArrowRight,
} from 'lucide-react'
import type { Fornecedor, Profissional } from '@/types'

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

interface Props {
  query: string
  uf: string
  fornecedores: Fornecedor[]
  profissionais: Profissional[]
}

export function BuscaResults({ query: initialQuery, uf: initialUf, fornecedores, profissionais }: Props) {
  const [q, setQ] = useState(initialQuery)
  const [uf, setUf] = useState(initialUf)
  const [tab, setTab] = useState<'todos' | 'fornecedores' | 'profissionais'>('todos')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (uf) params.set('uf', uf)
    window.location.href = `/busca?${params.toString()}`
  }

  const total = fornecedores.length + profissionais.length
  const hasResults = total > 0
  const hasQuery = initialQuery.length > 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Barra de busca */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Pesquisar profissional, produto, serviço..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm shadow-sm"
          />
        </div>
        <select
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          className="py-3.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 text-sm cursor-pointer sm:w-36 shadow-sm"
        >
          <option value="">Todo Brasil</option>
          {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm shadow-md shadow-green-600/20 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          Pesquisar <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Estado: sem query */}
      {!hasQuery && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">O que você está buscando?</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Digite um termo acima — profissional, serviço, categoria ou cidade.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['clínica', 'EPI', 'NR-35', 'médico do trabalho', 'PGR', 'eSocial'].map((s) => (
              <button
                key={s}
                onClick={() => { setQ(s); window.location.href = `/busca?q=${encodeURIComponent(s)}` }}
                className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-green-300 hover:text-green-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados */}
      {hasQuery && (
        <>
          {/* Cabeçalho do resultado */}
          <div className="mb-5">
            <h1 className="text-xl font-bold text-slate-900">
              {hasResults
                ? <>{total} resultado{total !== 1 ? 's' : ''} para <span className="text-green-600">"{initialQuery}"</span>{initialUf ? ` em ${initialUf}` : ''}</>
                : <>Nenhum resultado para <span className="text-green-600">"{initialQuery}"</span></>
              }
            </h1>
          </div>

          {/* Tabs */}
          {hasResults && (
            <div className="flex gap-2 mb-6" role="tablist">
              {[
                { value: 'todos',          label: `Todos (${total})` },
                { value: 'fornecedores',   label: `Fornecedores (${fornecedores.length})` },
                { value: 'profissionais',  label: `Profissionais (${profissionais.length})` },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={tab === value}
                  onClick={() => setTab(value as typeof tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    tab === value
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-green-200 hover:text-green-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Sem resultado */}
          {!hasResults && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-4">Tente termos diferentes ou explore nossas categorias.</p>
              <a href="/fornecedores" className="inline-flex items-center gap-1.5 text-sm text-green-600 font-semibold hover:underline">
                Ver todos os fornecedores <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Seção Fornecedores */}
          {(tab === 'todos' || tab === 'fornecedores') && fornecedores.length > 0 && (
            <div className="mb-10">
              {tab === 'todos' && (
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-green-600" />
                  <h2 className="text-base font-bold text-slate-800">Fornecedores</h2>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fornecedores.map((f) => (
                  <article key={f.id} className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {f.logo_url
                            ? <img src={f.logo_url} alt="" className="w-11 h-11 rounded-xl object-cover" />
                            : getInitials(f.nome)
                          }
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-slate-900 truncate">{f.nome}</h3>
                            {f.verificado && <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {f.cidade}, {f.uf}
                          </div>
                        </div>
                      </div>
                      <span className="self-start text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                        {f.categoria}
                      </span>
                      {f.descricao && (
                        <p className="text-xs text-slate-500 line-clamp-2">{f.descricao}</p>
                      )}
                    </div>
                    <div className="px-5 pb-4 flex gap-2">
                      {f.whatsapp && (
                        <a
                          href={whatsappUrl(f.whatsapp, f.nome)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      )}
                      <a
                        href={`/fornecedores/${f.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 border border-slate-200 hover:border-green-300 hover:text-green-700 text-slate-600 text-xs font-medium py-2 rounded-xl transition-colors"
                      >
                        Ver perfil <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Seção Profissionais */}
          {(tab === 'todos' || tab === 'profissionais') && profissionais.length > 0 && (
            <div>
              {tab === 'todos' && (
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-green-600" />
                  <h2 className="text-base font-bold text-slate-800">Profissionais</h2>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profissionais.map((p) => (
                  <article key={p.id} className="bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {p.avatar_url
                          ? <img src={p.avatar_url} alt="" className="w-11 h-11 rounded-xl object-cover" />
                          : getInitials(p.nome)
                        }
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{p.nome}</h3>
                          {p.verified && <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{p.especialidade}</p>
                        {p.cidade && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {p.cidade}, {p.uf}
                          </div>
                        )}
                      </div>
                    </div>
                    {p.bio && <p className="text-xs text-slate-500 line-clamp-2">{p.bio}</p>}
                    <a
                      href={`/profissionais#${p.id}`}
                      className="inline-flex items-center justify-center gap-1 border border-slate-200 hover:border-green-300 hover:text-green-700 text-slate-600 text-xs font-medium py-2 rounded-xl transition-colors"
                    >
                      Ver perfil <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
