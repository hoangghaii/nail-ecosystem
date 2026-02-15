# Profit Chart Implementation Plan

**Created**: 2026-02-14
**Status**: In Progress (Phase 1-4 Complete, Phase 5 in progress)
**Estimated Duration**: 3-4 days
**Priority**: Medium
**Overall Progress**: 96% (4.8 of 5 phases complete)

---

## Overview

Simple revenue & expense tracking with profit visualization using Recharts. Follows YAGNI/KISS principles with monthly expense entry and automatic revenue calculation from completed bookings.

**Approach**: Start simple, iterate based on real usage. No over-engineering (no inventory, no complex payment tracking).

---

## Context Documents

- **Brainstorm**: `/Users/hainguyen/Documents/nail-project/plans/260214-profit-chart-brainstorm.md`
- **Research**: `./research/researcher-01-recharts-financial-charts.md`, `./research/researcher-02-expense-analytics-api.md`
- **Scout Reports**: `./scout/scout-01-api-patterns.md`, `./scout/scout-02-admin-ui-patterns.md`, `./scout/scout-03-types-hooks-patterns.md`
- **Standards**: `/Users/hainguyen/Documents/nail-project/docs/code-standards.md`

---

## Phases

| Phase | Description | Duration | Status | Progress |
|-------|-------------|----------|--------|----------|
| **1** | Backend - Expense & Analytics Modules | 1.5 days | Completed | 100% |
| **2** | Shared Types (@repo/types) | 0.5 day | Completed | 100% |
| **3** | Frontend - Expense Management Page | 1 day | Completed | 100% |
| **4** | Frontend - Profit Chart Component | 1 day | Completed | 100% |
| **5** | Testing & Documentation | 0.5 day | In Progress | 80% |

**Total**: 4.5 days (includes 0.5 day buffer)

---

## Phase Details

### Phase 1: Backend - Expense & Analytics Modules
**File**: `./phase-01-backend-expense-analytics.md`
**Owner**: Backend Developer
**Dependencies**: None

Creates NestJS modules for expense CRUD and profit analytics with MongoDB Decimal128 precision, pagination, filtering, and proper indexing.

### Phase 2: Shared Types
**File**: `./phase-02-shared-types.md`
**Owner**: Any Developer
**Dependencies**: Phase 1 (schema definitions)

Adds Expense, ExpenseCategory, ProfitAnalytics, and ChartDataPoint types to `@repo/types`. Ensures type safety across API and admin app.

### Phase 3: Frontend - Expense Management Page
**File**: `./phase-03-frontend-expense-management.md`
**Owner**: Frontend Developer
**Dependencies**: Phase 1, Phase 2

Builds expense management UI with infinite scroll, debounced search, category/date filters, and form modal using React Hook Form + Zod.

### Phase 4: Frontend - Profit Chart Component
**File**: `./phase-04-frontend-profit-chart.md`
**Owner**: Frontend Developer
**Dependencies**: Phase 1, Phase 2

Recharts-based profit visualization with revenue/expense/profit lines, date range selector, responsive design, and summary cards.

### Phase 5: Testing & Documentation
**File**: `./phase-05-testing-documentation.md`
**Owner**: QA + Tech Writer
**Dependencies**: Phase 1-4

Manual testing, API documentation updates, user guide additions, edge case validation.

---

## Key Decisions

1. **Decimal128 for Currency**: Prevents floating-point precision errors
2. **Monthly Expense Entry**: Realistic for nail salon operations
3. **Completed Bookings = Revenue**: Simplifies initial implementation
4. **Recharts**: React-native, TypeScript-friendly, proven stability
5. **Admin-Only Access**: Uses existing JWT auth guards

---

## Success Criteria

- [ ] Admins can add/edit/delete expenses in <30 seconds
- [ ] Profit chart loads in <2 seconds with 30-day data
- [ ] Chart responsive on mobile (320px+)
- [ ] Currency accurate to 2 decimal places
- [ ] Zero TypeScript errors (`npm run type-check`)
- [ ] All API endpoints return <500ms
- [ ] Follows existing codebase patterns (scout reports)

---

## Risk Mitigation

**Risk**: Revenue inaccurate if bookings not marked "completed"
**Mitigation**: Document assumption; train staff workflow

**Risk**: Recharts bundle size (~50KB gzipped)
**Mitigation**: Code-split with React.lazy; acceptable trade-off

**Risk**: Forgotten monthly expense entry
**Mitigation**: Accept limitation; can add reminders later

---

## Technology Stack

**Backend**: NestJS 11, MongoDB (Decimal128), Mongoose, JWT auth
**Frontend**: React 19.2, Recharts 2.15, TanStack Query, React Hook Form + Zod
**Shared**: @repo/types, @repo/utils (useDebounce)

**New Dependencies**: `recharts@^2.15.0` (admin app only)

---

## Timeline

**Start Date**: TBD
**End Date**: TBD (Start + 4 days)
**Buffer**: 0.5 day for unexpected issues

---

## Next Steps

1. Review phase files for detailed implementation steps
2. Begin Phase 1 (Backend development)
3. Create expense category seed data (optional)
4. Design chart color palette (follow admin blue theme)

---

**Last Updated**: 2026-02-14
**Document Version**: 1.2
**Plan Status**: 96% Complete - Phase 1-4 Completed, Phase 5 Testing In Progress

## Progress Notes

**2026-02-14 - Phase 1 & 2 Complete**:
- Phase 1: Expense & Analytics modules completed. ExpensesService + AnalyticsService with MongoDB aggregation, Decimal128 currency precision, pagination, filtering (date range, category). Type-check passed.
- Phase 2: Shared types completed. Created expense.ts, analytics.ts with Expense, ExpenseCategory, ProfitAnalytics, ChartDataPoint types. All apps type-check passed.

**2026-02-14 - Phase 3 Complete**:
- Created ExpensesPage with infinite scroll (20 items/page)
- Implemented ExpenseCard, ExpenseFormModal, ExpenseFilters components
- Created expense.service.ts with CRUD operations
- Created useExpenses.ts TanStack Query hooks
- Added /expenses route and sidebar navigation
- Type-check: ✅ PASS (zero errors)
- Build: ✅ PASS (all apps compile)

**2026-02-14 - Phase 4 Complete**:
- Installed recharts + date-fns dependencies
- Created ProfitChart component with responsive design
- Implemented DateRangeSelector (7/30/90 days + custom range)
- Created ProfitSummaryCards with totals display
- Created analytics.service.ts with API integration
- Created useAnalytics.ts TanStack Query hook
- Integrated chart into DashboardPage
- Type-check: ✅ PASS (zero errors)
- Build: ✅ PASS (all apps compile)
- Code quality: ✅ EXCELLENT

**2026-02-14 - Phase 5 In Progress (80% complete)**:
- Testing: Type-check ✅ PASS, Build ✅ PASS, Code quality ✅ EXCELLENT
- API runtime tests: ⏸️ Blocked (server not running)
- Remaining: Documentation updates, edge case validation
