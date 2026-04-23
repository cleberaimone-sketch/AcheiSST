import { supabase } from '@/lib/supabase'
import { ProfissionaisClient } from '@/components/ProfissionaisClient'
import { Navbar } from '@/components/Navbar'
import type { Profissional } from '@/types'

export const metadata = {
  title: 'Profissionais SST — AcheiSST',
  description: 'Encontre técnicos, engenheiros, médicos do trabalho e especialistas em Saúde e Segurança do Trabalho em todo o Brasil.',
}

export const revalidate = 3600

export default async function ProfissionaisPage() {
  const { data } = await supabase
    .from('profissionais')
    .select('*')
    .order('verified', { ascending: false })
    .order('nome')

  const profissionais: Profissional[] = data ?? []

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
              <a href="/" className="hover:text-green-600 transition-colors">Início</a>
              <span>/</span>
              <span className="text-slate-700 font-medium">Profissionais SST</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Profissionais <span className="text-green-600">SST</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Técnicos, engenheiros, médicos do trabalho e especialistas em todo o Brasil.
            </p>
          </div>
        </div>
        <ProfissionaisClient profissionais={profissionais} />
      </main>
    </>
  )
}
