# 🚀 Start Here: Complete FE-to-BE Filter Migration

**Plan ID:** 260117-1555-complete-fe-to-be-filter-migration
**Created:** 2026-01-17 15:55
**Status:** ✅ Planning Complete - Ready for Implementation

---

## 📋 Quick Facts

- **Goal:** Migrate ALL filtering from frontend to backend
- **Scope:** Admin BookingsPage + Client Services/Gallery
- **Effort:** 8-10 hours over 2 days
- **Risk:** LOW (backend ready, clear pattern)
- **Priority:** HIGH

---

## 📚 Document Guide

### Start Implementation
1. **[ACTION-ITEMS.md](./ACTION-ITEMS.md)** - What to do right now
2. **Phase Guides** - Step-by-step implementation:
   - [phase-01-admin-bookings-completion.md](./phase-01-admin-bookings-completion.md) (30 min)
   - [phase-02-client-services-migration.md](./phase-02-client-services-migration.md) (2-3h)
   - [phase-03-client-gallery-migration.md](./phase-03-client-gallery-migration.md) (2-3h)
3. **[testing-checklist.md](./testing-checklist.md)** - Test each phase

### Understand Context
- **[README.md](./README.md)** - Quick overview
- **[EXECUTIVE-SUMMARY.md](./EXECUTIVE-SUMMARY.md)** - For stakeholders
- **[plan.md](./plan.md)** - Full technical plan (808 LOC)

---

## 🎯 What Gets Done

| App | Page | Status | Action |
|-----|------|--------|--------|
| Admin | BookingsPage | 85% → 100% | Remove `useMemo` filters |
| Client | ServicesPage | 0% → 100% | Full migration |
| Client | GalleryPage | 0% → 100% | Full migration |

**Result:** Zero frontend filtering, all via backend APIs

---

## ⚡ Quick Start (30 min)

### Phase 1: Admin BookingsPage

**File:** `apps/admin/src/pages/BookingsPage.tsx`

**Change:**
```typescript
// BEFORE (bad)
const { data: response } = useBookings();
const filteredBookings = useMemo(() => { /* filter logic */ }, []);

// AFTER (good)
const { data: response } = useBookings({
  status: activeStatus !== 'all' ? activeStatus : undefined,
  search: debouncedSearch,
  limit: 100
});
const bookings = useMemo(() => response?.data || [], [response?.data]);
```

**Test:**
```bash
npm run type-check
npm run build
# Manual: Test status filter + search
```

**Done!** Ship Phase 1 independently (30 min work)

---

## 🏗️ Architecture Pattern

### Reference Implementation
**See:** `apps/admin/src/pages/ContactsPage.tsx:32-40`

```typescript
// ✅ CORRECT PATTERN
const { data: response, isFetching } = useContacts({
  search: debouncedSearch,
  sortBy: sortField,
  sortOrder: sortDirection,
  limit: 100
});
const contacts = useMemo(() => response?.data || [], [response?.data]);
// NO frontend filtering!
```

### Apply Pattern To
- Admin BookingsPage ← Phase 1
- Client ServicesPage ← Phase 2
- Client GalleryPage ← Phase 3

---

## 🔑 Key Decisions

### Backend Ready ✅
- QueryServicesDto exists
- QueryGalleryDto exists
- QueryBookingsDto exists
- All services implement filtering

### Frontend Changes Only
- Update service layer (add query params)
- Update hooks (accept filters)
- Update pages (remove `useMemo`, pass filters)
- Delete hardcoded data

### Gallery Challenge
**Problem:** Frontend uses slug, backend uses categoryId

**Solution:** Map in hook
```typescript
const categoryId = useMemo(() => {
  if (selectedCategory === 'all') return undefined;
  const cat = categories.find(c => c.slug === selectedCategory);
  return cat?._id;
}, [selectedCategory, categories]);

const { data } = useGalleryItems({ categoryId });
```

---

## ✅ Success Criteria

- Zero `useMemo` filters in pages
- All filtering via backend
- Type-check passes
- Build passes
- Loading states work
- No duplicate API calls

---

## 🎬 Implementation Order

1. **Phase 1** (30 min) - Admin Bookings
2. **Phase 2** (2-3h) - Client Services
3. **Phase 3** (2-3h) - Client Gallery
4. **Testing** (2h) - Comprehensive validation
5. **Deploy** (1h) - Staging → Production

**Total:** 2 working days

---

## 📊 Progress Tracking

### Phase 1: Admin Bookings
- [ ] Update useBookings call
- [ ] Remove useMemo filtering
- [ ] Test + verify
- [ ] Ship ✅

### Phase 2: Client Services
- [ ] Update service layer
- [ ] Update hooks
- [ ] Update page
- [ ] Delete hardcoded data
- [ ] Test + verify

### Phase 3: Client Gallery
- [ ] Update service layer
- [ ] Map slug → categoryId
- [ ] Update hooks
- [ ] Update page
- [ ] Test + verify

---

## 🔧 Commands Reference

```bash
# Type check
npm run type-check

# Build
npm run build

# Test backend APIs
curl http://localhost:3000/api/services?category=manicure
curl http://localhost:3000/api/gallery?categoryId=xxx
curl http://localhost:3000/api/bookings?status=pending&search=john
```

---

## 🆘 Help & Support

**Stuck?** Check phase guides for step-by-step instructions

**Questions?**
- Review EXECUTIVE-SUMMARY.md
- Check testing-checklist.md
- Read full plan.md

**Blockers?** Escalate to tech lead

---

## 🎉 When You're Done

1. All phases complete ✅
2. All tests passing ✅
3. Documentation updated ✅
4. Deployed to production ✅

**Celebrate!** 🎊 You've completed full FE→BE filter migration!

---

## 📁 File Structure

```
260117-1555-complete-fe-to-be-filter-migration/
├── 00-START-HERE.md (this file)
├── README.md (overview)
├── EXECUTIVE-SUMMARY.md (stakeholders)
├── ACTION-ITEMS.md (todos)
├── plan.md (full plan)
├── phase-01-admin-bookings-completion.md
├── phase-02-client-services-migration.md
├── phase-03-client-gallery-migration.md
└── testing-checklist.md
```

---

**👉 Next Step:** Open [ACTION-ITEMS.md](./ACTION-ITEMS.md) and start Phase 1!

**Created By:** Planning Skill (Orchestrator)
**Last Updated:** 2026-01-17 15:55
