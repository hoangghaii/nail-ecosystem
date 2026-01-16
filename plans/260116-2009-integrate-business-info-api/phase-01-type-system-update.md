# Phase 1: Type System Update

**Plan**: 260116-2009-integrate-business-info-api
**Phase**: 1 of 7
**Effort**: 30 minutes

---

## Objective

Create shared TypeScript types for business info in `@repo/types` package to ensure type safety across client, admin, and API.

---

## Tasks

### 1. Create Business Info Types File
**File**: `packages/types/src/business-info.ts` (new)

```typescript
export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export type DaySchedule = {
  day: DayOfWeek;
  openTime: string;   // 24-hour format "HH:MM"
  closeTime: string;  // 24-hour format "HH:MM"
  closed: boolean;
};

export type BusinessInfo = {
  _id: string;
  phone: string;
  email: string;
  address: string;
  businessHours: DaySchedule[];
  createdAt: string;
  updatedAt: string;
};

export type BusinessInfoResponse = BusinessInfo;
```

### 2. Update Package Exports
**File**: `packages/types/src/index.ts`

Add export:
```typescript
export * from './business-info';
```

---

## Validation

- [ ] Type-check passes: `npm run type-check`
- [ ] Build succeeds: `npx turbo build --filter=@repo/types`
- [ ] No breaking changes in dependent packages

---

## Notes

- Types match API schema exactly
- Enum values lowercase (matches API convention)
- 24-hour time format (will convert on client)
- Address is single string (matches API structure)
