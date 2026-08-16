/**
 * RTL (Right-to-Left) specific utilities and helpers
 */

import { createElement, type ComponentType } from 'react';
import { type Locale, isRTL } from '@/i18n/config';

// Class mappings for RTL-aware styling
export const rtlClasses = {
  // Margin classes
  margin: {
    start: (locale: Locale) => (isRTL(locale) ? 'mr-' : 'ml-'),
    end: (locale: Locale) => (isRTL(locale) ? 'ml-' : 'mr-'),
    startAuto: (locale: Locale) => (isRTL(locale) ? 'me-auto' : 'ms-auto'),
    endAuto: (locale: Locale) => (isRTL(locale) ? 'ms-auto' : 'me-auto')
  },

  // Padding classes
  padding: {
    start: (locale: Locale) => (isRTL(locale) ? 'pr-' : 'pl-'),
    end: (locale: Locale) => (isRTL(locale) ? 'pl-' : 'pr-')
  },

  // Text alignment
  text: {
    start: () => 'text-start',
    end: () => 'text-end'
  },

  // Float
  float: {
    start: (locale: Locale) => (isRTL(locale) ? 'float-right' : 'float-left'),
    end: (locale: Locale) => (isRTL(locale) ? 'float-left' : 'float-right')
  },

  // Border radius
  border: {
    start: (locale: Locale) => (isRTL(locale) ? 'rounded-tr rounded-br' : 'rounded-tl rounded-bl'),
    end: (locale: Locale) => (isRTL(locale) ? 'rounded-tl rounded-bl' : 'rounded-tr rounded-br')
  },

  // Position
  position: {
    start: (locale: Locale) => (isRTL(locale) ? 'right-0' : 'left-0'),
    end: (locale: Locale) => (isRTL(locale) ? 'left-0' : 'right-0')
  }
};

// Helper function to get directional class
export function getDirClass<T extends string>(
  locale: Locale,
  ltrClass: T,
  rtlClass: T
): T {
  return isRTL(locale) ? rtlClass : ltrClass;
}

// Flex direction utilities
export const flex = {
  row: (locale: Locale) => (isRTL(locale) ? 'flex-row-reverse' : 'flex-row'),
  rowReverse: (locale: Locale) => (isRTL(locale) ? 'flex-row' : 'flex-row-reverse')
};

// Transform utilities
export const transform = {
  mirror: (locale: Locale) => (isRTL(locale) ? 'scale-x-[-1]' : ''),
  mirrorX: (locale: Locale, scale: string) =>
    isRTL(locale) ? `scale-x-[-${scale}]` : ''
};

// Icon direction utilities
export const icon = {
  /**
   * Get icon class based on direction
   * Some icons need to be mirrored in RTL
   */
  direction: (locale: Locale) => (isRTL(locale) ? 'transform scale-x-[-1]' : ''),

  /**
   * Chevron icons (indicate direction)
   */
  chevron: {
    right: (locale: Locale) => (isRTL(locale) ? 'rotate-180' : ''),
    left: (locale: Locale) => (isRTL(locale) ? '' : 'rotate-180')
  },

  /**
   * Arrow icons
   */
  arrow: {
    right: (locale: Locale) => (isRTL(locale) ? 'rotate-180' : ''),
    left: (locale: Locale) => (isRTL(locale) ? '' : 'rotate-180')
  }
};

// Table utilities for RTL
export const table = {
  /**
   * Get text alignment for table cells
   */
  cellAlign: (locale: Locale) => (isRTL(locale) ? 'text-right' : 'text-left'),

  /**
   * Get header alignment
   */
  headerAlign: (locale: Locale) => (isRTL(locale) ? 'text-right' : 'text-left'),

  /**
   * Sort icon position
   */
  sortIcon: (locale: Locale) =>
    isRTL(locale) ? 'ml-2 order-first' : 'mr-2 order-last'
};

// Form utilities for RTL
export const form = {
  /**
   * Get input group classes
   */
  inputGroup: (locale: Locale) =>
    isRTL(locale) ? 'flex-row-reverse' : 'flex-row',

  /**
   * Get input addon position
   */
  addonPosition: (locale: Locale) =>
    isRTL(locale) ? 'rounded-r-none rounded-l-md' : 'rounded-l-none rounded-r-md',

  /**
   * Get button group classes
   */
  buttonGroup: (locale: Locale) =>
    isRTL(locale) ? 'flex-row-reverse' : 'flex-row',

  /**
   * First button in group
   */
  buttonFirst: (locale: Locale) =>
    isRTL(locale) ? 'rounded-r-none rounded-l-md' : 'rounded-l-none rounded-r-md',

  /**
   * Last button in group
   */
  buttonLast: (locale: Locale) =>
    isRTL(locale) ? 'rounded-l-none rounded-r-md' : 'rounded-r-none rounded-l-md',

  /**
   * Middle buttons in group
   */
  buttonMiddle: (_locale: Locale) => 'rounded-none',

  /**
   * Get label alignment
   */
  labelAlign: (locale: Locale) => (isRTL(locale) ? 'text-right' : 'text-left'),

  /**
   * Get checkbox/radio alignment
   */
  checkboxAlign: (locale: Locale) => (isRTL(locale) ? 'mr-2' : 'ml-2')
};

// Navigation utilities for RTL
export const navigation = {
  /**
   * Get breadcrumb separator
   */
  breadcrumbSeparator: (locale: Locale) =>
    isRTL(locale) ? 'rotate-180' : '',

  /**
   * Get dropdown menu alignment
   */
  dropdownAlign: (locale: Locale) =>
    isRTL(locale) ? 'right-0' : 'left-0',

  /**
   * Get pagination alignment
   */
  paginationAlign: (locale: Locale) =>
    isRTL(locale) ? 'flex-row-reverse' : 'flex-row'
};

// Card utilities for RTL
export const card = {
  /**
   * Get card image position
   */
  imagePosition: (locale: Locale) =>
    isRTL(locale) ? 'mr-4' : 'ml-4',

  /**
   * Get card header alignment
   */
  headerAlign: (locale: Locale) => (isRTL(locale) ? 'text-right' : 'text-left'),

  /**
   * Get badge position
   */
  badgePosition: (locale: Locale) =>
    isRTL(locale) ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
};

// Layout utilities for RTL
export const layout = {
  /**
   * Get sidebar position
   */
  sidebar: (locale: Locale) => (isRTL(locale) ? 'right-0' : 'left-0'),

  /**
   * Get main content margin
   */
  mainMargin: (locale: Locale) => (isRTL(locale) ? 'mr-64' : 'ml-64'),

  /**
   * Get header height class
   */
  headerHeight: () => 'h-16',

  /**
   * Get footer alignment
   */
  footerAlign: (locale: Locale) => (isRTL(locale) ? 'text-right' : 'text-left')
};

// Animation utilities for RTL
export const animation = {
  /**
   * Slide in direction
   */
  slideIn: (locale: Locale) =>
    isRTL(locale) ? 'animate-slide-in-right' : 'animate-slide-in-left',

  /**
   * Slide out direction
   */
  slideOut: (locale: Locale) =>
    isRTL(locale) ? 'animate-slide-out-right' : 'animate-slide-out-left'
};

// List utilities for RTL
export const list = {
  /**
   * Get list item marker position
   */
  markerPosition: (locale: Locale) => (isRTL(locale) ? 'mr-3' : 'ml-3'),

  /**
   * Get ordered list counter alignment
   */
  counterAlign: (locale: Locale) => (isRTL(locale) ? 'mr-3' : 'ml-3')
};

// Utility for consistent spacing in RTL
export function getMargin(
  locale: Locale,
  property: 'start' | 'end',
  value: string
): string {
  const prefix = rtlClasses.margin[property](locale);
  return `${prefix}${value}`;
}

// Utility for consistent padding in RTL
export function getPadding(
  locale: Locale,
  property: 'start' | 'end',
  value: string
): string {
  const prefix = rtlClasses.padding[property](locale);
  return `${prefix}${value}`;
}

// Check if element should be mirrored in RTL
export function shouldMirror(element: 'icon' | 'chevron' | 'arrow', locale: Locale): boolean {
  if (!isRTL(locale)) return false;
  return ['icon', 'chevron', 'arrow'].includes(element);
}

// Get mirrored transform
export function getMirroredTransform(locale: Locale): string {
  return isRTL(locale) ? 'scale-x-[-1]' : '';
}

// Component decorator for RTL support
export function withRTL<P extends object>(
  Component: ComponentType<P>
) {
  return function RTLComponent(props: P & { locale: Locale }) {
    const { locale, ...rest } = props;
    return createElement(Component, {
      ...(rest as P),
      'data-locale': locale,
      'data-rtl': isRTL(locale)
    });
  };
}

// Hook for RTL-aware styling
export function useRTL(locale: Locale) {
  return {
    isRTL: isRTL(locale),
    dir: isRTL(locale) ? 'rtl' : 'ltr',
    classes: rtlClasses,
    flex: flex.row(locale),
    icon: {
      direction: icon.direction(locale),
      chevron: icon.chevron.right(locale),
      arrow: icon.arrow.right(locale)
    },
    table: {
      cellAlign: table.cellAlign(locale),
      headerAlign: table.headerAlign(locale),
      sortIcon: table.sortIcon(locale)
    },
    form: {
      inputGroup: form.inputGroup(locale),
      labelAlign: form.labelAlign(locale),
      checkboxAlign: form.checkboxAlign(locale)
    }
  };
}

const rtlUtils = {
  rtlClasses,
  getDirClass,
  flex,
  transform,
  icon,
  table,
  form,
  navigation,
  card,
  layout,
  animation,
  list,
  withRTL,
  useRTL
};

export default rtlUtils;
