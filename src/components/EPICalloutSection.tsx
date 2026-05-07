import Link from 'next/link'
import { ArrowRight, HardHat, ShieldCheck, Zap } from 'lucide-react'

const CATEGORIAS_EPI = [
  { emoji: '⛑️', label: 'Capacetes' },
  { emoji: '🧤', label: 'Luvas' },
  { emoji: '👢', label: 'Botas' },
  { emoji: '🥽', label: 'Óculos' },
  { emoji: '🎧', label: 'Proteção auditiva' },
  { emoji: '😷', label: 'Respiradores' },
  { emoji: '🦺', label: 'Coletes' },
  { emoji: '🧥', label: 'Uniformes' },
]

const STATS = [
  { value: '267', label: 'fornecedores' },
  { value: '27', label: 'estados' },
  { value: '100%', label: 'nacionais' },
]

export default function EPICalloutSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-10 md:py-12">
      {/* Fundo decorativo */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/15 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold mb-4">
              <HardHat className="w-3.5 h-3.5" />
              Equipamentos de Proteção Individual
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Do capacete às luvas,<br />
              <span className="text-green-400">temos tudo para sua obra.</span>
            </h2>
            <p className="text-slate-400 mt-3 text-base max-w-xl">
              Encontre distribuidores de EPI homologados em todo o Brasil. CA válido, entrega rápida, preço justo.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 md:gap-8 shrink-0">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-green-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grid de categorias EPI */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
          {CATEGORIAS_EPI.map(({ emoji, label }) => (
            <Link
              key={label}
              href="/fornecedores?cat=epi"
              className="group flex flex-col items-center gap-2 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 rounded-xl p-3 md:p-4 transition-all text-center"
            >
              <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{emoji}</span>
              <span className="text-[10px] md:text-xs font-medium text-slate-400 group-hover:text-green-300 leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA + badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/fornecedores?cat=epi"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-full transition-colors shadow-lg shadow-green-500/20 text-sm"
          >
            Ver todos os fornecedores de EPI <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> CA Inmetro válido
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-green-400" /> Cobertura nacional
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
