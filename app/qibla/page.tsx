'use client'

import { useLanguage } from '@/app/context/language-context'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Compass, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function QiblaPage() {
  const { t, language } = useLanguage()
  const [deviceOrientation, setDeviceOrientation] = useState(0)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [qiblaAngle, setQiblaAngle] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  const [compassSupport, setCompassSupport] = useState(true)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })
        calculateQiblaAngle(latitude, longitude)
      })
    }
  }, [])

  const calculateQiblaAngle = (lat: number, lon: number) => {
    // Mecca coordinates
    const meckaLat = 21.4225
    const meckaLon = 39.8262

    const latRad = (lat * Math.PI) / 180
    const lonRad = (lon * Math.PI) / 180
    const meckaLatRad = (meckaLat * Math.PI) / 180
    const meckaLonRad = (meckaLon * Math.PI) / 180

    const y = Math.sin(meckaLonRad - lonRad) * Math.cos(meckaLatRad)
    const x = Math.cos(latRad) * Math.sin(meckaLatRad) - Math.sin(latRad) * Math.cos(meckaLatRad) * Math.cos(meckaLonRad - lonRad)

    const angle = (Math.atan2(y, x) * 180) / Math.PI
    setQiblaAngle((angle + 360) % 360)
  }

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          setHasPermission(true)
          window.addEventListener('deviceorientation', handleDeviceOrientation)
        }
      } catch (error) {
        setCompassSupport(false)
      }
    } else {
      setHasPermission(true)
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }
  }

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const alpha = event.alpha || 0
    setDeviceOrientation(alpha)
  }

  const compassRotation = (deviceOrientation - qiblaAngle + 360) % 360

  return (
    <main className="pb-24 md:pb-0 md:ml-20 islamic-pattern min-h-screen">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 md:p-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t('qibla')}</h1>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Location Info */}
        {location && (
          <Card className="p-4 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            {language === 'ar'
              ? `الموقع: ${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°`
              : language === 'fr'
                ? `Emplacement: ${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°`
                : `Location: ${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°`}
          </Card>
        )}

        {/* Qibla Angle Info */}
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-2">
            {language === 'ar'
              ? 'اتجاه القبلة'
              : language === 'fr'
                ? 'Direction de la Qibla'
                : 'Qibla Direction'}
          </p>
          <p className="text-4xl font-bold">{qiblaAngle.toFixed(1)}°</p>
        </Card>

        {/* Compass */}
        {!hasPermission && compassSupport ? (
          <Card className="p-8 text-center space-y-4">
            <Compass className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {language === 'ar'
                ? 'لتفعيل البوصلة، يرجى السماح بالوصول إلى اتجاه الجهاز'
                : language === 'fr'
                  ? 'Pour activer la boussole, veuillez autoriser l\'accès à l\'orientation du téléphone'
                  : 'To enable compass, please allow access to device orientation'}
            </p>
            <Button size="lg" onClick={requestPermission}>
              {language === 'ar' ? 'تفعيل البوصلة' : language === 'fr' ? 'Activer la boussole' : 'Enable Compass'}
            </Button>
          </Card>
        ) : (
          <Card className="p-8">
            <div className="relative w-full aspect-square max-w-sm mx-auto">
              {/* Compass Circle */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Outer circle */}
                <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />

                {/* Cardinal directions */}
                <text x="200" y="30" textAnchor="middle" className="text-lg font-bold fill-foreground" fontSize="24">
                  N
                </text>
                <text x="370" y="205" textAnchor="middle" className="text-lg font-bold fill-foreground" fontSize="24">
                  E
                </text>
                <text x="200" y="380" textAnchor="middle" className="text-lg font-bold fill-foreground" fontSize="24">
                  S
                </text>
                <text x="30" y="205" textAnchor="middle" className="text-lg font-bold fill-foreground" fontSize="24">
                  W
                </text>

                {/* Degree markers */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = (deg * Math.PI) / 180
                  const x1 = 200 + 170 * Math.cos(rad - Math.PI / 2)
                  const y1 = 200 + 170 * Math.sin(rad - Math.PI / 2)
                  const x2 = 200 + 190 * Math.cos(rad - Math.PI / 2)
                  const y2 = 200 + 190 * Math.sin(rad - Math.PI / 2)
                  return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
                })}

                {/* Rotating needle (transform applied with style) */}
                <g style={{ transform: `rotate(${compassRotation}deg)`, transformOrigin: '200px 200px', transition: 'transform 0.1s ease-out' }}>
                  {/* Qibla direction - Red needle */}
                  <line x1="200" y1="200" x2="200" y2="80" stroke="#dc2626" strokeWidth="3" />
                  <circle cx="200" cy="70" r="8" fill="#dc2626" />
                </g>

                {/* Device orientation - Blue reference */}
                <line x1="200" y1="200" x2="200" y2="100" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-muted-foreground" />
                <circle cx="200" cy="95" r="6" fill="currentColor" className="text-muted-foreground" />

                {/* Center point */}
                <circle cx="200" cy="200" r="8" fill="currentColor" className="text-foreground" />
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'القبلة' : language === 'fr' ? 'Qibla' : 'Qibla'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-dashed border-muted-foreground" />
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'الشمال' : language === 'fr' ? 'Nord' : 'North'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
          <p className="text-sm text-muted-foreground">
            {language === 'ar'
              ? 'وجّه هاتفك نحو الاتجاه الأحمر للصلاة'
              : language === 'fr'
                ? 'Pointez votre téléphone vers la direction rouge pour prier'
                : 'Point your phone towards the red arrow to face Qibla'}
          </p>
        </Card>
      </div>
    </main>
  )
}
