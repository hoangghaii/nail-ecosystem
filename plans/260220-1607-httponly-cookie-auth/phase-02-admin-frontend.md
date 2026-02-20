# Phase 02 — Admin Frontend Simplification

## Context Links

- Parent plan: [plan.md](./plan.md)
- Depends on: [Phase 01](./phase-01-api-cookie-setup.md) (API must set cookies first)
- apiClient: `apps/admin/src/lib/apiClient.ts`
- authStore: `apps/admin/src/store/authStore.ts`
- storage: `apps/admin/src/services/storage.service.ts`
- queryClient: `apps/admin/src/lib/queryClient.ts`
- hooks: `apps/admin/src/hooks/api/*.ts` (11 files)

## Overview

- **Date**: 2026-02-20
- **Priority**: High (depends on Phase 01)
- **Status**: ✅ Complete

With HttpOnly cookies, the browser sends tokens automatically. The frontend no longer reads, stores, or injects auth tokens manually. This phase strips all token-handling code from the admin app.

## Key Insights

- `apiClient.ts` currently: reads token from cookie → adds `Authorization: Bearer` header manually. With HttpOnly cookies, the browser sends the cookie automatically via `credentials: 'include'` — no manual header injection needed.
- The 401 → refresh flow: apiClient still needs to call `POST /auth/refresh` on 401, but sends NO token manually — the browser sends the refresh cookie automatically.
- `authStore.ts` currently holds `token` and `refreshToken` fields — these become meaningless since tokens are HttpOnly. Remove them. Keep `user` (for display in Topbar) and `isAuthenticated`.
- `initializeAuth()`: can no longer read HttpOnly cookie to check auth status. New approach: read `auth_user` from localStorage for the user object → set `isAuthenticated: true` optimistically. First protected API call will fail with 401 → redirect to login if session expired.
- `storage.service.ts`: `setCookie/getCookie/removeCookie` were added for `auth_token`. These become unused → remove them. Keep localStorage methods (still used for `auth_user` and `refresh_token` cleanup).
- `auth_user` in localStorage: keep (non-sensitive, needed for Topbar name display). Remove on logout.
- `refresh_token` in localStorage: was kept previously — now fully removed (stored as HttpOnly cookie by server).
- 11 hook files: `!!storage.getCookie("auth_token")` → `useAuthStore((s) => s.isAuthenticated)` — this is a Zustand selector, valid inside React Query hooks (which are called from components).
- `useLogin` hook: currently receives `{ admin, accessToken, refreshToken }` — after Phase 01/03, receives `{ admin }` only. Update `login()` call to `login(response.admin)`.
- `useLogout` hook: `authService.logout()` → calls `POST /auth/logout` → server clears cookies. Frontend just clears Zustand state and localStorage user.

## Requirements

1. `apiClient.ts`: add `credentials: 'include'` to all fetch calls; remove Authorization header injection; simplify refresh (no token sent, just call the endpoint)
2. `authStore.ts`: remove `token`/`refreshToken` fields; `login(user)` signature; `initializeAuth()` reads localStorage for user only
3. `storage.service.ts`: remove `setCookie`, `getCookie`, `removeCookie`; update `clear()` to remove `auth_user` only
4. `queryClient.ts`: update 401 handler — remove `storage.removeCookie("auth_token")` and `storage.remove("refresh_token")`; keep `storage.remove("auth_user")`
5. `auth.service.ts`: `login()` returns `{ admin }` only (no tokens)
6. `useAuth.ts`: update `onSuccess` to call `login(response.admin)` (no token args)
7. All 11 hook files: replace `storage.getCookie` enabled check with Zustand selector

## Implementation Steps

### Step 1 — Simplify apiClient.ts

Remove: `getAuthToken()`, `getRefreshToken()`, `refreshAccessToken()` methods.
Add: `credentials: 'include'` to all fetch calls.
Simplify 401 handling: just call `/auth/refresh` once (no token passing), then retry.

```typescript
class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }

  private async refreshAccessToken(): Promise<void> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',  // browser sends refresh cookie automatically
    }).then((res) => {
      if (!res.ok) {
        // Clear user state and redirect
        storage.remove('auth_user');
        window.location.href = '/login';
        throw new ApiError('Session expired', 401);
      }
    }).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    };

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      body: options.body instanceof FormData
        ? options.body
        : options.body ? JSON.stringify(options.body) : undefined,
      credentials: 'include',  // always send cookies
      headers,
    };

    let response = await fetch(url, config);

    // 401: try refresh once (skip for refresh endpoint to avoid loop)
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      await this.refreshAccessToken();
      response = await fetch(url, config);  // retry with same config (cookies refreshed by server)
    }

    if (!response.ok) {
      throw await ApiError.fromResponse(response);
    }

    if (response.status === 204) return undefined as T;

    return response.json();
  }

  // get/post/patch/put/delete methods unchanged
}
```

### Step 2 — Simplify authStore.ts

```typescript
type AuthState = {
  initializeAuth: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
  user: User | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  initializeAuth: () => {
    const user = storage.get<User | null>('auth_user', null);
    if (user) {
      set({ isAuthenticated: true, isInitialized: true, user });
    } else {
      set({ isInitialized: true });
    }
  },
  isAuthenticated: false,
  isInitialized: false,
  login: (user) => {
    storage.set('auth_user', user);
    set({ isAuthenticated: true, isInitialized: true, user });
  },
  logout: () => {
    storage.remove('auth_user');
    set({ isAuthenticated: false, isInitialized: true, user: null });
  },
  user: null,
}));
```

### Step 3 — Simplify storage.service.ts

Remove: `setCookie`, `getCookie`, `removeCookie` methods (added in previous migration — now unused).
Update `clear()`: removes only `auth_user` from localStorage (no cookie removal needed).

```typescript
class StorageService {
  private prefix = 'nail_admin_';

  set<T>(key: string, value: T): void { ... }    // unchanged
  get<T>(key: string, defaultValue: T): T { ... } // unchanged
  remove(key: string): void { ... }               // unchanged

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
    // Note: HttpOnly cookies are cleared server-side via POST /auth/logout
  }
}
```

### Step 4 — Update queryClient.ts 401 handler

```typescript
onError: (error) => {
  if (ApiError.isApiError(error) && error.statusCode === 401) {
    toast.error('Session expired. Please login again.');
    storage.remove('auth_user');  // only remove user data
    // tokens are HttpOnly cookies — cleared server-side
    setTimeout(() => { window.location.href = '/login'; }, 1500);
    return;
  }
  // ... rest unchanged
},
```

### Step 5 — Update auth.service.ts

```typescript
import type { User } from '@repo/types/auth';
import { apiClient } from '@/lib/apiClient';
import { storage } from './storage.service';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ admin: User }> {
    return apiClient.post<{ admin: User }>('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');  // server clears HttpOnly cookies
    } finally {
      storage.clear();  // clear localStorage user data
    }
  }
}
```

### Step 6 — Update useAuth.ts

```typescript
export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      login(response.admin);  // no tokens — only user object
      toast.success('Login successful');
      navigate('/');
    },
  });
}
```

### Step 7 — Update 11 hook files

Replace `!!storage.getCookie("auth_token")` with Zustand selector. Each hook needs:

```typescript
import { useAuthStore } from '@/store/authStore';

// inside the hook:
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

// in useQuery options:
enabled: isAuthenticated,
// or for hooks with additional conditions:
enabled: isAuthenticated && !!params.startDate && !!params.endDate,
```

Files to update (15 occurrences across 11 files):
- `useHeroSettings.ts` (1 occurrence)
- `useBookings.ts` (2 occurrences)
- `useBusinessInfo.ts` (1 occurrence)
- `useGallery.ts` (2 occurrences)
- `useExpenses.ts` (2 occurrences)
- `useContacts.ts` (2 occurrences)
- `useServices.ts` (2 occurrences)
- `useBanners.ts` (2 occurrences)
- `useNailOptions.ts` (2 occurrences)
- `useGalleryCategory.ts` (1 occurrence)
- `useAnalytics.ts` (1 occurrence — combined condition)

Also remove `storage` import from each hook file if it's no longer used.

## Todo

- [ ] `apiClient.ts`: add `credentials: 'include'`, remove token injection, simplify refresh
- [ ] `authStore.ts`: remove token/refreshToken fields, update login signature
- [ ] `storage.service.ts`: remove cookie methods, simplify clear()
- [ ] `queryClient.ts`: update 401 handler (no cookie removal)
- [ ] `auth.service.ts`: update return type
- [ ] `useAuth.ts`: update onSuccess callback
- [ ] 11 hook files: replace `storage.getCookie` with `useAuthStore` selector + remove unused storage imports

## Success Criteria

- Admin login works: POST /auth/login sets cookies, Zustand has user, redirects to dashboard
- Auth state persists on page refresh (localStorage user + HttpOnly cookie session)
- 401 on expired session → /auth/refresh called → cookies rotated → request retried
- Logout: server clears cookies, localStorage cleared, redirect to /login
- No auth token ever appears in JS-accessible storage
- TypeScript compiles with 0 errors

## Risk Assessment

Medium. Many files touched but changes are mechanical (search-replace pattern). Key risk: forgetting to remove `storage` imports from hook files causing lint errors.
