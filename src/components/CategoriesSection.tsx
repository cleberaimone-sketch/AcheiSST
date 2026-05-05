"use client";
import Link from "next/link";
import {
  User, Building2, Shield, Package, GraduationCap,
  Briefcase, CalendarDays, Video, ArrowRight,
} from "lucide-react";

const categories = [
  { label: "Profissionais",  description: "Técnicos e engenheiros de segurança",   href: "/profissionais",                Icon: User,          badge: "312 cadastrados"   },
  { label: "Clínicas",       description: "Medicina e exames ocupacionais",         href: "/fornecedores?cat=clinica",     Icon: Building2,     badge: "87 clínicas"       },
  { label: "Empresas SST",   description: "Consultorias e laudos especializados",   href: "/fornecedores?cat=consultoria", Icon: Shield,        badge: "145 empresas"      },
  { label: "Empresas EPI",   description: "Equipamentos de proteção individual",    href: "/fornecedores?cat=epi",         Icon: Package,       badge: "203 fornecedores"  },
  { label: "Treinamentos",   description: "Capacitação e cursos NR",                href: "/fornecedores?cat=treinamento", Icon: GraduationCap, badge: "56 cursos"         },
  { label: "Vagas SST",      description: "Oportunidades para profissionais",       href: "/cadastrar",                    Icon: Briefcase,     badge: "28 vagas abertas"  },
  { label: "Eventos",        description: "Congressos, feiras e webinars SST",      href: "/eventos",                      Icon: CalendarDays,  badge: "12 próximos"       },
  { label: "Vídeos & SST",   description: "Vídeos e podcasts sobre SST",            href: "/videos",                       Icon: Video,         badge: "40+ vídeos"        },
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map(({ label, description, href, Icon, badge }) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl p-4 md:p-5 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_10px_28px_rgba(22,163,74,0.14)] transition-all duration-200"
          >
            {/* radial glow decoration bottom-right */}
            <div className="pointer-events-none absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.18)_0%,transparent_70%)] group-hover:scale-150 transition-transform duration-300" />

            {/* icon container: white+border → gradient on hover via layered divs */}
            <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-[14px] bg-white border border-green-200 group-hover:opacity-0 transition-opacity duration-200" />
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-100 shadow-[0_4px_14px_rgba(22,163,74,0.35)] transition-all duration-200" />
              <Icon
                className="relative z-10 w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-200"
                strokeWidth={1.8}
              />
            </div>

            <h3 className="font-bold text-sm md:text-[15px] text-slate-900 mb-1 tracking-tight">
              {label}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              {description}
            </p>
            <span className="inline-block text-[10px] font-semibold text-green-700 bg-green-100 rounded-full px-2.5 py-1">
              {badge}
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
