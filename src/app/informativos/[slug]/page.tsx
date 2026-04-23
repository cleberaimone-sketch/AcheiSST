import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import {
  Calendar,
  Tag,
  MapPin,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
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
    title: `${post.title} — Ecossistema SST Brasil`,
    description: post.summary,
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  Legislativo: 'bg-violet-100 text-violet-700 border-violet-200',
  'Saúde Ocupacional': 'bg-teal-100 text-teal-700 border-teal-200',
  Segurança: 'bg-orange-100 text-orange-700 border-orange-200',
  Regional: 'bg-blue-100 text-blue-700 border-blue-200',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function InformativoPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-dvh bg-slate-50">

        {/* Breadcrumb + header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <a href="/" className="hover:text-slate-700 transition-colors">Início</a>
              <span>/</span>
              <a href="/informativos" className="hover:text-slate-700 transition-colors">Informativos</a>
              <span>/</span>
              <span className="text-slate-600 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Categoria + UF */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${colorClass}`}>
                <Tag className="w-3 h-3" aria-hidden="true" />
                {post.category}
              </span>
              {post.uf && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {post.uf}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-5">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </div>
              {post.source_name && (
                <span className="text-slate-400">·</span>
              )}
              {post.source_name && (
                <span className="font-medium text-slate-600">{post.source_name}</span>
              )}
              {post.source_url && (
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  Ver fonte oficial
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>

            {/* Resumo destacado */}
            <blockquote className="mt-6 pl-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-xl py-3 pr-4">
              <p className="text-slate-700 text-base leading-relaxed font-medium">{post.summary}</p>
            </blockquote>
          </div>
        </div>

        {/* Conteúdo Markdown */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-slate-800
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-ul:text-slate-700 prose-ol:text-slate-700
              prose-li:leading-relaxed prose-li:my-1
              prose-table:text-sm prose-thead:bg-slate-100
              prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-slate-700
              prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-slate-200
              prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-xl prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:not-italic
              prose-blockquote:text-slate-700
              prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-slate-900 prose-pre:text-slate-100"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</p>
              <div className="flex flex-wrap gap-2" aria-label="Tags do informativo">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Aviso de verificação */}
          <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Atenção:</strong> Este conteúdo é gerado automaticamente com IA a partir de fontes oficiais.
              Sempre verifique a legislação vigente na fonte original antes de tomar decisões.
            </p>
          </div>

          {/* Voltar */}
          <div className="mt-10">
            <a
              href="/informativos"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Voltar para informativos
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
