# Navigation Strategy

**Date**: 2026-02-16
**Scope**: Navigation patterns for pre-selected service booking

---

## Requirements Summary

1. REMOVE Step 1 (service selection UI) from BookingPage entirely
2. ALL bookings must originate from Gallery or Services pages
3. Service data passed via navigation state
4. Display selected service as read-only on BookingPage
5. Handle edge case: direct `/booking` navigation

---

## Proposed Navigation Strategy

### Strategy 1: Navigation State (React Router) - RECOMMENDED

**Approach**: Pass service object via `navigate()` state parameter

**Advantages**:
- Type-safe with TypeScript
- No URL pollution
- Supports complex objects
- Already partially implemented (Gallery flow)
- Consistent with React Router v7 patterns

**Disadvantages**:
- State lost on page refresh
- Not shareable via URL
- Requires navigation from specific pages

**Implementation**:
```typescript
// ServiceCard.tsx
navigate("/booking", {
  state: {
    fromService: true,
    service: service, // Full Service object
  },
});

// GalleryCard.tsx
navigate("/booking", {
  state: {
    fromGallery: true,
    galleryItem: galleryItem, // GalleryItem
    service: matchedService, // Matched Service object
  },
});
```

### Strategy 2: URL Query Parameters

**Approach**: Pass service ID via URL params (`/booking?serviceId=123`)

**Advantages**:
- Shareable URLs
- Persists on refresh
- SEO-friendly
- Bookmarkable

**Disadvantages**:
- Requires extra API call to fetch service by ID
- URL can be manipulated
- Less type-safe
- More complex validation

**Not recommended** for this use case (no requirement for shareable booking links)

### Strategy 3: Zustand Global State

**Approach**: Store selected service in Zustand store, navigate to `/booking`

**Advantages**:
- Persists across navigation
- Centralized state management
- Type-safe

**Disadvantages**:
- Over-engineered for simple navigation
- Requires state cleanup
- Lost on page refresh (unless persisted)
- Adds complexity

**Not recommended** (YAGNI - navigation state sufficient)

---

## Selected Strategy: Navigation State

### Rationale

1. **Already partially implemented**: Gallery flow uses this pattern
2. **Aligns with requirements**: No need for shareable URLs
3. **Type-safe**: TypeScript validates state objects
4. **Simple**: KISS principle, minimal changes
5. **React Router standard**: Best practice for v7

### Navigation State Structure

**From Services Page**:
```typescript
interface ServiceNavigationState {
  fromService: true;
  service: Service; // Full Service object
}
```

**From Gallery Page**:
```typescript
interface GalleryNavigationState {
  fromGallery: true;
  galleryItem: GalleryItem; // Gallery item
  service: Service; // Matched Service object
}
```

**Type definition** (new file: `apps/client/src/types/navigation.ts`):
```typescript
import type { GalleryItem, Service } from "@repo/types";

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
```

### Type Guard

```typescript
function isValidBookingState(
  state: unknown
): state is BookingNavigationState {
  if (!state || typeof state !== "object") return false;

  const s = state as any;

  if (s.fromService) {
    return !!s.service && typeof s.service._id === "string";
  }

  if (s.fromGallery) {
    return (
      !!s.galleryItem &&
      !!s.service &&
      typeof s.service._id === "string"
    );
  }

  return false;
}
```

---

## Edge Case Handling

### Case 1: Direct Navigation to `/booking`

**Scenario**: User types `/booking` in URL bar or refreshes page

**Detection**:
```typescript
const state = location.state;
if (!state || !isValidBookingState(state)) {
  // No valid state
}
```

**Solution Options**:

**Option A: Redirect to Services** (RECOMMENDED)
- Redirect user to `/services` with toast message
- Message: "Vui lòng chọn dịch vụ trước khi đặt lịch"
- Smooth UX, guides user to correct flow

**Option B: Show Error Page**
- Display error message with link to services
- More disruptive, less friendly

**Recommended**: Option A (auto-redirect)

### Case 2: Invalid Service ID

**Scenario**: Service deleted/deactivated between navigation and booking

**Detection**: Service ID in state doesn't exist in fetched services

**Solution**:
- Show error toast
- Redirect to `/services`
- Message: "Dịch vụ không khả dụng. Vui lòng chọn dịch vụ khác"

### Case 3: Page Refresh

**Scenario**: User refreshes BookingPage mid-form

**Impact**: Navigation state lost, form data lost

**Mitigation**:
- Accept this limitation (standard SPA behavior)
- Consider localStorage for draft bookings (YAGNI for v1)
- Show "session expired" message + redirect

---

## Migration Path from Current Implementation

### Gallery Flow (Already Partial)

**Current**:
```typescript
navigate("/booking", {
  state: { fromGallery: true, galleryItem: item },
});
// useBookingPage matches service by category
```

**New**:
```typescript
const matchedService = services.find(s => s.category === item.category);
navigate("/booking", {
  state: {
    fromGallery: true,
    galleryItem: item,
    service: matchedService, // Pass matched service
  },
});
```

**Change**: Move service matching from useBookingPage to GalleryCard

### Service Flow (New Implementation)

**Current**:
```typescript
navigate("/booking"); // No state
```

**New**:
```typescript
navigate("/booking", {
  state: {
    fromService: true,
    service: service, // Pass full service
  },
});
```

**Change**: Add state parameter with service object

---

## Component Updates Required

### ServiceCard Component
- Add: Pass service in navigation state
- Remove: None

### GalleryCard Component
- Add: Fetch services data (useServices hook)
- Add: Match service by category before navigation
- Add: Pass matched service in state
- Modify: Error handling if no matching service

### BookingPage Component
- Remove: Entire Step 1 JSX (service selection grid)
- Add: Read service from location.state
- Add: Validate state on mount
- Add: Redirect logic for invalid state
- Modify: Step progression (start at Step 1: Date/Time)

### useBookingPage Hook
- Remove: Service matching logic (move to GalleryCard)
- Remove: Step 1 logic
- Add: State validation
- Add: Redirect on invalid state
- Modify: Initial step calculation
- Modify: canProceed() validation (skip Step 1)

---

## Validation Strategy

### On Navigation
- ServiceCard: Validate service exists before navigate
- GalleryCard: Validate matched service exists before navigate
- Show error toast if validation fails

### On BookingPage Mount
- Validate location.state structure
- Validate service object completeness
- Redirect to `/services` if invalid

### During Form Flow
- Existing validation remains (Zod schema)
- ServiceId always pre-filled, read-only
- User cannot change service (intentional)

---

## Unresolved Questions

1. Should we show "Change Service" link on BookingPage to go back?
2. If multiple services match gallery category, show picker or select first?
3. Should we track booking funnel analytics (which page initiated booking)?
4. Should we preserve form data in localStorage for refresh recovery?

---

**Recommendation**: Implement Strategy 1 (Navigation State) with Option A (redirect) for edge cases. Aligns with KISS, type-safe, minimal changes.
