'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const CATEGORIAS = [
  'EPI & Equipamentos',
  'Clínicas Médicas',
  'Consultorias SST',
  'Treinamentos',
  'Softwares SST',
  'Laboratórios',
  'Engenharia de Segurança',
  'Outros',
]

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function CadastrarForm() {
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState('')
  const [descricao, setDescricao] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [email, setEmail] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !categoria || !uf || !cidade.trim()) {
      setError('Preencha nome, categoria, estado e cidade.')
      return
    }
    if (!whatsapp.trim() && !email.trim()) {
      setError('Informe pelo menos WhatsApp ou e-mail de contato.')
      return
    }
    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()

    // Gera slug único
    const baseSlug = slugify(`${nome}-${cidade}-${uf}`)
    const timestamp = Date.now().toString(36)
    const slug = `${baseSlug}-${timestamp}`

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
    })

    if (dbError) {
      setError('Erro ao cadastrar. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Cadastro enviado!</h2>
        <p className="text-slate-500 text-sm mb-2">
          Seu perfil será revisado pela equipe AcheiSST e publicado em breve.
        </p>
        <p className="text-xs text-slate-400 mb-6">Você receberá um e-mail de confirmação quando estiver ativo.</p>
        <a
          href="/fornecedores"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors"
        >
          Ver fornecedores
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nome da empresa <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: ClinicaSST Curitiba"
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
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
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição dos serviços</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva brevemente o que sua empresa oferece..."
          rows={3}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
        />
      </div>

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
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp</label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="(41) 99999-0000"
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@empresa.com"
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Site (opcional)</label>
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://suaempresa.com.br"
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-green-600/20 mt-1"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Cadastrar gratuitamente'}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Ao cadastrar, você concorda com os termos de uso. Seu perfil será revisado antes de ser publicado.
      </p>
    </form>
  )
}
