import Link from 'next/link'
import { CheckCircle2, ArrowRight, Search, Users, BookOpen, Shield } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export const metadata = {
  title: 'Bem-vindo ao AcheiSST!',
  robots: { index: false },
}

export default function BemVindoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">

          {/* Ícone de confirmação */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            E-mail confirmado!
          </h1>
          <p className="text-slate-500 text-base mb-8 leading-relaxed">
            Sua conta no <strong className="text-slate-900">AcheiSST</strong> está ativa.
            Agora você tem acesso completo à maior plataforma de SST do Brasil.
          </p>

          {/* Card CTA primário */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Por onde começar?
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/painel"
                className="flex items-center justify-between w-full bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3.5 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4.5 h-4.5" />
                  <span>Acessar meu painel</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/profissionais"
                className="flex items-center justify-between w-full border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-semibold px-5 py-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Encontrar profissionais SST</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/informativos"
                className="flex items-center justify-between w-full border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-semibold px-5 py-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Ver notícias e legislação SST</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/busca"
                className="flex items-center justify-between w-full border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-semibold px-5 py-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4" />
                  <span>Buscar fornecedores SST</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
            </div>
          </div>

          {/* Rodapé */}
          <p className="text-xs text-slate-400">
            Dúvidas? Fale com a gente em{' '}
            <a href="mailto:contato@acheisst.com.br" className="text-green-600 hover:underline font-medium">
              contato@acheisst.com.br
            </a>
          </p>

        </div>
      </main>
    </>
  )
}
