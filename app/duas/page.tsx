'use client'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Bell, Heart } from 'lucide-react'
import duas from '@/data/duas.json'
import { useState } from 'react'

export default function DuasPage() {
  const { t, language } = useLanguage()
  const [selectedDua, setSelectedDua] = useState<(typeof duas)[0] | null>(null)

  return (
    <main className="min-h-screen pb-28 md:ms-64">
      <Navigation />

      <PageHeader title={t('duas')} gradient="from-blue-600 to-cyan-600" icon={Heart} />

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {!selectedDua ? (
          <>
            <p className="text-muted-foreground mb-6">
              {language === 'ar'
                ? 'استكشف مجموعة من الأدعية المختارة'
                : language === 'fr'
                  ? 'Explorez une collection d\'invocations sélectionnées'
                  : 'Explore a collection of selected invocations'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {duas.map((dua) => (
                <Card
                  key={dua.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedDua(dua)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{dua.icon}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-lg font-semibold text-center mb-2">
                    {language === 'ar' ? dua.ar : dua[language as 'en' | 'fr']}
                  </p>
                  {language !== 'ar' && (
                    <p className="text-sm text-muted-foreground text-center italic">{dua.transliteration}</p>
                  )}
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => setSelectedDua(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('close')}
            </Button>

            <div className="space-y-8">
              {/* Arabic Text */}
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg">
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 leading-relaxed">
                  {selectedDua.ar}
                </p>
              </div>

              {language !== 'ar' && (
                <>
                  {/* Transliteration */}
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      {language === 'fr' ? 'Translittération' : 'Transliteration'}
                    </p>
                    <p className="text-lg italic">{selectedDua.transliteration}</p>
                  </div>

                  {/* Translation */}
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      {language === 'fr' ? 'Traduction' : 'Translation'}
                    </p>
                    <p className="text-xl leading-relaxed">
                      {selectedDua[language as 'en' | 'fr']}
                    </p>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gap-2">
                  <Bell className="w-4 h-4" />
                  {language === 'ar' ? 'تعيين التنبيه' : language === 'fr' ? 'Définir une alerte' : 'Set Reminder'}
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <Clock className="w-4 h-4" />
                  {language === 'ar' ? 'الجدول الزمني' : language === 'fr' ? 'Programmation' : 'Schedule'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
