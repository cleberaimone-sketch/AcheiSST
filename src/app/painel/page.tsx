'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import {
  User, Phone, MapPin, Briefcase, BookOpen, Shield,
  LogOut, Save, Loader2, CheckCircle2, Plus, X, Camera,
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const OCUPACOES = [
  'Técnico em Segurança do Trabalho',
  'Engenheiro de Segurança do Trabalho',
  'Médico do Trabalho',
  'Enfermeiro do Trabalho',
  'Ergonomista',
  'Consultor SST',
  'Auditor de Segurança',
  'Especialista em SST',
  'Higienista Ocupacional',
  'Outro',
]

const SERVICOS_SST = [
  'PCMSO', 'PGR', 'LTCAT', 'PPP',
  'Laudo de Insalubridade', 'Laudo de Periculosidade',
  'Treinamentos NR', 'Auditoria de SST', 'Consultoria SST',
  'Gestão de EPI', 'Atendimento Médico Ocupacional',
  'Exames Ocupacionais', 'CIPA', 'DDS',
  'Investigação de Acidentes', 'Mapeamento de Riscos',
  'Ergonomia', 'Higiene Ocupacional', 'Elaboração de Procedimentos',
]

const NRS = [
  'NR1','NR4','NR5','NR6','NR7','NR8','NR9','NR10',
  'NR11','NR12','NR13','NR14','NR15','NR16','NR17','NR18',
  'NR19','NR20','NR21','NR22','NR23','NR24','NR25','NR26',
  'NR28','NR29','NR30','NR31','NR32','NR33','NR34','NR35','NR36',
]

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

type Section = 'perfil' | 'contato' | 'localizacao' | 'servicos' | 'nrs'

interface Profile {
  id: string
  display_name: string | null
  about: string | null
  avatar_url: string | null
  ocupacao: string | null
  registro_prof: string | null
  anos_experiencia: number | null
  public_email: string | null
  phone: string | null
  whatsapp: string | null
  linkedin_url: string | null
  website: string | null
  city: string | null
  state: string | null
  atende_remoto: boolean
  especialidades: string[]
  nrs_atendidas: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold text-slate-900 mb-6">{children}</h2>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PainelPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [section, setSection] = useState<Section>('perfil')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/painel/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    const supabase = createSupabaseBrowser()
    supabase
      .from('profiles')
      .select('id,display_name,about,avatar_url,ocupacao,registro_prof,anos_experiencia,public_email,phone,whatsapp,linkedin_url,website,city,state,atende_remoto,especialidades,nrs_atendidas')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const p = {
            ...data,
            especialidades: data.especialidades ?? [],
            nrs_atendidas: data.nrs_atendidas ?? [],
            atende_remoto: data.atende_remoto ?? false,
          } as Profile
          setProfile(p)
          setForm(p)
        }
        setLoadingProfile(false)
      })
  }, [user])

  async function handleSave() {
    if (!form || !profile) return
    setSaving(true)
    const supabase = createSupabaseBrowser()
    await supabase.from('profiles').update({
      display_name: form.display_name,
      about: form.about,
      ocupacao: form.ocupacao,
      registro_prof: form.registro_prof,
      anos_experiencia: form.anos_experiencia,
      public_email: form.public_email,
      phone: form.phone,
      whatsapp: form.whatsapp,
      linkedin_url: form.linkedin_url,
      website: form.website,
      city: form.city,
      state: form.state,
      atende_remoto: form.atende_remoto,
      especialidades: form.especialidades,
      nrs_atendidas: form.nrs_atendidas,
    }).eq('id', profile.id)
    setProfile(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function set(key: keyof Profile, value: unknown) {
    setForm(f => f ? { ...f, [key]: value } : f)
  }

  function toggleArray(key: 'especialidades' | 'nrs_atendidas', value: string) {
    setForm(f => {
      if (!f) return f
      const arr = f[key]
      return { ...f, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'perfil',      label: 'Perfil',       icon: <User className="w-4 h-4" /> },
    { id: 'contato',     label: 'Contato',       icon: <Phone className="w-4 h-4" /> },
    { id: 'localizacao', label: 'Localização',   icon: <MapPin className="w-4 h-4" /> },
    { id: 'servicos',    label: 'Serviços SST',  icon: <Briefcase className="w-4 h-4" /> },
    { id: 'nrs',         label: 'NRs',           icon: <BookOpen className="w-4 h-4" /> },
  ]

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo-horizontal.png" alt="AcheiSST" className="h-9 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={() => signOut().then(() => router.push('/'))}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 py-8 flex gap-6 flex-1">

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sticky top-24">

            {/* Avatar + nome */}
            <div className="flex flex-col items-center gap-2 p-4 pb-5 border-b border-slate-100 mb-2">
              <div className="relative">
                {form.avatar_url ? (
                  <img src={form.avatar_url} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-green-600" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {form.display_name || 'Seu nome'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {form.ocupacao || 'Profissional SST'}
                </p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-0.5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                    section === item.id
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-3 pt-3 border-t border-slate-100">
              <a
                href={`/profissionais`}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-green-600 transition-colors rounded-xl hover:bg-green-50"
              >
                <Shield className="w-3.5 h-3.5" />
                Ver meu perfil público
              </a>
            </div>
          </div>
        </aside>

        {/* Mobile section tabs */}
        <div className="md:hidden w-full mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  section === item.id ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">

            {/* ── PERFIL ── */}
            {section === 'perfil' && (
              <div className="space-y-5">
                <SectionTitle>Perfil profissional</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nome completo">
                    <input className={inputCls} value={form.display_name ?? ''} onChange={e => set('display_name', e.target.value)} placeholder="Seu nome" />
                  </Field>
                  <Field label="Ocupação">
                    <select className={inputCls} value={form.ocupacao ?? ''} onChange={e => set('ocupacao', e.target.value)}>
                      <option value="">Selecione</option>
                      {OCUPACOES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                  <Field label="Registro profissional (CRT, CREA, CRM...)">
                    <input className={inputCls} value={form.registro_prof ?? ''} onChange={e => set('registro_prof', e.target.value)} placeholder="Ex: CRT-12345/SP" />
                  </Field>
                  <Field label="Anos de experiência">
                    <input className={inputCls} type="number" min={0} max={60} value={form.anos_experiencia ?? ''} onChange={e => set('anos_experiencia', e.target.value ? Number(e.target.value) : null)} placeholder="Ex: 10" />
                  </Field>
                </div>
                <Field label="Apresentação / Bio">
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={4}
                    value={form.about ?? ''}
                    onChange={e => set('about', e.target.value)}
                    placeholder="Fale um pouco sobre sua experiência, áreas de atuação e diferenciais..."
                  />
                </Field>
              </div>
            )}

            {/* ── CONTATO ── */}
            {section === 'contato' && (
              <div className="space-y-5">
                <SectionTitle>Informações de contato</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="E-mail público">
                    <input className={inputCls} type="email" value={form.public_email ?? ''} onChange={e => set('public_email', e.target.value)} placeholder="contato@email.com" />
                  </Field>
                  <Field label="Telefone">
                    <input className={inputCls} value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} placeholder="(11) 99999-9999" />
                  </Field>
                  <Field label="WhatsApp">
                    <input className={inputCls} value={form.whatsapp ?? ''} onChange={e => set('whatsapp', e.target.value)} placeholder="(11) 99999-9999" />
                  </Field>
                  <Field label="LinkedIn">
                    <input className={inputCls} value={form.linkedin_url ?? ''} onChange={e => set('linkedin_url', e.target.value)} placeholder="linkedin.com/in/seuperfil" />
                  </Field>
                  <Field label="Site pessoal">
                    <input className={inputCls} value={form.website ?? ''} onChange={e => set('website', e.target.value)} placeholder="https://seusite.com.br" />
                  </Field>
                </div>
              </div>
            )}

            {/* ── LOCALIZAÇÃO ── */}
            {section === 'localizacao' && (
              <div className="space-y-5">
                <SectionTitle>Localização e atendimento</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Cidade">
                    <input className={inputCls} value={form.city ?? ''} onChange={e => set('city', e.target.value)} placeholder="São Paulo" />
                  </Field>
                  <Field label="Estado (UF)">
                    <select className={inputCls} value={form.state ?? ''} onChange={e => set('state', e.target.value)}>
                      <option value="">Selecione</option>
                      {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </Field>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={form.atende_remoto}
                    onChange={e => set('atende_remoto', e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Atendo remotamente</p>
                    <p className="text-xs text-slate-400">Seu perfil aparecerá para empresas de todo o Brasil</p>
                  </div>
                </label>
              </div>
            )}

            {/* ── SERVIÇOS SST ── */}
            {section === 'servicos' && (
              <div className="space-y-5">
                <SectionTitle>Serviços SST que você oferece</SectionTitle>
                <p className="text-sm text-slate-500 -mt-3 mb-4">Selecione todos que se aplicam ao seu trabalho.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICOS_SST.map(s => {
                    const active = form.especialidades.includes(s)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleArray('especialidades', s)}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors border ${
                          active
                            ? 'bg-green-50 border-green-300 text-green-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {active
                          ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          : <Plus className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        }
                        {s}
                      </button>
                    )
                  })}
                </div>
                {form.especialidades.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Selecionados ({form.especialidades.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {form.especialidades.map(s => (
                        <span key={s} className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {s}
                          <button onClick={() => toggleArray('especialidades', s)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── NRs ── */}
            {section === 'nrs' && (
              <div className="space-y-5">
                <SectionTitle>Normas Regulamentadoras (NRs)</SectionTitle>
                <p className="text-sm text-slate-500 -mt-3 mb-4">Marque as NRs em que você tem domínio ou certificação.</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {NRS.map(nr => {
                    const active = form.nrs_atendidas.includes(nr)
                    return (
                      <button
                        key={nr}
                        type="button"
                        onClick={() => toggleArray('nrs_atendidas', nr)}
                        className={`py-2.5 rounded-xl text-sm font-bold transition-colors border ${
                          active
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-green-400 hover:text-green-600'
                        }`}
                      >
                        {nr}
                      </button>
                    )
                  })}
                </div>
                {form.nrs_atendidas.length > 0 && (
                  <p className="text-xs text-slate-400 pt-2">
                    {form.nrs_atendidas.length} NR{form.nrs_atendidas.length > 1 ? 's' : ''} selecionada{form.nrs_atendidas.length > 1 ? 's' : ''}: {form.nrs_atendidas.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Save button */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Salvo!
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
