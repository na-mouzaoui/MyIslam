'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight, Menu, MoonStar, Settings } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import {
  KNOWLEDGE_SECTIONS,
  MOBILE_PRIMARY,
  PRACTICE_SECTIONS,
  SETTINGS_ITEM,
  TONES,
  isActivePath,
  type SectionMeta,
} from '@/lib/sections'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

function SectionIcon({ section, size = 'md' }: { section: SectionMeta; size?: 'sm' | 'md' }) {
  const Icon = section.icon
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl',
        TONES[section.tone].soft,
        TONES[section.tone].text,
        size === 'md' ? 'h-10 w-10' : 'h-8 w-8',
      )}
      aria-hidden="true"
    >
      <Icon className={size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} />
    </span>
  )
}

export function Navigation() {
  const { t, language } = useLanguage()
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const shortLabel = (section: SectionMeta) => section.short[language]

  return (
    <>
      {/* Mobile bottom navigation — four destinations plus an overflow sheet */}
      <nav
        aria-label={t('navigation')}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <div className="mx-auto flex max-w-md items-stretch gap-0.5 px-2 py-1.5">
          {MOBILE_PRIMARY.map((section) => {
            const Icon = section.icon
            const active = isActivePath(pathname, section.href)
            return (
              <Link
                key={section.id}
                href={section.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[11px] font-medium leading-none transition-colors',
                  active
                    ? 'bg-gold/12 text-gold-ink dark:text-gold-light'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="w-full truncate text-center">{shortLabel(section)}</span>
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[11px] font-medium leading-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="w-full truncate text-center">{t('more')}</span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl pb-[calc(1.5rem_+_env(safe-area-inset-bottom))] md:hidden"
        >
          <SheetHeader className="text-start">
            <SheetTitle>{t('more')}</SheetTitle>
            <SheetDescription className="sr-only">{t('more_description')}</SheetDescription>
          </SheetHeader>

          <div className="mt-5 space-y-6">
            {[
              { key: 'practice', label: t('nav_practice'), items: PRACTICE_SECTIONS },
              { key: 'knowledge', label: t('nav_knowledge'), items: KNOWLEDGE_SECTIONS },
            ].map((group) => (
              <div key={group.key}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((section) => {
                    const active = isActivePath(pathname, section.href)
                    return (
                      <Link
                        key={section.id}
                        href={section.href}
                        onClick={() => setMoreOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex min-h-[56px] items-center gap-3 rounded-xl border border-border/60 px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'border-gold/40 bg-gold/12 text-gold-ink dark:text-gold-light'
                            : 'text-foreground hover:bg-muted',
                        )}
                      >
                        <SectionIcon section={section} size="sm" />
                        <span className="truncate">{t(section.labelKey)}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            <Link
              href={SETTINGS_ITEM.href}
              onClick={() => setMoreOpen(false)}
              aria-current={isActivePath(pathname, SETTINGS_ITEM.href) ? 'page' : undefined}
              className="flex min-h-[52px] items-center gap-3 rounded-xl border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t('settings')}
              <ChevronRight className="ms-auto h-4 w-4 text-muted-foreground rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop side navigation */}
      <aside className="fixed start-0 top-0 z-30 hidden h-screen w-64 flex-col border-e border-border/60 bg-background/80 p-4 backdrop-blur-lg md:flex">
        <Link
          href="/"
          className="mb-7 flex items-center gap-3 rounded-xl px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <MoonStar className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-semibold leading-tight">
              MyIslam
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {t('brand_tagline')}
            </span>
          </span>
        </Link>

        <nav aria-label={t('navigation')} className="flex flex-1 flex-col gap-6 overflow-y-auto">
          {[
            { key: 'practice', label: t('nav_practice'), items: PRACTICE_SECTIONS },
            { key: 'knowledge', label: t('nav_knowledge'), items: KNOWLEDGE_SECTIONS },
          ].map((group) => (
            <div key={group.key}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((section) => {
                  const Icon = section.icon
                  const active = isActivePath(pathname, section.href)
                  return (
                    <Link
                      key={section.id}
                      href={section.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                        active
                          ? 'bg-gold/12 font-semibold text-gold-ink dark:text-gold-light'
                          : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-primary"
                        />
                      ) : null}
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{t(section.labelKey)}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t border-border/60 pt-3">
          <Link
            href={SETTINGS_ITEM.href}
            aria-current={isActivePath(pathname, SETTINGS_ITEM.href) ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              isActivePath(pathname, SETTINGS_ITEM.href)
                ? 'bg-gold/12 font-semibold text-gold-ink dark:text-gold-light'
                : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Settings className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t('settings')}
          </Link>
          <p className="mt-2 px-3 text-[11px] text-muted-foreground/70">MyIslam · v1.0</p>
        </div>
      </aside>
    </>
  )
}
