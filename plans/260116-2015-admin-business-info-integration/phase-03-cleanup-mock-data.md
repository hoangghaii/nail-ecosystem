# Phase 3: Delete Mock Data & Store

**Plan**: 260116-2015-admin-business-info-integration
**Phase**: 3 of 5
**Effort**: 10 minutes

---

## Objective

Remove all mock data files and Zustand store since React Query now manages state.

---

## Tasks

### 1. Delete Mock Data File
**File**: `apps/admin/src/data/mockBusinessInfo.ts`

```bash
rm apps/admin/src/data/mockBusinessInfo.ts
```

---

### 2. Delete Zustand Store
**File**: `apps/admin/src/store/businessInfoStore.ts`

```bash
rm apps/admin/src/store/businessInfoStore.ts
```

---

### 3. Delete Local Types
**File**: `apps/admin/src/types/businessInfo.types.ts`

```bash
rm apps/admin/src/types/businessInfo.types.ts
```

---

### 4. Verify No Remaining Imports

**Search for mock data imports**:
```bash
grep -r "mockBusinessInfo" apps/admin/src/
```

**Expected**: No results

---

**Search for store imports**:
```bash
grep -r "businessInfoStore" apps/admin/src/
```

**Expected**: No results

---

**Search for local type imports**:
```bash
grep -r "@/types/businessInfo" apps/admin/src/
```

**Expected**: No results

---

### 5. Check for Empty Directories

**If `data/` directory is now empty**:
```bash
ls apps/admin/src/data/
# If empty, optionally delete the directory
rm -rf apps/admin/src/data/
```

---

## Validation

- [ ] Mock data file deleted
- [ ] Store file deleted
- [ ] Local types file deleted
- [ ] No import errors in remaining files
- [ ] Type-check passes: `npx turbo type-check --filter=admin`
- [ ] No grep results for deleted imports

---

## Notes

- All business info state now managed by React Query
- Shared types from `@repo/types/business-info` used instead
- Cleaner architecture with single source of truth (API)
