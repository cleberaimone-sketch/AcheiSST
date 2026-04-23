import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import type { Fornecedor, FornecedorCategoria } from '@/types'
import {
  MapPin, Globe, CheckCircle2, MessageCircle, Phone,
  Building2, ArrowLeft, Star, Shield,
} from 'lucide-react'

function mapSegmento(segmento: string): FornecedorCategoria {
  const s = (segmento ?? '').toLowerCase()
  if (s.includes('epi') || s.includes('epc') || s.includes('equipamento')) return 'EPI & Equipamentos'
  if (s.includes('clínica') || s.includes('clinica') || s.includes('medicina')) return 'Clínicas Médicas'
  if (s.includes('consultoria') || s.includes('sst')) return 'Consultorias SST'
  if (s.includes('treinamento') || s.includes('curso') || s.includes('nr')) return 'Treinamentos'
  if (s.includes('software') || s.includes('sistema') || s.includes('tecnologia')) return 'Softwares SST'
  if (s.includes('laboratório') || s.includes('laboratorio') || s.includes('higiene')) return 'Laboratórios'
  if (s.includes('engenharia') || s.includes('segurança')) return 'Engenharia de Segurança'
  return 'Outros'
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function whatsappUrl(numero: string, nome: string) {
  const texto = encodeURIComponent(`Olá! Vi seu perfil no AcheiSST e gostaria de mais informações sobre os serviços de ${nome}.`)
  return `https://wa.me/55${numero.replace(/\D/g, '')}?text=${texto}`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase.from('empresas').select('nome, segmento, cidade, uf').eq('slug', slug).single()
  if (!data) return {}
  return {
    title: `${data.nome} — AcheiSST`,
    description: `${data.nome} é um fornecedor de ${data.segmento ?? 'SST'} em ${data.cidade ?? ''}, ${data.uf}. Veja o perfil completo no AcheiSST.`,
  }
}

export default async function FornecedorPerfilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: e } = await supabase.from('empresas').select('*').eq('slug', slug).single()

  if (!e) notFound()

  const f: Fornecedor = {
    id: String(e.id),
    slug: String(e.id),
    nome: e.nome,
    categoria: e.categoria ? (e.categoria as FornecedorCategoria) : mapSegmento(e.segmento ?? ''),
    subcategoria: e.subcategoria ?? null,
    cidade: e.cidade ?? '',
    uf: e.uf ?? '',
    logo_url: e.logo_url ?? null,
    site_url: e.site_url ?? null,
    whatsapp: e.whatsapp ?? null,
    descricao: e.descricao ?? e.segmento ?? null,
    plano: (e.plano as Fornecedor['plano']) ?? 'free',
    verificado: e.verified ?? false,
    is_sponsored: e.is_sponsored ?? false,
    created_at: e.created_at,
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <a href="/" className="hover:text-green-600 transition-colors">Início</a>
            <span>/</span>
            <a href="/fornecedores" className="hover:text-green-600 transition-colors">Fornecedores</a>
            <span>/</span>
            <span className="text-slate-700 font-medium truncate">{f.nome}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Coluna principal */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Card principal */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                {f.is_sponsored && (
                  <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider mb-3">
                    Patrocinado
                  </span>
                )}

                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm">
                    {f.logo_url
                      ? <img src={f.logo_url} alt={f.nome} className="w-16 h-16 rounded-2xl object-cover" />
                      : getInitials(f.nome)
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-bold text-slate-900">{f.nome}</h1>
                      {f.verificado && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verificado
                        </span>
                      )}
                      {f.plano === 'premium' && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-green-500" />
                      <span>{f.cidade}, {f.uf}</span>
                    </div>
                    <span className="inline-block mt-2 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                      {f.categoria}
                    </span>
                  </div>
                </div>

                {f.descricao && (
                  <p className="text-slate-600 text-sm leading-relaxed">{f.descricao}</p>
                )}
              </div>

              {/* Sobre (placeholder para campos futuros) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-semibold text-slate-900 mb-3">Sobre a empresa</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.descricao
                    ? f.descricao
                    : `${f.nome} é um fornecedor de ${f.categoria} com sede em ${f.cidade}, ${f.uf}. Entre em contato para mais informações.`
                  }
                </p>
              </div>

            </div>

            {/* Sidebar de contato */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 sticky top-24">
                <h2 className="text-sm font-semibold text-slate-900">Entrar em contato</h2>

                {f.whatsapp && (
                  <a
                    href={whatsappUrl(f.whatsapp, f.nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                )}

                {f.site_url && (
                  <a
                    href={f.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 font-medium text-sm py-3 rounded-xl transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Visitar site
                  </a>
                )}

                <a
                  href={`/solicitar-orcamento?fornecedor=${f.id}`}
                  className="flex items-center justify-center gap-2 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Solicitar Orçamento
                </a>

                <div className="border-t border-slate-100 pt-3 mt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    {f.verificado
                      ? 'Perfil verificado pelo AcheiSST'
                      : 'Perfil ainda não verificado'
                    }
                  </div>
                </div>
              </div>

              {/* Voltar */}
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
