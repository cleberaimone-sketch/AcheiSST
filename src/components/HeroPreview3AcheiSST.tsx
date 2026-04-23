'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Phone, Zap, MapPin, Star, ChevronDown, Menu, X } from 'lucide-react'

const UF_LIST = [
  'SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'SC', 'PE', 'GO', 'DF', 'ES', 'PA',
  'CE', 'PB', 'MA', 'RN', 'MT', 'MS', 'AC', 'AL', 'AP', 'AM', 'RO', 'RR', 'TO', 'PI', 'SE',
]

const TIPOS_SERVICO = [
  'Técnico de Segurança',
  'Clínica de Saúde',
  'Engenheiro de Segurança',
  'Treinamento',
  'Consultoria',
  'Medicina do Trabalho',
  'Perícia',
  'Higiene Ocupacional',
]

const PRESTADORES_EXEMPLO = [
  {
    id: '1',
    nome: 'Fábio Henrique Santos',
    especialidade: 'Técnico de Segurança do Trabalho',
    uf: 'SP',
    cidade: 'São Paulo',
    rating: 4.9,
    reviews: 47,
    preco: 'A partir de R$ 500',
    atende_remoto: true,
    premium: true,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    descricao: 'Especialista em NR-12, inspetor de máquinas',
  },
  {
    id: '2',
    nome: 'Mariana Costa Silva',
    especialidade: 'Consultora PPRA/PCMSO',
    uf: 'SP',
    cidade: 'São Paulo',
    rating: 4.8,
    reviews: 38,
    preco: 'A partir de R$ 800',
    atende_remoto: true,
    premium: true,
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80',
    descricao: 'Gestão de riscos ocupacionais',
  },
  {
    id: '3',
    nome: 'Dr. Luiz Alberto Fonseca',
    especialidade: 'Engenheiro de Segurança',
    uf: 'SP',
    cidade: 'São Paulo',
    rating: 4.9,
    reviews: 64,
    preco: 'A partir de R$ 1.500',
    atende_remoto: true,
    premium: false,
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
    descricao: 'Mestre em Engenharia de Segurança - USP',
  },
  {
    id: '4',
    nome: 'Dra. Fernanda Gomes Silva',
    especialidade: 'Medicina do Trabalho',
    uf: 'RJ',
    cidade: 'Rio de Janeiro',
    rating: 4.9,
    reviews: 73,
    preco: 'A partir de R$ 400',
    atende_remoto: false,
    premium: true,
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80',
    descricao: 'Perícia médica em acidentes do trabalho',
  },
  {
    id: '5',
    nome: 'Anderson Souza Oliveira',
    especialidade: 'Técnico em Siderurgia',
    uf: 'MG',
    cidade: 'Belo Horizonte',
    rating: 4.8,
    reviews: 41,
    preco: 'A partir de R$ 450',
    atende_remoto: true,
    premium: false,
    foto: 'https://images.unsplash.com/photo-1507539803528-a38fa0db3d4d?w=500&q=80',
    descricao: 'Especialista em metalurgia e siderurgia',
  },
  {
    id: '6',
    nome: 'Bruno Costa Alves',
    especialidade: 'Técnico Agroindustrial',
    uf: 'RS',
    cidade: 'Porto Alegre',
    rating: 4.8,
    reviews: 36,
    preco: 'A partir de R$ 600',
    atende_remoto: true,
    premium: true,
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80',
    descricao: 'Segurança em processamento de alimentos',
  },
]

export function HeroPreview3AcheiSST() {
  const [ufselecionado, setUfSelecionado] = useState('SP')
  const [tipoSelecionado, setTipoSelecionado] = useState('')
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUfDropdown, setShowUfDropdown] = useState(false)
  const [showTipoDropdown, setShowTipoDropdown] = useState(false)

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

  const prestadoresFiltrados = PRESTADORES_EXEMPLO.filter(p => {
    const ufMatch = p.uf === ufselecionado
    const tipoMatch = !tipoSelecionado || p.especialidade.includes(tipoSelecionado)
    return ufMatch && tipoMatch
  }).sort((a, b) => {
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
                <Zap className="w-5 h-5 text-white" />
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

      {/* ── FILTROS ───────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 border-b border-slate-200 sticky top-16 bg-white/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* UF Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUfDropdown(!showUfDropdown)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-300 hover:border-sst-400 bg-white text-sm font-medium transition-colors"
              >
                <span className="truncate">{ufselecionado}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              {showUfDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  {UF_LIST.map(uf => (
                    <button
                      key={uf}
                      onClick={() => {
                        setUfSelecionado(uf)
                        setShowUfDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-100 transition-colors text-sm ${
                        ufselecionado === uf ? 'bg-sst-100 text-sst-600 font-semibold' : ''
                      }`}
                    >
                      {uf}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tipo de Serviço Dropdown */}
            <div className="relative sm:col-span-2">
              <button
                onClick={() => setShowTipoDropdown(!showTipoDropdown)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-300 hover:border-sst-400 bg-white text-sm font-medium transition-colors"
              >
                <span className="truncate">{tipoSelecionado || 'Todos os serviços'}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              {showTipoDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  <button
                    onClick={() => {
                      setTipoSelecionado('')
                      setShowTipoDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-slate-100 transition-colors text-sm ${
                      !tipoSelecionado ? 'bg-sst-100 text-sst-600 font-semibold' : ''
                    }`}
                  >
                    Todos os serviços
                  </button>
                  {TIPOS_SERVICO.map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setTipoSelecionado(tipo)
                        setShowTipoDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-100 transition-colors text-sm ${
                        tipoSelecionado === tipo ? 'bg-sst-100 text-sst-600 font-semibold' : ''
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS GRID (Estilo Fatal Model) ────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestadoresFiltrados.map((prestador) => (
              <div
                key={prestador.id}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  prestador.premium
                    ? 'border-sst-300 shadow-lg hover:shadow-xl'
                    : 'border-slate-200 hover:border-sst-300 hover:shadow-lg'
                }`}
              >
                {/* Imagem com Like Button */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-200">
                  <img
                    src={prestador.foto}
                    alt={prestador.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Premium Badge */}
                  {prestador.premium && (
                    <div className="absolute top-3 left-3 bg-sst-400 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      ⭐ Premium
                    </div>
                  )}

                  {/* Like Button - Em Destaque */}
                  <button
                    onClick={() => toggleLike(prestador.id)}
                    className="absolute bottom-3 right-3 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-10"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        liked.has(prestador.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-400 hover:text-red-500'
                      }`}
                    />
                  </button>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Info Container */}
                <div className="p-4 flex flex-col gap-3 flex-1 bg-white">
                  {/* Nome e Especialidade */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                      {prestador.nome}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                      {prestador.especialidade}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-900">{prestador.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500">({prestador.reviews})</span>
                  </div>

                  {/* Localização */}
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{prestador.cidade}, {prestador.uf}</span>
                  </div>

                  {/* Preço */}
                  <div className="text-sm font-semibold text-sst-600 bg-sst-50 px-2.5 py-1.5 rounded-lg text-center">
                    {prestador.preco}
                  </div>

                  {/* Atende Remoto */}
                  {prestador.atende_remoto && (
                    <div className="text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg text-center font-medium">
                      ✓ Atende Remoto
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      Ligar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {prestadoresFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">Nenhum prestador encontrado neste filtro.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── RODAPÉ ────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
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
          <Zap className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-slate-600 hover:text-sst-400 transition-colors">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs font-medium">Buscas</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-slate-600 hover:text-sst-400 transition-colors">
          <Heart className="w-6 h-6" />
          <span className="text-xs font-medium">Favs</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-slate-600 hover:text-sst-400 transition-colors">
          <Phone className="w-6 h-6" />
          <span className="text-xs font-medium">Perfil</span>
        </a>
      </nav>

      {/* Padding para bottom nav no mobile */}
      <div className="sm:hidden h-20" />

    </div>
  )
}
