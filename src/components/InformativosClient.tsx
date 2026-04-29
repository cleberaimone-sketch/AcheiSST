'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import type { PostMeta } from '@/lib/posts'
import { Flame, Clock, TrendingUp, Zap, Filter } from 'lucide-react'

function formatDateG1(dateStr: string) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr
}

const CATEGORY_BADGE: Record<string, string> = {
  'Legislativo':       'bg-violet-100 text-violet-700',
  'Estatísticas':      'bg-orange-100 text-orange-700',
  'Saúde Ocupacional': 'bg-teal-100 text-teal-700',
  'Segurança':         'bg-red-100 text-red-700',
  'Mercado & Fiscalização': 'bg-amber-100 text-amber-800',
  'eSocial':           'bg-blue-100 text-blue-700',
}

function CategoryBadge({ cat }: { cat: string }) {
  const cls = CATEGORY_BADGE[cat] ?? 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${cls}`}>
      {cat}
    </span>
  )
}

const ALL_CATEGORIES = ['Todos', 'Legislativo', 'Estatísticas', 'Saúde Ocupacional', 'Segurança', 'Mercado & Fiscalização', 'eSocial']

export default function InformativosClient({ posts }: { posts: PostMeta[] }) {
  const [activeCategory, setActiveCategory] = useState('Todos')

  if (!posts || posts.length === 0) return <div>Carregando notícias...</div>

  const filtered = activeCategory === 'Todos'
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  const manchete   = filtered[0]
  const destaque2  = filtered[1] || filtered[0]
  const destaque3  = filtered[2] || filtered[0]
  const listagem   = filtered.slice(3)

  const categoriesPresent = ['Todos', ...Array.from(new Set(posts.map((p) => p.category)))]

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-100 pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Atualizado diariamente
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Notícias <span className="text-green-600">SST</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Legislação, NRs, eSocial, fiscalização e muito mais
              </p>
            </div>
            <div className="hidden md:flex text-sm font-semibold text-slate-500 gap-6">
              <a href="#" className="hover:text-green-600 transition">Fiscalizações</a>
              <a href="#" className="hover:text-green-600 transition">eSocial</a>
              <a href="#" className="hover:text-green-600 transition">Normas</a>
            </div>
          </div>

          {/* Filtros por categoria */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {categoriesPresent.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  activeCategory === cat
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-green-200 hover:text-green-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {filtered.length === 0 ? (
          <div className="py-24 text-center text-slate-400">
            <p className="font-semibold">Nenhuma notícia nesta categoria ainda.</p>
            <button onClick={() => setActiveCategory('Todos')} className="mt-3 text-sm text-green-600 hover:underline">
              Ver todas
            </button>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 border-b border-slate-200 pb-12">

              {/* Manchete principal */}
              <a href={`/informativos/${manchete.slug}`} className="col-span-1 lg:col-span-8 group cursor-pointer block hover:opacity-95 transition-opacity">
                <div className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={manchete.image_url}
                    alt={manchete.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryBadge cat={manchete.category} />
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/15 px-2 py-0.5 rounded-md">
                        <Zap className="w-2.5 h-2.5" /> DESTAQUE
                      </span>
                    </div>
                    <h2 className="text-white text-2xl md:text-4xl font-extrabold tracking-tight leading-snug mb-3 group-hover:underline decoration-white/50 underline-offset-4">
                      {manchete.title}
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base line-clamp-2 md:w-4/5 font-medium">
                      {manchete.summary}
                    </p>
                    <p className="text-slate-500 text-xs mt-3 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {formatDateG1(manchete.published_at)} · {manchete.source_name}
                    </p>
                  </div>
                </div>
              </a>

              {/* Destaques laterais */}
              <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
                <a href={`/informativos/${destaque2.slug}`} className="group flex flex-col gap-3 pb-6 border-b border-slate-200">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative shadow">
                    <img
                      src={destaque2.image_url}
                      alt={destaque2.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <CategoryBadge cat={destaque2.category} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-green-700 transition-colors">
                    {destaque2.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {formatDateG1(destaque2.published_at)}
                  </p>
                </a>

                <a href={`/informativos/${destaque3.slug}`} className="group flex flex-col gap-2">
                  <CategoryBadge cat={destaque3.category} />
                  <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-green-700 transition-colors">
                    {destaque3.title}
                  </h3>
                  <p className="text-sm line-clamp-3 text-slate-600">{destaque3.summary}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3" /> {formatDateG1(destaque3.published_at)} · {destaque3.source_name}
                  </p>
                </a>
              </div>
            </div>

            {/* Últimas + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* Lista de notícias */}
              <div className="col-span-1 lg:col-span-8">
                <div className="flex items-center gap-2 border-b-2 border-green-600 pb-2 mb-8">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-black uppercase text-slate-900">Últimas Publicações</h2>
                </div>

                {listagem.length === 0 ? (
                  <p className="text-slate-400 italic text-sm">Mais notícias em breve.</p>
                ) : (
                  <div className="flex flex-col gap-0">
                    {listagem.map((post) => (
                      <a
                        key={post.slug}
                        href={`/informativos/${post.slug}`}
                        className="group flex flex-col sm:flex-row gap-5 items-start border-b border-slate-100 py-6 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 rounded-xl px-3 -mx-3 transition-all"
                      >
                        <div className="w-full sm:w-52 h-36 shrink-0 rounded-xl overflow-hidden shadow-sm bg-slate-100">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col flex-1">
                          <CategoryBadge cat={post.category} />
                          <h3 className="text-base font-bold leading-snug mt-2 mb-1 text-slate-900 group-hover:text-green-700 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">{post.summary}</p>
                          <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-auto">
                            <Clock className="w-3 h-3" /> {formatDateG1(post.published_at)} · {post.source_name}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="col-span-1 lg:col-span-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
                  <div className="flex items-center gap-2 mb-5">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Mais Lidas</h3>
                  </div>
                  <div className="flex flex-col gap-5">
                    {posts.slice(0, 5).map((p, i) => (
                      <a key={p.slug} href={`/informativos/${p.slug}`} className="flex gap-3 items-start group">
                        <span className="text-3xl font-black text-green-100 mt-[-6px] leading-none">{i + 1}</span>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-green-700 transition-colors leading-snug">
                          {p.title}
                        </h4>
                      </a>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <a
                      href="/profissionais"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-xl shadow-sm w-full flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      Encontrar especialista SST <TrendingUp className="w-4 h-4" />
                    </a>
                    <p className="text-xs text-center text-slate-400 mt-3">
                      Sua empresa teve um acidente recente? Busque um profissional na sua região.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  )
}
