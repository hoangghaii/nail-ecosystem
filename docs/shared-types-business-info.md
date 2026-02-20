# Shared Types — Business Info

**Package**: `@repo/types/business-info`

---

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

type DaySchedule = {
  day: DayOfWeek;
  openTime: string;   // 24-hour format "HH:MM" (e.g., "09:00")
  closeTime: string;  // 24-hour format "HH:MM" (e.g., "18:00")
  closed: boolean;    // true if business is closed on this day
};

type BusinessInfo = {
  _id: string;
  phone: string;
  email: string;
  address: string;              // Full address as single string
  businessHours: DaySchedule[]; // Must contain all 7 days
  createdAt: string;
  updatedAt: string;
};

type BusinessInfoResponse = BusinessInfo;
```

**Usage**:
```typescript
import { BusinessInfo, DaySchedule, DayOfWeek } from '@repo/types/business-info';
```

**Apps**:
- **Client (read-only)**: ContactPage, Footer
  - Uses transformation utilities (`apps/client/src/utils/businessInfo.ts`)
  - 24h time → 12h time conversion for display
  - Address string parsing
- **Admin (CRUD)**: BusinessInfoForm
  - Direct 24h format (matches API)
  - Form validation with Zod schema
  - No transformation needed
