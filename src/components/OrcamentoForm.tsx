'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

const UFS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
]

const PRAZOS = ['Urgente (até 48h)', 'Esta semana', 'Este mês', 'Sem prazo definido']

interface Props {
  fornecedorId: string | null
  fornecedorSlug: string | null
  profissionalId?: string | null
  profissionalNome?: string | null
}

export function OrcamentoForm({ fornecedorId, fornecedorSlug, profissionalId, profissionalNome }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [descricao, setDescricao] = useState('')
  const [uf, setUf] = useState('')
  const [cidade, setCidade] = useState('')
  const [prazo, setPrazo] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !descricao.trim() || (!email.trim() && !telefone.trim())) {
      setError('Preencha nome, descrição e pelo menos um contato (e-mail ou telefone).')
      return
    }
    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowser()

    const { data: insertedLead, error: dbError } = await supabase.from('leads').insert({
      fornecedor_id: fornecedorId ?? null,
      profissional_id: profissionalId ?? null,
      nome: nome.trim(),
      email: email.trim() || null,
      telefone: telefone.trim() || null,
      descricao: descricao.trim(),
      uf: uf || null,
      cidade: cidade.trim() || null,
      prazo: prazo || null,
      status: 'novo',
    }).select('id').single()

    if (dbError) {
      setError('Erro ao enviar solicitação. Tente novamente.')
      setLoading(false)
      return
    }

    // Incrementa métrica de lead e dispara email de notificação
    if (fornecedorId) {
      await supabase.rpc('incrementar_lead_recebido', { p_fornecedor_id: fornecedorId }).then(null, () => {})
    }
    if (insertedLead?.id) {
      fetch('/api/notify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: insertedLead.id }),
      }).catch(() => {})
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
        <h2 className="text-lg font-bold text-slate-900 mb-2">Solicitação enviada!</h2>
        <p className="text-slate-500 text-sm mb-6">
          {fornecedorSlug
            ? 'O fornecedor receberá sua solicitação e entrará em contato em breve.'
            : profissionalNome
            ? `${profissionalNome} receberá sua solicitação e entrará em contato em breve.`
            : 'Sua solicitação foi registrada.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {fornecedorSlug && (
            <a
              href={`/fornecedores/${fornecedorSlug}`}
              className="px-5 py-2.5 text-sm font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors"
            >
              Voltar ao perfil
            </a>
          )}
          <a
            href={profissionalId ? '/profissionais' : '/fornecedores'}
            className="px-5 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            {profissionalId ? 'Ver mais profissionais' : 'Ver mais fornecedores'}
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Nome */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome completo"
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
        />
      </div>

      {/* Contato */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone / WhatsApp</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(41) 99999-0000"
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>
      </div>

      {/* Localização */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Estado</label>
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 cursor-pointer"
          >
            <option value="">Selecione</option>
            {UFS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cidade</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Sua cidade"
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Descreva sua necessidade <span className="text-red-500">*</span>
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Preciso de exames admissionais para 30 funcionários em Curitiba. Início previsto em maio."
          rows={4}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none"
        />
      </div>

      {/* Prazo */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prazo</label>
        <select
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer"
        >
          <option value="">Selecione o prazo</option>
          {PRAZOS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-green-600/20"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar solicitação'}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Seus dados serão compartilhados apenas com o fornecedor solicitado. Sem spam.
      </p>
    </form>
  )
}
