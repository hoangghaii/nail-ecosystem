# Phase 01 — Storage Service: Add Cookie API

## Context Links

- Source: `apps/admin/src/services/storage.service.ts`
- Used by: `authStore.ts`, `apiClient.ts`, `queryClient.ts`, all API hooks

## Overview

Add 3 new public methods (`setCookie`, `getCookie`, `removeCookie`) to `StorageService` and update `clear()` to also wipe the auth cookie. No existing methods change — purely additive.

## Key Insights

- `StorageService` already holds `private prefix = "nail_admin_"` — cookie names reuse same prefix, so `setCookie("auth_token", ...)` stores as `nail_admin_auth_token`.
- `clear()` currently only iterates `localStorage` keys; after migration the auth cookie must also be cleared to prevent stale cookie surviving a full logout.
- `document.cookie` requires `Secure` flag only on HTTPS; guard with `location.protocol`.
- `getCookie` returns `null` (not empty string) when absent — callers in phase-02/03 use `!!storage.getCookie(...)` which handles null correctly.

## Requirements

- `setCookie(key, value, days?)` — write cookie with proper attributes, default 1 day expiry
- `getCookie(key)` — read cookie, return `string | null`
- `removeCookie(key)` — expire cookie immediately
- `clear()` — call `removeCookie("auth_token")` in addition to existing localStorage clear

## Current State (`storage.service.ts`)

```typescript
class StorageService {
  private prefix = "nail_admin_";

  set<T>(key: string, value: T): void { ... }
  get<T>(key: string, defaultValue: T): T { ... }
  remove(key: string): void { ... }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}
```

## Implementation Steps

### Step 1 — Add 3 cookie methods after `remove()`

```typescript
setCookie(key: string, value: string, days = 1): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${this.prefix}${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict${secure}`;
}

getCookie(key: string): string | null {
  const name = `${this.prefix}${key}=`;
  const found = document.cookie.split('; ').find(c => c.startsWith(name));
  return found ? decodeURIComponent(found.slice(name.length)) : null;
}

removeCookie(key: string): void {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${this.prefix}${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict${secure}`;
}
```

### Step 2 — Update `clear()` to also wipe auth cookie

```typescript
clear(): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(this.prefix))
    .forEach((key) => localStorage.removeItem(key));
  this.removeCookie('auth_token');
}
```

### Final shape of file

```typescript
class StorageService {
  private prefix = "nail_admin_";

  set<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    localStorage.setItem(this.prefix + key, serialized);
  }

  get<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  setCookie(key: string, value: string, days = 1): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${this.prefix}${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict${secure}`;
  }

  getCookie(key: string): string | null {
    const name = `${this.prefix}${key}=`;
    const found = document.cookie.split('; ').find(c => c.startsWith(name));
    return found ? decodeURIComponent(found.slice(name.length)) : null;
  }

  removeCookie(key: string): void {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${this.prefix}${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict${secure}`;
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
    this.removeCookie('auth_token');
  }
}

export const storage = new StorageService();
```

## Todo

- [ ] Insert `setCookie`, `getCookie`, `removeCookie` methods after `remove()`
- [ ] Update `clear()` to call `this.removeCookie('auth_token')`

## Success Criteria

- `storage.setCookie("auth_token", "xyz")` writes `nail_admin_auth_token=xyz` to `document.cookie`
- `storage.getCookie("auth_token")` returns `"xyz"`
- `storage.removeCookie("auth_token")` removes the cookie
- `storage.clear()` removes both localStorage keys and the auth cookie
- TypeScript compiles with no errors on this file

## Risk Assessment

Low. Purely additive — no existing method signatures change. No callers break until phase-02 switches them over.

## Security Considerations

- `SameSite=Strict` blocks CSRF from cross-site requests
- `Secure` flag enforced on HTTPS — dev on HTTP works without it
- `encodeURIComponent`/`decodeURIComponent` prevents special chars from breaking cookie parsing
- Cookie not `HttpOnly` (browser JS must read it to inject into `Authorization` header) — this is an accepted trade-off; HttpOnly would require server-side session management which is out of scope

## Next Steps

Proceed to [Phase 02 — Auth Core Update](./phase-02-auth-core-update.md).
