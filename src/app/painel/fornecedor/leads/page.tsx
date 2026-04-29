import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import { ArrowLeft, MapPin, Clock, Phone, Mail } from 'lucide-react'
import { LeadStatusButton } from './LeadStatusButton'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    novo:       { label: 'Novo',       cls: 'bg-red-100 text-red-700 border-red-200' },
    visto:      { label: 'Visto',      cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    respondido: { label: 'Respondido', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    fechado:    { label: 'Fechado',    cls: 'bg-green-100 text-green-700 border-green-200' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  )
}

export const metadata = {
  title: 'Leads Recebidos — AcheiSST',
}

export default async function LeadsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/painel/login')

  const { data: fornecedor } = await supabase
    .from('fornecedores')
    .select('id, nome')
    .eq('user_id', user.id)
    .single()

  if (!fornecedor) redirect('/painel/fornecedor')

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('fornecedor_id', fornecedor.id)
    .order('created_at', { ascending: false })

  const grouped = {
    novo:       (leads ?? []).filter((l) => l.status === 'novo'),
    visto:      (leads ?? []).filter((l) => l.status === 'visto'),
    respondido: (leads ?? []).filter((l) => l.status === 'respondido'),
    fechado:    (leads ?? []).filter((l) => l.status === 'fechado'),
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <a href="/painel/fornecedor" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Leads recebidos</h1>
          <p className="text-xs text-slate-500">{(leads ?? []).length} solicitação{(leads?.length ?? 0) !== 1 ? 'ões' : ''} no total</p>
        </div>
      </div>

      {/* Contadores rápidos */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Novos',       count: grouped.novo.length,       cls: 'text-red-600',   bg: 'bg-red-50 border-red-200' },
          { label: 'Vistos',      count: grouped.visto.length,      cls: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Respondidos', count: grouped.respondido.length, cls: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200' },
          { label: 'Fechados',    count: grouped.fechado.length,    cls: 'text-green-600', bg: 'bg-green-50 border-green-200' },
        ].map(({ label, count, cls, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 text-center ${bg}`}>
            <p className={`text-2xl font-black ${cls}`}>{count}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Lista de leads */}
      {(leads ?? []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-sm">Nenhum lead recebido ainda.</p>
          <p className="text-xs text-slate-300 mt-1">
            Quando alguém solicitar orçamento no seu perfil, aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(leads ?? []).map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-sm shrink-0">
                    {(lead.nome as string).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{lead.nome}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {formatDate(lead.created_at)}
                      {lead.prazo && <> · Prazo: <strong>{lead.prazo}</strong></>}
                    </p>
                  </div>
                </div>
                {statusBadge(lead.status)}
              </div>

              {/* Descrição */}
              {lead.descricao && (
                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3 mb-3 leading-relaxed">
                  {lead.descricao}
                </p>
              )}

              {/* Contato + localização */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-4">
                {lead.telefone && (
                  <a href={`tel:${lead.telefone}`} className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {lead.telefone}
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {lead.email}
                  </a>
                )}
                {lead.cidade && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {lead.cidade}, {lead.uf}
                  </span>
                )}
              </div>

              {/* Ações de status */}
              <LeadStatusButton leadId={lead.id} currentStatus={lead.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
