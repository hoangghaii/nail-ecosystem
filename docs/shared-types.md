# Shared Type System

**CRITICAL**: Admin panel and client share type definitions. Types MUST remain compatible across projects.

## Core Principle

**Never modify shared types without updating both nail-client and nail-admin projects!**

---

## Service Types

```typescript
interface Service {
  id: string
  name: string
  description: string
  category: ServiceCategory
  price: number
  duration: number
  imageUrl?: string
  featured: boolean
}

type ServiceCategory = "extensions" | "manicure" | "nail-art" | "pedicure" | "spa"
```

---

## Gallery Types

```typescript
interface GalleryItem {
  _id: string
  title: string
  imageUrl: string
  category: string // Changed from enum to string for dynamic categories (category slug)
  description?: string
  duration?: string // e.g., "45 min", "1.5 hrs"
  price?: string // e.g., "$45", "$60-80"
  featured: boolean
  nailShape?: NailShape // Phase 5: Nail shape filtering
  style?: NailStyle // Phase 5: Nail style filtering
  createdAt?: Date
}

type GalleryCategory = "all" | "extensions" | "manicure" | "nail-art" | "pedicure" | "seasonal"

// Phase 5: Filtering Enums
type NailShape = "almond" | "coffin" | "square" | "stiletto"
type NailStyle = "3d" | "mirror" | "gem" | "ombre"
```

---

## Booking Types

```typescript
interface Booking {
  id: string
  serviceId: string
  date: string
  timeSlot: string
  customerInfo: CustomerInfo
  notes?: string
  status: BookingStatus
}

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}
```

---

## Business Info Types

**Package**: `@repo/types/business-info`

### DayOfWeek
```typescript
const DayOfWeek = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];
```

### DaySchedule
```typescript
type DaySchedule = {
  day: DayOfWeek;
  openTime: string;   // 24-hour format "HH:MM" (e.g., "09:00")
  closeTime: string;  // 24-hour format "HH:MM" (e.g., "18:00")
  closed: boolean;    // true if business is closed on this day
};
```

### BusinessInfo
```typescript
type BusinessInfo = {
  _id: string;
  phone: string;
  email: string;
  address: string;              // Full address as single string
  businessHours: DaySchedule[]; // Must contain all 7 days
  createdAt: string;
  updatedAt: string;
};
```

### BusinessInfoResponse
```typescript
type BusinessInfoResponse = BusinessInfo;
```

**Usage**:
```typescript
import { BusinessInfo, DaySchedule, DayOfWeek } from '@repo/types/business-info';
```

**Apps Using Business Info Types**:
- **Client**: Read-only display (ContactPage, Footer)
  - Uses transformation utilities (`apps/client/src/utils/businessInfo.ts`)
  - 24h time → 12h time conversion for display
  - Address string parsing
- **Admin**: Full CRUD operations (BusinessInfoForm)
  - Direct 24h format (matches API)
  - Form validation with Zod schema
  - No transformation needed

**Client Display Transformation**:
- Client app transforms 24h time → 12h time for display
- Client app parses address string into structured format
- See `apps/client/src/utils/businessInfo.ts` for transformation utils

---

## Type Location Reference

### Client (nail-client)
```
src/types/
├── service.types.ts
├── gallery.types.ts
└── booking.types.ts
```

### Admin (nail-admin)
```
src/types/
├── service.types.ts
├── gallery.types.ts
└── booking.types.ts
```

### API (nail-api)
```
src/modules/
├── services/dto/
├── gallery/dto/
└── bookings/dto/
```

---

## Sync Checklist

When modifying shared types:

- [ ] Update type definition in client
- [ ] Update type definition in admin
- [ ] Update API DTOs if applicable
- [ ] Run TypeScript compiler in both projects
- [ ] Update tests
- [ ] Document breaking changes

---

**Last Updated**: 2026-02-18
**Latest**: Phase 5 Gallery filtering (nailShape, style fields)
