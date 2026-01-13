# Phase 1: Add Validation Schema

**Duration**: 3 minutes
**Prerequisites**: None

---

## Objective

Create `contactNotesUpdateSchema` for type-safe notes-only updates.

---

## Implementation

### File: `apps/admin/src/lib/validations/contact.validation.ts`

**Add after line 8**:

```typescript
export const contactNotesUpdateSchema = z.object({
  adminNotes: z.string().min(1, "Admin notes cannot be empty"),
});

export type ContactNotesUpdate = z.infer<typeof contactNotesUpdateSchema>;
```

**Result**:
```typescript
import { z } from "zod";

export const contactStatusUpdateSchema = z.object({
  adminNotes: z.string().optional(),
  status: z.enum(["new", "read", "responded", "archived"]),
});

export type ContactStatusUpdate = z.infer<typeof contactStatusUpdateSchema>;

export const contactNotesUpdateSchema = z.object({
  adminNotes: z.string().min(1, "Admin notes cannot be empty"),
});

export type ContactNotesUpdate = z.infer<typeof contactNotesUpdateSchema>;
```

---

## Why This Schema?

1. **Required Notes**: `min(1)` ensures empty notes rejected client-side
2. **Simple**: Only validates what's needed for notes-only updates
3. **Type-Safe**: Zod generates TypeScript type automatically
4. **Consistent**: Matches backend DTO validation (`@IsNotEmpty()`, `@MinLength(1)`)

---

## Verification

```bash
npm run type-check --filter=admin
```

**Expected**: No TypeScript errors

---

## Next Phase

[→ Phase 2: Integrate Hook into Modal](./phase-02-integrate-hook.md)
