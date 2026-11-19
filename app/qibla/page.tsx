'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleAlert, Compass, MapPin, RefreshCw } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'


const MECCA = { lat: 21.4225, lon: 39.8262 }

function bearingToMecca(lat: number, lon: number): number {
  const latRad = (lat * Math.PI) / 180
  const lonRad = (lon * Math.PI) / 180
  const meccaLatRad = (MECCA.lat * Math.PI) / 180
  const meccaLonRad = (MECCA.lon * Math.PI) / 180

  const y = Math.sin(meccaLonRad - lonRad) * Math.cos(meccaLatRad)
  const x =
    Math.cos(latRad) * Math.sin(meccaLatRad) -
    Math.sin(latRad) * Math.cos(meccaLatRad) * Math.cos(meccaLonRad - lonRad)

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

type CompassState = 'idle' | 'active' | 'denied' | 'unsupported'

export default function QiblaPage() {
  const { t, language } = useLanguage()
  const [deviceHeading, setDeviceHeading] = useState(0)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [geoError, setGeoError] = useState(false)
  const [compassState, setCompassState] = useState<CompassState>('idle')

  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError(true)
      return
    }

    setGeoError(false)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted.current) return
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
      },
      () => {
        if (mounted.current) setGeoError(true)
      },
      { timeout: 8000, maximumAge: 10 * 60 * 1000 },
    )
  }, [])

  useEffect(() => {
    locate()
  }, [locate])

  useEffect(() => {
    if (compassState !== 'active') return

    const listener = (event: DeviceOrientationEvent) => {
      const webkitHeading = Reflect.get(event, 'webkitCompassHeading')
      setDeviceHeading(
        typeof webkitHeading === 'number' ? webkitHeading : (event.alpha ?? 0),
      )
    }

    window.addEventListener('deviceorientation', listener)
    return () => window.removeEventListener('deviceorientation', listener)
  }, [compassState])

  const enableCompass = async () => {
    if (typeof DeviceOrientationEvent === 'undefined') {
      setCompassState('unsupported')
      return
    }

    // iOS exposes requestPermission on the constructor; other browsers do not.
    const orientationApi: unknown = DeviceOrientationEvent

    if (
      typeof orientationApi === 'object' &&
      orientationApi !== null &&
      'requestPermission' in orientationApi &&
      typeof orientationApi.requestPermission === 'function'
    ) {
      try {
        const permission: unknown = await orientationApi.requestPermission()
        setCompassState(permission === 'granted' ? 'active' : 'denied')
      } catch {
        setCompassState('denied')
      }
      return
    }

    setCompassState('active')
  }

  const qiblaAngle = location ? bearingToMecca(location.lat, location.lon) : null

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('qibla')} icon={Compass} />

      <div className="mx-auto max-w-4xl space-y-5 px-6 py-8 md:px-8">
        {/* Location */}
        <Card className="flex items-center gap-3 p-4 text-sm" role="status">
          {geoError ? (
            <CircleAlert className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
          ) : (
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}

          <span className="min-w-0 flex-1">
            {geoError ? (
              <span className="font-medium">{t('request_location')}</span>
            ) : location ? (
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{t('location')}</span>{' '}
                <span dir="ltr" className="inline-block tabular-nums">
                  {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{t('locating')}</span>
            )}
          </span>
        </Card>

        {/* Bearing */}
        <Card className="p-5 text-center md:p-6">
          <p className="text-sm font-medium text-muted-foreground">{t('qibla_direction')}</p>
          <p
            className={cn(
              'mt-1 font-display font-semibold tabular-nums',
              qiblaAngle !== null
                ? 'text-5xl text-gold-ink dark:text-gold-light'
                : 'text-2xl text-muted-foreground',
            )}
          >
            {qiblaAngle !== null ? `${qiblaAngle.toFixed(1)}°` : '—'}
          </p>
          {compassState === 'active' ? (
            <p className="mt-2 text-xs tabular-nums text-muted-foreground">
              {language === 'ar' ? 'اتجاه الجهاز' : language === 'fr' ? 'Cap du téléphone' : 'Device heading'}
              {' · '}
              {deviceHeading.toFixed(0)}°
            </p>
          ) : null}
        </Card>

        {/* Compass */}
        {geoError ? (
          <Card className="flex flex-col items-center gap-3 p-8 text-center" role="alert">
            <CircleAlert className="h-8 w-8 text-destructive" aria-hidden="true" />
            <p className="max-w-md text-pretty text-sm text-muted-foreground">
              {language === 'ar'
                ? 'لا يمكن حساب اتجاه القبلة بدون موقعك. اسمح بالوصول إلى الموقع ثم أعد المحاولة.'
                : language === 'fr'
                  ? 'Impossible de calculer la Qibla sans votre position. Autorisez la localisation puis réessayez.'
                  : 'The Qibla bearing cannot be calculated without your position. Allow location access and try again.'}
            </p>
            <Button variant="outline" className="gap-2" onClick={locate}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {t('retry')}
            </Button>
          </Card>
        ) : compassState !== 'active' ? (
          <Card className="flex flex-col items-center gap-4 p-8 text-center">
            <Compass className="h-10 w-10 text-gold-ink dark:text-gold-light" aria-hidden="true" />
            <p className="max-w-md text-pretty text-sm text-muted-foreground">
              {compassState === 'denied' || compassState === 'unsupported'
                ? language === 'ar'
                  ? 'تعذّر تفعيل البوصلة على هذا الجهاز أو تم رفض الإذن.'
                  : language === 'fr'
                    ? 'La boussole n’a pas pu être activée sur cet appareil, ou l’autorisation a été refusée.'
                    : 'The compass could not be enabled on this device, or permission was denied.'
                : t('compass_request')}
            </p>
            <Button onClick={enableCompass} className="gap-2">
              <Compass className="h-4 w-4" aria-hidden="true" />
              {t('enable_compass')}
            </Button>
          </Card>
        ) : (
          <Card className="p-6 md:p-8">
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <svg
                viewBox="0 0 400 400"
                className="h-full w-full"
                role="img"
                aria-label={`${t('qibla_direction')} ${qiblaAngle?.toFixed(1)}°`}
              >
                <circle
                  cx="200"
                  cy="200"
                  r="190"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-border"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="176"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                  className="text-border"
                />

                {/* The dial rotates against the device heading so N stays true north. */}
                <g
                  style={{
                    transform: `rotate(${-deviceHeading}deg)`,
                    transformOrigin: '200px 200px',
                    transition: 'transform 120ms ease-out',
                  }}
                >
                  {/* 10° ticks */}
                  {Array.from({ length: 36 }).map((_, index) => {
                    const deg = index * 10
                    const rad = (deg * Math.PI) / 180 - Math.PI / 2
                    const major = deg % 30 === 0
                    const outer = 190
                    const inner = major ? 176 : 183
                    return (
                      <line
                        key={deg}
                        x1={200 + outer * Math.cos(rad)}
                        y1={200 + outer * Math.sin(rad)}
                        x2={200 + inner * Math.cos(rad)}
                        y2={200 + inner * Math.sin(rad)}
                        stroke="currentColor"
                        strokeWidth={major ? 2 : 1}
                        className={major ? 'text-muted-foreground' : 'text-border'}
                      />
                    )
                  })}

                  {[
                    { label: 'N', x: 200, y: 42 },
                    { label: 'E', x: 358, y: 207 },
                    { label: 'S', x: 200, y: 372 },
                    { label: 'W', x: 42, y: 207 },
                  ].map((cardinal) => (
                    <text
                      key={cardinal.label}
                      x={cardinal.x}
                      y={cardinal.y}
                      textAnchor="middle"
                      fontSize="22"
                      fontWeight="600"
                      fill="currentColor"
                      className={
                        cardinal.label === 'N'
                          ? 'fill-gold-ink dark:fill-gold-light'
                          : 'fill-muted-foreground'
                      }
                    >
                      {cardinal.label}
                    </text>
                  ))}

                  {/* Qibla needle, fixed on the dial at the true bearing */}
                  <g transform={`rotate(${qiblaAngle ?? 0} 200 200)`}>
                    <line x1="200" y1="200" x2="200" y2="96" stroke="#b91c1c" strokeWidth="3" />
                    <polygon points="200,72 190,98 210,98" fill="#b91c1c" />
                  </g>
                </g>

                <circle cx="200" cy="200" r="7" className="fill-foreground" />
                <circle
                  cx="200"
                  cy="200"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-border"
                />
              </svg>
            </div>

            <div className="mx-auto mt-4 flex max-w-sm flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-700" aria-hidden="true" />
                {t('qibla')}
              </span>
            </div>

            <p className="mx-auto mt-5 max-w-md text-pretty text-center text-sm text-muted-foreground">
              {t('point_towards')}
            </p>
          </Card>
        )}
      </div>
    </main>
  )
}
