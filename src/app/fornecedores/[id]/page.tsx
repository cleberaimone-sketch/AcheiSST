'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Phone, MessageCircle, Mail, Globe, MapPin, Star, ArrowLeft, Check, Share2 } from 'lucide-react'

const FORNECEDORES_DB = [
  {
    id: '1',
    nome: 'MESO Saúde Ocupacional',
    categoria: 'CLÍNICAS E SAÚDE',
    descricao: 'Referência em medicina ocupacional com mais de 300 clientes. Oferecemos programas completos de ASO, PCMSO, exames complementares, sistema online digitalizado e suporte em fiscalizações.',
    descricao_longa: 'A MESO Saúde Ocupacional é uma das principais referências em medicina ocupacional no Brasil, com mais de 300 clientes satisfeitos. Nossa equipe multidisciplinar de médicos do trabalho, enfermeiros e técnicos oferece:\n\n• Atendimento Médico Ocupacional (AMO/ASO)\n• Programas de PCMSO (Programa de Controle Médico de Saúde Ocupacional)\n• Exames Complementares (audiometria, espirometria, etc)\n• Programas de Saúde Ocupacional Personalizados\n• Sistema online com documentos digitalizados\n• Suporte em fiscalizações e pericias\n\nCom mais de 20 anos de experiência, nos dedicamos à saúde e segurança dos trabalhadores com metodologia atualizada e conformidade total com a legislação.',
    uf: 'SP',
    cidade: 'São Paulo',
    endereco: 'Av. Berrini, 1400',
    complemento: 'Brooklin, São Paulo - SP',
    horario: 'Seg-Sex: 7h às 19h | Sab: 8h às 12h',
    rating: 4.9,
    reviews: 234,
    atende_remoto: true,
    premium: true,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    whatsapp: '1133841234',
    email: 'contato@meso.com.br',
    site: 'https://www.meso.com.br',
    servicos: [
      'Atendimento Médico Ocupacional',
      'PCMSO',
      'Exames Complementares',
      'Sistema Online',
      'Suporte em Fiscalizações',
      'Programas Personalizados'
    ],
  },
  {
    id: '2',
    nome: 'Care Plus Ocupacional',
    categoria: 'CLÍNICAS E SAÚDE',
    descricao: 'Rede credenciada em todo Brasil. Medicina do trabalho, exames ocupacionais, PCMSO, PGR e segurança do trabalho. Atendimento em São Paulo, Rio de Janeiro e outras capitais.',
    descricao_longa: 'Care Plus Ocupacional é uma rede credenciada de clínicas de medicina do trabalho presente em São Paulo, Rio de Janeiro e outras capitais. Oferecemos:\n\n• Medicina do Trabalho Completa\n• Exames Ocupacionais (ASO, Admissional, Periódico, Demissional)\n• PCMSO e PGR\n• Segurança do Trabalho\n• Atendimento para empresas de todos os portes\n• Rede de profissionais credenciados\n\nNosso diferencial é a rapidez no atendimento e a facilidade de agendamento em múltiplas unidades.',
    uf: 'SP',
    cidade: 'São Paulo',
    endereco: 'Rua Oscar Freire, 500',
    complemento: 'Cerqueira César, São Paulo - SP',
    horario: 'Seg-Sex: 7h às 20h | Sab: 8h às 14h',
    rating: 4.8,
    reviews: 189,
    atende_remoto: true,
    premium: true,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&q=80',
    whatsapp: '1138721234',
    email: 'contato@careplusocupacional.com.br',
    site: 'https://www.careplusocupacional.com.br',
    servicos: [
      'Medicina do Trabalho',
      'ASO (Atestado de Saúde Ocupacional)',
      'PCMSO',
      'PGR',
      'Segurança do Trabalho',
      'Rede Nacional'
    ],
  },
  {
    id: '3',
    nome: 'SAOC — Soluções em Saúde Ocupacional',
    categoria: 'CONSULTORIA E SEGURANÇA',
    descricao: 'Especialista em bem-estar no ambiente de trabalho há 20+ anos. Equipe multidisciplinar: médicos, engenheiros, fonoaudiólogos, psicólogos. Soluções em Saúde, Engenharia e Segurança Ocupacional.',
    descricao_longa: 'A SAOC é especialista em bem-estar no ambiente de trabalho há mais de 20 anos. Contamos com uma equipe multidisciplinar composta por:\n\n• Médicos do Trabalho\n• Engenheiros de Segurança (CREA)\n• Fonoaudiólogos\n• Psicólogos\n• Fisioterapeutas\n• Técnicos em Segurança\n\nOferecemos visão completa da saúde corporativa, com soluções integradas em Saúde, Engenharia e Segurança Ocupacional. Nossos programas são personalizados para atender as necessidades específicas de cada empresa.',
    uf: 'SP',
    cidade: 'São Paulo',
    endereco: 'Rua Dr. Cardoso de Melo, 1340',
    complemento: 'Vila Mariana, São Paulo - SP',
    horario: 'Seg-Sex: 8h às 18h | Consulte para atendimento especial',
    rating: 4.9,
    reviews: 312,
    atende_remoto: true,
    premium: true,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    whatsapp: '1141234567',
    email: 'contato@saoc.com.br',
    site: 'https://saoc.com.br',
    servicos: [
      'Medicina do Trabalho',
      'Engenharia de Segurança',
      'Psicologia Ocupacional',
      'Audiometria',
      'Programas Integrados',
      'Consultoria SST'
    ],
  },
  {
    id: '4',
    nome: 'LaborMesp — Medicina Ocupacional',
    categoria: 'CLÍNICAS E SAÚDE',
    descricao: 'Referência desde 1996 em medicina ocupacional e segurança do trabalho. Soluções integradas focadas em segurança, conformidade com legislação e eficiência operacional.',
    descricao_longa: 'LaborMesp é uma referência em medicina ocupacional desde 1996. Com mais de 25 anos de experiência, oferecemos:\n\n• Medicina Ocupacional Completa\n• Programas de PCMSO atualizado\n• Programas de Gerenciamento de Riscos\n• Adequação à legislação SST vigente\n• Suporte especializado em fiscalizações\n• Consultoria em segurança do trabalho\n\nNosso foco é proporcionar soluções integradas que garantam a segurança, saúde e eficiência operacional das empresas clientes.',
    uf: 'SP',
    cidade: 'São Paulo',
    endereco: 'Avenida Paulista, 1578 - Sala 1500',
    complemento: 'Bela Vista, São Paulo - SP',
    horario: 'Seg-Sex: 7h às 18h',
    rating: 4.7,
    reviews: 287,
    atende_remoto: true,
    premium: false,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1631217314831-a149b0f69413?w=800&q=80',
    whatsapp: '1133001234',
    email: 'contato@labormesp.com.br',
    site: 'https://www.labormesp.com.br',
    servicos: [
      'Medicina do Trabalho',
      'PCMSO',
      'Gerenciamento de Riscos',
      'Consultoria Legislativa',
      'Perícia Médica',
      'Programas Corporativos'
    ],
  },
]

export default function FornecedorDetalhe() {
  const params = useParams()
  const id = params.id as string
  const [liked, setLiked] = useState(false)

  const fornecedor = FORNECEDORES_DB.find(f => f.id === id)

  if (!fornecedor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Fornecedor não encontrado</h1>
          <Link href="/fornecedores" className="text-sst-400 hover:text-sst-500 font-semibold">
            ← Voltar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ── NAVBAR ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 bg-sst-400 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-playfair font-bold text-slate-900 text-xl tracking-tight hidden sm:inline">
                Achei<span className="text-sst-400">SST</span>
              </span>
            </Link>
            <Link href="/fornecedores" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* ── IMAGEM PRINCIPAL ────────────────────────── */}
      <div className="relative h-96 bg-slate-200 overflow-hidden">
        <img
          src={fornecedor.foto}
          alt={fornecedor.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              liked
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* ── CONTEÚDO ────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Info Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-green-600">Fornecedor verificado</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">{fornecedor.nome}</h1>
          <p className="text-lg font-semibold text-red-500 uppercase mb-4">{fornecedor.categoria}</p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-lg font-bold text-slate-900">{fornecedor.rating}</span>
              <span className="text-sm text-slate-600">({fornecedor.reviews} avaliações)</span>
            </div>
            {fornecedor.premium && (
              <div className="bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-lg">
                🏆 Premium
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div className="prose prose-sm max-w-none mb-10">
          <p className="text-slate-600 whitespace-pre-line">{fornecedor.descricao_longa}</p>
        </div>

        {/* Serviços */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Serviços Oferecidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fornecedor.servicos.map((servico) => (
              <div key={servico} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">{servico}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Localização */}
        <div className="mb-10 p-6 bg-slate-50 rounded-xl">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Localização
          </h2>
          <p className="text-slate-900 font-semibold mb-1">{fornecedor.endereco}</p>
          <p className="text-slate-600 mb-4">{fornecedor.complemento}</p>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-slate-700">Horário:</span>
            <p className="text-sm text-slate-600">{fornecedor.horario}</p>
          </div>

          {fornecedor.atende_remoto && (
            <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">
              ✓ Atende remotamente
            </div>
          )}
        </div>

        {/* Contato */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Entre em Contato</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a
              href={`tel:${fornecedor.whatsapp}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Ligar</span>
            </a>

            <a
              href={`https://wa.me/55${fornecedor.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700">WhatsApp</span>
            </a>

            <a
              href={`mailto:${fornecedor.email}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Email</span>
            </a>

            <a
              href={fornecedor.site}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Site</span>
            </a>
          </div>
        </div>

        {/* Share */}
        <div className="flex items-center gap-2 justify-center py-6 border-t border-slate-200">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-semibold text-slate-700">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
        </div>
      </div>

      {/* ── RODAPÉ ────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 lg:px-8 py-10 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-xs text-slate-600">
            <p>© 2026 AcheiSST — Hub de Conexões SST Brasil</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
