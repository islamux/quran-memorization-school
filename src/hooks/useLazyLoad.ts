import { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

interface LazyLoadReturn {
  isVisible: boolean;
  targetRef: (node: Element | null) => void;
}

/**
 * Hook for lazy loading components with intersection observer
 */
export function useLazyLoad({
  root = null,
  rootMargin = '50px',
  threshold = 0,
  triggerOnce = true
}: LazyLoadOptions = {}): LazyLoadReturn {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        root,
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return { isVisible, targetRef: (node: Element | null) => (targetRef.current = node) };
}

/**
 * Hook for prefetching routes on hover
 */
export function usePrefetch() {
  const prefetchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const prefetchRoute = useCallback((href: string) => {
    // Clear existing timeout
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }

    // Prefetch after 200ms of hover
    prefetchTimeout.current = setTimeout(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = href;
          link.as = 'document';
          document.head.appendChild(link);
        });
      }
    }, 200);
  }, []);

  const cancelPrefetch = useCallback(() => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
  }, []);

  return { prefetchRoute, cancelPrefetch };
}

/**
 * Hook for detecting viewport
 */
export function useInViewport(options?: LazyLoadOptions) {
  const [isInViewport, setIsInViewport] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInViewport(entry.isIntersecting);
      },
      {
        root: options?.root,
        rootMargin: options?.rootMargin,
        threshold: options?.threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { ref, isInViewport };
}

/**
 * Hook for lazy loading images
 */
export function useLazyImage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(img);
        }
      },
      {
        rootMargin: '100px'
      }
    );

    observer.observe(img);

    return () => {
      observer.unobserve(img);
    };
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    imgRef,
    isLoaded,
    isInView,
    handleLoad
  };
}
