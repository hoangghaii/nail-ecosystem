# Action Items - Backend Search/Filter Migration

**Date**: 2026-01-14
**Status**: ❌ Blocked - Linting Fixes Required

---

## Critical Blockers 🔴

### 1. Fix Linting Errors (20 errors)
**Time**: 15 minutes
**Command**:
```bash
cd apps/admin
npm run lint -- --fix
```

**Manual Fix Required**:
```typescript
// apps/admin/src/services/contacts.service.ts:24
// BEFORE:
const response = await apiClient.get<any>(`/contacts${queryString}`);

// AFTER:
const response = await apiClient.get<{ data: Contact[] }>(`/contacts${queryString}`);
```

### 2. Verify MongoDB Indexes Deployed
**Time**: 5 minutes
**Command**:
```javascript
// Connect to MongoDB and verify:
db.bookings.getIndexes()  // Should return 9 indexes
db.contacts.getIndexes()  // Should return 6 indexes
```

**Expected Indexes**:
- Bookings: date, createdAt, customerInfo fields, compound indexes
- Contacts: createdAt, firstName, lastName, subject, phone, compound

---

## High Priority ⚠️

### 3. Add Query Performance Logging
**Time**: 10 minutes
**Files**: `bookings.service.ts`, `contacts.service.ts`

```typescript
// Add before Promise.all in findAll methods:
const startTime = Date.now();
const [data, total] = await Promise.all([...]);
this.logger.log(`Query time: ${Date.now() - startTime}ms, filters: ${JSON.stringify(filter)}`);
```

### 4. Add Search String Length Validation
**Time**: 5 minutes
**Files**: `query-bookings.dto.ts`, `query-contacts.dto.ts`

```typescript
import { MaxLength } from 'class-validator';

@MaxLength(500)
@IsString()
search?: string;
```

### 5. Manual Testing
**Time**: 30 minutes
**Test Cases**:
- [ ] Search works across all fields (name, email, phone)
- [ ] Sorting works for all sort fields
- [ ] Status filter + search combination
- [ ] Special characters escaped (try: `john.doe@test.com`)
- [ ] Empty search returns all results
- [ ] Debounce prevents API spam (watch Network tab)
- [ ] Loading states show during filter changes
- [ ] Cache prevents refetch within 30s

---

## Medium Priority 📋

### 6. Monitor Query Plans (Production Week 1)
```javascript
// Run after deployment:
db.bookings.find({ $or: [...] }).explain("executionStats")

// Verify:
// executionStats.executionStages.stage === "IXSCAN" (NOT "COLLSCAN")
```

### 7. Extract Regex Escaping Utility
**Time**: 15 minutes
**Create**: `apps/api/src/common/utils/regex.util.ts`

```typescript
export function escapeRegex(str: string): RegExp {
  const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'i');
}
```

### 8. Standardize Contacts Service Return Type
**Time**: 10 minutes
**File**: `apps/admin/src/services/contacts.service.ts`

```typescript
// Change return type to match bookings:
async getAll(params?: ContactsQueryParams): Promise<PaginationResponse<Contact>>
```

---

## Estimated Time to Production-Ready

- **Critical Blockers**: 20 minutes
- **High Priority**: 45 minutes
- **Total**: ~1 hour

---

## Review Summary

**Grade**: B+ (Good - with blockers)
**Security**: ✅ Excellent (regex escaping, enum validation)
**Performance**: ✅ Good (proper indexing, compound queries)
**Type Safety**: ✅ Strong (1 `any` violation)
**Code Quality**: ✅ High (YAGNI/KISS/DRY)
**Linting**: ❌ Failed (20 errors) - **BLOCKER**

**Full Report**: See `260114-code-review-report.md`

---

**Last Updated**: 2026-01-14
**Approved for Merge**: ❌ (after linting fixes)
