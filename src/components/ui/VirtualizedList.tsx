/**
 * Virtualized list component for efficient rendering of large lists
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { ListSkeleton } from './LoadingSkeleton';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  overscan?: number; // Number of items to render outside viewport
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
  loadMore?: () => void; // Callback for infinite scroll
  hasMore?: boolean; // Whether there are more items to load
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  overscan = 5,
  renderItem,
  className = '',
  loading = false,
  loadMore,
  hasMore = false
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Measure container height
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);

    // Infinite scroll
    if (loadMore && hasMore && !loading) {
      const threshold = 0.8; // Load more when 80% scrolled
      const scrollPercentage = newScrollTop / (items.length * itemHeight);

      if (scrollPercentage > threshold) {
        loadMore();
      }
    }
  };

  // Render visible items
  const visibleItems = [];
  for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
    const item = items[i];
    if (item) {
      visibleItems.push(
        <div
          key={i}
          style={{ height: itemHeight }}
          className="flex-shrink-0"
        >
          {renderItem(item, i)}
        </div>
      );
    }
  }

  // Total height for spacer
  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      onScroll={handleScroll}
      style={{ height: '100%' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleRange.startIndex * itemHeight}px)`,
          }}
        >
          {visibleItems}
        </div>
      </div>
      {loading && (
        <div className="p-4">
          <ListSkeleton count={3} height={itemHeight} />
        </div>
      )}
    </div>
  );
}

// Hook for infinite scrolling
export function useInfiniteScroll<T>(
  fetchMore: () => Promise<T[]>,
  hasMoreProp?: boolean
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(hasMoreProp ?? true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await fetchMore();
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more items'));
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setItems([]);
    setHasMore(true);
    setError(null);
    await loadMore();
  };

  return { items, loading, hasMore, error, loadMore, refresh, setItems };
}

// Virtualized grid component
interface VirtualizedGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  gap?: number;
  columns?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function VirtualizedGrid<T>({
  items,
  itemWidth,
  itemHeight,
  gap = 16,
  columns,
  renderItem,
  className = '',
  loading = false
}: VirtualizedGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  // Calculate columns
  const gridColumns = columns || Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowHeight = itemHeight + gap;

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
    const endRow = Math.min(
      Math.ceil(items.length / gridColumns) - 1,
      Math.ceil((scrollTop + containerHeight) / rowHeight) + 2
    );

    const startIndex = startRow * gridColumns;
    const endIndex = Math.min(items.length - 1, (endRow + 1) * gridColumns);

    return { startIndex, endIndex, startRow, endRow };
  }, [scrollTop, containerHeight, rowHeight, gridColumns, items.length]);

  // Render visible items
  const visibleItems = [];
  for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
    const item = items[i];
    if (item) {
      const row = Math.floor(i / gridColumns);
      const col = i % gridColumns;

      visibleItems.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: row * rowHeight,
            left: col * (itemWidth + gap),
            width: itemWidth,
            height: itemHeight
          }}
          className="flex-shrink-0"
        >
          {renderItem(item, i)}
        </div>
      );
    }
  }

  const totalRows = Math.ceil(items.length / gridColumns);
  const totalHeight = totalRows * rowHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ height: '100%' }}
    >
      <div style={{ height: totalHeight }}>
        {visibleItems}
      </div>
      {loading && (
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg" style={{ height: itemHeight }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
