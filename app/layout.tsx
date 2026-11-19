import React from "react"
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Inter, Newsreader, Noto_Naskh_Arabic, Noto_Sans_Arabic } from 'next/font/google'

import './globals.css'
import { LanguageProvider } from './context/language-context'
import { ThemeProvider } from './context/theme-context'
import ClientLayout from './client-layout'
import { COOKIE_KEYS, bootScript, parseLanguage, parseTheme } from '@/lib/theme'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const arabicSans = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
})

const arabicDisplay = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-arabic-display',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'MyIslam — Islamic Companion',
    template: '%s · MyIslam',
  },
  description:
    'Prayer times, Qibla, Quran, duas, zikr and a reading library in one calm companion.',
  applicationName: 'MyIslam',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const theme = parseTheme(cookieStore.get(COOKIE_KEYS.theme)?.value)
  const language = parseLanguage(cookieStore.get(COOKIE_KEYS.language)?.value)
  const direction = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <html
      lang={language}
      dir={direction}
      suppressHydrationWarning
      className={`${inter.variable} ${arabicSans.variable} ${arabicDisplay.variable} ${newsreader.variable} ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      <body className="font-sans antialiased">
        {/* unslop-ignore DANGEROUS_HTML -- static first-party boot script built from constants, no user input */}
        <script dangerouslySetInnerHTML={{ __html: bootScript(theme) }} />
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLanguage={language}>
            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
