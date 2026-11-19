'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import {
  COOKIE_KEYS,
  STORAGE_KEYS,
  prefersDark,
  writeCookie,
  type Theme,
} from '@/lib/theme'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function applyTheme(themeValue: Theme) {
  const isDark = themeValue === 'dark' || (themeValue === 'system' && prefersDark())
  document.documentElement.classList.toggle('dark', isDark)
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme)
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme)
    writeCookie(COOKIE_KEYS.theme, nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
