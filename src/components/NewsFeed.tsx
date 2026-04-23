'use client'

import { useState } from 'react'
import { ArrowRight, MapPin, Search, Star, ExternalLink, MessageCircle } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'
import { useTheme } from '@/components/ThemeProvider'

// Para o FeedHub vamos focar na conexão. Vamos simular empresas SST com base nas notícias.
export function NewsFeed({ posts, compact = false }: { posts: PostMeta[], compact?: boolean }) {
  const [search, setSearch] = useState('')
  const { theme } = useTheme()
  const isMin = theme === 'brazil_min'

  return (
    <section className={`${isMin ? 'bg-white' : 'bg-slate-50'} py-24 pb-32 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header do Feed/Hub */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Encontre os especialistas</h2>
            <p className="text-xl text-slate-600">Não arrisque penalidades pelas NRs. Conecte-se às melhores clínicas, engenharias e técnicos em sua região diretamente com nossa IA.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Ex: PPRA, Ergonomia, Medicina em SP..."
              className={`w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 shadow-sm focus:ring-4 ${isMin ? 'focus:ring-green-100 focus:border-green-600' : 'focus:ring-blue-100 focus:border-blue-600'} outline-none transition-all`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Grid Magazine Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 6).map((post, i) => (
            <div key={i} className={`bg-white rounded-[2rem] p-4 border border-slate-100 shadow-xl ${isMin ? 'shadow-green-900/5 hover:shadow-green-900/10' : 'shadow-slate-200/40 hover:shadow-blue-900/10'} hover:shadow-2xl transition-all duration-300 group flex flex-col`}>
              
              <div className="relative w-full h-56 rounded-3xl overflow-hidden mb-6">
                <img 
                  src={post.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Top Rated
                </div>
              </div>

              <div className="px-2 flex-1 flex flex-col">
                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isMin ? 'text-green-600' : 'text-blue-600'} mb-3`}>
                  <span className={`${isMin ? 'bg-green-100' : 'bg-blue-100'} px-2 py-1 rounded-md`}>{post.category}</span>
                  {post.uf && <span className="text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {post.uf}</span>}
                </div>

                <h3 className={`text-2xl font-bold text-slate-900 leading-tight mb-3 ${isMin ? 'group-hover:text-green-600' : 'group-hover:text-blue-600'} transition-colors`}>
                  {post.title}
                </h3>
                <p className="text-slate-500 line-clamp-2 text-sm mb-6 flex-1">
                  Especialistas capacitados de acordo com a {post.category}. {post.summary}
                </p>

                <div className="flex gap-2">
                  <button className={`flex-1 ${isMin ? 'bg-green-50 hover:bg-green-600 hover:text-white text-green-700' : 'bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700'} font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2`}>
                    <MessageCircle className="w-4 h-4" /> Contato
                  </button>
                  <a href={`/informativos/${post.slug}`} className="w-12 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className={`${isMin ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' : 'bg-slate-900 hover:bg-slate-800'} text-white px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center shadow-lg gap-2 transition-transform hover:-translate-y-1`}>
            Explorar todas as clínicas e prestadores
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  )
}
