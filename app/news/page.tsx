'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, Heart, Newspaper, Share2 } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface NewsItem {
  id: number
  ar: string
  fr: string
  en: string
  content: { ar: string; fr: string; en: string }
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    ar: 'فضائل سورة الفاتحة',
    fr: 'Les mérites de la sourate Al-Fatiha',
    en: 'The virtues of Surah Al-Fatiha',
    content: {
      ar: 'سورة الفاتحة تُعتبر من أعظم السور في القرآن الكريم وهي أم القرآن',
      en: 'Surah Al-Fatiha is considered one of the greatest chapters in the Quran and is called the Mother of the Quran',
      fr: 'La sourate Al-Fatiha est considérée comme l’une des plus grandes sourates du Coran',
    },
  },
  {
    id: 2,
    ar: 'أهمية الصلاة في الإسلام',
    fr: 'L’importance de la prière en Islam',
    en: 'The importance of prayer in Islam',
    content: {
      ar: 'الصلاة هي عماد الدين والركن الثاني من أركان الإسلام الخمسة',
      en: 'Prayer is the pillar of religion and the second of the five pillars of Islam',
      fr: 'La prière est le pilier de la religion et le deuxième des cinq piliers de l’Islam',
    },
  },
  {
    id: 3,
    ar: 'فضل الذكر والاستغفار',
    fr: 'Le mérite de l’invocation et du repentir',
    en: 'The merit of remembrance and repentance',
    content: {
      ar: 'الذكر يطهر القلب والروح ويقربنا من الله تعالى',
      en: 'Remembrance purifies the heart and brings us closer to Allah',
      fr: 'L’invocation purifie le cœur et nous rapproche d’Allah',
    },
  },
]

type ShareState = 'idle' | 'copied' | 'failed'

export default function NewsPage() {
  const { t, language } = useLanguage()
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [shareState, setShareState] = useState<ShareState>('idle')

  useEffect(() => {
    if (shareState === 'idle') return
    const timeout = setTimeout(() => setShareState('idle'), 2500)
    return () => clearTimeout(timeout)
  }, [shareState])

  const toggleLike = (id: number) => {
    setLiked((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const shareArticle = async (item: NewsItem) => {
    const title = item[language]

    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href })
        return
      }
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(`${title} — ${window.location.href}`)
      setShareState('copied')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setShareState('failed')
    }
  }

  const title = (item: NewsItem) => item[language]
  const excerpt = (item: NewsItem) => item.content[language]
  const [featured, ...rest] = NEWS_ITEMS

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('news')} icon={Newspaper} />

      <div className="mx-auto max-w-3xl px-6 py-8 md:px-8">
        {selectedNews ? (
          <>
            <Button variant="ghost" className="-ms-2 mb-5" onClick={() => setSelectedNews(null)}>
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              {t('close')}
            </Button>

            <Card className="overflow-hidden">
              <div className="relative overflow-hidden bg-ink px-6 py-8 text-cream md:px-8 md:py-10 dark:bg-ink-deep">
                <div
                  className="zellige-night pointer-events-none absolute inset-0 opacity-50"
                  aria-hidden="true"
                />
                <h2 className="relative z-10 text-balance font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {title(selectedNews)}
                </h2>
              </div>

              <div className="space-y-6 p-6 md:p-8">
                <p className="text-pretty text-lg leading-relaxed">{excerpt(selectedNews)}</p>

                <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
                  <Button
                    variant={liked.has(selectedNews.id) ? 'default' : 'outline'}
                    aria-pressed={liked.has(selectedNews.id)}
                    onClick={() => toggleLike(selectedNews.id)}
                    className="gap-2"
                  >
                    <Heart
                      className={cn('h-4 w-4', liked.has(selectedNews.id) && 'fill-current')}
                      aria-hidden="true"
                    />
                    {t('like')}
                  </Button>

                  <Button variant="outline" className="gap-2" onClick={() => shareArticle(selectedNews)}>
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    {t('share')}
                  </Button>

                  <p
                    role="status"
                    aria-live="polite"
                    className={cn(
                      'text-sm',
                      shareState === 'failed' ? 'text-destructive' : 'text-muted-foreground',
                    )}
                  >
                    {shareState === 'copied' ? t('share_copied') : null}
                    {shareState === 'failed' ? t('copy_failed') : null}
                  </p>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <div className="space-y-6">
            {/* Featured article — typographic, no invented imagery */}
            <button
              type="button"
              onClick={() => setSelectedNews(featured)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-ink p-6 text-start text-cream shadow-sm transition-shadow duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-8 dark:bg-ink-deep"
            >
              <span
                className="zellige-night pointer-events-none absolute inset-0 opacity-50"
                aria-hidden="true"
              />
              <span className="relative z-10 block space-y-3">
                <span className="block text-balance font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {title(featured)}
                </span>
                <span className="block max-w-2xl text-pretty text-sm leading-relaxed text-cream/70 md:text-base">
                  {excerpt(featured)}
                </span>
                <span className="inline-flex items-center gap-1 pt-1 text-sm font-medium text-gold-light">
                  {language === 'ar' ? 'اقرأ' : language === 'fr' ? 'Lire' : 'Read'}
                  <ChevronRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </button>

            <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card">
              {rest.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedNews(item)}
                  className="group flex w-full items-start gap-4 px-4 py-4 text-start transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:px-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-balance font-display text-base font-semibold">{title(item)}</span>
                    <span className="mt-1 block text-pretty text-sm leading-relaxed text-muted-foreground">
                      {excerpt(item)}
                    </span>
                  </span>
                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
