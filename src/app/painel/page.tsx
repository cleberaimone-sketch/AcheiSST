'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, MapPin, Briefcase, Check, Plus, X, LogOut } from 'lucide-react'

const SERVICOS_SST_DISPONIVEIS = [
  'Atendimento Médico Ocupacional',
  'PCMSO',
  'PGR',
  'Auditoria de Segurança',
  'Treinamentos NR',
  'Consultoria SST',
  'Perícia Médica',
  'Exames Ocupacionais',
  'Medicina do Trabalho',
  'Segurança em Altura',
  'Espaços Confinados',
  'Ergonomia',
]

export default function Painel() {
  const [usuario, setUsuario] = useState({
    nome: 'João Silva Santos',
    email: 'joao@example.com',
    profissao: 'Técnico em Segurança do Trabalho',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    telefone: '11999999999',
    endereco: 'Rua das Flores, 123',
    complemento: 'Apto 456',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01310100',
    bio: 'Profissional experiente em segurança do trabalho com 10 anos de atuação.',
    servicos: ['Atendimento Médico Ocupacional', 'PCMSO', 'Auditoria de Segurança'],
    atende_remoto: true,
  })

  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState(usuario)
  const [servico, setServico] = useState('')

  const handleAddServico = () => {
    if (servico && !formData.servicos.includes(servico)) {
      setFormData({
        ...formData,
        servicos: [...formData.servicos, servico],
      })
      setServico('')
    }
  }

  const handleRemoveServico = (servicoRemover: string) => {
    setFormData({
      ...formData,
      servicos: formData.servicos.filter(s => s !== servicoRemover),
    })
  }

  const handleSalvar = () => {
    setUsuario(formData)
    setEditando(false)
  }

  const handleCancel = () => {
    setFormData(usuario)
    setEditando(false)
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-sst-400 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-playfair font-bold text-slate-900 text-xl tracking-tight hidden sm:inline">
                Achei<span className="text-sst-400">SST</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                Voltar
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-semibold text-slate-700">
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="relative flex-shrink-0">
              <img
                src={usuario.foto}
                alt={usuario.nome}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-sst-400"
              />
              {editando && (
                <label className="absolute bottom-0 right-0 bg-sst-400 text-white p-3 rounded-full cursor-pointer hover:bg-sst-500 transition-colors shadow-lg">
                  <Camera className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{usuario.nome}</h1>
              <p className="text-lg font-semibold text-sst-400 mb-2">{usuario.profissao}</p>
              <p className="text-slate-600 mb-4">{usuario.bio}</p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-lg">📧</span>
                  {usuario.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-lg">📱</span>
                  {usuario.telefone}
                </div>
                {usuario.atende_remoto && (
                  <div className="bg-green-50 text-green-600 text-sm font-semibold px-3 py-1 rounded-full">
                    ✓ Atende remotamente
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setEditando(!editando)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                editando
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-sst-400 text-white hover:bg-sst-500'
              }`}
            >
              {editando ? 'Cancelar Edição' : 'Editar Perfil'}
            </button>
          </div>
        </div>

        {editando ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Editar Perfil</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Dados Pessoais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Profissão</label>
                    <input
                      type="text"
                      value={formData.profissao}
                      onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Localização
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Endereço</label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cidade</label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">UF</label>
                    <input
                      type="text"
                      value={formData.uf}
                      onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                      maxLength={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400 uppercase"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.atende_remoto}
                      onChange={(e) => setFormData({ ...formData, atende_remoto: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-sst-400 focus:ring-sst-400"
                    />
                    <span className="text-sm font-semibold text-slate-700">Atendo remotamente</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sst-400" />
                  Serviços de SST
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Adicionar Serviço</label>
                  <div className="flex gap-2">
                    <select
                      value={servico}
                      onChange={(e) => setServico(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sst-400/20 focus:border-sst-400"
                    >
                      <option value="">Selecione um serviço</option>
                      {SERVICOS_SST_DISPONIVEIS.filter(s => !formData.servicos.includes(s)).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddServico}
                      className="px-4 py-2.5 rounded-lg bg-sst-400 hover:bg-sst-500 text-white font-semibold transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.servicos.map((s) => (
                    <div key={s} className="flex items-center justify-between gap-3 p-3 bg-sst-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-slate-700">{s}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveServico(s)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
              <button
                onClick={handleSalvar}
                className="flex-1 px-6 py-3 rounded-lg bg-sst-400 hover:bg-sst-500 text-white font-bold transition-colors"
              >
                Salvar Alterações
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-500" />
                Localização
              </h2>
              <div className="space-y-3 text-slate-700">
                <p><strong>Endereço:</strong> {usuario.endereco}</p>
                <p><strong>Complemento:</strong> {usuario.complemento}</p>
                <p><strong>Cidade:</strong> {usuario.cidade}, {usuario.uf}</p>
                <p><strong>CEP:</strong> {usuario.cep}</p>
                {usuario.atende_remoto && (
                  <p className="text-green-600 font-semibold">✓ Atendo remotamente</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-sst-400" />
                Serviços de SST
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usuario.servicos.map((servico) => (
                  <div key={servico} className="flex items-center gap-3 p-4 bg-sst-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-900">{servico}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
