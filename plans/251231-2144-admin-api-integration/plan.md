# Implementation Plan: Admin API Integration

**Date**: 2025-12-31
**Status**: Ready for Implementation
**Complexity**: Medium
**Estimated Effort**: 12-16 tasks

---

## Objective

Replace mock data implementation with real NestJS API integration in admin dashboard while maintaining zero breaking changes to UI layer.

---

## Context

Admin app currently operates in dual mode (mock/API) controlled by `VITE_USE_MOCK_API`. All 9 service classes have API endpoint scaffolding but lack JWT authentication, proper error handling, and one service module is missing entirely. This plan removes mock mode and implements production-ready API integration.

---

## Prerequisites

### Running Services Required
- ✅ API backend on localhost:3000
- ✅ MongoDB connected
- ✅ Redis connected
- ✅ Cloudinary configured
- ✅ Test admin user in database

### Knowledge Required
- Fetch API / HTTP clients
- JWT authentication flow
- React state management (Zustand)
- TypeScript generics
- Error handling patterns

---

## Implementation Phases

See detailed phase files:
- `phase-01-foundation.md` - API client infrastructure
- `phase-02-authentication.md` - JWT auth flow
- `phase-03-core-services.md` - Service layer updates
- `phase-04-media-upload.md` - Image upload migration
- `phase-05-cleanup.md` - Remove mock code

---

## Task Breakdown

### Phase 1: Foundation (Critical Path)
**Priority**: P0 | **Blockers**: None

1. **Create API Client** (`lib/apiClient.ts`)
   - Singleton fetch wrapper
   - Auto JWT header injection
   - Base URL configuration
   - Generic request methods (get, post, patch, delete)
   - File upload support

2. **Create Error Handler** (`lib/apiError.ts`)
   - ApiError class extending Error
   - HTTP status code mapping
   - Error response parsing
   - User-friendly messages

3. **Update Auth Store** (`store/authStore.ts`)
   - Add refreshToken to state
   - Add token refresh logic
   - Add token expiry tracking
   - Update login/logout actions

**Validation**:
- TypeScript compiles
- ApiClient instantiates correctly
- Error handling catches all cases

---

### Phase 2: Authentication
**Priority**: P0 | **Blockers**: Phase 1 complete

4. **Update Auth Service** (`services/auth.service.ts`)
   - Remove mock login
   - Implement real API login via apiClient
   - Map API response to app types
   - Implement token refresh
   - Implement logout API call
   - Remove token validation (API handles)

**Validation**:
- Login successful with test credentials
- Tokens stored in localStorage
- AuthStore updated correctly
- Logout clears tokens

---

### Phase 3: Core Services (Can Run in Parallel)
**Priority**: P1 | **Blockers**: Phase 2 complete

5. **Create Services Service** (`services/services.service.ts`)
   - NEW FILE - matching pattern of other services
   - Methods: getAll, getById, create, update, delete, toggleFeatured, getByCategory
   - Use apiClient for all requests
   - Type-safe with @repo/types Service

6. **Update Gallery Service** (`services/gallery.service.ts`)
   - Remove useMockApi logic
   - Remove Zustand store imports
   - Replace fetch with apiClient
   - Keep method signatures unchanged

7. **Update Bookings Service** (`services/bookings.service.ts`)
   - Remove useMockApi logic
   - Remove Zustand store imports
   - Replace fetch with apiClient
   - Keep method signatures unchanged

8. **Update Banners Service** (`services/banners.service.ts`)
   - Remove useMockApi logic
   - Remove Zustand store imports
   - Replace fetch with apiClient
   - Keep method signatures unchanged

9. **Update Contacts Service** (`services/contacts.service.ts`)
   - Remove useMockApi logic
   - Remove Zustand store imports
   - Replace fetch with apiClient
   - Keep method signatures unchanged

10. **Update Business Info Service** (`services/businessInfo.service.ts`)
    - Remove useMockApi logic
    - Remove Zustand store imports
    - Replace fetch with apiClient
    - Keep method signatures unchanged

11. **Update Hero Settings Service** (`services/heroSettings.service.ts`)
    - Remove useMockApi logic
    - Remove Zustand store imports
    - Replace fetch with apiClient
    - Keep method signatures unchanged

**Validation** (Per Service):
- Page loads without errors
- Data fetches from API
- CRUD operations work
- TypeScript compiles

---

### Phase 4: Media Upload
**Priority**: P2 | **Blockers**: Phase 3 complete

12. **Update Image Upload Service** (`services/imageUpload.service.ts`)
    - Remove Firebase imports
    - Use apiClient.upload() method
    - Update uploadImage to POST /storage/upload
    - Update uploadMultiple for batch
    - Keep progress callback support
    - Remove deleteImage (handle via entity delete)

**Validation**:
- Image upload works in gallery
- Image upload works in banners
- Image upload works in services
- Progress indicator displays

---

### Phase 5: Cleanup
**Priority**: P3 | **Blockers**: Phases 1-4 complete

13. **Remove Mock Infrastructure**
    - Delete mock data files (data/mockXxx.ts)
    - Remove mock actions from Zustand stores
    - Remove Firebase config (lib/firebase.ts)
    - Update .env.example (remove VITE_USE_MOCK_API)

14. **Documentation Updates**
    - Update README deployment steps
    - Document API connection requirements
    - Add troubleshooting section
    - Update environment setup guide

15. **Final Testing**
    - Complete E2E testing checklist
    - Test all CRUD operations
    - Test error scenarios
    - Test token refresh
    - Test rate limiting
    - Performance check

**Validation**:
- All pages functional
- No console errors
- No TypeScript errors
- Bundle size reduced
- No dead code warnings

---

## Code Patterns

### API Client Usage
```typescript
// Before (in service)
if (this.useMockApi) {
  return useXxxStore.getState().items
}
const response = await fetch("/api/xxx")
if (!response.ok) throw new Error("Failed")
return response.json()

// After (in service)
return this.apiClient.get<Xxx[]>("/xxx")
```

### Error Handling
```typescript
// In UI components
try {
  await service.create(data)
  toast.success("Created successfully")
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message)
  }
}
```

### Auth Headers (Automatic)
```typescript
// apiClient automatically adds:
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

## File Changes Summary

### New Files (4)
- `apps/admin/src/lib/apiClient.ts`
- `apps/admin/src/lib/apiError.ts`
- `apps/admin/src/services/services.service.ts`
- `apps/admin/src/types/api.types.ts` (optional - shared API types)

### Modified Files (9)
- `apps/admin/src/store/authStore.ts`
- `apps/admin/src/services/auth.service.ts`
- `apps/admin/src/services/gallery.service.ts`
- `apps/admin/src/services/bookings.service.ts`
- `apps/admin/src/services/banners.service.ts`
- `apps/admin/src/services/contacts.service.ts`
- `apps/admin/src/services/businessInfo.service.ts`
- `apps/admin/src/services/heroSettings.service.ts`
- `apps/admin/src/services/imageUpload.service.ts`

### Deleted Files (Phase 5)
- `apps/admin/src/lib/firebase.ts`
- `apps/admin/src/data/mockContacts.ts`
- Other mock data files

---

## Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error shown)
- [ ] Token stored in localStorage
- [ ] Token auto-refresh before expiry
- [ ] Token refresh on 401 response
- [ ] Logout clears tokens
- [ ] Rate limiting (5 attempts) handled

### Services CRUD (Repeat for each module)
- [ ] List all items (GET /xxx)
- [ ] Get single item (GET /xxx/:id)
- [ ] Create item (POST /xxx)
- [ ] Update item (PATCH /xxx/:id)
- [ ] Delete item (DELETE /xxx/:id)
- [ ] Specialized operations (toggle, reorder, etc.)

### Image Upload
- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Progress indicator shows
- [ ] Error handling on upload fail
- [ ] Large file rejection (>10MB)

### Error Handling
- [ ] 400 Bad Request - validation errors shown
- [ ] 401 Unauthorized - auto-refresh or logout
- [ ] 404 Not Found - graceful handling
- [ ] 429 Rate Limited - retry message
- [ ] 500 Server Error - generic error message
- [ ] Network error - offline message

### Performance
- [ ] Initial page load < 2s
- [ ] API responses < 500ms
- [ ] No memory leaks
- [ ] Bundle size reduced from Firebase removal

---

## Rollback Plan

### If Critical Issues Found

**Step 1**: Revert service layer changes
```bash
git revert <commit-hash>
```

**Step 2**: Re-enable mock mode (temporary)
```typescript
// In each service
private useMockApi = true // Force mock mode
```

**Step 3**: Investigate + Fix + Redeploy

### Safe Deployment Strategy
1. Merge to dev branch
2. Test thoroughly in dev environment
3. Deploy to staging
4. Monitor for 24 hours
5. Deploy to production
6. Keep rollback window for 7 days

---

## Environment Setup

### Development
```bash
# apps/admin/.env
VITE_API_BASE_URL=http://localhost:3000
```

### Production
```bash
# apps/admin/.env.production
VITE_API_BASE_URL=/api
```

**Note**: Nginx proxy routes `/api/*` to backend

---

## Dependencies

### Install
None (using native fetch)

### Remove (Phase 5)
```bash
npm uninstall firebase
```

### Keep
All existing dependencies

---

## Performance Targets

- **Bundle size**: Reduce by ~150KB (Firebase removal)
- **API response**: < 500ms per request
- **Page load**: < 2s initial load
- **Token refresh**: Transparent to user (< 200ms)

---

## Security Checklist

- [ ] Tokens not logged to console
- [ ] HTTPS enforced in production
- [ ] CORS configured correctly
- [ ] Rate limiting respected
- [ ] Error messages don't leak sensitive info
- [ ] No credentials in source code

---

## Success Criteria

1. All admin pages load real data from API
2. Authentication flow complete (login → token → auto-refresh → logout)
3. CRUD operations work on all modules
4. Image uploads via Cloudinary
5. Error handling graceful and user-friendly
6. Zero TypeScript errors
7. Zero breaking changes to UI components
8. Bundle size reduced
9. All tests pass

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API endpoint mismatch | High | Low | Validate all endpoints before implementation |
| Token refresh loop | High | Medium | Implement retry limit + exponential backoff |
| Type mismatches | Medium | Low | Runtime validation in apiClient |
| CORS issues | Medium | Medium | Test CORS config early |
| Performance degradation | Low | Low | Monitor response times |

---

## Timeline

- **Phase 1-2**: 2-3 hours (foundation + auth)
- **Phase 3**: 4-5 hours (7 services)
- **Phase 4**: 1-2 hours (image upload)
- **Phase 5**: 1-2 hours (cleanup + testing)

**Total**: 8-12 hours of focused development

---

## Next Steps

1. Review this plan with team
2. Ensure API backend is ready
3. Create test admin user
4. Begin Phase 1 implementation
5. Test incrementally after each phase

---

## Questions for Resolution

1. ❓ **Token storage**: Keep localStorage or migrate to httpOnly cookies?
   - **Recommendation**: Keep localStorage for now, add CSP headers

2. ❓ **Error notifications**: Use existing toast system or implement new?
   - **Recommendation**: Use existing toast (check if already exists)

3. ❓ **Offline mode**: Should admin cache data for offline use?
   - **Recommendation**: No - admin requires real-time data

4. ❓ **API client library**: Use fetch or add axios/ky?
   - **Recommendation**: Native fetch (zero dependencies)

5. ❓ **Type generation**: Generate types from OpenAPI spec?
   - **Recommendation**: Manual for now, consider future automation

---

**Plan Status**: ✅ Complete
**Implementation Ready**: ✅ Yes
**Approval Required**: Yes (from team lead)

---

## Reference Documents

- Scout Report: `scout/01-current-state-analysis.md`
- Solution Design: `reports/01-solution-design.md`
- API Documentation: `/docs/api-endpoints.md`
- Type System: `/docs/shared-types.md`
