# Phase 2: Update Service

**Duration**: 5 minutes
**Files**: 1 modified

---

## Objective

Add `updateNotes()` method to `ContactsService` for updating admin notes without changing status.

---

## Implementation

### File: `apps/api/src/modules/contacts/contacts.service.ts`

**Add new method after `updateStatus()` method (around line 101)**:

```typescript
async updateNotes(id: string, adminNotes: string): Promise<Contact> {
  // Validate MongoDB ObjectId format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid contact ID');
  }

  // Update only adminNotes field
  const contact = await this.contactModel
    .findByIdAndUpdate(
      id,
      { adminNotes },
      { new: true } // Return updated document
    )
    .exec();

  // Handle not found
  if (!contact) {
    throw new NotFoundException(`Contact with ID ${id} not found`);
  }

  return contact;
}
```

---

## Pattern Consistency

**Follows same pattern as `updateStatus()` method (lines 71-100)**:

1. ✅ Validate ObjectId format
2. ✅ Throw `BadRequestException` for invalid ID
3. ✅ Use `findByIdAndUpdate()` with `{ new: true }`
4. ✅ Throw `NotFoundException` if contact not found
5. ✅ Return updated contact document

**Key difference**:
- `updateStatus()` updates multiple fields (status, adminNotes, respondedAt)
- `updateNotes()` updates single field (adminNotes only)

---

## Imports (already present)

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
```

---

## Database Operation

**Mongoose update**:
```typescript
findByIdAndUpdate(
  id,                    // Find by _id
  { adminNotes },        // Update only this field
  { new: true }          // Return updated doc (not old)
)
```

**SQL equivalent**:
```sql
UPDATE contacts
SET admin_notes = 'value', updated_at = NOW()
WHERE _id = 'id'
RETURNING *;
```

---

## Error Handling

| Error Case | Exception | HTTP Status |
|------------|-----------|-------------|
| Invalid ID format | `BadRequestException` | 400 |
| Contact not found | `NotFoundException` | 404 |
| Database error | (unhandled, caught by NestJS) | 500 |

---

## Success Criteria

- [x] Method added after `updateStatus()`
- [x] Correct signature: `async updateNotes(id: string, adminNotes: string): Promise<Contact>`
- [x] ObjectId validation present
- [x] `BadRequestException` thrown for invalid ID
- [x] `NotFoundException` thrown for missing contact
- [x] Returns updated contact document
- [x] No syntax errors
- [x] Follows existing code style

---

## Next Phase

Phase 3: Update Controller (add `PATCH :id/notes` endpoint)
