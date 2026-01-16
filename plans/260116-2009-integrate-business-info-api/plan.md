# Business Info API Integration Plan

**Plan ID**: 260116-2009-integrate-business-info-api
**Date**: 2026-01-16
**Status**: Completed
**Completion Date**: 2026-01-16

---

## Executive Summary

Replace hardcoded business info mock data in client contact page with live API integration. The API already exists (`GET /business-info`) but is not integrated. Plan includes data structure alignment, type system updates, API integration, database seeding, and mock data removal.

---

## Current State Analysis

### Client Side (`apps/client`)
- **File**: `apps/client/src/data/businessInfo.ts` (mock data)
- **Usage**: `apps/client/src/pages/ContactPage.tsx` imports mock data
- **Data Structure**:
  ```typescript
  ContactInfo {
    phone: string
    email: string
    address: { street, city, state, zip }
  }
  BusinessHours[] {
    day: string
    open: string   // 12-hour format: "09:00 AM"
    close: string  // 12-hour format: "07:00 PM"
    closed?: boolean
  }
  ```

### API Side (`apps/api`)
- **Endpoint**: `GET /business-info` (Public, no auth)
- **Controller**: `apps/api/src/modules/business-info/business-info.controller.ts`
- **Service**: Auto-creates default data if not exists
- **Schema**: `BusinessInfo` model in MongoDB
- **Data Structure**:
  ```typescript
  BusinessInfo {
    phone: string
    email: string
    address: string  // Single string, not object
    businessHours: DaySchedule[] {
      day: enum(monday-sunday)
      openTime: string   // 24-hour format: "09:00"
      closeTime: string  // 24-hour format: "18:00"
      closed: boolean
    }
  }
  ```

### Key Issues
1. **Data Structure Mismatch**:
   - Client expects `address.{street, city, state, zip}` → API provides `address: string`
   - Client expects 12-hour format (`09:00 AM`) → API uses 24-hour format (`09:00`)
   - Client uses `open/close` → API uses `openTime/closeTime`
   - Client uses capitalized day names → API uses lowercase enum

2. **No Shared Types**: Business info types only in client local types, not in `@repo/types`

3. **No API Integration**: Client uses mock data, never calls API

4. **No Database Data**: API auto-creates generic defaults when first accessed

---

## Solution Design

### Strategy: Adapt Client to API Structure

**Rationale**: API structure is already validated, documented, and follows backend best practices (24-hour time, normalized data). Simpler to transform data on client side than change API contract.

### Approach
1. **Type System**: Add business info types to `@repo/types` (shared package)
2. **API Client**: Create React Query hook for `GET /business-info`
3. **Data Transformation**: Convert API response to display format in client
4. **Component Integration**: Update ContactPage and Footer to use API
5. **Database Seeding**: Add real business data to MongoDB
6. **Mock Removal**: Delete mock data file, update imports
7. **Documentation**: Update API docs and shared types docs

---

## Implementation Phases

### Phase 1: Type System Update
**File**: `packages/types/src/business-info.ts` (new)

Create shared types matching API schema:

```typescript
export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export type DaySchedule = {
  day: DayOfWeek;
  openTime: string;   // 24-hour format "HH:MM"
  closeTime: string;  // 24-hour format "HH:MM"
  closed: boolean;
};

export type BusinessInfo = {
  _id: string;
  phone: string;
  email: string;
  address: string;
  businessHours: DaySchedule[];
  createdAt: string;
  updatedAt: string;
};

export type BusinessInfoResponse = BusinessInfo;
```

**Export**: Update `packages/types/src/index.ts`

---

### Phase 2: API Client Integration
**File**: `apps/client/src/api/businessInfo.ts` (new)

```typescript
import { BusinessInfoResponse } from '@repo/types/business-info';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getBusinessInfo(): Promise<BusinessInfoResponse> {
  const response = await fetch(`${API_BASE}/business-info`);
  if (!response.ok) throw new Error('Failed to fetch business info');
  return response.json();
}
```

**File**: `apps/client/src/hooks/useBusinessInfo.ts` (new)

```typescript
import { useQuery } from '@tanstack/react-query';
import { getBusinessInfo } from '@/api/businessInfo';

export function useBusinessInfo() {
  return useQuery({
    queryKey: ['businessInfo'],
    queryFn: getBusinessInfo,
    staleTime: 1000 * 60 * 60, // 1 hour (rarely changes)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
```

---

### Phase 3: Data Transformation Utilities
**File**: `apps/client/src/utils/businessInfo.ts` (new)

```typescript
import { BusinessInfo, DaySchedule } from '@repo/types/business-info';

type DisplayDaySchedule = {
  day: string;        // "Monday"
  open: string;       // "09:00 AM"
  close: string;      // "07:00 PM"
  closed: boolean;
};

type DisplayContactInfo = {
  phone: string;
  email: string;
  address: {
    full: string;     // Full address string
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
};

// Convert 24-hour to 12-hour format
function to12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Capitalize day name
function capitalizeDayName(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

// Transform business hours for display
export function transformBusinessHours(hours: DaySchedule[]): DisplayDaySchedule[] {
  return hours.map(schedule => ({
    day: capitalizeDayName(schedule.day),
    open: to12Hour(schedule.openTime),
    close: to12Hour(schedule.closeTime),
    closed: schedule.closed,
  }));
}

// Parse address string (basic parsing, can be enhanced)
export function parseAddress(addressString: string): DisplayContactInfo['address'] {
  // Example: "123 Beauty Lane, San Francisco, CA 94102"
  const parts = addressString.split(',').map(s => s.trim());

  if (parts.length >= 3) {
    const [street, city, stateZip] = parts;
    const stateZipMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5})$/);

    return {
      full: addressString,
      street,
      city,
      state: stateZipMatch?.[1],
      zip: stateZipMatch?.[2],
    };
  }

  return { full: addressString };
}

// Transform business info for display
export function transformBusinessInfo(data: BusinessInfo): {
  contactInfo: DisplayContactInfo;
  businessHours: DisplayDaySchedule[];
} {
  return {
    contactInfo: {
      phone: data.phone,
      email: data.email,
      address: parseAddress(data.address),
    },
    businessHours: transformBusinessHours(data.businessHours),
  };
}
```

---

### Phase 4: Update ContactPage & Footer Components
**Files**:
- `apps/client/src/pages/ContactPage.tsx`
- `apps/client/src/components/layout/Footer.tsx`

**Changes**:
1. Remove mock data imports from both components
2. Add `useBusinessInfo` hook to both components
3. Add loading/error states (ContactPage)
4. Transform data for display
5. Update address rendering with graceful fallbacks

```typescript
import { useBusinessInfo } from '@/hooks/useBusinessInfo';
import { transformBusinessInfo } from '@/utils/businessInfo';

export function ContactPage() {
  useContactPage();

  const { data: businessInfoData, isLoading, error } = useBusinessInfo();

  // Transform data for display
  const displayData = businessInfoData
    ? transformBusinessInfo(businessInfoData)
    : null;

  const contactInfo = displayData?.contactInfo;
  const businessHours = displayData?.businessHours;

  // Loading state
  if (isLoading) {
    return <div>Loading business information...</div>;
  }

  // Error state
  if (error || !displayData) {
    return <div>Unable to load business information. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ... existing JSX with contactInfo and businessHours ... */}

      {/* Phone */}
      <a href={`tel:${contactInfo.phone}`}>
        {contactInfo.phone}
      </a>

      {/* Email */}
      <a href={`mailto:${contactInfo.email}`}>
        {contactInfo.email}
      </a>

      {/* Address */}
      <address className="font-sans text-base text-foreground not-italic">
        {contactInfo.address.street && <>{contactInfo.address.street}<br /></>}
        {contactInfo.address.city && contactInfo.address.state && contactInfo.address.zip
          ? <>{contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}</>
          : contactInfo.address.full
        }
      </address>

      {/* Business Hours */}
      {businessHours.map((schedule) => (
        <div key={schedule.day}>
          <span>{schedule.day}</span>
          <span>
            {schedule.closed
              ? "Đóng Cửa"
              : `${schedule.open} - ${schedule.close}`}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

### Phase 5: Database Seeding
**File**: `apps/api/src/modules/business-info/business-info.service.ts`

**Update default data** (lines 22-70) with real business info:

```typescript
businessInfo = new this.businessInfoModel({
  phone: '(555) 123-4567',
  email: 'hello@pinknail.com',
  address: '123 Beauty Lane, San Francisco, CA 94102',
  businessHours: [
    { day: 'monday', openTime: '09:00', closeTime: '19:00', closed: false },
    { day: 'tuesday', openTime: '09:00', closeTime: '19:00', closed: false },
    { day: 'wednesday', openTime: '09:00', closeTime: '19:00', closed: false },
    { day: 'thursday', openTime: '09:00', closeTime: '20:00', closed: false },
    { day: 'friday', openTime: '09:00', closeTime: '20:00', closed: false },
    { day: 'saturday', openTime: '10:00', closeTime: '18:00', closed: false },
    { day: 'sunday', openTime: '00:00', closeTime: '00:00', closed: true },
  ],
});
```

**Alternative**: Create seed script if database already has data:
- Delete existing business info document
- Restart API to auto-create new defaults

---

### Phase 6: Mock Data Removal
**Files to Delete**:
- `apps/client/src/data/businessInfo.ts`

**Files to Update**:
- `apps/client/src/types/index.ts` - Remove local `BusinessHours` and `ContactInfo` types

---

### Phase 7: Documentation Updates
**Files to Update**:
1. `docs/api-endpoints.md` - Add Business Info section:
   ```markdown
   ## Business Info

   ### Get Business Information
   GET /business-info
   Public endpoint (no authentication required)

   Response: 200 OK
   {
     "_id": "...",
     "phone": "(555) 123-4567",
     "email": "hello@pinknail.com",
     "address": "123 Beauty Lane, San Francisco, CA 94102",
     "businessHours": [...],
     "createdAt": "...",
     "updatedAt": "..."
   }
   ```

2. `docs/shared-types.md` - Add business info types documentation

---

## Testing Checklist

### Unit Tests
- [ ] `transformBusinessHours()` converts 24h → 12h format correctly
- [ ] `parseAddress()` handles various address formats
- [ ] `capitalizeDayName()` handles all day names

### Integration Tests
- [ ] API returns business info successfully
- [ ] React Query hook fetches and caches data
- [ ] ContactPage renders with real data
- [ ] Loading states display correctly
- [ ] Error states display correctly

### Manual Tests
- [ ] Contact page loads without errors
- [ ] Phone number displays and links correctly
- [ ] Email displays and links correctly
- [ ] Address displays correctly with proper formatting
- [ ] Business hours show correct days and times
- [ ] Closed days show "Đóng Cửa" label
- [ ] No console errors
- [ ] Data persists after page refresh

### Cross-App Verification
- [ ] Type-check all apps: `npm run type-check`
- [ ] Build all apps: `npm run build`
- [ ] No breaking changes in other components using business info

---

## Rollback Plan

If issues occur:

1. **Revert Phase 4**: Restore mock data import in ContactPage
2. **Keep Types**: Shared types are non-breaking (no rollback needed)
3. **Keep API**: No API changes, only client-side updates
4. **Git Revert**: Use git to revert client changes if needed

---

## Dependencies

### External Dependencies
- None (all dependencies already installed)

### Internal Dependencies
- `@tanstack/react-query` (already in use)
- `@repo/types` (shared package)
- API endpoint `GET /business-info` (already exists)

---

## Risk Assessment

### Low Risk
- API already exists and tested
- No breaking changes to shared types
- Client-side only changes
- Easy rollback

### Considerations
- Address parsing is basic (assumes specific format)
- May need enhancement if address format varies

---

## Success Criteria

- [ ] Contact page displays live data from API
- [ ] No mock data files remain
- [ ] Types are shared in `@repo/types`
- [ ] Business hours display in 12-hour format
- [ ] Address displays with proper structure
- [ ] Loading and error states work
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No type errors across monorepo

---

## Effort Estimate

**Total**: ~3-4 hours

- Phase 1 (Types): 30 min
- Phase 2 (API Client): 30 min
- Phase 3 (Utilities): 1 hour
- Phase 4 (ContactPage): 1 hour
- Phase 5 (Seeding): 15 min
- Phase 6 (Cleanup): 15 min
- Phase 7 (Docs): 30 min
- Testing: 30 min

---

## Open Questions

1. **Address Format**: Should we support multiple address formats or enforce a specific structure?
   - Resolution: Keep simple parsing for now, enhance later if needed

2. **Footer Component**: Does `Footer.tsx` also need updating?
   - Resolution: Yes, Footer uses same mock data - included in Phase 4

3. **Admin Panel**: Does admin need to update business info?
   - Resolution: Separate plan created for admin integration

4. **Caching Strategy**: 1 hour stale time appropriate?
   - Resolution: Yes, business info rarely changes

---

## Notes

- Follows YAGNI principle: Only implement what's needed now
- Uses existing API, no backend changes required
- Maintains type safety across monorepo
- Simple transformation layer keeps client code clean
- Easy to extend for admin panel later
