import { Navbar } from '@/components/Navbar'
import { CadastrarForm } from '@/components/CadastrarForm'
import { CheckCircle2, TrendingUp, Star, Zap, Shield } from 'lucide-react'

export const metadata = {
  title: 'Cadastrar meu negócio — AcheiSST',
  description: 'Cadastre sua empresa ou serviço de SST gratuitamente no maior ecossistema de Saúde e Segurança do Trabalho do Brasil.',
}

const BENEFICIOS = [
  { icon: TrendingUp, titulo: 'Aumente suas vendas',    desc: 'Apareça para quem está buscando exatamente o que você oferece.' },
  { icon: Star,       titulo: 'Credibilidade',           desc: 'Selo Verificado e avaliações que constroem confiança no setor.' },
  { icon: Zap,        titulo: 'Leads qualificados',      desc: 'Receba solicitações de orçamento direto no seu painel.' },
  { icon: Shield,     titulo: 'Destaque-se',             desc: 'Planos Pro e Premium para aparecer na frente da concorrência.' },
]

export default function CadastrarPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Cadastro Gratuito
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Cadastre seu <span className="text-green-600">negócio SST</span>
            </h1>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              Entre para o maior ecossistema de SST do Brasil e conecte-se a quem precisa dos seus serviços.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Sidebar benefícios */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {BENEFICIOS.map(({ icon: Icon, titulo, desc }) => (
                <div key={titulo} className="flex gap-3 bg-white rounded-2xl border border-slate-100 p-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-0.5">{titulo}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              {/* Plano Free */}
              <div className="bg-green-600 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-green-200 mb-2">Plano Free inclui</p>
                <ul className="text-sm space-y-2">
                  {[
                    'Perfil público no diretório',
                    'Botão WhatsApp + Orçamento',
                    'Até 5 leads/mês',
                    'Aparece nas buscas',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Dados da empresa</h2>
              <p className="text-xs text-slate-400 mb-6">Preencha as informações em 3 etapas rápidas.</p>
              <CadastrarForm />
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
