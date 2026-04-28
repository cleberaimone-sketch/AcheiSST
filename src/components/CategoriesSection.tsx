"use client";
import Link from "next/link";
import {
  UserRoundCog,
  HeartPulse,
  ShieldHalf,
  HardHat,
  GraduationCap,
  Briefcase,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react";

const categories = [
  { label: "Profissionais", icon: UserRoundCog, description: "Técnicos e engenheiros de segurança",  href: "/profissionais" },
  { label: "Clínicas",      icon: HeartPulse,   description: "Medicina e exames ocupacionais",       href: "/fornecedores?cat=clinica" },
  { label: "Empresas SST",  icon: ShieldHalf,   description: "Consultorias e laudos especializados", href: "/fornecedores?cat=consultoria" },
  { label: "Empresas EPI",  icon: HardHat,      description: "Equipamentos de proteção individual",  href: "/fornecedores?cat=epi" },
  { label: "Treinamentos",  icon: GraduationCap, description: "Capacitação e treinamentos NR",       href: "/fornecedores?cat=treinamento" },
  { label: "Vagas",         icon: Briefcase,    description: "Oportunidades para profissionais SST", href: "/cadastrar" },
  { label: "Eventos",       icon: Calendar,     description: "Congressos, feiras e webinars",        href: "/cadastrar" },
  { label: "Artigos",       icon: FileText,     description: "Conteúdo técnico e novidades",         href: "/informativos" },
];

const CategoriesSection = () => (
  <section id="categorias" className="bg-background py-10 md:py-16">
    <div className="px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-3">
            Explore por categoria
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
            Tudo o que sua empresa precisa em SST, em um clique
          </h2>
        </div>
        <Link
          href="/fornecedores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
        >
          Ver todos os fornecedores <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map(({ label, icon: Icon, description, href }) => (
          <Link
            key={label}
            href={href}
            className="group text-left bg-background border border-border rounded-xl p-5 md:p-6 shadow-card hover:shadow-card-hover hover:border-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground text-base mb-1">{label}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
