'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  MoonStar,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
} from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { ClickableCard } from '@/components/clickable-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import zikr from '@/data/zikr.json'

type Zikr = (typeof zikr)[0]

const ZIKR_ICONS = {
  tawhid: MoonStar,
  praise: Sun,
  glorification: Sparkles,
} as const

function zikrIcon(formula: Zikr) {
  const key = formula.icon as keyof typeof ZIKR_ICONS
  return ZIKR_ICONS[key] ?? Sparkles
}

export default function ZikrPage() {
  const { t, language } = useLanguage()
  const [counts, setCounts] = useState<Record<number, number>>(
    Object.fromEntries(zikr.map((z) => [z.id, 0])),
  )
  const [selectedZikr, setSelectedZikr] = useState<Zikr | null>(null)

  const increment = (id: number, target: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, target),
    }))
  }

  const decrement = (id: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }))
  }

  const reset = (id: number) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }))
  }

  const selectedCount = selectedZikr ? (counts[selectedZikr.id] ?? 0) : 0
  const selectedDone = selectedZikr ? selectedCount >= selectedZikr.target : false

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('zikr')} icon={Sparkles} />

      <div className="mx-auto max-w-4xl px-6 py-8 md:px-8">
        {!selectedZikr ? (
          <>
            <p className="mb-6 max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
              {language === 'ar'
                ? 'اختر صيغة الذكر لتبدأ العد'
                : language === 'fr'
                  ? 'Choisissez une formule pour commencer le comptage'
                  : 'Choose a zikr formula to start counting'}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {zikr.map((formula) => {
                const Icon = zikrIcon(formula)
                const count = counts[formula.id] ?? 0
                const done = count >= formula.target
                const progress = Math.min(100, Math.round((count / formula.target) * 100))

                return (
                  <ClickableCard
                    key={formula.id}
                    onClick={() => setSelectedZikr(formula)}
                    aria-label={`${language === 'ar' ? formula.ar : formula[language]} — ${count} / ${formula.target}`}
                    className="flex flex-col gap-4"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/12 text-gold-ink dark:bg-gold/15 dark:text-gold-light"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {done ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/12 px-2 py-0.5 text-xs font-medium text-gold-ink dark:bg-gold/15 dark:text-gold-light">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          {t('reached_goal')}
                        </span>
                      ) : (
                        <ChevronRight
                          className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </span>

                    <span className="block font-arabic-display text-2xl leading-loose">
                      {formula.ar}
                    </span>

                    <span className="block space-y-2">
                      <span
                        className="block h-1.5 w-full overflow-hidden rounded-full bg-secondary"
                        aria-hidden="true"
                      >
                        <span
                          className="block h-full rounded-full bg-primary transition-[width] duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </span>
                      <span className="block text-xs font-medium tabular-nums text-muted-foreground">
                        {count} / {formula.target}
                      </span>
                    </span>
                  </ClickableCard>
                )
              })}
            </div>
          </>
        ) : (
          <Card className="p-6 md:p-8">
            <Button variant="ghost" className="-ms-2 mb-6" onClick={() => setSelectedZikr(null)}>
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              {t('close')}
            </Button>

            <div className="space-y-6">
              <div className="rounded-xl bg-gold/10 p-6 text-center dark:bg-gold/12">
                <p className="font-arabic-display text-4xl leading-[1.8] text-foreground md:text-5xl">
                  {selectedZikr.ar}
                </p>
              </div>

              {language !== 'ar' ? (
                <>
                  <section>
                    <h2 className="mb-2 text-balance text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('transliteration')}
                    </h2>
                    <p className="text-base italic leading-relaxed">{selectedZikr.transliteration}</p>
                  </section>

                  <section>
                    <h2 className="mb-2 text-balance text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('translation')}
                    </h2>
                    <p className="text-pretty text-lg leading-relaxed">{selectedZikr[language]}</p>
                  </section>
                </>
              ) : null}

              <section className="space-y-4 rounded-xl border border-border/60 p-5">
                <div className="text-center">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('repetitions')}
                  </p>
                  <p
                    role="status"
                    aria-live="polite"
                    className={cn(
                      'text-5xl font-bold tabular-nums',
                      selectedDone ? 'text-gold-ink dark:text-gold-light' : 'text-foreground',
                    )}
                  >
                    {selectedCount}
                    <span className="text-2xl font-medium text-muted-foreground">
                      {' '}
                      / {selectedZikr.target}
                    </span>
                  </p>
                  <Progress
                    value={Math.min(100, Math.round((selectedCount / selectedZikr.target) * 100))}
                    className="mt-3 h-1.5"
                    aria-label={t('repetitions')}
                  />
                </div>

                {selectedDone ? (
                  <p className="flex items-center justify-center gap-2 text-sm font-medium text-gold-ink dark:text-gold-light">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {t('reached_goal')}
                  </p>
                ) : null}

                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-14"
                    onClick={() => decrement(selectedZikr.id)}
                    disabled={selectedCount === 0}
                    aria-label={t('decrease')}
                  >
                    <Minus className="h-5 w-5" aria-hidden="true" />
                  </Button>

                  <Button
                    size="lg"
                    className="h-14 min-w-[9rem] gap-2"
                    onClick={() => increment(selectedZikr.id, selectedZikr.target)}
                    disabled={selectedDone}
                  >
                    <Plus className="h-5 w-5" aria-hidden="true" />
                    {selectedDone ? t('reached_goal') : t('add')}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full gap-2"
                  onClick={() => reset(selectedZikr.id)}
                  disabled={selectedCount === 0}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {t('reset')}
                </Button>
              </section>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
