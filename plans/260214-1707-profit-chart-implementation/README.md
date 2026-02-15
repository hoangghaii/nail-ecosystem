# Profit Chart Implementation - Plan Overview

**Created**: 2026-02-14
**Status**: Ready for Implementation
**Estimated Duration**: 3-4 days

---

## Quick Start

1. **Read**: `./plan.md` (overview + phase links)
2. **Execute**: Follow phases 1-5 sequentially
3. **Reference**: Research reports in `./research/`, scout reports in `./scout/`

---

## Plan Structure

```
260214-1707-profit-chart-implementation/
├── plan.md                                    # Main plan (phases, timeline, decisions)
├── phase-01-backend-expense-analytics.md      # Backend (1.5 days)
├── phase-02-shared-types.md                   # Types (0.5 day)
├── phase-03-frontend-expense-management.md    # Frontend CRUD (1 day)
├── phase-04-frontend-profit-chart.md          # Recharts (1 day)
├── phase-05-testing-documentation.md          # QA (0.5 day)
├── research/
│   ├── researcher-01-recharts-financial-charts.md
│   └── researcher-02-expense-analytics-api.md
└── scout/
    ├── scout-01-api-patterns.md
    ├── scout-02-admin-ui-patterns.md
    └── scout-03-types-hooks-patterns.md
```

---

## Key Decisions

1. **Simple Approach**: Revenue & expense tracking only (no inventory/payments)
2. **Decimal128**: Prevents floating-point errors in currency calculations
3. **Monthly Cadence**: Realistic expense entry frequency for nail salon
4. **Recharts**: React-native, TypeScript-friendly, proven stability
5. **Completed = Paid**: Simplifies revenue calculation (train staff workflow)

---

## Technology Stack

**Backend**: NestJS 11, MongoDB (Decimal128), Mongoose
**Frontend**: React 19.2, Recharts 2.15, TanStack Query, React Hook Form + Zod
**Shared**: @repo/types, @repo/utils (useDebounce)

**New Dependencies**: `recharts@^2.15.0`, `date-fns` (admin app only)

---

## Implementation Order

1. **Phase 1** (Backend): Expense & Analytics modules → API endpoints ready
2. **Phase 2** (Types): Shared types in @repo/types → Type safety across apps
3. **Phase 3** (Frontend): Expense management page → CRUD operations
4. **Phase 4** (Frontend): Profit chart → Visualization
5. **Phase 5** (Testing): Manual testing, docs, UAT → Production-ready

**Critical**: Phases 1-2 must complete before 3-4. Phases 3-4 can run parallel.

---

## Success Criteria

- [ ] Admins can add expenses in <30 seconds
- [ ] Profit chart loads in <2 seconds
- [ ] Currency accurate to 2 decimals
- [ ] Mobile responsive (320px+)
- [ ] Zero TypeScript errors
- [ ] API response time <500ms
- [ ] Follows existing codebase patterns

---

## Context Documents

**Brainstorm**: `/Users/hainguyen/Documents/nail-project/plans/260214-profit-chart-brainstorm.md`
**Standards**: `/Users/hainguyen/Documents/nail-project/docs/code-standards.md`
**Architecture**: `/Users/hainguyen/Documents/nail-project/docs/system-architecture.md`

---

## Quick Reference

**Research Highlights**:
- Decimal128 for currency precision (research-02)
- ResponsiveContainer + Intl.NumberFormat (research-01)
- MongoDB aggregation for analytics (research-02)

**Scout Highlights**:
- NestJS module patterns (scout-01)
- React infinite scroll + form modal (scout-02)
- TanStack Query hooks (scout-03)

**Key Files to Reference**:
- Backend: `/apps/api/src/modules/bookings/` (replicate patterns)
- Frontend: `/apps/admin/src/pages/GalleryPage.tsx` (infinite scroll)
- Types: `/packages/types/src/booking.ts` (type structure)

---

**Last Updated**: 2026-02-14
**Status**: Ready for Implementation
