# Phase 4: Update ContactsPage (If Needed)

**Plan**: 260116-2015-admin-business-info-integration
**Phase**: 4 of 5
**Effort**: 15 minutes

---

## Objective

Verify ContactsPage doesn't use deleted Zustand store and update if needed.

---

## Tasks

### 1. Check ContactsPage Imports
**File**: `apps/admin/src/pages/ContactsPage.tsx`

**Search for**:
```typescript
import { useBusinessInfoStore } from "@/store/businessInfoStore";
```

**Action**: If found, remove import and usage.

---

### 2. Remove Store Initialization (If Exists)

**Look for**:
```typescript
const { initializeBusinessInfo } = useBusinessInfoStore();

useEffect(() => {
  initializeBusinessInfo();
}, []);
```

**Action**: Delete this code. React Query auto-fetches when `useBusinessInfo` hook is used.

---

### 3. Verify BusinessInfoForm Usage

**Check that ContactsPage uses BusinessInfoForm**:
```typescript
import { BusinessInfoForm } from "@/components/contacts/BusinessInfoForm";

// In JSX
<BusinessInfoForm />
```

**Action**: No changes needed - form handles its own data fetching.

---

## Validation

- [ ] No imports of `businessInfoStore`
- [ ] No calls to `initializeBusinessInfo`
- [ ] BusinessInfoForm renders correctly
- [ ] Page loads without errors
- [ ] Type-check passes

---

## Notes

- React Query hooks in BusinessInfoForm handle all data fetching
- No manual initialization needed
- ContactsPage is likely just a container for BusinessInfoForm
