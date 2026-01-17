import type { BusinessInfo, DaySchedule } from '@repo/types/business-info';

// Display types (internal to client app)
type DisplayDaySchedule = {
  close: string; // "07:00 PM" (12-hour)
  closed: boolean;
  day: string; // "Monday" (capitalized)
  open: string; // "09:00 AM" (12-hour)
};

type DisplayContactInfo = {
  address: {
    city?: string;
    full: string; // Full address string
    state?: string;
    street?: string;
    zip?: string;
  };
  email: string;
  phone: string;
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
export function transformBusinessHours(
  hours: DaySchedule[],
): DisplayDaySchedule[] {
  return hours.map((schedule) => ({
    close: to12Hour(schedule.closeTime),
    closed: schedule.closed,
    day: capitalizeDayName(schedule.day),
    open: to12Hour(schedule.openTime),
  }));
}

/**
 * Parse address string into structured components
 * Expected format: "123 Beauty Lane, San Francisco, CA 94102"
 *
 * @param addressString - Full address as single string
 * @returns Structured address with street, city, state, zip (if parseable)
 */
export function parseAddress(
  addressString: string,
): DisplayContactInfo['address'] {
  const parts = addressString.split(',').map((s) => s.trim());

  if (parts.length >= 3) {
    const [street, city, stateZip] = parts;
    const stateZipMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5})$/);

    if (stateZipMatch) {
      return {
        city,
        full: addressString,
        state: stateZipMatch[1],
        street,
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
  businessHours: DisplayDaySchedule[];
  contactInfo: DisplayContactInfo;
} {
  return {
    businessHours: transformBusinessHours(data.businessHours),
    contactInfo: {
      address: parseAddress(data.address),
      email: data.email,
      phone: data.phone,
    },
  };
}
