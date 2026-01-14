# Phase 7: Testing & Validation

**Duration**: 2 hours
**Risk**: Medium
**Dependencies**: All previous phases

---

## Objectives

Comprehensive testing:
- Backend query functionality (search, sort, pagination)
- Frontend integration (hooks, components)
- Performance validation (query times, indexes)
- Cache behavior (React Query)
- Edge cases and error handling

---

## 1. Backend Unit Tests

### Test DTO Validation

**File**: `apps/api/src/modules/bookings/dto/query-bookings.dto.spec.ts` (create)

```typescript
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { QueryBookingsDto, BookingSortField, SortOrder } from './query-bookings.dto';

describe('QueryBookingsDto', () => {
  it('should accept valid search string', async () => {
    const dto = plainToInstance(QueryBookingsDto, { search: 'john' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept valid sortBy enum', async () => {
    const dto = plainToInstance(QueryBookingsDto, { sortBy: BookingSortField.DATE });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject invalid sortBy', async () => {
    const dto = plainToInstance(QueryBookingsDto, { sortBy: 'invalid' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should accept all params as optional', async () => {
    const dto = plainToInstance(QueryBookingsDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
```

---

### Test Service Query Logic

**File**: `apps/api/src/modules/bookings/bookings.service.spec.ts` (update)

```typescript
describe('BookingsService.findAll', () => {
  it('should filter by status', async () => {
    const result = await service.findAll({ status: 'pending' });
    expect(result.data.every(b => b.status === 'pending')).toBe(true);
  });

  it('should search across customer fields', async () => {
    const result = await service.findAll({ search: 'john' });
    expect(result.data.length).toBeGreaterThan(0);
    // Verify at least one match in firstName/lastName/email/phone
  });

  it('should sort by date descending', async () => {
    const result = await service.findAll({ sortBy: 'date', sortOrder: 'desc' });
    const dates = result.data.map(b => b.date.getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('should combine filters and search', async () => {
    const result = await service.findAll({
      status: 'pending',
      search: 'john',
      sortBy: 'date'
    });
    expect(result.data.every(b => b.status === 'pending')).toBe(true);
  });

  it('should handle empty search gracefully', async () => {
    const result = await service.findAll({ search: '' });
    expect(result.data.length).toBeGreaterThan(0); // Returns all
  });

  it('should escape regex special characters', async () => {
    const result = await service.findAll({ search: 'john.doe@' });
    // Should not throw, should escape . and @
    expect(result).toBeDefined();
  });
});
```

---

## 2. Backend Integration Tests

### Test API Endpoints

**File**: `apps/api/src/modules/bookings/bookings.controller.spec.ts` (update)

```typescript
describe('GET /bookings', () => {
  it('should return filtered bookings', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings?status=pending')
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });

  it('should support search query', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings?search=john')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should support sorting', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings?sortBy=date&sortOrder=asc')
      .expect(200);

    const dates = response.body.data.map(b => new Date(b.date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
  });

  it('should reject invalid sortBy', async () => {
    await request(app.getHttpServer())
      .get('/bookings?sortBy=invalid')
      .expect(400);
  });

  it('should maintain backward compatibility (no params)', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings')
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
  });
});
```

---

## 3. Performance Testing

### MongoDB Query Performance

**Run in MongoDB shell**:

```javascript
// 1. Verify indexes created
db.bookings.getIndexes();
// Expected: 9 indexes including text indexes

// 2. Test search query performance
db.bookings.find({
  $or: [
    { 'customerInfo.firstName': /john/i },
    { 'customerInfo.lastName': /john/i },
    { 'customerInfo.email': /john/i },
    { 'customerInfo.phone': /john/i }
  ]
}).explain("executionStats");

// Check:
// - executionTimeMillis < 100 ✅
// - stage: "IXSCAN" (not COLLSCAN) ✅
// - totalDocsExamined ≈ nReturned (efficient) ✅

// 3. Test compound filter query
db.bookings.find({
  status: 'pending',
  $or: [...]
}).sort({ date: -1 }).explain("executionStats");

// 4. Verify index usage on sort
db.bookings.find({}).sort({ date: -1, timeSlot: -1 }).explain("executionStats");
// Should use: date_-1_timeSlot_-1 index
```

### Load Testing (Optional)

**Using k6 or Apache Bench**:

```bash
# Install k6
brew install k6

# Test script (search-load-test.js)
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const res = http.get('http://localhost:3000/bookings?search=john&status=pending');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}

# Run: k6 run --vus 10 --duration 30s search-load-test.js
```

**Success Criteria**:
- P95 response time < 200ms
- 0% error rate
- No MongoDB connection pool exhaustion

---

## 4. Frontend Testing

### Hook Behavior Tests

**Manual Testing Checklist**:

#### useBookings Hook
- [ ] `useBookings()` fetches all bookings
- [ ] `useBookings({ status: 'pending' })` filters by status
- [ ] `useBookings({ search: 'john' })` searches text
- [ ] `useBookings({ sortBy: 'date', sortOrder: 'asc' })` sorts
- [ ] Changing filters triggers refetch
- [ ] Cache hit within 30s (no network call)
- [ ] `keepPreviousData` shows old data while fetching

#### useContacts Hook
- [ ] `useContacts()` fetches all contacts
- [ ] `useContacts({ status: 'new' })` filters
- [ ] `useContacts({ search: 'inquiry' })` searches
- [ ] Cache behavior correct

### Component Integration Tests

**BookingsPage**:
- [ ] Status filter works (click "Pending" → shows pending only)
- [ ] Search input debounces (type "john" → 1 API call after 300ms)
- [ ] Combined filters work (status + search)
- [ ] Clear search resets to all
- [ ] Loading spinner shows during isFetching
- [ ] Previous data visible during filter change
- [ ] Empty state when no results
- [ ] Status count badges accurate

**ContactsPage**:
- [ ] Status filter works
- [ ] Search input searches across all fields
- [ ] Loading states correct
- [ ] Empty state when no results

---

## 5. Cache Behavior Validation

### React Query DevTools

**Open DevTools** (bottom-right floating icon):

1. **Check Cache Entries**:
   - Filter by status → new cache entry
   - Change search → new cache entry
   - Go back to previous filter → cache hit (green)

2. **Verify staleTime**:
   - Fetch data → "fresh" for 30s
   - After 30s → "stale" but still served
   - On focus/mount → background refetch

3. **Check keepPreviousData**:
   - Change filter → `isPreviousData: true`
   - New data loads → `isPreviousData: false`

### Cache Invalidation Tests

**Mutations should invalidate cache**:

```typescript
// Update booking status
await updateBookingStatus({ id: '123', status: 'confirmed' });

// Check: All booking queries invalidated
// React Query DevTools → "bookings" queries refetching
```

---

## 6. Edge Cases & Error Handling

### Test Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty search string | Returns all records |
| Special chars in search (`john.doe@`) | Escaped, literal match |
| Invalid sortBy (via manual URL) | 400 Bad Request |
| Invalid status enum | 400 Bad Request |
| No results found | Empty array, not error |
| Network timeout | React Query retries, then error |
| 401 Unauthorized | Redirect to login (apiClient) |
| Pagination beyond total | Empty results, not error |

### Manual Testing

**Test invalid queries via curl**:

```bash
# Invalid sortBy
curl "http://localhost:3000/bookings?sortBy=invalid"
# Expected: 400 Bad Request

# Invalid sortOrder
curl "http://localhost:3000/bookings?sortOrder=invalid"
# Expected: 400 Bad Request

# SQL injection attempt (should be escaped)
curl "http://localhost:3000/bookings?search='; DROP TABLE bookings;--"
# Expected: 200 OK, no results (escaped query)

# Extremely long search string
curl "http://localhost:3000/bookings?search=$(python3 -c 'print("a"*10000)')"
# Expected: 400 Bad Request or safely handled
```

---

## 7. Regression Testing

### Verify Existing Features Unaffected

- [ ] Booking creation still works
- [ ] Booking status update still works
- [ ] Contact form submission still works
- [ ] Contact status update still works
- [ ] Prefetch on hover still works (BookingsPage)
- [ ] Modal interactions unchanged

---

## 8. Production Readiness Checklist

### Backend
- [ ] All unit tests pass (`npm run test` in apps/api)
- [ ] All integration tests pass
- [ ] MongoDB indexes verified in production replica
- [ ] Query performance < 100ms with realistic data volume
- [ ] Error handling tested (invalid params, edge cases)
- [ ] Swagger docs updated and accurate

### Frontend
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] No console errors in browser
- [ ] Cache behavior validated (React Query DevTools)
- [ ] Debounce working (300ms delay)
- [ ] Loading states smooth (no flicker)
- [ ] Network throttling test passed (Slow 3G)

### Documentation
- [ ] API docs updated (api-endpoints.md)
- [ ] Migration notes documented
- [ ] Rollback procedure tested

---

## 9. Performance Benchmarks

### Success Criteria

| Metric | Target | Actual |
|--------|--------|--------|
| Search query time (1000 docs) | < 100ms | ___ ms |
| Filter change API call | < 200ms | ___ ms |
| Initial page load | < 1s | ___ s |
| Cache hit (no network) | < 10ms | ___ ms |
| Index size (bookings) | < 500KB | ___ KB |
| Index size (contacts) | < 300KB | ___ KB |

---

## 10. Sign-Off Criteria

**Phase complete when**:
- [ ] All tests pass (unit, integration, manual)
- [ ] Performance benchmarks met
- [ ] No regressions found
- [ ] Cache behavior verified
- [ ] Edge cases handled
- [ ] Rollback tested successfully
- [ ] Team approval obtained

---

**Estimated Time**: 2 hours
**Actual Time**: ___ hours

---

## Next: Production Deployment

After Phase 7 complete:
1. Create PR with all changes
2. Code review
3. Deploy to staging → verify
4. Deploy to production → monitor
5. Watch logs/metrics for 24h
