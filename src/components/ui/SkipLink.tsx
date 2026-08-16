/**
 * Skip link component for accessibility
 * Allows users to skip to main content
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipLink({
  href = '#main-content',
  children,
  className = ''
}: SkipLinkProps) {
  const t = useTranslations();

  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute
        focus:top-4 focus:left-4
        focus:z-50 focus:px-4 focus:py-2
        focus:bg-green-600 focus:text-white
        focus:rounded-md focus:shadow-lg
        focus:outline-none focus:ring-2
        focus:ring-green-500 focus:ring-offset-2
        transition-all duration-200
        ${className}
      `}
    >
      {children || t('accessibility.skipToMainContent')}
    </a>
  );
}

// Auto-insert skip link that appears on focus
export function AutoSkipLink() {
  return (
    <SkipLink>
      {process.env.NODE_ENV === 'development' ? '⏭️ Skip to main content' : 'Skip to main content'}
    </SkipLink>
  );
}
