# Backend Search/Filter Migration - Quick Reference

**Date**: 2026-01-14
**Status**: Ready for Implementation
**Estimated Effort**: 10-12 hours

---

## Overview

Migrate FE search/filter to BE for Bookings and Contacts to achieve architectural consistency and prepare for scalability.

---

## Implementation Phases

| Phase | File | Duration | Risk | Dependencies |
|-------|------|----------|------|--------------|
| 1 | [phase-01-backend-dtos.md](./phase-01-backend-dtos.md) | 2h | Low | None |
| 2 | [phase-02-backend-services.md](./phase-02-backend-services.md) | 3h | Medium | Phase 1 |
| 3 | [phase-03-backend-indexes.md](./phase-03-backend-indexes.md) | 1h | ⚠️ HIGH | None (parallel) |
| 4 | [phase-04-frontend-services.md](./phase-04-frontend-services.md) | 1.5h | Low | Phase 1 |
| 5 | [phase-05-frontend-hooks.md](./phase-05-frontend-hooks.md) | 2h | Medium | Phase 4 |
| 6 | [phase-06-frontend-pages.md](./phase-06-frontend-pages.md) | 1.5h | Low | Phase 5 |
| 7 | [phase-07-testing.md](./phase-07-testing.md) | 2h | Medium | All |

**Total**: 13 hours

---

## Quick Start

### 1. Read Main Plan
```bash
cat plans/260114-2134-be-search-filter-migration/plan.md
```

### 2. Create Feature Branch
```bash
git checkout -b feature/be-search-filter-migration
```

### 3. Implement Sequentially
```bash
# Day 1: Backend
# Phase 1-3 (6h) → Deploy to staging → Verify indexes

# Day 2: Frontend
# Phase 4-6 (5h) → Integrate with BE

# Day 3: Testing & Deploy
# Phase 7 (2h) → Production deployment
```

---

## Critical Warnings

### ⚠️ Phase 3 MUST Deploy Before Phase 2

**Why**: Text search without indexes = COLLSCAN = catastrophic performance

**Deployment Order**:
1. ✅ Deploy Phase 3 (indexes)
2. ✅ Verify index creation (MongoDB shell)
3. ✅ Deploy Phase 2 (queries use indexes)

---

## Key Changes Summary

### Backend
- **DTOs**: Add `search`, `sortBy`, `sortOrder` params
- **Services**: MongoDB `$or` queries + dynamic sorting
- **Indexes**: 9 indexes (bookings), 6 indexes (contacts)

### Frontend
- **Services**: Accept query params, build query strings
- **Hooks**: Pass filters to BE, configure cache (30s stale, keepPreviousData)
- **Pages**: Remove `useMemo` filtering, add `isFetching` indicators

---

## Success Criteria

### Functional
- Search works across all text fields
- Sorting works for all defined fields
- Pagination works with filters
- Existing features unaffected

### Performance
- Search queries < 100ms (1000 docs)
- Indexes used (IXSCAN, not COLLSCAN)
- No N+1 queries

### UX
- Debounce prevents excessive API calls (300ms)
- Loading states smooth (no flicker)
- Previous data visible while fetching

---

## Rollback Strategy

### Backend
```bash
git revert <commit-hash>
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-api
```

### Frontend
```bash
git revert <commit-hash>
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-admin
```

---

## Testing Commands

### Backend
```bash
# Unit tests
cd apps/api && npm test

# Integration tests
npm run test:e2e

# Manual API test
curl "http://localhost:3000/bookings?search=john&status=pending&sortBy=date&sortOrder=desc"
```

### Frontend
```bash
# Type check
npm run type-check

# Build verification
npm run build

# Manual browser test
open http://localhost:5174/bookings
```

### MongoDB
```javascript
// Verify indexes
db.bookings.getIndexes()

// Check query performance
db.bookings.find({ $or: [...] }).explain("executionStats")
```

---

## Files Modified

### Backend (apps/api)
- `modules/bookings/dto/query-bookings.dto.ts`
- `modules/contacts/dto/query-contacts.dto.ts`
- `modules/bookings/bookings.service.ts`
- `modules/contacts/contacts.service.ts`
- `modules/bookings/schemas/booking.schema.ts`
- `modules/contacts/schemas/contact.schema.ts`

### Frontend (apps/admin)
- `services/bookings.service.ts`
- `services/contacts.service.ts`
- `hooks/api/useBookings.ts`
- `hooks/api/useContacts.ts`
- `pages/BookingsPage.tsx`
- `pages/ContactsPage.tsx`

---

## Open Questions

1. **Pagination UI**: Implement true pagination or keep fetch-all (limit=1000)?
   - Recommendation: Start fetch-all, add UI when data > 500

2. **Sort validation**: Restrict to enum fields or allow any?
   - Recommendation: Enum-only (prevents injection)

3. **Search case sensitivity**: Case-insensitive regex or configurable?
   - Recommendation: Case-insensitive (consistent with FE)

4. **Cache invalidation**: Invalidate all queries or specific filters?
   - Recommendation: Invalidate all (simpler, prevents stale)

---

## Documentation Updated

- [x] API endpoints doc (api-endpoints.md)
- [x] Implementation plan (plan.md)
- [x] Phase guides (phase-01 through phase-07)
- [ ] CHANGELOG.md (add after completion)

---

## Next Steps

1. Review plan with team
2. Resolve open questions
3. Begin Phase 1 (Backend DTOs)
4. Follow phase sequence strictly
5. Deploy Phase 3 before Phase 2
6. Test comprehensively (Phase 7)
7. Production deployment with monitoring

---

**Plan Location**: `plans/260114-2134-be-search-filter-migration/`
**Status**: 🔄 85% Complete (Phase 6 partial, Phase 7 in progress)
**Last Updated**: 2026-01-14 (Progress Report added)
**Detailed Progress**: See [PROGRESS-REPORT.md](./PROGRESS-REPORT.md)
