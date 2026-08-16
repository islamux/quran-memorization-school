import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from '@/i18n/config';

export const proxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|icon-.*|apple-touch-icon.*).*)']
};
