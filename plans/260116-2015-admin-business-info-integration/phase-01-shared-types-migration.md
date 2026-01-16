# Phase 1: Migrate to Shared Types

**Plan**: 260116-2015-admin-business-info-integration
**Phase**: 1 of 5
**Effort**: 30 minutes

---

## Objective

Replace local admin types with shared types from `@repo/types/business-info`.

---

## Tasks

### 1. Update Business Info Service
**File**: `apps/admin/src/services/businessInfo.service.ts`

**Remove**:
```typescript
import type { BusinessInfo } from "@/types/businessInfo.types";
```

**Add**:
```typescript
import type { BusinessInfo } from '@repo/types/business-info';
```

**Note**: Type structure already matches (both use `_id`, phone, email, address, businessHours).

---

### 2. Update React Query Hooks
**File**: `apps/admin/src/hooks/api/useBusinessInfo.ts`

**Remove**:
```typescript
import type { BusinessInfo } from "@/types/businessInfo.types";
```

**Add**:
```typescript
import type { BusinessInfo } from '@repo/types/business-info';
```

**Update mutation signature**:
```typescript
export function useUpdateBusinessInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BusinessInfo>) =>  // Remove Omit wrapper
      businessInfoService.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.businessInfo.detail(), updated);
      toast.success("Business information updated successfully");
    },
  });
}
```

---

### 3. Update Validation Schema
**File**: `apps/admin/src/lib/validations/businessInfo.validation.ts`

**Add import**:
```typescript
import { DayOfWeek } from '@repo/types/business-info';
import { z } from 'zod';
```

**Update schema**:
```typescript
const dayScheduleSchema = z.object({
  day: z.nativeEnum(DayOfWeek),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Opening time must be in HH:MM format (24-hour)',
  }),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Closing time must be in HH:MM format (24-hour)',
  }),
  closed: z.boolean().default(false),
});

export const businessInfoSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  businessHours: z.array(dayScheduleSchema).length(7, 'Must have 7 days'),
});

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
```

---

## Validation

- [ ] No TypeScript errors in service file
- [ ] No TypeScript errors in hooks file
- [ ] No TypeScript errors in validation file
- [ ] Type-check passes: `npx turbo type-check --filter=admin`

---

## Notes

- Shared types already match admin's structure
- API returns `_id` field (MongoDB standard)
- DayOfWeek enum ensures type safety for day names
