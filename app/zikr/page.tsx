'use client'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import zikr from '@/data/zikr.json'
import { useState } from 'react'

export default function ZikrPage() {
  const { t, language } = useLanguage()
  const [counts, setCounts] = useState<Record<number, number>>(
    Object.fromEntries(zikr.map((z) => [z.id, 0]))
  )
  const [selectedZikr, setSelectedZikr] = useState<(typeof zikr)[0] | null>(null)

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
    setCounts((prev) => ({
      ...prev,
      [id]: 0,
    }))
  }

  return (
    <main className="pb-24 md:pb-0 md:ml-20 islamic-pattern min-h-screen">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 md:p-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t('zikr')}</h1>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {!selectedZikr ? (
          <>
            <p className="text-muted-foreground mb-6">
              {language === 'ar'
                ? 'اختر صيغة الذكر لتبدأ العد'
                : language === 'fr'
                  ? 'Choisissez une formule pour commencer le comptage'
                  : 'Choose a zikr formula to start counting'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zikr.map((z) => (
                <Card
                  key={z.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedZikr(z)}
                >
                  <div className="text-center space-y-3">
                    <span className="text-4xl block">{z.icon}</span>
                    <p className="text-lg font-semibold">{language === 'ar' ? z.ar : z[language as 'en' | 'fr']}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <span>0 / {z.target}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => setSelectedZikr(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('close')}
            </Button>

            <div className="space-y-8">
              {/* Zikr Text */}
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                <p className="text-4xl font-bold text-green-700 dark:text-green-300 leading-relaxed">
                  {selectedZikr.ar}
                </p>
              </div>

              {language !== 'ar' && (
                <>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      {language === 'fr' ? 'Translittération' : 'Transliteration'}
                    </p>
                    <p className="text-lg italic">{selectedZikr.transliteration}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      {language === 'fr' ? 'Traduction' : 'Translation'}
                    </p>
                    <p className="text-xl leading-relaxed">
                      {selectedZikr[language as 'en' | 'fr']}
                    </p>
                  </div>
                </>
              )}

              {/* Counter */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'ar'
                      ? 'عدد التكرارات'
                      : language === 'fr'
                        ? 'Nombre de répétitions'
                        : 'Repetitions'}
                  </p>
                  <div className="text-6xl font-bold text-green-600 dark:text-green-400">
                    {counts[selectedZikr.id]} / {selectedZikr.target}
                  </div>
                  {counts[selectedZikr.id] === selectedZikr.target && (
                    <p className="text-green-600 dark:text-green-400 font-semibold mt-3 text-lg">
                      {language === 'ar'
                        ? 'ما شاء الله! لقد وصلت إلى الهدف'
                        : language === 'fr'
                          ? 'Mashallah! Vous avez atteint votre objectif'
                          : 'Mashallah! You reached your goal'}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 w-16 text-xl bg-transparent"
                    onClick={() => decrement(selectedZikr.id)}
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    className="h-16 px-8"
                    onClick={() => increment(selectedZikr.id, selectedZikr.target)}
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    {language === 'ar' ? 'زيادة' : language === 'fr' ? 'Ajouter' : 'Add'}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => reset(selectedZikr.id)}
                >
                  {language === 'ar' ? 'إعادة تعيين' : language === 'fr' ? 'Réinitialiser' : 'Reset'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
