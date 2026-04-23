'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Star, Heart, MapPin, ChevronRight } from 'lucide-react'
import type { Profissional } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function ProfissionaisDestaques() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfissionais() {
      try {
        const { data, error } = await supabase
          .from('profissionais')
          .select('*')
          .eq('verified', true)
          .gte('avaliacao', 4.7)
          .order('avaliacao', { ascending: false })
          .order('num_avaliacoes', { ascending: false })
          .limit(6)

        if (error) throw error
        setProfissionais(data || [])
      } catch (err) {
        console.error('Erro ao buscar profissionais:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfissionais()
  }, [])

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <p className="text-slate-500">Carregando profissionais...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Profissionais em Destaque</h2>
            <p className="text-slate-600 text-sm mt-1">Especialistas verificados e altamente recomendados</p>
          </div>
          <a
            href="/profissionais"
            className="text-sm font-semibold text-navy-600 hover:text-navy-700 flex items-center gap-1 transition-colors"
          >
            Ver todos <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profissionais.map((prof) => (
            <a
              key={prof.id}
              href={`/profissionais/${prof.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-navy-300 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Imagem Container */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {prof.foto_url ? (
                  <img
                    src={prof.foto_url}
                    alt={prof.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500">
                    <span className="text-sm font-semibold">Sem foto</span>
                  </div>
                )}

                {/* Like Button (top right) */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleLike(prof.id)
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      liked.has(prof.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-slate-400 hover:text-red-500'
                    }`}
                  />
                </button>

                {/* Verified Badge */}
                {prof.verified && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    ✓ Verificado
                  </div>
                )}
              </div>

              {/* Info Container */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Nome e Especialidade */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {prof.nome}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                    {prof.especialidade}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-900">{prof.avaliacao?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <span className="text-xs text-slate-500">({prof.num_avaliacoes})</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-slate-600 mt-auto">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="line-clamp-1">{prof.cidade}, {prof.uf}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {profissionais.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Nenhum profissional encontrado</p>
          </div>
        )}
      </div>
    </section>
  )
}
