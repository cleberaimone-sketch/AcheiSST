import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Planos — AcheiSST",
  description: "Escolha o plano ideal para divulgar seus serviços de SST no AcheiSST.",
};

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    description: "Comece a divulgar seus serviços de SST sem custo.",
    features: [
      "Perfil público básico",
      "Até 3 serviços cadastrados",
      "Aparece nas buscas por região",
      "Suporte por e-mail",
    ],
    cta: "Começar grátis",
    href: "/painel/cadastrar",
    highlighted: false,
    color: "border-slate-200",
  },
  {
    name: "Premium",
    price: "R$ 79",
    period: "/mês",
    description: "Mais visibilidade e ferramentas para crescer.",
    features: [
      "Tudo do plano Free",
      "Serviços ilimitados",
      "Destaque nas buscas",
      "Selo de profissional verificado",
      "Recebimento de likes e avaliações",
    ],
    cta: "Assinar Premium",
    href: "/painel/cadastrar?plano=premium",
    highlighted: true,
    color: "border-green-500",
  },
  {
    name: "Pro",
    price: "R$ 199",
    period: "/mês",
    description: "Para clínicas e empresas que querem liderar o ranking.",
    features: [
      "Tudo do plano Premium",
      "Topo do ranking por categoria",
      "Página personalizada da empresa",
      "Galeria de portfólio e laudos",
      "Relatórios mensais de desempenho",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    href: "/painel/cadastrar?plano=pro",
    highlighted: false,
    color: "border-slate-200",
  },
];

export default function PlanosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </a>

          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Planos AcheiSST</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Escolha o plano ideal para seu negócio
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto">
              Cadastre seus serviços de medicina ocupacional, PGR, LTCAT, PCMSO e mais.
              Quanto maior seu plano, maior seu destaque no ranking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl border-2 ${plan.color} p-8 shadow-sm flex flex-col ${plan.highlighted ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    <Sparkles className="w-3.5 h-3.5" /> Mais popular
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">{plan.name}</h2>
                  <p className="text-sm text-slate-500">{plan.description}</p>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </div>

                <a
                  href={plan.href}
                  className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-colors mb-6 ${
                    plan.highlighted
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {plan.cta}
                </a>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            Dúvidas? Fale conosco em{" "}
            <a href="mailto:contato@acheisst.com.br" className="text-green-600 hover:underline">
              contato@acheisst.com.br
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
