'use client'

import React from "react"

import { useEffect } from 'react'
import { useLanguage } from './context/language-context'
import { useTheme } from './context/theme-context'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { language, direction } = useLanguage()
  const { isDark } = useTheme()

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return <>{children}</>
}
