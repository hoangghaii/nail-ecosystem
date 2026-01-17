# Testing Checklist

**Plan:** Complete Frontend-to-Backend Filter Migration
**Date:** 2026-01-17

---

## Pre-Implementation

### Backend API Validation

**Services API:**
- [ ] `GET /api/services` returns all services
- [ ] `GET /api/services?category=manicure` filters by category
- [ ] `GET /api/services?featured=true` filters featured
- [ ] `GET /api/services?isActive=true` filters active
- [ ] Response format: `{ data: [], pagination: {} }`

**Gallery API:**
- [ ] `GET /api/gallery` returns all gallery items
- [ ] `GET /api/gallery?categoryId=xxx` filters by category ID
- [ ] `GET /api/gallery?featured=true` filters featured
- [ ] `GET /api/gallery?isActive=true` filters active
- [ ] Response format: `{ data: [], pagination: {} }`

**Bookings API:**
- [ ] `GET /api/bookings?status=pending` filters by status
- [ ] `GET /api/bookings?search=john` searches by name/email/phone
- [ ] `GET /api/bookings?status=pending&search=john` combines filters
- [ ] Response format: `{ data: [], pagination: {} }`

---

## Phase 1: Admin BookingsPage

### Code Verification
- [ ] No `useMemo` filtering logic in BookingsPage
- [ ] `useBookings()` receives `{ status, search }` params
- [ ] Loading state uses `isFetching`
- [ ] Type-check passes: `npm run type-check`
- [ ] Build passes: `npm run build`

### Functional Testing
- [ ] Navigate to `/admin/bookings`
- [ ] Search by customer name works
- [ ] Search by email works
- [ ] Search by phone works
- [ ] Filter by "All" shows all bookings
- [ ] Filter by "Pending" shows only pending
- [ ] Filter by "Confirmed" shows only confirmed
- [ ] Filter by "Completed" shows only completed
- [ ] Filter by "Cancelled" shows only cancelled
- [ ] Combined search + status filter works
- [ ] Empty results show correct message
- [ ] Loading spinner displays during fetch

### Network Validation
- [ ] Only ONE request per filter change
- [ ] Query params in URL: `?status=pending&search=john`
- [ ] No duplicate API calls
- [ ] React Query cache working (30s)

---

## Phase 2: Client ServicesPage

### Code Verification
- [ ] No `servicesData` import in useServicesPage
- [ ] No `useMemo` filtering logic
- [ ] `useServices()` accepts `{ category, isActive }` params
- [ ] `ServicesService.getAll()` builds query string
- [ ] Type-check passes
- [ ] Build passes

### Functional Testing
- [ ] Navigate to `/services`
- [ ] "Tất Cả Dịch Vụ" shows all active services
- [ ] "Làm Móng Tay" shows only manicure services
- [ ] "Làm Móng Chân" shows only pedicure services
- [ ] "Nghệ Thuật Nail" shows only nail art services
- [ ] "Nối Móng" shows only extension services
- [ ] "Spa" shows only spa services
- [ ] Loading spinner displays during fetch
- [ ] Empty category shows correct message
- [ ] Service detail pages still work

### Homepage Verification
- [ ] Featured services on homepage use backend filter
- [ ] No hardcoded data

### Network Validation
- [ ] `GET /api/services?isActive=true` for "all"
- [ ] `GET /api/services?category=manicure&isActive=true` for category
- [ ] Only active services returned
- [ ] React Query cache working

---

## Phase 3: Client GalleryPage

### Code Verification
- [ ] No `useMemo` filtering logic in useGalleryPage
- [ ] Category slug → categoryId mapping works
- [ ] `useGalleryItems()` accepts `{ categoryId, isActive }` params
- [ ] `GalleryService.getAll()` builds query string
- [ ] `GalleryService.getFeatured()` uses backend filter
- [ ] Type-check passes
- [ ] Build passes

### Functional Testing
- [ ] Navigate to `/gallery`
- [ ] "All" category shows all active items
- [ ] Each category filter shows correct items
- [ ] Loading spinner displays during fetch
- [ ] Empty category shows correct message
- [ ] Lightbox opens on image click
- [ ] Lightbox navigation (prev/next) works with filtered items
- [ ] Lightbox shows correct item count

### Homepage Verification
- [ ] Featured gallery on homepage uses backend filter
- [ ] Displays featured items correctly

### Network Validation
- [ ] `GET /api/gallery-category` fetches categories
- [ ] `GET /api/gallery?isActive=true` for "all"
- [ ] `GET /api/gallery?categoryId=xxx&isActive=true` for category
- [ ] Correct categoryId used (not slug)
- [ ] React Query cache working

---

## Cross-App Integration

### Type Safety
- [ ] Zero TypeScript errors across all apps
- [ ] Shared types (`@repo/types`) used correctly
- [ ] PaginationResponse type consistent

### Build Verification
- [ ] `npm run build` succeeds
- [ ] Build time: ~7s full, ~89ms cached
- [ ] No warnings in build output
- [ ] Turbo cache working

### Performance
- [ ] Backend queries <100ms (check DevTools)
- [ ] React Query cache prevents duplicate calls
- [ ] No layout shift during loading
- [ ] Smooth transitions between filters

---

## Regression Testing

### Admin App
- [ ] ContactsPage still works (no regression)
- [ ] Other admin pages unaffected

### Client App
- [ ] Homepage works correctly
- [ ] Service detail pages work
- [ ] Gallery detail view works
- [ ] Booking flow works
- [ ] All navigation works

---

## Browser Testing

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome

### Responsive Design
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works

---

## Automated Tests (Future)

### Unit Tests (if time permits)
- [ ] Service layer: query string building
- [ ] Hook layer: param passing
- [ ] Component layer: filter state

### Integration Tests (if time permits)
- [ ] End-to-end filter flow
- [ ] API integration

---

## Performance Benchmarks

### Target Metrics
- [ ] Backend response: <100ms
- [ ] Total page load: <500ms
- [ ] Filter change: <200ms
- [ ] Cache hit rate: >70%

### Tools
- Chrome DevTools Performance tab
- React Query DevTools
- Network tab (response times)

---

## Sign-Off

### Developer
- [ ] All code changes complete
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Documentation updated

### QA (if applicable)
- [ ] Manual testing complete
- [ ] All test cases pass
- [ ] No regressions found

### Product Owner (if applicable)
- [ ] Feature behaves as expected
- [ ] User experience acceptable
- [ ] Ready for deployment

---

## Rollback Readiness

- [ ] Previous commit hash documented
- [ ] Rollback procedure tested
- [ ] Deployment plan includes rollback steps

---

**Status:** ⏳ Pending Implementation
**Last Updated:** 2026-01-17 15:55
