# Phase 03 — Hooks Update + Validation

**Depends on**: Phase 01 + Phase 02 complete

## Context Links

- `apps/admin/src/hooks/api/` (all files below)

## Overview

Replace every `!!storage.get("auth_token", "")` guard in the 11 hook files (21 total occurrences) with `!!storage.getCookie("auth_token")`. Then run type-check to confirm zero errors.

## Key Insights

- All occurrences follow the exact same pattern — mechanical find-and-replace
- `getCookie` returns `string | null`; double-bang coerces both correctly
- Some hooks use single quotes, some double quotes — match existing style per file
- `useToggleGalleryFeatured.ts` and `useUpload.ts` and `useAuth.ts` have zero `auth_token` occurrences — skip them

## Affected Files and Occurrence Count

| File | Occurrences |
|---|---|
| `useAnalytics.ts` | 1 |
| `useBanners.ts` | 2 |
| `useBookings.ts` | 2 |
| `useBusinessInfo.ts` | 1 |
| `useContacts.ts` | 2 |
| `useExpenses.ts` | 2 |
| `useGallery.ts` | 2 |
| `useGalleryCategory.ts` | 1 |
| `useHeroSettings.ts` | 1 |
| `useNailOptions.ts` | 2 |
| `useServices.ts` | 2 |
| **Total** | **18** |

Note: grep showed 18 occurrences across 11 files (not 14 files / 21 as originally estimated — confirmed via live grep output).

## Pattern to Replace

```typescript
// BEFORE (double quotes variant)
enabled: !!storage.get("auth_token", ""),
enabled: queryOptions?.enabled !== false && !!storage.get("auth_token", ""),
enabled: queryOptions.enabled !== false && !!storage.get("auth_token", ""),

// BEFORE (single quotes variant)
enabled: !!storage.get('auth_token', '') && !!params.startDate && !!params.endDate,
enabled: queryOptions.enabled !== false && !!storage.get('auth_token', ''),
enabled: !!storage.get('auth_token', ''),

// AFTER — replace only the storage call portion
// !!storage.get("auth_token", "")  →  !!storage.getCookie("auth_token")
// !!storage.get('auth_token', '')  →  !!storage.getCookie('auth_token')
```

Preserve surrounding expression (extra `&& !!params.*` conditions, `queryOptions.enabled` guards) exactly as-is.

## Per-File Todo

### `useAnalytics.ts` (line 20)
- [ ] `!!storage.get('auth_token', '') && !!params.startDate && !!params.endDate`
  → `!!storage.getCookie('auth_token') && !!params.startDate && !!params.endDate`

### `useBanners.ts` (lines 44, 67)
- [ ] Line 44: `queryOptions?.enabled !== false && !!storage.get("auth_token", "")`
  → `queryOptions?.enabled !== false && !!storage.getCookie("auth_token")`
- [ ] Line 67: `!!storage.get("auth_token", "")`
  → `!!storage.getCookie("auth_token")`

### `useBookings.ts` (lines 58, 84)
- [ ] Line 58: `queryOptions.enabled !== false && !!storage.get("auth_token", "")`
  → `queryOptions.enabled !== false && !!storage.getCookie("auth_token")`
- [ ] Line 84: `!!storage.get("auth_token", "")`
  → `!!storage.getCookie("auth_token")`

### `useBusinessInfo.ts` (line 16)
- [ ] `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`

### `useContacts.ts` (lines 26, 50)
- [ ] Line 26: `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`
- [ ] Line 50: `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`

### `useExpenses.ts` (lines 50, 71)
- [ ] Line 50: `queryOptions.enabled !== false && !!storage.get('auth_token', '')`
  → `queryOptions.enabled !== false && !!storage.getCookie('auth_token')`
- [ ] Line 71: `!!storage.get('auth_token', '')` → `!!storage.getCookie('auth_token')`

### `useGallery.ts` (lines 49, 72)
- [ ] Line 49: `queryOptions.enabled !== false && !!storage.get("auth_token", "")`
  → `queryOptions.enabled !== false && !!storage.getCookie("auth_token")`
- [ ] Line 72: `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`

### `useGalleryCategory.ts` (line 26)
- [ ] `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`

### `useHeroSettings.ts` (line 16)
- [ ] `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`

### `useNailOptions.ts` (lines 23, 75)
- [ ] Line 23: `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`
- [ ] Line 75: `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`

### `useServices.ts` (lines 24, 43)
- [ ] Line 24: `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`
- [ ] Line 43: `!!storage.get("auth_token", "")` → `!!storage.getCookie("auth_token")`

## Validation Step

After all edits:

```bash
npx turbo type-check --filter=admin
```

Expected: zero TypeScript errors. If errors appear, they will be in the files just edited — check `getCookie` call sites for typos.

## Success Criteria

- All 18 `storage.get("auth_token", ...)` occurrences in hooks replaced
- `npx turbo type-check --filter=admin` exits 0
- Queries only fire when auth cookie is present (open DevTools → Network — no unauthorized requests before login)

## Risk Assessment

Low. All changes are identical single-expression substitutions. No logic changes.

## Unresolved Questions

None.
