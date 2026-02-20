# Shared Types — Booking

**Package**: `@repo/types/booking`

---

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

**Usage**:
```typescript
import type { Booking, BookingStatus, CustomerInfo } from '@repo/types/booking';
```

**Apps**:
- **Client**: BookingPage (create booking, public)
- **Admin**: BookingsPage (list + status management, JWT)
- **API**: `apps/api/src/modules/bookings/dto/`
