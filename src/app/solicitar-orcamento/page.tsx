import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { OrcamentoForm } from '@/components/OrcamentoForm'

export const metadata = {
  title: 'Solicitar Orçamento — AcheiSST',
  description: 'Solicite orçamentos de fornecedores SST de forma rápida e gratuita.',
}

interface Props {
  searchParams: Promise<{ fornecedor?: string; profissional?: string }>
}

export default async function SolicitarOrcamentoPage({ searchParams }: Props) {
  const { fornecedor: slug, profissional: profissionalUUID } = await searchParams

  let empresa = null
  let profissional = null

  if (slug) {
    const { data } = await supabase
      .from('fornecedores')
      .select('id, nome, categoria, cidade, uf, verified')
      .eq('slug', slug)
      .single()
    empresa = data
  }

  if (profissionalUUID) {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, ocupacao, city, state, avatar_url')
      .eq('id', profissionalUUID)
      .single()
    profissional = data
  }

  const nomeDestino = empresa?.nome ?? profissional?.display_name ?? null

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <a href="/" className="hover:text-green-600 transition-colors">Início</a>
            <span>/</span>
            {empresa && (
              <>
                <a href={`/fornecedores/${slug}`} className="hover:text-green-600 transition-colors truncate max-w-[160px]">{empresa.nome}</a>
                <span>/</span>
              </>
            )}
            {profissional && (
              <>
                <a href={`/profissionais/p/${profissional.id}`} className="hover:text-green-600 transition-colors truncate max-w-[160px]">{profissional.display_name}</a>
                <span>/</span>
              </>
            )}
            <span className="text-slate-700 font-medium">Solicitar Orçamento</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">
              Solicitar <span className="text-green-600">Orçamento</span>
            </h1>
            <p className="text-slate-500 text-sm mb-7">
              {nomeDestino
                ? `Envie sua solicitação para ${nomeDestino}. Resposta em até 24h.`
                : 'Descreva sua necessidade e receba orçamentos de fornecedores qualificados.'}
            </p>

            {empresa && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {empresa.nome.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{empresa.nome}</p>
                  <p className="text-xs text-slate-500">{empresa.categoria} · {empresa.cidade}, {empresa.uf}</p>
                </div>
              </div>
            )}

            {profissional && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-3 mb-6">
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                  {profissional.avatar_url ? (
                    <img src={profissional.avatar_url} alt={profissional.display_name ?? ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                      {(profissional.display_name ?? 'P').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{profissional.display_name}</p>
                  <p className="text-xs text-slate-500">{profissional.ocupacao}{profissional.city ? ` · ${profissional.city}, ${profissional.state}` : ''}</p>
                </div>
              </div>
            )}

            <OrcamentoForm
              fornecedorId={empresa?.id ?? null}
              fornecedorSlug={slug ?? null}
              profissionalId={profissional?.id ?? null}
              profissionalNome={profissional?.display_name ?? null}
            />
          </div>
        </div>
      </main>
    </>
  )
}
