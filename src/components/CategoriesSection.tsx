"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { label: "Profissionais", description: "Técnicos e engenheiros de segurança",  href: "/profissionais",               emoji: "👷", bg: "bg-blue-50",   border: "border-blue-100 hover:border-blue-300",     text: "text-blue-700"   },
  { label: "Clínicas",      description: "Medicina e exames ocupacionais",       href: "/fornecedores?cat=clinica",    emoji: "🏥", bg: "bg-rose-50",   border: "border-rose-100 hover:border-rose-300",     text: "text-rose-700"   },
  { label: "Empresas SST",  description: "Consultorias e laudos especializados", href: "/fornecedores?cat=consultoria",emoji: "🛡️", bg: "bg-green-50",  border: "border-green-100 hover:border-green-300",   text: "text-green-700"  },
  { label: "Empresas EPI",  description: "Equipamentos de proteção individual",  href: "/fornecedores?cat=epi",        emoji: "🦺", bg: "bg-orange-50", border: "border-orange-100 hover:border-orange-300", text: "text-orange-700" },
  { label: "Treinamentos",  description: "Capacitação e treinamentos NR",        href: "/fornecedores?cat=treinamento",emoji: "🎓", bg: "bg-purple-50", border: "border-purple-100 hover:border-purple-300", text: "text-purple-700" },
  { label: "Vagas",         description: "Oportunidades para profissionais SST", href: "/cadastrar",                   emoji: "💼", bg: "bg-teal-50",   border: "border-teal-100 hover:border-teal-300",     text: "text-teal-700"   },
  { label: "Eventos",       description: "Congressos, feiras e webinars SST",    href: "#eventos",                    emoji: "📅", bg: "bg-indigo-50", border: "border-indigo-100 hover:border-indigo-300", text: "text-indigo-700" },
  { label: "Vídeos & SST",  description: "Vídeos e podcasts sobre SST",          href: "/videos",                     emoji: "🎬", bg: "bg-cyan-50",   border: "border-cyan-100 hover:border-cyan-300",     text: "text-cyan-700"   },
];

const CategoriesSection = () => (
  <section id="categorias" className="bg-background py-8 md:py-12">
    <div className="px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6 gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
            Explore por categoria
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Tudo o que sua empresa precisa em SST
          </h2>
        </div>
        <Link href="/fornecedores" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
          Ver todos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map(({ label, description, href, emoji, bg, border, text }) => (
          <Link
            key={label}
            href={href}
            className={`group text-left ${bg} border ${border} rounded-2xl p-4 md:p-5 hover:-translate-y-0.5 transition-all`}
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
              {emoji}
            </div>
            <h3 className={`font-bold text-sm md:text-base mb-0.5 ${text}`}>{label}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
