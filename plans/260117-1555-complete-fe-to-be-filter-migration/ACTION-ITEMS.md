# Action Items

**Plan:** Complete Frontend-to-Backend Filter Migration
**Date:** 2026-01-17
**Status:** Ready to Start

---

## Immediate Actions (Start Today)

### ✅ Phase 1: Admin BookingsPage (30 min) - START NOW

**File:** `apps/admin/src/pages/BookingsPage.tsx`

**Tasks:**
1. Update `useBookings()` call to include filters
2. Remove `useMemo` filtering (lines 66-87)
3. Handle status counts (remove or simplify)
4. Test status filter + search
5. Verify type-check + build

**Reference:** `phase-01-admin-bookings-completion.md`

**Success:** Zero `useMemo` filters, backend filtering works

---

## Short-Term Actions (Next 1-2 Days)

### Phase 2: Client Services Migration (2-3h)

**Priority:** HIGH
**Owner:** Frontend Developer

**Tasks:**
1. ✅ Validate backend API (15 min)
2. Update `ServicesService` with query params (45 min)
3. Update `useServices` hook (30 min)
4. Update `useServicesPage` hook (45 min)
5. Update page component loading states (30 min)
6. Delete hardcoded `servicesData` (5 min)
7. Test all categories + loading states (30 min)

**Reference:** `phase-02-client-services-migration.md`

### Phase 3: Client Gallery Migration (2-3h)

**Priority:** HIGH
**Owner:** Frontend Developer

**Tasks:**
1. ✅ Validate backend API (15 min)
2. Update `GalleryService` with query params (45 min)
3. Update `useGalleryItems` hook (30 min)
4. Update `useGalleryPage` with slug→ID mapping (1h)
5. Update page component if needed (30 min)
6. Update `FeaturedGallery` component (15 min)
7. Test categories + lightbox + loading (30 min)

**Reference:** `phase-03-client-gallery-migration.md`

---

## Testing Actions (After Each Phase)

### Type Check & Build
```bash
npm run type-check
npm run build
```

### Manual Testing
**See:** `testing-checklist.md`

**Key Tests:**
- All filter combinations work
- Loading states display
- Empty states display
- No duplicate API calls
- Cache working (30s stale time)

---

## Quality Assurance (Before Deployment)

### Code Quality
- [ ] Zero TypeScript errors
- [ ] Zero `useMemo` filters remaining
- [ ] All hardcoded data removed
- [ ] Consistent patterns across files
- [ ] YAGNI/KISS/DRY principles followed

### Performance
- [ ] Backend queries <100ms
- [ ] React Query cache configured
- [ ] No duplicate network requests
- [ ] Smooth filter transitions

### Testing
- [ ] All manual tests pass (see checklist)
- [ ] No regressions in other pages
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

---

## Documentation Actions

### Update Docs
- [ ] `docs/api-endpoints.md` - Add filter examples
- [ ] Create completion summary
- [ ] Update project roadmap if needed

### Clean Up
- [ ] Remove deprecated code
- [ ] Remove unused imports
- [ ] Update code comments

---

## Deployment Actions

### Pre-Deployment
- [ ] All tests passing
- [ ] Type-check + build successful
- [ ] Code reviewed (if required)
- [ ] Rollback plan documented

### Deployment
- [ ] Deploy to staging first
- [ ] Smoke test in staging
- [ ] Deploy to production
- [ ] Monitor for issues

### Post-Deployment
- [ ] Verify production works
- [ ] Monitor backend query performance
- [ ] Monitor error rates
- [ ] Document any issues

---

## Rollback Procedures

### If Phase 1 Fails
```bash
git revert <commit-hash>
# Or restore BookingsPage from previous commit
```

### If Phase 2 Fails
```bash
git checkout HEAD~1 -- apps/client/src/hooks/useServicesPage.ts
git checkout HEAD~1 -- apps/client/src/data/services.ts
```

### If Phase 3 Fails
```bash
git checkout HEAD~1 -- apps/client/src/hooks/useGalleryPage.ts
git checkout HEAD~1 -- apps/client/src/services/gallery.service.ts
```

### Emergency Production Rollback
```bash
# Revert to previous deployment
git log --oneline -10  # Find last good commit
git reset --hard <commit-hash>
# Force push (use with caution)
# Or deploy previous release
```

---

## Communication Actions

### Stakeholder Updates
- [ ] Notify team of Phase 1 start
- [ ] Daily progress updates
- [ ] Completion summary when done

### Documentation
- [ ] Share plan with team
- [ ] Update project status
- [ ] Document learnings

---

## Success Checklist

### Phase 1 Complete When:
- [x] No `useMemo` filters in BookingsPage
- [x] Backend filtering works for status + search
- [x] Type-check passes
- [x] Build passes

### Phase 2 Complete When:
- [x] No hardcoded `servicesData`
- [x] Backend filtering works for categories
- [x] Loading states work
- [x] Type-check + build pass

### Phase 3 Complete When:
- [x] No `useMemo` filters in GalleryPage
- [x] Category slug→ID mapping works
- [x] Backend filtering works
- [x] Lightbox navigation works with filters

### Migration Complete When:
- [x] All phases complete
- [x] All tests passing
- [x] Documentation updated
- [x] Deployed to production
- [x] No regressions

---

## Timeline

| Day | Phase | Tasks | Hours |
|-----|-------|-------|-------|
| Day 1 AM | Phase 1 | Admin Bookings | 0.5h |
| Day 1 PM | Phase 2 | Client Services | 2-3h |
| Day 2 AM | Phase 3 | Client Gallery | 2-3h |
| Day 2 PM | Testing | Comprehensive tests | 2h |
| Day 2 EOD | Deploy | Staging + Production | 1h |

**Total:** 8-10 hours over 2 days

---

## Contact & Support

**Questions:** Ask in team chat or create GitHub issue
**Blockers:** Escalate to tech lead immediately
**Documentation:** See plan files in `plans/260117-1555-complete-fe-to-be-filter-migration/`

---

**Last Updated:** 2026-01-17 15:55
**Next Review:** After Phase 1 completion
