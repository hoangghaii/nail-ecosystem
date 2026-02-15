# Phase 2: Client Services Migration

**Estimated Effort:** 2-3 hours
**Status:** Not Started
**Priority:** HIGH

---

## Overview

Migrate client ServicesPage from frontend filtering to backend filtering.

**Current:** Hardcoded `servicesData` with frontend category filtering
**Target:** Backend API filtering via query parameters

---

## Current State Analysis

### Files Affected

- `apps/client/src/pages/ServicesPage.tsx` - UI component
- `apps/client/src/hooks/useServicesPage.ts` - Business logic hook
- `apps/client/src/services/services.service.ts` - API service
- `apps/client/src/hooks/api/useServices.ts` - React Query hook
- `apps/client/src/data/services.ts` - **TO DELETE** (hardcoded data)

### Current Flow

```typescript
// useServicesPage.ts - FRONTEND FILTERING
import { servicesData } from '@/data/services'; // Hardcoded!

const filteredServices = selectedCategory === 'all'
  ? servicesData
  : servicesData.filter((service) => service.category === selectedCategory);
```

**Problems:**

- Uses hardcoded data instead of API
- Frontend filtering (not scalable)
- Data can become stale
- No pagination support

---

## Implementation Steps

### Step 1: Backend Validation (15 min)

Verify backend API supports filtering.

**Test Commands:**

```bash
# All services
curl http://localhost:3000/api/services

# Filter by category
curl http://localhost:3000/api/services?category=manicure

# Featured services
curl http://localhost:3000/api/services?featured=true

# Active services only
curl http://localhost:3000/api/services?isActive=true

# Combined filters
curl http://localhost:3000/api/services?category=pedicure&isActive=true
```

**Verify Response Format:**

```json
{
  "data": [
    {
      "_id": "...",
      "name": "Classic Manicure",
      "category": "manicure",
      "price": 25000,
      "duration": 45,
      "featured": true,
      "isActive": true
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Step 2: Update Service Layer (45 min)

**File:** `apps/client/src/services/services.service.ts`

**Add Query Params Interface:**

```typescript
import type { Service, ServiceCategory } from '@repo/types/service';
import type { PaginationResponse } from '@repo/types/pagination';
import { apiClient } from '@/lib/apiClient';

export interface ServicesQueryParams {
  category?: ServiceCategory;
  featured?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export class ServicesService {
  async getAll(params?: ServicesQueryParams): Promise<Service[]> {
    const queryString = this.buildQueryString(params);
    const response = await apiClient.get<PaginationResponse<Service>>(
      `/services${queryString}`
    );
    return response.data; // Extract array from pagination wrapper
  }

  async getById(id: string): Promise<Service> {
    return apiClient.get<Service>(`/services/${id}`);
  }

  // Remove getByCategory - redundant with getAll({ category })

  private buildQueryString(params?: ServicesQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.featured !== undefined) searchParams.set('featured', String(params.featured));
    if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }
}

export const servicesService = new ServicesService();
```

### Step 3: Update Hook Layer (30 min)

**File:** `apps/client/src/hooks/api/useServices.ts`

**Update useServices Hook:**

```typescript
import type { ServiceCategory } from '@repo/types/service';
import type { ServicesQueryParams } from '@/services/services.service';

import { queryKeys } from '@repo/utils/api';
import { useQuery } from '@tanstack/react-query';

import { servicesService } from '@/services/services.service';

/**
 * Query: Get all services with optional filters
 */
export function useServices(params?: ServicesQueryParams) {
  return useQuery({
    queryFn: () => servicesService.getAll(params),
    queryKey: queryKeys.services.list(params),
    staleTime: 30_000, // Cache for 30 seconds
  });
}

/**
 * Query: Get service by ID
 */
export function useService(id: string | undefined) {
  return useQuery({
    enabled: !!id,
    queryFn: () => servicesService.getById(id!),
    queryKey: queryKeys.services.detail(id!),
  });
}

// DELETE useServicesByCategory - redundant
```

### Step 4: Update Page Hook (45 min)

**File:** `apps/client/src/hooks/useServicesPage.ts`

**Migrate to Backend Filtering:**

```typescript
import { useState } from 'react';
import { ServiceCategory } from '@repo/types/service';
import { useServices } from './api/useServices';

// Keep static categories (no need to fetch from API - YAGNI)
const categories = [
  { label: 'Tất Cả Dịch Vụ', value: 'all' },
  { label: 'Làm Móng Tay', value: ServiceCategory.MANICURE },
  { label: 'Làm Móng Chân', value: ServiceCategory.PEDICURE },
  { label: 'Nghệ Thuật Nail', value: ServiceCategory.NAIL_ART },
  { label: 'Nối Móng', value: ServiceCategory.EXTENSIONS },
  { label: 'Spa', value: ServiceCategory.SPA },
];

export function useServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Backend filtering - pass category to API
  const { data: services = [], isLoading } = useServices({
    category: selectedCategory !== 'all'
      ? (selectedCategory as ServiceCategory)
      : undefined,
    isActive: true, // Only show active services to customers
  });

  return {
    categories,
    filteredServices: services, // Already filtered by backend
    isLoading,
    selectedCategory,
    setSelectedCategory,
  };
}
```

**DELETE:**

- Remove `import { servicesData } from '@/data/services'`
- Remove frontend filtering logic

### Step 5: Update Page Component (30 min)

**File:** `apps/client/src/pages/ServicesPage.tsx`

**Add Loading State:**

```typescript
export function ServicesPage() {
  const {
    categories,
    filteredServices,
    isLoading, // NEW: Add loading state
    selectedCategory,
    setSelectedCategory,
  } = useServicesPage();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Breadcrumb />
        <PageHeader /* ... */ />

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button /* ... */ />
          ))}
        </div>

        {/* Loading State - NEW */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 font-sans text-lg text-muted-foreground">
              Đang tải dịch vụ...
            </p>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service._id} index={index} service={service} />
              ))}
            </div>

            {/* No results message */}
            {filteredServices.length === 0 && (
              <motion.div /* ... */>
                <p className="font-sans text-lg text-muted-foreground">
                  Không tìm thấy dịch vụ nào trong danh mục này.
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <motion.div /* ... */ />
      </div>
    </div>
  );
}
```

### Step 6: Update FeaturedServices (15 min)

**File:** `apps/client/src/components/home/ServicesOverview.tsx`

Verify it uses backend filtering for featured services.

**Expected:**

```typescript
const { data: services = [] } = useServices({
  featured: true,
  isActive: true,
  limit: 6
});
```

If using hardcoded data, update to use hook.

### Step 7: Delete Hardcoded Data (5 min)

**File:** `apps/client/src/data/services.ts`

**DELETE entire file** after verifying all imports removed:

```bash
# Find any remaining imports
grep -r "from '@/data/services'" apps/client/src

# Should return nothing - safe to delete
rm apps/client/src/data/services.ts
```

### Step 8: Testing (30 min)

**Type Check:**

```bash
npm run type-check
```

**Build:**

```bash
npm run build
```

**Manual Tests:**

1. Navigate to `/services`
2. Click "Tất Cả Dịch Vụ" - should show all active services
3. Click each category filter - should show filtered services
4. Verify loading state displays
5. Verify empty state if category has no services
6. Check homepage featured services still work
7. Verify service detail pages still work

**API Monitoring:**

```bash
# Open DevTools Network tab
# Verify requests:
GET /api/services?isActive=true (for "all")
GET /api/services?category=manicure&isActive=true (for category)
```

---

## Success Criteria

- [ ] No hardcoded `servicesData` imports
- [ ] Backend API filtering works for all categories
- [ ] Loading state displays correctly
- [ ] Empty state displays correctly
- [ ] Only active services shown
- [ ] Featured services on homepage use backend filter
- [ ] No TypeScript errors
- [ ] Build passes
- [ ] No duplicate API calls

---

## Rollback Plan

```bash
# Restore hardcoded data approach
git checkout HEAD~1 -- apps/client/src/hooks/useServicesPage.ts
git checkout HEAD~1 -- apps/client/src/data/services.ts
```

---

**Dependencies:** Backend API (already ready)
**Blocks:** Nothing
