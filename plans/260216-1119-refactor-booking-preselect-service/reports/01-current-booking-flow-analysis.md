# Current Booking Flow Analysis

**Date**: 2026-02-16
**Scope**: Client app booking flow (apps/client)

---

## Current Implementation

### Gallery Card → Booking Flow

**File**: `apps/client/src/components/gallery/GalleryCard.tsx`

**Current behavior**:
- "Đặt Lịch Ngay" button navigates with state:
  ```typescript
  navigate("/booking", {
    state: {
      fromGallery: true,
      galleryItem: item, // GalleryItem object
    },
  });
  ```
- Passes gallery item via navigation state
- GalleryItem has category field matching ServiceCategory

**Data passed**: GalleryItem (title, imageUrl, category, description, price, duration)

### Service Card → Booking Flow

**File**: `apps/client/src/components/services/ServiceCard.tsx`

**Current behavior**:
- "Đặt Dịch Vụ Này" button navigates without state:
  ```typescript
  navigate("/booking"); // NO state passed
  ```
- Does NOT pass service data
- User must re-select service on booking page

**Data NOT passed**: Service object

### Booking Page Logic

**File**: `apps/client/src/hooks/useBookingPage.ts`

**Current flow**:

1. **Gallery navigation handling** (PARTIAL):
   - Reads `location.state.galleryItem`
   - Auto-matches service by category
   - Sets `initialStep = 2` (skip service selection)
   - Pre-selects matching service

2. **Service navigation handling** (MISSING):
   - No state passed from ServiceCard
   - User starts at Step 1
   - Must manually select service again

3. **Step 1: Service Selection**:
   - Shows grid of all services
   - User clicks service card
   - Sets `selectedService` state
   - Updates `form.serviceId`

4. **Step 2: Date/Time**:
   - Shows selected service summary
   - Shows gallery item preview (if from gallery)
   - Date picker + time slots

5. **Step 3: Customer Info**:
   - Form fields: firstName, lastName, email, phone

## Issues Identified

### Issue 1: Inconsistent Pre-selection
- Gallery cards pre-select service by category match
- Service cards force re-selection (poor UX)

### Issue 2: Service Selection Still Present
- Step 1 always shows service grid
- Even when coming from gallery (should skip)
- Requirements: REMOVE service selection UI entirely

### Issue 3: Category Matching Fragility
- Gallery → Service matching by category
- What if multiple services in same category?
- Currently picks first match (arbitrary)

### Issue 4: Edge Cases Not Handled
- Direct navigation to `/booking` (no state)
- Should show error or redirect
- Currently shows Step 1 with empty selection

### Issue 5: Type Safety Gaps
- Gallery passes GalleryItem with string category
- Service needs ServiceCategory enum
- Matching logic assumes alignment

## Current Type Definitions

**Service** (`@repo/types/service.ts`):
```typescript
type Service = {
  _id: string;
  name: string;
  description: string;
  price: number; // number
  duration: number; // minutes
  category: ServiceCategory; // enum
  imageUrl?: string;
  featured?: boolean;
};
```

**GalleryItem** (`@repo/types/gallery.ts`):
```typescript
type GalleryItem = {
  _id: string;
  title: string;
  imageUrl: string;
  category: string; // string (slug)
  description?: string;
  price?: string; // string (e.g., "$45")
  duration?: string; // string (e.g., "45 min")
  featured?: boolean;
};
```

**Category alignment**: GalleryCategory slugs match ServiceCategory values

## Routing Structure

**File**: `apps/client/src/App.tsx`

Routes:
- `/` - HomePage
- `/services` - ServicesPage
- `/gallery` - GalleryPage
- `/booking` - BookingPage (no params, uses location.state)
- `/contact` - ContactPage

**Navigation state** used for passing data between routes (React Router v7)

## Form Validation

**File**: `apps/client/src/lib/validations/booking.validation.ts`

Schema fields:
- `serviceId: string` (required)
- `date: Date` (required)
- `timeSlot: string` (required)
- `customerInfo.firstName: string` (required)
- `customerInfo.lastName: string` (required)
- `customerInfo.email: string` (required, email format)
- `customerInfo.phone: string` (required)

## API Integration

**File**: `apps/client/src/hooks/api/useBookings.ts`

Mutation: `useCreateBooking()`
- Endpoint: `POST /bookings`
- DTO: CreateBookingDto
- Returns: Booking object

**File**: `apps/client/src/hooks/api/useServices.ts`

Query: `useServices({ isActive: true })`
- Endpoint: `GET /services?isActive=true`
- Returns: Service[]

## Unresolved Questions

1. Should direct `/booking` navigation show error or redirect to `/services`?
2. Gallery → Service matching: If multiple services match category, which to select?
3. Should we pass service ID instead of service object in navigation state?
4. Should we add URL params for service pre-selection (e.g., `/booking?service=123`)?
5. What happens if pre-selected service becomes inactive before form submission?

---

**Key Finding**: Gallery flow already implements partial pre-selection, but Service flow missing entirely. Requirements want COMPLETE removal of Step 1 UI, forcing all bookings to come from Gallery or Service pages.
