# Phase 3: MongoDB Indexes

**Duration**: 1 hour
**Risk**: ⚠️ HIGH (performance critical)
**Dependencies**: None (can run parallel with Phase 1-2)

---

## ⚠️ CRITICAL WARNING

**DO NOT deploy Phase 2 without completing Phase 3 first!**

Text search on unindexed fields = COLLSCAN (full table scan) = catastrophic performance on large datasets.

**Deployment Order**:
1. Deploy Phase 3 (indexes) ✅
2. Verify index creation ✅
3. Deploy Phase 2 (queries) ✅

---

## Objectives

Add MongoDB indexes to support:
- Fast text search across customerInfo fields
- Efficient sorting by date, createdAt, name
- Compound indexes for combined filters

---

## File Changes

### 1. Update Booking Schema

**File**: `apps/api/src/modules/bookings/schemas/booking.schema.ts`

**Current Indexes** (lines 48-52):
```typescript
// Indexes
BookingSchema.index({ serviceId: 1, date: 1, timeSlot: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ 'customerInfo.email': 1 });
BookingSchema.index({ 'customerInfo.phone': 1 });
```

**Add New Indexes**:
```typescript
// Indexes
BookingSchema.index({ serviceId: 1, date: 1, timeSlot: 1 }); // Existing (unchanged)
BookingSchema.index({ status: 1 }); // Existing (unchanged)
BookingSchema.index({ 'customerInfo.email': 1 }); // Existing (unchanged)
BookingSchema.index({ 'customerInfo.phone': 1 }); // Existing (unchanged)

// NEW: Text search indexes
BookingSchema.index({ 'customerInfo.firstName': 'text', 'customerInfo.lastName': 'text' });
// Note: MongoDB text indexes automatically support case-insensitive search

// NEW: Sorting indexes
BookingSchema.index({ date: -1, timeSlot: -1 }); // Sort by date DESC (most common)
BookingSchema.index({ createdAt: -1 }); // Sort by creation date
BookingSchema.index({ 'customerInfo.lastName': 1, 'customerInfo.firstName': 1 }); // Sort by name

// NEW: Compound indexes for common filter combinations
BookingSchema.index({ status: 1, date: -1 }); // Status filter + date sort
BookingSchema.index({ status: 1, createdAt: -1 }); // Status filter + created sort
```

**Index Strategy**:
- **Text indexes**: firstName + lastName (most searched)
- **Single field indexes**: date, createdAt (sorting)
- **Compound indexes**: status + date (common filter combo)
- **Reuse existing**: email, phone already indexed

---

### 2. Update Contact Schema

**File**: `apps/api/src/modules/contacts/schemas/contact.schema.ts`

**Current Indexes** (lines 42-44):
```typescript
// Indexes
ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });
```

**Add New Indexes**:
```typescript
// Indexes
ContactSchema.index({ status: 1, createdAt: -1 }); // Existing (keep for status filter + sort)
ContactSchema.index({ email: 1 }); // Existing (unchanged)

// NEW: Text search indexes
ContactSchema.index({
  firstName: 'text',
  lastName: 'text',
  subject: 'text',
  message: 'text',
  phone: 'text'
}, {
  weights: {
    firstName: 10,  // Prioritize name matches
    lastName: 10,
    subject: 5,     // Medium priority
    email: 5,
    phone: 3,
    message: 1      // Lowest priority (longer text)
  }
});

// NEW: Sorting indexes
ContactSchema.index({ createdAt: -1 }); // Already in compound, but good for solo queries
ContactSchema.index({ firstName: 1, lastName: 1 }); // Sort by name
ContactSchema.index({ lastName: 1, firstName: 1 }); // Sort by lastName first
```

**Index Strategy**:
- **Compound text index**: All searchable fields (firstName, lastName, subject, message, phone)
- **Weights**: Prioritize name/subject over message (relevance scoring)
- **Sorting indexes**: createdAt, firstName, lastName
- **Reuse existing**: status + createdAt compound

---

## Index Analysis

### Index Size Estimation
```
Booking Collection (1000 docs):
- Existing indexes: ~100KB
- New indexes: ~150KB
- Total: ~250KB (negligible overhead)

Contact Collection (500 docs):
- Existing indexes: ~50KB
- New indexes: ~100KB
- Total: ~150KB (negligible overhead)
```

### Query Performance Impact

**Without Indexes** (Phase 2 only):
```
db.bookings.find({ $or: [...] }).explain()
→ COLLSCAN: 1000ms for 1000 docs
```

**With Indexes** (Phase 3 + Phase 2):
```
db.bookings.find({ $or: [...] }).explain()
→ IXSCAN: 10-50ms for 1000 docs (20-100x faster)
```

---

## Index Verification

### After Deployment, Verify Indexes Created:

**MongoDB Shell**:
```javascript
// Check booking indexes
db.bookings.getIndexes()

// Expected output (partial):
[
  { "v": 2, "key": { "_id": 1 }, "name": "_id_" },
  { "v": 2, "key": { "status": 1 }, "name": "status_1" },
  { "v": 2, "key": { "customerInfo.firstName": "text", "customerInfo.lastName": "text" }, "name": "..." },
  { "v": 2, "key": { "date": -1, "timeSlot": -1 }, "name": "date_-1_timeSlot_-1" },
  // ... more indexes
]

// Check contact indexes
db.contacts.getIndexes()

// Verify text index weight
db.contacts.getIndexes().filter(idx => idx.weights)
```

### Verify Index Usage in Queries:

**Test Query**:
```javascript
// Bookings search query
db.bookings.find({
  $or: [
    { 'customerInfo.firstName': /john/i },
    { 'customerInfo.lastName': /john/i }
  ]
}).explain("executionStats")

// Check: "stage": "IXSCAN" (good) vs "COLLSCAN" (bad)
// Check: "executionTimeMillis" < 100
```

**Expected Output**:
```json
{
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 10,
    "executionTimeMillis": 15,  // < 100ms ✅
    "totalKeysExamined": 10,
    "totalDocsExamined": 10,
    "executionStages": {
      "stage": "IXSCAN",  // ✅ Using index
      "indexName": "customerInfo.firstName_text_customerInfo.lastName_text"
    }
  }
}
```

---

## Index Maintenance

### Rebuilding Indexes (if needed)
```javascript
// Drop all indexes (except _id)
db.bookings.dropIndexes()
db.contacts.dropIndexes()

// Restart API (indexes auto-created via schema)
docker restart nail-api
```

### Monitoring Index Performance
```javascript
// Check index stats
db.bookings.aggregate([{ $indexStats: {} }])

// Look for:
// - "accesses.ops": Number of times index used
// - Low ops = unused index (consider removing)
```

---

## Testing Checklist

### Index Creation
- [ ] Bookings: 9 total indexes created
- [ ] Contacts: 6 total indexes created
- [ ] Text indexes have weights (contacts)
- [ ] No duplicate indexes

### Query Performance
- [ ] Bookings search < 100ms (1000 docs)
- [ ] Contacts search < 50ms (500 docs)
- [ ] All queries use IXSCAN (not COLLSCAN)
- [ ] Sorting queries use indexes

### Index Size
- [ ] Total index size < 1MB (reasonable)
- [ ] No memory issues (check MongoDB logs)

---

## Rollback Strategy

### If Indexes Cause Issues:

**Drop New Indexes**:
```javascript
// Bookings
db.bookings.dropIndex("customerInfo.firstName_text_customerInfo.lastName_text")
db.bookings.dropIndex("date_-1_timeSlot_-1")
db.bookings.dropIndex("createdAt_-1")
// ... repeat for all new indexes

// Contacts
db.contacts.dropIndex("firstName_text_lastName_text_...")
// ... repeat
```

**Revert Schema File**:
```bash
git checkout HEAD~1 apps/api/src/modules/bookings/schemas/booking.schema.ts
git checkout HEAD~1 apps/api/src/modules/contacts/schemas/contact.schema.ts
docker restart nail-api
```

---

## Production Deployment Notes

### Index Building (Production)
- MongoDB builds indexes in background (non-blocking)
- Large collections may take minutes
- Monitor: `db.currentOp({ "command.createIndexes": { $exists: true } })`

### Zero-Downtime Strategy
1. Deploy schema changes (indexes in background)
2. Wait for index build completion
3. Deploy Phase 2 code (uses new indexes)

---

## Next Steps

After completing this phase:
1. Verify all indexes created (MongoDB shell)
2. Test query performance (.explain())
3. Monitor index usage (first 24h)
4. Proceed to Phase 4 (FE services)

---

**Estimated Time**: 1 hour (includes verification)
**Actual Time**: ___ hours (fill after completion)

**⚠️ REMINDER**: Deploy this phase BEFORE Phase 2!
