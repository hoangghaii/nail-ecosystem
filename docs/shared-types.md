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
  id: string
  title: string
  imageUrl: string
  category: GalleryCategory
  description?: string
  duration?: number
  price?: number
  featured: boolean
  createdAt: Date
}

type GalleryCategory = "all" | "extensions" | "manicure" | "nail-art" | "pedicure" | "seasonal"
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

**Last Updated**: 2025-12-31
