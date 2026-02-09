'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'
type IslamicColor = 'emerald' | 'teal' | 'amber' | 'slate'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  islamicColor: IslamicColor
  setIslamicColor: (color: IslamicColor) => void
  isDark: boolean
}

const ISLAMIC_COLOR_SCHEMES: Record<IslamicColor, { primary: string; accent: string }> = {
  emerald: { primary: '16 78% 33%', accent: '120 73% 75%' }, // Traditional Islamic green
  teal: { primary: '174 100% 29%', accent: '168 76% 42%' }, // Ocean inspired
  amber: { primary: '38 92% 50%', accent: '43 96% 56%' }, // Golden/warm
  slate: { primary: '210 40% 25%', accent: '215 28% 45%' }, // Modern sophisticated
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [islamicColor, setIslamicColorState] = useState<IslamicColor>('emerald')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme | null) || 'system'
    const savedColor = (localStorage.getItem('islamicColor') as IslamicColor | null) || 'emerald'
    
    setThemeState(savedTheme)
    setIslamicColorState(savedColor)
    setMounted(true)
    applyTheme(savedTheme, savedColor)
  }, [])

  const applyTheme = (themeValue: Theme, colorValue: IslamicColor) => {
    const isDark =
      themeValue === 'dark' ||
      (themeValue === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    const scheme = ISLAMIC_COLOR_SCHEMES[colorValue]
    html.style.setProperty('--primary', scheme.primary)
    html.style.setProperty('--accent', scheme.accent)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme, islamicColor)
  }

  const setIslamicColor = (newColor: IslamicColor) => {
    setIslamicColorState(newColor)
    localStorage.setItem('islamicColor', newColor)
    applyTheme(theme, newColor)
  }

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, islamicColor, setIslamicColor, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
