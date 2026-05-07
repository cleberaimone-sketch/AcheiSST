"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Search, ArrowRight } from "lucide-react";

const categories = [
  {
    label: "Profissionais",
    emoji: "👷",
    href: "/profissionais",
    subcategories: [
      { label: "Médico do Trabalho",         href: "/profissionais?esp=medico" },
      { label: "Engenheiro de Segurança",    href: "/profissionais?esp=engenheiro" },
      { label: "Técnico de Segurança",       href: "/profissionais?esp=tecnico" },
      { label: "Enfermeiro do Trabalho",     href: "/profissionais?esp=enfermeiro" },
      { label: "Higienista Ocupacional",     href: "/profissionais?esp=higienista" },
      { label: "Ver todos →",               href: "/profissionais" },
    ],
  },
  {
    label: "Clínicas",
    emoji: "🏥",
    href: "/fornecedores?cat=clinica",
    subcategories: [
      { label: "Exames Admissionais",    href: "/fornecedores?cat=clinica&srv=admissional" },
      { label: "Exames Periódicos",      href: "/fornecedores?cat=clinica&srv=periodico" },
      { label: "PCMSO",                  href: "/fornecedores?cat=clinica&srv=pcmso" },
      { label: "ASO / Atestado",         href: "/fornecedores?cat=clinica&srv=aso" },
      { label: "Audiometria",            href: "/fornecedores?cat=clinica&srv=audiometria" },
      { label: "Ver todas →",            href: "/fornecedores?cat=clinica" },
    ],
  },
  {
    label: "Empresas SST",
    emoji: "🛡️",
    href: "/fornecedores?cat=consultoria",
    subcategories: [
      { label: "PGR / PPRA",            href: "/fornecedores?cat=consultoria&srv=pgr" },
      { label: "LTCAT / PPP",           href: "/fornecedores?cat=consultoria&srv=ltcat" },
      { label: "Laudos NR",             href: "/fornecedores?cat=consultoria&srv=laudos" },
      { label: "SESMT Terceirizado",    href: "/fornecedores?cat=consultoria&srv=sesmt" },
      { label: "Gestão de Riscos",      href: "/fornecedores?cat=consultoria&srv=riscos" },
      { label: "Ver todas →",           href: "/fornecedores?cat=consultoria" },
    ],
  },
  {
    label: "Empresas EPI",
    emoji: "🦺",
    href: "/fornecedores?cat=epi",
    subcategories: [
      { label: "Capacetes e Elmos",      href: "/fornecedores?cat=epi&srv=capacete" },
      { label: "Luvas e Proteção Manual",href: "/fornecedores?cat=epi&srv=luvas" },
      { label: "Calçados de Segurança",  href: "/fornecedores?cat=epi&srv=calcados" },
      { label: "Proteção Auditiva",      href: "/fornecedores?cat=epi&srv=auditiva" },
      { label: "Respiradores",           href: "/fornecedores?cat=epi&srv=respirador" },
      { label: "Ver todos →",            href: "/fornecedores?cat=epi" },
    ],
  },
  {
    label: "Treinamentos",
    emoji: "🎓",
    href: "/fornecedores?cat=treinamento",
    subcategories: [
      { label: "NR-10 — Elétrica",           href: "/fornecedores?cat=treinamento&srv=nr10" },
      { label: "NR-12 — Máquinas",           href: "/fornecedores?cat=treinamento&srv=nr12" },
      { label: "NR-33 — Esp. Confinado",     href: "/fornecedores?cat=treinamento&srv=nr33" },
      { label: "NR-35 — Trabalho em Altura", href: "/fornecedores?cat=treinamento&srv=nr35" },
      { label: "CIPA — NR-5",               href: "/fornecedores?cat=treinamento&srv=cipa" },
      { label: "Ver todos →",               href: "/fornecedores?cat=treinamento" },
    ],
  },
  {
    label: "Vagas SST",
    emoji: "💼",
    href: "/cadastrar",
    subcategories: [
      { label: "Técnico de Segurança",    href: "/cadastrar" },
      { label: "Engenheiro de Segurança", href: "/cadastrar" },
      { label: "Médico do Trabalho",      href: "/cadastrar" },
      { label: "Enfermeiro do Trabalho",  href: "/cadastrar" },
      { label: "Cadastrar vaga →",        href: "/cadastrar" },
    ],
  },
  {
    label: "Eventos",
    emoji: "📅",
    href: "/eventos",
    subcategories: [
      { label: "Prevensul 2026 — Porto Alegre", href: "/eventos" },
      { label: "SafetyCon 2026 — Camboriú",     href: "/eventos" },
      { label: "SGG 2026 — Belo Horizonte",     href: "/eventos" },
      { label: "Exposec 2026 — São Paulo",      href: "/eventos" },
      { label: "Ver todos →",                   href: "/eventos" },
    ],
  },
  {
    label: "Vídeos & SST",
    emoji: "🎬",
    href: "/videos",
    subcategories: [
      { label: "Podcasts SST",    href: "/videos" },
      { label: "Webinars e Lives",href: "/videos" },
      { label: "Tutoriais NR",    href: "/videos" },
      { label: "Ver todos →",     href: "/videos" },
    ],
  },
];

const POPULARES = [
  { label: "Médico do Trabalho",    href: "/profissionais?esp=medico" },
  { label: "PGR",                   href: "/fornecedores?cat=consultoria&srv=pgr" },
  { label: "Técnico de Segurança",  href: "/profissionais?esp=tecnico" },
  { label: "Exame Admissional",     href: "/fornecedores?cat=clinica&srv=admissional" },
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function onMouseEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveCategory(label);
  }

  function onMouseLeave() {
    closeTimer.current = setTimeout(() => setActiveCategory(null), 120);
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-green-50 pt-16 md:pt-20">

      {/* ── Barra de categorias com mega menu ── */}
      <div
        className="relative border-b border-slate-100 bg-white"
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <div
                  key={cat.label}
                  className="shrink-0"
                  onMouseEnter={() => onMouseEnter(cat.label)}
                >
                  <Link
                    href={cat.href}
                    className={`flex flex-col items-center gap-1 px-4 py-3 text-center transition-all duration-150 min-w-[80px] border-b-2
                      ${isActive
                        ? 'border-green-600 text-green-700'
                        : 'border-transparent text-slate-600 hover:text-green-700 hover:border-green-300'
                      }`}
                  >
                    <span className="text-xl leading-none">{cat.emoji}</span>
                    <span className="text-[11px] font-semibold leading-tight whitespace-nowrap">{cat.label}</span>
                  </Link>
                </div>
              );
            })}

            <Link
              href="/fornecedores"
              className="flex flex-col items-center gap-1 px-4 py-3 text-center min-w-[72px] shrink-0 border-b-2 border-transparent text-slate-400 hover:text-green-600 hover:border-green-300 transition-all"
              onMouseEnter={() => setActiveCategory(null)}
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-[11px] font-semibold leading-tight">Ver todos</span>
            </Link>
          </div>
        </div>

        {/* Mega menu — painel full-width abaixo da barra */}
        {activeCategory && (() => {
          const cat = categories.find((c) => c.label === activeCategory);
          if (!cat) return null;
          return (
            <div
              className="absolute left-0 right-0 top-full z-50 bg-white border-b border-slate-200 shadow-lg"
              onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">
                  {cat.emoji} {cat.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="text-sm text-slate-700 bg-slate-50 hover:bg-green-50 hover:text-green-700 border border-slate-200 hover:border-green-300 rounded-full px-4 py-1.5 transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Hero principal: split layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* ── Esquerda: headline + busca + populares ── */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-slate-900 leading-none">680<span className="text-green-600">+</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Profissionais</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-slate-900 leading-none">120<span className="text-green-600">+</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Empresas SST</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-slate-900 leading-none">27</p>
                <p className="text-xs text-slate-500 mt-0.5">Estados</p>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Tudo o que sua empresa<br />
              precisa em <span className="text-green-600">SST</span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 mb-7 max-w-lg">
              Encontre profissionais, clínicas e fornecedores verificados para saúde e segurança do trabalho.
            </p>

            {/* Busca */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white border-2 border-slate-200 rounded-full shadow-sm pl-5 pr-2 py-2 focus-within:border-green-500 focus-within:shadow-md transition-all max-w-xl"
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

            {/* Populares */}
            <div className="mt-4 flex flex-wrap gap-2 items-center justify-center md:justify-start">
              <span className="text-sm text-slate-500 font-medium">Populares:</span>
              {POPULARES.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="text-sm text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-colors"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Direita: boneco ── */}
          <div className="hidden md:flex items-start justify-center shrink-0 w-96 lg:w-[480px] -mt-36">
            <img
              src="/boneco_acheisst.png"
              alt="Profissional AcheiSST"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>

        </div>
      </div>

    </section>
  );
}
