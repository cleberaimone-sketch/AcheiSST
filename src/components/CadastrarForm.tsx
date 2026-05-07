'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, Building2, MapPin, Phone, LayoutDashboard } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const CATEGORIAS = [
  { value: 'clinica',       label: 'Clínica Médica / Medicina Ocupacional' },
  { value: 'consultoria',   label: 'Consultoria SST / Engenharia de Segurança' },
  { value: 'epi',           label: 'EPI & Equipamentos de Proteção' },
  { value: 'treinamento',   label: 'Treinamentos e Capacitações NR' },
  { value: 'software',      label: 'Software de Gestão SST' },
  { value: 'laboratorio',   label: 'Laboratório de Análises' },
  { value: 'outros',        label: 'Outros' },
]

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const STEPS = [
  { id: 1, label: 'Negócio',   icon: Building2 },
  { id: 2, label: 'Localização', icon: MapPin },
  { id: 3, label: 'Contato',   icon: Phone },
]

export function CadastrarForm() {
  const router = useRouter()
  const [user, setUser]           = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null
      setUser(currentUser)
      setAuthLoading(false)
      if (!currentUser) {
        router.replace('/auth?redirect=/cadastrar')
      }
    })
  }, [router])

  const [step, setStep] = useState(1)
  const [nome, setNome]             = useState('')
  const [categoria, setCategoria]   = useState('')
  const [descricao, setDescricao]   = useState('')
  const [uf, setUf]                 = useState('')
  const [cidade, setCidade]         = useState('')
  const [whatsapp, setWhatsapp]     = useState('')
  const [email, setEmail]           = useState('')
  const [siteUrl, setSiteUrl]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState('')

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    )
  }

  if (!user) return null

  async function handleSubmit() {
    if (!nome.trim() || !categoria || !uf || !cidade.trim()) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    if (!whatsapp.trim() && !email.trim()) {
      setError('Informe pelo menos WhatsApp ou e-mail de contato.')
      return
    }
    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()
    const baseSlug = slugify(`${nome}-${cidade}-${uf}`)
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    const { error: dbError } = await supabase.from('empresas').insert({
      nome: nome.trim(),
      segmento: categoria,
      categoria,
      descricao: descricao.trim() || null,
      whatsapp: whatsapp.trim() || null,
      site_url: siteUrl.trim() || null,
      email: email.trim() || null,
      cidade: cidade.trim(),
      uf,
      slug,
      plano: 'free',
      verified: false,
      is_sponsored: false,
      rank_score: 0,
      user_id: user!.id,
    })

    if (dbError) {
      setError('Erro ao cadastrar. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  function nextStep() {
    setError('')
    if (step === 1) {
      if (!nome.trim() || !categoria) { setError('Preencha nome e categoria.'); return }
    }
    if (step === 2) {
      if (!uf || !cidade.trim()) { setError('Preencha estado e cidade.'); return }
    }
    setStep((s) => s + 1)
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Cadastro enviado!</h2>
        <p className="text-slate-500 text-sm mb-1">
          Seu perfil será revisado pela equipe AcheiSST e publicado em breve.
        </p>
        <p className="text-xs text-slate-400 mb-7">Você receberá um e-mail quando estiver ativo.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/painel"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Ir para o painel
          </Link>
          <Link
            href="/fornecedores"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Ver fornecedores
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-7">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 ${active ? 'text-green-700' : done ? 'text-green-500' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${active ? 'bg-green-600 text-white' : done ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {done ? '✓' : s.id}
                </div>
                <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full ${step > s.id ? 'bg-green-400' : 'bg-slate-100'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Sobre o negócio */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nome da empresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: ClinicaSST Curitiba"
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer"
            >
              <option value="">Selecione a categoria</option>
              {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Descrição dos serviços <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva brevemente o que sua empresa oferece..."
              rows={3}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 2: Localização */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">Onde sua empresa está localizada?</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer"
              >
                <option value="">UF</option>
                {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Cidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Sua cidade"
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Contato */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">Como clientes entrarão em contato com você?</p>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(41) 99999-0000"
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail de contato</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@empresa.com"
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Site <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://suaempresa.com.br"
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <p className="text-xs text-slate-400">Informe pelo menos WhatsApp ou e-mail.</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => { setError(''); setStep((s) => s - 1) }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Próximo <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-green-600/20"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <>Cadastrar gratuitamente <CheckCircle2 className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  )
}
