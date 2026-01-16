# Phase 5: Database Seeding

**Plan**: 260116-2009-integrate-business-info-api
**Phase**: 5 of 7
**Effort**: 15 minutes

---

## Objective

Update default business info in API service to match real salon data instead of generic defaults.

---

## Tasks

### 1. Update Default Business Info
**File**: `apps/api/src/modules/business-info/business-info.service.ts`
**Location**: Lines 22-70 (inside `findOne()` method)

**Replace**:
```typescript
businessInfo = new this.businessInfoModel({
  phone: '+1 (555) 000-0000',
  email: 'contact@nailsalon.com',
  address: '123 Main St, City, State 12345',
  businessHours: [
    {
      day: 'monday',
      openTime: '09:00',
      closeTime: '18:00',
      closed: false,
    },
    // ... existing generic hours
  ],
});
```

**With**:
```typescript
businessInfo = new this.businessInfoModel({
  phone: '(555) 123-4567',
  email: 'hello@pinknail.com',
  address: '123 Beauty Lane, San Francisco, CA 94102',
  businessHours: [
    { day: 'monday', openTime: '09:00', closeTime: '19:00', closed: false },
    { day: 'tuesday', openTime: '09:00', closeTime: '19:00', closed: false },
    { day: 'wednesday', openTime: '09:00', closeTime: '19:00', closed: false },
    { day: 'thursday', openTime: '09:00', closeTime: '20:00', closed: false },
    { day: 'friday', openTime: '09:00', closeTime: '20:00', closed: false },
    { day: 'saturday', openTime: '10:00', closeTime: '18:00', closed: false },
    { day: 'sunday', openTime: '00:00', closeTime: '00:00', closed: true },
  ],
});
```

### 2. Clear Existing Data (If Needed)
If database already has business info document:

**Option A**: Delete via MongoDB shell
```bash
docker exec -it nail-api-db mongosh
use nail-salon
db.businessinfos.deleteMany({})
exit
```

**Option B**: Delete via API endpoint (if exists)
```bash
# Check existing data
curl http://localhost:3000/business-info

# Then manually delete via MongoDB or restart with fresh DB
```

After deletion, API will auto-create new defaults on next `GET /business-info` call.

---

## Validation

- [ ] API returns updated business info
- [ ] Phone: `(555) 123-4567`
- [ ] Email: `hello@pinknail.com`
- [ ] Address: `123 Beauty Lane, San Francisco, CA 94102`
- [ ] Monday-Wednesday: 9AM-7PM
- [ ] Thursday-Friday: 9AM-8PM
- [ ] Saturday: 10AM-6PM
- [ ] Sunday: Closed
- [ ] Data persists after API restart

---

## Notes

- Matches mock data from `apps/client/src/data/businessInfo.ts`
- Times in 24-hour format (API standard)
- Sunday uses `00:00` times with `closed: true`
- Auto-creation only happens if collection is empty
