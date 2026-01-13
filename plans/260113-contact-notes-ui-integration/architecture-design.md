# Architecture & Design Decisions

**Plan**: Contact Notes UI Integration
**Created**: 2026-01-13

---

## Integration Design

### Dual-Mode Form Strategy

```typescript
// Mode 1: Notes-only update (NEW)
if (onlyNotesChanged) {
  useUpdateContactNotes() → PATCH /contacts/:id/notes
}

// Mode 2: Status update (existing)
if (statusChanged || bothChanged) {
  useUpdateContactStatus() → PATCH /contacts/:id/status
}
```

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Form strategy** | Single form, dual submit paths | Avoid UI complexity, reuse existing form |
| **Change detection** | Compare initial vs current values | Determine which mutation to use |
| **Validation** | Separate schema for notes-only | Type-safe notes updates |
| **Backward compat** | Keep existing status flow intact | No breaking changes |
| **API efficiency** | Use notes endpoint when applicable | Avoid redundant status updates |

---

## Why This Approach?

### ✅ Chosen: Single Form with Smart Routing

**Pros**:
- No UI changes required
- Transparent to user
- Minimal code changes
- Backward compatible
- YAGNI compliant

**Implementation**:
```typescript
const onSubmit = (data: ContactStatusUpdate) => {
  const statusChanged = data.status !== contact.status;
  const notesChanged = (data.adminNotes || "") !== (contact.adminNotes || "");

  if (notesChanged && !statusChanged && data.adminNotes) {
    updateNotes.mutate({ id, adminNotes }); // Notes endpoint
  } else {
    updateStatus.mutate({ id, status, adminNotes }); // Status endpoint
  }
};
```

---

### ❌ Rejected: Separate Forms

**Considered**: Two forms (status form + notes form with separate buttons)

**Pros**:
- Explicit user intent
- Clearer separation of concerns

**Cons**:
- Adds UI complexity
- Confuses users ("which button?")
- More code to maintain
- Violates YAGNI
- Requires design changes

**Verdict**: Rejected (over-engineering)

---

### ❌ Rejected: Dynamic Schema Switching

**Considered**: Switch validation schema based on detected changes

**Pros**:
- Type-perfect validation per mode

**Cons**:
- Complex state management
- Schema switching logic fragile
- Runtime validation overhead
- Current schema works fine

**Verdict**: Rejected (unnecessary complexity)

---

## Change Detection Logic

### Implementation

```typescript
const initialStatus = contact.status;
const initialNotes = contact.adminNotes || "";

const statusChanged = data.status !== initialStatus;
const notesChanged = (data.adminNotes || "") !== initialNotes;
```

### Edge Cases

| Scenario | statusChanged | notesChanged | Action |
|----------|--------------|-------------|--------|
| Edit notes only | false | true | Notes endpoint |
| Edit status only | true | false | Status endpoint |
| Edit both | true | true | Status endpoint |
| Edit neither | false | false | No-op (form dirty check) |
| Delete notes | false | true | Status endpoint (empty notes) |

---

## Type Safety

### Validation Schemas

```typescript
// Existing (unchanged)
export const contactStatusUpdateSchema = z.object({
  adminNotes: z.string().optional(),
  status: z.enum(["new", "read", "responded", "archived"]),
});

// New (notes-only)
export const contactNotesUpdateSchema = z.object({
  adminNotes: z.string().min(1, "Admin notes cannot be empty"),
});
```

### Why Not Use New Schema in Form?

**Answer**: Form continues using `contactStatusUpdateSchema`
- Both fields available for editing
- Conditional logic at submit determines endpoint
- No schema switching complexity
- Type-safe via discriminated union handling

---

## API Usage Patterns

### Pattern 1: Notes-Only Update

```typescript
// Frontend
updateNotes.mutate({ id, adminNotes });

// API Call
PATCH /contacts/:id/notes
Body: { "adminNotes": "..." }

// Backend validates: @IsNotEmpty() @MinLength(1) @MaxLength(1000)
```

### Pattern 2: Status Update (with optional notes)

```typescript
// Frontend
updateStatus.mutate({ id, status, adminNotes });

// API Call
PATCH /contacts/:id/status
Body: { "status": "read", "adminNotes": "..." }

// Backend validates: status required, adminNotes optional
```

---

## Loading State Management

### Problem

Two mutations possible → Need combined loading state

### Solution

```typescript
const updateStatus = useUpdateContactStatus();
const updateNotes = useUpdateContactNotes();

const isLoading = updateStatus.isPending || updateNotes.isPending;

// Use in UI
<Button disabled={isLoading || isSubmitting}>
  {isLoading || isSubmitting ? "Saving..." : "Save Changes"}
</Button>
```

---

## Toast Notification Strategy

### Current (from hooks)

```typescript
// useUpdateContactNotes (hooks/api/useContacts.ts:74)
toast.success("Admin notes updated successfully");

// useUpdateContactStatus (hooks/api/useContacts.ts:59)
toast.success("Contact status updated successfully");
```

### Result

- Notes-only: "Admin notes updated successfully"
- Status change: "Contact status updated successfully"
- Clear feedback on what action occurred

---

## Cache Invalidation

### Strategy (from hooks)

Both hooks invalidate same cache keys:

```typescript
onSuccess: (updated) => {
  // Invalidate list queries (refetch)
  queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });

  // Update detail query (optimistic)
  queryClient.setQueryData(queryKeys.contacts.detail(updated._id), updated);
}
```

**Result**: UI stays synchronized regardless of endpoint used

---

## Backward Compatibility

### Guarantee

✅ Existing status update flow unchanged
✅ No breaking changes to form UX
✅ Current behavior preserved for status-only updates
✅ API contracts unchanged (backend endpoints stable)

### Migration Risk

**Risk Level**: Low
- Additive change (new code path)
- Existing path unchanged
- Rollback trivial (remove new code)

---

## Performance Considerations

### API Efficiency

**Before**: All updates → `PATCH /contacts/:id/status` (even notes-only)
**After**: Notes-only → `PATCH /contacts/:id/notes` (correct endpoint)

**Benefit**:
- Reduced status field writes
- Clearer API logs
- Better audit trail
- Semantic correctness

### Bundle Size

**Impact**: Negligible (~20 LOC added)
- No new dependencies
- Reuses existing hooks
- Minimal conditional logic

---

## Security

### Authentication

Both endpoints require JWT:
```typescript
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
```

### Authorization

Admin-only operations (existing pattern maintained)

### Validation

Client-side (Zod) + Server-side (class-validator)
- Defense in depth
- Consistent validation rules

---

## Future Enhancements (Out of Scope)

### Low Priority

1. **Whitespace-only notes rejection**
   - Add `@Transform` + `@Matches` in backend DTO
   - Client validation via Zod refinement

2. **Separate "Save Notes" button**
   - Explicit UI for notes-only updates
   - Requires design review

3. **Notes history/audit log**
   - Track changes over time
   - Requires database schema change

### Deferred

Not needed for MVP, can be added later if user feedback requests them.
