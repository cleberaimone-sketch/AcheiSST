"use client";
import { Check, Sparkles } from "lucide-react";

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
    highlighted: false,
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
    highlighted: true,
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
    highlighted: false,
  },
];

const PlansSection = () => (
  <section id="planos" className="bg-muted/40 py-20 md:py-28">
    <div className="px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">
          Planos AcheiSST
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Escolha o plano ideal para seu negócio
        </h2>
        <p className="mt-4 text-muted-foreground">
          Cadastre seus serviços de medicina ocupacional, PGR, LTCAT, PCMSO e mais. Quanto maior seu plano, maior seu destaque no ranking.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 transition-all ${
              plan.highlighted
                ? "bg-gradient-brand text-primary-foreground shadow-card-hover scale-[1.02]"
                : "bg-background border border-border shadow-card hover:shadow-card-hover"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Mais popular
              </div>
            )}

            <h3 className={`font-display text-xl font-bold mb-2 ${plan.highlighted ? "" : "text-foreground"}`}>
              {plan.name}
            </h3>
            <p className={`text-sm mb-6 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {plan.description}
            </p>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="font-display text-4xl font-extrabold">{plan.price}</span>
              <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {plan.period}
              </span>
            </div>

            <button
              className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
                plan.highlighted
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {plan.cta}
            </button>

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.highlighted ? "text-secondary" : "text-secondary"
                    }`}
                  />
                  <span className={plan.highlighted ? "text-primary-foreground/90" : "text-foreground/80"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PlansSection;
