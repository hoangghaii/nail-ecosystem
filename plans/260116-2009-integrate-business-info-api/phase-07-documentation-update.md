# Phase 7: Documentation Update

**Plan**: 260116-2009-integrate-business-info-api
**Phase**: 7 of 7
**Effort**: 30 minutes

---

## Objective

Update project documentation to reflect business info API integration.

---

## Tasks

### 1. Update API Endpoints Documentation
**File**: `docs/api-endpoints.md`

**Location**: After "Authentication" section, before "Services" section

**Add**:
```markdown
---

## Business Info

### Get Business Information
```
GET /business-info
Public endpoint (no authentication required)

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "phone": "(555) 123-4567",
  "email": "hello@pinknail.com",
  "address": "123 Beauty Lane, San Francisco, CA 94102",
  "businessHours": [
    {
      "day": "monday",
      "openTime": "09:00",
      "closeTime": "19:00",
      "closed": false
    },
    {
      "day": "tuesday",
      "openTime": "09:00",
      "closeTime": "19:00",
      "closed": false
    },
    // ... (7 days total)
  ],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Update Business Information
```
PATCH /business-info
Authorization: Bearer {accessToken}
Content-Type: application/json

Body (all fields optional):
{
  "phone": "(555) 987-6543",
  "email": "newemail@pinknail.com",
  "address": "456 New St, City, ST 12345",
  "businessHours": [
    {
      "day": "monday",
      "openTime": "10:00",
      "closeTime": "20:00",
      "closed": false
    },
    // ... (must provide all 7 days if updating)
  ]
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "phone": "(555) 987-6543",
  // ... updated fields
}

Response: 401 Unauthorized (if not authenticated)
Response: 404 Not Found (if business info doesn't exist)
Response: 400 Bad Request (if validation fails)
```

**Notes**:
- GET endpoint is public
- PATCH endpoint requires admin authentication
- Business hours must include all 7 days if provided
- Times in 24-hour format (HH:MM)
- Auto-creates default data if not exists
```

### 2. Update Shared Types Documentation
**File**: `docs/shared-types.md`

**Location**: Add new section after existing types

**Add**:
```markdown
## Business Info Types

**Package**: `@repo/types/business-info`

### DayOfWeek (Enum)
```typescript
enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}
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

**Client Display Transformation**:
- Client app transforms 24h time → 12h time for display
- Client app parses address string into structured format
- See `apps/client/src/utils/businessInfo.ts` for transformation utils
```

### 3. Update README (if needed)
**File**: `README.md` (root)

**Action**: Check if business info integration should be mentioned in features list.

**Potential addition** (if "Features" section exists):
```markdown
- ✅ Business information management (phone, email, address, hours)
- ✅ Dynamic contact page with live API data
```

---

## Validation

- [ ] API endpoints documented with examples
- [ ] Request/response formats shown
- [ ] Authentication requirements noted
- [ ] Shared types documented with usage examples
- [ ] Client transformation notes included
- [ ] All 7 phases completed
- [ ] Documentation consistent with implementation

---

## Notes

- Documentation matches actual implementation
- Examples use realistic data
- Clear distinction between API format (24h) and display format (12h)
- Notes about admin-only PATCH endpoint
