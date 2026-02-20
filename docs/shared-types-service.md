# Shared Types — Service

**Package**: `@repo/types/service`

---

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

**Usage**:
```typescript
import type { Service, ServiceCategory } from '@repo/types/service';
```

**Apps**:
- **Client**: ServicesPage, BookingPage (read-only display)
- **Admin**: ServicesPage, ServiceFormModal (full CRUD)
- **API**: `apps/api/src/modules/services/dto/`
