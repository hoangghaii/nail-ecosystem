# Phase 5: Testing & Documentation

**Date**: 2026-02-14
**Duration**: 0.5 day
**Priority**: Medium
**Status**: Pending

---

## Context

**Parent Plan**: `./plan.md`
**Dependencies**: Phase 1-4 (all features implemented)
**Blocked By**: Phase 1, Phase 2, Phase 3, Phase 4
**Blocks**: None (final phase)

---

## Overview

Manual testing, edge case validation, API documentation updates, user guide additions. Ensures production-readiness and knowledge transfer.

---

## Requirements

### Functional Requirements
- FR1: All API endpoints tested (Postman/manual)
- FR2: All UI flows tested (create/edit/delete expense, view chart)
- FR3: Edge cases validated (empty data, invalid inputs, date boundaries)
- FR4: API documentation updated
- FR5: User guide created for expense management

### Non-Functional Requirements
- NFR1: Performance validated (<500ms API, <2s chart load)
- NFR2: Mobile responsiveness verified (320px+)
- NFR3: Accessibility tested (keyboard nav, screen readers)
- NFR4: Browser compatibility (Chrome, Firefox, Safari, Edge)

---

## Test Scenarios

### Backend API Testing (Phase 1)

**Expense CRUD**:
```bash
# Create expense
POST /api/expenses
{
  "amount": "125.50",
  "category": "supplies",
  "date": "2026-02-14",
  "description": "Nail polish set"
}
Expected: 201 Created

# List expenses (pagination)
GET /api/expenses?page=1&limit=20
Expected: 200 OK, { data: [], pagination: {...} }

# Filter by category
GET /api/expenses?category=supplies
Expected: 200 OK, filtered results

# Filter by date range
GET /api/expenses?startDate=2026-02-01&endDate=2026-02-28
Expected: 200 OK, date-filtered results

# Update expense
PATCH /api/expenses/:id
{ "amount": "150.00" }
Expected: 200 OK

# Delete expense
DELETE /api/expenses/:id
Expected: 200 OK or 204 No Content
```

**Analytics**:
```bash
# Get profit report
GET /api/analytics/profit?startDate=2026-02-01&endDate=2026-02-28&groupBy=day
Expected: 200 OK, {
  revenue: 12500,
  expenses: 4200,
  profit: 8300,
  bookingsCount: 45,
  expensesCount: 12,
  chartData: [...]
}

# Test weekly grouping
GET /api/analytics/profit?startDate=2026-01-01&endDate=2026-02-28&groupBy=week
Expected: Weekly aggregated data

# Test empty date range
GET /api/analytics/profit?startDate=2026-01-01&endDate=2026-01-01
Expected: Zero revenue/expenses (or single day data)
```

**Validation Tests**:
```bash
# Invalid amount format
POST /api/expenses { "amount": "abc" }
Expected: 400 Bad Request

# Invalid category
POST /api/expenses { "category": "invalid" }
Expected: 400 Bad Request

# Missing required fields
POST /api/expenses { "amount": "100" }
Expected: 400 Bad Request (date required)

# Invalid ObjectId
GET /api/expenses/invalid-id
Expected: 400 Bad Request

# Invalid date range (end < start)
GET /api/analytics/profit?startDate=2026-02-28&endDate=2026-02-01
Expected: 400 Bad Request (or empty result)
```

### Frontend Testing (Phase 3 & 4)

**Expense Management**:
- [ ] Navigate to /expenses page
- [ ] Verify expense list loads with infinite scroll
- [ ] Test category filter (select "Supplies")
- [ ] Test date range filter (select custom range)
- [ ] Test search input (debounced 300ms)
- [ ] Click "Add Expense" button
- [ ] Fill form with valid data
- [ ] Submit form → verify success toast
- [ ] Verify new expense appears in list
- [ ] Click edit on expense card
- [ ] Modify amount → submit → verify update
- [ ] Click delete → confirm dialog → verify deletion
- [ ] Test form validation (invalid amount, missing fields)
- [ ] Test mobile responsiveness (resize to 320px)
- [ ] Test keyboard navigation (tab through form)

**Profit Chart**:
- [ ] Navigate to Dashboard
- [ ] Verify profit chart loads
- [ ] Verify summary cards show correct totals
- [ ] Test date range selector (Last 7/30/90 days)
- [ ] Test custom date range
- [ ] Hover over chart line → verify tooltip appears
- [ ] Verify tooltip currency formatting
- [ ] Verify chart responsive on mobile (rotated labels)
- [ ] Test with empty data (no expenses/bookings)
- [ ] Test with large dataset (>100 data points)
- [ ] Verify chart loads in <2 seconds
- [ ] Test accessibility (screen reader announces data)

### Edge Cases

**Empty States**:
- [ ] No expenses in date range → show empty state
- [ ] No bookings in date range → revenue = 0
- [ ] First-time user (no data) → helpful message

**Boundary Cases**:
- [ ] Single day date range
- [ ] Year-long date range (365 days)
- [ ] Negative profit (expenses > revenue)
- [ ] Zero profit (expenses = revenue)
- [ ] Very large amounts ($999,999.99)
- [ ] Very small amounts ($0.01)
- [ ] Future dates (date > today)
- [ ] Past dates (1 year ago)

**Error Handling**:
- [ ] API offline → show error message
- [ ] Network timeout → retry mechanism
- [ ] Invalid token → redirect to login
- [ ] 500 server error → user-friendly message
- [ ] Invalid date range → validation error

### Performance Testing

**Backend**:
- [ ] Create 1000+ expense records (seed script)
- [ ] Measure GET /expenses response time (<500ms)
- [ ] Measure GET /analytics/profit response time (<500ms)
- [ ] Verify indexes used (MongoDB explain)
- [ ] Test concurrent requests (10+ users)

**Frontend**:
- [ ] Measure chart render time (<2s with 100 points)
- [ ] Test infinite scroll with 500+ items
- [ ] Measure debounce delay (300ms)
- [ ] Test memory leaks (React DevTools Profiler)
- [ ] Test bundle size impact (+50KB with Recharts)

### Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing

**Keyboard Navigation**:
- [ ] Tab through expense form (logical order)
- [ ] Submit form with Enter key
- [ ] Close modal with Escape key
- [ ] Navigate chart with arrow keys (if supported)

**Screen Readers**:
- [ ] Test with VoiceOver (macOS)
- [ ] Test with NVDA (Windows)
- [ ] Verify ARIA labels announced
- [ ] Verify form errors announced
- [ ] Verify chart data accessible (table fallback recommended)

**Visual**:
- [ ] Color contrast meets WCAG 2.2 AA
- [ ] Focus indicators visible
- [ ] Text resizable to 200%
- [ ] No color-only information (use labels)

---

## Documentation Updates

### API Documentation

**File**: `/Users/hainguyen/Documents/nail-project/docs/api-endpoints.md`

Add:
```markdown
## Expenses

### Create Expense
POST /expenses
Authorization: Bearer {token}
Body: { amount: string, category: enum, date: ISO8601, description?: string }
Response: 201 Created, Expense object

### List Expenses
GET /expenses?page=1&limit=20&category=supplies&startDate=2026-02-01&endDate=2026-02-28
Authorization: Bearer {token}
Response: 200 OK, { data: Expense[], pagination: {...} }

### Update Expense
PATCH /expenses/:id
Authorization: Bearer {token}
Body: Partial<Expense>
Response: 200 OK, Expense object

### Delete Expense
DELETE /expenses/:id
Authorization: Bearer {token}
Response: 200 OK or 204 No Content

## Analytics

### Get Profit Report
GET /analytics/profit?startDate=2026-02-01&endDate=2026-02-28&groupBy=day
Authorization: Bearer {token}
Response: 200 OK, ProfitAnalytics object
```

### User Guide

**File**: `/Users/hainguyen/Documents/nail-project/docs/user-guide-expense-management.md` (new)

Sections:
1. **Overview**: What is expense tracking?
2. **Adding Expenses**: Step-by-step with screenshots
3. **Viewing Profit Chart**: How to interpret data
4. **Filtering & Search**: Using category/date filters
5. **Best Practices**: Monthly entry cadence, categorization tips
6. **Troubleshooting**: Common issues and solutions

### Code Comments

Add JSDoc to critical functions:
- `AnalyticsService.getProfitReport()` (explain aggregation logic)
- `generateChartData()` (explain groupBy logic)
- `ExpenseService.create()` (explain Decimal128 conversion)

---

## Todo Checklist

### Backend Testing
- [ ] Test all expense CRUD endpoints (Postman)
- [ ] Test analytics endpoint with various date ranges
- [ ] Validate Decimal128 precision (no rounding errors)
- [ ] Test pagination (page/limit)
- [ ] Test filtering (category, date range)
- [ ] Test validation (invalid inputs)
- [ ] Verify indexes with MongoDB explain
- [ ] Performance test (<500ms response)

### Frontend Testing
- [ ] Test expense management page (all flows)
- [ ] Test profit chart (dashboard integration)
- [ ] Test form validation (Zod)
- [ ] Test infinite scroll
- [ ] Test debounced search
- [ ] Test mobile responsiveness (320px+)
- [ ] Test browser compatibility
- [ ] Test accessibility (keyboard + screen reader)

### Edge Cases
- [ ] Empty states (no data)
- [ ] Boundary cases (date ranges)
- [ ] Error handling (network, auth)
- [ ] Performance (large datasets)

### Documentation
- [ ] Update API documentation
- [ ] Create user guide
- [ ] Add JSDoc comments
- [ ] Update README if needed
- [ ] Document known limitations

---

## Success Criteria

- [ ] All API endpoints functional
- [ ] All UI flows working
- [ ] Edge cases handled gracefully
- [ ] Performance targets met (<500ms API, <2s chart)
- [ ] Mobile responsive (320px+)
- [ ] Accessible (WCAG 2.2 AA)
- [ ] Browser compatible (major browsers)
- [ ] Documentation complete
- [ ] Zero console errors/warnings
- [ ] Ready for production deployment

---

## Known Limitations (Document)

1. **Revenue Assumption**: Completed bookings assumed paid (no payment tracking)
2. **Price Changes**: Service price at booking time not stored (uses current price)
3. **Monthly Cadence**: Requires manual expense entry (no automation)
4. **Chart Performance**: >5000 points may require weekly/monthly aggregation
5. **Mobile Chart**: Legend may wrap on very small screens (<320px)

---

## Rollout Plan

**Staging Deployment**:
1. Deploy to staging environment
2. Smoke test all features
3. User acceptance testing (stakeholders)
4. Collect feedback

**Production Deployment**:
1. Run database migration (if needed)
2. Deploy API changes
3. Deploy frontend changes
4. Monitor logs for errors
5. Verify chart loads correctly
6. Train staff on expense entry

**Post-Launch**:
1. Monitor API performance
2. Collect user feedback
3. Fix critical bugs within 24h
4. Plan enhancements based on usage

---

## Unresolved Questions

1. Should we add expense approval workflow? (Future)
2. Should we support receipt uploads? (Future)
3. Should we add budget forecasting? (Future)
4. Should we export chart as PDF? (Future)
5. Should we add expense categories beyond 4? (As needed)

---

**Last Updated**: 2026-02-14
**Status**: Ready for Implementation
