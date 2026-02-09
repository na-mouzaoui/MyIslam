import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { LanguageProvider } from './context/language-context'
import { ThemeProvider } from './context/theme-context'
import ClientLayout from './client-layout'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Islamic Companion',
  description: 'Your companion for Islamic practice',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <ClientLayout>{children}</ClientLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
