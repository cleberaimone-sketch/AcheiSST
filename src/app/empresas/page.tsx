import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { PartnersGrid } from '@/components/PartnersGrid'
import type { EmpresaParceira } from '@/types'

export const metadata = {
  title: 'Empresas SST — AcheiSST',
  description: 'Encontre prestadores de serviço especializados em Saúde e Segurança no Trabalho em todo o Brasil. Consultorias, medicina do trabalho, EPI, treinamentos e mais.',
}

export const revalidate = 3600

export default async function EmpresasPage() {
  const { data } = await supabase
    .from('empresas')
    .select('*')
    .order('verified', { ascending: false })
    .order('nome')

  const empresas: EmpresaParceira[] = (data ?? []).map((e) => ({
    id: e.id,
    name: e.nome,
    segment: e.segmento,
    city: e.cidade ?? '',
    uf: e.uf,
    logo_url: e.logo_url ?? null,
    website_url: e.site_url ?? null,
    is_featured: e.verified ?? false,
    created_at: e.created_at,
  }))

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">
        <div className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
              <a href="/" className="hover:text-green-600 transition-colors">Início</a>
              <span>/</span>
              <span className="text-slate-700 font-medium">Empresas SST</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Empresas <span className="text-green-600">SST</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Encontre e conecte-se a prestadores de serviço especializados em Saúde e Segurança do Trabalho em todo o Brasil.
            </p>
          </div>
        </div>
        <PartnersGrid empresas={empresas} />
      </main>
    </>
  )
}
