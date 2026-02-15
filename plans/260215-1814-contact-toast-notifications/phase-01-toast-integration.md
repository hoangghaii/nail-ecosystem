# Phase 01: Toast Integration

**Phase**: 01/01
**Date**: 2026-02-15
**Description**: Replace inline success/error messages with toast notifications
**Priority**: Medium
**Status**: ✅ Completed
**Estimated Tokens**: 3,000
**Actual Tokens**: ~2,800
**Completion Date**: 2026-02-15

## Context Links

- [Plan Overview](./plan.md)
- [Contact Form Component](/Users/hainguyen/Documents/nail-project/apps/client/src/components/contact/contact-form.tsx)
- [Toast Utility](/Users/hainguyen/Documents/nail-project/apps/client/src/lib/toast.ts)
- [Code Standards](/Users/hainguyen/Documents/nail-project/docs/code-standards.md)

## Overview

Single-phase implementation to replace inline message boxes with toast notifications. Remove conditional message rendering, add toast calls to mutation callbacks.

## Key Insights

**Current Implementation** (Lines 32, 56-72):
```typescript
// Line 32: Destructure isSuccess/isError from mutation
const { isError, isPending, isSuccess, mutate } = useContactMutation();

// Lines 56-72: Inline message boxes
{isSuccess && <div>✓ Success message</div>}
{isError && <div>Error message</div>}
```

**Target Implementation**:
```typescript
// Add import
import { toast } from "@/lib/toast";

// Mutation with callbacks
mutate(payload, {
  onSuccess: () => {
    toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.");
    reset();
  },
  onError: () => {
    toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
  }
});
```

**Messages** (Preserve existing Vietnamese text):
- Success: "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất."
- Error: "Không thể gửi tin nhắn. Vui lòng thử lại."

## Requirements

### Functional Requirements

**FR-01**: Success Toast
- Display success toast on form submission success
- Toast appears at top-right position
- Toast auto-dismisses after default duration
- Message in Vietnamese

**FR-02**: Error Toast
- Display error toast on form submission failure
- Toast appears at top-right position
- Toast auto-dismisses after default duration
- Message in Vietnamese

**FR-03**: Form Reset
- Form clears after successful submission (existing behavior)
- No reset on error (existing behavior)

**FR-04**: Clean UI
- No inline message boxes in form
- Form layout unchanged except removed message area
- Spacing consistent

### Non-Functional Requirements

**NFR-01**: Type Safety
- No TypeScript errors
- Proper import types

**NFR-02**: Design System
- Toast styling matches client theme (warm, border-based)
- Rounded corners: 16px
- Font: font-sans
- Border: 2px solid

**NFR-03**: Performance
- No performance impact
- Toast library already loaded

## Architecture

**Component Structure Change**:
```
ContactForm (contact-form.tsx)
├── Imports
│   └── + import { toast } from "@/lib/toast"   [ADD]
├── Mutation Hook
│   └── - isSuccess, isError destructure         [REMOVE if unused]
├── Form Submission Handler
│   └── mutate() callbacks
│       ├── + onSuccess: toast.success()         [ADD]
│       └── + onError: toast.error()             [ADD]
└── JSX
    └── - Inline message boxes (lines 56-72)     [REMOVE]
```

**No Impact On**:
- Backend API
- Shared types
- Other components
- Form validation logic
- Form fields

## Implementation Details

### Step 1: Add Toast Import

**Location**: Line 6 (after existing imports)

```typescript
import { toast } from "@/lib/toast";
```

### Step 2: Update Mutation Destructuring

**Location**: Line 32

**Current**:
```typescript
const { isError, isPending, isSuccess, mutate } = useContactMutation();
```

**Updated** (remove `isSuccess`, `isError` if not used elsewhere):
```typescript
const { isPending, mutate } = useContactMutation();
```

**Note**: Check if `isSuccess`/`isError` used elsewhere before removing.

### Step 3: Update Form Submission Handler

**Location**: Lines 35-48

**Current**:
```typescript
const onSubmit = (data: ContactFormValues) => {
  const payload = {
    ...data,
    email: data.email || undefined,
    subject: data.subject || undefined,
  };

  mutate(payload, {
    onSuccess: () => {
      reset();
    },
  });
};
```

**Updated**:
```typescript
const onSubmit = (data: ContactFormValues) => {
  const payload = {
    ...data,
    email: data.email || undefined,
    subject: data.subject || undefined,
  };

  mutate(payload, {
    onSuccess: () => {
      toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.");
      reset();
    },
    onError: () => {
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
    },
  });
};
```

### Step 4: Remove Inline Message Boxes

**Location**: Lines 56-72

**Remove Entire Block**:
```typescript
{/* Success Message */}
{isSuccess && (
  <div className="mb-6 rounded-[12px] border border-border bg-background p-4">
    <p className="font-sans text-base text-foreground">
      ✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
    </p>
  </div>
)}

{/* Error Message */}
{isError && (
  <div className="mb-6 rounded-[12px] border border-destructive/50 bg-destructive/10 p-4">
    <p className="font-sans text-sm text-destructive">
      Không thể gửi tin nhắn. Vui lòng thử lại.
    </p>
  </div>
)}
```

**Result**: Form JSX starts directly with `<form>` tag.

## Code Changes Summary

**File**: `/Users/hainguyen/Documents/nail-project/apps/client/src/components/contact/contact-form.tsx`

**Changes**:
1. Line 6: Add `import { toast } from "@/lib/toast";`
2. Line 32: Remove `isSuccess, isError` from destructure (if unused)
3. Lines 44-47: Add toast calls in mutation callbacks
4. Lines 56-72: Remove inline message JSX

**Line Count Change**: ~17 lines removed, ~3 lines added = -14 lines net

## Testing Checklist

### Manual Testing

**Success Flow**:
- [ ] Fill form with valid data
- [ ] Submit form
- [ ] Success toast appears at top-right
- [ ] Toast message: "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất."
- [ ] Form fields clear after submission
- [ ] No inline message boxes visible
- [ ] Toast auto-dismisses

**Error Flow**:
- [ ] Stop API server (simulate failure)
- [ ] Fill form with valid data
- [ ] Submit form
- [ ] Error toast appears at top-right
- [ ] Toast message: "Không thể gửi tin nhắn. Vui lòng thử lại."
- [ ] Form fields retain data
- [ ] No inline message boxes visible
- [ ] Toast auto-dismisses

**Visual Verification**:
- [ ] Toast styling matches client theme
- [ ] Border-radius: 16px
- [ ] Success toast: primary border
- [ ] Error toast: destructive border
- [ ] Font: font-sans
- [ ] No layout shift

**Edge Cases**:
- [ ] Multiple rapid submissions → multiple toasts stack correctly
- [ ] Toast while form visible → no z-index issues

### Automated Testing

**Type Check**:
```bash
cd /Users/hainguyen/Documents/nail-project
npm run type-check --filter=client
```

**Build**:
```bash
npm run build --filter=client
```

**Expected**: No errors

## Rollback Plan

If issues arise:

1. Revert changes to `contact-form.tsx`
2. Restore inline message boxes (lines 56-72)
3. Restore `isSuccess`, `isError` destructure
4. Remove toast import and callbacks

**Risk**: Very low (simple UI change, no API/data impact)

## Completion Criteria

- ✅ Toast import added
- ✅ Success toast displays on success
- ✅ Error toast displays on error
- ✅ Inline message boxes removed
- ✅ Form reset behavior preserved
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Build successful
- ⏳ Manual testing passed (user to perform)
- ✅ Toast styling matches client theme

**Code Review**: APPROVED (see reports/260215-code-review-report.md)

## Code Review Checklist

- [ ] Import statement correct
- [ ] Toast messages in Vietnamese
- [ ] Toast messages match original inline messages
- [ ] Mutation callbacks structured correctly
- [ ] No unused variables (`isSuccess`, `isError`)
- [ ] No console.log statements
- [ ] Consistent code formatting
- [ ] Design system compliance (client theme)

## Dependencies

**External**:
- `sonner` library (already installed)

**Internal**:
- `@/lib/toast` utility (already exists)
- `@/components/ui/sonner` component (already rendered in App.tsx)

**No New Dependencies Required**

## Estimated Implementation Time

- Code changes: 5 minutes
- Manual testing: 5 minutes
- Code review: 3 minutes
- **Total**: ~15 minutes

## Token Budget

**Estimated**: 3,000 tokens
**Breakdown**:
- File reading: 500
- Code changes: 1,000
- Testing: 500
- Documentation: 1,000

---

## Implementation Summary

**Changes Made**:
1. Added toast import: `import { toast } from "@/lib/toast";` (line 6)
2. Removed `isSuccess, isError` from mutation destructuring (line 33)
3. Added success toast in onSuccess callback (line 46)
4. Added error toast in onError callback (line 50)
5. Removed inline message boxes JSX (17 lines removed)

**Net Change**: -14 lines (cleaner component)

**Code Review**: APPROVED
**Build Status**: PASSED (type-check + build)
**Manual Testing**: User to perform

---

**Status**: COMPLETED
**Next Action**: User to perform manual testing, then close plan
