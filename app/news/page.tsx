'use client'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart, Share2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const NEWS_ITEMS = [
  {
    id: 1,
    ar: 'فضائل سورة الفاتحة',
    fr: 'Les mérites de la Sourate Al-Fatiha',
    en: 'The Virtues of Surah Al-Fatiha',
    image: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    content: {
      ar: 'سورة الفاتحة تُعتبر من أعظم السور في القرآن الكريم وهي أم القرآن',
      en: 'Surah Al-Fatiha is considered one of the greatest chapters in the Quran and is called the Mother of the Quran',
      fr: 'La Sourate Al-Fatiha est considérée comme l\'une des plus grandes sourates du Coran',
    },
  },
  {
    id: 2,
    ar: 'أهمية الصلاة في الإسلام',
    fr: 'L\'importance de la prière en Islam',
    en: 'The Importance of Prayer in Islam',
    image: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    content: {
      ar: 'الصلاة هي عماد الدين والركن الثاني من أركان الإسلام الخمسة',
      en: 'Prayer is the pillar of religion and the second pillar of the five pillars of Islam',
      fr: 'La prière est le pilier de la religion et le deuxième pilier des cinq piliers de l\'Islam',
    },
  },
  {
    id: 3,
    ar: 'فضل الذكر والاستغفار',
    fr: 'Le mérite de l\'invocation et du repentir',
    en: 'The Merit of Remembrance and Repentance',
    image: 'bg-gradient-to-br from-purple-400 to-pink-500',
    content: {
      ar: 'الذكر يطهر القلب والروح ويقربنا من الله تعالى',
      en: 'Remembrance purifies the heart and brings us closer to Allah',
      fr: 'L\'invocation purifie le cœur et nous rapproche d\'Allah',
    },
  },
]

export default function NewsPage() {
  const { t, language } = useLanguage()
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [selectedNews, setSelectedNews] = useState<(typeof NEWS_ITEMS)[0] | null>(null)

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(id)) {
        newLiked.delete(id)
      } else {
        newLiked.add(id)
      }
      return newLiked
    })
  }

  return (
    <main className="pb-24 md:pb-0 md:ml-20 islamic-pattern min-h-screen flex flex-col">
      <Navigation />

      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-slate-600 to-zinc-600 text-white p-6 md:p-8 flex items-center gap-4 sticky top-0 z-20 shadow-lg">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t('news')}</h1>
      </div>

      {selectedNews ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-2xl mx-auto">
            <Button variant="ghost" className="mb-6" onClick={() => setSelectedNews(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('close')}
            </Button>

            <Card className="p-8 space-y-6">
              {/* Title */}
              <h2 className="text-3xl font-bold">
                {language === 'ar' ? selectedNews.ar : language === 'fr' ? selectedNews.fr : selectedNews.en}
              </h2>

              {/* Image */}
              <div className={`${selectedNews.image} rounded-lg h-64`} />

              {/* Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-lg leading-relaxed">
                  {language === 'ar' ? selectedNews.content.ar : language === 'fr' ? selectedNews.content.fr : selectedNews.content.en}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-6 border-t">
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <Heart className="w-4 h-4" />
                  {language === 'ar' ? 'إعجاب' : language === 'fr' ? 'Aimer' : 'Like'}
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <MessageCircle className="w-4 h-4" />
                  {language === 'ar' ? 'تعليق' : language === 'fr' ? 'Commenter' : 'Comment'}
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  {language === 'ar' ? 'مشاركة' : language === 'fr' ? 'Partager' : 'Share'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {NEWS_ITEMS.map((newsItem, index) => (
              <div
                key={newsItem.id}
                className={`snap-center snap-always cursor-pointer transition-transform hover:scale-105 ${index !== NEWS_ITEMS.length - 1 ? 'min-h-screen' : 'min-h-screen'}`}
                onClick={() => setSelectedNews(newsItem)}
              >
                <Card className={`${newsItem.image} m-4 p-8 h-[calc(100vh-150px)] flex flex-col justify-end text-white relative overflow-hidden shadow-lg`}>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <h2 className="text-3xl font-bold text-balance">
                      {language === 'ar' ? newsItem.ar : language === 'fr' ? newsItem.fr : newsItem.en}
                    </h2>

                    <p className="text-white/90">
                      {language === 'ar' ? newsItem.content.ar : language === 'fr' ? newsItem.content.fr : newsItem.content.en}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(newsItem.id)
                        }}
                        className={liked.has(newsItem.id) ? 'bg-red-500 hover:bg-red-600' : ''}
                      >
                        <Heart className={`w-4 h-4 ${liked.has(newsItem.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
