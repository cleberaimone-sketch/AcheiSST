import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import {
  MapPin, MessageCircle, Phone, ArrowLeft, Shield,
  CheckCircle2, Linkedin, Briefcase, BookOpen, Award, Clock, Globe, Mail,
} from 'lucide-react'

export const revalidate = 60

function whatsappUrl(numero: string, nome: string) {
  const texto = encodeURIComponent(`Olá, ${nome}! Vi seu perfil no AcheiSST e gostaria de mais informações sobre seus serviços.`)
  return `https://wa.me/55${numero.replace(/\D/g, '')}?text=${texto}`
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabase
    .from('profiles')
    .select('display_name, ocupacao, city, state, about')
    .eq('id', id)
    .single()
  if (!data) return {}
  const nome = data.display_name ?? 'Profissional SST'
  return {
    title: `${nome} — ${data.ocupacao ?? 'Profissional SST'} | AcheiSST`,
    description: data.about
      ? data.about.slice(0, 160)
      : `${nome} é ${data.ocupacao ?? 'profissional'} em ${data.city ?? ''}, ${data.state ?? ''}. Veja o perfil completo no AcheiSST.`,
  }
}

export default async function PerfilPublicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: p } = await supabase
    .from('profiles')
    .select('id, display_name, ocupacao, about, avatar_url, city, state, atende_remoto, especialidades, nrs_atendidas, public_email, phone, whatsapp, linkedin_url, website, registro_prof, anos_experiencia, is_verified')
    .eq('id', id)
    .single()

  if (!p) notFound()

  const nome = p.display_name ?? 'Profissional SST'
  const iniciais = nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">

        {/* HERO */}
        <div className="relative w-full bg-gradient-to-br from-green-700 to-green-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

          {/* Breadcrumb */}
          <div className="absolute top-4 left-4">
            <a
              href="/profissionais"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full hover:bg-black/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Profissionais
            </a>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
            <div className="flex items-end gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white/30 overflow-hidden bg-white/20 flex-shrink-0 shadow-xl">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt={nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white font-extrabold text-3xl">{iniciais}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                {p.ocupacao && (
                  <p className="text-xs font-semibold text-green-300 uppercase tracking-widest mb-1">
                    {p.ocupacao}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
                  {nome}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {(p.city || p.state) && (
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <MapPin className="w-3.5 h-3.5 text-red-300" />
                      {p.city ? `${p.city}, ` : ''}{p.state}
                    </div>
                  )}
                  {p.atende_remoto && (
                    <span className="text-xs font-semibold text-emerald-200 bg-emerald-900/40 px-2.5 py-0.5 rounded-full">
                      Atende remoto
                    </span>
                  )}
                  {p.is_verified && (
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

              {/* Card info geral */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">

                {/* Stats */}
                {(p.anos_experiencia || p.registro_prof) && (
                  <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-100">
                    {p.anos_experiencia && (
                      <div className="text-center">
                        <div className="flex items-center justify-center text-green-600 mb-1">
                          <Clock className="w-4 h-4" />
                        </div>
                        <p className="text-xl font-bold text-slate-900">{p.anos_experiencia}+</p>
                        <p className="text-xs text-slate-500">Anos de exp.</p>
                      </div>
                    )}
                    {p.registro_prof && (
                      <div className="text-center">
                        <div className="flex items-center justify-center text-green-600 mb-1">
                          <Award className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate">{p.registro_prof}</p>
                        <p className="text-xs text-slate-500">Registro</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bio */}
                {p.about ? (
                  <p className="text-slate-600 text-sm leading-relaxed">{p.about}</p>
                ) : (
                  <p className="text-slate-400 text-sm italic">Este profissional ainda não adicionou uma apresentação.</p>
                )}
              </div>

              {/* Especialidades / Serviços */}
              {p.especialidades && Array.isArray(p.especialidades) && p.especialidades.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-500" />
                    Serviços e Especialidades
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(p.especialidades as string[]).map((item: string) => (
                      <div key={item} className="flex items-center gap-2.5 p-3 bg-green-50 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NRs */}
              {p.nrs_atendidas && Array.isArray(p.nrs_atendidas) && p.nrs_atendidas.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Normas Regulamentadoras
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(p.nrs_atendidas as string[]).map((nr: string) => (
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
            </div>

            {/* ── SIDEBAR CONTATO ── */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 sticky top-24">
                <h2 className="text-sm font-bold text-slate-900">Entrar em contato</h2>

                {p.whatsapp && (
                  <a
                    href={whatsappUrl(p.whatsapp, nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                )}

                {p.phone && (
                  <a
                    href={`tel:+55${p.phone.replace(/\D/g, '')}`}
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {p.phone}
                  </a>
                )}

                {p.public_email && (
                  <a
                    href={`mailto:${p.public_email}`}
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Enviar e-mail
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

                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Site pessoal
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
                    {p.is_verified
                      ? 'Perfil verificado pelo AcheiSST'
                      : 'Perfil cadastrado pelo profissional'
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
