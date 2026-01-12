# Phase 3: Update Controller

**Duration**: 5 minutes
**Files**: 1 modified

---

## Objective

Add `PATCH /contacts/:id/notes` endpoint to controller with full Swagger documentation.

---

## Implementation

### File: `apps/api/src/modules/contacts/contacts.controller.ts`

**Step 1**: Add import for new DTO (top of file, around line 18)

```typescript
import { UpdateContactNotesDto } from './dto/update-contact-notes.dto';
```

**Step 2**: Add endpoint after `updateStatus()` method (around line 82)

```typescript
@Patch(':id/notes')
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Update contact admin notes' })
@ApiResponse({
  status: 200,
  description: 'Contact admin notes successfully updated',
})
@ApiResponse({ status: 400, description: 'Invalid contact ID' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 404, description: 'Contact not found' })
async updateNotes(
  @Param('id') id: string,
  @Body() updateContactNotesDto: UpdateContactNotesDto,
) {
  return this.contactsService.updateNotes(id, updateContactNotesDto.adminNotes);
}
```

---

## Pattern Consistency

**Follows same pattern as `updateStatus()` endpoint (lines 66-81)**:

| Aspect | Pattern |
|--------|---------|
| Route decorator | `@Patch(':id/notes')` |
| Auth | `@ApiBearerAuth('JWT-auth')` required |
| Operation summary | `@ApiOperation({ summary: '...' })` |
| Success response | `@ApiResponse({ status: 200, description: '...' })` |
| Error responses | 400, 401, 404 documented |
| Parameters | `@Param('id')` + `@Body()` DTO |
| Return | Call service method, return result directly |

---

## Swagger Documentation

**How it appears in Swagger UI**:

```
PATCH /contacts/{id}/notes
🔒 Requires: JWT Bearer Token

Summary: Update contact admin notes

Parameters:
  - id (path, required): Contact ID

Request Body (application/json):
{
  "adminNotes": "Customer called back and booked appointment"
}

Responses:
  200 OK: Contact admin notes successfully updated
  400 Bad Request: Invalid contact ID
  401 Unauthorized: Missing or invalid JWT token
  404 Not Found: Contact not found
```

---

## Request/Response Flow

```
Client Request
    ↓
@Patch(':id/notes') decorator → Route matching
    ↓
@ApiBearerAuth → JWT validation
    ↓
@Param('id') → Extract ID from URL
    ↓
@Body() → Parse & validate DTO (class-validator)
    ↓
updateNotes() → Call service method
    ↓
Service → Update database
    ↓
Response → Return updated contact (200 OK)
```

---

## DTO Validation Automatic

**NestJS ValidationPipe** (configured in `main.ts`) automatically validates:
- ✅ `adminNotes` is string
- ✅ `adminNotes` is not empty
- ✅ `adminNotes` max 1000 chars

**Invalid request example**:
```json
Request: { "adminNotes": "" }

Response 400:
{
  "statusCode": 400,
  "message": ["Admin notes cannot be empty"],
  "error": "Bad Request"
}
```

---

## Success Criteria

- [x] Import `UpdateContactNotesDto` added
- [x] `@Patch(':id/notes')` decorator present
- [x] `@ApiBearerAuth('JWT-auth')` decorator present
- [x] `@ApiOperation()` with summary
- [x] All `@ApiResponse()` decorators (200, 400, 401, 404)
- [x] Method signature correct
- [x] Calls `this.contactsService.updateNotes()`
- [x] Returns service result directly
- [x] No syntax errors

---

## Next Phase

Phase 4: Update API Documentation (add to `docs/api-endpoints.md`)
