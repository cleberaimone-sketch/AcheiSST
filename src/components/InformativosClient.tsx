'use client'

import { Navbar } from '@/components/Navbar'
import type { PostMeta } from '@/lib/posts'
import { Flame, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

function formatDateG1(dateStr: string) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr
}

export default function InformativosClient({ posts }: { posts: PostMeta[] }) {
  const { theme } = useTheme()
  const isBlue = theme === 'blue_hub'
  const isV5 = theme === 'preview_5'

  if (!posts || posts.length === 0) return <div>Carregando notícias...</div>

  const manchete = posts[0]
  const destaque2 = posts[1] || posts[0]
  const destaque3 = posts[2] || posts[0]
  const listagem = posts.slice(3)

  const accent = isV5 ? 'text-green-400' : isBlue ? 'text-blue-400' : 'text-green-600'
  const accentHover = isV5 ? 'group-hover:text-green-400' : isBlue ? 'group-hover:text-blue-700' : 'group-hover:text-green-700'
  const accentBorder = isV5 ? 'border-green-500' : isBlue ? 'border-blue-600' : 'border-green-600'

  return (
    <div className={`${isV5 ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen font-sans transition-colors duration-500`}>
      <Navbar />

      {/* Top Banner — limpo, sem foto, padrão acheisst */}
      {isBlue ? (
        <div className="bg-blue-900/90 w-full pt-28 pb-6 bg-[url('https://images.unsplash.com/photo-1558402529-d2638a7023e9?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <AlertTriangle className="w-8 h-8 text-blue-400" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Notícias<span className="text-blue-400">SST</span>
              </h1>
            </div>
            <div className="hidden md:flex text-blue-200 font-bold text-sm items-center gap-6 uppercase tracking-wider">
              <a href="#" className="hover:text-white transition">Fiscalizações</a>
              <a href="#" className="hover:text-white transition">eSocial</a>
              <a href="#" className="hover:text-white transition">Normas</a>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${isV5 ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'} border-b pt-28 pb-8`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 ${isV5 ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-green-100 text-green-800'} text-xs font-bold px-3 py-1 rounded-full mb-3`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isV5 ? 'bg-green-400' : 'bg-green-500'} animate-pulse`} />
                Atualizado diariamente
              </div>
              <h1 className={`text-3xl font-extrabold tracking-tight ${isV5 ? 'text-white' : 'text-slate-800'}`}>
                Notícias <span className={isV5 ? 'text-green-400' : 'text-green-600'}>SST</span>
              </h1>
              <p className={`text-sm mt-1 ${isV5 ? 'text-slate-400' : 'text-slate-500'}`}>
                Saúde e Segurança do Trabalho — legislação, NRs, eSocial e mais
              </p>
            </div>
            <div className={`hidden md:flex font-semibold text-sm items-center gap-6 ${isV5 ? 'text-slate-400' : 'text-slate-500'}`}>
              <a href="#" className={`hover:${isV5 ? 'text-green-400' : 'text-green-600'} transition`}>Fiscalizações</a>
              <a href="#" className={`hover:${isV5 ? 'text-green-400' : 'text-green-600'} transition`}>eSocial</a>
              <a href="#" className={`hover:${isV5 ? 'text-green-400' : 'text-green-600'} transition`}>Normas</a>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Featured Section */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 border-b pb-12 ${isV5 ? 'border-slate-800' : 'border-slate-200'}`}>

          {/* Main Manchete */}
          <div className="col-span-1 lg:col-span-8 group cursor-pointer block hover:opacity-95 transition-opacity">
            <a href={`/informativos/${manchete.slug}`}>
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden mb-4 shadow-xl">
                <img src={manchete.image_url} alt={manchete.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 block via-slate-900/60 to-transparent flex flex-col justify-end p-8">
                  <span className={`${accent} bg-black/30 font-black text-sm uppercase tracking-widest mb-3 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10`}>{manchete.category}</span>
                  <h2 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 group-hover:underline decoration-white/50 underline-offset-4">
                    {manchete.title}
                  </h2>
                  <p className="text-slate-300 text-lg line-clamp-2 md:w-4/5 font-medium">{manchete.summary}</p>
                </div>
              </div>
            </a>
          </div>

          {/* Side Highlights */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <a href={`/informativos/${destaque2.slug}`} className={`group flex flex-col gap-4 pb-6 border-b ${isV5 ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="w-full h-48 rounded-2xl overflow-hidden relative shadow-md">
                <img src={destaque2.image_url} alt={destaque2.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className={`absolute top-2 left-2 ${isV5 ? 'bg-green-500 text-slate-950' : 'bg-green-600 text-white'} text-[10px] font-black uppercase px-2 py-1 rounded-lg`}>Urgente</span>
              </div>
              <h3 className={`text-2xl font-bold leading-tight ${isV5 ? 'text-white' : 'text-slate-900'} ${accentHover} transition-colors`}>
                {destaque2.title}
              </h3>
            </a>

            <a href={`/informativos/${destaque3.slug}`} className="group flex flex-col gap-3">
              <span className={`${accent} font-bold text-xs uppercase tracking-widest`}>{destaque3.category}</span>
              <h3 className={`text-2xl font-bold leading-tight ${isV5 ? 'text-white' : 'text-slate-900'} ${accentHover} transition-colors`}>
                {destaque3.title}
              </h3>
              <p className={`text-sm line-clamp-3 ${isV5 ? 'text-slate-400' : 'text-slate-600'}`}>{destaque3.summary}</p>
            </a>
          </div>
        </div>

        {/* Latest News */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="col-span-1 lg:col-span-8">
            <div className={`flex items-center gap-2 border-b-2 ${accentBorder} pb-2 mb-8`}>
              <Clock className={`w-5 h-5 ${accent}`} />
              <h2 className={`text-2xl font-black uppercase ${isV5 ? 'text-white' : 'text-slate-900'}`}>Últimas Publicações</h2>
            </div>

            <div className="flex flex-col gap-8">
              {listagem.length === 0 ? (
                <div className="text-slate-500 italic">Mais notícias carregando...</div>
              ) : listagem.map((post) => (
                <a key={post.slug} href={`/informativos/${post.slug}`} className={`flex flex-col md:flex-row gap-6 group items-start border-b pb-8 last:border-0 p-3 -mx-3 rounded-2xl transition-colors ${
                  isV5 ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-100 hover:bg-white hover:shadow-md hover:shadow-slate-200/50'
                }`}>
                  <div className={`w-full md:w-64 h-40 shrink-0 rounded-2xl overflow-hidden shadow-sm border ${isV5 ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-100'}`}>
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className={`${accent} font-bold text-xs uppercase tracking-widest mb-2`}>{post.category}</span>
                    <h3 className={`text-xl font-bold leading-snug mb-2 ${isV5 ? 'text-white' : 'text-slate-900'} ${accentHover} transition-colors`}>{post.title}</h3>
                    <p className={`text-sm mb-3 line-clamp-2 ${isV5 ? 'text-slate-400' : 'text-slate-600'}`}>{post.summary}</p>
                    <span className="text-slate-400 text-xs font-bold mt-auto items-center flex gap-1">
                      <Clock className="w-3 h-3" /> {formatDateG1(post.published_at)} • Por {post.source_name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 lg:col-span-4">
            <div className={`${isV5 ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 rounded-2xl border shadow-sm sticky top-24`}>
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className={`text-lg font-black uppercase tracking-tight ${isV5 ? 'text-white' : 'text-slate-900'}`}>Mais Lidas</h3>
              </div>
              <div className="flex flex-col gap-5">
                {[1, 2, 3].map((num, i) => {
                  const highlight = posts[i + 2] || posts[0]
                  return (
                    <a key={num} href={`/informativos/${highlight?.slug}`} className="flex gap-4 items-start group">
                      <span className={`text-4xl font-black mt-[-8px] ${isV5 ? 'text-slate-700' : 'text-green-100'}`}>{num}</span>
                      <h4 className={`font-bold text-sm leading-snug ${isV5 ? 'text-slate-300 group-hover:text-green-400' : 'text-slate-800 group-hover:text-green-700'} transition-colors`}>{highlight?.title}</h4>
                    </a>
                  )
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <a href="/profissionais" className="bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-xl shadow-lg shadow-black/10 w-full flex items-center justify-center gap-2 transition-colors">
                  Procurar Especialista Regional <TrendingUp className="w-5 h-5" />
                </a>
                <p className="text-xs text-center text-slate-500 mt-3 font-medium">Sua empresa teve casos recentes? Busque parceiros SST para consultoria na sua região.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
