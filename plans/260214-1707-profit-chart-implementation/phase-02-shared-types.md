# Phase 2: Shared Types (@repo/types)

**Date**: 2026-02-14
**Duration**: 0.5 day
**Priority**: High
**Status**: Pending

---

## Context

**Parent Plan**: `./plan.md`
**Dependencies**: Phase 1 (schema definitions)
**Blocked By**: Phase 1
**Blocks**: Phase 3, Phase 4

**Related Research**:
- `./scout/scout-03-types-hooks-patterns.md` (type patterns)

---

## Overview

Add expense and analytics types to `@repo/types` package. Ensures type safety across API (NestJS) and admin (React) apps. Follows existing type patterns from scout-03.

---

## Key Insights

1. **Pattern**: Entity type + enum constant (scout-03)
2. **MongoDB IDs**: Use `_id` (NOT `id`)
3. **Date Types**: Use `Date` (TypeScript handles serialization)
4. **Enums**: `as const` pattern for type safety

---

## Requirements

### Functional Requirements
- FR1: Expense type matching API schema
- FR2: ExpenseCategory enum (supplies, materials, utilities, other)
- FR3: ProfitAnalytics type for analytics endpoint response
- FR4: ChartDataPoint type for chart data
- FR5: Query/response types for API params

### Non-Functional Requirements
- NFR1: Zero breaking changes to existing types
- NFR2: TypeScript strict mode compliance
- NFR3: Export via package.json exports field

---

## Type Definitions

### Expense Types

**File**: `/packages/types/src/expense.ts`

```typescript
export type Expense = {
  _id: string;
  amount: number; // Frontend receives as number (API converts from Decimal128)
  category: ExpenseCategory;
  date: Date;
  description?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};

// Enum pattern from scout-03
export const ExpenseCategory = {
  SUPPLIES: 'supplies',
  MATERIALS: 'materials',
  UTILITIES: 'utilities',
  OTHER: 'other',
} as const;
export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

// Query params type
export type ExpenseQueryParams = {
  startDate?: string; // ISO 8601
  endDate?: string;
  category?: ExpenseCategory;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

// API response type
export type ExpenseResponse = {
  data: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
```

### Analytics Types

**File**: `/packages/types/src/analytics.ts`

```typescript
export type ProfitAnalytics = {
  revenue: number;
  expenses: number;
  profit: number;
  bookingsCount: number;
  expensesCount: number;
  chartData: ChartDataPoint[];
};

export type ChartDataPoint = {
  date: string; // "2026-02-01" (ISO date string)
  revenue: number;
  expenses: number;
  profit: number;
};

export type ProfitQueryParams = {
  startDate: string; // ISO 8601
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
};
```

---

## Files to Create/Modify

### Create
- `/packages/types/src/expense.ts` (Expense, ExpenseCategory, query types)
- `/packages/types/src/analytics.ts` (ProfitAnalytics, ChartDataPoint)

### Modify
- `/packages/types/src/index.ts` (add exports)
- `/packages/types/package.json` (add exports field entries)

### Reference Patterns
- `/packages/types/src/booking.ts` (entity type structure)
- `/packages/types/src/service.ts` (enum pattern)

---

## Implementation Steps

### Step 1: Create Expense Types (1 hour)

**1.1 Create expense.ts**
```bash
touch /Users/hainguyen/Documents/nail-project/packages/types/src/expense.ts
```

**1.2 Define Types** (follow scout-03 patterns)
- `Expense` type with `_id` (MongoDB convention)
- `ExpenseCategory` enum with `as const`
- `ExpenseQueryParams` for API queries
- `ExpenseResponse` with pagination structure

**1.3 Update package.json exports**
```json
// packages/types/package.json
{
  "exports": {
    "./service": "./src/service.ts",
    "./booking": "./src/booking.ts",
    "./gallery": "./src/gallery.ts",
    "./expense": "./src/expense.ts"  // Add this
  }
}
```

### Step 2: Create Analytics Types (1 hour)

**2.1 Create analytics.ts**
```bash
touch /Users/hainguyen/Documents/nail-project/packages/types/src/analytics.ts
```

**2.2 Define Types**
- `ProfitAnalytics` matching API response
- `ChartDataPoint` for Recharts data format
- `ProfitQueryParams` for query params

**2.3 Update package.json exports**
```json
"./analytics": "./src/analytics.ts"
```

### Step 3: Update Index Exports (30 min)

**3.1 Update index.ts**
```typescript
// packages/types/src/index.ts
export * from './service';
export * from './booking';
export * from './gallery';
export * from './banner';
export * from './auth';
export * from './contact';
export * from './business-info';
export * from './expense';    // Add
export * from './analytics';  // Add
```

### Step 4: Verification (30 min)

**4.1 Type-check all apps**
```bash
cd /Users/hainguyen/Documents/nail-project
npm run type-check
```

**4.2 Test imports in admin app**
```typescript
// Test file (delete after verification)
// apps/admin/src/test-types.ts
import type { Expense, ExpenseCategory } from '@repo/types/expense';
import type { ProfitAnalytics, ChartDataPoint } from '@repo/types/analytics';

const expense: Expense = {
  _id: '123',
  amount: 100.50,
  category: ExpenseCategory.SUPPLIES,
  date: new Date(),
  currency: 'USD',
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

**4.3 Verify no breaking changes**
- All existing apps still build (`npm run build`)
- No type errors in client/admin/api

---

## Todo Checklist

- [ ] Create `/packages/types/src/expense.ts`
- [ ] Define `Expense` type with MongoDB `_id`
- [ ] Define `ExpenseCategory` enum with `as const`
- [ ] Define `ExpenseQueryParams` type
- [ ] Define `ExpenseResponse` type
- [ ] Create `/packages/types/src/analytics.ts`
- [ ] Define `ProfitAnalytics` type
- [ ] Define `ChartDataPoint` type
- [ ] Define `ProfitQueryParams` type
- [ ] Update `/packages/types/src/index.ts` with exports
- [ ] Update `/packages/types/package.json` exports field
- [ ] Run `npm run type-check` (verify no errors)
- [ ] Run `npm run build` (verify all apps build)
- [ ] Test import in admin app
- [ ] Delete test file

---

## Success Criteria

- [ ] All types exported correctly
- [ ] `npm run type-check` passes (all apps)
- [ ] `npm run build` succeeds
- [ ] Admin app can import types: `import type { Expense } from '@repo/types/expense'`
- [ ] API app can import types (for validation alignment)
- [ ] No breaking changes to existing types

---

## Risk Assessment

**Risk**: Breaking existing type imports
- **Impact**: High (all apps affected)
- **Mitigation**: Run type-check before committing; verify existing exports unchanged

---

## Next Steps

After Phase 2:
1. Begin Phase 3 (frontend expense management)
2. Import types in service classes
3. Import types in TanStack Query hooks

---

**Last Updated**: 2026-02-14
**Status**: Ready for Implementation
