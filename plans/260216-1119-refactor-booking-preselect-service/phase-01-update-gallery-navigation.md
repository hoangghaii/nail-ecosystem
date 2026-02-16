# Phase 1: Update Gallery Navigation

**Phase ID**: phase-01
**Parent Plan**: [plan.md](./plan.md)
**Dependencies**: None
**Estimated Effort**: 2 hours

---

## Context Links

- **Parent Plan**: `./plan.md`
- **Analysis**: `./reports/01-current-booking-flow-analysis.md`
- **Strategy**: `./reports/02-navigation-strategy.md`
- **Risks**: `./reports/03-implementation-risks.md`
- **Code Standards**: `../../docs/code-standards.md`
- **Types Reference**: `../../docs/shared-types.md`

---

## Overview

**Date**: 2026-02-16
**Description**: Move service matching logic from useBookingPage to GalleryCard component, pass matched service in navigation state
**Priority**: High (blocking phase 3)
**Implementation Status**: 🟡 Not Started
**Review Status**: 🟡 Not Reviewed

---

## Key Insights

**Current behavior**:
- GalleryCard passes only GalleryItem in state
- useBookingPage matches service by category after navigation
- First matching service selected (arbitrary if multiple)

**New behavior**:
- GalleryCard fetches services, matches before navigation
- Passes matched Service object in state
- useBookingPage receives ready-to-use service (no matching needed)

**Rationale**: Service matching is navigation concern, not booking page concern. Separation of concerns.

---

## Requirements

### Functional Requirements

**FR-P1.1**: GalleryCard fetches active services
- Use existing useServices hook
- Filter: `{ isActive: true }`
- Cache handled by TanStack Query

**FR-P1.2**: Match service by category
- Find service where `service.category === galleryItem.category`
- Select first match if multiple services in category
- Handle no-match case (validation error)

**FR-P1.3**: Pass matched service in navigation state
- State structure: `{ fromGallery: true, galleryItem, service }`
- Type-safe navigation state
- Preserve existing galleryItem data

**FR-P1.4**: Validate before navigation
- Service match found (not undefined)
- Service is active
- Show error toast if validation fails

### Non-Functional Requirements

**NFR-P1.1**: Performance
- Leverage TanStack Query cache (services already fetched)
- No additional network delay
- Instant navigation

**NFR-P1.2**: Type Safety
- TypeScript strict mode
- Import types from @repo/types
- Type guard for validation

**NFR-P1.3**: Error Handling
- User-friendly Vietnamese messages
- Non-blocking errors (toast, no crash)

---

## Architecture

### Component Structure

```
GalleryCard (apps/client/src/components/gallery/GalleryCard.tsx)
├── Props: { item: GalleryItem, index: number, onImageClick }
├── Hooks:
│   ├── useNavigate() - React Router navigation
│   └── useServices({ isActive: true }) - Fetch active services [NEW]
├── Functions:
│   ├── handleBookNow() - Navigate to booking [MODIFIED]
│   └── matchServiceByCategory() - Match service [NEW]
└── UI: "Đặt Lịch Ngay" button
```

### Data Flow

```
User clicks "Đặt Lịch Ngay"
  ↓
handleBookNow() triggered
  ↓
Fetch services from cache (useServices)
  ↓
Match service by category
  ↓
Validate service exists & active
  ↓
  ├─ Valid → Navigate with state
  └─ Invalid → Show error toast
```

### Type Definitions

**Navigation State** (create new file):
```typescript
// apps/client/src/types/navigation.ts
import type { GalleryItem, Service } from "@repo/types";

export type BookingNavigationState =
  | {
      fromService: true;
      service: Service;
    }
  | {
      fromGallery: true;
      galleryItem: GalleryItem;
      service: Service; // [NEW] Add matched service
    };
```

---

## Related Code Files

**Primary files to modify**:
1. `apps/client/src/components/gallery/GalleryCard.tsx` (MODIFY)
2. `apps/client/src/types/navigation.ts` (CREATE)

**Reference files**:
1. `apps/client/src/hooks/api/useServices.ts` (READ - existing hook)
2. `packages/types/src/service.ts` (READ - Service type)
3. `packages/types/src/gallery.ts` (READ - GalleryItem type)

---

## Implementation Steps

### Step 1: Create Navigation Types File

**File**: `apps/client/src/types/navigation.ts` (NEW)

```typescript
import type { GalleryItem, Service } from "@repo/types";

/**
 * Navigation state for BookingPage
 * Supports navigation from Services or Gallery pages
 */
export type BookingNavigationState =
  | {
      fromService: true;
      service: Service;
    }
  | {
      fromGallery: true;
      galleryItem: GalleryItem;
      service: Service;
    };

/**
 * Type guard for validating BookingNavigationState
 */
export function isValidBookingState(
  state: unknown
): state is BookingNavigationState {
  if (!state || typeof state !== "object") return false;

  const s = state as any;

  if (s.fromService === true) {
    return (
      !!s.service &&
      typeof s.service._id === "string" &&
      typeof s.service.name === "string"
    );
  }

  if (s.fromGallery === true) {
    return (
      !!s.galleryItem &&
      typeof s.galleryItem._id === "string" &&
      !!s.service &&
      typeof s.service._id === "string"
    );
  }

  return false;
}
```

**Validation**: TypeScript compiles without errors

---

### Step 2: Update GalleryCard Component

**File**: `apps/client/src/components/gallery/GalleryCard.tsx`

**Changes**:

1. **Add imports**:
```typescript
import { useServices } from "@/hooks/api/useServices"; // NEW
import { toast } from "sonner"; // NEW
import type { Service } from "@repo/types/service"; // NEW
```

2. **Add useServices hook**:
```typescript
export function GalleryCard({ index, item, onImageClick }: GalleryCardProps) {
  const navigate = useNavigate();

  // Fetch active services for matching
  const { data: services = [] } = useServices({ isActive: true });

  // ... rest of component
}
```

3. **Replace handleBookNow function**:

**OLD**:
```typescript
const handleBookNow = () => {
  navigate("/booking", {
    state: {
      fromGallery: true,
      galleryItem: item,
    },
  });
};
```

**NEW**:
```typescript
const handleBookNow = () => {
  // Match service by category
  const matchedService = services.find(
    (service: Service) => service.category === item.category
  );

  // Validate service found
  if (!matchedService) {
    toast.error(
      "Không tìm thấy dịch vụ phù hợp. Vui lòng liên hệ với chúng tôi."
    );
    return;
  }

  // Navigate with matched service
  navigate("/booking", {
    state: {
      fromGallery: true,
      galleryItem: item,
      service: matchedService,
    },
  });
};
```

**Validation**:
- TypeScript compiles
- Service type matches @repo/types/service
- Navigation state structure correct

---

### Step 3: Add Loading State (Optional)

**Consideration**: Services loaded on app start (HomePage prefetch), cache hit likely

**Decision**: Skip loading state (YAGNI). TanStack Query handles this gracefully.

**If needed later**:
```typescript
const { data: services = [], isLoading } = useServices({ isActive: true });

// In Button
<Button disabled={isLoading} onClick={handleBookNow}>
  {isLoading ? "Đang tải..." : "Đặt Lịch Ngay"}
</Button>
```

---

### Step 4: Update Imports in GalleryCard

**Final import block**:
```typescript
import { Clock, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // NEW

import type { GalleryItem } from "@/types";
import type { Service } from "@repo/types/service"; // NEW

import { LazyImage } from "@/components/shared/LazyImage";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/api/useServices"; // NEW
```

---

### Step 5: Manual Testing

**Test Case 1: Gallery → Booking (Valid)**
1. Navigate to `/gallery`
2. Select any category filter
3. Click "Đặt Lịch Ngay" on gallery card
4. **Expected**: Navigate to `/booking`, service pre-selected

**Test Case 2: Gallery → Booking (No Matching Service)**
1. Create gallery item with category "test-category" (no matching service)
2. Click "Đặt Lịch Ngay"
3. **Expected**: Toast error, no navigation

**Test Case 3: Services Already Cached**
1. Navigate to `/services` first (loads services)
2. Navigate to `/gallery`
3. Click "Đặt Lịch Ngay"
4. **Expected**: Instant navigation (cached services)

---

## Todo List

**Pre-implementation**:
- [ ] Read current GalleryCard implementation
- [ ] Read useServices hook implementation
- [ ] Verify TanStack Query cache strategy

**Implementation**:
- [ ] Create `apps/client/src/types/navigation.ts`
- [ ] Add `isValidBookingState` type guard
- [ ] Import useServices in GalleryCard
- [ ] Update handleBookNow function
- [ ] Add service matching logic
- [ ] Add validation and error handling
- [ ] Update imports

**Testing**:
- [ ] TypeScript compilation passes
- [ ] Test Gallery → Booking (happy path)
- [ ] Test Gallery → Booking (no matching service)
- [ ] Test with cached services
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Verify no console errors

**Documentation**:
- [ ] Add JSDoc to navigation.ts types
- [ ] Update GalleryCard component comments
- [ ] Document category matching logic

---

## Success Criteria

**Phase 1 complete when**:
- [ ] GalleryCard passes service in navigation state
- [ ] Service matched by category before navigation
- [ ] Error toast shown if no matching service
- [ ] TypeScript types correct (no `any`)
- [ ] No regression in existing gallery display
- [ ] Manual tests pass (3/3 test cases)
- [ ] Code reviewed and approved

---

## Risk Assessment

**Risks specific to Phase 1**:

1. **Breaking existing gallery flow** (HIGH)
   - Mitigation: Preserve all existing state fields
   - Test: Existing gallery features (lightbox, filters)

2. **Multiple services in same category** (MEDIUM)
   - Mitigation: Document "first match" behavior
   - Future: Add service picker if needed

3. **Service fetch delay** (LOW)
   - Mitigation: TanStack Query cache (prefetched)
   - Monitoring: Check Network tab for cache hits

---

## Security Considerations

**Input validation**:
- Validate service category matches allowed values
- Type guard prevents malformed state

**XSS protection**:
- React handles escaping (no dangerouslySetInnerHTML)
- Service data from API (trusted source)

**Data integrity**:
- Service matching logic deterministic
- No user input in matching process

---

## Next Steps

**After Phase 1 completion**:
1. Proceed to Phase 2 (Update Services Navigation)
2. Phase 1 changes are backward compatible
3. Can deploy Phase 1 independently (gallery flow improved)

**Validation before Phase 2**:
- Gallery → Booking navigation working
- Service object in state structure correct
- Ready for useBookingPage refactor (Phase 3)

---

**Status**: Ready for implementation
**Blocked by**: None
**Blocking**: Phase 3 (needs navigation state structure)
