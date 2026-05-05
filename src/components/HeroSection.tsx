"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search, CheckCircle2, ArrowRight,
  User, Building2, Shield, Package, GraduationCap,
  Briefcase, CalendarDays, Video,
} from "lucide-react";

const categories = [
  { label: "Profissionais", description: "Técnicos e engenheiros de segurança",   href: "/profissionais",                Icon: User,          badge: "312 cadastrados"  },
  { label: "Clínicas",      description: "Medicina e exames ocupacionais",         href: "/fornecedores?cat=clinica",     Icon: Building2,     badge: "87 clínicas"      },
  { label: "Empresas SST",  description: "Consultorias e laudos especializados",   href: "/fornecedores?cat=consultoria", Icon: Shield,        badge: "145 empresas"     },
  { label: "Empresas EPI",  description: "Equipamentos de proteção individual",    href: "/fornecedores?cat=epi",         Icon: Package,       badge: "203 fornecedores" },
  { label: "Treinamentos",  description: "Capacitação e cursos NR",                href: "/fornecedores?cat=treinamento", Icon: GraduationCap, badge: "56 cursos"        },
  { label: "Vagas SST",     description: "Oportunidades para profissionais SST",   href: "/cadastrar",                    Icon: Briefcase,     badge: "28 vagas abertas" },
  { label: "Eventos",       description: "Congressos, feiras e webinars SST",      href: "/eventos",                      Icon: CalendarDays,  badge: "12 próximos"      },
  { label: "Vídeos & SST",  description: "Vídeos e podcasts sobre SST",            href: "/videos",                       Icon: Video,         badge: "40+ vídeos"       },
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="bg-white pt-20 md:pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Categorias — primeira coisa visível ── */}
        <div className="mb-8">
          <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">
                Explore por categoria
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Tudo o que sua empresa precisa em SST
              </h2>
            </div>
            <Link
              href="/fornecedores"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 shrink-0"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(({ label, description, href, Icon, badge }) => (
              <Link
                key={label}
                href={href}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-green-50 border border-green-100 rounded-2xl p-4 md:p-5 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_10px_28px_rgba(22,163,74,0.14)] transition-all duration-200"
              >
                {/* radial glow decoration */}
                <div className="pointer-events-none absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.18)_0%,transparent_70%)] group-hover:scale-150 transition-transform duration-300" />

                {/* icon: white+border → green gradient on hover */}
                <div className="relative w-11 h-11 mb-3 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-[12px] bg-white border border-green-200 group-hover:opacity-0 transition-opacity duration-200" />
                  <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-100 shadow-[0_4px_14px_rgba(22,163,74,0.35)] transition-all duration-200" />
                  <Icon className="relative z-10 w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-200" strokeWidth={1.8} />
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-0.5 tracking-tight">{label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-2.5">{description}</p>
                <span className="inline-block text-[10px] font-semibold text-green-700 bg-green-100 rounded-full px-2 py-0.5">
                  {badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Badge + Busca ── */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            Profissionais 100% verificados · SST do Brasil
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white border-2 border-slate-200 rounded-full shadow-sm pl-5 pr-2 py-2 focus-within:border-green-500 focus-within:shadow-md transition-all"
          >
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por PGR, LTCAT, médico do trabalho..."
              className="flex-1 bg-transparent outline-none px-3 py-1.5 text-sm md:text-base placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 md:px-7 py-2.5 text-sm font-bold transition-colors shrink-0"
            >
              Buscar
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
