# Task 2: Create InfiniteScrollTrigger Component

**Phase**: 1 - Foundation
**Complexity**: Low
**Files**: 1 new component
**Dependencies**: None

---

## Objectives

Build reusable Intersection Observer component for infinite scroll with accessible "Load More" fallback.

---

## Implementation

**File**: `apps/admin/src/components/layout/shared/infinite-scroll-trigger.tsx` (NEW)

```typescript
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  className?: string;
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
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
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
```

---

## Features

- **Auto-load**: Intersection Observer triggers when 10% visible
- **Fallback**: "Load More" button (accessible, no-JS support)
- **Loading**: Spinner during fetch
- **Cleanup**: Observer cleanup on unmount
- **Hide**: Component hidden when no more items

---

## Testing

Manual tests:
- [ ] Scroll into view triggers onLoadMore
- [ ] "Load More" button works
- [ ] Loading spinner appears during isLoading
- [ ] Component disappears when hasMore=false
- [ ] No console errors (observer cleanup)

---

## Success Criteria

✅ Component functional
✅ <100 LOC
✅ TypeScript strict mode
✅ Accessible (button fallback)
