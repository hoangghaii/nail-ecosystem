# Phase 2: Loading & Error States

**Phase**: 2/5
**Date**: 2026-02-14
**Duration**: 1 day
**Priority**: P1 (Infrastructure)
**Status**: ✅ Complete
**Completed**: 2026-02-15

---

## Context

**Dependencies**: Phase 1 complete (working API integration)
**Blocked By**: Phase 1
**Blocks**: Phase 3 (polished UX needed before complex flows)

**Problem**: No loading skeletons, Footer shows nothing while loading, no error boundaries, no customer-friendly error handling. Poor UX during network delays or failures.

---

## Overview

Add professional loading states and error handling across all client pages. Create reusable skeleton components following client design system (border-based, NO shadows). Implement error boundaries for graceful degradation.

**Goals**:
- All pages show skeleton loaders while fetching data
- All errors handled with customer-friendly messages
- Retry buttons on failed requests
- Error boundary catches React errors

---

## Key Insights from Research

**From researcher-02**:
- Admin has NO skeleton loaders (uses basic spinners)
- Client needs better UX (customer-facing)
- Skeleton design: border-based, muted colors, animate-pulse
- NO shadows (client design system constraint)
- Inline errors preferred over toasts

**Design System Requirements**:
- Border: `border border-border`
- Background: `bg-muted/50`
- Rounded: `rounded-md` for cards
- Animation: `animate-pulse`
- No glassmorphism, no shadows

---

## Requirements

### Functional Requirements

**FR-2.1**: All pages show skeleton loaders while data fetching
**FR-2.2**: Footer shows skeleton instead of null while loading
**FR-2.3**: Error boundary catches React errors and shows fallback UI
**FR-2.4**: Network errors show inline error messages
**FR-2.5**: All error messages are customer-friendly (no jargon)
**FR-2.6**: Failed requests show retry button
**FR-2.7**: Loading states accessible (ARIA labels, screen reader support)

### Non-Functional Requirements

**NFR-2.1**: Skeletons match component layout exactly
**NFR-2.2**: Skeletons follow client design system (border-based)
**NFR-2.3**: Error messages under 50 characters (concise)
**NFR-2.4**: Retry logic uses exponential backoff
**NFR-2.5**: Error boundary doesn't break entire app

---

## Architecture

### Component Structure

**Skeleton Loaders** (create 5 components):
- `ServiceCardSkeleton` - For ServicesOverview, ServicesPage
- `GalleryItemSkeleton` - For GalleryPage, FeaturedGallery
- `FooterSkeleton` - For Footer loading state
- `TextSkeleton` - Generic text placeholder
- `ImageSkeleton` - Generic image placeholder

**Error Components** (create 2 components):
- `ErrorBoundary` - Global React error boundary
- `ErrorMessage` - Reusable inline error display

### Data Flow

**Loading Flow**:
```
Component mounts → useQuery hook
  ↓
isLoading = true → Render skeleton
  ↓
Data fetched → isLoading = false → Render content
```

**Error Flow**:
```
Component mounts → useQuery hook
  ↓
Error thrown → isError = true, error object
  ↓
Render ErrorMessage with retry button
  ↓
User clicks retry → refetch()
```

**Error Boundary Flow**:
```
React error thrown → ErrorBoundary catches
  ↓
componentDidCatch logs error
  ↓
Render fallback UI with reload button
```

---

## Related Code Files

### Files to Create

**Skeleton Components**:
- `/apps/client/src/components/shared/skeletons/ServiceCardSkeleton.tsx` - **NEW**
- `/apps/client/src/components/shared/skeletons/GalleryItemSkeleton.tsx` - **NEW**
- `/apps/client/src/components/shared/skeletons/FooterSkeleton.tsx` - **NEW**
- `/apps/client/src/components/shared/skeletons/TextSkeleton.tsx` - **NEW**
- `/apps/client/src/components/shared/skeletons/ImageSkeleton.tsx` - **NEW**

**Error Components**:
- `/apps/client/src/components/shared/ErrorBoundary.tsx` - **NEW**
- `/apps/client/src/components/shared/ErrorMessage.tsx` - **NEW**

### Files to Modify

**Loading States**:
- `/apps/client/src/components/layout/Footer.tsx` - Add FooterSkeleton
- `/apps/client/src/components/home/ServicesOverview.tsx` - Add ServiceCardSkeleton (already in Phase 1)
- `/apps/client/src/components/home/FeaturedGallery.tsx` - Add GalleryItemSkeleton
- `/apps/client/src/pages/ServicesPage.tsx` - Add ServiceCardSkeleton
- `/apps/client/src/pages/GalleryPage.tsx` - Add GalleryItemSkeleton

**Error States**:
- `/apps/client/src/App.tsx` - Wrap app with ErrorBoundary
- `/apps/client/src/pages/ServicesPage.tsx` - Add ErrorMessage for fetch errors
- `/apps/client/src/pages/GalleryPage.tsx` - Add ErrorMessage for fetch errors
- `/apps/client/src/pages/ContactPage.tsx` - Already has error handling (Phase 1)

---

## Implementation Steps

### Step 1: Create Generic Skeleton Components (30 mins)

**TextSkeleton** (`/apps/client/src/components/shared/skeletons/TextSkeleton.tsx`):
- Props: width (string), height (string), className (optional)
- Design: `bg-muted/50 rounded animate-pulse`
- Usage: `<TextSkeleton width="w-3/4" height="h-4" />`

**ImageSkeleton** (`/apps/client/src/components/shared/skeletons/ImageSkeleton.tsx`):
- Props: width (string), height (string), className (optional)
- Design: `bg-muted/50 rounded-md animate-pulse`
- Usage: `<ImageSkeleton width="w-full" height="h-48" />`

### Step 2: Create ServiceCardSkeleton (20 mins)

**File**: `/apps/client/src/components/shared/skeletons/ServiceCardSkeleton.tsx`

Structure matching ServiceCard layout:
- Image placeholder (h-48)
- Title placeholder (h-6, w-3/4)
- Description placeholders (2 lines, h-4)
- Price placeholder (h-5, w-1/4)
- Border-based card container

Design constraints:
- Border: `border border-border`
- Padding: `p-6`
- Gap: `space-y-4`
- NO shadows

### Step 3: Create GalleryItemSkeleton (15 mins)

**File**: `/apps/client/src/components/shared/skeletons/GalleryItemSkeleton.tsx`

Structure matching GalleryItem:
- Square image placeholder (aspect-square)
- Border-based container
- Rounded corners: `rounded-md`

### Step 4: Create FooterSkeleton (20 mins)

**File**: `/apps/client/src/components/shared/skeletons/FooterSkeleton.tsx`

Structure matching Footer layout:
- 3 columns (contact, hours, social)
- Text placeholders for each column
- Match Footer grid: `grid grid-cols-1 md:grid-cols-3 gap-8`

### Step 5: Create ErrorBoundary (30 mins)

**File**: `/apps/client/src/components/shared/ErrorBoundary.tsx`

Features:
- Class component (required for error boundary)
- State: `{ hasError: boolean }`
- `static getDerivedStateFromError()` - set hasError = true
- `componentDidCatch(error, errorInfo)` - log error (dev mode)
- Render fallback UI with reload button
- Customer-friendly message (no stack traces)

Fallback UI:
```tsx
<div className="min-h-screen flex items-center justify-center p-6">
  <div className="max-w-md text-center">
    <h1 className="text-2xl font-serif text-foreground mb-4">
      Something went wrong
    </h1>
    <p className="text-foreground/70 mb-6">
      We're sorry. Please refresh the page.
    </p>
    <button onClick={() => window.location.reload()}>
      Refresh Page
    </button>
  </div>
</div>
```

### Step 6: Create ErrorMessage Component (20 mins)

**File**: `/apps/client/src/components/shared/ErrorMessage.tsx`

Props:
- message (string) - Error message to display
- onRetry (optional function) - Retry callback
- className (optional string)

Design:
- Border-based container
- Red accent: `border-destructive/50 bg-destructive/10`
- Text: `text-destructive`
- Retry button if onRetry provided

### Step 7: Integrate Skeletons in Pages (1 hour)

**Footer**:
- Check `isLoading` from `useBusinessInfo()`
- Render `<FooterSkeleton />` if loading
- Render null if error (graceful degradation)

**ServicesPage**:
- Check `isLoading` from `useServices()`
- Render grid of `<ServiceCardSkeleton />` (6 items)
- Add `<ErrorMessage />` if error with retry

**GalleryPage**:
- Check `isLoading` from `useGalleryItems()`
- Render grid of `<GalleryItemSkeleton />` (12 items)
- Add `<ErrorMessage />` if error with retry

**FeaturedGallery**:
- Check `isLoading` from `useFeaturedGalleryItems()`
- Render grid of `<GalleryItemSkeleton />` (6 items)
- Add `<ErrorMessage />` if error

### Step 8: Wrap App with ErrorBoundary (10 mins)

**File**: `/apps/client/src/App.tsx`

Wrap root component:
```tsx
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
</ErrorBoundary>
```

### Step 9: Add Retry Logic to Query Client (15 mins)

**File**: `/apps/client/src/lib/queryClient.ts`

Update default options:
```typescript
retry: (failureCount, error) => {
  // Don't retry on 4xx errors (client errors)
  if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
    return false;
  }
  // Retry up to 2 times for network errors
  return failureCount < 2;
}
```

---

## Todo Checklist

### Generic Skeletons
- [ ] Create TextSkeleton component
- [ ] Create ImageSkeleton component
- [ ] Test generic skeletons in isolation

### Page-Specific Skeletons
- [ ] Create ServiceCardSkeleton
- [ ] Create GalleryItemSkeleton
- [ ] Create FooterSkeleton
- [ ] Test skeletons match actual component layouts

### Error Handling
- [ ] Create ErrorBoundary component
- [ ] Create ErrorMessage component
- [ ] Test ErrorBoundary catches errors
- [ ] Test ErrorMessage displays correctly

### Integration
- [ ] Add FooterSkeleton to Footer
- [ ] Add ServiceCardSkeleton to ServicesPage
- [ ] Add ServiceCardSkeleton to ServicesOverview
- [ ] Add GalleryItemSkeleton to GalleryPage
- [ ] Add GalleryItemSkeleton to FeaturedGallery
- [ ] Wrap App with ErrorBoundary
- [ ] Add ErrorMessage to ServicesPage
- [ ] Add ErrorMessage to GalleryPage

### Query Client
- [ ] Update retry logic
- [ ] Test retry on network errors
- [ ] Test no retry on 4xx errors

### Testing
- [ ] Test all loading states show skeletons
- [ ] Test Footer shows skeleton while loading
- [ ] Test ServicesPage shows skeletons
- [ ] Test GalleryPage shows skeletons
- [ ] Simulate network error, verify ErrorMessage
- [ ] Test retry button functionality
- [ ] Trigger React error, verify ErrorBoundary
- [ ] Test mobile responsiveness
- [ ] Verify ARIA labels for loading states

---

## Success Criteria

**Loading States**:
- ✅ All pages show skeleton loaders while fetching
- ✅ Footer shows FooterSkeleton (not null)
- ✅ Skeletons match component layouts exactly
- ✅ Skeletons follow client design system (border-based, NO shadows)

**Error Handling**:
- ✅ ErrorBoundary catches React errors
- ✅ ErrorMessage shows customer-friendly messages
- ✅ Retry buttons work on network errors
- ✅ 4xx errors don't retry (client errors)
- ✅ Network errors retry up to 2 times

**Code Quality**:
- ✅ No console errors
- ✅ TypeScript strict mode passes
- ✅ Accessible (ARIA labels, keyboard nav)
- ✅ Mobile-friendly

---

## Risk Assessment

**Low Risk**:
- Skeleton component creation (straightforward UI)
- ErrorMessage component (simple display)

**Medium Risk**:
- ErrorBoundary integration (class component, rarely used)
- Retry logic edge cases

**Mitigation**:
- Test ErrorBoundary thoroughly (throw test error)
- Test retry logic with network throttling
- Verify skeletons match layouts on all screen sizes

---

## Security Considerations

**Low Impact**: Loading/error states don't handle sensitive data

**Error Logging**:
- Don't log sensitive data in errors
- Don't expose stack traces to users
- ErrorBoundary logs to console (dev only)

---

## Next Steps

**After Phase 2**:
1. Move to Phase 3: Booking Integration
2. Implement booking form with validation
3. Add optimistic updates for better UX
4. Test full booking flow end-to-end
