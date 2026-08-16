export const locales = ['ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export function getDirection(): 'rtl' {
  return 'rtl';
}

export function isRTL(): boolean {
  return true;
}
