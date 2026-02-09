'use client'

import { useLanguage } from '@/app/context/language-context'
import { useTheme } from '@/app/context/theme-context'
import { Navigation } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme, islamicColor, setIslamicColor } = useTheme()

  const themes = [
    { value: 'light', label: 'light_mode' },
    { value: 'dark', label: 'dark_mode' },
    { value: 'system', label: language === 'ar' ? 'تلقائي' : language === 'fr' ? 'Système' : 'System' },
  ]

  const colors = [
    { value: 'emerald', label: language === 'ar' ? 'أخضر إسلامي' : language === 'fr' ? 'Vert Islamique' : 'Islamic Green' },
    { value: 'teal', label: language === 'ar' ? 'أزرق مائي' : language === 'fr' ? 'Bleu Océan' : 'Ocean Blue' },
    { value: 'amber', label: language === 'ar' ? 'ذهبي دافئ' : language === 'fr' ? 'Or Chaud' : 'Warm Gold' },
    { value: 'slate', label: language === 'ar' ? 'رمادي حديث' : language === 'fr' ? 'Gris Moderne' : 'Modern Slate' },
  ]

  return (
    <main className="pb-24 md:pb-0 md:ml-20 islamic-pattern min-h-screen">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-zinc-600 text-white p-6 md:p-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{t('settings')}</h1>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Language Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {t('language')}
          </h2>

          <RadioGroup value={language} onValueChange={(val) => setLanguage(val as any)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ar" id="lang-ar" />
                <Label htmlFor="lang-ar" className="cursor-pointer font-normal">
                  العربية
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fr" id="lang-fr" />
                <Label htmlFor="lang-fr" className="cursor-pointer font-normal">
                  Français
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en" className="cursor-pointer font-normal">
                  English
                </Label>
              </div>
            </div>
          </RadioGroup>
        </Card>

        {/* Theme Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('theme')}</h2>

          <RadioGroup value={theme} onValueChange={(val) => setTheme(val as any)}>
            <div className="space-y-3">
              {themes.map((th) => (
                <div key={th.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={th.value} id={`theme-${th.value}`} />
                  <Label htmlFor={`theme-${th.value}`} className="cursor-pointer font-normal">
                    {t(th.label)}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </Card>

        {/* Islamic Colors */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('islamic_colors')}</h2>

          <RadioGroup value={islamicColor} onValueChange={(val) => setIslamicColor(val as any)}>
            <div className="space-y-3">
              {colors.map((color) => (
                <div key={color.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={color.value} id={`color-${color.value}`} />
                  <Label htmlFor={`color-${color.value}`} className="cursor-pointer font-normal flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-current"
                      style={{
                        backgroundColor:
                          color.value === 'emerald'
                            ? '#059669'
                            : color.value === 'teal'
                              ? '#0d9488'
                              : color.value === 'amber'
                                ? '#d97706'
                                : '#404040',
                      }}
                    />
                    {color.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('notifications')}</h2>
          <p className="text-muted-foreground text-sm">
            {language === 'ar'
              ? 'الإشعارات متاحة لكل منطقة'
              : language === 'fr'
                ? 'Les notifications sont disponibles pour chaque section'
                : 'Notifications are available in each section'}
          </p>
        </Card>
      </div>
    </main>
  )
}
