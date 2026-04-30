import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { LikeButtonDetail } from '@/components/LikeButtonDetail'
import {
  MapPin, MessageCircle, Phone, ArrowLeft, Star, Shield,
  CheckCircle2, Linkedin, Briefcase, BookOpen, Award, Clock,
} from 'lucide-react'

const FALLBACK_IMG: Record<string, string> = {
  'Médico do Trabalho':                'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80',
  'Técnico de Segurança do Trabalho':  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
  'Engenheiro de Segurança do Trabalho': 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80',
  'Enfermeiro do Trabalho':            'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=80',
}
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80'

function whatsappUrl(numero: string, nome: string) {
  const texto = encodeURIComponent(`Olá, ${nome}! Vi seu perfil no AcheiSST e gostaria de mais informações sobre seus serviços.`)
  return `https://wa.me/55${numero.replace(/\D/g, '')}?text=${texto}`
}

function StarRating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${s <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
          />
        ))}
      </div>
      <span className="font-bold text-slate-900">{value.toFixed(1)}</span>
      <span className="text-xs text-slate-500">({count} avaliações)</span>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabase
    .from('profissionais')
    .select('nome, especialidade, cidade, uf, bio')
    .eq('id', id)
    .single()
  if (!data) return {}
  return {
    title: `${data.nome} — ${data.especialidade} | AcheiSST`,
    description: data.bio
      ? data.bio.slice(0, 160)
      : `${data.nome} é ${data.especialidade} em ${data.cidade ?? ''}, ${data.uf}. Veja o perfil completo no AcheiSST.`,
  }
}

export default async function ProfissionalPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: p } = await supabase.from('profissionais').select('*').eq('id', id).single()

  if (!p) notFound()

  const heroImg = p.foto_url ?? FALLBACK_IMG[p.especialidade] ?? DEFAULT_FALLBACK

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">

        {/* HERO */}
        <div className="relative w-full h-64 sm:h-80 bg-slate-200 overflow-hidden">
          <img src={heroImg} alt={p.nome} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Like */}
          <div className="absolute top-4 right-4">
            <LikeButtonDetail id={String(p.id)} />
          </div>

          {/* Breadcrumb */}
          <div className="absolute top-4 left-4">
            <a
              href="/profissionais"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-black/30 backdrop-blur px-3 py-1.5 rounded-full hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Profissionais
            </a>
          </div>

          {/* Info sobreposta */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-4xl mx-auto flex items-end gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg flex-shrink-0">
                {p.foto_url ? (
                  <img src={p.foto_url} alt={p.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <span className="text-white font-extrabold text-2xl">
                      {p.nome.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-green-300 uppercase tracking-widest mb-0.5">
                  {p.especialidade}
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-1 truncate">
                  {p.nome}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 text-sm text-white/80">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {p.cidade ? `${p.cidade}, ` : ''}{p.uf}
                  </div>
                  {p.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-200 bg-green-900/50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Verificado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── COLUNA PRINCIPAL ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Card principal */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">

                {/* Rating */}
                {p.avaliacao != null && Number(p.avaliacao) > 0 && (
                  <div className="mb-4">
                    <StarRating value={Number(p.avaliacao)} count={p.num_avaliacoes ?? 0} />
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-slate-100">
                  {p.experiencia_anos && (
                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-600 mb-1">
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-xl font-bold text-slate-900">{p.experiencia_anos}+</p>
                      <p className="text-xs text-slate-500">Anos de exp.</p>
                    </div>
                  )}
                  {p.registro_profissional && (
                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-600 mb-1">
                        <Award className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 truncate">{p.registro_profissional}</p>
                      <p className="text-xs text-slate-500">Registro</p>
                    </div>
                  )}
                  {p.especialidade_tipo && (
                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-600 mb-1">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">{p.especialidade_tipo}</p>
                      <p className="text-xs text-slate-500">Perfil</p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {p.bio && (
                  <p className="text-slate-600 text-sm leading-relaxed">{p.bio}</p>
                )}
              </div>

              {/* Áreas de Atuação */}
              {p.areas_atuacao && Array.isArray(p.areas_atuacao) && p.areas_atuacao.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-500" />
                    Áreas de Atuação
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(p.areas_atuacao as string[]).map((area: string) => (
                      <div key={area} className="flex items-center gap-2.5 p-3 bg-green-50 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NRs */}
              {p.nrs_expertise && Array.isArray(p.nrs_expertise) && p.nrs_expertise.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Normas Regulamentadoras
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(p.nrs_expertise as string[]).map((nr: string) => (
                      <span
                        key={nr}
                        className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full"
                      >
                        {nr}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reivindique seu perfil */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Você é {p.nome}?
                    </h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      Reivindique seu perfil para atualizar suas informações, adicionar foto, descrever seus serviços e ser encontrado por mais empresas.
                    </p>
                    <a
                      href={`/planos?perfil=${p.id}`}
                      className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Reivindicar perfil
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SIDEBAR CONTATO ── */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 sticky top-24">
                <h2 className="text-sm font-bold text-slate-900">Entrar em contato</h2>

                {p.whatsapp && (
                  <a
                    href={whatsappUrl(p.whatsapp, p.nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                )}

                {p.telefone && (
                  <a
                    href={`tel:+55${p.telefone.replace(/\D/g, '')}`}
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {p.telefone}
                  </a>
                )}

                {p.linkedin_url && (
                  <a
                    href={p.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    Ver LinkedIn
                  </a>
                )}

                <a
                  href={`/solicitar-orcamento?profissional=${p.id}`}
                  className="flex items-center justify-center gap-2 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-sm py-3 rounded-xl transition-colors"
                >
                  📋 Solicitar Orçamento
                </a>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    {p.verified
                      ? 'Perfil verificado pelo AcheiSST'
                      : 'Perfil aguardando verificação'
                    }
                  </div>
                </div>
              </div>

              <a
                href="/profissionais"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver todos os profissionais
              </a>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
