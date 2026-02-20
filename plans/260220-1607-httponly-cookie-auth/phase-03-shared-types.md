# Phase 03 — Shared Types Update

## Context Links

- Parent plan: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-api-cookie-setup.md), [Phase 02](./phase-02-admin-frontend.md)
- File: `packages/types/src/auth.ts`

## Overview

- **Date**: 2026-02-20
- **Priority**: Medium (do last — unblocks type-check)
- **Status**: ✅ Complete

`AuthResponse` currently contains `accessToken` and `refreshToken` fields. After migration, the login endpoint returns `{ admin }` only — tokens are set as HttpOnly cookies by the server. Update the shared type.

## Current State

```typescript
export type AuthResponse = {
  accessToken: string;
  admin: User;
  refreshToken: string;
};
```

## Target State

```typescript
export type AuthResponse = {
  admin: User;
};
```

## Implementation Steps

### Step 1 — Update AuthResponse in packages/types/src/auth.ts

Remove `accessToken` and `refreshToken` from `AuthResponse`.

### Step 2 — Verify no other consumers break

Grep all apps for `AuthResponse` usage:
- `apps/admin/src/services/auth.service.ts` — updated in Phase 02 ✅
- `apps/admin/src/hooks/api/useAuth.ts` — updated in Phase 02 ✅
- `apps/api/*` — API doesn't import `AuthResponse` from shared types (defines its own return shape inline) ✅

## Todo

- [ ] Remove `accessToken` and `refreshToken` from `AuthResponse` in `packages/types/src/auth.ts`
- [ ] Run `pnpm run type-check` from root — must pass with 0 errors

## Success Criteria

- `pnpm run type-check` passes with 0 errors across all apps
- No consumer references `response.accessToken` or `response.refreshToken` from login response

## Risk Assessment

Low. One field removal, 2 known consumers already updated in Phase 02.
