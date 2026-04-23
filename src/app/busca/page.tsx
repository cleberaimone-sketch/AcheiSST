import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { BuscaResults } from '@/components/BuscaResults'
import type { Fornecedor, Profissional, FornecedorCategoria } from '@/types'

export const metadata = {
  title: 'Busca — AcheiSST',
  description: 'Busque fornecedores, profissionais e serviços de SST em todo o Brasil.',
}

function mapSegmento(s: string): FornecedorCategoria {
  const l = (s ?? '').toLowerCase()
  if (l.includes('epi') || l.includes('epc') || l.includes('equipamento')) return 'EPI & Equipamentos'
  if (l.includes('clínica') || l.includes('clinica') || l.includes('medicina')) return 'Clínicas Médicas'
  if (l.includes('consultoria')) return 'Consultorias SST'
  if (l.includes('treinamento') || l.includes('curso')) return 'Treinamentos'
  if (l.includes('software') || l.includes('sistema')) return 'Softwares SST'
  if (l.includes('laboratório') || l.includes('laboratorio') || l.includes('higiene')) return 'Laboratórios'
  if (l.includes('engenharia') || l.includes('segurança')) return 'Engenharia de Segurança'
  return 'Outros'
}

interface Props {
  searchParams: Promise<{ q?: string; uf?: string }>
}

export default async function BuscaPage({ searchParams }: Props) {
  const { q, uf } = await searchParams
  const query = (q ?? '').trim()
  const estado = (uf ?? '').trim().toUpperCase()

  let fornecedores: Fornecedor[] = []
  let profissionais: Profissional[] = []

  if (query) {
    const ftsQuery = query
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `${w}:*`)
      .join(' & ')

    // Busca em empresas
    let empQuery = supabase
      .from('empresas')
      .select('*')
      .textSearch('fts', ftsQuery, { type: 'plain', config: 'portuguese' })
      .order('rank_score', { ascending: false })
      .limit(20)

    if (estado) empQuery = empQuery.eq('uf', estado)

    const { data: empData } = await empQuery

    fornecedores = (empData ?? []).map((e) => ({
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

    // Busca em profissionais
    let profQuery = supabase
      .from('profissionais')
      .select('*')
      .textSearch('fts', ftsQuery, { type: 'plain', config: 'portuguese' })
      .order('verified', { ascending: false })
      .limit(20)

    if (estado) profQuery = profQuery.eq('uf', estado)

    const { data: profData } = await profQuery

    profissionais = (profData ?? []).map((p) => ({
      id: p.id,
      nome: p.nome,
      especialidade: p.especialidade,
      uf: p.uf,
      cidade: p.cidade ?? null,
      registro: p.registro ?? null,
      bio: p.bio ?? null,
      avatar_url: p.avatar_url ?? null,
      email: p.email ?? null,
      telefone: p.telefone ?? null,
      linkedin_url: p.linkedin_url ?? null,
      verified: p.verified ?? false,
      created_at: p.created_at,
    }))
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">
        <BuscaResults
          query={query}
          uf={estado}
          fornecedores={fornecedores}
          profissionais={profissionais}
        />
      </main>
    </>
  )
}
