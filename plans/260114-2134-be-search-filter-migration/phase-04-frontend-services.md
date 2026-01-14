# Phase 4: Frontend Services

**Duration**: 1.5 hours
**Risk**: Low
**Dependencies**: Phase 1 (DTOs define API contract)

---

## Objectives

Update FE service layer to:
- Accept query params (search, sortBy, sortOrder)
- Build query strings for API calls
- Remove client-side filter methods (getByStatus, getByDateRange)
- Maintain type safety

---

## File Changes

### 1. Update bookingsService

**File**: `apps/admin/src/services/bookings.service.ts`

**Before** (lines 12-89):
```typescript
async getAll(): Promise<PaginationResponse<Booking>> {
  return apiClient.get<PaginationResponse<Booking>>("/bookings");
}

async getByStatus(status: BookingStatus): Promise<Booking[]> {
  // Client-side filtering (REMOVE)
}

async getByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
  // Client-side filtering (REMOVE)
}
```

**After**:
```typescript
import type { Booking, BookingStatus } from "@repo/types/booking";
import type { PaginationResponse } from "@repo/types/pagination";

import { apiClient } from "@/lib/apiClient";

// Query params type
export type BookingsQueryParams = {
  status?: BookingStatus;
  serviceId?: string;
  date?: string; // ISO format: YYYY-MM-DD
  search?: string;
  sortBy?: 'date' | 'createdAt' | 'customerName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export class BookingsService {
  async getAll(params?: BookingsQueryParams): Promise<PaginationResponse<Booking>> {
    // Build query string
    const queryString = this.buildQueryString(params);
    return apiClient.get<PaginationResponse<Booking>>(`/bookings${queryString}`);
  }

  async getById(id: string): Promise<Booking | null> {
    try {
      return await apiClient.get<Booking>(`/bookings/${id}`);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async update(id: string, data: Partial<Omit<Booking, "id">>): Promise<Booking> {
    return apiClient.patch<Booking>(`/bookings/${id}`, data);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    return this.update(id, { status });
  }

  // NEW: Query string builder
  private buildQueryString(params?: BookingsQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    if (params.status) searchParams.append('status', params.status);
    if (params.serviceId) searchParams.append('serviceId', params.serviceId);
    if (params.date) searchParams.append('date', params.date);
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  // REMOVED: getByStatus, getByDateRange, getUpcoming, getPast
  // Reason: Backend filtering replaces client-side filtering
}

export const bookingsService = new BookingsService();
```

**Key Changes**:
- `getAll()` now accepts `params`
- `buildQueryString()` helper for URL construction
- Removed 4 client-side filter methods (~50 lines)
- Type-safe params via `BookingsQueryParams`

---

### 2. Update contactsService

**File**: `apps/admin/src/services/contacts.service.ts`

**Before** (lines 12-49):
```typescript
async getAll(): Promise<Contact[]> {
  return apiClient.get<Contact[]>("/contacts");
}

async getByStatus(status: ContactStatus): Promise<Contact[]> {
  // Client-side filtering (REMOVE)
}
```

**After**:
```typescript
import type { Contact, ContactStatus } from "@/types/contact.types";

import { apiClient } from "@/lib/apiClient";

// Query params type
export type ContactsQueryParams = {
  status?: ContactStatus;
  search?: string;
  sortBy?: 'createdAt' | 'status' | 'firstName' | 'lastName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export class ContactsService {
  async getAll(params?: ContactsQueryParams): Promise<Contact[]> {
    // Build query string
    const queryString = this.buildQueryString(params);
    const response = await apiClient.get<any>(`/contacts${queryString}`);

    // Backend now returns pagination response, extract data
    return response.data || response;
  }

  async getById(id: string): Promise<Contact | null> {
    try {
      return await apiClient.get<Contact>(`/contacts/${id}`);
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async updateStatus(
    id: string,
    status: ContactStatus,
    adminNotes?: string,
  ): Promise<Contact> {
    return apiClient.patch<Contact>(`/contacts/${id}/status`, {
      adminNotes,
      status,
    });
  }

  async updateAdminNotes(id: string, adminNotes: string): Promise<Contact> {
    return apiClient.patch<Contact>(`/contacts/${id}/notes`, { adminNotes });
  }

  // NEW: Query string builder
  private buildQueryString(params?: ContactsQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    if (params.status) searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  // REMOVED: getByStatus
  // Reason: Backend filtering replaces client-side filtering
}

export const contactsService = new ContactsService();
```

**Key Changes**:
- `getAll()` accepts `params`, builds query string
- Extract `data` from pagination response
- Removed `getByStatus()` client-side filter
- Type-safe params via `ContactsQueryParams`

---

## Type Safety

### Export Query Param Types

Both services export their param types for hook consumption:

```typescript
// In bookings.service.ts
export type BookingsQueryParams = { ... };

// In contacts.service.ts
export type ContactsQueryParams = { ... };
```

**Usage in hooks**:
```typescript
import type { BookingsQueryParams } from '@/services/bookings.service';

function useBookings(filters?: BookingsQueryParams) {
  // Type-safe filter params
}
```

---

## Query String Building

### URLSearchParams Approach

**Why**:
- Automatic encoding (handles spaces, special chars)
- Type-safe (vs manual string concat)
- Browser-native API

**Example**:
```typescript
const params = { search: "john doe", status: "pending" };
const searchParams = new URLSearchParams();
searchParams.append('search', 'john doe');
searchParams.append('status', 'pending');
searchParams.toString(); // "search=john+doe&status=pending"
```

### Conditional Appending

```typescript
if (params.search) searchParams.append('search', params.search);
```
**Why**: Only include defined params (omit undefined/null)

---

## Migration Notes

### Removed Methods

**bookingsService**:
- ❌ `getByStatus()` - use `getAll({ status })`
- ❌ `getByDateRange()` - use `getAll({ date })`
- ❌ `getUpcoming()` - use `getAll({ date: future })`
- ❌ `getPast()` - use `getAll({ date: past })`

**contactsService**:
- ❌ `getByStatus()` - use `getAll({ status })`

**Impact**: Hooks (Phase 5) will be updated to use new API

---

## Testing Checklist

### Query String Building
- [ ] Empty params → empty string
- [ ] Single param → `?status=pending`
- [ ] Multiple params → `?status=pending&search=john`
- [ ] Special chars encoded → `?search=john%20doe`
- [ ] Undefined params omitted

### API Calls
- [ ] `getAll()` without params → `/bookings`
- [ ] `getAll({ status })` → `/bookings?status=pending`
- [ ] `getAll({ search, status })` → `/bookings?status=pending&search=john`
- [ ] Response type matches `PaginationResponse<T>`

### Backward Compatibility
- [ ] `getAll()` still works (params optional)
- [ ] `getById()` unchanged
- [ ] `update()` methods unchanged

---

## Next Steps

After completing this phase:
1. Verify services compile (no TypeScript errors)
2. Test query string building (unit tests or manual)
3. Proceed to Phase 5 (Update hooks to use new service API)

---

**Estimated Time**: 1.5 hours
**Actual Time**: ___ hours
