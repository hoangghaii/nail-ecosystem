# Contact Notes UI Integration Plan

**Plan ID**: 260113-contact-notes-ui-integration
**Created**: 2026-01-13
**Status**: Ready for Implementation
**Estimated Duration**: 15 minutes

---

## Quick Links

- **[Master Plan](./plan.md)** - Complete overview, problem statement, architecture
- **[Phase 1: Add Validation Schema](./phase-01-add-validation-schema.md)** - Create notes-only schema (3 min)
- **[Phase 2: Integrate Hook](./phase-02-integrate-hook.md)** - Add hook & conditional logic (7 min)
- **[Phase 3: Testing](./phase-03-testing.md)** - Comprehensive UI testing (5 min)

---

## What This Plan Does

Integrates existing `useUpdateContactNotes()` hook into `ContactDetailsModal` to enable granular notes updates without forcing status changes.

**Current State**: Hook exists but not used, all updates go through status endpoint
**After Implementation**: Smart routing - notes-only updates use dedicated endpoint

---

## Key Features

✅ Granular notes-only updates (no status change)
✅ Backward compatible (existing status flow unchanged)
✅ Optimal API usage (correct endpoint per operation)
✅ Type-safe with Zod validation
✅ Follows YAGNI/KISS principles
✅ Backend fully tested (100% pass rate)

---

## Implementation Order

1. **Add Validation Schema** → Type-safe notes updates
2. **Integrate Hook** → Conditional submit logic
3. **Test** → Manual UI verification

---

## Files Changed

**Modified Files (2)**:
- `apps/admin/src/lib/validations/contact.validation.ts`
- `apps/admin/src/components/contacts/ContactDetailsModal.tsx`

**Total**: 2 files, ~20 LOC added/modified

---

## Success Criteria

- [ ] All 3 phases completed
- [ ] Type-check passes
- [ ] Notes-only updates call `PATCH /contacts/:id/notes`
- [ ] Status updates call `PATCH /contacts/:id/status`
- [ ] UI tests pass (6 test cases)
- [ ] No console errors

---

## Get Started

```bash
# Read master plan
cat plan.md

# Follow phases in order
cat phase-01-add-validation-schema.md
cat phase-02-integrate-hook.md
cat phase-03-testing.md
```

---

## Context

**Backend Plan**: `/plans/260110-contact-notes-endpoint/`
**Backend Status**: ✅ Completed, tested, production-ready
**Frontend Status**: ⏳ Ready for integration

---

**Created by**: Claude Code (Sonnet 4.5)
**Based on**: Backend implementation (260110-contact-notes-endpoint)
**Priority**: High (Complete Backend Integration)
