import type { Metadata, Viewport } from 'next';
import { Inter, Cairo } from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {getDirection, Locale, locales} from '@/i18n/config';
import {getMessages} from '@/i18n/loadMessages';
import '../globals.css';
import Layout from '@/components/Layout';
import { DataProvider } from '@/contexts/DexieDataContext';

interface Props {
  children: ReactNode;
  params: Promise<{locale: string}>;
}

const inter = Inter({ subsets: ['latin'] });
const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo'
});

export const metadata: Metadata = {
  title: 'Quran Memorization School',
  description: 'A simple and clean management system for Quran memorization schools',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Quran School',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#059669',
};

export async function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function RootLayout({children, params}: Props) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  const messages = getMessages(locale as Locale);

  return (
    <html lang={locale} dir={getDirection(locale as Locale)}>
      <body className={`${locale === 'ar' ? cairo.className : inter.className}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DataProvider>
            <Layout>
              {children}
            </Layout>
          </DataProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

