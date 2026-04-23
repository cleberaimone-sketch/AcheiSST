'use client'

import { useState } from 'react'
import { Search, MapPin, Filter, Award, UserCircle, CheckCircle2, Mail, Phone, Linkedin, Star } from 'lucide-react'
import type { Profissional } from '@/types'
import { useTheme } from '@/components/ThemeProvider'

const ESPECIALIDADES = [
  'Todos',
  'Técnico de Segurança do Trabalho',
  'Engenheiro de Segurança',
  'Médico do Trabalho',
  'Enfermeiro do Trabalho',
  'Fisioterapeuta do Trabalho',
  'Higienista Ocupacional',
  'Perito de SST',
]

const ESPECIALIDADE_TIPOS = [
  'Todos',
  'Perito',
  'Professor',
]

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

interface Props {
  profissionais: Profissional[]
}

export function ProfissionaisClient({ profissionais }: Props) {
  const { theme } = useTheme()
  const isV5 = theme === 'preview_5'
  const [search, setSearch] = useState('')
  const [uf, setUf] = useState('Todos')
  const [cidade, setCidade] = useState('Todos')
  const [especialidade, setEspecialidade] = useState('Todos')
  const [especialidadeTipo, setEspecialidadeTipo] = useState('Todos')

  const cidadesDisponiveis = uf === 'Todos'
    ? []
    : [...new Set(profissionais.filter(p => p.uf === uf && p.cidade).map(p => p.cidade as string))].sort()

  const filtered = profissionais.filter((p) => {
    if (uf !== 'Todos' && p.uf !== uf) return false
    if (cidade !== 'Todos' && p.cidade !== cidade) return false
    if (especialidade !== 'Todos' && p.especialidade !== especialidade) return false
    if (especialidadeTipo !== 'Todos' && p.especialidade_tipo !== especialidadeTipo) return false
    if (search.trim()) {
      const t = search.toLowerCase()
      const searchableText = (
        p.nome.toLowerCase() + ' ' +
        p.especialidade.toLowerCase() + ' ' +
        (p.bio ?? '').toLowerCase() +
        (p.registro_profissional ?? '').toLowerCase()
      )
      if (!searchableText.includes(t)) return false
    }
    return true
  })

  const selectCls = isV5
    ? 'w-full text-sm border border-slate-700 rounded-xl px-3 py-2 bg-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500'
    : 'w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500'
  const labelCls = isV5 ? 'block text-sm font-semibold text-slate-400 mb-2' : 'block text-sm font-semibold text-slate-700 mb-2'

  return (
    <section className={`${isV5 ? 'bg-slate-950' : 'bg-slate-50'} min-h-screen transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className={`${isV5 ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 rounded-2xl border shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto transition-colors`}>
            <div className={`flex items-center gap-2 font-bold mb-6 pb-4 border-b ${isV5 ? 'text-white border-slate-700' : 'text-slate-800 border-slate-100'}`}>
              <Filter className="w-5 h-5" />
              Filtros
            </div>

            <div className="mb-6">
              <label className={labelCls}>Estado (UF)</label>
              <select
                value={uf}
                onChange={(e) => { setUf(e.target.value); setCidade('Todos') }}
                className={selectCls}
              >
                <option value="Todos">Todos os estados</option>
                {UF_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            {cidadesDisponiveis.length > 0 && (
              <div className="mb-6">
                <label className={labelCls}>Cidade</label>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className={selectCls}
                >
                  <option value="Todos">Todas as cidades</option>
                  {cidadesDisponiveis.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className={labelCls}>Especialidade</label>
              <select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                className={selectCls}
              >
                {ESPECIALIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className={labelCls}>Tipo de Especialista</label>
              <select
                value={especialidadeTipo}
                onChange={(e) => setEspecialidadeTipo(e.target.value)}
                className={selectCls}
              >
                {ESPECIALIDADE_TIPOS.map((et) => <option key={et} value={et}>{et}</option>)}
              </select>
            </div>

            <button
              onClick={() => { setUf('Todos'); setEspecialidade('Todos'); setEspecialidadeTipo('Todos'); setSearch('') }}
              className="w-full text-sm text-slate-400 hover:text-green-500 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar por nome, especialidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 text-sm rounded-2xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isV5 ? 'border border-slate-700 bg-slate-800 text-slate-100' : 'border border-slate-300 bg-white text-slate-900'
              }`}
            />
          </div>

          <div className={`text-sm mb-5 font-medium ${isV5 ? 'text-slate-400' : 'text-slate-500'}`}>
            {filtered.length} profissional{filtered.length !== 1 ? 'is' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </div>

          {filtered.length === 0 ? (
            <div className={`${isV5 ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-3xl p-12 text-center border`}>
              <h3 className={`text-xl font-bold mb-2 ${isV5 ? 'text-white' : 'text-slate-800'}`}>Nenhum profissional encontrado</h3>
              <p className="text-slate-500">Tente ajustar os filtros ou ampliar a busca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filtered.map((prof) => (
                <ProfissionalCard key={prof.id} prof={prof} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProfissionalCard({ prof }: { prof: Profissional }) {
  return (
    <article className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-4 hover:shadow-lg hover:shadow-slate-200 transition-all duration-300 group">
      <div className="flex gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
          {prof.foto_url
            ? <img src={prof.foto_url} alt={prof.nome} className="w-full h-full rounded-2xl object-cover" />
            : <UserCircle className="w-8 h-8 text-white" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">{prof.nome}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Award className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">{prof.especialidade}</span>
                {prof.especialidade_tipo && (
                  <span className="text-xs text-slate-500">({prof.especialidade_tipo})</span>
                )}
              </div>
            </div>
            {prof.verified && (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" aria-label="Perfil verificado" />
            )}
          </div>

          <div className="flex flex-col gap-1 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{prof.cidade ? `${prof.cidade}, ` : ''}{prof.uf}</span>
            </div>
            {prof.registro_profissional && (
              <div className="text-slate-600 font-medium">{prof.registro_profissional}</div>
            )}
            {prof.experiencia_anos && (
              <div className="text-slate-600">{prof.experiencia_anos} anos de experiência</div>
            )}
            {prof.avaliacao && (
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-slate-700">{prof.avaliacao}</span>
                <span className="text-slate-400">({prof.num_avaliacoes})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {prof.bio && (
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{prof.bio}</p>
      )}

      {prof.nrs_expertise && prof.nrs_expertise.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {prof.nrs_expertise.slice(0, 4).map((nr) => (
            <span key={nr} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
              {nr}
            </span>
          ))}
          {prof.nrs_expertise.length > 4 && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
              +{prof.nrs_expertise.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
        {prof.whatsapp && (
          <a href={`https://wa.me/${prof.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-green-700 transition-colors">
            <Phone className="w-3.5 h-3.5" /> WhatsApp
          </a>
        )}
        {prof.email && (
          <a href={`mailto:${prof.email}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-green-700 transition-colors">
            <Mail className="w-3.5 h-3.5" /> E-mail
          </a>
        )}
        {prof.telefone && (
          <a href={`tel:${prof.telefone}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-green-700 transition-colors">
            <Phone className="w-3.5 h-3.5" /> {prof.telefone}
          </a>
        )}
        {prof.linkedin_url && (
          <a href={prof.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-green-700 transition-colors">
            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
          </a>
        )}
      </div>
    </article>
  )
}
