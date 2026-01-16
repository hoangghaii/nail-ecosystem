# Phase 6: Mock Data Removal

**Plan**: 260116-2009-integrate-business-info-api
**Phase**: 6 of 7
**Effort**: 15 minutes

---

## Objective

Remove mock business info data and local types, replacing them with shared types from `@repo/types`.

---

## Tasks

### 1. Delete Mock Data File
**File**: `apps/client/src/data/businessInfo.ts`

**Action**: Delete entire file

```bash
rm apps/client/src/data/businessInfo.ts
```

### 2. Update Local Types
**File**: `apps/client/src/types/index.ts`

**Remove**:
```typescript
export type BusinessHours = {
  close: string;
  closed?: boolean;
  day: string;
  open: string;
};

export type ContactInfo = {
  address: {
    city: string;
    state: string;
    street: string;
    zip: string;
  };
  email: string;
  phone: string;
};
```

**Keep** (existing shared type exports):
```typescript
export * from "@repo/types/booking";
export * from "@repo/types/gallery";
export * from "@repo/types/gallery-category";
export * from "@repo/types/pagination";
export * from "@repo/types/service";
```

### 3. Check Footer Component
**File**: `apps/client/src/components/layout/Footer.tsx`

**Action**: Check if Footer imports business info

```typescript
// Search for imports from businessInfo.ts
```

**If found**: Update Footer to use `useBusinessInfo` hook or pass data as props from parent.

**If not found**: No changes needed.

### 4. Verify No Other Usages
**Action**: Search for any remaining imports

```bash
# Search for businessInfo imports
grep -r "from.*businessInfo" apps/client/src/

# Search for ContactInfo type usage
grep -r "ContactInfo" apps/client/src/

# Search for BusinessHours type usage
grep -r "BusinessHours" apps/client/src/
```

If found, update to use:
- `@repo/types/business-info` for API types
- Local display types in `utils/businessInfo.ts` for transformed data

---

## Validation

- [ ] Mock data file deleted
- [ ] Local types removed from `types/index.ts`
- [ ] No import errors in ContactPage
- [ ] No import errors in Footer (if applicable)
- [ ] Type-check passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`
- [ ] No references to old mock data remain

---

## Notes

- Grep searches ensure no orphaned imports
- Footer might need update if it displays business info
- All business info data now from API
- Type safety maintained via `@repo/types`
