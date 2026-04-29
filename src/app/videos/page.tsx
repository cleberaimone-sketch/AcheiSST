import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { VideosGrid } from '@/components/VideosGrid'

export const metadata = {
  title: 'Vídeos e Podcasts SST — AcheiSST',
  description: 'Assista aos melhores vídeos e podcasts sobre Saúde e Segurança do Trabalho: NRs, EPI, PGR, medicina do trabalho e muito mais.',
}

export const revalidate = 3600

export default async function VideosPage() {
  const { data } = await supabase
    .from('videos')
    .select('*')
    .order('published_at', { ascending: false })

  const videos = (data ?? []).map((v) => ({
    id:            String(v.id),
    youtube_id:    v.youtube_id as string,
    title:         v.title as string,
    description:   v.description as string | null,
    thumbnail_url: v.thumbnail_url as string | null,
    channel_name:  v.channel_name as string,
    channel_id:    v.channel_id as string | null,
    published_at:  v.published_at as string | null,
    categoria:     (v.categoria ?? 'video') as 'video' | 'podcast' | 'short' | 'curso',
    tags:          (v.tags ?? []) as string[],
    view_count:    v.view_count as number | null,
    duration_seconds: v.duration_seconds as number | null,
    verified:      v.verified as boolean,
  }))

  const stats = {
    total:    videos.length,
    canais:   new Set(videos.map((v) => v.channel_name)).size,
    podcasts: videos.filter((v) => v.categoria === 'podcast').length,
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">

        {/* Hero */}
        <div className="bg-white border-b border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-5">
              <a href="/" className="hover:text-green-600 transition-colors">Início</a>
              <span>/</span>
              <span className="text-slate-700 font-medium">Vídeos & Podcasts</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  Vídeos &amp; Podcasts <span className="text-green-600">SST</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl">
                  Os melhores conteúdos sobre Saúde e Segurança do Trabalho: NRs, EPI, PGR, medicina ocupacional e muito mais.
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.total}</p>
                  <p className="text-xs text-slate-500">Conteúdos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.canais}</p>
                  <p className="text-xs text-slate-500">Canais</p>
                </div>
                {stats.podcasts > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.podcasts}</p>
                    <p className="text-xs text-slate-500">Podcasts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <VideosGrid videos={videos} />
      </main>
    </>
  )
}
