import { Navbar } from '@/components/Navbar'
import { CadastrarForm } from '@/components/CadastrarForm'

export const metadata = {
  title: 'Cadastrar meu negócio — AcheiSST',
  description: 'Cadastre sua empresa ou serviço de SST gratuitamente no maior ecossistema de Saúde e Segurança do Trabalho do Brasil.',
}

const BENEFICIOS = [
  { titulo: 'Aumente suas vendas', desc: 'Apareça para quem está buscando exatamente o que você oferece.' },
  { titulo: 'Credibilidade', desc: 'Selo Verificado e avaliações que constroem confiança no setor.' },
  { titulo: 'Leads qualificados', desc: 'Receba solicitações de orçamento direto no seu painel.' },
  { titulo: 'Destaque-se', desc: 'Planos Pro e Premium para aparecer na frente da concorrência.' },
]

export default function CadastrarPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Cadastro Gratuito
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Cadastre seu <span className="text-green-600">negócio SST</span>
            </h1>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              Junte-se ao maior ecossistema de SST do Brasil e conecte-se a quem precisa dos seus serviços.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Benefícios */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Por que anunciar?</p>
              {BENEFICIOS.map((b) => (
                <div key={b.titulo} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{b.titulo}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 bg-green-600 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-green-200 mb-1">Plano Free inclui</p>
                <ul className="text-sm space-y-1.5">
                  {['Perfil público no diretório', 'Botão WhatsApp + Orçamento', 'Até 5 leads/mês', 'Aparece nas buscas'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-300 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5">Dados da empresa</h2>
              <CadastrarForm />
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
