# Task 1: Create Infinite Query Hooks

**Phase**: 1 - Foundation
**Complexity**: Low
**Files**: 4 hook files
**Dependencies**: None

---

## Objectives

Create 4 infinite query hooks following `useInfiniteServices` pattern for Gallery, Bookings, Contacts, Banners.

---

## Implementation

### 1.1: useInfiniteGalleryItems

**File**: `apps/admin/src/hooks/api/useGallery.ts`

```typescript
/**
 * Query: Get all gallery items with infinite scroll
 */
export function useInfiniteGalleryItems(
  params: Omit<GalleriesQueryParams, "page"> = {},
) {
  return useInfiniteQuery<
    PaginationResponse<GalleryItem>,
    Error,
    PaginationResponse<GalleryItem>,
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

**Import**: Add `useInfiniteQuery` to imports

---

### 1.2: useInfiniteBookings

**File**: `apps/admin/src/hooks/api/useBookings.ts`

```typescript
/**
 * Query: Get all bookings with infinite scroll
 */
export function useInfiniteBookings(
  params: Omit<BookingsQueryParams, "page"> = {},
) {
  return useInfiniteQuery<
    PaginationResponse<Booking>,
    Error,
    PaginationResponse<Booking>,
    ReturnType<typeof queryKeys.bookings.list>,
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
      bookingsService.getAll({ ...params, page: pageParam, limit: 20 }),
    queryKey: queryKeys.bookings.list(params),
    staleTime: 30_000,
  });
}
```

---

### 1.3: useInfiniteContacts

**File**: `apps/admin/src/hooks/api/useContacts.ts`

**⚠️ CRITICAL**: Verify API returns `PaginationResponse<Contact>`

```typescript
/**
 * Query: Get all contacts with infinite scroll
 */
export function useInfiniteContacts(
  params: Omit<ContactsQueryParams, "page"> = {},
) {
  return useInfiniteQuery<
    PaginationResponse<Contact>,
    Error,
    PaginationResponse<Contact>,
    ReturnType<typeof queryKeys.contacts.list>,
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
      contactsService.getAll({ ...params, page: pageParam, limit: 20 }),
    queryKey: queryKeys.contacts.list(params),
    staleTime: 30_000,
  });
}
```

**Pre-Check**:
```bash
# Verify contacts service returns PaginationResponse
grep -A 10 "getAll" apps/admin/src/services/contacts.service.ts
```

---

### 1.4: useInfiniteBanners

**File**: `apps/admin/src/hooks/api/useBanners.ts`

```typescript
/**
 * Query: Get all banners with infinite scroll
 */
export function useInfiniteBanners(
  params: Omit<BannersQueryParams, "page"> = {},
) {
  return useInfiniteQuery<
    PaginationResponse<Banner>,
    Error,
    PaginationResponse<Banner>,
    ReturnType<typeof queryKeys.banners.list>,
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
      bannersService.getAll({ ...params, page: pageParam, limit: 20 }),
    queryKey: queryKeys.banners.list(params),
    staleTime: 30_000,
  });
}
```

---

## Validation

```bash
# Type-check
npm run type-check

# Lint
npm run lint
```

---

## Success Criteria

✅ 4 hooks created
✅ No TypeScript errors
✅ Follows useInfiniteServices pattern
✅ Each hook <50 LOC
