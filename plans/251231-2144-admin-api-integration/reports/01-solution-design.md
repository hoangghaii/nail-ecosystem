# Solution Design: Admin API Integration

**Date**: 2025-12-31
**Scope**: API integration architecture for admin dashboard

---

## Overview

Replace mock data with real NestJS API calls using centralized HTTP client, JWT auth, type-safe error handling, and zero breaking changes to UI layer.

---

## Architecture

### Layered Approach

```
UI Components (React)
    ↓
Zustand Stores (State)
    ↓
Service Layer (Business Logic) ← UPDATE HERE
    ↓
API Client (HTTP) ← NEW
    ↓
NestJS Backend
```

**Principle**: Only modify service layer + add API client. Zero UI changes.

---

## Core Components

### 1. API Client (`lib/apiClient.ts`)

Centralized fetch wrapper with:
- Base URL configuration
- Auto JWT header injection
- Token refresh on 401
- Error response parsing
- Request/response interceptors

```typescript
class ApiClient {
  private baseUrl: string
  private getAuthToken: () => string | null

  async request<T>(endpoint: string, options?: RequestInit): Promise<T>
  async get<T>(endpoint: string): Promise<T>
  async post<T>(endpoint: string, body: unknown): Promise<T>
  async patch<T>(endpoint: string, body: unknown): Promise<T>
  async delete<T>(endpoint: string): Promise<T>
}
```

**Key Features**:
- Singleton pattern
- Auto-retry on token refresh
- Typed responses
- Error standardization

---

### 2. Error Handling

#### API Error Type
```typescript
class ApiError extends Error {
  statusCode: number
  errors?: string[]

  static from(response: Response, body?: unknown): ApiError
}
```

#### Error Categories
- **400**: Validation errors → Show field errors
- **401**: Unauthorized → Refresh token or logout
- **403**: Forbidden → Show permission error
- **404**: Not found → Handle gracefully
- **429**: Rate limited → Show retry message
- **500**: Server error → Generic error message

---

### 3. Authentication Flow

```
Login → API (/auth/login)
  ↓
Receive { accessToken, refreshToken, admin }
  ↓
Store tokens (localStorage)
  ↓
Update authStore (user, isAuthenticated)
  ↓
All requests include: Authorization: Bearer {accessToken}
  ↓
On 401 → POST /auth/refresh with refreshToken
  ↓
If refresh succeeds → Retry original request
  ↓
If refresh fails → Logout user
```

**Token Storage**:
- Keep localStorage (existing pattern)
- Mitigate XSS with CSP headers
- Consider httpOnly cookies in future iteration

---

### 4. Service Layer Updates

#### Pattern (All Services)

```typescript
export class XxxService {
  private apiClient = apiClient // Use singleton

  async getAll(): Promise<Xxx[]> {
    // Remove: if (this.useMockApi) { ... }
    return this.apiClient.get<Xxx[]>('/xxx')
  }

  async create(data: CreateXxxDto): Promise<Xxx> {
    return this.apiClient.post<Xxx>('/xxx', data)
  }

  async update(id: string, data: UpdateXxxDto): Promise<Xxx> {
    return this.apiClient.patch<Xxx>(`/xxx/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    return this.apiClient.delete<void>(`/xxx/${id}`)
  }
}
```

**Changes**:
1. Remove `useMockApi` checks
2. Remove Zustand store imports (except auth)
3. Use apiClient for all requests
4. Keep method signatures (UI compatibility)

---

### 5. Image Upload Migration

#### Current: Firebase
```typescript
imageUploadService.uploadImage(file, folder) → Firebase URL
```

#### New: API (Cloudinary)
```typescript
apiClient.upload(file, folder) → Cloudinary URL via /storage/upload
```

**Implementation**:
```typescript
class ApiClient {
  async upload(file: File, folder: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const { url } = await this.post<{ url: string }>('/storage/upload', formData)
    return url
  }
}
```

**Migration Path**: Update imageUpload.service.ts to use apiClient.upload

---

## Implementation Phases

### Phase 1: Foundation (Critical Path)
**Files**: 2 new, 1 update
1. Create `lib/apiClient.ts` (HTTP client)
2. Create `lib/apiError.ts` (Error handling)
3. Update `store/authStore.ts` (Refresh token support)

**Validation**: Unit tests for apiClient

---

### Phase 2: Authentication
**Files**: 1 update
4. Update `services/auth.service.ts` (JWT flow)

**Validation**: Login → Logout flow works

---

### Phase 3: Core Services (Parallel)
**Files**: 6 updates, 1 new
5. Update `services/gallery.service.ts`
6. Update `services/bookings.service.ts`
7. Update `services/banners.service.ts`
8. Update `services/contacts.service.ts`
9. Update `services/businessInfo.service.ts`
10. Update `services/heroSettings.service.ts`
11. **NEW** `services/services.service.ts`

**Validation**: Each page loads real data

---

### Phase 4: Media Upload
**Files**: 1 update
12. Update `services/imageUpload.service.ts` (Switch to API)

**Validation**: Image upload works in all modules

---

### Phase 5: Cleanup
**Files**: Multiple
13. Remove mock data files
14. Remove Zustand store mock actions
15. Update .env.example
16. Test full application flow

---

## Type Safety Strategy

### Shared Types (@repo/types)
Use for cross-app entities:
- ✅ Service
- ✅ Gallery
- ✅ Booking
- ✅ Auth (User)

### Local Types (apps/admin/src/types)
Keep for admin-only:
- ✅ Banner
- ✅ Contact
- ✅ BusinessInfo
- ✅ HeroSettings

**No changes needed** - type system already correct

---

## Error Handling Strategy

### Service Layer
```typescript
// Before
if (!response.ok) throw new Error("Failed")

// After
// apiClient handles errors automatically
// Throws ApiError with status + details
```

### UI Layer (Stores/Components)
```typescript
try {
  const data = await service.getAll()
  store.setState({ data, error: null })
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      // Auth error - handled by apiClient
    } else if (error.statusCode === 404) {
      store.setState({ data: [], error: null })
    } else {
      store.setState({ error: error.message })
      toast.error(error.message)
    }
  }
}
```

**UI Impact**: Add error handling in components (already partially exists)

---

## Configuration

### Environment Variables

```bash
# .env (development)
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=/api
```

**Remove**: `VITE_USE_MOCK_API` (no longer needed)

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Login with real credentials
- [ ] Token refresh on expiry
- [ ] CRUD operations (all modules)
- [ ] Image upload
- [ ] Error handling (400, 401, 404, 500)
- [ ] Rate limiting (429)
- [ ] Logout
- [ ] Token expiry → auto-logout

### API Requirements
- Backend running on :3000
- MongoDB connected
- Redis connected (sessions)
- Cloudinary configured
- Test admin user created

---

## Rollback Strategy

### Feature Flag (Temporary)
Keep mock mode during transition:
```typescript
const USE_API = import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_USE_MOCK_API
```

### Gradual Migration
1. Deploy with mock mode ON
2. Test API mode in dev
3. Enable API mode in staging
4. Monitor for 24hrs
5. Enable in production
6. Remove mock code after 1 week

---

## Performance Considerations

### Caching Strategy
- None initially (API has no cache headers)
- Future: Add React Query for caching + optimistic updates

### Request Optimization
- Pagination (API supports via QueryDto)
- Debounce search inputs
- Batch operations where available

### Bundle Size
- Remove Firebase SDK (~150KB)
- Add minimal fetch wrapper (~2KB)
- **Net savings**: ~148KB

---

## Security Enhancements

### Current Risks
1. Tokens in localStorage (XSS vulnerable)
2. No CSRF protection
3. No request signing

### Mitigations (Immediate)
1. Add CSP headers (prevent XSS)
2. HTTPS only (prevent MITM)
3. Short token expiry + refresh

### Future Improvements
1. HttpOnly cookies for refresh token
2. CSRF tokens
3. Request signing

---

## Breaking Changes

**None** - All changes internal to service layer

### API Response Adaptation
```typescript
// Auth response mapping
const apiResponse = { accessToken, refreshToken, admin }
const appResponse = { token: accessToken, user: admin, expiresAt: ... }
```

Adapters in service layer preserve existing contracts.

---

## Dependencies

### New
None - using native fetch

### Removed (Post-cleanup)
- Firebase (~150KB)
- Mock data files

### Updated
None

---

## Success Criteria

1. ✅ All pages load real data from API
2. ✅ Authentication works (login → token → logout)
3. ✅ CRUD operations functional on all modules
4. ✅ Image upload via API/Cloudinary
5. ✅ Error handling graceful
6. ✅ No breaking changes to UI
7. ✅ Bundle size reduced
8. ✅ Zero TypeScript errors

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API downtime | Low | High | Keep mock mode as fallback |
| Token issues | Medium | High | Test refresh flow thoroughly |
| Type mismatches | Low | Medium | Validate responses at runtime |
| CORS errors | Medium | Medium | Configure API CORS for admin origin |
| Rate limiting | Low | Low | Handle 429, show user message |

---

**Design Status**: Complete
**Ready for Implementation**: Yes
