# Phase 02 — Auth Core Update

**Depends on**: Phase 01 complete (cookie methods must exist on `StorageService`)

## Context Links

- `apps/admin/src/store/authStore.ts`
- `apps/admin/src/lib/apiClient.ts`
- `apps/admin/src/lib/queryClient.ts`

## Overview

Swap every `storage.get/set/remove("auth_token", ...)` call in the three core auth files to use the new cookie API. `auth_user` and `refresh_token` remain in localStorage — do not touch those lines.

## Key Insights

- `authStore.ts:20` reads `auth_token` on app init — must switch to `getCookie`
- `apiClient.ts:28` `getAuthToken()` returns `storage.get("auth_token", "")` — empty string is truthy-falsy equivalent to null; `getCookie` returns `null` which is equally falsy
- `apiClient.ts:54` on refresh fail: `storage.remove("auth_token")` — switch to `removeCookie`
- `apiClient.ts:62` on refresh success: `storage.set("auth_token", data.accessToken)` — switch to `setCookie`
- `queryClient.ts:27` on 401 mutation error: `storage.remove("auth_token")` — switch to `removeCookie`
- `refresh_token` at `apiClient.ts:63` stays `storage.set("refresh_token", ...)` — localStorage, unchanged

## Requirements

Only change lines touching `auth_token`. Leave all `auth_user` and `refresh_token` lines as-is.

---

## authStore.ts Changes

### `initializeAuth` — read token from cookie

```typescript
// BEFORE
const token = storage.get<string | null>("auth_token", null);

// AFTER
const token = storage.getCookie("auth_token");
```

### `login` — write token to cookie

```typescript
// BEFORE
storage.set("auth_token", token);

// AFTER
storage.setCookie("auth_token", token);
```

### `logout` — remove cookie

```typescript
// BEFORE
storage.remove("auth_token");

// AFTER
storage.removeCookie("auth_token");
```

### Final `authStore.ts`

```typescript
import type { User } from "@repo/types/auth";

import { create } from "zustand";

import { storage } from "@/services/storage.service";

type AuthState = {
  initializeAuth: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  refreshToken: string | null;
  token: string | null;
  user: User | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  initializeAuth: () => {
    const token = storage.getCookie("auth_token");           // cookie
    const refreshToken = storage.get<string | null>("refresh_token", null);
    const user = storage.get<User | null>("auth_user", null);

    if (token && refreshToken && user) {
      set({ isAuthenticated: true, isInitialized: true, refreshToken, token, user });
    } else {
      set({ isInitialized: true });
    }
  },
  isAuthenticated: false,
  isInitialized: false,
  login: (user, token, refreshToken) => {
    storage.setCookie("auth_token", token);                  // cookie
    storage.set("refresh_token", refreshToken);
    storage.set("auth_user", user);
    set({ isAuthenticated: true, isInitialized: true, refreshToken, token, user });
  },

  logout: () => {
    storage.removeCookie("auth_token");                      // cookie
    storage.remove("refresh_token");
    storage.remove("auth_user");
    set({ isAuthenticated: false, isInitialized: true, refreshToken: null, token: null, user: null });
  },

  refreshToken: null,
  token: null,
  user: null,
}));
```

---

## apiClient.ts Changes

### `getAuthToken()` — read from cookie

```typescript
// BEFORE
private getAuthToken(): string | null {
  return storage.get("auth_token", "");
}

// AFTER
private getAuthToken(): string | null {
  return storage.getCookie("auth_token");
}
```

### On refresh success — write to cookie

```typescript
// BEFORE
storage.set("auth_token", data.accessToken);

// AFTER
storage.setCookie("auth_token", data.accessToken);
```

### On refresh fail — remove cookie

```typescript
// BEFORE (line 54)
storage.remove("auth_token");

// AFTER
storage.removeCookie("auth_token");
```

Note: `refresh_token` on line 55 stays `storage.remove("refresh_token")` — unchanged.
Note: `refresh_token` on line 63 stays `storage.set("refresh_token", data.refreshToken)` — unchanged.

---

## queryClient.ts Changes

### On 401 mutation error — remove cookie

```typescript
// BEFORE (line 27)
storage.remove("auth_token");

// AFTER
storage.removeCookie("auth_token");
```

---

## Todo

### authStore.ts
- [ ] Line 20: `storage.get<string | null>("auth_token", null)` → `storage.getCookie("auth_token")`
- [ ] Line 39: `storage.set("auth_token", token)` → `storage.setCookie("auth_token", token)`
- [ ] Line 52: `storage.remove("auth_token")` → `storage.removeCookie("auth_token")`

### apiClient.ts
- [ ] Line 28: `storage.get("auth_token", "")` → `storage.getCookie("auth_token")`
- [ ] Line 54: `storage.remove("auth_token")` → `storage.removeCookie("auth_token")`
- [ ] Line 62: `storage.set("auth_token", data.accessToken)` → `storage.setCookie("auth_token", data.accessToken)`

### queryClient.ts
- [ ] Line 27: `storage.remove("auth_token")` → `storage.removeCookie("auth_token")`

## Success Criteria

- Login flow stores token in cookie (verify in browser DevTools → Application → Cookies)
- Page refresh: `initializeAuth` reads cookie, restores session
- Logout: cookie removed, localStorage `auth_user` and `refresh_token` also cleared
- Token refresh (401 retry): new token written to cookie, old cookie overwritten
- Mutation 401: cookie cleared, redirect to `/login`
- `auth_user` still in localStorage (Topbar renders user name on refresh)
- TypeScript: no errors

## Risk Assessment

Medium. These are core auth paths — a mistake causes login/logout/refresh to break entirely. Mitigate by testing each flow manually after implementation before proceeding to phase-03.

## Security Considerations

- Behavior is identical to phase-01 — all cookie writes go through `StorageService` methods
- `getAuthToken()` returning `null` instead of `""` is safe — the `if (token && ...)` guards in `request()` handle null correctly

## Next Steps

Proceed to [Phase 03 — Hooks + Validation](./phase-03-hooks-and-validation.md).
