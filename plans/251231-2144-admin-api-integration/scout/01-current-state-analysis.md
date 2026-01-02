# Scout Report: Current State Analysis - Admin API Integration

**Generated**: 2025-12-31
**Scope**: Admin dashboard service layer and API endpoints mapping

---

## Executive Summary

Admin app has 9 service classes with dual-mode operation (mock/real). All services already have API endpoint scaffolding but lack:
- JWT authentication headers
- Proper error handling
- Type-safe request/response handling
- Services module (missing from admin)

API backend has 9 modules with full CRUD endpoints ready.

---

## Service Inventory

### Admin Services (`apps/admin/src/services/`)

| Service | Mock Support | API Endpoints | Auth Headers | Status |
|---------|--------------|---------------|--------------|--------|
| auth.service.ts | ✅ | Partial | ❌ | Needs JWT flow |
| banners.service.ts | ✅ | ✅ | ❌ | Ready for auth |
| bookings.service.ts | ✅ | ✅ | ❌ | Ready for auth |
| businessInfo.service.ts | ✅ | ✅ | ❌ | Ready for auth |
| contacts.service.ts | ✅ | ✅ | ❌ | Ready for auth |
| gallery.service.ts | ✅ | ✅ | ❌ | Ready for auth |
| heroSettings.service.ts | ✅ | ✅ | ❌ | Ready for auth |
| imageUpload.service.ts | ✅ Firebase | ❌ | N/A | Needs API switch |
| storage.service.ts | N/A localStorage | N/A | N/A | Keep as-is |

### Missing Service
- **services.service.ts** - Admin has ServicesPage but no service layer

---

## API Modules (`apps/api/src/modules/`)

| Module | Controller | Public Routes | Protected Routes | Special Features |
|--------|-----------|---------------|------------------|------------------|
| auth | ✅ | login, register, refresh | logout | Throttling (5/15min) |
| banners | ✅ | GET | POST, PATCH, DELETE | set-primary, reorder |
| bookings | ✅ | POST | GET, PATCH, DELETE | Status updates |
| business-info | ✅ | GET | PATCH | Singleton pattern |
| contacts | ✅ | POST | GET, PATCH | Status, notes |
| gallery | ✅ | GET | POST, PATCH, DELETE | bulk, toggle featured |
| gallery-category | ✅ | GET | - | Read-only |
| hero-settings | ✅ | GET | PUT | Singleton pattern |
| services | ✅ | GET | POST, PATCH, DELETE | upload endpoint |
| storage | ✅ | - | POST /upload | Cloudinary |

---

## Authentication Flow Analysis

### Current Admin Auth (auth.service.ts:16-30)

```typescript
// Missing Authorization header
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(credentials),
});
```

### API Auth Response (auth.controller.ts:44-58)

```typescript
// Returns: { accessToken, refreshToken, admin }
@Post('login')
@Throttle({ default: { limit: 5, ttl: 900000 } })
login(@Body() dto: LoginDto)
```

### Required Changes
1. Update AuthResponse type to match API (has `admin`, not `user`)
2. Store both access + refresh tokens
3. Implement token refresh logic
4. Add interceptor for Authorization headers
5. Handle 401 responses (auto-refresh or logout)

---

## Type System Alignment

### Shared Types (@repo/types)
- ✅ Service
- ✅ Gallery
- ✅ Booking
- ✅ Auth (User)
- ❌ Banner (admin-only type)
- ❌ Contact (admin-only type)
- ❌ BusinessInfo (admin-only type)
- ❌ HeroSettings (admin-only type)

### Admin Local Types (`apps/admin/src/types/`)
- banner.types.ts
- businessInfo.types.ts
- contact.types.ts
- heroSettings.types.ts

**Decision**: Keep admin-specific types local (not shared with client)

---

## Image Upload Strategy

### Current: Firebase Storage
```typescript
// apps/admin/src/services/imageUpload.service.ts
uploadImage(file, folder, onProgress) → Firebase
```

### API: Cloudinary via NestJS
```typescript
// POST /storage/upload
@UseInterceptors(FileInterceptor('file'))
uploadFile(file) → Cloudinary URL
```

### Integration Path
Option A: Keep dual upload (Firebase for admin direct, API for client)
Option B: Route all uploads through API (consistency)
**Recommend**: Option B - centralize on API/Cloudinary

---

## Missing Service Module

Admin has `ServicesPage.tsx` but no `services.service.ts`

### API Endpoints Available
- GET /services (public)
- GET /services/:id (public)
- POST /services (protected) - with imageUrl
- POST /services/upload (protected) - with file upload
- PATCH /services/:id (protected)
- DELETE /services/:id (protected)

### Required Service Methods
```typescript
class ServicesService {
  getAll(query?: QueryParams): Promise<Service[]>
  getById(id: string): Promise<Service | null>
  create(data: Omit<Service, "id">): Promise<Service>
  createWithUpload(file: File, data): Promise<Service>
  update(id: string, data: Partial<Service>): Promise<Service>
  delete(id: string): Promise<void>
  toggleFeatured(id: string): Promise<Service>
  getByCategory(category: ServiceCategory): Promise<Service[]>
}
```

---

## Error Handling Gaps

### Current Pattern
```typescript
if (!response.ok) throw new Error("Failed to fetch");
```

### Issues
1. Generic error messages
2. No HTTP status code handling
3. No API error response parsing
4. No retry logic
5. No offline handling

### API Error Format (NestJS default)
```json
{
  "statusCode": 400,
  "message": ["field validation errors"],
  "error": "Bad Request"
}
```

---

## Environment Configuration

### Admin (.env.example)
```bash
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000
```

### Required for API Mode
```bash
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:3000  # dev
VITE_API_BASE_URL=/api                    # prod (nginx proxy)
```

---

## State Management (Zustand)

All services integrate with Zustand stores:
- authStore (token, user, isAuthenticated)
- bannersStore
- bookingsStore
- businessInfoStore
- contactsStore
- galleryStore
- heroSettingsStore

**Keep**: Stores handle UI state, services handle API calls

---

## Critical Files Requiring Updates

### High Priority
1. `apps/admin/src/services/auth.service.ts` - JWT flow
2. `apps/admin/src/store/authStore.ts` - Token management
3. **NEW**: `apps/admin/src/services/services.service.ts` - Create
4. **NEW**: `apps/admin/src/lib/apiClient.ts` - HTTP interceptor

### Medium Priority
5. `apps/admin/src/services/banners.service.ts` - Add auth headers
6. `apps/admin/src/services/bookings.service.ts` - Add auth headers
7. `apps/admin/src/services/businessInfo.service.ts` - Add auth headers
8. `apps/admin/src/services/contacts.service.ts` - Add auth headers
9. `apps/admin/src/services/gallery.service.ts` - Add auth headers
10. `apps/admin/src/services/heroSettings.service.ts` - Add auth headers

### Low Priority
11. `apps/admin/src/services/imageUpload.service.ts` - Switch to API
12. All `*.store.ts` files - Handle API errors in UI

---

## API Response Type Mismatches

### Auth Response
**Admin expects**: `{ token, user, expiresAt }`
**API returns**: `{ accessToken, refreshToken, admin }`

### Service Response
**Admin expects**: `Service` (from @repo/types)
**API returns**: Service DTO (matches shared type ✅)

### Gallery Response
**Admin expects**: `GalleryItem` (from @repo/types)
**API returns**: Gallery DTO (matches shared type ✅)

### Booking Response
**Admin expects**: `Booking` (from @repo/types)
**API returns**: Booking DTO (matches shared type ✅)

---

## Security Considerations

1. **Token Storage**: Currently localStorage (storageService.ts)
   - Vulnerable to XSS
   - Consider httpOnly cookies (requires API change)
   - Or keep localStorage with CSP headers

2. **Token Refresh**: Not implemented
   - Access token expires (likely 15min-1hr)
   - Need auto-refresh before expiry

3. **CORS**: Admin → API requires CORS config
   - Dev: localhost:5174 → localhost:3000
   - Prod: Same origin (nginx proxy)

4. **Rate Limiting**: API has throttling
   - Login: 5 attempts / 15min
   - Register: 3 attempts / 1hr
   - Handle 429 responses

---

## Next Steps (Planning Phase)

1. Design API client architecture (fetch wrapper + interceptor)
2. Define error handling strategy
3. Plan auth flow (login → store tokens → auto-refresh → logout)
4. Map all service methods to API endpoints
5. Create implementation phases
6. Document breaking changes

---

## Unresolved Questions

1. **Token Storage**: Keep localStorage or switch to cookies?
2. **Image Upload**: Migrate all to API or keep Firebase for direct admin uploads?
3. **Offline Support**: Should admin work offline with cached data?
4. **Error Notifications**: Toast/modal/inline errors?
5. **Loading States**: Global loading indicator or per-component?
6. **Type Safety**: Generate API client from OpenAPI/Swagger spec?

---

**Report Status**: Complete
**Confidence**: High (all services and endpoints identified)
