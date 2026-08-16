/**
 * Accessibility utilities and helpers
 */

// ARIA label constants
export const ARIA_LABELS = {
  navigation: {
    main: 'Main navigation',
    skipToContent: 'Skip to main content',
    language: 'Language selector',
    menu: 'Menu toggle'
  },
  forms: {
    required: 'Required field',
    optional: 'Optional field',
    invalid: 'Invalid input',
    error: 'Error',
    success: 'Success'
  },
  content: {
    loading: 'Loading content',
    empty: 'No content available',
    updated: 'Content updated',
    status: 'Status'
  },
  interactive: {
    close: 'Close',
    open: 'Open',
    expand: 'Expand',
    collapse: 'Collapse',
    menu: 'Menu',
    dropdown: 'Dropdown'
  }
} as const;

// ARIA role constants
export const ARIA_ROLES = {
  navigation: 'navigation',
  main: 'main',
  complementary: 'complementary',
  banner: 'banner',
  contentinfo: 'contentinfo',
  search: 'search',
  form: 'form',
  button: 'button',
  link: 'link',
  list: 'list',
  listitem: 'listitem',
  region: 'region',
  status: 'status',
  alert: 'alert',
  dialog: 'dialog',
  tab: 'tab',
  tabpanel: 'tabpanel',
  menu: 'menu',
  menubar: 'menubar',
  menuitem: 'menuitem',
  tree: 'tree',
  treeitem: 'treeitem',
  grid: 'grid',
  gridcell: 'gridcell',
  table: 'table',
  row: 'row',
  columnheader: 'columnheader',
  rowheader: 'rowheader'
} as const;

// Focus management utilities
export const focusUtils = {
  /**
   * Set focus to an element
   */
  setFocus(element: HTMLElement | null, options?: FocusOptions) {
    if (element) {
      element.focus(options);
    }
  },

  /**
   * Trap focus within a container (useful for modals)
   */
  trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Get all focusable elements in a container
   */
  getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }
};

// Color contrast utilities
export const colorUtils = {
  /**
   * Check if color contrast meets WCAG AA standards
   */
  checkContrast(_foreground: string, _background: string): boolean {
    // Simplified check - in production, use a library like chroma.js
    // This is a placeholder implementation
    return true;
  },

  /**
   * Get contrast ratio
   */
  getContrastRatio(_foreground: string, _background: string): number {
    // Placeholder - implement proper contrast calculation
    return 4.5; // Default to AA compliant
  }
};

// Screen reader utilities
export const srUtils = {
  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Create a visually hidden element for screen readers
   */
  createVisuallyHidden(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'sr-only';
    return element;
  }
};

// Keyboard navigation utilities
export const keyboardUtils = {
  /**
   * Handle keyboard events for common interactions
   */
  handleKeyDown(e: KeyboardEvent, handlers: Partial<Record<string, () => void>>) {
    const handler = handlers[e.key];
    if (handler) {
      handler();
      e.preventDefault();
    }
  },

  /**
   * Arrow key navigation for lists/grids
   */
  handleArrowKeys(
    e: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) {
    let newIndex = currentIndex;

    if (orientation === 'vertical') {
      if (e.key === 'ArrowDown') {
        newIndex = Math.min(currentIndex + 1, items.length - 1);
      } else if (e.key === 'ArrowUp') {
        newIndex = Math.max(currentIndex - 1, 0);
      }
    } else {
      if (e.key === 'ArrowRight') {
        newIndex = Math.min(currentIndex + 1, items.length - 1);
      } else if (e.key === 'ArrowLeft') {
        newIndex = Math.max(currentIndex - 1, 0);
      }
    }

    if (newIndex !== currentIndex) {
      items[newIndex]?.focus();
      e.preventDefault();
    }
  }
};

// Skip link component data
export const skipLink = {
  text: 'Skip to main content',
  href: '#main-content',
  id: 'skip-link'
};

// ARIA state helpers
export const ariaStates = {
  /**
   * Set expanded state
   */
  setExpanded(element: HTMLElement, expanded: boolean) {
    element.setAttribute('aria-expanded', expanded.toString());
  },

  /**
   * Set pressed state
   */
  setPressed(element: HTMLElement, pressed: boolean) {
    element.setAttribute('aria-pressed', pressed.toString());
  },

  /**
   * Set selected state
   */
  setSelected(element: HTMLElement, selected: boolean) {
    element.setAttribute('aria-selected', selected.toString());
  },

  /**
   * Set current state
   */
  setCurrent(element: HTMLElement, current: boolean) {
    element.setAttribute('aria-current', current.toString());
  },

  /**
   * Set busy state
   */
  setBusy(element: HTMLElement, busy: boolean) {
    element.setAttribute('aria-busy', busy.toString());
  }
};

// ID generator for unique ARIA relationships
let idCounter = 0;
export const generateId = (prefix: string = 'id'): string => {
  idCounter++;
  return `${prefix}-${idCounter}`;
};

// Error boundary for accessibility
export const accessibilityErrorHandler = {
  /**
   * Handle accessibility errors
   */
  handle(error: Error) {
    console.error('Accessibility Error:', error);
    srUtils.announce('An accessibility error occurred', 'assertive');
  }
};

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check for high contrast preference
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Accessibility audit checklist
export const AUDIT_CHECKLIST = {
  // Structure
  hasHeadingHierarchy: false,
  hasLandmarkRegions: false,
  hasSkipLinks: false,

  // Navigation
  hasKeyboardNavigation: false,
  hasVisibleFocus: false,
  hasLogicalTabOrder: false,

  // Forms
  hasLabels: false,
  hasErrorMessages: false,
  hasRequiredIndicators: false,

  // Content
  hasAltText: false,
  hasSufficientContrast: false,
  hasScalableText: false,

  // Interactions
  hasPointerGestures: false,
  hasTargetSize: false,
  hasMotionPreferences: false
} as const;
