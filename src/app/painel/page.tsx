import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import {
  Eye, MessageCircle, FileText, CheckCircle2,
  Clock, XCircle, ExternalLink, Building2,
} from 'lucide-react'

function statusBadge(status: string) {
  if (status === 'novo') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
      <Clock className="w-3 h-3" /> Novo
    </span>
  )
  if (status === 'em_contato') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
      <MessageCircle className="w-3 h-3" /> Em contato
    </span>
  )
  if (status === 'fechado') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-navy-700 border border-green-100">
      <CheckCircle2 className="w-3 h-3" /> Fechado
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
      <XCircle className="w-3 h-3" /> {status}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function PainelPage() {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/painel/login')

  // Busca empresa pelo email do usuário logado
  const { data: empresa } = await supabase
    .from('empresas')
    .select('id, nome, segmento, categoria, cidade, uf, slug, verified, plano')
    .eq('email', user.email!)
    .single()

  // Leads recebidos
  const { data: leads } = empresa
    ? await supabase
        .from('leads')
        .select('id, nome, email, telefone, descricao, cidade, uf, prazo, status, created_at')
        .eq('fornecedor_id', empresa.id)
        .order('created_at', { ascending: false })
        .limit(50)
    : { data: [] }

  // Métricas agregadas
  const { data: metricas } = empresa
    ? await supabase
        .from('metricas')
        .select('profile_views, whatsapp_clicks, leads_received')
        .eq('fornecedor_id', empresa.id)
    : { data: [] }

  const totalViews = metricas?.reduce((s, m) => s + (m.profile_views ?? 0), 0) ?? 0
  const totalWhatsapp = metricas?.reduce((s, m) => s + (m.whatsapp_clicks ?? 0), 0) ?? 0
  const totalLeads = leads?.length ?? 0
  const leadsNovos = leads?.filter((l) => l.status === 'novo').length ?? 0

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {empresa ? `Olá, ${empresa.nome.split(' ')[0]}` : 'Painel do Fornecedor'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{user.email}</p>
        </div>
        {empresa && (
          <a
            href={`/fornecedores/${empresa.slug ?? empresa.id}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 border border-navy-200 rounded-xl px-4 py-2 hover:bg-navy-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Ver meu perfil
          </a>
        )}
      </div>

      {/* Sem empresa cadastrada */}
      {!empresa && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <Building2 className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 mb-1">Empresa não encontrada</h2>
          <p className="text-slate-500 text-sm mb-4">
            Nenhuma empresa cadastrada com o e-mail <strong>{user.email}</strong>.
          </p>
          <a
            href="/cadastrar"
            className="inline-block bg-navy-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-navy-700 transition-colors"
          >
            Cadastrar minha empresa
          </a>
        </div>
      )}

      {empresa && (
        <>
          {/* Cards de métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Visualizações</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{totalViews.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-400 mt-1">do seu perfil</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">WhatsApp</span>
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-navy-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{totalWhatsapp.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-400 mt-1">cliques no botão</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Leads totais</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{totalLeads}</p>
              <p className="text-xs text-slate-400 mt-1">orçamentos recebidos</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Novos</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{leadsNovos}</p>
              <p className="text-xs text-slate-400 mt-1">aguardando retorno</p>
            </div>
          </div>

          {/* Tabela de leads */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Solicitações de orçamento</h2>
              {leadsNovos > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {leadsNovos} novo{leadsNovos > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {!leads || leads.length === 0 ? (
              <div className="text-center py-14 px-6">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-medium">Nenhum lead recebido ainda</p>
                <p className="text-slate-400 text-xs mt-1">
                  Quando alguém solicitar orçamento pelo seu perfil, aparecerá aqui.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Solicitante</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Contato</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Localização</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Prazo</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{lead.nome}</p>
                          {lead.descricao && (
                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-1 max-w-[200px]">
                              {lead.descricao}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {lead.email && (
                              <a href={`mailto:${lead.email}`} className="text-navy-600 hover:underline text-xs">
                                {lead.email}
                              </a>
                            )}
                            {lead.telefone && (
                              <a
                                href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
                                target="_blank"
                                className="text-navy-600 hover:underline text-xs"
                              >
                                {lead.telefone}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-slate-500 text-xs">
                            {[lead.cidade, lead.uf].filter(Boolean).join(', ') || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <span className="text-slate-500 text-xs">{lead.prazo || '—'}</span>
                        </td>
                        <td className="px-6 py-4">{statusBadge(lead.status)}</td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-slate-400 text-xs">{formatDate(lead.created_at)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info de plano */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-100 mb-1">
                Plano atual: <span className="text-white capitalize">{empresa.plano ?? 'Free'}</span>
              </p>
              <p className="text-green-100 text-sm">
                {empresa.verified
                  ? 'Seu perfil está verificado e aparece acima dos gratuitos.'
                  : 'Faça upgrade para aparecer no topo das buscas e receber mais leads.'}
              </p>
            </div>
            <a
              href="/planos"
              className="flex-shrink-0 bg-white text-navy-700 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-navy-50 transition-colors"
            >
              Ver planos
            </a>
          </div>
        </>
      )}
    </div>
  )
}
