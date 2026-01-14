# Action Items - Backend Search/Filter Migration

**Priority**: HIGH (Complete to maintain project momentum)
**Timeline**: Complete within 48 hours
**Current Progress**: 85% (6/7 phases complete)

---

## IMMEDIATE ACTIONS (Complete Today)

### 1. Fix BookingsPage (Phase 6) - BLOCKING
**Priority**: CRITICAL
**Effort**: 30 minutes
**Owner**: Main Agent / Backend Developer
**File**: `/Users/hainguyen/Documents/nail-project/apps/admin/src/pages/BookingsPage.tsx`

**Current Issue**:
BookingsPage still uses old client-side filtering pattern with useMemo. This prevents Phase 6 from being 100% complete.

**Action Steps**:
1. Open BookingsPage.tsx (current code has useMemo filtering)
2. Reference ContactsPage.tsx (correct backend filtering pattern)
3. Remove lines 66-87 (useMemo filtering block)
4. Update useBookings() call to pass filters:
   ```typescript
   const { data: response, isFetching } = useBookings({
     status: activeStatus === "all" ? undefined : activeStatus,
     search: debouncedSearch || undefined,
     sortBy: 'date',
     sortOrder: 'desc',
     limit: 10,
   });
   ```
5. Add isFetching indicator (copy from ContactsPage line 139-141)
6. Keep statusCounts calculation (acceptable for UI state)
7. Run: `npm run type-check` (must pass)
8. Run: `npm run build` (must pass)

**Expected Result**: Phase 6 = 100% COMPLETE

**Acceptance Criteria**:
- [ ] No useMemo filtering (lines removed)
- [ ] Filters passed to useBookings() hook
- [ ] isFetching indicator displays during API calls
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] No console errors

---

### 2. Verify Phase 7 Testing - IN PROGRESS
**Priority**: HIGH
**Effort**: 1-1.5 hours
**Owner**: Tester Agent + Code-Reviewer Agent
**Status**: Currently assigned, awaiting completion

**Required Validations**:
- [ ] Backend unit tests pass (DTOs, services)
- [ ] Backend integration tests pass (endpoints)
- [ ] Manual API testing completed (search, sort, filters)
- [ ] Frontend hook tests pass (cache, debounce)
- [ ] Edge cases handled (special chars, long strings, invalid params)
- [ ] Regression tests pass (existing features unaffected)
- [ ] Performance validation (< 100ms target confirmed)

**Tester Checklist**:
```bash
# Type checking
npm run type-check  # Should: PASS

# Build
npm run build  # Should: PASS (7s full)

# Backend tests
cd apps/api && npm test  # Should: All pass

# Backend E2E
npm run test:e2e  # Should: All pass

# Manual API testing
curl "http://localhost:3000/bookings?search=john&status=pending&sortBy=date&sortOrder=desc"
curl "http://localhost:3000/contacts?search=inquiry&sortBy=createdAt&sortOrder=desc"

# MongoDB verification
# In MongoDB shell:
db.bookings.getIndexes()  # Should: Show 13 indexes
db.bookings.find({ $or: [...] }).explain("executionStats")  # Should: IXSCAN stage
```

**Code-Reviewer Checklist**:
- [ ] Security: Regex escaping verified
- [ ] Type Safety: No `any` types found
- [ ] Performance: Index strategy sound
- [ ] Architecture: Clean separation of concerns
- [ ] Documentation: Code comments clear
- [ ] Standards: Follows project code-standards.md

---

### 3. Collect Feedback & Prepare for Code Review
**Priority**: HIGH
**Effort**: 30 minutes
**Owner**: Main Agent
**Status**: Pending Phase 7 completion

**Tasks**:
1. Collect all test results from tester agent
2. Collect code review feedback from code-reviewer agent
3. Compile issues and action items
4. Create PR with all changes
5. Document any deviations from plan
6. Prepare rollback procedure

---

## SHORT-TERM ACTIONS (Next 24-48 Hours)

### 4. Code Review & Approval
**Priority**: HIGH
**Effort**: 1-2 hours
**Owner**: Team Lead / Code Reviewer

**Approval Checklist**:
- [ ] Type checking passes (npm run type-check)
- [ ] Build succeeds (npm run build)
- [ ] All tests pass (Phase 7)
- [ ] Security review complete
- [ ] Code quality acceptable
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Rollback procedure documented

**Required Before Approval**:
- Create PR with all changes
- Add detailed PR description (reference PROGRESS-REPORT.md)
- Link to implementation plan
- Include test results
- Document any deviations

---

### 5. Deploy to Staging
**Priority**: HIGH
**Effort**: 30 minutes (setup) + 1 hour (validation)
**Owner**: DevOps / Main Agent

**Pre-Deployment Checklist**:
- [ ] Phase 3 (indexes) PR approved
- [ ] Phase 1-2 (backend) PR approved
- [ ] Phase 4-6 (frontend) PR approved
- [ ] All tests passing
- [ ] MongoDB staging replica ready
- [ ] Staging API accessible

**Deployment Steps**:
1. **Deploy Phase 3 (Indexes) FIRST**
   ```bash
   git checkout feature/be-search-filter-migration
   git merge main  # or cherry-pick index commit
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-api
   ```

2. **Wait 5 minutes for index creation**

3. **Verify indexes in staging MongoDB**
   ```javascript
   db.bookings.getIndexes();  // Should show 13 indexes
   ```

4. **Deploy Phase 1-2 (Backend)**
   ```bash
   git checkout feature/be-search-filter-migration
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-api
   ```

5. **Deploy Phase 4-6 (Frontend)**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-admin
   ```

6. **Smoke Tests**
   ```bash
   # Test search
   curl -H "Authorization: Bearer <token>" "http://staging-api/bookings?search=john"

   # Test sorting
   curl -H "Authorization: Bearer <token>" "http://staging-api/bookings?sortBy=date&sortOrder=desc"

   # Test combined filters
   curl -H "Authorization: Bearer <token>" "http://staging-api/bookings?status=pending&search=john&sortBy=date"

   # Open admin panel
   open http://staging-admin/bookings
   # Manually test: search, sort, filter, cache behavior
   ```

---

### 6. Production Deployment
**Priority**: HIGH
**Effort**: 1 hour (setup) + 2 hours (validation)
**Owner**: DevOps / Main Agent
**Timeline**: After 24h staging validation

**Pre-Production Checklist**:
- [ ] Staging validation complete (24h testing)
- [ ] Zero regressions found
- [ ] Performance targets met (< 100ms)
- [ ] Rollback procedure tested
- [ ] Monitoring alerts configured
- [ ] Support team notified

**Deployment Steps** (Same as staging, with production targets):
1. Deploy Phase 3 (indexes) first
2. Wait 5 minutes for creation
3. Verify index creation
4. Deploy Phase 1-2 (backend)
5. Deploy Phase 4-6 (frontend)
6. Run smoke tests
7. Monitor metrics for 24h

**Post-Deployment Monitoring** (First 24 Hours):
- [ ] MongoDB slow query log < 100ms
- [ ] API error rate stable (< 0.1%)
- [ ] Cache hit rate > 50%
- [ ] User feedback positive
- [ ] No critical issues reported

---

## DOCUMENTATION TASKS

### 7. Update CHANGELOG
**Priority**: MEDIUM
**Effort**: 30 minutes
**Owner**: Main Agent
**File**: `/Users/hainguyen/Documents/nail-project/CHANGELOG.md`

**Entry Template**:
```markdown
## [0.2.0] - 2026-01-14

### Added
- Backend search/filter migration for Bookings and Contacts
  - Full-text search across customer info fields (name, email, phone)
  - Dynamic sorting by date, createdAt, and customerName
  - 13 MongoDB indexes for performance optimization
  - React Query caching with 30s staleTime and keepPreviousData
  - 300ms debounce on search inputs
  - Backward compatible API (search/sort params optional)

### Changed
- ContactsPage refactored to use backend filtering
- BookingsPage refactored to use backend filtering
- Frontend services now build query strings instead of filtering
- React Query hooks configured with proper cache keys

### Performance
- Search queries complete < 100ms (with 13 MongoDB indexes)
- Reduced client-side processing with backend filtering
- Improved cache hit rates (30s fresh data + keepPreviousData)
- Prevented excessive API calls (300ms debounce)

### Technical
- Added QueryBookingsDto and QueryContactsDto
- Implemented regex-based text search with ReDoS prevention
- Created compound indexes for filter+sort combinations
- Enhanced type safety with enum validation

### Notes
- Hybrid approach: Bookings/Contacts migrated (high data volume)
- Gallery/Services remain FE-filtered (low data volume, instant UX)
- YAGNI principle applied throughout
```

---

### 8. Create Deployment Guide
**Priority**: MEDIUM
**Effort**: 30 minutes
**Owner**: Main Agent
**File**: Create `plans/260114-2134-be-search-filter-migration/DEPLOYMENT-GUIDE.md`

**Contents**:
- Pre-deployment checklist
- Step-by-step deployment instructions
- Verification procedures
- Rollback procedures
- Monitoring checklist
- Support contact information

---

## QUALITY ASSURANCE

### 9. Final Validation Checklist
**Priority**: HIGH
**Effort**: 30 minutes
**Owner**: QA Lead / Main Agent

**Pre-Production Sign-Off**:
- [ ] All phases 100% complete
- [ ] All tests passing
- [ ] Zero critical issues
- [ ] Performance verified (< 100ms)
- [ ] Security audit complete
- [ ] Documentation complete
- [ ] Rollback procedure tested
- [ ] Team trained on changes
- [ ] Monitoring configured
- [ ] Support team briefed

---

## RISK MANAGEMENT

### 10. Prepare Rollback Plan
**Priority**: HIGH
**Effort**: 30 minutes
**Owner**: DevOps / Main Agent

**Rollback Procedures**:

**If Backend Issues**:
```bash
# Identify problematic commit
git log --oneline | head -20

# Revert changes
git revert <commit-hash>

# Rebuild and redeploy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-api

# Verify old behavior restored
curl "http://localhost:3000/bookings"
```

**If Frontend Issues**:
```bash
# Revert changes
git revert <commit-hash>

# Rebuild and redeploy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nail-admin

# Verify old behavior restored
open http://localhost:5174/bookings
```

**If Index Issues**:
```bash
# Drop problematic indexes (carefully)
db.bookings.dropIndex("status_1_date_-1")

# Rebuild indexes
# Redeploy Phase 3 with corrected indexes
```

**Fallback**: Both frontend and backend are backward compatible, so rollback is low-risk.

---

## SUCCESS CRITERIA

### Phase 6 Completion
- [x] ContactsPage migrated to backend filtering
- [ ] BookingsPage migrated to backend filtering
- [ ] isFetching indicators present
- [ ] Type checking passes
- [ ] Build succeeds

### Phase 7 Completion
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual testing completed
- [ ] Edge cases handled
- [ ] Regressions checked
- [ ] Performance validated

### Staging Validation (24h)
- [ ] Zero regressions in staging
- [ ] Indexes performing as expected
- [ ] Search/sort functionality verified
- [ ] Cache behavior correct
- [ ] User feedback positive

### Production Deployment
- [ ] 24h post-deployment monitoring clean
- [ ] No critical issues reported
- [ ] Performance targets maintained
- [ ] User experience smooth
- [ ] Support team confidence high

---

## HANDOFF CHECKLIST

**Before handing off to operations**:
- [ ] PROGRESS-REPORT.md reviewed and approved
- [ ] EXECUTIVE-SUMMARY.md shared with stakeholders
- [ ] All code reviewed and approved
- [ ] All tests passing
- [ ] Documentation complete and current
- [ ] Rollback procedures tested
- [ ] Monitoring configured
- [ ] Team trained
- [ ] Support ready

---

## TIMELINE SUMMARY

| Task | Duration | When | Owner |
|------|----------|------|-------|
| Fix BookingsPage | 30 min | Today | Main Agent |
| Complete Phase 7 Testing | 1-1.5h | Today | Tester + Reviewer |
| Code Review & Approval | 1-2h | Today-Tomorrow | Team Lead |
| Deploy to Staging | 1.5h | Tomorrow | DevOps |
| Staging Validation | 24h | Tomorrow-Next day | QA |
| Production Deployment | 1h | Next day | DevOps |
| Post-Deployment Monitoring | 24h | Next day | Operations |

**Total Critical Path**: 2-3 hours immediate work, then 24-48h for staging/production

---

## CONTACT & ESCALATION

**Questions or Blockers**:
1. Primary: Main Agent (Orchestrator)
2. Backend Issues: Backend Developer
3. Frontend Issues: Frontend Developer
4. Testing Issues: Tester Agent
5. Code Review Issues: Code-Reviewer Agent
6. DevOps Issues: DevOps/Deployment Team

---

**Last Updated**: 2026-01-14
**Status**: Ready for execution
**Priority**: HIGH - Complete to unblock production deployment
