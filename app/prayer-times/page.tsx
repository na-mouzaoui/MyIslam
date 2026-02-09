'use client'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface PrayerTimes {
  Fajr: string
  Sunrise: string
  Dhuhr: string
  Asr: string
  Sunset: string
  Maghrib: string
  Isha: string
}

interface PrayerData {
  date: string
  timings: PrayerTimes
  meta: {
    latitude: number
    longitude: number
  }
}

export default function PrayerTimesPage() {
  const { t, language } = useLanguage()
  const [prayerTimes, setPrayerTimes] = useState<PrayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showHijri, setShowHijri] = useState(true)

  const prayerNames: Record<keyof PrayerTimes, { ar: string; en: string; fr: string }> = {
    Fajr: { ar: 'الفجر', en: 'Fajr', fr: 'Fajr' },
    Sunrise: { ar: 'الشروق', en: 'Sunrise', fr: 'Lever du Soleil' },
    Dhuhr: { ar: 'الظهر', en: 'Dhuhr', fr: 'Dhuhr' },
    Asr: { ar: 'العصر', en: 'Asr', fr: 'Asr' },
    Sunset: { ar: 'الغروب', en: 'Sunset', fr: 'Coucher du Soleil' },
    Maghrib: { ar: 'المغرب', en: 'Maghrib', fr: 'Maghrib' },
    Isha: { ar: 'العشاء', en: 'Isha', fr: 'Isha' },
  }

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude })
          fetchPrayerTimes(latitude, longitude, selectedDate)
        },
        (err) => {
          setError(language === 'ar' ? 'فشل الحصول على الموقع' : language === 'fr' ? 'Impossible d\'obtenir l\'emplacement' : 'Failed to get location')
          // Fallback to default location (Mecca)
          const mekkah = { lat: 21.4225, lon: 39.8262 }
          setLocation(mekkah)
          fetchPrayerTimes(mekkah.lat, mekkah.lon, selectedDate)
        }
      )
    }
  }, [selectedDate, language])

  const fetchPrayerTimes = async (lat: number, lon: number, date: Date) => {
    try {
      setLoading(true)
      const dateStr = date.toISOString().split('T')[0]
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=2`
      )

      if (!response.ok) throw new Error('Failed to fetch prayer times')

      const data = await response.json()
      setPrayerTimes(data.data)
      setError(null)
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في جلب أوقات الصلاة' : language === 'fr' ? 'Erreur lors de la récupération des horaires' : 'Error fetching prayer times')
    } finally {
      setLoading(false)
    }
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return (
    <main className="pb-24 md:pb-0 md:ml-20 islamic-pattern min-h-screen">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 md:p-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t('prayer_times')}</h1>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Location Info */}
        {location && (
          <Card className="p-4 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            {language === 'ar'
              ? `الموقع: ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`
              : language === 'fr'
                ? `Emplacement: ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`
                : `Location: ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
          </Card>
        )}

        {/* Date Navigation & Calendar Toggle */}
        <Card className="p-6 space-y-4">
          {/* Toggle Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {language === 'ar' ? 'نوع التقويم' : language === 'fr' ? 'Type de calendrier' : 'Calendar Type'}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={showHijri ? 'default' : 'outline'}
                onClick={() => setShowHijri(true)}
                className="text-xs"
              >
                {language === 'ar' ? 'هجري' : language === 'fr' ? 'Hijri' : 'Hijri'}
              </Button>
              <Button
                size="sm"
                variant={!showHijri ? 'default' : 'outline'}
                onClick={() => setShowHijri(false)}
                className="text-xs"
              >
                {language === 'ar' ? 'ميلادي' : language === 'fr' ? 'Grégorien' : 'Gregorian'}
              </Button>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" onClick={() => changeDate(-1)}>
              {language === 'ar' ? '→' : '←'}
            </Button>
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                {showHijri
                  ? language === 'ar'
                    ? 'التاريخ الهجري'
                    : language === 'fr'
                      ? 'Date Hijri'
                      : 'Hijri Date'
                  : language === 'ar'
                    ? 'التاريخ الميلادي'
                    : language === 'fr'
                      ? 'Date Grégorienne'
                      : 'Gregorian Date'}
              </p>
              <p className="text-base font-semibold">
                {showHijri
                  ? selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US-u-ca-islamic')
                  : selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {showHijri ? selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US') : selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA-u-ca-islamic' : 'en-US-u-ca-islamic')}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => changeDate(1)}>
              {language === 'ar' ? '←' : '→'}
            </Button>
          </div>
        </Card>

        {/* Prayer Times */}
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </Card>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : prayerTimes ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {(Object.keys(prayerTimes.timings) as Array<keyof PrayerTimes>)
              .filter((key) => key in prayerNames)
              .map((key) => {
                const prayerName = prayerNames[key]
                const displayName =
                  language === 'ar' ? prayerName.ar : language === 'fr' ? prayerName.fr : prayerName.en
                const time = prayerTimes.timings[key]

                return (
                  <Card key={key} className="p-3 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                    <p className="text-muted-foreground text-xs mb-1 truncate">{displayName}</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{time}</p>
                  </Card>
                )
              })}
          </div>
        ) : null}

        {/* Tips */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <p className="text-sm text-muted-foreground">
            {language === 'ar'
              ? 'تحديث تلقائي للموقع كل ساعة'
              : language === 'fr'
                ? 'Mise à jour automatique de l\'emplacement toutes les heures'
                : 'Location auto-updates hourly'}
          </p>
        </Card>
      </div>
    </main>
  )
}
