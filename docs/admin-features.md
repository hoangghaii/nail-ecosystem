# Admin Features Documentation

## Infinite Scroll Implementation

### Overview
Infinite scroll replaces the previous 100-item limit pagination across admin pages. Users can continuously load data as they scroll, improving UX for large datasets.

### Implementation Details

**Pattern**: TanStack Query `useInfiniteQuery` with Intersection Observer

**Configuration**:
- Initial load: 20 items
- Auto-load on scroll (80% viewport trigger)
- Fallback: "Load More" button

**Component**: `InfiniteScrollTrigger`
- Location: `@/components/ui/infinite-scroll-trigger.tsx`
- Uses Intersection Observer API
- Shows loading state and manual load button
- Handles end-of-data state

### Pages with Infinite Scroll

1. **Gallery** (`/gallery`)
   - Hook: `useInfiniteGalleryImages`
   - Endpoint: `GET /gallery?limit=20&page={pageNumber}`
   - Features: Search filter support

2. **Bookings** (`/bookings`)
   - Hook: `useInfiniteBookings`
   - Endpoint: `GET /bookings?limit=20&page={pageNumber}`
   - Features: Status filter support

3. **Contacts** (`/contacts`)
   - Hook: `useInfiniteContacts`
   - Endpoint: `GET /contacts?limit=20&page={pageNumber}`
   - Features: Status filter support

4. **Banners** (`/banners`)
   - Hook: `useInfiniteBanners`
   - Endpoint: `GET /banners?limit=20&page={pageNumber}`
   - Features: Status filter support

### Code Pattern

```typescript
// Hook usage
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useInfiniteQuery({
  queryKey: ['resource', filters],
  queryFn: ({ pageParam = 1 }) => api.get({ page: pageParam, limit: 20 }),
  getNextPageParam: (lastPage, pages) =>
    lastPage.length === 20 ? pages.length + 1 : undefined
});

// Component usage
<InfiniteScrollTrigger
  hasMore={hasNextPage}
  isLoading={isFetchingNextPage}
  onLoadMore={fetchNextPage}
/>
```

### Backend Compatibility
No backend changes required. Existing pagination endpoints support `?limit=20&page={n}` query parameters.

### Benefits
- Better UX for large datasets
- Reduced initial load time
- Progressive data loading
- Maintains filter/search compatibility

---

**Last Updated**: 2026-01-20
**Feature Version**: 1.0.0
