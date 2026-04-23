'use client'

import { useTheme } from '@/components/ThemeProvider'
import { Hero } from '@/components/Hero'
import { HeroAcheiSST } from '@/components/HeroAcheiSST'
import { HeroV5 } from '@/components/HeroV5'
import { HeroPreview6 } from '@/components/HeroPreview6'
import { HeroPreview3AcheiSST } from '@/components/HeroPreview3AcheiSST'
import { HeroPreview7AcheiSST } from '@/components/HeroPreview7AcheiSST'
import { NewsFeed } from '@/components/NewsFeed'
import { ShieldCheck, Mail } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

interface Props {
  posts: PostMeta[]
}

function OldFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <a href="/" className="flex items-center gap-2.5 mb-3">
              <ShieldCheck className="w-6 h-6 text-blue-500" aria-hidden="true" />
              <span className="font-bold text-white text-base">SST <span className="text-blue-500">Brasil</span></span>
            </a>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Hub independente de Saúde e Segurança no Trabalho. Aberto a todo o ecossistema SST brasileiro.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">Plataforma</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/informativos" className="hover:text-white transition-colors">Informativos</a></li>
                <li><a href="/empresas" className="hover:text-white transition-colors">Empresas SST</a></li>
                <li><a href="#nrs" className="hover:text-white transition-colors">Normas (NRs)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="mailto:contato@sstbrasil.com.br" className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    contato@sstbrasil.com.br
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 Ecossistema SST Brasil. Todos os direitos reservados.</span>
          <span>Conteúdo processado com IA — sempre verifique a fonte oficial.</span>
        </div>
      </div>
    </footer>
  )
}

export function HomeSwitch({ posts }: Props) {
  const { theme } = useTheme()

  if (theme === 'acheisst') {
    return <HeroAcheiSST />
  }

  if (theme === 'preview_3') {
    return <HeroPreview3AcheiSST />
  }

  if (theme === 'preview_5') {
    return <HeroV5 />
  }

  if (theme === 'preview_6') {
    return <HeroPreview6 />
  }

  if (theme === 'preview_7') {
    return <HeroPreview7AcheiSST />
  }

  return (
    <>
      <Hero />
      <NewsFeed posts={posts} compact />
      <OldFooter />
    </>
  )
}
