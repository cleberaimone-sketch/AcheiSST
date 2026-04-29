import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import type { PostStat } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import {
  Calendar,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Clock,
  TrendingUp,
  MapPin,
  Tag,
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} — AcheiSST`,
    description: post.summary,
    openGraph: { images: [post.image_url] },
  }
}

const CATEGORY_STYLE: Record<string, { badge: string; bar: string }> = {
  'Legislativo':            { badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-500' },
  'Estatísticas':           { badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500' },
  'Saúde Ocupacional':      { badge: 'bg-teal-100 text-teal-700',     bar: 'bg-teal-500'   },
  'Segurança':              { badge: 'bg-red-100 text-red-700',        bar: 'bg-red-500'    },
  'Mercado & Fiscalização': { badge: 'bg-amber-100 text-amber-800',   bar: 'bg-amber-500'  },
  'eSocial':                { badge: 'bg-blue-100 text-blue-700',      bar: 'bg-blue-500'   },
}

const STAT_COLOR: Record<string, string> = {
  red:    'bg-red-50 border-red-200 text-red-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  green:  'bg-green-50 border-green-200 text-green-700',
  blue:   'bg-blue-50 border-blue-200 text-blue-700',
  violet: 'bg-violet-50 border-violet-200 text-violet-700',
}

function StatCard({ stat }: { stat: PostStat }) {
  const cls = STAT_COLOR[stat.color ?? 'blue']
  return (
    <div className={`flex flex-col items-center justify-center text-center border rounded-2xl p-4 md:p-5 ${cls}`}>
      <span className="text-2xl md:text-3xl font-black tracking-tight leading-none mb-1">
        {stat.value}
      </span>
      <span className="text-xs font-semibold leading-tight opacity-80">{stat.label}</span>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default async function InformativoPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const catStyle = CATEGORY_STYLE[post.category] ?? { badge: 'bg-slate-100 text-slate-700', bar: 'bg-slate-400' }
  const allPosts = getAllPosts()
  const related  = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-slate-50">

        {/* ── Hero image com título overlay ─────────────────────────── */}
        <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/20" />

          {/* Conteúdo sobre a imagem */}
          <div className="absolute inset-0 flex flex-col justify-end max-w-5xl mx-auto px-4 sm:px-6 pb-8 md:pb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <a href="/" className="hover:text-white transition-colors">Início</a>
              <span>/</span>
              <a href="/informativos" className="hover:text-white transition-colors">Notícias</a>
              <span>/</span>
              <span className="text-slate-300 truncate max-w-[180px]">{post.title}</span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${catStyle.badge}`}>
                {post.category}
              </span>
              {post.uf && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full">
                  <MapPin className="w-2.5 h-2.5" /> {post.uf}
                </span>
              )}
              {post.read_time && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full">
                  <Clock className="w-2.5 h-2.5" /> {post.read_time} min de leitura
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-snug tracking-tight max-w-3xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.published_at)}
              </span>
              {post.source_name && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-slate-300">{post.source_name}</span>
                </>
              )}
              {post.source_url && (
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 font-semibold transition-colors"
                >
                  Ver fonte <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Barra de categoria colorida ───────────────────────────── */}
        <div className={`h-1.5 w-full ${catStyle.bar}`} />

        {/* ── Conteúdo principal ────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Artigo */}
            <article className="col-span-1 lg:col-span-8">

              {/* Resumo destacado */}
              <div className="bg-white border-l-4 border-green-500 rounded-r-2xl px-6 py-5 shadow-sm mb-8">
                <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
                  {post.summary}
                </p>
              </div>

              {/* Stats cards — só aparecem se o post tiver stats */}
              {post.stats && post.stats.length > 0 && (
                <div className={`grid gap-3 mb-10 grid-cols-2 ${post.stats.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                  {post.stats.map((s) => (
                    <StatCard key={s.label} stat={s} />
                  ))}
                </div>
              )}

              {/* Corpo do artigo em Markdown */}
              <div
                className="prose prose-slate prose-base md:prose-lg max-w-none
                  prose-headings:font-extrabold prose-headings:text-slate-900 prose-headings:tracking-tight
                  prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3
                  prose-h2:border-b-[3px] prose-h2:border-green-200
                  prose-h3:text-base prose-h3:mt-7 prose-h3:mb-3 prose-h3:text-slate-800
                  prose-h3:pl-3 prose-h3:border-l-4 prose-h3:border-green-400
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-green-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900 prose-strong:font-extrabold
                  prose-ul:text-slate-700 prose-ol:text-slate-700
                  prose-li:leading-relaxed prose-li:my-1.5
                  prose-blockquote:border-l-[5px] prose-blockquote:border-green-500
                  prose-blockquote:bg-green-50 prose-blockquote:rounded-r-2xl
                  prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic
                  prose-blockquote:text-slate-800 prose-blockquote:font-semibold prose-blockquote:text-lg
                  prose-blockquote:shadow-sm
                  prose-hr:border-0 prose-hr:h-px prose-hr:my-10
                  prose-hr:bg-gradient-to-r prose-hr:from-transparent prose-hr:via-slate-300 prose-hr:to-transparent
                  prose-table:text-sm prose-thead:bg-slate-100
                  prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
                  prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-slate-200"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full hover:border-green-300 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Aviso de fonte */}
              <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-900 leading-relaxed">
                  <strong>Conteúdo verificado:</strong> Todas as informações publicadas no AcheiSST são baseadas em fontes oficiais e verificáveis.
                  Consulte sempre a fonte original antes de tomar decisões técnicas ou legais.
                  {post.source_url && (
                    <> {' · '}
                      <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                        Acessar fonte
                      </a>
                    </>
                  )}
                </p>
              </div>

              {/* Voltar */}
              <div className="mt-8">
                <a href="/informativos" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-green-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Voltar para notícias
                </a>
              </div>
            </article>

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside className="col-span-1 lg:col-span-4 flex flex-col gap-6">

              {/* Sobre a notícia */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sobre esta notícia</p>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-start gap-2.5 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  {post.read_time && (
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{post.read_time} minutos de leitura</span>
                    </div>
                  )}
                  {post.source_name && (
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>Fonte: <strong>{post.source_name}</strong></span>
                    </div>
                  )}
                  {post.uf && (
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>Estado: <strong>{post.uf}</strong></span>
                    </div>
                  )}
                </div>
                {post.source_url && (
                  <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl transition-colors"
                  >
                    Ver fonte original <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Relacionadas */}
              {related.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Notícias relacionadas</p>
                  <div className="flex flex-col gap-4">
                    {related.map((r) => (
                      <a key={r.slug} href={`/informativos/${r.slug}`} className="group flex gap-3 items-start">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                          <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-green-700 leading-snug transition-colors line-clamp-3">
                          {r.title}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-green-200 mb-2">Precisa de ajuda?</p>
                <h3 className="font-extrabold text-base leading-snug mb-3">
                  Encontre um especialista SST na sua região
                </h3>
                <a
                  href="/profissionais"
                  className="flex items-center justify-center gap-2 w-full bg-white text-green-700 font-bold text-xs px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  Buscar profissional <TrendingUp className="w-3.5 h-3.5" />
                </a>
              </div>

            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
