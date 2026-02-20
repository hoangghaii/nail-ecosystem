# HttpOnly Cookie Auth Migration — Code Review

**Date**: 2026-02-20
**Scope**: NestJS API auth + React admin frontend auth migration from Bearer header to HttpOnly cookies

---

## Files Reviewed

- `apps/api/src/main.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/src/modules/auth/strategies/access-token.strategy.ts`
- `apps/api/src/modules/auth/strategies/refresh-token.strategy.ts`
- `apps/api/src/modules/auth/guards/access-token.guard.ts`
- `apps/api/src/modules/auth/guards/refresh-token.guard.ts`
- `apps/api/src/modules/auth/schemas/admin.schema.ts`
- `apps/api/src/config/jwt.config.ts`
- `apps/api/src/config/app.config.ts`
- `apps/admin/src/lib/apiClient.ts`
- `apps/admin/src/store/authStore.ts`
- `apps/admin/src/services/storage.service.ts`
- `apps/admin/src/services/auth.service.ts`
- `apps/admin/src/lib/queryClient.ts`
- `apps/admin/src/hooks/api/useAuth.ts`
- `apps/admin/src/components/auth/ProtectedRoute.tsx`
- `apps/admin/src/App.tsx`
- `packages/types/src/auth.ts`
- `nginx/conf.d/default.conf`

---

## Overall Assessment

Migration is **architecturally correct** and a clear security improvement over Bearer tokens in JS-accessible storage. The core mechanics (HttpOnly cookies, credentials: include, server-side rotation, single-instance refresh deduplication) are all implemented properly. Several issues exist ranging from a type contract mismatch (high) to CSRF nuances worth understanding, down to minor hardening gaps.

---

## Answering the Four Key Questions

### 1. `@Res({ passthrough: true })` — Correct?

**Yes, correct.** `passthrough: true` tells NestJS to keep the response pipeline (interceptors, exception filters, serialization) active while still giving direct access to `res` for cookie-setting. Without it, NestJS hands full response control to the handler and skips the pipeline. The usage in `register`, `login`, `logout`, and `refresh` is all correct.

### 2. CSRF risk with SameSite=Strict on same-domain admin?

**SameSite=Strict provides strong CSRF protection** for same-domain deployments. In production behind nginx, both `/admin` and `/api` share the same origin — cookies will be sent on every same-site request. Cross-site POST requests (the classic CSRF vector) will not include the cookies at all with `Strict`. This is the strongest possible SameSite protection. No additional CSRF token is required for this threat model.

**One edge case to be aware of**: SameSite=Strict means cookies are NOT sent on top-level navigations from external sites (e.g., clicking a link from email). For an admin dashboard this is acceptable and actually desirable.

### 3. Optimistic auth state (localStorage user → isAuthenticated=true) — Security concern?

**Low-severity design tradeoff, not a vulnerability.** The approach is intentional and documented in the code. The key points:
- localStorage is XSS-accessible, but `auth_user` contains only non-sensitive display data (id, email, name, role) — no tokens
- Actual auth enforcement is server-side via HttpOnly cookie validation
- If cookie is expired, first API call returns 401 → `refreshAccessToken()` is attempted → on failure, localStorage is cleared and redirect to `/login` occurs
- The brief window where UI shows "authenticated" but cookie is actually expired is a UX tradeoff, not an auth bypass — protected data is never served

**The concern**: the user object in localStorage could be stale (e.g., role changed server-side). A deactivated admin account (`isActive: false`) would still see the dashboard UI until the next API call. This is acceptable for an admin-only app.

### 4. Race condition in refresh deduplication?

**The deduplication logic is correct but has one gap.**

```typescript
// apiClient.ts — correct deduplication
if (this.refreshPromise) {
  return this.refreshPromise;
}
this.refreshPromise = fetch(...).finally(() => { this.refreshPromise = null; });
return this.refreshPromise;
```

This correctly prevents multiple simultaneous refresh requests. All concurrent 401 responses queue behind the single `refreshPromise`.

**The gap**: after `refreshPromise` resolves (success), **all queued callers retry their original requests**. If the server's new access cookie hasn't been set by the browser before the retry fires (extremely unlikely in practice since fetch is synchronous in the browser's cookie jar, but theoretically possible with some proxy configurations), the retry could 401 again. Since there's no second retry after a refresh, this would result in an unexpected logout. In practice, browser cookie setting from `Set-Cookie` is synchronous within the same fetch pipeline — this is a theoretical concern only.

---

## Critical Issues

### None

No security vulnerabilities that allow unauthorized access, token theft, or privilege escalation were found.

---

## High Priority Findings

### H1: `User` type `_id` vs API response `id` — Type contract mismatch

**File**: `packages/types/src/auth.ts` (line 4) vs `apps/api/src/modules/auth/auth.service.ts` (lines 47, 82, 167)

The shared `User` type declares `_id: string`:
```typescript
// packages/types/src/auth.ts
export type User = {
  _id: string;   // ← expects _id
  email: string;
  name: string;
  role: 'admin' | 'staff';
  avatar?: string;
};
```

But the API returns `id` (not `_id`) in all three places (register, login, validateAdmin):
```typescript
// auth.service.ts — login() and register() return:
return {
  admin: {
    id: admin._id.toString(),  // ← sends "id", not "_id"
    email: admin.email,
    ...
  },
  ...tokens,
};
```

This means `response.admin._id` is `undefined` in the frontend and `response.admin.id` exists but is typed as non-existent. TypeScript may not catch this at the call sites depending on how strict the checks are. The stored `auth_user` in localStorage will have `id` not `_id`, so any code accessing `user._id` will get `undefined`.

**Fix**: Align the API to return `_id` (matching the Mongoose convention and the type), or update the `User` type to use `id`. Pick one consistently.

### H2: `rememberMe` cookie `maxAge` and JWT `expiresIn` are misaligned

**File**: `apps/api/src/modules/auth/auth.service.ts` (lines 135-136) vs `apps/api/src/modules/auth/auth.controller.ts` (lines 37-42)

When `rememberMe = false`, the JWT access token is signed with `accessExpiry` from config (default `15m`), but the cookie `maxAge` is set to `1 day (86400000ms)`. This means the cookie lives 24 hours but the JWT inside it expires after 15 minutes. The refresh flow handles this correctly (401 → refresh), but the mismatch is confusing and could mask issues.

When `rememberMe = true`, both JWT (`30d`) and cookie (`maxAge: 30d`) align. But for the non-remember case:
- JWT access expiry: `15m` (from `JWT_ACCESS_EXPIRY` env, or hardcoded `24h` fallback in service)
- Cookie maxAge: `1d`

The `auth.service.ts` fallback at line 135: `accessExpiry || '24h'` disagrees with `jwt.config.ts` which defaults `accessExpiry` to `'15m'`. The controller's 1-day cookie maxAge was likely written assuming 24h tokens. This inconsistency won't break auth (refresh handles it) but creates confusion.

**Fix**: The cookie maxAge should be set equal to the JWT expiry, or the service/config defaults should be reconciled. Document the intention explicitly.

---

## Medium Priority Findings

### M1: `process.env.NODE_ENV` accessed directly in controller instead of via ConfigService

**File**: `apps/api/src/modules/auth/auth.controller.ts` (lines 36, 62)

```typescript
const isProd = process.env.NODE_ENV === 'production';
```

The project uses `ConfigService` for all other config access. Direct `process.env` reads in controllers bypass the config validation layer. In this case it works fine, but it's inconsistent. ConfigService already exposes `app.env` via `app.config.ts`.

**Fix**: Inject `ConfigService` into `AuthController` and use `configService.get<string>('app.env') === 'production'`.

### M2: `clearCookies` repeats `isProd` logic — DRY violation

**File**: `apps/api/src/modules/auth/auth.controller.ts` (lines 61-71)

Both `setCookies` and `clearCookies` independently compute `isProd` and duplicate the `baseOpts` object. Minor DRY issue.

### M3: `@CurrentUser('sub')` vs `@CurrentUser('id')` inconsistency in refresh vs logout

**File**: `apps/api/src/modules/auth/auth.controller.ts` (lines 127, 146)

- `logout` uses `@CurrentUser('id')` — works because `AccessTokenStrategy.validate()` returns `{ id, email, name, role, avatar }` (from `validateAdmin`)
- `refresh` uses `@CurrentUser('sub')` — works because `RefreshTokenStrategy.validate()` returns `{ ...payload, refreshToken }` where payload has `sub`

These work correctly but the inconsistency (using `id` vs `sub` for the same concept) is a future footgun. If someone swaps strategies, the decorator will silently return `undefined`.

### M4: Refresh endpoint marked `@Public()` but relies on `RefreshTokenGuard`

**File**: `apps/api/src/modules/auth/auth.controller.ts` (line 135-136)

```typescript
@Public()
@UseGuards(RefreshTokenGuard)
@Post('refresh')
```

`@Public()` tells `AccessTokenGuard` to skip access token validation. `@UseGuards(RefreshTokenGuard)` then applies refresh token validation. This is correct — `RefreshTokenGuard` still validates the refresh cookie. However the combination is non-obvious. A comment explaining why both decorators are present would prevent future developers from removing `@Public()` (thinking it's redundant) or adding it back and accidentally bypassing both guards.

### M5: `queryClient.ts` handles 401 for mutations but not for query errors

**File**: `apps/admin/src/lib/queryClient.ts` (lines 17-44)

The global `mutations.onError` handler catches 401 and redirects to login. But `queries` section has no equivalent — it only retries. The `apiClient.ts` already handles 401 → refresh in the fetch layer, so queries that 401 will trigger a refresh attempt. If refresh fails, `apiClient.ts` does `window.location.href = '/login'` directly. This creates two different 401-handling paths (query vs mutation) that both ultimately redirect, but via different mechanisms. Acceptable, but fragile — a future change to one path may not be reflected in the other.

### M6: `auth_user` in localStorage not cleared on refresh token rotation

**File**: `apps/admin/src/lib/apiClient.ts` (lines 37-43)

When refresh succeeds, the store's `isAuthenticated` state and `auth_user` in localStorage remain. Only on refresh failure is `auth_user` removed. This is correct behavior — but if the user object itself becomes invalid server-side (e.g., role change, account deactivation), the stale user data persists in localStorage until logout or the next explicit login. The server won't send an updated user object in the `/auth/refresh` response (it currently returns `{ message: 'Tokens refreshed' }`).

This is a known limitation of the optimistic auth pattern, documented in the store. Acceptable for this use case.

---

## Low Priority Findings

### L1: Swagger still configured for BearerAuth but API no longer uses Bearer tokens

**File**: `apps/api/src/main.ts` (lines 75-85) and `apps/api/src/modules/auth/auth.controller.ts` (line 122)

```typescript
.addBearerAuth(...)  // main.ts
@ApiBearerAuth('JWT-auth')  // auth.controller.ts logout
```

Swagger UI still shows an "Authorize" button for Bearer token, but the auth system now uses cookies. Testing via Swagger UI with Bearer tokens will fail. Cookie auth cannot easily be tested via Swagger UI without custom configuration. This only affects developer experience with docs, not production behavior.

**Fix**: Either remove `addBearerAuth` from the Swagger config (accepting Swagger can't test protected endpoints), or add a note to the Swagger description that auth is via HttpOnly cookies (cookie jar not accessible in Swagger UI).

### L2: `nest-cli.json` in git diff — likely unintentional modification

Per git status: `M apps/api/nest-cli.json`. The file currently contains only basic config. Verify this modification was intentional and wasn't accidentally changed.

### L3: Login rate limit of 100/min is permissive

**File**: `apps/api/src/modules/auth/auth.controller.ts` (line 95)

```typescript
@Throttle({ default: { limit: 100, ttl: 60000 } })
```

100 login attempts per minute per IP allows brute force attempts at a reasonable pace. 5-10 per minute is the typical recommendation for login endpoints. This is currently in the code but worth revisiting.

### L4: No `SameSite` cookie path scoping

Both `nail_admin_access_token` and `nail_admin_refresh_token` use `path: '/'`. This means cookies are sent to all paths on the domain, including the client website paths (`/`). In production behind nginx, all apps share the same domain. The cookies will be sent to `/` (client) and `/api` routes alike. Since the client app never makes requests needing admin auth, this is harmless but adds unnecessary cookie payload to client requests.

Consider `path: '/api'` for the API cookies to scope them tightly. Note: this would require the admin frontend's `VITE_API_BASE_URL` path to start with `/api` in production.

---

## Positive Observations

- **HttpOnly + Secure + SameSite=Strict** is the gold-standard cookie configuration
- **Refresh token rotation** with argon2-hashed storage in DB is correct — prevents refresh token replay attacks
- **Single-instance refresh deduplication** (`refreshPromise` pattern) is well-implemented — prevents concurrent refresh storms
- **`credentials: 'include'` on all fetches** is consistently applied
- **Server-side cookie clearing on logout** — logout actually invalidates the server-side refresh token hash AND clears cookies
- **`passthrough: true`** used correctly throughout the controller
- **`@Public()` decorator pattern** cleanly handles public routes without requiring the global guard to be disabled
- **Argon2 for password and refresh token hashing** — correct choice
- **`isActive` check in `validateAdmin` and `refreshTokens`** — deactivated accounts are properly blocked
- **`configService.get()` null check at strategy construction time** — throws at startup rather than failing silently at runtime
- **`storage.clear()` on logout** always runs via `finally` block — correct defensive pattern

---

## Recommended Actions (Prioritized)

1. **[High]** Fix `User._id` vs API `id` mismatch — pick one naming convention and apply it in both `packages/types/src/auth.ts` and `auth.service.ts`. Verify all frontend code accessing `user._id` or `user.id` is consistent.

2. **[High]** Reconcile `rememberMe=false` JWT expiry (15m from config) with cookie `maxAge` (1 day in controller). Either set cookie `maxAge` to match JWT TTL, or explicitly document why they differ and that refresh is the intended mechanism.

3. **[Medium]** Replace `process.env.NODE_ENV` in `auth.controller.ts` with injected `ConfigService`.

4. **[Medium]** Add a comment on the `@Public()` + `@UseGuards(RefreshTokenGuard)` combination in `refresh` endpoint explaining the intent.

5. **[Low]** Update Swagger config to remove `addBearerAuth` or add a note that cookie auth can't be tested via Swagger UI.

6. **[Low]** Reduce login rate limit from 100/min to 5-10/min.

7. **[Low]** Verify `apps/api/nest-cli.json` modification in git status is intentional.

---

## Metrics

- Type Coverage: Has a gap — `User._id` vs `id` mismatch would cause runtime `undefined` reads not caught by TypeScript
- Linting Issues: 0 critical
- Security Posture: Significantly improved over Bearer-in-JS-storage pattern

---

## Unresolved Questions

1. Is `auth_user` in localStorage used anywhere to access `.id` vs `._id`? No grep hits found for `user?.id` or `user?._id` in admin frontend, but this needs verification with a full type-check run (`npm run type-check`) to confirm no silent runtime `undefined` dereferences.

2. In production (nginx), `VITE_API_BASE_URL` resolves to `/api`. The cookie `path: '/'` means cookies are sent to all routes. Is this intentional, and has it been tested with the nginx `/api` rewrite (`rewrite ^/api/(.*) /$1 break`) which strips the `/api` prefix before forwarding? The cookie `path` on the server side is set to `/` relative to the API server's own path space — this is correct as-is, but worth confirming in production E2E testing.
