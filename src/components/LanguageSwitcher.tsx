'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {locales} from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">🌐</span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
