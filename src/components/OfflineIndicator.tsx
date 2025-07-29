'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const t = useTranslations('common');

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      };

      const handleOffline = () => {
        setIsOnline(false);
        setShowMessage(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!showMessage) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      <div className="flex items-center">
        <span className="text-xl mr-2">
          {isOnline ? '✅' : '⚠️'}
        </span>
        <span>
          {isOnline
            ? t('status.online')
            : t('status.offline')}
        </span>
      </div>
    </div>
  );
}
