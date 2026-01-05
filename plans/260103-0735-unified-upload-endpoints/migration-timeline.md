# Migration Timeline & Strategy

**Total Duration**: 4 weeks (conservative approach)
**Approach**: Blue-Green Deployment (zero downtime)

---

## Week 1: API Implementation

### Day 1-2: Foundation (Phases 1)
- [ ] Create `MediaUploadPipe` and file validators
- [ ] Write unit tests
- [ ] Code review
- [ ] Merge to main

### Day 3: Banners Module (Phase 2)
- [ ] Update `POST /banners` endpoint
- [ ] Deprecate old endpoints (keep functional)
- [ ] Write integration tests
- [ ] Manual testing with cURL
- [ ] Code review
- [ ] Merge to main

### Day 4: Gallery & Services (Phases 3-4)
- [ ] Update `POST /gallery` endpoint
- [ ] Update `POST /services` endpoint
- [ ] Deprecate old endpoints
- [ ] Write integration tests
- [ ] Manual testing
- [ ] Code review
- [ ] Merge to main

### Day 5: API Deployment
- [ ] Deploy to dev environment
- [ ] Run full test suite
- [ ] Verify old endpoints still work
- [ ] Verify new endpoints work
- [ ] Update Swagger docs
- [ ] Deploy to staging (if applicable)

**End of Week 1**:
- ✅ All new API endpoints live
- ✅ Old endpoints deprecated but functional
- ✅ Zero breaking changes

---

## Week 2: Admin Frontend Implementation

### Day 1: Banners Component (Phase 5)
- [ ] Update `banners.service.ts`
- [ ] Update `BannerFormModal.tsx`
- [ ] Update `useBanners.ts`
- [ ] Manual testing (create image/video banners)
- [ ] Code review
- [ ] Merge to main

### Day 2: Gallery Component (Phase 6)
- [ ] Update `gallery.service.ts`
- [ ] Update `GalleryFormModal.tsx`
- [ ] Update `useGallery.ts`
- [ ] Manual testing
- [ ] Code review
- [ ] Merge to main

### Day 3: Services Component (Phase 7)
- [ ] Update `services.service.ts`
- [ ] Update `useServices.ts`
- [ ] Update service form (if exists)
- [ ] Manual testing
- [ ] Code review
- [ ] Merge to main

### Day 4-5: Admin Testing & Deployment
- [ ] Full regression testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Error handling verification
- [ ] Loading states verification
- [ ] Build and type-check
- [ ] Deploy to dev environment
- [ ] User acceptance testing (UAT)
- [ ] Fix any bugs found
- [ ] Deploy to staging

**End of Week 2**:
- ✅ Admin fully migrated to new endpoints
- ✅ All forms working correctly
- ✅ Old API endpoints still available (safety net)

---

## Week 3: Monitoring & Validation

### Day 1-7: Production Monitoring

**Monitor deprecated endpoint usage**:
```bash
# Check API logs for deprecated endpoint calls
grep "POST /banners/upload" api-logs.txt
grep "POST /gallery/upload" api-logs.txt
grep "POST /services/upload" api-logs.txt
```

**Track metrics**:
- [ ] Error rates (should be normal)
- [ ] Response times (should be unchanged)
- [ ] Success rates (should be >99%)
- [ ] Deprecated endpoint usage (should trend to 0)

**User feedback**:
- [ ] Check support tickets
- [ ] Monitor user reports
- [ ] Gather admin user feedback

**Daily checks**:
- Morning: Review overnight logs
- Afternoon: Check error dashboards
- Evening: Verify deprecated usage count

**End of Week 3 Decision**:
- If deprecated usage = 0 for 7 days → **Proceed to cleanup**
- If deprecated usage > 0 → **Investigate and extend monitoring**
- If production errors > 0 → **Rollback and fix**

---

## Week 4: Cleanup & Documentation

### Day 1: Code Cleanup (Phase 8.1)
- [ ] Verify zero deprecated endpoint usage
- [ ] Remove `uploadImage()` from banners controller
- [ ] Remove `uploadVideo()` from banners controller
- [ ] Remove `upload()` from gallery controller
- [ ] Remove `upload()` from services controller
- [ ] Code review
- [ ] Merge to main

### Day 2: Documentation (Phase 8.2-8.4)
- [ ] Update `docs/api-endpoints.md`
- [ ] Add cURL examples
- [ ] Create migration summary
- [ ] Update CHANGELOG
- [ ] Update README (if needed)

### Day 3: Final Testing (Phase 8.3)
- [ ] Run full test suite
- [ ] Type-check all apps
- [ ] Build all apps
- [ ] Integration tests
- [ ] Manual testing
- [ ] Regression testing

### Day 4: Production Deployment
- [ ] Deploy API to production
- [ ] Verify deployment successful
- [ ] Monitor for 24 hours
- [ ] Deploy Admin to production
- [ ] Verify deployment successful
- [ ] Full smoke testing

### Day 5: Post-Deployment
- [ ] Monitor production (24 hours)
- [ ] Verify zero errors
- [ ] Gather final user feedback
- [ ] Close implementation tickets
- [ ] Team retrospective
- [ ] Document lessons learned

**End of Week 4**:
- ✅ Deprecated endpoints removed
- ✅ Documentation complete
- ✅ Production stable
- ✅ Migration complete

---

## Rollback Strategy

### If Issues in Week 1 (API)
**Symptoms**: New endpoints broken, tests failing

**Action**:
1. Revert git commits
2. Redeploy previous API version
3. Fix issues in separate branch
4. Re-test thoroughly
5. Retry deployment

**Impact**: Low (frontend not yet changed)

### If Issues in Week 2 (Admin)
**Symptoms**: Admin forms broken, file uploads failing

**Action**:
1. Revert admin code to previous version
2. Old API endpoints still functional
3. Fix frontend issues
4. Re-test
5. Re-deploy

**Impact**: Low (old endpoints still available)

### If Issues in Week 3 (Monitoring)
**Symptoms**: Production errors, user complaints

**Action**:
1. Keep both old and new endpoints active
2. Investigate root cause
3. Fix issues
4. Extend monitoring period
5. Don't proceed to cleanup until stable

**Impact**: None (both endpoints available)

### If Critical Issues in Week 4 (Cleanup)
**Symptoms**: Production down after removing old endpoints

**Action** (Emergency):
1. Immediately revert cleanup commit
2. Redeploy with old endpoints restored
3. Investigate why they were still needed
4. Fix issues
5. Re-verify zero usage before retry

**Impact**: Medium (requires emergency deployment)

---

## Success Criteria

### Week 1 Success
- [ ] All new API endpoints functional
- [ ] Old endpoints still work
- [ ] All tests pass
- [ ] Swagger docs updated

### Week 2 Success
- [ ] Admin fully migrated
- [ ] All forms work correctly
- [ ] No console errors
- [ ] Build passes

### Week 3 Success
- [ ] Zero deprecated endpoint usage
- [ ] No production errors
- [ ] Positive user feedback
- [ ] Metrics normal

### Week 4 Success
- [ ] Deprecated endpoints removed
- [ ] Documentation complete
- [ ] Production stable
- [ ] Zero errors

---

## Risk Mitigation

### Technical Risks
- **File upload failures**: Keep old endpoints during migration
- **Frontend bugs**: Extensive testing before deployment
- **API errors**: Comprehensive integration tests

### Process Risks
- **Rushed deployment**: Conservative 4-week timeline
- **Insufficient testing**: Manual + automated testing
- **Poor communication**: Weekly status updates

### Business Risks
- **User disruption**: Zero-downtime deployment strategy
- **Data loss**: No schema changes, only endpoint changes
- **Rollback needed**: Clear rollback procedures documented

---

## Communication Plan

### Week 1
**Stakeholders**: Dev team, QA
**Message**: "New API endpoints implemented, old ones still available"

### Week 2
**Stakeholders**: Admin users, QA
**Message**: "Admin dashboard updated, please report any issues"

### Week 3
**Stakeholders**: All teams
**Message**: "Monitoring period, no changes expected"

### Week 4
**Stakeholders**: All teams
**Message**: "Migration complete, old endpoints removed"

---

## Monitoring Dashboard

**Key Metrics to Track**:
```
Deprecated Endpoint Usage (Week 3):
- POST /banners/upload/image: [count/day]
- POST /banners/upload/video: [count/day]
- POST /gallery/upload: [count/day]
- POST /services/upload: [count/day]
Target: 0 calls/day before cleanup

Error Rates:
- New endpoints: [errors/requests]
- Target: <0.1%

Response Times:
- POST /banners: [avg ms]
- POST /gallery: [avg ms]
- POST /services: [avg ms]
- Target: <500ms p95

Upload Success Rates:
- Image uploads: [success %]
- Video uploads: [success %]
- Target: >99.9%
```

---

**Total Timeline**: 4 weeks
**Approach**: Conservative, low-risk
**Rollback**: Available at every stage
