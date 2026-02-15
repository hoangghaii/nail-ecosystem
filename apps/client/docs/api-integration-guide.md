# Client API Integration Guide

This guide documents the patterns and practices used for API integration in the Pink Nail Salon client app.

---

## Architecture Overview

**Stack**:
- **Data Fetching**: TanStack Query v5 (React Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **State Management**: TanStack Query cache + Zustand (minimal)

**Flow**:
```
Component → Custom Hook → Service → API Client → Backend
```

---

## Service Layer Pattern

### File Structure

```
src/services/
├── {domain}.service.ts    # API calls for specific domain
└── index.ts               # Re-exports
```

### Example: Services Domain

```typescript
// src/services/services.service.ts
import { apiClient } from "@/lib/apiClient";
import type { Service } from "@repo/types/service";

export interface ServicesQueryParams {
  category?: ServiceCategory;
  isActive?: boolean;
  limit?: number;
}

export const servicesService = {
  async getAll(params?: ServicesQueryParams): Promise<Service[]> {
    const { data } = await apiClient.get<Service[]>("/services", { params });
    return data;
  },
};
```

**Key Points**:
- Each service exports typed functions
- All params/responses use shared types from `@repo/types`
- Error handling delegated to apiClient interceptors

---

## Custom Hooks Pattern

### Query Hook (Read Operations)

```typescript
// src/hooks/api/useServices.ts
import { useQuery } from "@tanstack/react-query";
import { servicesService } from "@/services/services.service";

export function useServices(params?: ServicesQueryParams) {
  return useQuery({
    queryFn: () => servicesService.getAll(params),
    queryKey: ["services", params],
    staleTime: 30_000, // Override global default for specific needs
  });
}
```

**Usage in Component**:
```typescript
function ServicesPage() {
  const { data: services = [], isLoading, isError, refetch } = useServices({
    isActive: true,
  });

  if (isLoading) return <ServiceCardSkeleton />;
  if (isError) return <ErrorMessage onRetry={refetch} />;

  return <div>{services.map(s => <ServiceCard service={s} />)}</div>;
}
```

### Mutation Hook (Write Operations)

```typescript
// src/hooks/api/useBookings.ts
import { useMutation } from "@tanstack/react-query";
import { bookingsService } from "@/services/bookings.service";

export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    retry: 1, // Retry once for submissions
  });
}
```

**Usage in Form**:
```typescript
function BookingForm() {
  const { mutate, isPending, isSuccess, isError } = useCreateBooking();

  const onSubmit = (formData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
      {isError && <ErrorMessage />}
      {isSuccess && <SuccessMessage />}
    </form>
  );
}
```

---

## Form Integration Pattern

### React Hook Form + Zod

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service required"),
  date: z.date(),
  timeSlot: z.string(),
  customerInfo: z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone"),
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

function BookingForm() {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const { mutate } = useCreateBooking();

  const onSubmit = form.handleSubmit((data) => {
    // Transform Date to ISO string for API
    const dto = {
      ...data,
      date: data.date.toISOString().split('T')[0], // "YYYY-MM-DD"
    };
    mutate(dto);
  });

  return <form>{/* fields */}</form>;
}
```

---

## Loading States Pattern

### Skeleton Components

**Design**: Border-based (client theme), no shadows

```typescript
// src/components/shared/skeletons/ServiceCardSkeleton.tsx
export function ServiceCardSkeleton() {
  return (
    <div className="border border-border rounded-md p-6 space-y-4" role="status">
      <ImageSkeleton height="h-48" />
      <TextSkeleton width="w-3/4" height="h-6" />
      <TextSkeleton width="w-full" height="h-4" />
      <TextSkeleton width="w-1/4" height="h-5" />
    </div>
  );
}
```

**Usage**:
```typescript
{isLoading && (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
  </div>
)}
```

---

## Error Handling Pattern

### ErrorMessage Component

```typescript
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="border-2 border-red-500/50 bg-red-50/50 rounded-md p-6">
      <p className="text-red-700">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
```

**Usage**:
```typescript
{isError && (
  <ErrorMessage
    message="Không thể tải dịch vụ. Vui lòng thử lại."
    onRetry={() => refetch()}
  />
)}
```

### Error Boundary

**Global error catcher** for unexpected errors:

```typescript
// App.tsx
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

<ErrorBoundary>
  <RouterProvider router={router} />
</ErrorBoundary>
```

---

## Cache Configuration

### Global Defaults (queryClient.ts)

```typescript
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache config - mobile gets longer cache (bandwidth saving)
      staleTime: isMobile ? 10 * 60_000 : 5 * 60_000, // 10min mobile, 5min desktop
      gcTime: isMobile ? 20 * 60_000 : 10 * 60_000,   // 20min mobile, 10min desktop

      // Refetch config
      refetchOnWindowFocus: false, // No flashing on tab switch
      refetchOnMount: true,        // Fresh data on navigation
      refetchOnReconnect: true,    // Refresh on network recovery

      // Smart retry - skip 4xx, retry 5xx/network
      retry: (failureCount, error) => {
        if (ApiError.isApiError(error) && error.statusCode >= 400 && error.statusCode < 500) {
          return false; // Don't retry client errors
        }
        const maxRetries = isMobile ? 3 : 2; // More retries on mobile
        return failureCount < maxRetries;
      },
    },
  },
});
```

### Per-Hook Overrides

```typescript
export function useServices(params?: ServicesQueryParams) {
  return useQuery({
    queryFn: () => servicesService.getAll(params),
    queryKey: ["services", params],
    staleTime: 30_000, // 30s - services shown on multiple pages
  });
}
```

---

## Performance Optimization

### Prefetching (Desktop Only)

```typescript
// src/hooks/useHomePage.ts
export function useHomePage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
      // Prefetch services for /services page
      queryClient.prefetchQuery({
        queryFn: () => servicesService.getAll({ isActive: true }),
        queryKey: ["services", { isActive: true }],
      });

      // Prefetch gallery for /gallery page
      queryClient.prefetchQuery({
        queryFn: () => galleryService.getAll({ isActive: true, limit: 12 }),
        queryKey: ["gallery", { isActive: true, limit: 12 }],
      });
    }
  }, [queryClient]);
}
```

### Lazy Image Loading

```typescript
// src/components/shared/LazyImage.tsx
export function LazyImage({ src, alt, className }: LazyImageProps) {
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
      { rootMargin: "50px" } // Start loading 50px before viewport
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {!isLoaded && <div className="absolute inset-0 bg-muted/50 animate-pulse" />}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0", className)}
      />
    </div>
  );
}
```

---

## Best Practices

### 1. Type Safety

- ✅ Use shared types from `@repo/types`
- ✅ Define query params interfaces
- ✅ Type all service functions
- ✅ Use Zod for form validation (runtime type checking)

### 2. Error Handling

- ✅ Let queryClient handle global errors (logged in dev only)
- ✅ Use ErrorMessage component for user-facing errors
- ✅ Provide retry functionality
- ✅ Smart retry logic (skip 4xx client errors)

### 3. Loading States

- ✅ Show skeletons matching actual content layout
- ✅ Follow client design system (border-based)
- ✅ Use role="status" for accessibility

### 4. Performance

- ✅ Prefetch on desktop only (bandwidth-aware)
- ✅ Lazy load images with IntersectionObserver
- ✅ Mobile-specific cache tuning (longer cache, more retries)
- ✅ Per-hook cache overrides when needed

### 5. Data Transformations

- ✅ Transform dates: `Date` → `"YYYY-MM-DD"` for API
- ✅ Handle API pagination wrappers
- ✅ Default to empty arrays for undefined data

---

## Common Patterns

### Pattern: Paginated List

```typescript
export function useGalleryInfinite(params?: GalleryQueryParams) {
  return useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      galleryService.getAll({ ...params, page: pageParam }),
    queryKey: ["gallery", "infinite", params],
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.pagination.hasNext;
      return hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
```

### Pattern: Dependent Queries

```typescript
function BookingForm() {
  const { data: services } = useServices({ isActive: true });

  // Only fetch availability after service selected
  const { data: availability } = useAvailability(
    { serviceId: selectedServiceId },
    { enabled: !!selectedServiceId } // Only run when serviceId exists
  );
}
```

### Pattern: Optimistic Updates

```typescript
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBookingDto) => bookingsService.update(data),
    onMutate: async (updatedBooking) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bookings"] });

      // Snapshot previous value
      const previousBookings = queryClient.getQueryData(["bookings"]);

      // Optimistically update cache
      queryClient.setQueryData(["bookings"], (old) =>
        old?.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
      );

      return { previousBookings };
    },
    onError: (err, updatedBooking, context) => {
      // Rollback on error
      queryClient.setQueryData(["bookings"], context.previousBookings);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
```

---

## Troubleshooting

### Issue: Cache not updating after mutation

**Solution**: Invalidate queries after mutation

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["services"] });
}
```

### Issue: Stale data on navigation

**Solution**: Set `refetchOnMount: true` (already default)

### Issue: Too many refetches on tab switch

**Solution**: Set `refetchOnWindowFocus: false` (already configured)

### Issue: Network errors on mobile

**Solution**: Mobile already has more retries (3 vs 2) and longer retry delay

---

## References

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- Client Design Guidelines: `/docs/design-guidelines.md`
- Shared Types: `/packages/types/src/`
