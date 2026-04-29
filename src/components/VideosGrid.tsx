'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Play, Clock, Tv2, Mic, BookOpen, Clapperboard, CheckCircle2, ExternalLink } from 'lucide-react'

interface Video {
  id: string
  youtube_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  channel_name: string
  channel_id: string | null
  published_at: string | null
  categoria: 'video' | 'podcast' | 'short' | 'curso'
  tags: string[]
  view_count: number | null
  duration_seconds: number | null
  verified: boolean
}

const CATEGORIA_CONFIG = {
  video:   { label: 'Vídeo',   icon: Tv2,         color: 'bg-blue-100 text-blue-700'   },
  podcast: { label: 'Podcast', icon: Mic,          color: 'bg-purple-100 text-purple-700' },
  short:   { label: 'Short',   icon: Clapperboard, color: 'bg-pink-100 text-pink-700'   },
  curso:   { label: 'Curso',   icon: BookOpen,     color: 'bg-amber-100 text-amber-700'  },
}

const TABS = [
  { label: 'Todos',    value: 'all'     },
  { label: 'Vídeos',   value: 'video'   },
  { label: 'Podcasts', value: 'podcast' },
  { label: 'Cursos',   value: 'curso'   },
  { label: 'Shorts',   value: 'short'   },
]

function formatDate(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

function formatDuration(secs: number | null) {
  if (!secs) return null
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// ── Modal de vídeo ────────────────────────────────────────────────────────────
function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const cfg = CATEGORIA_CONFIG[video.categoria]
  const Icon = cfg.icon

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Player 16:9 */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Info abaixo do player */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
                {video.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400">
                    <CheckCircle2 className="w-3 h-3" /> Curado pelo AcheiSST
                  </span>
                )}
              </div>
              <h2 className="text-white font-bold text-lg leading-snug mb-1">{video.title}</h2>
              <p className="text-slate-400 text-sm">{video.channel_name} · {formatDate(video.published_at)}</p>
              {video.description && (
                <p className="text-slate-400 text-xs mt-3 leading-relaxed line-clamp-3">{video.description}</p>
              )}
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {video.tags.map((t) => (
                    <span key={t} className="text-[10px] font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                YouTube
              </a>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Card de vídeo ─────────────────────────────────────────────────────────────
function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  const cfg = CATEGORIA_CONFIG[video.categoria]
  const Icon = cfg.icon
  const duration = formatDuration(video.duration_seconds)

  return (
    <article
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-full rounded-xl overflow-hidden bg-slate-200 mb-3" style={{ paddingTop: '56.25%' }}>
        {video.thumbnail_url && !imgErr ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
            <Play className="w-10 h-10 text-white/50" />
          </div>
        )}

        {/* Overlay com play no hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
            <Play className="w-5 h-5 text-slate-900 ml-0.5" />
          </div>
        </div>

        {/* Duração */}
        {duration && (
          <span className="absolute bottom-2 right-2 text-[11px] font-bold text-white bg-black/75 px-1.5 py-0.5 rounded">
            {duration}
          </span>
        )}

        {/* Categoria badge */}
        <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
          <Icon className="w-2.5 h-2.5" />
          {cfg.label}
        </span>
      </div>

      {/* Info */}
      <div className="flex gap-2.5">
        {/* Avatar do canal */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-[10px] font-black">
            {video.channel_name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 truncate">{video.channel_name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
            {video.view_count && (
              <span>{video.view_count.toLocaleString('pt-BR')} views</span>
            )}
            {video.view_count && video.published_at && <span>·</span>}
            {video.published_at && <span>{formatDate(video.published_at)}</span>}
          </div>
        </div>
      </div>
    </article>
  )
}

// ── Grid principal ────────────────────────────────────────────────────────────
interface VideosGridProps {
  videos: Video[]
}

export function VideosGrid({ videos }: VideosGridProps) {
  const [tab, setTab]       = useState<string>('all')
  const [search, setSearch] = useState('')
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  const filtered = videos.filter((v) => {
    const matchTab    = tab === 'all' || v.categoria === tab
    const matchSearch = !search
      || v.title.toLowerCase().includes(search.toLowerCase())
      || v.channel_name.toLowerCase().includes(search.toLowerCase())
      || v.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchTab && matchSearch
  })

  // Tabs visíveis apenas se há conteúdo daquela categoria
  const categoryCounts = {
    video:   videos.filter((v) => v.categoria === 'video').length,
    podcast: videos.filter((v) => v.categoria === 'podcast').length,
    curso:   videos.filter((v) => v.categoria === 'curso').length,
    short:   videos.filter((v) => v.categoria === 'short').length,
  }
  const visibleTabs = TABS.filter((t) => t.value === 'all' || (categoryCounts[t.value as keyof typeof categoryCounts] ?? 0) > 0)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Barra de busca + tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar vídeos, canais, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 bg-white rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {visibleTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                tab === t.value
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-green-200 hover:text-green-700'
              }`}
            >
              {t.label}
              {t.value !== 'all' && (
                <span className={`ml-1.5 text-xs ${tab === t.value ? 'text-green-200' : 'text-slate-400'}`}>
                  {categoryCounts[t.value as keyof typeof categoryCounts]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{filtered.length}</span>{' '}
          conteúdo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-green-600 hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Limpar busca
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} onClick={() => setActiveVideo(v)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <Tv2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Nenhum conteúdo encontrado.</p>
          <button onClick={() => { setSearch(''); setTab('all') }} className="mt-3 text-sm text-green-600 hover:underline">
            Ver todos
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Tem um canal de SST?</h3>
          <p className="text-green-100 text-sm">Indique seu canal e apareça aqui para milhares de profissionais SST.</p>
        </div>
        <a
          href="/cadastrar"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-green-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-sm"
        >
          Indicar canal
        </a>
      </div>

      {/* Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  )
}
