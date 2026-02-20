# Admin Auth Cookie Migration

**Date**: 2026-02-20
**Goal**: Move `auth_token` from localStorage to cookie for improved security posture.

## Summary

Migrate `nail_admin_auth_token` from `localStorage` to `document.cookie` with `SameSite=Strict; Secure; path=/; expires=1d`. All other storage (`auth_user`, `refresh_token`) stays in localStorage unchanged.

## What Changes / What Stays

| Key | Storage | Change? |
|---|---|---|
| `auth_token` | localStorage → cookie | YES |
| `auth_user` | localStorage | NO |
| `refresh_token` | localStorage | NO |

## Phases

| # | Phase | Files | Status |
|---|---|---|---|
| 01 | [Storage Service](./phase-01-storage-service.md) | `apps/admin/src/services/storage.service.ts` | pending |
| 02 | [Auth Core Update](./phase-02-auth-core-update.md) | `authStore.ts`, `apiClient.ts`, `queryClient.ts` | pending |
| 03 | [Hooks + Validation](./phase-03-hooks-and-validation.md) | 14 hook files + type-check | pending |

## Dependency Order

Phase 01 must complete before 02 (new cookie methods must exist). Phase 02 must complete before 03 (hooks depend on storage API shape).

## Files Affected

- `apps/admin/src/services/storage.service.ts`
- `apps/admin/src/store/authStore.ts`
- `apps/admin/src/lib/apiClient.ts`
- `apps/admin/src/lib/queryClient.ts`
- `apps/admin/src/hooks/api/useAnalytics.ts` (1 occurrence)
- `apps/admin/src/hooks/api/useBanners.ts` (2 occurrences)
- `apps/admin/src/hooks/api/useBookings.ts` (2 occurrences)
- `apps/admin/src/hooks/api/useBusinessInfo.ts` (1 occurrence)
- `apps/admin/src/hooks/api/useContacts.ts` (2 occurrences)
- `apps/admin/src/hooks/api/useExpenses.ts` (2 occurrences)
- `apps/admin/src/hooks/api/useGallery.ts` (2 occurrences)
- `apps/admin/src/hooks/api/useGalleryCategory.ts` (1 occurrence)
- `apps/admin/src/hooks/api/useHeroSettings.ts` (1 occurrence)
- `apps/admin/src/hooks/api/useNailOptions.ts` (2 occurrences)
- `apps/admin/src/hooks/api/useServices.ts` (2 occurrences)

Total: 4 core files + 11 hook files = **15 files**, **21 occurrences** of `auth_token`.

## Cookie Spec

- Name in cookie jar: `nail_admin_auth_token` (prefix applied inside `setCookie`)
- Attributes: `SameSite=Strict; path=/; expires=1d`
- `Secure` flag: conditional on `location.protocol === 'https:'`
- No new npm packages — native `document.cookie` only

## Validation

```bash
npx turbo type-check --filter=admin
```

## Unresolved Questions

None.
