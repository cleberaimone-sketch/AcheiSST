export type NewsCategory = 'Legislativo' | 'Saúde Ocupacional' | 'Segurança' | 'Regional'

export type NewsStatus = 'draft' | 'published' | 'archived'

export interface Informativo {
  id: string
  slug?: string
  title: string
  content: string
  summary: string
  source_url: string
  source_name: string
  category: NewsCategory
  uf: string | null
  published_at: string
  created_at: string
  status: NewsStatus
  tags: string[]
  image_url?: string
}

export interface EmpresaParceira {
  id: string
  name: string
  segment: string
  city: string
  uf: string
  logo_url: string | null
  website_url: string | null
  is_featured: boolean
  created_at: string
}

export interface NewsFilter {
  category: NewsCategory | 'Todos'
  uf: string | null
  search: string
}

export type FornecedorCategoria =
  | 'EPI & Equipamentos'
  | 'Clínicas Médicas'
  | 'Consultorias SST'
  | 'Treinamentos'
  | 'Softwares SST'
  | 'Laboratórios'
  | 'Engenharia de Segurança'
  | 'Outros'

export type FornecedorPlano = 'free' | 'pro' | 'premium'

export interface Fornecedor {
  id: string
  slug: string
  nome: string
  categoria: FornecedorCategoria
  subcategoria: string | null
  cidade: string
  uf: string
  endereco?: string | null
  telefone?: string | null
  logo_url: string | null
  foto_url?: string | null
  site_url: string | null
  whatsapp: string | null
  email?: string | null
  descricao: string | null
  especialidades?: string[] | null
  experiencia_anos?: number | null
  avaliacao?: number | null
  num_avaliacoes?: number
  plano: FornecedorPlano
  verificado: boolean
  is_sponsored: boolean
  created_at: string
}

export interface Profissional {
  id: string
  nome: string
  especialidade: string
  especialidade_tipo: string | null
  uf: string
  cidade: string | null
  registro_profissional: string | null
  bio: string | null
  foto_url: string | null
  email: string | null
  telefone: string | null
  whatsapp: string | null
  linkedin_url: string | null
  nrs_expertise: string[]
  experiencia_anos: number | null
  areas_atuacao: string[] | null
  avaliacao: number | null
  num_avaliacoes: number
  verified: boolean
  criado_em: string
  atualizado_em: string
}
