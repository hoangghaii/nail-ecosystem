# HttpOnly Cookie Auth — Implementation Plan

**Date**: 2026-02-20
**Status**: ✅ Complete

## Objective

Replace JS-accessible cookie/localStorage auth with server-set HttpOnly cookies for both `access_token` and `refresh_token`. Eliminates XSS token theft risk.

## Why HttpOnly

Previous migration moved `auth_token` to a `document.cookie` — but non-HttpOnly cookies are still readable by JS → same XSS risk as localStorage. True security requires the server to set cookies with `HttpOnly` flag so JS cannot read them at all.

## Scope

| Layer | Change |
|-------|--------|
| API | Set `HttpOnly; Secure; SameSite=Strict` cookies on login/refresh; clear on logout |
| API | `AccessTokenStrategy` + `RefreshTokenStrategy` extract tokens from cookies (not Authorization header) |
| API | Install `cookie-parser` |
| Admin | `apiClient`: add `credentials: 'include'`, remove manual Authorization header injection, remove token refresh logic (cookies sent automatically) |
| Admin | `authStore`: remove token/refreshToken fields; keep user + isAuthenticated |
| Admin | `storage.service`: remove cookie methods (no longer needed for auth) |
| Admin | 11 hook files: replace `storage.getCookie("auth_token")` → `useAuthStore().isAuthenticated` |
| Admin | `auth.service`: no longer receives tokens in response (server sets cookies) |
| Shared types | Update `AuthResponse` to not include tokens |

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | [API — Cookie Setup](./phase-01-api-cookie-setup.md) | ✅ Complete |
| 2 | [Admin — Frontend Simplification](./phase-02-admin-frontend.md) | ✅ Complete |
| 3 | [Shared Types Update](./phase-03-shared-types.md) | ✅ Complete |

## Files Affected

**API (5 files)**
- `apps/api/src/main.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/strategies/access-token.strategy.ts`
- `apps/api/src/modules/auth/strategies/refresh-token.strategy.ts`

**Admin (15 files)**
- `apps/admin/src/lib/apiClient.ts`
- `apps/admin/src/lib/queryClient.ts`
- `apps/admin/src/store/authStore.ts`
- `apps/admin/src/services/auth.service.ts`
- `apps/admin/src/services/storage.service.ts`
- `apps/admin/src/hooks/api/useAuth.ts`
- `apps/admin/src/hooks/api/useAnalytics.ts`
- `apps/admin/src/hooks/api/useBookings.ts`
- `apps/admin/src/hooks/api/useBanners.ts`
- `apps/admin/src/hooks/api/useBusinessInfo.ts`
- `apps/admin/src/hooks/api/useContacts.ts`
- `apps/admin/src/hooks/api/useExpenses.ts`
- `apps/admin/src/hooks/api/useGallery.ts`
- `apps/admin/src/hooks/api/useGalleryCategory.ts`
- `apps/admin/src/hooks/api/useHeroSettings.ts`
- `apps/admin/src/hooks/api/useNailOptions.ts`
- `apps/admin/src/hooks/api/useServices.ts`

**Shared (1 file)**
- `packages/types/src/auth.ts`

## Unresolved Questions

1. **Cookie expiry for rememberMe**: When `rememberMe=true`, access token JWT is 30d — should cookie also be 30d? Current plan: match cookie expiry to JWT expiry (1d default, 30d if rememberMe).
2. **CORS origin env vars**: `app.frontendUrls.admin` must be set correctly in all environments (dev: `http://localhost:5174`, prod: nginx-proxied admin URL). Already configured in main.ts but verify env values.
