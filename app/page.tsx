'use client'

import { useLanguage } from './context/language-context'
import { Navigation } from '@/components/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { BookOpen, Clock, Compass, Sparkles, Newspaper, Library } from 'lucide-react'

const SECTIONS = [
  {
    id: 'quran',
    href: '/quran',
    icon: BookOpen,
    labelKey: 'quran',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'duas',
    href: '/duas',
    icon: BookOpen,
    labelKey: 'duas',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'prayer_times',
    href: '/prayer-times',
    icon: Clock,
    labelKey: 'prayer_times',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'library',
    href: '/library',
    icon: Library,
    labelKey: 'library',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 'qibla',
    href: '/qibla',
    icon: Compass,
    labelKey: 'qibla',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'zikr',
    href: '/zikr',
    icon: Sparkles,
    labelKey: 'zikr',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'news',
    href: '/news',
    icon: Newspaper,
    labelKey: 'news',
    color: 'from-slate-500 to-zinc-500',
  },
]

export default function Page() {
  const { t, language } = useLanguage()

  return (
    <main className="pb-24 md:pb-0 md:ml-20 islamic-pattern min-h-screen">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-balance">
          {language === 'ar' ? 'الرفيق الإسلامي' : language === 'fr' ? 'Le Compagnon Islamique' : 'Islamic Companion'}
        </h1>
        <p className="text-emerald-50 text-lg">
          {language === 'ar'
            ? 'رفيقك في ممارسة العبادات والأذكار'
            : language === 'fr'
              ? 'Votre compagnon pour pratiquer les adorations et les invocations'
              : 'Your companion for Islamic practice'}
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          {language === 'ar' ? 'الأقسام الرئيسية' : language === 'fr' ? 'Sections principales' : 'Main Sections'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.id} href={section.href}>
                <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${section.color} p-4 rounded-lg text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{t(section.labelKey)}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Islamic Greeting */}
      <div className="px-6 md:px-8 pb-12 max-w-6xl mx-auto">
        <Card className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <div className="text-center space-y-3">
            <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">
              {language === 'ar'
                ? 'بسم الله الرحمن الرحيم'
                : language === 'fr'
                  ? 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux'
                  : 'In the name of Allah, the Most Compassionate, the Most Merciful'}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {language === 'ar'
                ? 'اختر القسم الذي تريد لتبدأ رحلتك الروحية'
                : language === 'fr'
                  ? 'Choisissez une section pour commencer votre voyage spirituel'
                  : 'Choose a section to begin your spiritual journey'}
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
