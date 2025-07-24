import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {Locale, locales, defaultLocale} from './config';

export default getRequestConfig(async ({locale}) => {
  // Default to the defaultLocale if locale is undefined
  const resolvedLocale = locale ?? defaultLocale;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(resolvedLocale as Locale)) notFound();

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});
