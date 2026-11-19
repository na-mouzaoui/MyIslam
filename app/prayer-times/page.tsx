'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
} from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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

const MECCA = { lat: 21.4225, lon: 39.8262 }

const PRAYER_NAMES: Record<keyof PrayerTimes, { ar: string; en: string; fr: string }> = {
  Fajr: { ar: 'الفجر', en: 'Fajr', fr: 'Fajr' },
  Sunrise: { ar: 'الشروق', en: 'Sunrise', fr: 'Lever du soleil' },
  Dhuhr: { ar: 'الظهر', en: 'Dhuhr', fr: 'Dhuhr' },
  Asr: { ar: 'العصر', en: 'Asr', fr: 'Asr' },
  Sunset: { ar: 'الغروب', en: 'Sunset', fr: 'Coucher du soleil' },
  Maghrib: { ar: 'المغرب', en: 'Maghrib', fr: 'Maghrib' },
  Isha: { ar: 'العشاء', en: 'Isha', fr: 'Isha' },
}

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Aladhan returns "05:12 (CET)"; the timezone suffix is noise in a card grid. */
function cleanTime(value: string): string {
  return value.replace(/\s*\([^)]*\)\s*$/, '')
}

const SKELETON_ROWS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'sunset', 'maghrib', 'isha', 'extra']

type GeoState = 'locating' | 'granted' | 'denied'
type LoadState = 'loading' | 'ready' | 'error'

export default function PrayerTimesPage() {
  const { t, language } = useLanguage()
  const [prayerTimes, setPrayerTimes] = useState<PrayerData | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [geoState, setGeoState] = useState<GeoState>('locating')
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [showHijri, setShowHijri] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    if (!navigator.geolocation) {
      setCoords(MECCA)
      setGeoState('denied')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!active) return
        setCoords({ lat: position.coords.latitude, lon: position.coords.longitude })
        setGeoState('granted')
      },
      () => {
        if (!active) return
        setCoords(MECCA)
        setGeoState('denied')
      },
      { timeout: 8000, maximumAge: 10 * 60 * 1000 },
    )

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!coords) return

    let cancelled = false
    setLoadState('loading')

    const url = `https://api.aladhan.com/v1/timings/${toDateKey(selectedDate)}?latitude=${coords.lat}&longitude=${coords.lon}&method=2`

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch prayer times')
        return response.json()
      })
      .then((data: { data: PrayerData }) => {
        if (cancelled) return
        setPrayerTimes(data.data)
        setLoadState('ready')
      })
      .catch(() => {
        if (cancelled) return
        setLoadState('error')
      })

    return () => {
      cancelled = true
    }
  }, [coords, selectedDate, reloadKey])

  const changeDate = useCallback((days: number) => {
    setSelectedDate((previous) => {
      const next = new Date(previous)
      next.setDate(next.getDate() + days)
      return next
    })
  }, [])

  const dates = useMemo(() => {
    const gregorianLocale =
      language === 'ar' ? 'ar-u-ca-gregory' : language === 'fr' ? 'fr-FR' : 'en-GB'
    const hijriLocale =
      language === 'ar'
        ? 'ar-SA-u-ca-islamic'
        : language === 'fr'
          ? 'fr-FR-u-ca-islamic'
          : 'en-GB-u-ca-islamic'

    const gregorian = new Intl.DateTimeFormat(gregorianLocale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(selectedDate)

    const hijri = new Intl.DateTimeFormat(hijriLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(selectedDate)

    return { gregorian, hijri }
  }, [selectedDate, language])

  const prayerRows = prayerTimes
    ? (Object.keys(PRAYER_NAMES) as Array<keyof PrayerTimes>).map((key) => ({
        key,
        label: PRAYER_NAMES[key][language],
        time: cleanTime(prayerTimes.timings[key] ?? '—'),
        isInfo: key === 'Sunrise' || key === 'Sunset',
      }))
    : []

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('prayer_times')} icon={Sunrise} />

      <div className="mx-auto max-w-4xl space-y-5 px-6 py-8 md:px-8">
        {/* Location */}
        <Card className="flex items-center gap-3 p-4 text-sm" role="status">
          {geoState === 'denied' ? (
            <CircleAlert
              className="h-4 w-4 shrink-0 text-gold-ink dark:text-gold-light"
              aria-hidden="true"
            />
          ) : (
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}

          <span className="min-w-0 flex-1">
            {geoState === 'locating' ? (
              <span className="text-muted-foreground">{t('locating')}</span>
            ) : geoState === 'denied' ? (
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium">{t('location_denied')}</span>
                <span className="text-muted-foreground">{t('default_location')}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{t('location')}</span>{' '}
                <span dir="ltr" className="inline-block tabular-nums">
                  {coords?.lat.toFixed(2)}°, {coords?.lon.toFixed(2)}°
                </span>
              </span>
            )}
          </span>
        </Card>

        {/* Date */}
        <Card className="space-y-5 p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-balance text-sm font-semibold">{t('calendar_type')}</h2>
            <div
              className="inline-flex rounded-lg border border-border/60 bg-muted/50 p-0.5"
              role="group"
              aria-label={t('calendar_type')}
            >
              {[
                { value: true, label: t('hijri') },
                { value: false, label: t('gregorian') },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  aria-pressed={showHijri === option.value}
                  onClick={() => setShowHijri(option.value)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    showHijri === option.value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => changeDate(-1)}
              aria-label={t('previous')}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Button>

            <div className="min-w-0 flex-1 text-center">
              <p className="text-xl font-semibold leading-snug text-balance tabular-nums font-display">
                {showHijri ? dates.hijri : dates.gregorian}
              </p>
              <p className="mt-0.5 text-xs text-balance text-muted-foreground">
                {showHijri ? dates.gregorian : dates.hijri}
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => changeDate(1)}
              aria-label={t('next')}
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Button>
          </div>
        </Card>

        {/* Times */}
        <section aria-labelledby="times-heading" aria-busy={loadState === 'loading'}>
          <h2 id="times-heading" className="text-balance sr-only">
            {t('prayer_times')}
          </h2>

          {loadState === 'loading' ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {SKELETON_ROWS.map((row) => (
                <Card key={row} className="space-y-2 p-4">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                </Card>
              ))}
            </div>
          ) : loadState === 'error' ? (
            <Card className="flex flex-col items-center gap-3 p-8 text-center" role="alert">
              <CircleAlert className="h-8 w-8 text-destructive" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">{t('fetch_error')}</p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {t('retry')}
              </Button>
            </Card>
          ) : prayerRows.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {prayerRows.map((row) => (
                <Card
                  key={row.key}
                  className={cn(
                    'p-4 transition-colors',
                    row.isInfo ? 'bg-muted/40' : 'hover:border-border',
                  )}
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    {row.key === 'Sunrise' ? (
                      <Sunrise
                        className="h-3.5 w-3.5 text-gold-ink dark:text-gold-light"
                        aria-hidden="true"
                      />
                    ) : row.key === 'Sunset' ? (
                      <Sunset
                        className="h-3.5 w-3.5 text-gold-ink dark:text-gold-light"
                        aria-hidden="true"
                      />
                    ) : null}
                    <p className="truncate text-xs font-medium text-muted-foreground">{row.label}</p>
                  </div>
                  <p
                    className={cn(
                      'font-display text-2xl font-semibold tabular-nums',
                      row.isInfo ? 'text-muted-foreground' : 'text-gold-ink dark:text-gold-light',
                    )}
                  >
                    {row.time}
                  </p>
                </Card>
              ))}
            </div>
          ) : null}
        </section>

        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          {language === 'ar'
            ? 'تُحسب المواقيت لموقعك الحالي. استخدم الأسهم لتغيير اليوم.'
            : language === 'fr'
              ? 'Les horaires sont calculés pour votre position actuelle. Utilisez les flèches pour changer de jour.'
              : 'Times are calculated for your current position. Use the arrows to change the day.'}
        </p>
      </div>
    </main>
  )
}
