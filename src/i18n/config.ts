export const locales = ['ar', 'en', 'fr', 'ur', 'id'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

// Language names in their native scripts
export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  ur: 'اردو',
  id: 'Bahasa Indonesia'
};

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  // Arabic and Urdu are RTL languages
  return locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr';
}

export function isRTL(locale: Locale): boolean {
  return getDirection(locale) === 'rtl';
}
