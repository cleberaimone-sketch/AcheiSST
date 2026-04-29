import Link from 'next/link'
import { Star, ArrowRight, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </span>
  )
}

function formatCount(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return String(n)
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-lg">
      {initials}
    </div>
  )
}

export default async function FeaturedSection() {
  const [{ data: profissionais }, { data: clinicas }] = await Promise.all([
    supabase
      .from('profissionais')
      .select('id, nome, especialidade, cidade, uf, foto_url, avaliacao, num_avaliacoes')
      .order('num_avaliacoes', { ascending: false })
      .limit(5),
    supabase
      .from('fornecedores')
      .select('id, nome, cidade, uf, logo_url, avaliacao, num_avaliacoes')
      .eq('categoria', 'clinica')
      .order('num_avaliacoes', { ascending: false })
      .limit(5),
  ])

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Profissionais em Destaque */}
        <div>
          <div className="flex items-end justify-between mb-7 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">
                Mais avaliados
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Profissionais em Destaque
              </h2>
            </div>
            <Link
              href="/profissionais"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 shrink-0"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(profissionais ?? []).map((p) => (
              <Link
                key={p.id}
                href="/profissionais"
                className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center hover:border-green-200 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-slate-100 group-hover:ring-green-200 mb-3 shrink-0">
                  {p.foto_url ? (
                    <img src={p.foto_url} alt={p.nome} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback name={p.nome} />
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-1">
                  {p.nome}
                </p>
                <p className="text-xs text-green-700 font-medium mb-2 line-clamp-1">
                  {p.especialidade}
                </p>
                {p.avaliacao && (
                  <div className="flex items-center gap-1 mb-1">
                    <StarRating value={Number(p.avaliacao)} />
                    {p.num_avaliacoes > 0 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatCount(p.num_avaliacoes)}
                      </span>
                    )}
                  </div>
                )}
                {p.cidade && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                    <MapPin className="w-2.5 h-2.5" /> {p.cidade}, {p.uf}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-4 sm:hidden">
            <Link
              href="/profissionais"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600"
            >
              Ver todos os profissionais <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Clínicas em Destaque */}
        <div>
          <div className="flex items-end justify-between mb-7 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">
                Medicina Ocupacional
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Clínicas em Destaque
              </h2>
            </div>
            <Link
              href="/fornecedores?cat=clinica"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 shrink-0"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(clinicas ?? []).map((c) => (
              <Link
                key={c.id}
                href="/fornecedores?cat=clinica"
                className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center hover:border-green-200 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-green-200 mb-3 shrink-0 bg-slate-50 flex items-center justify-center">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.nome} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🏥</span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                  {c.nome}
                </p>
                {c.avaliacao && (
                  <div className="flex items-center gap-1 mb-1">
                    <StarRating value={Number(c.avaliacao)} />
                    {c.num_avaliacoes > 0 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatCount(c.num_avaliacoes)}
                      </span>
                    )}
                  </div>
                )}
                {c.cidade && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                    <MapPin className="w-2.5 h-2.5" /> {c.cidade}, {c.uf}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-4 sm:hidden">
            <Link
              href="/fornecedores?cat=clinica"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600"
            >
              Ver todas as clínicas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
