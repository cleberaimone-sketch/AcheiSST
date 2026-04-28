'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Theme = 'acheisst' | 'brazil_min' | 'blue_hub' | 'preview_5' | 'preview_6' | 'preview_3' | 'preview_7'

const THEMES: Theme[] = ['acheisst', 'preview_3', 'preview_6', 'preview_7']

const THEME_LABELS: Record<Theme, string> = {
  acheisst:   'AcheiSST (Original)',
  brazil_min: 'Tech Brazil',
  blue_hub:   'Blue Hub',
  preview_5:  'Preview 5 (Dark)',
  preview_6:  'Preview 6 (Azul)',
  preview_3:  'AcheiSST (Hub)',
  preview_7:  'AcheiSST (Elegante)',
}

const THEME_NEXT_LABEL: Record<Theme, string> = {
  acheisst:   'Ver: AcheiSST Hub',
  brazil_min: 'Tech Brazil',
  blue_hub:   'Blue Hub',
  preview_5:  'Preview 5 (Dark)',
  preview_6:  'Ver: AcheiSST Elegante',
  preview_3:  'Ver: Preview 6',
  preview_7:  'Ver: AcheiSST',
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

      {/* Preview Switcher — hidden in production */}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) throw new Error('useTheme must be properly used inside a ThemeProvider')
  return context
}
