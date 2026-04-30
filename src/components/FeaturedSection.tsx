import Link from 'next/link'
import { Star, ArrowRight, MapPin, Sparkles, Crown, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LikeCardButton } from './LikeCardButton'

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
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-lg">
      {initials}
    </div>
  )
}

function PatrocineBanner({ href, texto }: { href: string; texto: string }) {
  return (
    <div className="my-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
          <Crown className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{texto}</p>
          <p className="text-xs text-slate-500">Apareça em destaque para milhares de empresas SST</p>
        </div>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
      >
        <TrendingUp className="w-3.5 h-3.5" />
        Patrocine sua marca
      </Link>
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
      .select('id, nome, slug, cidade, uf, logo_url, avaliacao, num_avaliacoes')
      .eq('categoria', 'clinica')
      .order('num_avaliacoes', { ascending: false })
      .limit(5),
  ])

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── Profissionais em Destaque ── */}
        <div>
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                  Mais avaliados
                </p>
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> Destaques Premium
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Profissionais em Destaque
              </h2>
            </div>
            <Link href="/profissionais" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 shrink-0">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(profissionais ?? []).map((p, i) => (
              <Link
                key={p.id}
                href="/profissionais"
                className="group relative bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center hover:border-amber-200 hover:shadow-md transition-all"
              >
                {/* Coroa para o 1º */}
                {i === 0 && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="text-lg">👑</span>
                  </div>
                )}

                <LikeCardButton id={String(p.id)} type="profissional" />

                <div className={`w-16 h-16 rounded-full overflow-hidden mb-3 shrink-0 ${i === 0 ? 'ring-2 ring-amber-400' : 'ring-2 ring-slate-100 group-hover:ring-green-200'}`}>
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
            <Link href="/profissionais" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
              Ver todos os profissionais <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <PatrocineBanner href="/planos" texto="Você é profissional SST? Apareça aqui." />
        </div>

        {/* ── Banner Fornecedor ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl px-6 py-7 flex items-center justify-between gap-4">
          {/* Círculo decorativo */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
          </div>

          <div className="relative z-10 max-w-sm">
            <h3 className="text-white font-extrabold text-xl leading-tight mb-1">
              É fornecedor de SST?
            </h3>
            <p className="text-blue-200 text-sm mb-4 leading-relaxed">
              Cadastre-se e alcance milhares de empresas que buscam seus serviços.
            </p>
            <Link
              href="/painel/cadastrar"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              Cadastrar meu negócio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Clínicas em Destaque ── */}
        <div>
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                  Medicina Ocupacional
                </p>
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> Destaques Premium
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Clínicas em Destaque
              </h2>
            </div>
            <Link href="/fornecedores?cat=clinica" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 shrink-0">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {(clinicas ?? []).map((c, i) => (
              <Link
                key={c.id}
                href={`/fornecedores/${c.slug}`}
                className="group relative bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center hover:border-amber-200 hover:shadow-md transition-all"
              >
                {i === 0 && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="text-lg">👑</span>
                  </div>
                )}

                <LikeCardButton id={String(c.id)} type="clinica" />

                <div className={`w-16 h-16 rounded-xl overflow-hidden mb-3 shrink-0 bg-slate-50 flex items-center justify-center ${i === 0 ? 'ring-2 ring-amber-400' : 'ring-2 ring-slate-100 group-hover:ring-green-200'}`}>
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
            <Link href="/fornecedores?cat=clinica" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600">
              Ver todas as clínicas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <PatrocineBanner href="/planos" texto="Sua clínica quer aparecer em destaque?" />
        </div>

      </div>
    </section>
  )
}
