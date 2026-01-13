# Phase 2: Integrate Hook into Modal

**Duration**: 7 minutes
**Prerequisites**: Phase 1 complete

---

## Objective

Add `useUpdateContactNotes()` hook with conditional submit logic to `ContactDetailsModal`.

---

## Implementation Steps

### Step 1: Import Hook and Type

**File**: `apps/admin/src/components/contacts/ContactDetailsModal.tsx`

**Add to imports (after line 7)**:

```typescript
import type { ContactNotesUpdate } from "@/lib/validations/contact.validation";
```

**Modify import on line 28**:

```typescript
import { useUpdateContactStatus, useUpdateContactNotes } from "@/hooks/api/useContacts";
```

---

### Step 2: Initialize Hook

**Add after line 43** (after `useUpdateContactStatus()`):

```typescript
const updateNotes = useUpdateContactNotes();
```

---

### Step 3: Add Change Detection Logic

**Replace `onSubmit` function (lines 73-88)** with:

```typescript
const onSubmit = (data: ContactStatusUpdate) => {
  if (!contact) return;

  const statusChanged = data.status !== contact.status;
  const notesChanged = (data.adminNotes || "") !== (contact.adminNotes || "");

  // Notes-only update (no status change)
  if (notesChanged && !statusChanged && data.adminNotes) {
    updateNotes.mutate(
      {
        adminNotes: data.adminNotes,
        id: contact._id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
    return;
  }

  // Status update (with or without notes)
  updateStatus.mutate(
    {
      adminNotes: data.adminNotes,
      id: contact._id,
      status: data.status,
    },
    {
      onSuccess: () => {
        onClose();
      },
    },
  );
};
```

---

### Step 4: Update Loading State

**Modify line 46** (`isSubmitting` check):

```typescript
const isLoading = updateStatus.isPending || updateNotes.isPending;
```

**Update all `disabled={isSubmitting}` to `disabled={isLoading || isSubmitting}`**:

- Line 244: `disabled={isLoading || isSubmitting}`
- Line 248: `disabled={isLoading || isSubmitting}`
- Line 249: `{isLoading || isSubmitting ? "Saving..." : "Save Changes"}`

---

## Logic Flow

```
User clicks "Save Changes"
    ↓
onSubmit(formData)
    ↓
Check: notesChanged && !statusChanged?
    ↓
  YES                    NO
    ↓                    ↓
PATCH /contacts/:id/notes   PATCH /contacts/:id/status
(Notes-only update)         (Status ± notes update)
    ↓                    ↓
Toast: "Admin notes updated"  Toast: "Contact status updated"
    ↓                    ↓
Close modal & invalidate cache
```

---

## Code Patterns

### Why Guard `data.adminNotes`?

```typescript
if (notesChanged && !statusChanged && data.adminNotes) {
                                      ↑ Guard against undefined
```

**Reason**: Schema allows `adminNotes: z.string().optional()` in status update flow.
- If notes deleted (empty), `data.adminNotes` is `undefined`
- Backend requires non-empty string
- Guard prevents API error

---

### Why Not Use `contactNotesUpdateSchema`?

**Considered**: Switch form validation schema based on mode
**Rejected**:
- Adds complexity (dynamic schema switching)
- Current schema works fine (both fields available)
- Conditional logic at submit time is simpler
- Follows YAGNI principle

---

## Verification

### Type-Check

```bash
npm run type-check --filter=admin
```

**Expected**: No TypeScript errors

### Build Test

```bash
npx turbo build --filter=admin
```

**Expected**: Build succeeds

---

## Next Phase

[→ Phase 3: Testing & Verification](./phase-03-testing.md)
