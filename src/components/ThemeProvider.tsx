'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { LayoutTemplate } from 'lucide-react'

export type Theme = 'acheisst' | 'brazil_min' | 'blue_hub' | 'preview_5'

const THEMES: Theme[] = ['acheisst', 'brazil_min', 'blue_hub', 'preview_5']

const THEME_LABELS: Record<Theme, string> = {
  acheisst:   'AcheiSST (Verde)',
  brazil_min: 'Tech Brazil',
  blue_hub:   'Blue Hub',
  preview_5:  'Preview 5 (Dark)',
}

const THEME_NEXT_LABEL: Record<Theme, string> = {
  acheisst:   'Ver: Tech Brazil',
  brazil_min: 'Ver: Blue Hub',
  blue_hub:   'Ver: Preview 5',
  preview_5:  'Ver: AcheiSST',
}

interface ThemeContextType {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('acheisst')

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme)
    setTheme(THEMES[(idx + 1) % THEMES.length])
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}

      {/* Fixed Preview Switcher */}
      <div className={`fixed bottom-6 right-6 z-[9999] p-3 rounded-2xl shadow-2xl flex flex-col gap-2 items-center min-w-[170px] transition-colors ${
        theme === 'preview_5'
          ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-700'
          : 'bg-white/95 backdrop-blur-xl border border-slate-200'
      }`}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'preview_5' ? 'text-slate-500' : 'text-slate-400'}`}>
          Preview Ativo
        </span>
        <span className={`text-xs font-bold ${theme === 'preview_5' ? 'text-green-400' : 'text-slate-700'}`}>
          {THEME_LABELS[theme]}
        </span>
        <button
          onClick={cycleTheme}
          className={`flex items-center gap-2 px-4 py-2 font-semibold text-xs rounded-xl transition-all hover:scale-105 w-full justify-center ${
            theme === 'preview_5'
              ? 'bg-green-500 text-slate-950 hover:bg-green-400'
              : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          {THEME_NEXT_LABEL[theme]}
        </button>
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) throw new Error('useTheme must be properly used inside a ThemeProvider')
  return context
}
