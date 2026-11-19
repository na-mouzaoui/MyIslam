'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'

import { useLanguage } from './context/language-context'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import {
  KNOWLEDGE_SECTIONS,
  PRACTICE_SECTIONS,
  TONES,
  type SectionMeta,
} from '@/lib/sections'
import { cn } from '@/lib/utils'

const LOCALES: Record<string, string> = {
  ar: 'ar-u-ca-gregory',
  fr: 'fr-FR',
  en: 'en-GB',
}

function SectionCard({ section, className }: { section: SectionMeta; className?: string }) {
  const { t, language } = useLanguage()
  const Icon = section.icon
  const tone = TONES[section.tone]

  return (
    <Link
      href={section.href}
      className={cn(
        'group flex flex-col justify-between gap-6 rounded-2xl border border-border/60 bg-card p-5 text-card-foreground shadow-sm',
        'transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-border hover:shadow-md active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <span
        className={cn('flex h-11 w-11 items-center justify-center rounded-xl', tone.soft, tone.text)}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="block">
        <span className="flex items-center justify-between gap-2">
          <span className="text-base font-semibold tracking-tight">{t(section.labelKey)}</span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{section.desc[language]}</span>
      </span>
    </Link>
  )
}

export default function Page() {
  const { t, language } = useLanguage()
  const [today, setToday] = useState('')

  // unslop-ignore DERIVED_STATE_USEEFFECT -- the locale date is resolved after hydration to avoid a server/client timezone mismatch
  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat(LOCALES[language] ?? 'en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date()),
    )
  }, [language])

  const title =
    language === 'ar'
      ? 'الرفيق الإسلامي'
      : language === 'fr'
        ? 'Le Compagnon Islamique'
        : 'Islamic Companion'

  const subtitle =
    language === 'ar'
      ? 'مواقيت الصلاة، القبلة، الذكر والقرآن في مكان واحد.'
      : language === 'fr'
        ? 'Les horaires de prière, la Qibla, le zikr et le Coran au même endroit.'
        : 'Prayer times, Qibla, zikr and the Quran in one place.'

  const bismillah =
    language === 'ar'
      ? 'بسم الله الرحمن الرحيم'
      : language === 'fr'
        ? "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux"
        : 'In the name of Allah, the Most Compassionate, the Most Merciful'

  const hint =
    language === 'ar'
      ? 'اختر قسماً لتبدأ'
      : language === 'fr'
        ? 'Choisissez une section pour commencer'
        : 'Choose a section to begin'

  const prayerTimes = PRACTICE_SECTIONS.find((section) => section.id === 'prayer_times')
  const otherPractice = PRACTICE_SECTIONS.filter((section) => section.id !== 'prayer_times')

  return (
    <main id="main-content" className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12">
      <Navigation />

      <section className="relative border-b border-border/60 dark:border-border/40">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-12 md:px-8 md:pb-14 md:pt-16">
          <h1 className="animate-fade-up text-balance font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="animate-fade-up mt-3 max-w-xl text-pretty text-base text-muted-foreground md:text-lg dark:text-cream/70">
            {subtitle}
          </p>
          {today ? (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-ink ring-1 ring-inset ring-gold/30 dark:text-gold-light">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="capitalize">{today}</span>
            </p>
          ) : (
            <p className="mt-5 inline-flex min-h-[26px] items-center" aria-hidden="true" />
          )}
        </div>
      </section>

      <div>
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:px-8 lg:grid-cols-3">
        <section aria-labelledby="practice-heading" className="lg:col-span-2">
          <h2
            id="practice-heading"
            className="mb-4 text-balance text-xl font-semibold tracking-tight"
          >
            {t('nav_practice')}
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            {prayerTimes ? (
              <Link
                href={prayerTimes.href}
                className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 text-card-foreground shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-border hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:col-span-3"
              >
                <span
                  className={cn(
                    'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
                    TONES[prayerTimes.tone].soft,
                    TONES[prayerTimes.tone].text,
                  )}
                  aria-hidden="true"
                >
                  <Clock className="h-7 w-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold tracking-tight">
                    {t(prayerTimes.labelKey)}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {prayerTimes.desc[language]}
                  </span>
                </span>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : null}

            {otherPractice.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>

        <section aria-labelledby="knowledge-heading">
          <h2
            id="knowledge-heading"
            className="mb-4 text-balance text-xl font-semibold tracking-tight"
          >
            {t('nav_knowledge')}
          </h2>

          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            {KNOWLEDGE_SECTIONS.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      TONES[section.tone].soft,
                      TONES[section.tone].text,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {t(section.labelKey)}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {section.desc[language]}
                    </span>
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>
        </section>
        </div>

      <section className="mx-auto max-w-6xl px-6 pb-12 md:px-8">
        <Card className="relative overflow-hidden border-gold/25 bg-gradient-to-br from-paper-deep to-paper p-8 text-center dark:border-gold/20 dark:from-ink dark:to-ink-deep">
          <div
            className="zellige-card pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.06]"
            aria-hidden="true"
          />
          <div className="relative z-10 space-y-2">
            <p
              className={cn(
                'text-balance text-2xl leading-relaxed text-gold-ink md:text-3xl dark:text-gold-light',
                language === 'ar' && 'font-arabic-display',
              )}
            >
              {bismillah}
            </p>
            <p className="text-sm text-gold-ink/80 dark:text-gold-light/80">{hint}</p>
          </div>
        </Card>
      </section>
      </div>
    </main>
  )
}
