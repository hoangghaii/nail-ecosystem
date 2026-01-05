# Phase 1: Auth Store Update

**File:** `apps/admin/src/store/authStore.ts`
**Estimated Time:** 5-10 minutes

---

## Changes Required

### 1. Add `isInitialized` to State Interface

```typescript
interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean; // ← NEW
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}
```

### 2. Set Initial State

```typescript
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitialized: false, // ← NEW: Start uninitialized
  token: null,
  refreshToken: null,
  user: null,
  // ... methods below
```

### 3. Update `initializeAuth()` Method

**Current Code:**
```typescript
initializeAuth: () => {
  const token = storage.get<string | null>("auth_token", null);
  const refreshToken = storage.get<string | null>("refresh_token", null);
  const user = storage.get<User | null>("auth_user", null);

  if (token && refreshToken && user) {
    set({ isAuthenticated: true, refreshToken, token, user });
  }
},
```

**New Code:**
```typescript
initializeAuth: () => {
  const token = storage.get<string | null>("auth_token", null);
  const refreshToken = storage.get<string | null>("refresh_token", null);
  const user = storage.get<User | null>("auth_user", null);

  if (token && refreshToken && user) {
    set({
      isAuthenticated: true,
      isInitialized: true, // ← NEW: Mark as initialized
      refreshToken,
      token,
      user,
    });
  } else {
    // NEW: Also set initialized when no auth found
    set({ isInitialized: true });
  }
},
```

**Rationale:** Always set `isInitialized: true` whether tokens found or not. The check is complete either way.

### 4. Update `login()` Method

**Current Code:**
```typescript
login: (token: string, refreshToken: string, user: User) => {
  storage.set("auth_token", token);
  storage.set("refresh_token", refreshToken);
  storage.set("auth_user", user);
  set({ isAuthenticated: true, refreshToken, token, user });
},
```

**New Code:**
```typescript
login: (token: string, refreshToken: string, user: User) => {
  storage.set("auth_token", token);
  storage.set("refresh_token", refreshToken);
  storage.set("auth_user", user);
  set({
    isAuthenticated: true,
    isInitialized: true, // ← NEW: Login also initializes
    refreshToken,
    token,
    user,
  });
},
```

**Rationale:** User action (login) counts as initialization. Prevents edge case where user logs in before `initializeAuth()` runs.

### 5. Update `logout()` Method

**Current Code:**
```typescript
logout: () => {
  storage.remove("auth_token");
  storage.remove("refresh_token");
  storage.remove("auth_user");
  set({
    isAuthenticated: false,
    refreshToken: null,
    token: null,
    user: null,
  });
},
```

**New Code:**
```typescript
logout: () => {
  storage.remove("auth_token");
  storage.remove("refresh_token");
  storage.remove("auth_user");
  set({
    isAuthenticated: false,
    isInitialized: true, // ← NEW: Stay initialized after logout
    refreshToken: null,
    token: null,
    user: null,
  });
},
```

**Rationale:** Keep `isInitialized: true` after logout. We know the user is explicitly logged out (not just uninitialized).

---

## Verification Steps

1. **TypeScript Compilation:**
```bash
cd apps/admin
npm run type-check
```

2. **ESLint Check:**
```bash
npx eslint src/store/authStore.ts
```

3. **Manual State Inspection:**
   - Open DevTools → Components → useAuthStore
   - Verify initial state shows `isInitialized: false`
   - Call `initializeAuth()` manually
   - Verify `isInitialized` changes to `true`

---

## Common Issues

**Issue:** TypeScript error "Property 'isInitialized' does not exist"
**Fix:** Ensure `isInitialized` added to `AuthState` interface AND initial state object

**Issue:** State not updating in components
**Fix:** Verify Zustand selector syntax: `const { isInitialized } = useAuthStore((state) => ({ isInitialized: state.isInitialized }))`

---

**Phase Status:** Ready to implement
**Next Phase:** Phase 2 - Protected Route Update
