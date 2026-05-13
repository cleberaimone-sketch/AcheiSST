import { supabase } from '@/lib/supabase'
import { ProfissionaisClient } from '@/components/ProfissionaisClient'
import { Navbar } from '@/components/Navbar'
import type { ProfissionalUnificado } from '@/types'

export const metadata = {
  title: 'Profissionais SST — AcheiSST',
  description: 'Encontre técnicos, engenheiros, médicos do trabalho e especialistas em Saúde e Segurança do Trabalho em todo o Brasil.',
}

export const revalidate = 3600

export default async function ProfissionaisPage() {
  const [{ data: scraped }, { data: registered }] = await Promise.all([
    supabase
      .from('profissionais')
      .select('id, nome, especialidade, uf, cidade, registro_profissional, bio, foto_url, telefone, whatsapp, nrs_expertise, verified')
      .order('verified', { ascending: false })
      .order('nome'),
    supabase
      .from('profiles')
      .select('id, display_name, ocupacao, state, city, registro_prof, about, avatar_url, phone, whatsapp, nrs_atendidas, is_verified')
      .not('display_name', 'is', null),
  ])

  const cadastrados: ProfissionalUnificado[] = (registered ?? []).map(p => ({
    id: p.id,
    nome: p.display_name!,
    especialidade: p.ocupacao ?? null,
    uf: p.state ?? null,
    cidade: p.city ?? null,
    registro: p.registro_prof ?? null,
    bio: p.about ?? null,
    foto_url: p.avatar_url ?? null,
    telefone: p.phone ?? null,
    whatsapp: p.whatsapp ?? null,
    nrs: p.nrs_atendidas ?? [],
    verified: p.is_verified ?? false,
    fonte: 'cadastrado',
  }))

  const scrapeados: ProfissionalUnificado[] = (scraped ?? []).map(p => ({
    id: p.id,
    nome: p.nome,
    especialidade: p.especialidade ?? null,
    uf: p.uf ?? null,
    cidade: p.cidade ?? null,
    registro: p.registro_profissional ?? null,
    bio: p.bio ?? null,
    foto_url: p.foto_url ?? null,
    telefone: p.telefone ?? null,
    whatsapp: p.whatsapp ?? null,
    nrs: p.nrs_expertise ?? [],
    verified: p.verified ?? false,
    fonte: 'scraped',
  }))

  // Cadastrados primeiro (nossos usuários reais), depois scraped
  const profissionais: ProfissionalUnificado[] = [...cadastrados, ...scrapeados]

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
