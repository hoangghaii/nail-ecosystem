# ✅ FINAL SCOPE - Complete Frontend-to-Backend Filter Migration

**Plan ID:** 260117-1555-complete-fe-to-be-filter-migration
**Date:** 2026-01-17 16:25
**Status:** COMPREHENSIVE ANALYSIS COMPLETE

---

## Total Scope: 14 Files

### Admin App: 7 Files

| # | File | Type | Change | Backend Ready |
|---|------|------|--------|---------------|
| 1 | `pages/BookingsPage.tsx` | Page | Remove useMemo (status + search) | ✅ QueryBookingsDto |
| 2 | `pages/BannersPage.tsx` | Page | Remove filter() (type + active) | ✅ QueryBannersDto |
| 3 | `components/gallery/gallery-items-tab.tsx` | Component | Remove useMemo (category + search) | ✅ QueryGalleryDto (no search) |
| 4 | `services/banners.service.ts` | Service | Add query params | - |
| 5 | `services/gallery.service.ts` | Service | Add query params | - |
| 6 | `hooks/api/useBanners.ts` | Hook | Add param support | - |
| 7 | `hooks/api/useGallery.ts` | Hook | Add param support | - |

### Client App: 7 Files

| # | File | Type | Change | Backend Ready |
|---|------|------|--------|---------------|
| 8 | `hooks/useServicesPage.ts` | Hook | Remove hardcoded data + useMemo | ✅ QueryServicesDto |
| 9 | `hooks/useGalleryPage.ts` | Hook | Remove useMemo, map slug→ID | ✅ QueryGalleryDto |
| 10 | `services/services.service.ts` | Service | Add query params | - |
| 11 | `services/gallery.service.ts` | Service | Add query params | - |
| 12 | `hooks/api/useServices.ts` | Hook | Add param support | - |
| 13 | `hooks/api/useGallery.ts` | Hook | Add param support | - |
| 14 | `data/services.ts` | Data | **DELETE** (hardcoded data) | - |

---

## Effort Breakdown

### Phase 1: Admin (3-4 hours)

**Services (1h):**
- banners.service.ts - Add BannersQueryParams (20 min)
- gallery.service.ts - Add GalleryQueryParams (20 min)
- Test services (20 min)

**Hooks (45 min):**
- useBanners() - Accept params (20 min)
- useGalleryItems() - Accept params (20 min)
- Verify query keys (5 min)

**Pages/Components (1.5-2h):**
- BookingsPage - Remove useMemo (30 min)
- BannersPage - Remove filter() (30 min)
- GalleryItemsTab - Map slug→ID, remove useMemo (45 min)

### Phase 2: Client (3-4 hours)

**Services (1.5h):**
- services.service.ts - Add ServicesQueryParams (40 min)
- gallery.service.ts - Add GalleryQueryParams (40 min)
- Test services (30 min)

**Hooks (45 min):**
- useServices() - Accept params (20 min)
- useGalleryItems() - Accept params (20 min)
- Verify query keys (5 min)

**Page Hooks (1-1.5h):**
- useServicesPage - Remove hardcoded data (30 min)
- useGalleryPage - Map slug→ID (45 min)

**Cleanup (15 min):**
- Delete data/services.ts
- Verify no imports

### Phase 3: Testing (2 hours)
- Type-check + build
- Manual testing all filters
- Performance validation
- Cross-browser testing

### Phase 4: Documentation (1 hour)
- Update API docs
- Update completion summary
- Clean up deprecated code

---

## Timeline

**Total Effort:** 9-11 hours
**Duration:** 2-3 working days
**Target Completion:** 2026-01-19 or 2026-01-20

| Day | Work | Hours |
|-----|------|-------|
| Day 1 AM | Admin services + hooks | 2h |
| Day 1 PM | Admin pages | 2h |
| Day 2 AM | Client services + hooks | 2h |
| Day 2 PM | Client page hooks | 2h |
| Day 3 | Testing + docs | 3h |

---

## Key Decisions

### 1. Gallery Search (Admin)
**Decision:** Keep search in frontend (YAGNI)
**Reason:** Admin gallery <100 items, search performance acceptable
**Alternative:** Add search to QueryGalleryDto (+30 min backend work)

### 2. Category Mapping (Client + Admin Gallery)
**Pattern:** Map slug → categoryId in hooks before API call
```typescript
const categoryId = useMemo(() => {
  if (selectedCategory === 'all') return undefined;
  return categories.find(c => c.slug === selectedCategory)?._id;
}, [selectedCategory, categories]);
```

### 3. Banner Type Filter (Admin)
**Pattern:** Map heroDisplayMode → banner type
```typescript
const type = heroDisplayMode === 'video' ? 'video' : 'image';
const { data } = useBanners({ type, active });
```

---

## Backend Status

### Ready ✅
- QueryServicesDto (category, featured, isActive, pagination)
- QueryGalleryDto (categoryId, featured, isActive, pagination)
- QueryBookingsDto (status, search, sortBy, sortOrder, pagination)
- QueryBannersDto (type, isPrimary, active, pagination)

### Optional ⚠️
- Gallery search param (keep in FE for now)

---

## Risk Level: LOW-MEDIUM

**Mitigations:**
- Backend infrastructure ready
- Clear reference pattern (ContactsPage)
- Incremental testing per phase
- Easy rollback procedures
- Comprehensive test checklist

---

## Success Criteria

### Must Have ✅
- [ ] Zero useMemo/filter() in pages
- [ ] All filtering via backend
- [ ] Type-check passes
- [ ] Build passes
- [ ] All manual tests pass

### Should Have ✅
- [ ] Loading states display
- [ ] Empty states display
- [ ] No duplicate API calls
- [ ] Backend queries <100ms
- [ ] Cache working (30s)

---

**Analysis By:** Planning Skill
**Date:** 2026-01-17 16:25
**Status:** ✅ READY FOR IMPLEMENTATION

**Next Action:** Update phase documents with complete scope
