import {
  BookOpen,
  Clock,
  Compass,
  Heart,
  Home,
  Library,
  Newspaper,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export type SectionTone = 'gold'

export interface ToneClasses {
  /** Filled accent used for icon medallions */
  solid: string
  /** Tinted surface used behind icons */
  soft: string
  /** Accessible text colour on neutral surfaces */
  text: string
}

export const TONES: Record<SectionTone, ToneClasses> = {
  gold: {
    solid: 'bg-gold text-ink-deep',
    soft: 'bg-gold/12 dark:bg-gold/15',
    text: 'text-gold-ink dark:text-gold-light',
  },
}

export type SectionGroup = 'practice' | 'knowledge'

export interface SectionMeta {
  id: string
  href: string
  labelKey: string
  short: { ar: string; fr: string; en: string }
  desc: { ar: string; fr: string; en: string }
  icon: LucideIcon
  tone: SectionTone
  group: SectionGroup
}

export const HOME_ITEM: SectionMeta = {
  id: 'home',
  href: '/',
  labelKey: 'home',
  short: { ar: 'الرئيسية', fr: 'Accueil', en: 'Home' },
  desc: { ar: 'لوحة الأقسام', fr: 'Vue d’ensemble', en: 'Overview' },
  icon: Home,
  tone: 'gold',
  group: 'practice',
}

export const SETTINGS_ITEM: SectionMeta = {
  id: 'settings',
  href: '/settings',
  labelKey: 'settings',
  short: { ar: 'الإعدادات', fr: 'Réglages', en: 'Settings' },
  desc: { ar: 'اللغة والمظهر', fr: 'Langue et apparence', en: 'Language & appearance' },
  icon: Settings,
  tone: 'gold',
  group: 'knowledge',
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'prayer_times',
    href: '/prayer-times',
    labelKey: 'prayer_times',
    short: { ar: 'الصلاة', fr: 'Prières', en: 'Prayer' },
    desc: { ar: 'مواقيت دقيقة', fr: 'Horaires précis', en: 'Accurate timings' },
    icon: Clock,
    tone: 'gold',
    group: 'practice',
  },
  {
    id: 'qibla',
    href: '/qibla',
    labelKey: 'qibla',
    short: { ar: 'القبلة', fr: 'Qibla', en: 'Qibla' },
    desc: { ar: 'اتجاه القبلة', fr: 'Direction de la Qibla', en: 'Qibla direction' },
    icon: Compass,
    tone: 'gold',
    group: 'practice',
  },
  {
    id: 'zikr',
    href: '/zikr',
    labelKey: 'zikr',
    short: { ar: 'الذكر', fr: 'Zikr', en: 'Zikr' },
    desc: { ar: 'عدّ وذكر', fr: 'Compter et invoquer', en: 'Count and remember' },
    icon: Sparkles,
    tone: 'gold',
    group: 'practice',
  },
  {
    id: 'duas',
    href: '/duas',
    labelKey: 'duas',
    short: { ar: 'الأدعية', fr: 'Douas', en: 'Duas' },
    desc: { ar: 'أدعية مختارة', fr: 'Invocations choisies', en: 'Selected supplications' },
    icon: Heart,
    tone: 'gold',
    group: 'practice',
  },
  {
    id: 'quran',
    href: '/quran',
    labelKey: 'quran',
    short: { ar: 'القرآن', fr: 'Coran', en: 'Quran' },
    desc: { ar: 'اقرأ وتدبّر', fr: 'Lire et méditer', en: 'Read and reflect' },
    icon: BookOpen,
    tone: 'gold',
    group: 'knowledge',
  },
  {
    id: 'library',
    href: '/library',
    labelKey: 'library',
    short: { ar: 'المكتبة', fr: 'Livres', en: 'Library' },
    desc: { ar: 'كتب ومراجع', fr: 'Livres et références', en: 'Books and references' },
    icon: Library,
    tone: 'gold',
    group: 'knowledge',
  },
  {
    id: 'news',
    href: '/news',
    labelKey: 'news',
    short: { ar: 'الأخبار', fr: 'Articles', en: 'News' },
    desc: { ar: 'مقالات ومواضيع', fr: 'Articles et sujets', en: 'Articles and topics' },
    icon: Newspaper,
    tone: 'gold',
    group: 'knowledge',
  },
]

export const PRACTICE_SECTIONS = SECTIONS.filter((s) => s.group === 'practice')
export const KNOWLEDGE_SECTIONS = SECTIONS.filter((s) => s.group === 'knowledge')

/** Four destinations fit the mobile bar; everything else lives in the sheet. */
export const MOBILE_PRIMARY: SectionMeta[] = [
  HOME_ITEM,
  SECTIONS.find((s) => s.id === 'prayer_times')!,
  SECTIONS.find((s) => s.id === 'quran')!,
  SECTIONS.find((s) => s.id === 'qibla')!,
]

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
