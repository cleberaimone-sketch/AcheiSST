'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { Loader2, Save, ArrowLeft, Plus, X, CheckCircle2 } from 'lucide-react'

const ESPECIALIDADES_DISPONIVEIS = [
  'Atendimento Médico Ocupacional',
  'ASO (Atestado de Saúde Ocupacional)',
  'PCMSO',
  'PGR / PPRA',
  'Audiometria',
  'Espirometria',
  'Acuidade Visual',
  'Raio-X Tórax',
  'Eletrocardiograma',
  'Treinamentos NR',
  'Consultoria SST',
  'Ergonomia (NR-17)',
  'LTCAT',
  'Laudo de Insalubridade',
  'Laudo de Periculosidade',
  'SESMT Terceirizado',
  'Gestão de EPI',
  'Laudos Técnicos',
  'Engenharia de Segurança',
  'Higiene Ocupacional',
]

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

interface FornecedorData {
  id: string
  nome: string
  descricao: string | null
  telefone: string | null
  whatsapp: string | null
  email: string | null
  website_url: string | null
  endereco: string | null
  cidade: string
  uf: string
  especialidades: string[] | null
}

export default function EditarFornecedorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [fornecedor, setFornecedor] = useState<FornecedorData | null>(null)
  const [form, setForm] = useState<FornecedorData | null>(null)
  const [novoEspec, setNovoEspec] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/painel/login'); return }

      const { data } = await supabase
        .from('fornecedores')
        .select('id, nome, descricao, telefone, whatsapp, email, website_url, endereco, cidade, uf, especialidades')
        .eq('user_id', user.id)
        .single()

      if (!data) { router.push('/painel/fornecedor'); return }

      setFornecedor(data as FornecedorData)
      setForm(data as FornecedorData)
      setLoading(false)
    }
    load()
  }, [router])

  function handleChange(field: keyof FornecedorData, value: string) {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  function handleAddEspec() {
    if (!novoEspec || !form) return
    if (form.especialidades?.includes(novoEspec)) { setNovoEspec(''); return }
    setForm({ ...form, especialidades: [...(form.especialidades ?? []), novoEspec] })
    setNovoEspec('')
  }

  function handleRemoveEspec(esp: string) {
    if (!form) return
    setForm({ ...form, especialidades: (form.especialidades ?? []).filter((e) => e !== esp) })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setError('')
    setSaving(true)

    const supabase = createSupabaseBrowser()
    const { error: dbError } = await supabase
      .from('fornecedores')
      .update({
        descricao:    form.descricao?.trim() || null,
        telefone:     form.telefone?.trim() || null,
        whatsapp:     form.whatsapp?.replace(/\D/g, '') || null,
        email:        form.email?.trim().toLowerCase() || null,
        website_url:  form.website_url?.trim() || null,
        endereco:     form.endereco?.trim() || null,
        cidade:       form.cidade?.trim(),
        uf:           form.uf,
        especialidades: form.especialidades ?? [],
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', form.id)

    setSaving(false)

    if (dbError) {
      setError('Erro ao salvar. Tente novamente.')
      return
    }

    setSaved(true)
    setTimeout(() => { router.push('/painel/fornecedor') }, 1200)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    )
  }

  if (!form) return null

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <a href="/painel/fornecedor" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <h1 className="text-xl font-extrabold text-slate-900">Editar perfil</h1>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm font-bold text-green-800">Salvo com sucesso! Redirecionando...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">

        {/* Informações básicas (somente leitura) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dados fixos</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-500">Nome:</span> <strong className="text-slate-900">{form.nome}</strong></p>
            <p className="text-xs text-slate-400">Para alterar nome ou CNPJ, entre em contato com suporte.</p>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sobre o estabelecimento</p>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição</label>
            <textarea
              value={form.descricao ?? ''}
              onChange={(e) => handleChange('descricao', e.target.value)}
              rows={4}
              placeholder="Descreva os serviços, diferenciais e histórico do estabelecimento..."
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
            />
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contato</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { field: 'telefone' as const, label: 'Telefone', placeholder: '(11) 99999-9999' },
              { field: 'whatsapp' as const, label: 'WhatsApp', placeholder: '11999999999' },
              { field: 'email' as const, label: 'E-mail', placeholder: 'contato@empresa.com' },
              { field: 'website_url' as const, label: 'Site', placeholder: 'https://www.empresa.com' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                <input
                  type="text"
                  value={(form[field] as string) ?? ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Localização</p>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Endereço</label>
            <input
              type="text"
              value={form.endereco ?? ''}
              onChange={(e) => handleChange('endereco', e.target.value)}
              placeholder="Rua, número, bairro"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cidade</label>
              <input
                type="text"
                value={form.cidade ?? ''}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder="São Paulo"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estado</label>
              <select
                value={form.uf ?? ''}
                onChange={(e) => handleChange('uf', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              >
                <option value="">UF</option>
                {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Especialidades e serviços</p>
          <div className="flex gap-2">
            <select
              value={novoEspec}
              onChange={(e) => setNovoEspec(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            >
              <option value="">Selecionar especialidade...</option>
              {ESPECIALIDADES_DISPONIVEIS
                .filter((e) => !(form.especialidades ?? []).includes(e))
                .map((e) => <option key={e} value={e}>{e}</option>)
              }
            </select>
            <button
              type="button"
              onClick={handleAddEspec}
              disabled={!novoEspec}
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
          {(form.especialidades ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(form.especialidades ?? []).map((esp) => (
                <span
                  key={esp}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-800 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full"
                >
                  {esp}
                  <button type="button" onClick={() => handleRemoveEspec(esp)} className="text-green-500 hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || saved}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
              : saved
              ? <><CheckCircle2 className="w-4 h-4" /> Salvo!</>
              : <><Save className="w-4 h-4" /> Salvar alterações</>
            }
          </button>
          <a
            href="/painel/fornecedor"
            className="px-5 py-3 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:border-slate-300 transition-colors"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
