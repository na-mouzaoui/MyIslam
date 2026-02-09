'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ar' | 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  direction: 'rtl' | 'ltr'
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    home: 'الرئيسية',
    quran: 'القرآن الكريم',
    duas: 'الأدعية',
    library: 'المكتبة',
    prayer_times: 'أوقات الصلاة',
    qibla: 'القبلة',
    zikr: 'الذكر',
    news: 'الأخبار',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    dark_mode: 'الوضع الليلي',
    light_mode: 'الوضع النهاري',
    islamic_colors: 'الألوان الإسلامية',
    notifications: 'الإشعارات',
    close: 'إغلاق',
    set_reminder: 'تعيين التنبيه',
    schedule: 'الجدول الزمني',
    repetitions: 'عدد التكرارات',
    reached_goal: 'ما شاء الله! لقد وصلت إلى الهدف',
    reset: 'إعادة تعيين',
    add: 'زيادة',
    location: 'الموقع',
    hijri_date: 'التاريخ الهجري',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    request_location: 'فشل الحصول على الموقع',
    fetch_error: 'خطأ في جلب أوقات الصلاة',
    qibla_direction: 'اتجاه القبلة',
    enable_compass: 'تفعيل البوصلة',
    compass_request: 'لتفعيل البوصلة، يرجى السماح بالوصول إلى اتجاه الجهاز',
    qibla_north: 'الشمال',
    device_north: 'الشمال',
    point_towards: 'وجّه هاتفك نحو الاتجاه الأحمر للصلاة',
    like: 'إعجاب',
    comment: 'تعليق',
    share: 'مشاركة',
    transliteration: 'النطق',
    translation: 'الترجمة',
  },
  fr: {
    home: 'Accueil',
    quran: 'Coran',
    duas: 'Invocations',
    library: 'Bibliothèque',
    prayer_times: 'Horaires de prière',
    qibla: 'Qibla',
    zikr: 'Zikr',
    news: 'Actualités',
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    dark_mode: 'Mode sombre',
    light_mode: 'Mode clair',
    islamic_colors: 'Couleurs islamiques',
    notifications: 'Notifications',
    close: 'Fermer',
    set_reminder: 'Définir une alerte',
    schedule: 'Programmation',
    repetitions: 'Nombre de répétitions',
    reached_goal: 'Mashallah! Vous avez atteint votre objectif',
    reset: 'Réinitialiser',
    add: 'Ajouter',
    location: 'Emplacement',
    hijri_date: 'Date Hijri',
    loading: 'Chargement...',
    error: 'Erreur',
    request_location: 'Impossible d\'obtenir l\'emplacement',
    fetch_error: 'Erreur lors de la récupération des horaires',
    qibla_direction: 'Direction de la Qibla',
    enable_compass: 'Activer la boussole',
    compass_request: 'Pour activer la boussole, veuillez autoriser l\'accès à l\'orientation du téléphone',
    qibla_north: 'Nord',
    device_north: 'Nord',
    point_towards: 'Pointez votre téléphone vers la direction rouge pour prier',
    like: 'Aimer',
    comment: 'Commenter',
    share: 'Partager',
    transliteration: 'Translittération',
    translation: 'Traduction',
  },
  en: {
    home: 'Home',
    quran: 'Quran',
    duas: 'Invocations',
    library: 'Library',
    prayer_times: 'Prayer Times',
    qibla: 'Qibla',
    zikr: 'Zikr',
    news: 'News',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    islamic_colors: 'Islamic Colors',
    notifications: 'Notifications',
    close: 'Close',
    set_reminder: 'Set Reminder',
    schedule: 'Schedule',
    repetitions: 'Repetitions',
    reached_goal: 'Mashallah! You reached your goal',
    reset: 'Reset',
    add: 'Add',
    location: 'Location',
    hijri_date: 'Hijri Date',
    loading: 'Loading...',
    error: 'Error',
    request_location: 'Failed to get location',
    fetch_error: 'Error fetching prayer times',
    qibla_direction: 'Qibla Direction',
    enable_compass: 'Enable Compass',
    compass_request: 'To enable compass, please allow access to device orientation',
    qibla_north: 'North',
    device_north: 'North',
    point_towards: 'Point your phone towards the red arrow to face Qibla',
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    transliteration: 'Transliteration',
    translation: 'Translation',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    if (saved && ['ar', 'fr', 'en'].includes(saved)) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language)
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  const direction = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
