# Contact Notes Endpoint Implementation Plan

**Plan ID**: 260110-contact-notes-endpoint
**Created**: 2026-01-10
**Status**: Ready for Implementation
**Estimated Duration**: 20 minutes

---

## Quick Links

- **[Master Plan](./plan.md)** - Complete overview, problem statement, architecture
- **[Phase 1: Create DTO](./phase-01-create-dto.md)** - DTO validation setup (3 min)
- **[Phase 2: Update Service](./phase-02-update-service.md)** - Add service method (5 min)
- **[Phase 3: Update Controller](./phase-03-update-controller.md)** - Add API endpoint (5 min)
- **[Phase 4: Documentation](./phase-04-documentation.md)** - Update API docs (3 min)
- **[Phase 5: Testing](./phase-05-testing.md)** - Comprehensive testing (4 min)

---

## What This Plan Does

Adds missing `PATCH /contacts/:id/notes` backend endpoint to support admin UI's existing `useUpdateContactNotes()` hook.

**Current State**: Admin UI has hook but backend endpoint missing (404 error)
**After Implementation**: Admin can update notes without changing contact status

---

## Key Features

✅ Granular notes-only updates (no status change required)
✅ Full DTO validation with `class-validator`
✅ JWT authentication required
✅ Complete Swagger documentation
✅ Follows existing NestJS patterns
✅ Type-safe across monorepo

---

## Implementation Order

1. **Create DTO** → Validation rules
2. **Update Service** → Business logic
3. **Update Controller** → API endpoint + Swagger
4. **Update Docs** → Developer reference
5. **Test** → API + Admin UI + Database

---

## Files Changed

**New Files (1)**:
- `apps/api/src/modules/contacts/dto/update-contact-notes.dto.ts`

**Modified Files (3)**:
- `apps/api/src/modules/contacts/contacts.service.ts`
- `apps/api/src/modules/contacts/contacts.controller.ts`
- `docs/api-endpoints.md`

**Total**: 4 files, ~50 LOC added

---

## Success Criteria

- [ ] All 5 phases completed
- [ ] Type-check passes
- [ ] Manual API tests pass (6 test cases)
- [ ] Admin UI integration works
- [ ] Swagger UI shows new endpoint
- [ ] Documentation updated

---

## Get Started

```bash
# Read master plan
cat plan.md

# Follow phases in order
cat phase-01-create-dto.md
cat phase-02-update-service.md
cat phase-03-update-controller.md
cat phase-04-documentation.md
cat phase-05-testing.md
```

---

**Created by**: Claude Code (Sonnet 4.5)
**Based on**: Brainstorming session analysis
**Priority**: Medium (API Completeness)
