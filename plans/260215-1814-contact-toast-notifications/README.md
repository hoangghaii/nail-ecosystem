# Contact Toast Notifications - Implementation Plan

**Plan ID**: 260215-1814
**Created**: 2026-02-15
**Status**: 📋 Ready for Implementation

## Quick Summary

Replace inline success/error message boxes in contact form with toast notifications for cleaner, more professional UX.

## Files Overview

- **[plan.md](./plan.md)** - Complete plan overview, context, requirements, success criteria
- **[phase-01-toast-integration.md](./phase-01-toast-integration.md)** - Detailed implementation steps, code changes, testing checklist

## What Changes

**Single File Modified**:
- `apps/client/src/components/contact/contact-form.tsx`

**Changes**:
1. Add toast import
2. Add toast.success() in mutation onSuccess callback
3. Add toast.error() in mutation onError callback
4. Remove inline message boxes JSX (lines 56-72)
5. Clean up unused isSuccess/isError destructuring

**Messages** (Vietnamese, preserved):
- Success: "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất."
- Error: "Không thể gửi tin nhắn. Vui lòng thử lại."

## Implementation Time

**Estimated**: ~15 minutes
- Code changes: 5 min
- Manual testing: 5 min
- Code review: 5 min

**Token Budget**: 3,000 tokens

## Risk Assessment

**Very Low Risk**:
✓ Pure UI change, no logic changes
✓ Toast infrastructure already exists and tested
✓ No backend/API impact
✓ No shared types impact
✓ Isolated to single component
✓ Easy to rollback

## Success Criteria Checklist

- [ ] No inline message boxes in contact form UI
- [ ] Success toast appears on successful form submission
- [ ] Error toast appears on failed submission
- [ ] Form resets after successful submission
- [ ] Messages remain in Vietnamese
- [ ] Toast styling matches client theme (warm, border-based, 16px radius)
- [ ] No console errors
- [ ] Type safety maintained
- [ ] Build successful

## Quick Start

1. Read [plan.md](./plan.md) for full context
2. Follow [phase-01-toast-integration.md](./phase-01-toast-integration.md) implementation steps
3. Run manual testing checklist
4. Verify all success criteria met

## Related Documentation

- Toast utility: `/apps/client/src/lib/toast.ts`
- Toaster component: `/apps/client/src/components/ui/sonner.tsx`
- Design system: `/docs/design-guidelines.md`
- Code standards: `/docs/code-standards.md`

---

**Next Action**: Proceed with Phase 01 implementation
