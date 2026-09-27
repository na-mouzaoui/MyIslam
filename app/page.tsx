'use client'

import { useLanguage } from './context/language-context'
import { Navigation } from '@/components/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Clock,
  Compass,
  Sparkles,
  Newspaper,
  Library,
  MoonStar,
  ChevronRight,
} from 'lucide-react'

const SECTIONS = [
  {
    id: 'quran',
    href: '/quran',
    icon: BookOpen,
    labelKey: 'quran',
    color: 'from-emerald-500 to-teal-500',
    desc: { ar: 'اقرأ وتدبّر', fr: 'Lire et méditer', en: 'Read & reflect' },
  },
  {
    id: 'duas',
    href: '/duas',
    icon: Sparkles,
    labelKey: 'duas',
    color: 'from-blue-500 to-cyan-500',
    desc: { ar: 'أدعية مختارة', fr: 'Invocations choisies', en: 'Selected supplications' },
  },
  {
    id: 'prayer_times',
    href: '/prayer-times',
    icon: Clock,
    labelKey: 'prayer_times',
    color: 'from-amber-500 to-orange-500',
    desc: { ar: 'مواقيت دقيقة', fr: 'Horaires précis', en: 'Accurate timings' },
  },
  {
    id: 'library',
    href: '/library',
    icon: Library,
    labelKey: 'library',
    color: 'from-rose-500 to-pink-500',
    desc: { ar: 'كتب ومراجع', fr: 'Livres & références', en: 'Books & references' },
  },
  {
    id: 'qibla',
    href: '/qibla',
    icon: Compass,
    labelKey: 'qibla',
    color: 'from-purple-500 to-indigo-500',
    desc: { ar: 'اتجاه القبلة', fr: 'Direction de la Qibla', en: 'Qibla direction' },
  },
  {
    id: 'zikr',
    href: '/zikr',
    icon: Sparkles,
    labelKey: 'zikr',
    color: 'from-green-500 to-emerald-500',
    desc: { ar: 'عدّ وذكر', fr: 'Compter & invoquer', en: 'Count & remember' },
  },
  {
    id: 'news',
    href: '/news',
    icon: Newspaper,
    labelKey: 'news',
    color: 'from-slate-500 to-zinc-600',
    desc: { ar: 'مقالات ومواضيع', fr: 'Articles & sujets', en: 'Articles & topics' },
  },
]

export default function Page() {
  const { t, language } = useLanguage()

  const title =
    language === 'ar' ? 'الرفيق الإسلامي' : language === 'fr' ? 'Le Compagnon Islamique' : 'Islamic Companion'

  const subtitle =
    language === 'ar'
      ? 'رفيقك في ممارسة العبادات والأذكار'
      : language === 'fr'
        ? 'Votre compagnon pour pratiquer les adorations et les invocations'
        : 'Your companion for Islamic practice'

  const sectionsLabel =
    language === 'ar' ? 'الأقسام الرئيسية' : language === 'fr' ? 'Sections principales' : 'Main Sections'

  const bismillah =
    language === 'ar'
      ? 'بسم الله الرحمن الرحيم'
      : language === 'fr'
        ? "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux"
        : 'In the name of Allah, the Most Compassionate, the Most Merciful'

  const hint =
    language === 'ar'
      ? 'اختر القسم الذي تريد لتبدأ رحلتك الروحية'
      : language === 'fr'
        ? 'Choisissez une section pour commencer votre voyage spirituel'
        : 'Choose a section to begin your spiritual journey'

  return (
    <main className="min-h-screen pb-28 md:ms-64">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 text-white">
        <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-20">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium ring-1 ring-inset ring-white/25">
            <MoonStar className="h-3.5 w-3.5" />
            Islamic Companion
          </span>

          <h1 className="animate-fade-up mt-5 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            {title}
          </h1>
          <p className="animate-fade-up mt-3 max-w-2xl text-lg text-emerald-50/90">{subtitle}</p>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">{sectionsLabel}</h2>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {SECTIONS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.id} href={section.href} className="group">
                <Card className="h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-emerald-500/20">
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform duration-300 group-hover:scale-105',
                        section.color,
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{t(section.labelKey)}</h3>
                      <p className="truncate text-sm text-muted-foreground">
                        {section.desc[language as 'ar' | 'fr' | 'en']}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Islamic Greeting */}
      <section className="mx-auto max-w-6xl px-6 pb-12 md:px-8">
        <Card className="relative overflow-hidden border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 text-center dark:border-emerald-800/50 dark:from-emerald-950 dark:to-teal-950">
          <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />
          <div className="relative z-10 space-y-3">
            <p className="text-xl font-semibold text-emerald-700 text-balance md:text-2xl dark:text-emerald-300">
              {bismillah}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{hint}</p>
          </div>
        </Card>
      </section>
    </main>
  )
}
