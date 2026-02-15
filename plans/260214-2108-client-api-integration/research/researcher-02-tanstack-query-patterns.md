# TanStack Query Patterns for Client App

**Research Date**: 2026-02-14
**Researcher**: Agent-02
**Focus**: Admin patterns → Client app adaptation

---

## Query Client Configuration

### Admin vs Client Differences

**Admin** (`apps/admin/src/lib/queryClient.ts`):
- `staleTime: 30_000` (30s) - frequent changes
- `refetchOnWindowFocus: true` - admins switch tabs
- `gcTime: 5 * 60_000` (5min) - moderate cache
- `retry: 0` mutations - no duplicates

**Client** (`apps/client/src/lib/queryClient.ts`):
- `staleTime: 5 * 60_000` (5min) - data rarely changes
- `refetchOnWindowFocus: false` - less aggressive
- `gcTime: 10 * 60_000` (10min) - longer cache
- `retry: 1` mutations - retry booking submissions

### Optimal Client Settings

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,        // 5min - customer data stable
      gcTime: 10 * 60_000,           // 10min - longer retention
      refetchOnWindowFocus: false,   // Customer UX priority
      refetchOnMount: true,          // Fresh data on navigation
      refetchOnReconnect: true,      // Network recovery
      retry: 2,                      // Public network issues
      throwOnError: false,
    },
    mutations: {
      retry: 1,                      // Retry bookings/contacts once
    },
  },
});
```

---

## Hook Patterns from Admin

### Pattern 1: Basic Query Hook

**Admin** (`apps/admin/src/hooks/api/useServices.ts`):
```typescript
export function useServices(params: GetServicesParams = {}) {
  return useQuery({
    enabled: !!storage.get("auth_token", ""),  // Auth guard
    queryFn: () => servicesService.getAll(params),
    queryKey: queryKeys.services.list(params),
  });
}
```

**Client Adaptation** (read-only, no auth):
```typescript
export function useServices(params?: ServicesQueryParams) {
  return useQuery({
    queryFn: () => servicesService.getAll(params),
    queryKey: queryKeys.services.list(params),
    staleTime: 30_000,  // Override global for services
  });
}
```

**Key Changes**:
- Remove `enabled: !!storage.get("auth_token")` - no auth needed
- Shorter staleTime for services (shown on multiple pages)
- Same queryKey structure from `@repo/utils/api`

---

### Pattern 2: Infinite Query Hook

**Admin** (`apps/admin/src/hooks/api/useGallery.ts`):
```typescript
export function useInfiniteGalleryItems(
  params: Omit<GalleriesQueryParams, "page"> = {}
) {
  return useInfiniteQuery<
    PaginationResponse<GalleryItem>,
    Error,
    InfiniteData<PaginationResponse<GalleryItem>>,
    ReturnType<typeof queryKeys.gallery.list>,
    number
  >({
    enabled: !!storage.get("auth_token", ""),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      galleryService.getAll({ ...params, page: pageParam, limit: 20 }),
    queryKey: queryKeys.gallery.list(params),
    staleTime: 30_000,
  });
}
```

**Client Usage** (same pattern, remove auth):
- Remove `enabled` check
- Use same pagination logic
- Client may use different `limit` (e.g., 12 for grid layout)

**Recommendation**: Client should use infinite scroll for gallery page

---

### Pattern 3: Mutation with Cache Invalidation

**Admin** (`apps/admin/src/hooks/api/useServices.ts`):
```typescript
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => servicesService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      toast.success("Service created successfully");
    },
  });
}
```

**Client Adaptation** (booking/contact only):
```typescript
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      // No toast - use customer-friendly UI feedback
    },
  });
}
```

**Key Changes**:
- No toast notifications - client uses modal/inline feedback
- Only bookings/contacts have mutations (read-only for services/gallery)

---

### Pattern 4: Optimistic Updates

**Admin** (`apps/admin/src/hooks/api/useGallery.ts`):
```typescript
export function useToggleGalleryFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      galleryService.update(id, { featured }),

    onMutate: async ({ id, featured }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.gallery.all });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData<GalleryItem[]>(
        queryKeys.gallery.lists()
      );

      // Optimistically update cache
      if (previousItems) {
        queryClient.setQueryData<GalleryItem[]>(
          queryKeys.gallery.lists(),
          previousItems.map((item) =>
            item._id === id ? { ...item, featured } : item
          )
        );
      }

      return { previousItems };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          queryKeys.gallery.lists(),
          context.previousItems
        );
      }
      toast.error("Failed to update gallery item");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
```

**Client Adaptation**: NOT NEEDED
- Client doesn't update services/gallery (read-only)
- Could use for booking status check (future enhancement)

---

## Loading States

### Admin Approach

**Current**: No skeleton loaders in admin
- Uses conditional rendering: `{isLoading && <LoadingSpinner />}`
- Quick for admin users (less UX polish)

**Client Needs**: Skeleton loaders (better UX)

### Client Loading Pattern (Border-based Design)

```typescript
// Skeleton for service card
export function ServiceCardSkeleton() {
  return (
    <div className="border border-border rounded-md p-6 space-y-4">
      {/* Image skeleton */}
      <div className="h-48 bg-muted/50 rounded-md animate-pulse" />

      {/* Title skeleton */}
      <div className="h-6 bg-muted/50 rounded w-3/4 animate-pulse" />

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-muted/50 rounded animate-pulse" />
        <div className="h-4 bg-muted/50 rounded w-5/6 animate-pulse" />
      </div>

      {/* Price skeleton */}
      <div className="h-5 bg-muted/50 rounded w-1/4 animate-pulse" />
    </div>
  );
}

// Usage in services page
function ServicesPage() {
  const { data, isLoading } = useServices();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Render actual services...
}
```

**Design Constraints**:
- NO shadows (use borders)
- Soft neutral colors (`bg-muted/50`)
- Organic shapes (rounded corners)
- Smooth animations (`animate-pulse`)

---

## Error Handling

### Admin Error Pattern

**Global Handler** (`queryClient.ts`):
```typescript
onError: (error) => {
  if (ApiError.isApiError(error)) {
    if (error.statusCode === 401) {
      toast.error("Session expired. Please login again.");
      // Redirect to login
    }
    toast.error(error.getUserMessage());
  }
}
```

**Component Level**: None (handled globally)

### Client Error Pattern (Customer-Friendly)

**NO Toasts** - use inline errors:

```typescript
function ServicesPage() {
  const { data, isLoading, error } = useServices();

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <p className="text-lg text-foreground/80 mb-4">
          Oops! We couldn't load our services right now.
        </p>
        <p className="text-sm text-foreground/60 mb-6">
          Please check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-accent text-accent-foreground rounded-md"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Render services...
}
```

**Form Errors** (booking/contact):
```typescript
function BookingForm() {
  const { mutate, isPending, error } = useCreateBooking();

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}

      {error && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md">
          <p className="text-sm text-destructive">
            {ApiError.isApiError(error)
              ? error.getUserMessage()
              : "Failed to submit booking. Please try again."}
          </p>
        </div>
      )}

      <button disabled={isPending}>
        {isPending ? "Submitting..." : "Book Appointment"}
      </button>
    </form>
  );
}
```

---

## Performance Optimization

### 1. Prefetching Strategy

**Homepage** - prefetch services:
```typescript
function HomePage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch services for /services page
    queryClient.prefetchQuery({
      queryKey: queryKeys.services.list(),
      queryFn: () => servicesService.getAll(),
    });
  }, [queryClient]);

  // Render homepage...
}
```

**When to Prefetch**:
- Services on homepage → prefetch for /services
- Featured gallery on homepage → prefetch for /gallery
- DO NOT prefetch on mobile (bandwidth concerns)

### 2. Background Refetch

Admin uses `refetchOnWindowFocus: true` - client should use `false`:
- Customer experience priority (no flashing/reloading)
- Data changes infrequently (services/gallery updated by admin)
- Explicit refetch on navigation (mount)

### 3. Lazy Loading Images

**Gallery Page** - use intersection observer:
```typescript
function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
}
```

**Use `useDebounce`** from `@repo/utils` for search (already shared):
```typescript
import { useDebounce } from '@repo/utils/hooks';

function GalleryPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useGallery({ search: debouncedSearch });

  // Render...
}
```

---

## Client-Specific Strategies

### 1. SEO Considerations

**Issue**: TanStack Query fetches on mount (CSR) → poor SEO

**Solution Options**:
- **Current**: SSR not implemented (Vite SPA) → acceptable for salon
- **Future**: Add Vite SSR plugin for services/gallery pages
- **Workaround**: Static meta tags in `index.html` for main pages

**Recommendation**: Keep SPA for MVP, add SSR in Phase 2

### 2. Mobile Performance

**Query Config for Mobile**:
```typescript
// Detect mobile
const isMobile = window.innerWidth < 768;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: isMobile ? 10 * 60_000 : 5 * 60_000,  // Longer cache on mobile
      gcTime: isMobile ? 20 * 60_000 : 10 * 60_000,    // More aggressive cache
      retry: isMobile ? 3 : 2,                         // More retries (spotty network)
    },
  },
});
```

**Pagination for Mobile**:
- Gallery: Infinite scroll (better UX than pagination)
- Services: Show all (typically <20 items)

### 3. Image Optimization

**Cloudinary Transformations** (already in API):
```typescript
// Gallery service should request optimized images
function getOptimizedImageUrl(url: string, width: number): string {
  // Cloudinary auto-format, quality optimization
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

// Usage in gallery
<img
  src={getOptimizedImageUrl(item.imageUrl, 800)}
  srcSet={`
    ${getOptimizedImageUrl(item.imageUrl, 400)} 400w,
    ${getOptimizedImageUrl(item.imageUrl, 800)} 800w,
    ${getOptimizedImageUrl(item.imageUrl, 1200)} 1200w
  `}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## Code Examples

### 1. Services Hook (Client)

```typescript
// apps/client/src/hooks/api/useServices.ts
import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';
import { servicesService, type ServicesQueryParams } from '@/services/services.service';

export function useServices(params?: ServicesQueryParams) {
  return useQuery({
    queryFn: () => servicesService.getAll(params),
    queryKey: queryKeys.services.list(params),
    staleTime: 30_000,  // 30s - services shown on multiple pages
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => servicesService.getById(id!),
    queryKey: queryKeys.services.detail(id!),
  });
}
```

### 2. Gallery Hook with Infinite Scroll

```typescript
// apps/client/src/hooks/api/useGallery.ts
import { queryKeys } from '@repo/utils/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { galleryService, type GalleryQueryParams } from '@/services/gallery.service';

export function useInfiniteGallery(params: Omit<GalleryQueryParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      galleryService.getAll({ ...params, page: pageParam, limit: 12 }),
    queryKey: queryKeys.gallery.list(params),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60_000,  // 2min - gallery changes less frequently
  });
}
```

### 3. Booking Mutation

```typescript
// apps/client/src/hooks/api/useBookings.ts
import { queryKeys } from '@repo/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsService, type CreateBookingDto } from '@/services/bookings.service';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    onSuccess: () => {
      // Invalidate bookings cache (if user checks booking history)
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
```

### 4. Error Boundary Component

```typescript
// apps/client/src/components/shared/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-serif text-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-foreground/70 mb-6">
              We're sorry for the inconvenience. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-md"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Summary

### Admin → Client Pattern Differences

| Aspect | Admin | Client |
|--------|-------|--------|
| **Auth** | Required (`enabled` check) | None (public) |
| **Mutations** | All CRUD operations | Bookings/Contacts only |
| **Error UI** | Toast notifications | Inline errors |
| **Loading** | Basic spinner | Skeleton loaders |
| **Cache** | 30s stale, 5min gc | 5min stale, 10min gc |
| **Refetch** | On window focus | On mount only |
| **Optimistic** | Toggle featured/status | Not needed |

### Reusable from Admin

✅ Query key structure (`@repo/utils/api`)
✅ Service layer pattern
✅ Infinite scroll pagination logic
✅ Cache invalidation on mutations
✅ `useDebounce` hook (`@repo/utils`)

### Client-Specific Needs

🎨 Skeleton loaders (border-based, NO shadows)
📱 Mobile-optimized queries (longer cache, more retries)
🖼️ Lazy loading images (intersection observer)
🔍 Prefetching strategy (homepage → services/gallery)
💬 Customer-friendly error messages (no jargon)
🎯 SEO considerations (future SSR)

---

**Token Usage**: ~145 lines
**Status**: Research complete
**Next Step**: Implement client hooks following these patterns
