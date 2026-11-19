export type Theme = 'light' | 'dark' | 'system'
export type Language = 'ar' | 'fr' | 'en'

export const STORAGE_KEYS = {
  theme: 'theme',
  language: 'language',
} as const

export const COOKIE_KEYS = {
  theme: 'myislam-theme',
  language: 'myislam-language',
} as const

export function isTheme(value: string | null | undefined): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function isLanguage(value: string | null | undefined): value is Language {
  return value === 'ar' || value === 'fr' || value === 'en'
}

export function parseTheme(value: string | null | undefined): Theme {
  return isTheme(value) ? value : 'system'
}

export function parseLanguage(value: string | null | undefined): Language {
  return isLanguage(value) ? value : 'en'
}

export function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

export function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`
}

export function hasCookie(name: string): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie
    .split(';')
    .some((entry) => entry.trim().startsWith(`${name}=`))
}

/**
 * Applies the persisted theme before first paint. Preferences live in cookies
 * so the server renders the right theme/language. Legacy localStorage values
 * are migrated once with a single reload — never during hydration.
 */
export function bootScript(theme: Theme): string {
  return `(function(){try{
var r=document.documentElement;
function readCookie(name){var m=document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]+)'));return m?decodeURIComponent(m[1]):null;}
function validTheme(v){return v==='light'||v==='dark'||v==='system';}
function validLang(v){return v==='ar'||v==='fr'||v==='en';}
function writeCookie(name,value){document.cookie=name+'='+encodeURIComponent(value)+'; path=/; max-age=31536000; samesite=lax';}
var themeCookie=readCookie('${COOKIE_KEYS.theme}');
var langCookie=readCookie('${COOKIE_KEYS.language}');
var legacyTheme=null,legacyLang=null;
try{legacyTheme=localStorage.getItem('${STORAGE_KEYS.theme}');legacyLang=localStorage.getItem('${STORAGE_KEYS.language}');}catch(e){}
var migrated=false;
if(!themeCookie&&validTheme(legacyTheme)){writeCookie('${COOKIE_KEYS.theme}',legacyTheme);themeCookie=legacyTheme;migrated=true;}
if(!langCookie&&validLang(legacyLang)){writeCookie('${COOKIE_KEYS.language}',legacyLang);langCookie=legacyLang;migrated=true;}
var t=themeCookie||'${theme}';
var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
if(t==='dark'||(t==='system'&&dark)){r.classList.add('dark');}else{r.classList.remove('dark');}
if(migrated&&!sessionStorage.getItem('myislam-migrated')){sessionStorage.setItem('myislam-migrated','1');window.location.replace(window.location.href);}
}catch(e){document.documentElement.dataset.bootError='1';}})();`
}
