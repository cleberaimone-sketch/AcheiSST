import type { Metadata } from 'next'
import { Inter, Playfair_Display, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'AcheiSST — Tudo sobre SST em um só lugar',
  description:
    'Encontre fornecedores, profissionais, clínicas, softwares e conteúdo de Saúde e Segurança do Trabalho no Brasil. O maior ecossistema SST do país.',
  keywords: ['SST', 'NR', 'saúde ocupacional', 'segurança do trabalho', 'eSocial', 'AcheiSST', 'fornecedores SST'],
  authors: [{ name: 'AcheiSST' }],
  openGraph: {
    title: 'AcheiSST — Tudo sobre SST em um só lugar',
    description: 'Fornecedores, profissionais, clínicas e conteúdo de Saúde e Segurança do Trabalho no Brasil.',
    type: 'website',
    locale: 'pt_BR',
  },
}

import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${lora.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
