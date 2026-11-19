'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

import {
  COOKIE_KEYS,
  STORAGE_KEYS,
  writeCookie,
  type Language,
} from '@/lib/theme'

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
    decrease: 'إنقاص',
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
    navigation: 'التنقل',
    brand_tagline: 'رفيقك اليومي',
    more: 'المزيد',
    more_description: 'كل الأقسام والإعدادات',
    nav_practice: 'العبادات',
    nav_knowledge: 'المعرفة',
    back: 'رجوع',
    skip_to_content: 'تخطَّ إلى المحتوى',
    copy: 'نسخ',
    copied: 'تم النسخ',
    copy_failed: 'تعذّر النسخ',
    retry: 'إعادة المحاولة',
    refresh: 'تحديث',
    coming_soon: 'قريباً',
    coming_soon_desc:
      'نعمل على قارئ كامل للقرآن مع جميع السور والآيات والترجمات. سيكون متاحاً هنا.',
    today: 'اليوم',
    locating: 'جارٍ تحديد موقعك…',
    location_denied: 'تم رفض الوصول إلى الموقع',
    default_location: 'الموقع الافتراضي: مكة المكرمة',
    calendar_type: 'نوع التقويم',
    hijri: 'هجري',
    gregorian: 'ميلادي',
    page: 'صفحة',
    bookmark: 'علامة مرجعية',
    previous: 'السابق',
    next: 'التالي',
    share_copied: 'تم نسخ الرابط',
    empty_bookmarks: 'لا توجد علامات مرجعية بعد',
    notifications_soon: 'الإشعارات لكل قسم قيد التطوير.',
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
    decrease: 'Retirer',
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
    navigation: 'Navigation',
    brand_tagline: 'Compagnon quotidien',
    more: 'Plus',
    more_description: 'Toutes les sections et les réglages',
    nav_practice: 'Pratique',
    nav_knowledge: 'Connaissance',
    back: 'Retour',
    skip_to_content: 'Aller au contenu',
    copy: 'Copier',
    copied: 'Copié',
    copy_failed: 'Copie impossible',
    retry: 'Réessayer',
    refresh: 'Actualiser',
    coming_soon: 'Bientôt',
    coming_soon_desc:
      'Nous préparons un lecteur complet du Coran avec toutes les sourates, les versets et les traductions. Il sera disponible ici.',
    today: 'Aujourd’hui',
    locating: 'Localisation en cours…',
    location_denied: 'Accès à la position refusé',
    default_location: 'Position par défaut : La Mecque',
    calendar_type: 'Type de calendrier',
    hijri: 'Hijri',
    gregorian: 'Grégorien',
    page: 'Page',
    bookmark: 'Marque-page',
    previous: 'Précédent',
    next: 'Suivant',
    share_copied: 'Lien copié',
    empty_bookmarks: 'Aucun marque-page pour le moment',
    notifications_soon: 'Les notifications par section sont en préparation.',
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
    decrease: 'Remove',
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
    navigation: 'Navigation',
    brand_tagline: 'Daily companion',
    more: 'More',
    more_description: 'All sections and settings',
    nav_practice: 'Practice',
    nav_knowledge: 'Knowledge',
    back: 'Back',
    skip_to_content: 'Skip to content',
    copy: 'Copy',
    copied: 'Copied',
    copy_failed: 'Could not copy',
    retry: 'Try again',
    refresh: 'Refresh',
    coming_soon: 'Coming soon',
    coming_soon_desc:
      'We are building a complete Quran reader with every chapter, verse and translation. It will live here.',
    today: 'Today',
    locating: 'Locating you…',
    location_denied: 'Location access denied',
    default_location: 'Default location: Mecca',
    calendar_type: 'Calendar type',
    hijri: 'Hijri',
    gregorian: 'Gregorian',
    page: 'Page',
    bookmark: 'Bookmark',
    previous: 'Previous',
    next: 'Next',
    share_copied: 'Link copied',
    empty_bookmarks: 'No bookmarks yet',
    notifications_soon: 'Per-section notifications are still being built.',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode
  initialLanguage: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEYS.language, lang)
    writeCookie(COOKIE_KEYS.language, lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
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
