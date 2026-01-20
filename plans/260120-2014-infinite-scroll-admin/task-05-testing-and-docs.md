# Task 5: Testing & Documentation

**Phase**: 4 - Validation
**Complexity**: Low
**Dependencies**: Tasks 1-4

---

## Manual Testing

### Gallery Page
- [ ] Load page → 20 items appear
- [ ] Scroll down → Next 20 load automatically
- [ ] Search "nail" → Resets to page 1 with filtered results
- [ ] Change category → Resets to page 1
- [ ] Clear search → Resets to page 1
- [ ] Hover image → Prefetch works
- [ ] Toggle featured → Optimistic update works
- [ ] No more items → Trigger disappears

### Bookings Page
- [ ] Load page → 20 bookings
- [ ] Scroll → Next 20 load
- [ ] Search customer → Reset to page 1
- [ ] Filter by status → Reset to page 1
- [ ] Hover row → Prefetch detail
- [ ] Open modal → Detail loaded instantly
- [ ] Update status → Works

### Contacts Page
- [ ] Load page → 20 contacts
- [ ] Scroll → Next 20 load
- [ ] Search → Reset to page 1
- [ ] Filter status → Reset to page 1
- [ ] Click row → Modal opens
- [ ] Update status → Works

### Banners Page
- [ ] Load page → All banners (likely <20)
- [ ] Scroll → Works if >20
- [ ] Filter active → Works
- [ ] Drag reorder → Works
- [ ] Toggle active → Optimistic update

---

## Performance Testing

### Initial Load Time
```bash
# Open DevTools Network tab
# Hard refresh each page
# Measure "DOMContentLoaded" time

Expected:
- Gallery: <2s (was ~3-4s with 100 items)
- Bookings: <1.5s (was ~2s)
- Contacts: <1.5s (was ~2s)
- Banners: <1s (unchanged)
```

### Scroll Performance
- No jank during page append
- Images load progressively (gallery)
- CPU usage reasonable (<50% spike)

---

## Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile viewport (responsive)

---

## Documentation Updates

### Update README (if exists)
Add note about infinite scroll:

```markdown
### Admin Pages - Infinite Scroll

Gallery, Bookings, Contacts, and Banners use infinite scroll for better UX:
- Initial load: 20 items
- Auto-load on scroll (Intersection Observer)
- "Load More" button fallback
- Resets to page 1 on search/filter change
```

### Code Comments
Ensure each hook has JSDoc:

```typescript
/**
 * Query: Get all gallery items with infinite scroll
 *
 * @param params - Query parameters (search, category, etc.)
 * @returns InfiniteQuery with paginated data
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useInfiniteGalleryItems({
 *   categoryId: "nails",
 *   search: "pink"
 * });
 *
 * const items = data?.pages.flatMap(page => page.data) ?? [];
 */
```

---

## Performance Notes Document

Create: `docs/infinite-scroll-performance.md`

```markdown
# Infinite Scroll Performance Notes

## Configuration

- **Initial page size**: 20 items
- **Subsequent pages**: 20 items
- **Gallery**: May increase to 30-40 for better grid UX
- **Trigger threshold**: 10% visibility (Intersection Observer)

## Benefits

- **Faster TTI**: 20 vs 100 items initial load
- **Progressive**: Load on demand
- **Scalable**: No 100-item hard limit

## Considerations

- **Gallery images**: Progressive loading reduces initial bandwidth
- **Search/filter**: Auto-reset to page 1 (TanStack Query)
- **Prefetch**: Maintained on hover (Bookings, Gallery)

## Future Optimizations

- Configurable page size per page type
- Virtual scrolling for >1000 items
- Image lazy loading with blur-up
```

---

## Validation Commands

```bash
# Type-check all
npm run type-check

# Lint
npm run lint

# Build admin
npx turbo build --filter=admin

# Run dev (manual test)
npm run dev
```

---

## Success Criteria

✅ All pages tested manually
✅ Performance improved vs 100-item limit
✅ No regressions
✅ Documentation updated
✅ Code quality maintained
