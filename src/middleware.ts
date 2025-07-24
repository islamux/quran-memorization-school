import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from '@/i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Always use a locale prefix in the URL (e.g., /en/about)
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] 
};
