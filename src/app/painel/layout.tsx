import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel do Fornecedor — AcheiSST',
  description: 'Gerencie seus leads e métricas no AcheiSST.',
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header do painel */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo-compact.png" alt="AcheiSST" className="h-7 w-auto object-contain" />
            <span className="text-slate-300 text-sm hidden sm:inline">/ Painel</span>
          </a>
          <a
            href="/painel/sair"
            className="text-xs text-slate-500 hover:text-red-600 transition-colors font-medium"
          >
            Sair
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
