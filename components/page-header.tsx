'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { TONES, type SectionTone } from '@/lib/sections'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  tone?: SectionTone
  icon?: LucideIcon
}

/**
 * One committed header treatment for every page. It shares the app background
 * so the pattern stays continuous from header to content.
 */
export function PageHeader({ title, subtitle, tone = 'gold', icon: Icon }: PageHeaderProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const goBack = () => {
    const sameOriginReferrer =
      document.referrer.startsWith(window.location.origin) && document.referrer !== ''
    if (sameOriginReferrer || window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <header className="relative border-b border-border/60">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-start gap-4 p-6 md:p-8">
        <button
          type="button"
          onClick={goBack}
          aria-label={t('back')}
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted/80 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
        </button>

        {Icon ? (
          <span
            className={cn(
              'mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5 sm:flex',
              TONES[tone].solid,
            )}
            aria-hidden="true"
          >
            <Icon className="h-6 w-6" />
          </span>
        ) : null}

        <div className="min-w-0 flex-1">
          <h1 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-pretty text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  )
}
