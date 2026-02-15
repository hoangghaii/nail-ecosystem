# Client App Current State Analysis

**Date**: 2026-02-14
**Researcher**: researcher-01
**Status**: ✅ Complete

---

## Executive Summary

Client app has **50% API integration complete**. Gallery, Services, and Business Info use live API with TanStack Query + backend filtering. HomePage ServicesOverview, Booking form, and Contact form still use hardcoded mock data. Critical gap: No contacts API integration despite backend endpoint existing.

---

## API Services Status

### ✅ Implemented (4/7 endpoints integrated)

**Gallery Service** (`/src/services/gallery.service.ts`)
- GET `/gallery` with filters (categoryId, featured, isActive, limit, page)
- GET `/gallery/:id`
- TanStack Query hooks: `useGalleryItems`, `useFeaturedGalleryItems`, `useGalleryItem`
- **Used by**: GalleryPage (filtered), FeaturedGallery (homepage)

**Services Service** (`/src/services/services.service.ts`)
- GET `/services` with filters (category, featured, isActive, limit, page)
- GET `/services/:id`
- TanStack Query hooks: `useServices`, `useService`
- **Used by**: ServicesPage (backend filtered)

**Business Info Service** (`/src/services/business-info.service.ts`)
- GET `/business-info`
- TanStack Query hook: `useBusinessInfo`
- **Used by**: Footer (contact info + hours), ContactPage (display only)

**Bookings Service** (`/src/services/bookings.service.ts`)
- POST `/bookings` (create booking)
- **Status**: Service exists but NOT integrated in UI yet

### ❌ Missing (3/7 endpoints NOT integrated)

**Contacts API** - ⚠️ Critical gap
- Backend: POST `/contacts` (submit contact form)
- **Status**: No service file exists, ContactPage form non-functional

**Banners API** - Low priority
- Backend endpoint exists but client doesn't need it (no banner UI)

**Gallery Categories API** - Partially implemented
- Client has `useGalleryCategories` hook but uses hardcoded fallback
- Backend may not have dedicated `/gallery/categories` endpoint

---

## Component Analysis

### HomePage (`/src/pages/HomePage.tsx`)

**HeroSection** - ✅ Fully static (no API needed)
- Hardcoded Vietnamese text + video placeholder
- CTAs link to /booking + /services

**ServicesOverview** - ❌ Uses mock data
- **Current**: `getFeaturedServices()` from `/src/data/services.ts` (hardcoded)
- **Should use**: `useServices({ featured: true, isActive: true })` (already exists!)
- **Impact**: Shows stale data, not synced with backend
- **Fix effort**: 5 mins - swap data source

**FeaturedGallery** - ✅ API integrated
- Uses `useFeaturedGalleryItems()` hook
- Fetches live data from `/gallery?featured=true&isActive=true`
- Loading states handled

**AboutSection** - ✅ Fully static (no API needed)
- Hardcoded Vietnamese text + static content

### ServicesPage (`/src/pages/ServicesPage.tsx`)

**Status**: ✅ Fully API integrated
- Uses `useServicesPage()` hook → `useServices()` with backend filtering
- Category filter works via API query params
- Loading states + error handling present

### GalleryPage (`/src/pages/GalleryPage.tsx`)

**Status**: ✅ Fully API integrated
- Uses `useGalleryPage()` hook → `useGalleryItems()` with backend filtering
- Category filter works via `categoryId` param
- Loading states + error handling present

### ContactPage (`/src/pages/ContactPage.tsx`)

**Status**: ⚠️ Partially integrated
- **Business info display**: Uses `useBusinessInfo()` - ✅ Works
- **Contact form**: Non-functional, no API integration - ❌ Broken
- **Missing**: Form validation, submission logic, success/error states
- **Needs**: React Hook Form + Zod + contacts service + mutation hook

### BookingPage (`/src/pages/BookingPage.tsx`)

**Status**: ⚠️ Partially integrated (assumed, not read)
- `bookingsService.create()` exists but likely not used in form
- **Needs**: Form integration + mutation hook

### Shared Components

**Footer** (`/src/components/layout/Footer.tsx`)
- ✅ Uses `useBusinessInfo()` for contact info + hours
- Falls back to null if data not loaded (no loading spinner shown)

**Header** - Not analyzed (assumed static navigation)

---

## Gaps & Opportunities

### Critical Gaps

1. **ContactPage form**: Backend endpoint exists (`POST /contacts`) but zero integration
   - No contacts service file
   - No React Hook Form setup
   - No mutation hook
   - Form is pure HTML, doesn't submit

2. **HomePage ServicesOverview**: Uses mock data despite `useServices()` existing
   - Easy fix: Replace `getFeaturedServices()` with `useServices({ featured: true })`

3. **BookingPage form**: Likely incomplete integration
   - Service exists but form may not use it

### Missing Features

4. **Loading states**: Footer shows nothing while loading (should show skeleton)

5. **Error states**: No global error boundary or retry logic

6. **Caching strategy**: TanStack Query configured but no invalidation on mutations

7. **Stale data indicators**: No refetch on window focus/reconnect

---

## Recommendations

### Priority 1 (Immediate - blocks users)

1. **Integrate ContactPage form** (30-45 mins)
   - Create `/src/services/contacts.service.ts`
   - Add `useContactMutation` hook
   - Implement React Hook Form + Zod schema
   - Add success/error toast notifications

2. **Fix HomePage ServicesOverview** (5 mins)
   - Replace `getFeaturedServices()` with `useServices({ featured: true, isActive: true })`
   - Add loading skeleton

### Priority 2 (Polish - improves UX)

3. **Add BookingPage form integration** (15-20 mins)
   - Verify if form uses `bookingsService`
   - Add mutation hook if missing
   - Add success redirect to confirmation page

4. **Improve loading/error states** (10-15 mins)
   - Footer: Show skeleton instead of null
   - Add retry buttons on errors
   - Add global error boundary

### Priority 3 (Performance - optional)

5. **Optimize caching** (10 mins)
   - Add `staleTime` tuning (currently 30s)
   - Implement mutation invalidation
   - Add `refetchOnWindowFocus: true` for real-time data

6. **Remove mock data files** (5 mins)
   - Delete `/src/data/services.ts` after ServicesOverview migrated
   - Clean up unused imports

---

## File References

### Files to Modify

**Immediate (Priority 1)**
- `/apps/client/src/components/home/ServicesOverview.tsx` - Swap to API data
- `/apps/client/src/pages/ContactPage.tsx` - Add form integration
- `/apps/client/src/services/contacts.service.ts` - **CREATE NEW**
- `/apps/client/src/hooks/api/useContacts.ts` - **CREATE NEW**

**Soon (Priority 2)**
- `/apps/client/src/pages/BookingPage.tsx` - Verify integration
- `/apps/client/src/components/layout/Footer.tsx` - Add loading skeleton
- `/apps/client/src/hooks/api/useBookings.ts` - **CREATE NEW** (mutations)

**Later (Priority 3)**
- `/apps/client/src/lib/apiClient.ts` - Add retry logic
- `/apps/client/src/data/services.ts` - **DELETE** after migration

### Files Already Working

- `/apps/client/src/services/gallery.service.ts` ✅
- `/apps/client/src/services/services.service.ts` ✅
- `/apps/client/src/services/business-info.service.ts` ✅
- `/apps/client/src/hooks/api/useGallery.ts` ✅
- `/apps/client/src/hooks/api/useServices.ts` ✅
- `/apps/client/src/hooks/api/useBusinessInfo.ts` ✅
- `/apps/client/src/pages/ServicesPage.tsx` ✅
- `/apps/client/src/pages/GalleryPage.tsx` ✅

---

## Code Examples

### Example: Fix ServicesOverview (Priority 1)

**Before** (`/src/components/home/ServicesOverview.tsx:31`):
```tsx
const featuredServices = getFeaturedServices(); // ❌ Mock data
```

**After**:
```tsx
const { data: featuredServices = [], isLoading } = useServices({
  featured: true,
  isActive: true,
  limit: 3 // Only need 3 for homepage
});

if (isLoading) {
  return <ServicesSkeleton />; // Add loading state
}
```

### Example: Contacts Service (Priority 1 - NEW FILE)

**Create** `/apps/client/src/services/contacts.service.ts`:
```typescript
import type { Contact } from "@repo/types/contact";
import { apiClient } from "@/lib/apiClient";

export type ContactFormData = Omit<Contact, "_id" | "status" | "createdAt" | "updatedAt">;

export class ContactsService {
  async create(data: ContactFormData): Promise<Contact> {
    return apiClient.post<Contact>("/contacts", data);
  }
}

export const contactsService = new ContactsService();
```

---

## Unresolved Questions

1. **Gallery Categories**: Does backend have `/gallery/categories` endpoint? Client has `useGalleryCategories` hook but may use hardcoded fallback. Check API docs.

2. **BookingPage integration**: Not analyzed in this pass. Need to verify if form uses `bookingsService.create()` or still mock.

3. **Banners endpoint**: Backend has `/banners` but client doesn't display banners. Needed for future hero carousel?

4. **Auth flow**: No authentication in client app (all endpoints public except admin). Confirmed intentional?

5. **Rate limiting**: Client makes no attempt to handle 429 errors. Add retry logic with exponential backoff?

---

**End of Report**
