import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { FornecedoresGrid } from '@/components/FornecedoresGrid'
import type { Fornecedor, FornecedorCategoria } from '@/types'

export const metadata = {
  title: 'Fornecedores SST — AcheiSST',
  description: 'Encontre fornecedores especializados em Saúde e Segurança do Trabalho: EPI, clínicas, consultorias, treinamentos, softwares e muito mais.',
}

export const revalidate = 3600

// Mapeamento do campo 'segmento' existente para FornecedorCategoria
function mapSegmento(segmento: string): FornecedorCategoria {
  const s = (segmento ?? '').toLowerCase()
  if (s.includes('epi') || s.includes('epc') || s.includes('equipamento')) return 'EPI & Equipamentos'
  if (s.includes('clínica') || s.includes('clinica') || s.includes('medicina')) return 'Clínicas Médicas'
  if (s.includes('consultoria') || s.includes('sst')) return 'Consultorias SST'
  if (s.includes('treinamento') || s.includes('curso') || s.includes('nr')) return 'Treinamentos'
  if (s.includes('software') || s.includes('sistema') || s.includes('tecnologia')) return 'Softwares SST'
  if (s.includes('laboratório') || s.includes('laboratorio') || s.includes('higiene')) return 'Laboratórios'
  if (s.includes('engenharia') || s.includes('segurança')) return 'Engenharia de Segurança'
  return 'Outros'
}

export default async function FornecedoresPage() {
  const { data } = await supabase
    .from('empresas')
    .select('*')
    .order('verified', { ascending: false })
    .order('nome')

  const fornecedores: Fornecedor[] = (data ?? []).map((e) => ({
    id: String(e.id),
    slug: e.slug ?? String(e.id),
    nome: e.nome,
    categoria: e.categoria ? (e.categoria as FornecedorCategoria) : mapSegmento(e.segmento ?? ''),
    subcategoria: e.subcategoria ?? null,
    cidade: e.cidade ?? '',
    uf: e.uf ?? '',
    logo_url: e.logo_url ?? null,
    site_url: e.site_url ?? null,
    whatsapp: e.whatsapp ?? null,
    descricao: e.descricao ?? e.segmento ?? null,
    plano: (e.plano as Fornecedor['plano']) ?? 'free',
    verificado: e.verified ?? false,
    is_sponsored: e.is_sponsored ?? false,
    created_at: e.created_at,
  }))

  const stats = {
    total: fornecedores.length,
    estados: new Set(fornecedores.map((f) => f.uf)).size,
    verificados: fornecedores.filter((f) => f.verificado).length,
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero da página */}
        <div className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
              <a href="/" className="hover:text-green-600 transition-colors">Início</a>
              <span>/</span>
              <span className="text-slate-700 font-medium">Fornecedores</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Fornecedores <span className="text-green-600">SST</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mb-8">
              Encontre os melhores fornecedores de Saúde e Segurança do Trabalho do Brasil: EPI, clínicas, consultorias, treinamentos, softwares e mais.
            </p>

            {/* Stats rápidas */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">{stats.total}+</span>
                <span className="text-sm text-slate-500">Fornecedores</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">{stats.estados}</span>
                <span className="text-sm text-slate-500">Estados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">{stats.verificados}</span>
                <span className="text-sm text-slate-500">Verificados</span>
              </div>
            </div>
          </div>
        </div>

        <FornecedoresGrid fornecedores={fornecedores} />
      </main>
    </>
  )
}
