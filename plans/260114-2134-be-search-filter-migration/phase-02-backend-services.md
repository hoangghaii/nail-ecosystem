# Phase 2: Backend Service Logic

**Duration**: 3 hours
**Risk**: Medium
**Dependencies**: Phase 1 (DTOs)

---

## Objectives

Implement text search and sorting in Bookings and Contacts services:
- MongoDB `$or` queries for text search
- Dynamic sorting based on query params
- Maintain existing filter logic
- Handle edge cases (empty search, special characters)

---

## File Changes

### 1. Update BookingsService.findAll()

**File**: `apps/api/src/modules/bookings/bookings.service.ts`

**Changes**:
```typescript
import { BookingSortField, SortOrder } from './dto/query-bookings.dto';

async findAll(query: QueryBookingsDto) {
  const {
    status,
    serviceId,
    date,
    search,        // NEW
    sortBy = BookingSortField.DATE,   // NEW
    sortOrder = SortOrder.DESC,       // NEW
    page = 1,
    limit = 10
  } = query;

  const filter: any = {};

  // Existing filters (unchanged)
  if (status) filter.status = status;
  if (serviceId) {
    if (!Types.ObjectId.isValid(serviceId)) {
      throw new BadRequestException('Invalid service ID');
    }
    filter.serviceId = new Types.ObjectId(serviceId);
  }
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    filter.date = { $gte: startDate, $lt: endDate };
  }

  // NEW: Text search implementation
  if (search && search.trim()) {
    // Escape special regex characters
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearch, 'i'); // case-insensitive

    filter.$or = [
      { 'customerInfo.firstName': searchRegex },
      { 'customerInfo.lastName': searchRegex },
      { 'customerInfo.email': searchRegex },
      { 'customerInfo.phone': searchRegex },
    ];
  }

  // NEW: Dynamic sorting
  const sort: any = {};
  switch (sortBy) {
    case BookingSortField.DATE:
      sort.date = sortOrder === SortOrder.DESC ? -1 : 1;
      sort.timeSlot = sortOrder === SortOrder.DESC ? -1 : 1; // Secondary sort
      break;
    case BookingSortField.CREATED_AT:
      sort.createdAt = sortOrder === SortOrder.DESC ? -1 : 1;
      break;
    case BookingSortField.CUSTOMER_NAME:
      // Sort by lastName, then firstName
      sort['customerInfo.lastName'] = sortOrder === SortOrder.DESC ? -1 : 1;
      sort['customerInfo.firstName'] = sortOrder === SortOrder.DESC ? -1 : 1;
      break;
    default:
      // Fallback to date DESC (current behavior)
      sort.date = -1;
      sort.timeSlot = -1;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.bookingModel
      .find(filter)
      .populate('serviceId', 'name duration price')
      .sort(sort)      // Changed: Dynamic sort
      .skip(skip)
      .limit(limit)
      .exec(),
    this.bookingModel.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

**Key Changes**:
1. Extract `search`, `sortBy`, `sortOrder` from query
2. Regex escape search input (prevent ReDoS attacks)
3. Build `$or` query for multi-field search
4. Switch statement for dynamic sorting
5. Apply sort before skip/limit

---

### 2. Update ContactsService.findAll()

**File**: `apps/api/src/modules/contacts/contacts.service.ts`

**Changes**:
```typescript
import { ContactSortField, SortOrder } from './dto/query-contacts.dto';

async findAll(query: QueryContactsDto) {
  const {
    status,
    search,        // NEW
    sortBy = ContactSortField.CREATED_AT,  // NEW
    sortOrder = SortOrder.DESC,            // NEW
    page = 1,
    limit = 10
  } = query;

  const filter: any = {};

  // Existing filter (unchanged)
  if (status) filter.status = status;

  // NEW: Text search implementation
  if (search && search.trim()) {
    // Escape special regex characters
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearch, 'i'); // case-insensitive

    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { subject: searchRegex },
      { message: searchRegex },
      { phone: searchRegex },
    ];
  }

  // NEW: Dynamic sorting
  const sort: any = {};
  switch (sortBy) {
    case ContactSortField.CREATED_AT:
      sort.createdAt = sortOrder === SortOrder.DESC ? -1 : 1;
      break;
    case ContactSortField.STATUS:
      sort.status = sortOrder === SortOrder.DESC ? -1 : 1;
      sort.createdAt = -1; // Secondary sort (newest first)
      break;
    case ContactSortField.FIRST_NAME:
      sort.firstName = sortOrder === SortOrder.DESC ? -1 : 1;
      sort.lastName = sortOrder === SortOrder.DESC ? -1 : 1; // Secondary sort
      break;
    case ContactSortField.LAST_NAME:
      sort.lastName = sortOrder === SortOrder.DESC ? -1 : 1;
      sort.firstName = sortOrder === SortOrder.DESC ? -1 : 1; // Secondary sort
      break;
    default:
      // Fallback to createdAt DESC (current behavior)
      sort.createdAt = -1;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.contactModel
      .find(filter)
      .sort(sort)      // Changed: Dynamic sort
      .skip(skip)
      .limit(limit)
      .exec(),
    this.contactModel.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

**Key Changes**:
1. Extract `search`, `sortBy`, `sortOrder` from query
2. Regex escape (same as bookings)
3. Build `$or` query for 6 fields (including phone)
4. Switch statement for dynamic sorting
5. Secondary sorts for better UX (e.g., status + createdAt)

---

## Implementation Details

### Regex Escaping
```typescript
// Escapes: . * + ? ^ $ { } ( ) | [ ] \
const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```
**Why**: Prevent regex injection and ReDoS attacks

### Case-Insensitive Search
```typescript
const searchRegex = new RegExp(escapedSearch, 'i');
```
**Why**: Matches FE behavior (currently case-insensitive)

### Secondary Sorting
```typescript
sort.date = -1;
sort.timeSlot = -1; // Break ties
```
**Why**: Consistent ordering when primary field has duplicates

---

## Edge Cases

### 1. Empty Search String
```typescript
if (search && search.trim()) {
  // Only apply $or if non-empty
}
```
**Behavior**: Empty string = no search filter (returns all)

### 2. Special Characters in Search
```typescript
// Input: "john@example.com"
// Escaped: "john@example\\.com"
```
**Behavior**: Literal match, not regex metacharacter

### 3. Phone Field Optional (Contacts)
```typescript
{ phone: searchRegex }  // Matches null/undefined (MongoDB behavior)
```
**Behavior**: Search includes records with/without phone

### 4. Populated Fields (Bookings)
```typescript
.populate('serviceId', 'name duration price')
```
**Behavior**: Population unaffected by search/sort

---

## Testing Checklist

### Search Tests
- [ ] Search "john" matches firstName "John", lastName "Johnson"
- [ ] Search "gmail.com" matches emails
- [ ] Search "+1234" matches phone numbers
- [ ] Empty search returns all records
- [ ] Special chars escaped (e.g., "john.doe@" works)
- [ ] Case-insensitive (e.g., "JOHN" matches "john")

### Sorting Tests
- [ ] sortBy=date, sortOrder=asc (oldest first)
- [ ] sortBy=date, sortOrder=desc (newest first, default)
- [ ] sortBy=customerName works (lastName primary)
- [ ] sortBy=createdAt works
- [ ] Secondary sorting applied (no duplicate order)

### Combined Filters
- [ ] status + search works (e.g., pending + "john")
- [ ] date + search works
- [ ] search + sortBy + sortOrder works
- [ ] All filters + search + sort works

### Performance
- [ ] Query time < 100ms with 1000 records (after Phase 3 indexes)
- [ ] No COLLSCAN (verify with .explain())

---

## Error Handling

### Invalid Service ID (Existing)
```typescript
if (!Types.ObjectId.isValid(serviceId)) {
  throw new BadRequestException('Invalid service ID');
}
```
**Keep unchanged** (existing validation)

### Invalid Sort Fields
**Handled by DTO validation** (enum enforcement)

### Malicious Search Input
**Mitigated by regex escaping** (no additional validation needed)

---

## Next Steps

After completing this phase:
1. Test search queries manually via Postman/curl
2. Verify Swagger UI reflects new params
3. Check MongoDB query logs for `$or` queries
4. Proceed to Phase 3 (Indexes - CRITICAL before deployment)

---

**Estimated Time**: 3 hours
**Actual Time**: ___ hours (fill after completion)
