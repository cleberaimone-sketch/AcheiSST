import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { FornecedoresGrid } from '@/components/FornecedoresGrid'
import type { Fornecedor, FornecedorCategoria } from '@/types'

export const metadata = {
  title: 'Fornecedores SST — AcheiSST',
  description: 'Encontre fornecedores especializados em Saúde e Segurança do Trabalho: clínicas, lojas de EPI, softwares, treinamentos e muito mais.',
}

export const revalidate = 3600

// Mapeamento de categoria no BD para FornecedorCategoria de exibição
function mapCategoriaBD(categoria: string): FornecedorCategoria {
  const c = (categoria ?? '').toLowerCase()
  if (c === 'clinica' || c === 'clínica') return 'Clínicas Médicas'
  if (c === 'loja' || c === 'epi') return 'EPI & Equipamentos'
  if (c === 'software') return 'Softwares SST'
  if (c === 'equipamento') return 'EPI & Equipamentos'
  if (c === 'treinamento') return 'Treinamentos'
  if (c === 'consultoria') return 'Consultorias SST'
  if (c === 'laboratorio' || c === 'laboratório') return 'Laboratórios'
  if (c === 'engenharia') return 'Engenharia de Segurança'
  return 'Outros'
}

// Mapeamento inverso: string da URL para categoria do BD
function mapUrlCategory(urlCat: string | null): string | null {
  if (!urlCat) return null
  const c = urlCat.toLowerCase()
  if (c === 'clinica' || c === 'clínica') return 'clinica'
  if (c === 'loja' || c === 'epi') return 'loja'
  if (c === 'software') return 'software'
  if (c === 'equipamento') return 'equipamento'
  if (c === 'treinamento') return 'treinamento'
  if (c === 'consultoria') return 'consultoria'
  return null
}

interface FornecedoresPageProps {
  searchParams: Promise<{ cat?: string }>
}

export default async function FornecedoresPage({ searchParams }: FornecedoresPageProps) {
  const params = await searchParams
  const categoryFilter = mapUrlCategory(params.cat ?? null)

  let query = supabase.from('fornecedores').select('*')

  if (categoryFilter) {
    query = query.eq('categoria', categoryFilter)
  }

  const { data } = await query.order('verified', { ascending: false }).order('avaliacao', { ascending: false })

  const fornecedores: Fornecedor[] = (data ?? []).map((e) => ({
    id: String(e.id),
    slug: e.slug ?? String(e.id),
    nome: e.nome,
    categoria: mapCategoriaBD(e.categoria ?? ''),
    subcategoria: e.subcategoria ?? null,
    cidade: e.cidade ?? '',
    uf: e.uf ?? '',
    endereco: e.endereco ?? null,
    telefone: e.telefone ?? null,
    logo_url: e.logo_url ?? null,
    foto_url: e.foto_url ?? null,
    site_url: e.website_url ?? null,
    whatsapp: e.whatsapp ?? null,
    email: e.email ?? null,
    descricao: e.descricao ?? null,
    especialidades: e.especialidades ?? null,
    experiencia_anos: e.experiencia_anos ?? null,
    avaliacao: e.avaliacao ? Number(e.avaliacao) : null,
    num_avaliacoes: e.num_avaliacoes ?? 0,
    plano: 'free',
    verificado: e.verified ?? false,
    is_sponsored: e.is_sponsored ?? false,
    created_at: e.criado_em ?? new Date().toISOString(),
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
