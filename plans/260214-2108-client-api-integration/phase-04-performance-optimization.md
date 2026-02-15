# Phase 4: Performance Optimization

**Phase**: 4/5
**Date**: 2026-02-14
**Duration**: 0.5 day
**Priority**: P2 (Enhancement)
**Status**: 🟡 Pending

---

## Context

**Dependencies**: Phase 3 complete (booking integration)
**Blocked By**: Phase 3
**Blocks**: Phase 5 (need optimized app before final testing)

**Problem**: No prefetching, no lazy loading, cache settings not optimized for client use case. Slow initial loads, unnecessary re-fetches.

---

## Overview

Optimize client app performance through prefetching, lazy loading, cache tuning, and mobile-specific optimizations. Focus on perceived performance (UX) over raw metrics.

**Goals**:
- Fast initial page loads (<2s)
- Smooth navigation (prefetch next pages)
- Lazy load gallery images
- Optimize cache settings for customer use
- Mobile-specific optimizations

---

## Key Insights from Research

**From researcher-02**:
- Prefetch services on homepage → /services page
- Prefetch featured gallery on homepage → /gallery page
- NO prefetch on mobile (bandwidth concerns)
- Lazy load images with intersection observer
- Client cache: 5min stale, 10min gc (longer than admin)
- Mobile: longer cache, more retries (spotty networks)

**Performance Targets**:
- Homepage: <2s initial load
- Services page: <1s navigation (prefetched)
- Gallery page: <1s navigation (prefetched)
- Images: Progressive loading (lazy)

---

## Requirements

### Functional Requirements

**FR-4.1**: Services prefetched on homepage load
**FR-4.2**: Featured gallery prefetched on homepage load
**FR-4.3**: Gallery images lazy load on scroll
**FR-4.4**: No prefetch on mobile (bandwidth save)
**FR-4.5**: Cache invalidation on navigation

### Non-Functional Requirements

**NFR-4.1**: Homepage initial load <2s (3G network)
**NFR-4.2**: Services page navigation <1s (prefetched)
**NFR-4.3**: Gallery images load progressively (no jank)
**NFR-4.4**: Mobile cache longer than desktop (10min vs 5min stale)
**NFR-4.5**: No unnecessary re-fetches on tab switch

---

## Architecture

### Prefetching Strategy

**Homepage prefetching**:
```
HomePage mounts → useEffect
  ↓
Detect desktop (width > 768px)
  ↓
Prefetch services: queryClient.prefetchQuery(servicesKey)
  ↓
Prefetch gallery: queryClient.prefetchQuery(galleryKey)
  ↓
User navigates to /services → instant load (cache hit)
```

### Lazy Loading Strategy

**Gallery image loading**:
```
GalleryItem renders → IntersectionObserver
  ↓
Image not visible → placeholder shown
  ↓
Image enters viewport → load actual image
  ↓
Image loaded → fade in transition
```

### Cache Strategy

**Desktop**:
- staleTime: 5min (services/gallery data stable)
- gcTime: 10min (keep in memory)
- refetchOnWindowFocus: false (no flashing)

**Mobile**:
- staleTime: 10min (longer cache for bandwidth)
- gcTime: 20min (more aggressive caching)
- retry: 3 (spotty networks)

---

## Related Code Files

### Files to Create

**New Components**:
- `/apps/client/src/components/shared/LazyImage.tsx` - **CREATE** lazy loading image

### Files to Modify

**Prefetching**:
- `/apps/client/src/pages/HomePage.tsx` - Add prefetch logic
- `/apps/client/src/lib/queryClient.ts` - Optimize cache config

**Lazy Loading**:
- `/apps/client/src/components/gallery/GalleryItem.tsx` - Use LazyImage
- `/apps/client/src/components/home/FeaturedGallery.tsx` - Use LazyImage

### Files to Reference

**Patterns**:
- `/apps/admin/src/hooks/api/useGallery.ts` - Infinite query pattern
- Research report 2 - TanStack Query optimization patterns

---

## Implementation Steps

### Step 1: Optimize Query Client Config (20 mins)

**File**: `/apps/client/src/lib/queryClient.ts`

Update configuration:
```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: isMobile ? 10 * 60_000 : 5 * 60_000, // 10min mobile, 5min desktop
      gcTime: isMobile ? 20 * 60_000 : 10 * 60_000,   // 20min mobile, 10min desktop
      refetchOnWindowFocus: false,                     // No flashing on tab switch
      refetchOnMount: true,                            // Fresh data on navigation
      refetchOnReconnect: true,                        // Refresh after offline
      retry: isMobile ? 3 : 2,                         // More retries on mobile
      throwOnError: false,
    },
    mutations: {
      retry: 1, // Retry bookings/contacts once
    },
  },
});
```

### Step 2: Add Prefetching to HomePage (30 mins)

**File**: `/apps/client/src/pages/HomePage.tsx`

Implementation:
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@repo/utils/api';
import { servicesService } from '@/services/services.service';
import { galleryService } from '@/services/gallery.service';

export function HomePage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only prefetch on desktop (save mobile bandwidth)
    if (window.innerWidth >= 768) {
      // Prefetch services for /services page
      queryClient.prefetchQuery({
        queryKey: queryKeys.services.list(),
        queryFn: () => servicesService.getAll({ isActive: true }),
      });

      // Prefetch gallery for /gallery page
      queryClient.prefetchQuery({
        queryKey: queryKeys.gallery.list(),
        queryFn: () => galleryService.getAll({ isActive: true, limit: 12 }),
      });
    }
  }, [queryClient]);

  // ... rest of component
}
```

### Step 3: Create LazyImage Component (45 mins)

**File**: `/apps/client/src/components/shared/LazyImage.tsx` (NEW)

Features:
- IntersectionObserver API
- Placeholder while loading
- Fade-in transition when loaded
- Error fallback
- TypeScript props

Implementation:
```typescript
import { useState, useEffect, useRef } from 'react';
import { cn } from '@repo/utils/cn';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}

export function LazyImage({ src, alt, className, placeholderClassName }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' } // Start loading 50px before entering viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-muted/50 animate-pulse',
            placeholderClassName
          )}
        />
      )}

      {/* Actual image (only load when in view) */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  );
}
```

### Step 4: Integrate LazyImage in GalleryPage (15 mins)

**File**: `/apps/client/src/components/gallery/GalleryItem.tsx`

Replace standard `<img>` with `<LazyImage>`:
```tsx
import { LazyImage } from '@/components/shared/LazyImage';

export function GalleryItem({ item }: GalleryItemProps) {
  return (
    <div className="...">
      <LazyImage
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover"
        placeholderClassName="rounded-md"
      />
      {/* ... rest of component */}
    </div>
  );
}
```

### Step 5: Integrate LazyImage in FeaturedGallery (10 mins)

**File**: `/apps/client/src/components/home/FeaturedGallery.tsx`

Replace standard `<img>` with `<LazyImage>` (same as GalleryPage).

### Step 6: Add Cloudinary Image Optimization (20 mins)

**File**: `/apps/client/src/lib/image-utils.ts` (NEW)

Create utility for Cloudinary transformations:
```typescript
export function getOptimizedImageUrl(url: string, width: number): string {
  // Cloudinary auto-format, quality optimization
  if (!url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

export function getResponsiveImageProps(url: string) {
  return {
    src: getOptimizedImageUrl(url, 800),
    srcSet: `
      ${getOptimizedImageUrl(url, 400)} 400w,
      ${getOptimizedImageUrl(url, 800)} 800w,
      ${getOptimizedImageUrl(url, 1200)} 1200w
    `,
    sizes: '(max-width: 768px) 100vw, 50vw',
  };
}
```

Use in LazyImage:
```tsx
import { getResponsiveImageProps } from '@/lib/image-utils';

<LazyImage
  {...getResponsiveImageProps(item.imageUrl)}
  alt={item.title}
/>
```

### Step 7: Optimize Services Caching (15 mins)

**File**: `/apps/client/src/hooks/api/useServices.ts`

Override staleTime for services (shown on multiple pages):
```typescript
export function useServices(params?: ServicesQueryParams) {
  return useQuery({
    queryFn: () => servicesService.getAll(params),
    queryKey: queryKeys.services.list(params),
    staleTime: 30_000, // 30s - services shown on homepage + services page
  });
}
```

### Step 8: Add useDebounce for Future Search (10 mins)

**File**: Verify `@repo/utils/hooks` has useDebounce (already exists)

Document usage for future search features:
```typescript
import { useDebounce } from '@repo/utils/hooks';

function GalleryPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useGallery({ search: debouncedSearch });
  // ... render
}
```

---

## Todo Checklist

### Query Client Config
- [ ] Update staleTime (mobile vs desktop)
- [ ] Update gcTime (mobile vs desktop)
- [ ] Set refetchOnWindowFocus: false
- [ ] Set retry count (mobile vs desktop)
- [ ] Test config on mobile device

### Prefetching
- [ ] Add prefetch logic to HomePage
- [ ] Prefetch services on desktop only
- [ ] Prefetch gallery on desktop only
- [ ] Test services page navigation (should be instant)
- [ ] Test gallery page navigation (should be instant)
- [ ] Verify no prefetch on mobile

### Lazy Loading
- [ ] Create LazyImage component
- [ ] Implement IntersectionObserver
- [ ] Add placeholder state
- [ ] Add fade-in transition
- [ ] Test component in isolation
- [ ] Integrate in GalleryItem
- [ ] Integrate in FeaturedGallery
- [ ] Test lazy loading on scroll

### Image Optimization
- [ ] Create image-utils.ts
- [ ] Implement getOptimizedImageUrl
- [ ] Implement getResponsiveImageProps
- [ ] Integrate Cloudinary transformations
- [ ] Test responsive images
- [ ] Verify auto-format works

### Cache Optimization
- [ ] Override staleTime for services
- [ ] Verify cache hit on navigation
- [ ] Test refetch behavior

### Testing
- [ ] Test homepage load time (<2s)
- [ ] Test services page navigation (<1s)
- [ ] Test gallery page navigation (<1s)
- [ ] Test lazy loading (scroll)
- [ ] Test mobile cache settings
- [ ] Test offline/reconnect behavior
- [ ] Monitor network tab (DevTools)
- [ ] Test on 3G throttling

---

## Success Criteria

**Performance**:
- ✅ Homepage initial load <2s (3G)
- ✅ Services page navigation <1s (prefetched)
- ✅ Gallery page navigation <1s (prefetched)
- ✅ Images load progressively (no jank)

**Caching**:
- ✅ Services cached 30s (multiple pages)
- ✅ Gallery cached 5min desktop, 10min mobile
- ✅ No refetch on tab switch (refetchOnWindowFocus: false)
- ✅ Prefetch only on desktop (mobile bandwidth saved)

**User Experience**:
- ✅ Smooth navigation (no loading delays)
- ✅ Images fade in (no pop-in)
- ✅ Mobile performance optimized
- ✅ Offline recovery works (refetchOnReconnect)

---

## Risk Assessment

**Low Risk**:
- Query client config (safe defaults)
- LazyImage component (well-tested pattern)

**Medium Risk**:
- Prefetching on low bandwidth (desktop assumption)
- IntersectionObserver browser support (polyfill?)

**Mitigation**:
- Test prefetch on slow networks
- Verify IntersectionObserver support (95%+ browsers)
- Fallback to regular loading if observer fails

---

## Security Considerations

**Low Impact**: Performance optimizations don't affect security

**Cloudinary**:
- Use public URLs (already implemented)
- No signed URLs needed for public gallery

---

## Next Steps

**After Phase 4**:
1. Move to Phase 5: Testing & Polish
2. Manual testing all pages
3. Remove mock data files
4. Verify mobile responsiveness
5. Document API integration patterns
