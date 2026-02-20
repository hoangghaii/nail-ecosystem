import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

interface InfiniteScrollTriggerProps {
  className?: string;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

/**
 * Infinite scroll trigger using Intersection Observer
 * Falls back to "Load More" button for accessibility
 */
export function InfiniteScrollTrigger({
  className,
  hasMore,
  isLoading,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "300px", threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div ref={observerTarget} className={className}>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="flex justify-center py-4">
          <Button variant="outline" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
