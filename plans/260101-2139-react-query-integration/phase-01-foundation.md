# Phase 1: Foundation

**Priority**: P0 (Critical Path)
**Blockers**: None
**Estimated Time**: 2-3 hours
**Status**: ✅ COMPLETED (2026-01-01)

---

## Overview

Establish React Query infrastructure: shared query key factory, QueryClient configurations for both apps, and DevTools setup. This phase creates the foundation for all subsequent query/mutation hooks.

---

## Tasks

### Task 1: Create Query Keys Factory
**File**: `packages/utils/src/api/queryKeys.ts`
**Time**: 30 minutes

```typescript
/**
 * Centralized query key factory for React Query
 * Provides type-safe, hierarchical query keys for all resources
 */

export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Services (nail salon services)
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters?: { category?: string }) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },

  // Gallery items
  gallery: {
    all: ['gallery'] as const,
    lists: () => [...queryKeys.gallery.all, 'list'] as const,
    list: (filters?: { featured?: boolean }) =>
      [...queryKeys.gallery.lists(), filters] as const,
    details: () => [...queryKeys.gallery.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
  },

  // Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters?: { status?: string; dateFrom?: string; dateTo?: string }) =>
      [...queryKeys.bookings.lists(), filters] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
  },

  // Banners
  banners: {
    all: ['banners'] as const,
    lists: () => [...queryKeys.banners.all, 'list'] as const,
    details: () => [...queryKeys.banners.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.banners.details(), id] as const,
  },

  // Contact submissions
  contacts: {
    all: ['contacts'] as const,
    lists: () => [...queryKeys.contacts.all, 'list'] as const,
    list: (filters?: { status?: string }) =>
      [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
  },

  // Business info (singleton)
  businessInfo: {
    all: ['businessInfo'] as const,
    detail: () => [...queryKeys.businessInfo.all, 'detail'] as const,
  },

  // Hero settings (singleton)
  heroSettings: {
    all: ['heroSettings'] as const,
    detail: () => [...queryKeys.heroSettings.all, 'detail'] as const,
  },
} as const;
```

**Validation**:
- [x] File created successfully
- [x] TypeScript compiles
- [x] All resources have keys defined
- [x] Keys are properly typed (as const)

---

### Task 2: Update Shared Package Exports
**File**: `packages/utils/src/api/index.ts`
**Time**: 5 minutes

```typescript
// Existing exports
export { ApiError } from './apiError';

// New export
export { queryKeys } from './queryKeys';
```

**Validation**:
- [x] Export added
- [x] TypeScript compiles
- [x] No circular dependencies

---

### Task 3: Install React Query DevTools
**Command**: Run in project root
**Time**: 5 minutes

```bash
npm install -D @tanstack/react-query-devtools@^5.90.11
```

**Validation**:
- [x] DevTools installed in both apps (check package.json)
- [x] Version matches react-query version (5.90.11)
- [x] `npm run type-check` passes

---

### Task 4: Create Admin QueryClient Config
**File**: `apps/admin/src/lib/queryClient.ts`
**Time**: 30 minutes

```typescript
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@repo/utils/api';

/**
 * Admin QueryClient Configuration
 *
 * Optimized for admin users who need:
 * - Fresh data (frequent changes)
 * - Aggressive refetching (manage business)
 * - Quick error feedback (toast notifications)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache config
      staleTime: 30_000, // 30s - admin data changes frequently
      gcTime: 5 * 60_000, // 5min - moderate cache retention

      // Retry config
      retry: 1, // Retry once on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch config
      refetchOnWindowFocus: true, // Admin users switch tabs often
      refetchOnReconnect: true, // Refresh on network recovery
      refetchOnMount: true, // Refetch when component mounts

      // Error handling
      throwOnError: false, // Handle errors in components
    },

    mutations: {
      // Retry config
      retry: 0, // Don't retry mutations (could cause duplicates)

      // Global error handler
      onError: (error) => {
        console.error('[Mutation Error]', error);

        if (ApiError.isApiError(error)) {
          // Show user-friendly error message
          toast.error(error.getUserMessage());
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  },
});
```

**Validation**:
- [x] File created
- [x] TypeScript compiles
- [x] Imports resolve correctly
- [x] Default options set

---

### Task 5: Create Client QueryClient Config
**File**: `apps/client/src/lib/queryClient.ts`
**Time**: 30 minutes

```typescript
import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/utils/api';

/**
 * Client QueryClient Configuration
 *
 * Optimized for customers who need:
 * - Longer cache (data rarely changes)
 * - Less aggressive refetching (better UX)
 * - Customer-friendly error messages
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache config
      staleTime: 5 * 60_000, // 5min - customer data rarely changes
      gcTime: 10 * 60_000, // 10min - longer cache for better UX

      // Retry config
      retry: 2, // More retries for public users (network issues)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch config
      refetchOnWindowFocus: false, // Less aggressive for customers
      refetchOnReconnect: true, // Refresh on network recovery
      refetchOnMount: true, // Refetch when component mounts

      // Error handling
      throwOnError: false, // Handle errors in components
    },

    mutations: {
      // Retry config
      retry: 1, // Retry booking submissions once

      // Global error handler
      onError: (error) => {
        console.error('[Mutation Error]', error);

        if (ApiError.isApiError(error)) {
          // Customer-friendly error messages
          const message = error.getUserMessage();
          // TODO: Show error in customer-appropriate UI (not toast)
          console.error(message);
        } else if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unexpected error occurred');
        }
      },
    },
  },
});
```

**Validation**:
- [x] File created
- [x] TypeScript compiles
- [x] Imports resolve correctly
- [x] Config differs from admin (longer cache, less refetching)

---

### Task 6: Setup Admin QueryClientProvider
**File**: `apps/admin/src/main.tsx`
**Time**: 15 minutes

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  </StrictMode>
);
```

**Validation**:
- [x] QueryClientProvider wraps App
- [x] DevTools visible in dev mode (bottom-left button)
- [x] DevTools hidden in production build
- [x] App still loads correctly

---

### Task 7: Setup Client QueryClientProvider
**File**: `apps/client/src/main.tsx`
**Time**: 15 minutes

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  </StrictMode>
);
```

**Validation**:
- [x] QueryClientProvider wraps App
- [x] DevTools visible in dev mode (bottom-right button)
- [x] DevTools hidden in production build
- [x] App still loads correctly

---

## Testing Checklist

### Development Environment
- [x] Run `npm run dev` in admin app
- [x] DevTools button appears (bottom-left)
- [x] Click DevTools - panel opens
- [x] No queries show yet (expected)
- [x] No console errors

- [x] Run `npm run dev` in client app
- [x] DevTools button appears (bottom-right)
- [x] Click DevTools - panel opens
- [x] No queries show yet (expected)
- [x] No console errors

### Build Verification
- [x] Run `npm run build` for both apps
- [x] Build succeeds
- [x] DevTools tree-shaken from production bundle
- [x] Check bundle size (should be ~13kb larger)

### TypeScript
- [x] Run `npm run type-check` from root
- [x] All apps compile successfully
- [x] No type errors related to new files

---

## Troubleshooting

### DevTools not showing
- Check `import.meta.env.DEV` is true
- Verify DevTools installed in package.json
- Clear browser cache and hard reload

### Import errors
- Run `npm install` from root
- Check path aliases in tsconfig.json
- Verify @repo/utils exports queryKeys

### Type errors
- Ensure TypeScript version matches (5.9.3)
- Check `as const` on query key definitions
- Verify @tanstack/react-query version (5.90.11)

---

## Rollback

If issues found:

```bash
# Revert main.tsx changes
git checkout apps/admin/src/main.tsx apps/client/src/main.tsx

# Remove QueryClient configs
rm apps/admin/src/lib/queryClient.ts
rm apps/client/src/lib/queryClient.ts

# Remove query keys
rm packages/utils/src/api/queryKeys.ts
```

---

## Success Criteria

- [x] Query keys factory created and exported
- [x] DevTools installed in both apps
- [x] Admin QueryClient configured (30s stale, refetch on focus)
- [x] Client QueryClient configured (5min stale, no focus refetch)
- [x] QueryClientProvider wraps both apps
- [x] DevTools visible in development
- [x] No TypeScript errors
- [x] Both apps run successfully
