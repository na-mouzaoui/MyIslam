'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Copy, HandHeart, Heart, Sparkles } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { ClickableCard } from '@/components/clickable-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import duas from '@/data/duas.json'

type Dua = (typeof duas)[0]
type CopyState = 'idle' | 'copied' | 'failed'

const DUA_ICONS = {
  supplication: HandHeart,
  praise: Sparkles,
} as const

function duaIcon(dua: Dua) {
  const key = dua.icon as keyof typeof DUA_ICONS
  return DUA_ICONS[key] ?? Heart
}

export default function DuasPage() {
  const { t, language } = useLanguage()
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  useEffect(() => {
    if (copyState === 'idle') return
    const timeout = setTimeout(() => setCopyState('idle'), 2000)
    return () => clearTimeout(timeout)
  }, [copyState])

  const copyDua = async (dua: Dua) => {
    const translation = language === 'ar' ? dua.ar : dua[language]
    const text = `${dua.ar}\n\n${dua.transliteration}\n\n${translation}`

    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('duas')} icon={Heart} />

      <div className="mx-auto max-w-4xl px-6 py-8 md:px-8">
        {!selectedDua ? (
          <>
            <p className="mb-6 max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
              {language === 'ar'
                ? 'استكشف مجموعة من الأدعية المختارة'
                : language === 'fr'
                  ? 'Explorez une collection d’invocations sélectionnées'
                  : 'Explore a collection of selected invocations'}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {duas.map((dua) => {
                const Icon = duaIcon(dua)
                return (
                  <ClickableCard
                    key={dua.id}
                    onClick={() => setSelectedDua(dua)}
                    aria-label={language === 'ar' ? dua.ar : dua[language]}
                    className="flex flex-col gap-4"
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/12 text-gold-ink dark:bg-gold/15 dark:text-gold-light"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="block flex-1">
                      <span className="block font-arabic-display text-2xl leading-loose">
                        {dua.ar}
                      </span>
                      {language !== 'ar' ? (
                        <span className="mt-1 block text-sm italic text-muted-foreground">
                          {dua.transliteration}
                        </span>
                      ) : null}
                    </span>

                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-gold-ink dark:text-gold-light">
                      {t('translation')}
                      <ChevronRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </ClickableCard>
                )
              })}
            </div>
          </>
        ) : (
          <Card className="p-6 md:p-8">
            <Button
              variant="ghost"
              className="-ms-2 mb-6"
              onClick={() => {
                setSelectedDua(null)
                setCopyState('idle')
              }}
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              {t('close')}
            </Button>

            <div className="space-y-6">
              <h2 className="text-balance sr-only">
                {language === 'ar' ? selectedDua.ar : selectedDua[language]}
              </h2>

              <div className="rounded-xl bg-gold/10 p-6 text-center dark:bg-gold/12">
                <p className="font-arabic-display text-3xl leading-[1.9] text-foreground md:text-4xl">
                  {selectedDua.ar}
                </p>
              </div>

              {language !== 'ar' ? (
                <>
                  <section>
                    <h3 className="mb-2 text-balance text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('transliteration')}
                    </h3>
                    <p className="text-base italic leading-relaxed">{selectedDua.transliteration}</p>
                  </section>

                  <section>
                    <h3 className="mb-2 text-balance text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t('translation')}
                    </h3>
                    <p className="text-pretty text-lg leading-relaxed">{selectedDua[language]}</p>
                  </section>
                </>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
                <Button onClick={() => copyDua(selectedDua)} className="h-11 gap-2">
                  {copyState === 'copied' ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copyState === 'copied' ? t('copied') : t('copy')}
                </Button>

                <p
                  role="status"
                  aria-live="polite"
                  className={cn(
                    'text-sm',
                    copyState === 'failed' ? 'text-destructive' : 'text-muted-foreground',
                  )}
                >
                  {copyState === 'failed' ? t('copy_failed') : null}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
