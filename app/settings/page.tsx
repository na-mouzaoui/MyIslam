'use client'

import { Bell, Globe, Monitor, Moon, Palette, Sun } from 'lucide-react'

import { useLanguage } from '@/app/context/language-context'
import { useTheme } from '@/app/context/theme-context'
import { Navigation } from '@/components/navigation'
import { PageHeader } from '@/components/page-header'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { isTheme, type Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

type Language = 'ar' | 'fr' | 'en'

const LANGUAGES: Array<{ value: Language; label: string; native: string }> = [
  { value: 'ar', label: 'العربية', native: 'RTL' },
  { value: 'fr', label: 'Français', native: 'LTR' },
  { value: 'en', label: 'English', native: 'LTR' },
]

function RadioRow({
  checked,
  children,
}: {
  checked: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3.5 transition-colors',
        checked ? 'border-gold/50 bg-gold/10' : 'border-border/70 hover:bg-muted/60',
      )}
    >
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()

  const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
    { value: 'light', label: t('light_mode'), icon: Sun },
    { value: 'dark', label: t('dark_mode'), icon: Moon },
    {
      value: 'system',
      label: language === 'ar' ? 'تلقائي' : language === 'fr' ? 'Système' : 'System',
      icon: Monitor,
    },
  ]

  return (
    <main
      id="main-content"
      className="min-h-screen pb-[calc(5.5rem_+_env(safe-area-inset-bottom))] md:ms-64 md:pb-12"
    >
      <Navigation />

      <PageHeader title={t('settings')} icon={Palette} />

      <div className="mx-auto max-w-3xl space-y-5 px-6 py-8 md:px-8">
        {/* Language */}
        <Card className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-gold-ink dark:text-gold-light" aria-hidden="true" />
            <h2 className="text-balance text-base font-semibold">{t('language')}</h2>
          </div>

          <RadioGroup
            value={language}
            onValueChange={(value) => {
              if (value === 'ar' || value === 'fr' || value === 'en') setLanguage(value)
            }}
            className="gap-2"
          >
            {LANGUAGES.map((option) => (
              <RadioRow key={option.value} checked={language === option.value}>
                <RadioGroupItem value={option.value} id={`lang-${option.value}`} />
                <Label
                  htmlFor={`lang-${option.value}`}
                  className="flex flex-1 cursor-pointer items-center justify-between gap-2 font-normal"
                >
                  <span>{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.native}</span>
                </Label>
              </RadioRow>
            ))}
          </RadioGroup>
        </Card>

        {/* Theme */}
        <Card className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sun className="h-4 w-4 text-gold-ink dark:text-gold-light" aria-hidden="true" />
            <h2 className="text-balance text-base font-semibold">{t('theme')}</h2>
          </div>

          <RadioGroup
            value={theme}
            onValueChange={(value) => {
              if (isTheme(value)) setTheme(value)
            }}
            className="gap-2"
          >
            {themeOptions.map((option) => {
              const Icon = option.icon
              return (
                <RadioRow key={option.value} checked={theme === option.value}>
                  <RadioGroupItem value={option.value} id={`theme-${option.value}`} />
                  <Label
                    htmlFor={`theme-${option.value}`}
                    className="flex flex-1 cursor-pointer items-center gap-2 font-normal"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {option.label}
                  </Label>
                </RadioRow>
              )
            })}
          </RadioGroup>
        </Card>

        {/* Notifications */}
        <Card className="p-5 md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <Bell className="h-4 w-4 text-gold-ink dark:text-gold-light" aria-hidden="true" />
            <h2 className="text-balance text-base font-semibold">{t('notifications')}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{t('notifications_soon')}</p>
        </Card>
      </div>
    </main>
  )
}
