import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import type { FornecedorCategoria } from '@/types'
import {
  MapPin, Globe, CheckCircle2, MessageCircle, Phone,
  ArrowLeft, Star, Shield, Mail, Clock, Users, Award,
} from 'lucide-react'
import { LikeButtonDetail } from '@/components/LikeButtonDetail'

const FALLBACK_IMG: Record<string, string> = {
  clinica:      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80',
  consultoria:  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80',
  loja:         'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80',
  epi:          'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80',
  software:     'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
  treinamento:  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80',
  engenharia:   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  laboratorio:  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
}

function mapCategoriaBD(cat: string): FornecedorCategoria {
  const c = (cat ?? '').toLowerCase()
  if (c === 'clinica' || c === 'clínica') return 'Clínicas Médicas'
  if (c === 'loja' || c === 'epi') return 'EPI & Equipamentos'
  if (c === 'software') return 'Softwares SST'
  if (c === 'treinamento') return 'Treinamentos'
  if (c === 'consultoria') return 'Consultorias SST'
  if (c === 'laboratorio' || c === 'laboratório') return 'Laboratórios'
  if (c === 'engenharia') return 'Engenharia de Segurança'
  return 'Outros'
}

function whatsappUrl(numero: string, nome: string) {
  const texto = encodeURIComponent(`Olá! Vi o perfil da ${nome} no AcheiSST e gostaria de mais informações sobre os serviços.`)
  return `https://wa.me/55${numero.replace(/\D/g, '')}?text=${texto}`
}

function StarRating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-5 h-5 ${s <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
          />
        ))}
      </div>
      <span className="text-lg font-bold text-slate-900">{value.toFixed(1)}</span>
      <span className="text-sm text-slate-500">({count} avaliações)</span>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase
    .from('fornecedores')
    .select('nome, categoria, cidade, uf, descricao')
    .eq('slug', slug)
    .single()
  if (!data) return {}
  return {
    title: `${data.nome} — AcheiSST`,
    description: data.descricao
      ? data.descricao.slice(0, 160)
      : `${data.nome} é uma clínica de ${data.categoria ?? 'SST'} em ${data.cidade ?? ''}, ${data.uf}. Perfil completo no AcheiSST.`,
  }
}

export default async function FornecedorPerfilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: e } = await supabase.from('fornecedores').select('*').eq('slug', slug).single()

  if (!e) notFound()

  const categoria = mapCategoriaBD(e.categoria ?? '')

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">

        {/* HERO FOTO */}
        <div className="relative w-full h-72 sm:h-96 bg-slate-200 overflow-hidden">
          {e.foto_url || FALLBACK_IMG[e.categoria ?? ''] ? (
            <img
              src={e.foto_url ?? FALLBACK_IMG[e.categoria ?? '']}
              alt={e.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
              <Shield className="w-24 h-24 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Like button */}
          <div className="absolute top-4 right-4">
            <LikeButtonDetail id={String(e.id)} />
          </div>

          {/* Breadcrumb */}
          <div className="absolute top-4 left-4">
            <a
              href="/fornecedores"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-black/30 backdrop-blur px-3 py-1.5 rounded-full hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Fornecedores
            </a>
          </div>

          {/* Nome sobreposto na foto */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-4xl mx-auto">
              {e.is_sponsored && (
                <span className="inline-block text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                  Patrocinado
                </span>
              )}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold text-red-300 uppercase tracking-widest">
                  {categoria}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1">
                {e.nome}
              </h1>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>{e.endereco ? `${e.endereco}, ` : ''}{e.cidade}, {e.uf}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── COLUNA PRINCIPAL ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Card de Identificação */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {e.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verificado
                      </span>
                    )}
                    {e.is_sponsored && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {e.avaliacao != null && Number(e.avaliacao) > 0 && (
                  <div className="mb-5">
                    <StarRating value={Number(e.avaliacao)} count={e.num_avaliacoes ?? 0} />
                  </div>
                )}

                {/* Descrição */}
                {e.descricao && (
                  <p className="text-slate-600 text-sm leading-relaxed">{e.descricao}</p>
                )}

                {/* Stats rápidos */}
                {(e.experiencia_anos || e.clientes || e.medicos_disponiveis) && (
                  <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
                    {e.experiencia_anos && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                          <Clock className="w-4 h-4" />
                        </div>
                        <p className="text-xl font-bold text-slate-900">{e.experiencia_anos}+</p>
                        <p className="text-xs text-slate-500">Anos de experiência</p>
                      </div>
                    )}
                    {e.clientes && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <p className="text-xl font-bold text-slate-900">{e.clientes}+</p>
                        <p className="text-xs text-slate-500">Clientes atendidos</p>
                      </div>
                    )}
                    {e.medicos_disponiveis && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                          <Award className="w-4 h-4" />
                        </div>
                        <p className="text-xl font-bold text-slate-900">{e.medicos_disponiveis}</p>
                        <p className="text-xs text-slate-500">Médicos disponíveis</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Serviços Oferecidos */}
              {e.especialidades && Array.isArray(e.especialidades) && e.especialidades.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Serviços Oferecidos
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(e.especialidades as string[]).map((serv: string) => (
                      <div key={serv} className="flex items-center gap-2.5 p-3 bg-green-50 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-800">{serv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Localização */}
              {(e.endereco || e.cidade) && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" />
                    Localização
                  </h2>
                  <div className="space-y-2 text-sm text-slate-600">
                    {e.endereco && <p>{e.endereco}</p>}
                    <p className="font-medium">{e.cidade}, {e.uf}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── SIDEBAR CONTATO ── */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 sticky top-24">
                <h2 className="text-sm font-bold text-slate-900">Entrar em contato</h2>

                {e.whatsapp && (
                  <a
                    href={whatsappUrl(e.whatsapp, e.nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                )}

                {e.telefone && (
                  <a
                    href={`tel:+55${e.telefone.replace(/\D/g, '')}`}
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {e.telefone}
                  </a>
                )}

                {e.website_url && (
                  <a
                    href={e.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visitar site
                  </a>
                )}

                {e.email && (
                  <a
                    href={`mailto:${e.email}`}
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {e.email}
                  </a>
                )}

                <a
                  href={`/solicitar-orcamento?fornecedor=${e.slug}`}
                  className="flex items-center justify-center gap-2 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-sm py-3 rounded-xl transition-colors"
                >
                  📋 Solicitar Orçamento
                </a>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    {e.verified
                      ? 'Perfil verificado pelo AcheiSST'
                      : 'Perfil ainda não verificado'
                    }
                  </div>
                </div>
              </div>

              <a
                href="/fornecedores"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver todos os fornecedores
              </a>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
