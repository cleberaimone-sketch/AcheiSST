import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import {
  Eye, MessageCircle, ClipboardList, CheckCircle2,
  MapPin, ArrowRight, PencilLine, ExternalLink, Clock,
  AlertCircle, Building2,
} from 'lucide-react'

function mapCategoriaNome(cat: string) {
  const c = (cat ?? '').toLowerCase()
  if (c === 'clinica') return 'Clínica Médica Ocupacional'
  if (c === 'loja' || c === 'epi') return 'EPI & Equipamentos'
  if (c === 'software') return 'Software SST'
  if (c === 'treinamento') return 'Treinamento'
  if (c === 'consultoria') return 'Consultoria SST'
  if (c === 'laboratorio') return 'Laboratório'
  if (c === 'engenharia') return 'Engenharia de Segurança'
  return 'Fornecedor SST'
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    novo:       { label: 'Novo',       cls: 'bg-red-100 text-red-700' },
    visto:      { label: 'Visto',      cls: 'bg-amber-100 text-amber-700' },
    respondido: { label: 'Respondido', cls: 'bg-blue-100 text-blue-700' },
    fechado:    { label: 'Fechado',    cls: 'bg-green-100 text-green-700' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export const metadata = {
  title: 'Painel do Fornecedor — AcheiSST',
}

export default async function PainelFornecedorPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/painel/login')

  // Busca fornecedor vinculado ao usuário
  const { data: fornecedor } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Sem perfil vinculado
  if (!fornecedor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 mb-2">
          Nenhum estabelecimento vinculado
        </h1>
        <p className="text-slate-500 text-sm max-w-md mb-6">
          Sua conta ainda não está associada a um perfil de fornecedor no AcheiSST.
          Entre em contato para vincularmos seu estabelecimento.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:contato@acheisst.com.br?subject=Vincular perfil de fornecedor"
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Solicitar vinculação
          </a>
          <a
            href="/fornecedores"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:border-green-300 transition-colors"
          >
            Ver fornecedores
          </a>
        </div>
      </div>
    )
  }

  // Métricas dos últimos 30 dias
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const dateFilter = thirtyDaysAgo.toISOString().split('T')[0]

  const [{ data: metricas }, { data: leads }] = await Promise.all([
    supabase
      .from('metricas')
      .select('profile_views, whatsapp_clicks, leads_received')
      .eq('fornecedor_id', fornecedor.id)
      .gte('data', dateFilter),
    supabase
      .from('leads')
      .select('*')
      .eq('fornecedor_id', fornecedor.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const totals = (metricas ?? []).reduce(
    (acc, m) => ({
      views:    acc.views    + (m.profile_views    ?? 0),
      whatsapp: acc.whatsapp + (m.whatsapp_clicks  ?? 0),
      leads:    acc.leads    + (m.leads_received   ?? 0),
    }),
    { views: 0, whatsapp: 0, leads: 0 }
  )

  const novosLeads = (leads ?? []).filter((l) => l.status === 'novo').length

  return (
    <div className="space-y-6">

      {/* Cabeçalho do perfil */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {fornecedor.logo_url ? (
              <img
                src={fornecedor.logo_url}
                alt={fornecedor.nome}
                className="w-14 h-14 rounded-xl object-cover border border-slate-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-black text-xl">
                {fornecedor.nome.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-extrabold text-slate-900">{fornecedor.nome}</h1>
                {fornecedor.verified && (
                  <CheckCircle2 className="w-4.5 h-4.5 text-green-500 shrink-0" />
                )}
              </div>
              <p className="text-sm text-green-700 font-medium">
                {mapCategoriaNome(fornecedor.categoria ?? '')}
              </p>
              {fornecedor.cidade && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {fornecedor.cidade}, {fornecedor.uf}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href="/painel/fornecedor/editar"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 border border-slate-200 px-3 py-2 rounded-xl hover:border-green-300 hover:text-green-700 transition-colors"
            >
              <PencilLine className="w-3.5 h-3.5" /> Editar perfil
            </a>
            {fornecedor.slug && (
              <a
                href={`/fornecedores/${fornecedor.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 border border-green-200 bg-green-50 px-3 py-2 rounded-xl hover:bg-green-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ver perfil público
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Aviso de leads novos */}
      {novosLeads > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">
              Você tem {novosLeads} novo{novosLeads > 1 ? 's' : ''} lead{novosLeads > 1 ? 's' : ''} aguardando resposta.
            </p>
          </div>
          <a
            href="/painel/fornecedor/leads"
            className="text-xs font-bold text-amber-700 hover:underline whitespace-nowrap"
          >
            Ver agora →
          </a>
        </div>
      )}

      {/* Métricas — últimos 30 dias */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Últimos 30 dias
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <Eye className="w-5 h-5 text-slate-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-slate-900">{totals.views}</p>
            <p className="text-xs text-slate-500 mt-0.5">Visualizações</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <MessageCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-slate-900">{totals.whatsapp}</p>
            <p className="text-xs text-slate-500 mt-0.5">Cliques WhatsApp</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <ClipboardList className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-slate-900">{totals.leads}</p>
            <p className="text-xs text-slate-500 mt-0.5">Leads recebidos</p>
          </div>
        </div>
      </div>

      {/* Últimos leads */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900">Últimos leads recebidos</h2>
          <a
            href="/painel/fornecedor/leads"
            className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {!leads || leads.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardList className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Nenhum lead recebido ainda.</p>
            <p className="text-xs text-slate-300 mt-1">
              Leads aparecerão aqui quando alguém solicitar orçamento no seu perfil.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {leads.map((lead) => (
              <div key={lead.id} className="py-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0 mt-0.5">
                  {(lead.nome as string).slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-900 truncate">{lead.nome}</p>
                    {statusBadge(lead.status)}
                  </div>
                  {lead.descricao && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">{lead.descricao}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                    {lead.telefone && <span>{lead.telefone}</span>}
                    {lead.cidade && <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{lead.cidade}, {lead.uf}</span>}
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />{formatDate(lead.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dicas rápidas */}
      {!fornecedor.descricao && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900 mb-0.5">Complete seu perfil para aparecer mais</p>
            <p className="text-xs text-blue-700">
              Perfis com descrição e especialidades recebem até 3x mais visualizações.{' '}
              <a href="/painel/fornecedor/editar" className="font-bold underline">Editar agora</a>
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
