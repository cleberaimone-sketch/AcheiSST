'use client'

import { useState } from 'react'
import { Heart, Phone, MessageCircle, Mail, Globe, MapPin, Star, ChevronDown, Menu, X, Search, Check, Trophy } from 'lucide-react'

const UF_LIST = [
  'SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'SC', 'PE', 'GO', 'DF', 'ES', 'PA',
  'CE', 'PB', 'MA', 'RN', 'MT', 'MS', 'AC', 'AL', 'AP', 'AM', 'RO', 'RR', 'TO', 'PI', 'SE',
]

const CATEGORIAS = [
  { icon: '👥', label: 'Técnicos', category: 'Técnico de Segurança', color: 'bg-blue-100 text-blue-700' },
  { icon: '🏥', label: 'Clínicas', category: 'Clínica de Saúde', color: 'bg-red-100 text-red-700' },
  { icon: '🏆', label: 'Engenheiros', category: 'Engenheiro de Segurança', color: 'bg-purple-100 text-purple-700' },
  { icon: '📋', label: 'Treinamento', category: 'Treinamento', color: 'bg-orange-100 text-orange-700' },
  { icon: '💼', label: 'Consultoria', category: 'Consultoria', color: 'bg-pink-100 text-pink-700' },
  { icon: '🏢', label: 'Empresas', category: 'Empresa', color: 'bg-indigo-100 text-indigo-700' },
]

const FORNECEDORES_EXEMPLO = [
  {
    id: '1',
    nome: 'Clínica Saúde Ocupacional Integral',
    categoria: 'CLÍNICAS E SAÚDE',
    descricao: 'Excelência em medicina ocupacional com mais de 25 anos de experiência. Oferecemos atendimento completo em ASO, PCMSO, exames complementares e programas de saúde ocupacional personalizados.',
    uf: 'SP',
    cidade: 'São Paulo',
    endereco: 'Av. Paulista, 1000 - Sala 1501',
    complemento: 'Bela Vista, São Paulo - SP',
    rating: 4.9,
    reviews: 127,
    atende_remoto: true,
    premium: true,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
    whatsapp: '11999999999',
    email: 'contato@clinicasso.com.br',
    site: 'https://clinicasso.com.br',
  },
  {
    id: '2',
    nome: 'Treinamento Seguro Total',
    categoria: 'TREINAMENTOS E CURSOS',
    descricao: 'Especialistas em treinamentos NR com metodologia prática e certificação. Oferecemos cursos presenciais e online adaptados às necessidades da sua empresa.',
    uf: 'MG',
    cidade: 'Belo Horizonte',
    endereco: 'Rua Brasil, 500 - Salas 301-302',
    complemento: 'Centro, Belo Horizonte - MG',
    rating: 4.9,
    reviews: 178,
    atende_remoto: true,
    premium: true,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    whatsapp: '31999999999',
    email: 'contato@treinamentoseguro.com.br',
    site: 'https://treinamentoseguro.com.br',
  },
  {
    id: '3',
    nome: 'SoftSST — Software de Gestão',
    categoria: 'TECNOLOGIA E SOFTWARES',
    descricao: 'Plataforma completa de gestão SST com dashboard inteligente e relatórios em tempo real. Integração com eSocial e automação de processos.',
    uf: 'PR',
    cidade: 'Curitiba',
    endereco: 'Rua da Tecnologia, 999 - Apto 1200',
    complemento: 'Batel, Curitiba - PR',
    rating: 4.8,
    reviews: 215,
    atende_remoto: true,
    premium: false,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    whatsapp: '41999999999',
    email: 'contato@softSST.com.br',
    site: 'https://softSST.com.br',
  },
  {
    id: '4',
    nome: 'EPI Brasil Distribuidora Nacional',
    categoria: 'EPIS E EQUIPAMENTOS',
    descricao: 'Maior distribuidora de EPIs do Brasil com produtos certificados e entrega rápida. Atendimento especializado para empresas.',
    uf: 'SP',
    cidade: 'Guarulhos',
    endereco: 'Av. Monteiro Lobato, 2000',
    complemento: 'Guarulhos, São Paulo - SP',
    rating: 4.7,
    reviews: 342,
    atende_remoto: false,
    premium: false,
    verificado: true,
    foto: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
    whatsapp: '11999999999',
    email: 'vendas@epibrasil.com.br',
    site: 'https://epibrasil.com.br',
  },
]

export function HeroPreview7AcheiSST() {
  const [ufSelecionado, setUfSelecionado] = useState('SP')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUfDropdown, setShowUfDropdown] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())

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

  const fornecedoresFiltrados = FORNECEDORES_EXEMPLO.filter(f => f.uf === ufSelecionado)
    .sort((a, b) => {
      if (a.premium && !b.premium) return -1
      if (!a.premium && b.premium) return 1
      return b.rating - a.rating
    })

  return (
    <div className="bg-white min-h-screen text-slate-900">

      {/* ── NAVBAR ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 bg-sst-400 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-playfair font-bold text-slate-900 text-xl tracking-tight hidden sm:inline">
                Achei<span className="text-sst-400">SST</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#" className="text-slate-600 hover:text-sst-400 transition-colors">Buscar</a>
              <a href="#" className="text-slate-600 hover:text-sst-400 transition-colors">Cadastrar-se</a>
              <a href="#" className="text-slate-600 hover:text-sst-400 transition-colors">Sobre</a>
            </nav>

            <button
              className="md:hidden text-slate-600 hover:text-slate-900"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden py-3 flex flex-col gap-2 text-sm font-medium border-t border-slate-200">
              <a href="#" className="py-2 text-slate-600 hover:text-sst-400">Buscar</a>
              <a href="#" className="py-2 text-slate-600 hover:text-sst-400">Cadastrar-se</a>
              <a href="#" className="py-2 text-slate-600 hover:text-sst-400">Sobre</a>
            </div>
          )}
        </div>
      </header>

      {/* ── BARRA DE PESQUISA ───────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Buscar fornecedores, serviços..."
                className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400 text-sm"
              />
            </div>

            {/* UF Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUfDropdown(!showUfDropdown)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-300 hover:border-sst-400 bg-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                <span>{ufSelecionado}</span>
                <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
              </button>
              {showUfDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 min-w-max">
                  {UF_LIST.map(uf => (
                    <button
                      key={uf}
                      onClick={() => {
                        setUfSelecionado(uf)
                        setShowUfDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-100 transition-colors text-sm ${
                        ufSelecionado === uf ? 'bg-sst-100 text-sst-600 font-semibold' : ''
                      }`}
                    >
                      {uf}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categorias */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIAS.map(({ icon, label }) => (
              <button
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTAQUES PREMIUM ────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">Destaques Premium</h2>
            </div>
            <a href="#" className="text-sm font-semibold text-sst-400 hover:text-sst-500">Ver todos</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fornecedoresFiltrados.filter(f => f.premium).map((fornecedor) => (
              <div key={fornecedor.id} className="rounded-2xl overflow-hidden border border-slate-200 hover:border-sst-300 hover:shadow-lg transition-all duration-300">
                {/* Imagem */}
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  <img
                    src={fornecedor.foto}
                    alt={fornecedor.nome}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">Fornecedor verificado</span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2">{fornecedor.nome}</h3>

                  <p className="text-sm font-semibold text-red-500 mb-3 uppercase">{fornecedor.categoria}</p>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-900">{fornecedor.rating}</span>
                      <span className="text-xs text-slate-600">({fornecedor.reviews})</span>
                    </div>
                    {fornecedor.premium && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                        🏆 Premium
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-600 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {fornecedor.cidade}, {fornecedor.uf}
                  </div>

                  {fornecedor.atende_remoto && (
                    <div className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1.5 rounded-lg inline-block">
                      Atende remotamente
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARDS DE FORNECEDORES ───────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Novos na Plataforma</h2>

          <div className="space-y-6">
            {fornecedoresFiltrados.filter(f => !f.premium).map((fornecedor) => (
              <div key={fornecedor.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-sst-300 hover:shadow-lg transition-all duration-300">
                {/* Imagem */}
                <div className="relative h-56 bg-slate-200 overflow-hidden">
                  <img
                    src={fornecedor.foto}
                    alt={fornecedor.nome}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleLike(fornecedor.id)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        liked.has(fornecedor.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-400 hover:text-red-500'
                      }`}
                    />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">Fornecedor verificado</span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1">{fornecedor.nome}</h3>

                  <p className="text-sm font-semibold text-red-500 mb-3 uppercase">{fornecedor.categoria}</p>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{fornecedor.descricao}</p>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-900">{fornecedor.rating}</span>
                      <span className="text-xs text-slate-600">({fornecedor.reviews})</span>
                    </div>
                    {fornecedor.premium && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">
                        Premium
                      </div>
                    )}
                  </div>

                  {/* Botões de Contato */}
                  <div className="flex items-center justify-between gap-3 mb-5 py-3 border-t border-b border-slate-100">
                    <button className="flex flex-col items-center gap-1.5 flex-1 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-red-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Ligar</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 flex-1 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">WhatsApp</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 flex-1 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Email</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 flex-1 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Site</span>
                    </button>
                  </div>

                  {/* Localização */}
                  <div className="flex items-start gap-2.5 mb-3">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900">{fornecedor.endereco}</p>
                      <p className="text-xs text-slate-600">{fornecedor.complemento}</p>
                    </div>
                  </div>

                  {fornecedor.atende_remoto && (
                    <div className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1.5 rounded-lg inline-block">
                      Atende remotamente
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FORNECEDOR ────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 sm:p-10 text-white">
            <div className="absolute top-4 right-4 opacity-10">
              <Trophy className="w-24 h-24" />
            </div>

            <div className="relative z-10">
              <h3 className="font-bold text-2xl sm:text-3xl mb-3">É fornecedor de SST?</h3>
              <p className="text-blue-100 mb-6 max-w-md">
                Cadastre-se e alcance milhares de empresas que buscam seus serviços
              </p>
              <a
                href="/cadastrar"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-all"
              >
                Cadastrar meu negócio →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── RODAPÉ ────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Sobre</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-sst-400">Como funciona</a></li>
                <li><a href="#" className="hover:text-sst-400">Cadastre-se</a></li>
                <li><a href="#" className="hover:text-sst-400">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Plataforma</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-sst-400">Buscar serviços</a></li>
                <li><a href="#" className="hover:text-sst-400">Destaque premium</a></li>
                <li><a href="#" className="hover:text-sst-400">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-sst-400">Privacidade</a></li>
                <li><a href="#" className="hover:text-sst-400">Termos</a></li>
                <li><a href="#" className="hover:text-sst-400">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-600">
            <p>© 2026 AcheiSST — Hub de Conexões SST Brasil</p>
          </div>
        </div>
      </footer>

      {/* ── BOTTOM NAVIGATION (Mobile Only) ───────────── */}
      <nav className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-around">
        <a href="#" className="flex flex-col items-center gap-1 text-slate-600 hover:text-sst-400 transition-colors">
          <span className="text-lg">🏠</span>
          <span className="text-xs font-medium">Início</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-slate-600 hover:text-sst-400 transition-colors">
          <span className="text-lg">🔍</span>
          <span className="text-xs font-medium">Explorar</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-slate-600 hover:text-sst-400 transition-colors">
          <span className="text-lg">❤️</span>
          <span className="text-xs font-medium">Favs</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-slate-600 hover:text-sst-400 transition-colors">
          <span className="text-lg">👤</span>
          <span className="text-xs font-medium">Perfil</span>
        </a>
      </nav>

      <div className="sm:hidden h-20" />
    </div>
  )
}
