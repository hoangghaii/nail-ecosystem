# Booking Error Toast Notification

**Plan ID**: 260215-1857
**Created**: 2026-02-15
**Status**: 📋 Planning
**Priority**: MEDIUM
**Estimated Tokens**: 3,000

## Overview

Replace inline ErrorMessage component in booking page with toast notification for error handling, while keeping the full-page success confirmation.

## Context

- **Location**: `apps/client/src/pages/BookingPage.tsx`
- **Current**: Inline ErrorMessage component with retry button
- **Target**: Toast notification for errors
- **Success**: Keep full-page BookingConfirmation (better UX)
- **Impact**: Client app only

## Current State

**Error Display** (Lines 162-168):
```typescript
{isError && (
  <ErrorMessage
    message="Không thể đặt lịch. Vui lòng thử lại hoặc liên hệ với chúng tôi."
    onRetry={onSubmit}
    className="mb-6"
  />
)}
```

**Issues**:
- ❌ Inline error takes up space in UI
- ❌ Inconsistent with contact form (uses toast)
- ❌ Retry button may be confusing (form state persists)

## Target Implementation

**Toast Error**:
- Remove inline ErrorMessage component
- Add toast.error() in booking mutation onError callback
- Error message in Vietnamese
- No retry button needed (user can resubmit)

## Changes Summary

1. **Remove ErrorMessage import** (line 6)
2. **Add toast import** from `@/lib/toast`
3. **Remove inline ErrorMessage JSX** (lines 162-168)
4. **Add error toast** in mutation error handler
5. **Clean up isError state** if not used elsewhere

## Implementation Phases

| Phase | Description | Estimated Tokens |
|-------|-------------|------------------|
| [Phase 01](./phase-01-error-toast.md) | Replace ErrorMessage with toast notification | 3,000 |

## Success Criteria

- ✓ No inline ErrorMessage component in booking page
- ✓ Error toast displays on booking failure
- ✓ Error message in Vietnamese
- ✓ Success confirmation page unchanged
- ✓ No console errors
- ✓ Type safety maintained
- ✓ Consistent with contact form error handling

## Technical Notes

**Hook Location**: Need to find where booking mutation is called (likely in `useBookingPage` hook)

**Error Message**: "Không thể đặt lịch. Vui lòng thử lại hoặc liên hệ với chúng tôi."

## Risk Assessment

**Very Low Risk**:
- UI-only change
- No backend impact
- No data changes
- Success flow unchanged
- Easy to rollback

## Related Files

**Modified**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/BookingPage.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/hooks/useBookingPage.ts`

**Reference**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/lib/toast.ts`

## YAGNI/KISS/DRY Compliance

✅ **YAGNI**: Simple toast replacement, no extra features
✅ **KISS**: Reusing existing toast pattern from contact form
✅ **DRY**: Consistent error handling across app

---

**Token Budget**: 3,000 tokens
**Next Action**: Proceed to [Phase 01](./phase-01-error-toast.md)
