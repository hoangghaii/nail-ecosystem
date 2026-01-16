# Phase 2: API Client Integration

**Plan**: 260116-2009-integrate-business-info-api
**Phase**: 2 of 7
**Effort**: 30 minutes

---

## Objective

Create API client functions and React Query hooks to fetch business info from backend.

---

## Tasks

### 1. Create API Client Function
**File**: `apps/client/src/api/businessInfo.ts` (new)

```typescript
import { BusinessInfoResponse } from '@repo/types/business-info';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getBusinessInfo(): Promise<BusinessInfoResponse> {
  const response = await fetch(`${API_BASE}/business-info`);

  if (!response.ok) {
    throw new Error(`Failed to fetch business info: ${response.statusText}`);
  }

  return response.json();
}
```

### 2. Create React Query Hook
**File**: `apps/client/src/hooks/useBusinessInfo.ts` (new)

```typescript
import { useQuery } from '@tanstack/react-query';
import { getBusinessInfo } from '@/api/businessInfo';

export function useBusinessInfo() {
  return useQuery({
    queryKey: ['businessInfo'],
    queryFn: getBusinessInfo,
    staleTime: 1000 * 60 * 60,      // 1 hour (rarely changes)
    gcTime: 1000 * 60 * 60 * 24,     // 24 hours
    retry: 3,                         // Retry 3 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

---

## Validation

- [ ] TypeScript recognizes imported types from `@repo/types`
- [ ] No TypeScript errors in new files
- [ ] API base URL environment variable exists
- [ ] Type-check passes: `npm run type-check`

---

## Notes

- Public endpoint, no auth required
- Aggressive caching (1h stale time) since business info rarely changes
- Exponential backoff retry strategy
- Error handling via React Query built-in mechanisms
