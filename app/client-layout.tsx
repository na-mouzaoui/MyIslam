'use client'

import React, { useEffect } from 'react'

import { useLanguage } from './context/language-context'
import { ZelligeBackground } from '@/components/zellige-background'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { language, direction, t } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {t('skip_to_content')}
      </a>
      <ZelligeBackground />
      {children}
    </>
  )
}
