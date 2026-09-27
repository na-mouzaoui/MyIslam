'use client'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function QuranPage() {
  const { t, language } = useLanguage()

  return (
    <main className="min-h-screen pb-28 md:ms-64">
      <Navigation />

      <PageHeader title={t('quran')} gradient="from-emerald-600 to-teal-600" icon={BookOpen} />

      <div className="p-6 md:p-8 max-w-4xl mx-auto h-screen flex items-center justify-center">
        <Card className="p-12 text-center space-y-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <div className="text-8xl mb-4 animate-pulse">📖</div>
          <h2 className="text-3xl font-bold">
            {language === 'ar'
              ? 'القرآن الكريم'
              : language === 'fr'
                ? 'Le Saint Coran'
                : 'The Holy Quran'}
          </h2>
          <div className="space-y-3">
            <div className="inline-block px-6 py-2 bg-amber-100 dark:bg-amber-900 rounded-full">
              <p className="text-amber-800 dark:text-amber-200 font-semibold text-sm">
                {language === 'ar'
                  ? '🔧 أعمال قيد التطوير'
                  : language === 'fr'
                    ? '🔧 Travaux en cours'
                    : '🔧 Work in Progress'}
              </p>
            </div>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {language === 'ar'
                ? 'نحن نعمل على تطوير قارئ القرآن الكريم الكامل مع جميع السور والآيات والترجمات. سيتم إطلاقه قريباً'
                : language === 'fr'
                  ? 'Nous travaillons sur le développement d\'un lecteur complet du Coran avec toutes les sourates, versets et traductions. Le lancement est prévu bientôt'
                  : 'We are working on developing a complete Quran reader with all chapters, verses and translations. Coming soon'}
            </p>
          </div>
          <div className="pt-4 text-xs text-muted-foreground">
            {language === 'ar'
              ? 'شكراً لصبرك ودعائك 🤲'
              : language === 'fr'
                ? 'Merci de votre patience et de vos prières 🤲'
                : 'Thank you for your patience and prayers 🤲'}
          </div>
        </Card>
      </div>
    </main>
  )
}
