"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

const categories = [
  { label: "Profissionais", description: "Técnicos e engenheiros de segurança",  href: "/profissionais",                emoji: "👷", bg: "bg-blue-50",   border: "border-blue-100 hover:border-blue-300",     text: "text-blue-700"   },
  { label: "Clínicas",      description: "Medicina e exames ocupacionais",       href: "/fornecedores?cat=clinica",     emoji: "🏥", bg: "bg-rose-50",   border: "border-rose-100 hover:border-rose-300",     text: "text-rose-700"   },
  { label: "Empresas SST",  description: "Consultorias e laudos especializados", href: "/fornecedores?cat=consultoria", emoji: "🛡️", bg: "bg-green-50",  border: "border-green-100 hover:border-green-300",   text: "text-green-700"  },
  { label: "Empresas EPI",  description: "Equipamentos de proteção individual",  href: "/fornecedores?cat=epi",         emoji: "🦺", bg: "bg-orange-50", border: "border-orange-100 hover:border-orange-300", text: "text-orange-700" },
  { label: "Treinamentos",  description: "Capacitação e treinamentos NR",        href: "/fornecedores?cat=treinamento", emoji: "🎓", bg: "bg-purple-50", border: "border-purple-100 hover:border-purple-300", text: "text-purple-700" },
  { label: "Vagas",         description: "Oportunidades para profissionais SST", href: "/cadastrar",                    emoji: "💼", bg: "bg-teal-50",   border: "border-teal-100 hover:border-teal-300",     text: "text-teal-700"   },
  { label: "Eventos",       description: "Congressos, feiras e webinars SST",    href: "/eventos",                     emoji: "📅", bg: "bg-indigo-50", border: "border-indigo-100 hover:border-indigo-300", text: "text-indigo-700" },
  { label: "Vídeos & SST",  description: "Vídeos e podcasts sobre SST",          href: "/videos",                      emoji: "🎬", bg: "bg-cyan-50",   border: "border-cyan-100 hover:border-cyan-300",     text: "text-cyan-700"   },
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
    <section className="bg-white pt-24 md:pt-28 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Busca ── */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 border border-green-200">
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

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            Cobertura nacional · Profissionais verificados
          </div>
        </div>

        {/* ── Categorias ── */}
        <div>
          <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">
                Explore por categoria
              </p>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
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
            {categories.map(({ label, description, href, emoji, bg, border, text }) => (
              <Link
                key={label}
                href={href}
                className={`group text-left ${bg} border ${border} rounded-2xl p-4 md:p-5 hover:-translate-y-0.5 hover:shadow-sm transition-all`}
              >
                <div className="text-3xl mb-2.5 group-hover:scale-110 transition-transform inline-block">
                  {emoji}
                </div>
                <h3 className={`font-bold text-sm mb-0.5 ${text}`}>{label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
