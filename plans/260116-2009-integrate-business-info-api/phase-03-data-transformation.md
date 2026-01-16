# Phase 3: Data Transformation Utilities

**Plan**: 260116-2009-integrate-business-info-api
**Phase**: 3 of 7
**Effort**: 1 hour

---

## Objective

Transform API data (24h time, single address string) to display format (12h time, structured address).

---

## Tasks

### 1. Create Transformation Utilities
**File**: `apps/client/src/utils/businessInfo.ts` (new)

```typescript
import { BusinessInfo, DaySchedule } from '@repo/types/business-info';

// Display types (internal to client app)
type DisplayDaySchedule = {
  day: string;        // "Monday" (capitalized)
  open: string;       // "09:00 AM" (12-hour)
  close: string;      // "07:00 PM" (12-hour)
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

/**
 * Convert 24-hour time to 12-hour format
 * @param time24 - Time in "HH:MM" format (e.g., "09:00", "14:30")
 * @returns Time in "hh:MM AM/PM" format (e.g., "09:00 AM", "02:30 PM")
 */
function to12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Capitalize first letter of day name
 * @param day - Day name in lowercase (e.g., "monday")
 * @returns Capitalized day name (e.g., "Monday")
 */
function capitalizeDayName(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/**
 * Transform business hours for display
 * Converts 24h time to 12h and capitalizes day names
 */
export function transformBusinessHours(hours: DaySchedule[]): DisplayDaySchedule[] {
  return hours.map(schedule => ({
    day: capitalizeDayName(schedule.day),
    open: to12Hour(schedule.openTime),
    close: to12Hour(schedule.closeTime),
    closed: schedule.closed,
  }));
}

/**
 * Parse address string into structured components
 * Expected format: "123 Beauty Lane, San Francisco, CA 94102"
 *
 * @param addressString - Full address as single string
 * @returns Structured address with street, city, state, zip (if parseable)
 */
export function parseAddress(addressString: string): DisplayContactInfo['address'] {
  const parts = addressString.split(',').map(s => s.trim());

  if (parts.length >= 3) {
    const [street, city, stateZip] = parts;
    const stateZipMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5})$/);

    if (stateZipMatch) {
      return {
        full: addressString,
        street,
        city,
        state: stateZipMatch[1],
        zip: stateZipMatch[2],
      };
    }
  }

  // Fallback: return full address only
  return { full: addressString };
}

/**
 * Transform business info from API format to display format
 * Main transformation function for ContactPage
 */
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

## Validation

- [ ] `to12Hour("09:00")` returns `"09:00 AM"`
- [ ] `to12Hour("14:30")` returns `"02:30 PM"`
- [ ] `to12Hour("00:00")` returns `"12:00 AM"`
- [ ] `capitalizeDayName("monday")` returns `"Monday"`
- [ ] `parseAddress("123 Main St, City, CA 12345")` structures correctly
- [ ] `parseAddress("Complex address format")` returns full address
- [ ] Type-check passes

---

## Notes

- Address parsing is basic (enhancement possible later)
- If address doesn't match expected format, falls back to full string
- Pure functions, easy to unit test
- No external dependencies
