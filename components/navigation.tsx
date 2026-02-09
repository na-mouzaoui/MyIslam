'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Settings, Home, BookOpen, Clock, Compass, Sparkles, Newspaper, Library } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAVIGATION_ITEMS = [
  { id: 'home', href: '/', icon: Home, labelKey: 'home' },
  { id: 'quran', href: '/quran', icon: BookOpen, labelKey: 'quran' },
  { id: 'duas', href: '/duas', icon: BookOpen, labelKey: 'duas' },
  { id: 'library', href: '/library', icon: Library, labelKey: 'library' },
  { id: 'prayer_times', href: '/prayer-times', icon: Clock, labelKey: 'prayer_times' },
  { id: 'qibla', href: '/qibla', icon: Compass, labelKey: 'qibla' },
  { id: 'zikr', href: '/zikr', icon: Sparkles, labelKey: 'zikr' },
  { id: 'news', href: '/news', icon: Newspaper, labelKey: 'news' },
  { id: 'settings', href: '/settings', icon: Settings, labelKey: 'settings' },
]

export function Navigation() {
  const { t } = useLanguage()
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background md:hidden">
        <div className="flex justify-around">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.id} href={item.href} className="flex-1">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="icon"
                  title={t(item.labelKey)}
                  className="w-full h-14 rounded-none"
                >
                  <Icon className="w-5 h-5" />
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:border-r md:border-border md:bg-background md:flex md:flex-col md:p-4 md:gap-2 md:overflow-y-auto">
        <div className="mb-6 pb-4 border-b border-border">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            Islamic Companion
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  className="w-full justify-start gap-3 text-base"
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(item.labelKey)}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
