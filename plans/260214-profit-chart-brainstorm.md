# Profit Chart Feature - Brainstorming Summary

**Date**: 2026-02-14
**Status**: ✅ Agreed Solution
**Approach**: Simple Revenue & Expense Tracking
**Priority**: Medium
**Estimated Time**: 3-4 days

---

## Problem Statement

Admin dashboard needs profit visibility showing:
- **Cash Outflows**: Purchasing raw materials (paint, nail supplies)
- **Cash Inflows**: Revenue from successful bookings

**Current State:**
- ✅ Bookings tracked with status (pending/confirmed/completed/cancelled)
- ✅ Service prices available
- ❌ NO expense tracking
- ❌ NO payment/revenue tracking
- ❌ NO analytics/charts

---

## Requirements

### Business Requirements
- BR1: Track monthly expenses by category (supplies, materials, utilities, other)
- BR2: Calculate revenue from completed bookings
- BR3: Display profit chart (revenue - expenses) over time
- BR4: View 30-day trend + custom date range
- BR5: Simple data entry (realistic monthly updates)

### Technical Requirements
- TR1: RESTful API for expense CRUD operations
- TR2: Analytics endpoint for profit calculations
- TR3: Chart visualization using Recharts
- TR4: Admin-only access (authentication required)
- TR5: Responsive design (mobile + desktop)

### Non-Functional Requirements
- NFR1: Fast implementation (3-4 days max)
- NFR2: Simple to maintain (KISS principle)
- NFR3: Easy to extend later (YAGNI compliance)
- NFR4: No over-engineering (avoid inventory management)

---

## Evaluated Approaches

### Approach 1: Simple Revenue & Expense Tracking ⭐ **SELECTED**

**Description:** Basic expense entry + revenue from completed bookings.

**Pros:**
- ✅ KISS principle - minimal complexity
- ✅ Fast to implement (3-4 days)
- ✅ Solves 80% of need
- ✅ Easy to maintain
- ✅ Low risk
- ✅ Iterative (can enhance later)

**Cons:**
- ⚠️ Manual expense entry (acceptable for monthly updates)
- ⚠️ Assumes completed bookings = paid (valid assumption for now)

**Decision:** **APPROVED** - Best ROI, aligns with YAGNI/KISS principles.

---

### Approach 2: Moderate - Payment Tracking (REJECTED)

**Description:** Add payment status to bookings + categorized expenses.

**Pros:**
- More accurate revenue tracking
- Can handle partial payments

**Cons:**
- ❌ More complex (5-6 days)
- ❌ Requires schema changes
- ❌ More manual work
- ❌ YAGNI violation (not needed yet)

**Decision:** **REJECTED** - Over-engineering for current needs. Can add later if required.

---

### Approach 3: Complex - Full Inventory Management (REJECTED)

**Description:** Track inventory items, auto-calculate costs.

**Pros:**
- Fully automated expense tracking
- Inventory alerts

**Cons:**
- ❌ Massive overkill (2-3 weeks)
- ❌ High maintenance burden
- ❌ Requires staff training
- ❌ Violates YAGNI principle severely

**Decision:** **STRONGLY REJECTED** - Way beyond business needs.

---

## Final Recommended Solution

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Admin Dashboard                      │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ Expenses Page  │  │ Profit Chart   │                │
│  │ (CRUD)         │  │ (Dashboard)    │                │
│  └────────┬───────┘  └───────┬────────┘                │
│           │                   │                          │
│           └───────────┬───────┘                          │
│                       │ TanStack Query                   │
└───────────────────────┼──────────────────────────────────┘
                        │
                        │ REST API
                        │
┌───────────────────────┼──────────────────────────────────┐
│                  NestJS API                              │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ /expenses      │  │ /analytics     │                │
│  │ CRUD endpoints │  │ /profit        │                │
│  └────────┬───────┘  └───────┬────────┘                │
│           │                   │                          │
│           └───────────┬───────┘                          │
└───────────────────────┼──────────────────────────────────┘
                        │
                        │ Mongoose
                        │
┌───────────────────────┼──────────────────────────────────┐
│                    MongoDB                               │
│  ┌────────────────┐  ┌────────────────┐                │
│  │ expenses       │  │ bookings       │                │
│  │ collection     │  │ collection     │                │
│  └────────────────┘  └────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

### Data Model

**Expense Schema:**
```typescript
{
  _id: ObjectId,
  category: 'supplies' | 'materials' | 'utilities' | 'other',
  amount: number,            // in dollars (e.g., 125.50)
  date: Date,                // when expense occurred
  description?: string,      // optional notes
  createdAt: Date,
  updatedAt: Date
}
```

**Revenue Calculation:**
```typescript
// Sum prices of all completed bookings in date range
revenue = bookings
  .filter(b => b.status === 'completed' && b.date in dateRange)
  .map(b => services.find(s => s._id === b.serviceId).price)
  .reduce((sum, price) => sum + price, 0);
```

**Profit Calculation:**
```typescript
profit = revenue - totalExpenses;
```

### API Endpoints

**Expense Management:**
```
GET    /expenses?startDate&endDate&category&page&limit
POST   /expenses
PATCH  /expenses/:id
DELETE /expenses/:id
```

**Analytics:**
```
GET    /analytics/profit?startDate&endDate&groupBy=day|week|month
Response:
{
  revenue: number,
  expenses: number,
  profit: number,
  bookingsCount: number,
  expensesCount: number,
  chartData: [
    { date: "2026-02-01", revenue: 1200, expenses: 350, profit: 850 },
    { date: "2026-02-02", revenue: 950, expenses: 0, profit: 950 },
    ...
  ]
}
```

### Chart Visualization

**Technology:** Recharts (React-friendly, simple, widely used)

**Chart Type:** Line chart with 3 lines (revenue, expenses, profit)

**Features:**
- Date range selector (Last 7/30/90 days, Custom)
- Summary cards (total revenue, expenses, profit)
- Responsive design
- Tooltips on hover
- Legend with color coding

**Visual Design:**
```
┌───────────────────────────────────────────────────────┐
│  📊 Profit Overview                                   │
│  [Last 30 Days ▼]  [Custom Range]                    │
├───────────────────────────────────────────────────────┤
│                                                       │
│  $3,500 │                  ╱╲   Revenue ━━━          │
│         │              ╱╲ ╱  ╲  Expenses ━━━         │
│  $2,000 │          ╱╲ ╱  ╲    ╲ Profit ━━━          │
│         │      ╱╲ ╱  ╲        ╲                      │
│  $   0  │─────────────────────────────               │
│         └─────────────────────────────               │
│         Feb 1    Feb 15    Feb 28                    │
│                                                       │
├───────────────────────────────────────────────────────┤
│  Summary (Last 30 Days)                              │
│                                                       │
│  ┌──────────────┬──────────────┬──────────────┐     │
│  │ Total Revenue│ Total Expenses│ Net Profit   │     │
│  │ $12,500      │ $4,200        │ $8,300       │     │
│  └──────────────┴──────────────┴──────────────┘     │
└───────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Backend - Expense System
**Time:** 1 day
**Owner:** Backend developer

**Tasks:**
- [ ] Create `Expense` Mongoose schema
- [ ] Create `expenses` NestJS module
- [ ] Implement CRUD endpoints (GET/POST/PATCH/DELETE)
- [ ] Add validation (DTO classes)
- [ ] Add authentication guards (admin-only)

**Files to create:**
- `apps/api/src/expenses/schemas/expense.schema.ts`
- `apps/api/src/expenses/dto/create-expense.dto.ts`
- `apps/api/src/expenses/dto/update-expense.dto.ts`
- `apps/api/src/expenses/expenses.controller.ts`
- `apps/api/src/expenses/expenses.service.ts`
- `apps/api/src/expenses/expenses.module.ts`

**Tests:**
- [ ] Unit tests for ExpenseService
- [ ] E2E tests for expense endpoints

---

### Phase 2: Backend - Analytics Endpoint
**Time:** 0.5 day
**Owner:** Backend developer

**Tasks:**
- [ ] Create `analytics` NestJS module
- [ ] Implement `/analytics/profit` endpoint
- [ ] Aggregate bookings revenue by date range
- [ ] Aggregate expenses by date range
- [ ] Group data by day/week/month
- [ ] Calculate profit (revenue - expenses)

**Files to create:**
- `apps/api/src/analytics/analytics.controller.ts`
- `apps/api/src/analytics/analytics.service.ts`
- `apps/api/src/analytics/analytics.module.ts`
- `apps/api/src/analytics/dto/profit-query.dto.ts`

**Tests:**
- [ ] Unit tests for profit calculations
- [ ] E2E tests for analytics endpoint

---

### Phase 3: Shared Types
**Time:** 0.5 day
**Owner:** TypeScript developer

**Tasks:**
- [ ] Add `Expense` type to `@repo/types`
- [ ] Add `ExpenseCategory` enum
- [ ] Add `ProfitAnalytics` type
- [ ] Add `ChartDataPoint` type
- [ ] Export types from index

**Files to create:**
- `packages/types/src/expense.ts`
- Update: `packages/types/src/index.ts`

**Verification:**
- [ ] Type-check passes in all apps
- [ ] No breaking changes to existing types

---

### Phase 4: Frontend - Expense Management Page
**Time:** 1 day
**Owner:** Frontend developer

**Tasks:**
- [ ] Create `/expenses` route
- [ ] Create `ExpensesPage` component
- [ ] Create `ExpenseTable` with sorting/filtering
- [ ] Create `ExpenseFormModal` (Add/Edit)
- [ ] Create `useExpenses` hook (TanStack Query)
- [ ] Add expense category filter
- [ ] Add date range filter
- [ ] Add pagination

**Files to create:**
- `apps/admin/src/pages/ExpensesPage.tsx`
- `apps/admin/src/components/expenses/ExpenseTable.tsx`
- `apps/admin/src/components/expenses/ExpenseFormModal.tsx`
- `apps/admin/src/hooks/api/useExpenses.ts`

**Design:**
- Follow admin design system (blue theme, glassmorphism)
- Use TanStack Table for data grid
- Use React Hook Form + Zod for validation

---

### Phase 5: Frontend - Profit Chart
**Time:** 1 day
**Owner:** Frontend developer

**Tasks:**
- [ ] Install Recharts: `npm install recharts --workspace=admin`
- [ ] Create `ProfitChart` component
- [ ] Create `useAnalytics` hook
- [ ] Add date range selector
- [ ] Add summary cards (revenue, expenses, profit)
- [ ] Add chart to DashboardPage
- [ ] Make responsive (mobile/desktop)

**Files to create:**
- `apps/admin/src/components/analytics/ProfitChart.tsx`
- `apps/admin/src/hooks/api/useAnalytics.ts`

**Chart Configuration:**
- Type: Line chart
- Lines: Revenue (blue), Expenses (red), Profit (green)
- X-axis: Date
- Y-axis: Amount ($)
- Tooltips: Show exact values
- Legend: Top-right corner

---

### Phase 6: Testing & Documentation
**Time:** 0.5 day
**Owner:** QA + Tech Writer

**Tasks:**
- [ ] Manual testing of expense CRUD
- [ ] Manual testing of profit chart
- [ ] Test date range filtering
- [ ] Test with no data (empty states)
- [ ] Test with large datasets
- [ ] Update API documentation
- [ ] Add expense management to user guide

**Test Scenarios:**
- Create/edit/delete expense
- Filter by category and date
- View profit chart for different date ranges
- Mobile responsiveness
- Accessibility (keyboard navigation, screen readers)

---

## Success Metrics

### Functional Metrics
- ✅ Admin can add expenses in < 30 seconds
- ✅ Profit chart loads in < 2 seconds
- ✅ Data accurate to 2 decimal places
- ✅ Chart responsive on mobile (320px+)

### Business Metrics
- ✅ User adopts monthly expense entry habit
- ✅ Dashboard provides actionable insights
- ✅ Reduces time spent on manual profit calculations

### Technical Metrics
- ✅ API response time < 500ms
- ✅ Zero runtime errors in production
- ✅ TypeScript strict mode compliance
- ✅ ESLint/Prettier compliance

---

## Risk Assessment

### Technical Risks

**Risk 1:** Revenue calculation inaccurate if bookings not updated
- **Likelihood:** Medium
- **Impact:** Medium
- **Mitigation:** Train staff to mark bookings "completed" only when paid
- **Acceptance:** Document this assumption clearly

**Risk 2:** Monthly expense entry forgotten
- **Likelihood:** Medium
- **Impact:** Low (just missing data, not broken functionality)
- **Mitigation:** Add reminder notification (future enhancement)
- **Acceptance:** Monthly cadence is realistic

**Risk 3:** Recharts bundle size impact
- **Likelihood:** Low
- **Impact:** Low (~50KB gzipped)
- **Mitigation:** Code-split chart component (React.lazy)
- **Acceptance:** Acceptable trade-off for functionality

### Business Risks

**Risk 1:** Users expect inventory management later
- **Likelihood:** Low
- **Impact:** Medium (scope creep)
- **Mitigation:** Set expectations upfront - this is profit tracking, not inventory
- **Acceptance:** Can add inventory as separate feature later

**Risk 2:** Payment tracking becomes necessary
- **Likelihood:** Medium
- **Impact:** Low (easy to add later)
- **Mitigation:** Design with extension in mind (add `paymentStatus` to Booking later)
- **Acceptance:** Start simple, iterate based on real needs

---

## Constraints & Assumptions

### Constraints
- C1: Must use existing tech stack (NestJS + React + MongoDB)
- C2: Must follow existing design system (admin blue theme)
- C3: Must complete in 3-4 days max
- C4: Must be admin-only (authentication required)

### Assumptions
- A1: All "completed" bookings are paid (no payment tracking yet)
- A2: Expenses entered monthly (not daily/weekly)
- A3: Simple categories sufficient (supplies, materials, utilities, other)
- A4: Staff trained to mark bookings correctly
- A5: Recharts library acceptable (no custom chart needed)

---

## Future Enhancements (Not in Scope)

**Nice-to-haves** (can add later):
- ⏳ Payment status tracking per booking
- ⏳ Expense reminder notifications
- ⏳ Export chart as PDF/image
- ⏳ Expense receipt uploads
- ⏳ Multi-currency support
- ⏳ Budget forecasting
- ⏳ Expense approval workflow
- ⏳ Inventory management integration

**Verdict:** NOT doing these now (YAGNI principle). Reassess in 3-6 months based on real usage patterns.

---

## Technology Stack

### Backend
- **Framework:** NestJS 11
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (existing)
- **Validation:** class-validator + class-transformer

### Frontend
- **Framework:** React 19.2
- **UI Library:** Radix UI (shadcn/ui)
- **Charts:** Recharts (~50KB gzipped)
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS v4

### Shared
- **Types:** @repo/types (TypeScript 5.9)
- **Utils:** @repo/utils

---

## Dependencies

### New Dependencies
```json
{
  "recharts": "^2.15.0"  // Chart library (admin only)
}
```

**Total bundle impact:** ~50KB gzipped (acceptable)

### Existing Dependencies (Reused)
- TanStack Query (data fetching)
- React Hook Form (forms)
- Zod (validation)
- Tailwind CSS (styling)

---

## Key Decisions & Rationale

### Decision 1: Simple Approach (No Payment Tracking)
**Rationale:** YAGNI principle. Payment tracking adds complexity without immediate value. Can add later if needed.

### Decision 2: Monthly Expense Entry
**Rationale:** Realistic expectation. Daily entry would be ideal but unrealistic for busy nail salon staff.

### Decision 3: Recharts Over Tremor
**Rationale:** Recharts is more mature, better documented, larger community. Tremor is newer and less proven.

### Decision 4: Completed Bookings = Paid
**Rationale:** Simplifies initial implementation. Staff can mark "completed" only when payment received.

### Decision 5: 4 Expense Categories
**Rationale:** Balance between granularity and simplicity. Can add more categories later if needed.

---

## Questions & Answers

**Q1:** Why not track inventory automatically?
**A1:** Overkill for nail salon. Adds 2-3 weeks dev time for minimal value. Manual expense entry is good enough.

**Q2:** What if bookings are marked "completed" but not paid?
**A2:** Train staff to only mark "completed" when paid. Can add payment tracking later if this becomes an issue.

**Q3:** Why Recharts instead of Chart.js?
**A3:** Recharts is React-native (declarative), better TypeScript support, simpler API for line charts.

**Q4:** Can we export profit data to Excel?
**A4:** Not in initial scope. Can add CSV export later (YAGNI).

**Q5:** What about forecasting future profit?
**A5:** Out of scope. Start with historical data. Can add forecasting later if needed.

---

## Implementation Timeline

| Phase | Task | Duration | Owner |
|-------|------|----------|-------|
| 1 | Backend - Expense CRUD | 1 day | Backend Dev |
| 2 | Backend - Analytics | 0.5 day | Backend Dev |
| 3 | Shared Types | 0.5 day | Any Dev |
| 4 | Frontend - Expense Page | 1 day | Frontend Dev |
| 5 | Frontend - Profit Chart | 1 day | Frontend Dev |
| 6 | Testing & Docs | 0.5 day | QA + Writer |
| **Total** | | **4.5 days** | |

**Start Date:** TBD
**End Date:** TBD
**Buffer:** 0.5 day for unexpected issues

---

## Approval & Sign-off

**Status:** ✅ **APPROVED**

**Agreed Solution:**
- Approach 1: Simple Revenue & Expense Tracking
- Monthly expense entry cadence
- Recharts for visualization
- 3-4 day implementation timeline

**Next Steps:**
1. Create detailed implementation plan using `/plan:hard`
2. Design chart mockups (optional)
3. Begin Phase 1 (Backend development)

---

**Last Updated:** 2026-02-14
**Author:** Solution Brainstormer (Claude Code)
**Document Version:** 1.0
**Status:** Final - Ready for Implementation Planning
