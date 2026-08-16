'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import { Home, Users, GraduationCap, CheckCircle, Calendar, BookOpen } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import PWAInstallPrompt from './PWAInstallPrompt';
import OfflineIndicator from './OfflineIndicator';
import { AutoSkipLink } from './ui/SkipLink';
import { isRTL, type Locale } from '@/i18n/config';
import { ARIA_LABELS, ARIA_ROLES } from '@/lib/accessibility';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const t = useTranslations('layout');
  const locale = useLocale() as Locale;
  const mainRef = useRef<HTMLElement>(null);

  const navigation = [
    { name: t('navigation.home'), href: `/${locale}`, icon: Home },
    { name: t('navigation.students'), href: `/${locale}/students`, icon: Users },
    { name: t('navigation.teachers'), href: `/${locale}/teachers`, icon: GraduationCap },
    { name: t('navigation.attendance'), href: `/${locale}/attendance`, icon: CheckCircle },
    { name: t('navigation.schedule'), href: `/${locale}/schedule`, icon: Calendar },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  // Add page title to document for screen readers
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = t('header.title');
    }
  }, [t]);

  // Apply RTL direction to body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Link for Accessibility */}
      <AutoSkipLink />

      {/* Header */}
      <header
        className="bg-white shadow-sm border-b"
        role={ARIA_ROLES.banner}
        aria-label={ARIA_LABELS.navigation.main}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-green-700 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  {t('header.title')}
                </h1>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 inline mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="flex items-center ml-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav
        className="md:hidden bg-white border-b"
        role={ARIA_ROLES.navigation}
        aria-label={ARIA_LABELS.navigation.main}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              <item.icon className="w-5 h-5 inline mr-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <OfflineIndicator />

      {/* Main Content */}
      <main
        ref={mainRef}
        id="main-content"
        className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
        role={ARIA_ROLES.main}
        aria-label={ARIA_LABELS.navigation.main}
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        className="bg-white border-t mt-auto"
        role={ARIA_ROLES.contentinfo}
      >
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Layout;

