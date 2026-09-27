'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  Library,
  Clock,
  Compass,
  Sparkles,
  Newspaper,
  Settings,
  MoonStar,
} from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { cn } from '@/lib/utils'

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
      <nav className="fixed inset-x-3 bottom-3 z-30 flex items-center gap-1 rounded-2xl border border-border/60 bg-background/85 p-1.5 shadow-xl shadow-black/5 backdrop-blur-lg md:hidden">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              title={t(item.labelKey)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-11 flex-1 items-center justify-center rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </nav>

      {/* Desktop Side Navigation */}
      <aside className="fixed start-0 top-0 z-30 hidden h-screen w-64 flex-col border-e border-border/60 bg-background/80 p-4 backdrop-blur-lg md:flex">
        <Link href="/" className="mb-6 flex items-center gap-3 rounded-xl px-2 py-1.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
            <MoonStar className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-gradient truncate text-base font-extrabold leading-tight">Islamic Companion</p>
            <p className="text-[11px] text-muted-foreground">Your daily companion</p>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="truncate">{t(item.labelKey)}</span>
              </Link>
            )
          })}
        </nav>

        <p className="mt-4 px-3 text-[11px] text-muted-foreground/70">MyIslam · v1.0</p>
      </aside>
    </>
  )
}
