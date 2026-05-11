import type { Metadata } from 'next'
import { Inter, Playfair_Display, Lora } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

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
  title: 'AcheiSST',
  description:
    'Encontre fornecedores, profissionais, clínicas, softwares e conteúdo de Saúde e Segurança do Trabalho no Brasil. O maior ecossistema SST do país.',
  keywords: ['SST', 'NR', 'saúde ocupacional', 'segurança do trabalho', 'eSocial', 'AcheiSST', 'fornecedores SST'],
  authors: [{ name: 'AcheiSST' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'AcheiSST',
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
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4CD7SWYTZY"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4CD7SWYTZY');
          `}
        </Script>
        {/* Microsoft Clarity */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","wo136wf3be");
          `}
        </Script>
      </body>
    </html>
  )
}
