'use client'

import { BookOpen, Sparkles } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function QuranPage() {
  const { t, language } = useLanguage()

  const title =
    language === 'ar' ? 'القرآن الكريم' : language === 'fr' ? 'Le Saint Coran' : 'The Holy Quran'

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('quran')} icon={BookOpen} />

      <div className="mx-auto flex max-w-3xl items-start px-6 py-10 md:px-8 md:py-14">
        <Card className="relative w-full overflow-hidden p-8 text-center md:p-12">
          <div className="relative z-10 flex flex-col items-center gap-5">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/12 text-gold-ink dark:bg-gold/15 dark:text-gold-light"
              aria-hidden="true"
            >
              <BookOpen className="h-8 w-8" />
            </span>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                  {title}
                </h2>
                <Badge
                  variant="outline"
                  className="gap-1 border-gold/40 bg-gold/10 text-gold-ink dark:text-gold-light"
                >
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {t('coming_soon')}
                </Badge>
              </div>
              <p className="mx-auto max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                {t('coming_soon_desc')}
              </p>
            </div>

            <p className="font-arabic-display text-xl leading-loose text-muted-foreground">
              وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
