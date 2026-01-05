# Phase 2: Protected Route Update

**File:** `apps/admin/src/components/auth/ProtectedRoute.tsx`
**Estimated Time:** 5 minutes

---

## Changes Required

### Current Implementation

```typescript
import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

**Problem:** Checks `isAuthenticated` immediately on mount, before `initializeAuth()` runs.

---

### New Implementation

```typescript
import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isInitialized: state.isInitialized,
  }));

  // Wait for auth initialization to complete
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // After initialization, check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

**Key Changes:**
1. Read both `isAuthenticated` AND `isInitialized` from store
2. Show loading UI while `!isInitialized`
3. Only check auth status after initialization completes

---

## Loading UI Design

**Default Spinner (Recommended):**
```typescript
<div className="flex h-screen items-center justify-center">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
</div>
```

**Why This Design:**
- Simple spinner - no text needed (perceived delay < 100ms)
- Tailwind `animate-spin` - no dependencies
- Uses `border-primary` - matches admin blue theme
- Centered layout - consistent with design system
- Minimal DOM - fast rendering

**Alternative: Null Render (No Loading UI)**
```typescript
if (!isInitialized) {
  return null;
}
```
**Pros:** No flicker, instant
**Cons:** Might show blank screen briefly

**Alternative: Dot Loader**
```typescript
if (!isInitialized) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      </div>
    </div>
  );
}
```
**Pros:** More subtle, playful
**Cons:** Slightly more complex

---

## Flow Diagram

```
User reloads page
    ↓
App.tsx renders
    ↓
ProtectedRoute renders
    ↓
Check: isInitialized?
    ├─ false → Show loading spinner
    │           ↓
    │       Wait for initializeAuth()
    │           ↓
    │       State updates: isInitialized = true
    │           ↓
    │       Re-render ProtectedRoute
    │           ↓
    └─ true → Check: isAuthenticated?
                ├─ true → Render <Outlet /> (protected content)
                └─ false → <Navigate to="/login" />
```

---

## Verification Steps

1. **Visual Check:**
   - Reload page while logged in
   - Should NOT see spinner (< 100ms)
   - Should stay on current page

2. **TypeScript Check:**
```bash
cd apps/admin
npm run type-check
```

3. **ESLint Check:**
```bash
npx eslint src/components/auth/ProtectedRoute.tsx
```

4. **DevTools Timeline:**
   - Open DevTools → Performance
   - Record page reload
   - Verify initialization time < 50ms

---

## Common Issues

**Issue:** Spinner visible for too long (> 200ms)
**Cause:** initializeAuth() not being called in App.tsx useEffect
**Fix:** Verify App.tsx has `useEffect(() => { initializeAuth() }, [initializeAuth])`

**Issue:** Infinite redirect loop
**Cause:** `isInitialized` never set to true
**Fix:** Check Phase 1 - ensure all store methods set the flag

**Issue:** Spinner shows on every route change
**Cause:** Multiple ProtectedRoute instances
**Fix:** This is expected - each route checks auth independently

**Issue:** TypeScript error on Zustand selector
**Fix:** Use object selector syntax:
```typescript
const { isAuthenticated, isInitialized } = useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isInitialized: state.isInitialized,
}));
```

---

## Performance Considerations

**Expected Timing:**
- localStorage read: < 10ms
- Zustand state update: < 5ms
- React re-render: < 20ms
- **Total initialization: < 50ms**

**Spinner Visibility:**
- Most users: Not visible (< 100ms threshold)
- Slow devices: Brief flicker (100-200ms)
- Very slow devices: Visible spinner (> 200ms)

**Optimization (if needed):**
Add minimum display time to prevent flicker:
```typescript
const [minTimeElapsed, setMinTimeElapsed] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setMinTimeElapsed(true), 50);
  return () => clearTimeout(timer);
}, []);

if (!isInitialized || !minTimeElapsed) {
  return <LoadingSpinner />;
}
```

---

**Phase Status:** Ready to implement
**Previous Phase:** Phase 1 - Auth Store Update
**Next Step:** Testing & Validation
