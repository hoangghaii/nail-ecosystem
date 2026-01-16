# Phase 2: Update BusinessInfoForm Component

**Plan**: 260116-2015-admin-business-info-integration
**Phase**: 2 of 5
**Effort**: 1 hour

---

## Objective

Replace Zustand store with React Query hooks in BusinessInfoForm component.

---

## Tasks

### 1. Update Imports
**File**: `apps/admin/src/components/contacts/BusinessInfoForm.tsx`

**Remove**:
```typescript
import { useBusinessInfoStore } from "@/store/businessInfoStore";
```

**Add**:
```typescript
import { useBusinessInfo, useUpdateBusinessInfo } from "@/hooks/api/useBusinessInfo";
```

---

### 2. Replace Store with React Query
**Location**: Inside `BusinessInfoForm` component

**Remove**:
```typescript
const { businessInfo, initializeBusinessInfo } = useBusinessInfoStore();

useEffect(() => {
  initializeBusinessInfo();
}, []);
```

**Add**:
```typescript
const [isEditing, setIsEditing] = useState(false);

// Use React Query hooks
const { data: businessInfo, isLoading, error } = useBusinessInfo();
const updateMutation = useUpdateBusinessInfo();
```

---

### 3. Update Form Submission
**Location**: `onSubmit` handler

**Replace**:
```typescript
const onSubmit = async (data: BusinessInfoFormData) => {
  try {
    await businessInfoService.update(data);
    toast.success("Business information updated successfully");
    setIsEditing(false);
  } catch (error) {
    toast.error("Failed to update business information");
    console.error("Error updating business info:", error);
  }
};
```

**With**:
```typescript
const onSubmit = async (data: BusinessInfoFormData) => {
  try {
    await updateMutation.mutateAsync(data);
    setIsEditing(false);
    // Toast handled by mutation's onSuccess
  } catch (error) {
    // Error toast already shown by mutation
    console.error("Error updating business info:", error);
  }
};
```

---

### 4. Add Loading State
**Location**: After hooks, before form return

**Add**:
```typescript
if (isLoading) {
  return (
    <div className="text-muted-foreground p-4 text-center">
      Loading business information...
    </div>
  );
}
```

---

### 5. Add Error State
**Location**: After loading state

**Add**:
```typescript
if (error) {
  return (
    <div className="text-destructive p-4 text-center">
      Failed to load business information. Please try again.
    </div>
  );
}
```

---

### 6. Keep Existing Form JSX
**Note**: Form JSX remains unchanged. Only state management changes.

**Existing validation, inputs, buttons all stay the same**:
- Contact information inputs (phone, email, address)
- Business hours with day labels and time pickers
- Closed toggle switches
- Edit/Save/Cancel buttons

---

## Complete Component Structure

```typescript
export function BusinessInfoForm() {
  const [isEditing, setIsEditing] = useState(false);

  // React Query hooks (replaces Zustand)
  const { data: businessInfo, isLoading, error } = useBusinessInfo();
  const updateMutation = useUpdateBusinessInfo();

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<BusinessInfoFormData>({
    defaultValues: businessInfo
      ? {
          address: businessInfo.address,
          businessHours: businessInfo.businessHours,
          email: businessInfo.email,
          phone: businessInfo.phone,
        }
      : undefined,
    resolver: zodResolver(businessInfoSchema),
  });

  // Reset form when data loads/changes
  useEffect(() => {
    if (businessInfo) {
      reset({
        address: businessInfo.address,
        businessHours: businessInfo.businessHours,
        email: businessInfo.email,
        phone: businessInfo.phone,
      });
    }
  }, [businessInfo, reset]);

  const onSubmit = async (data: BusinessInfoFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating business info:", error);
    }
  };

  const handleCancel = () => {
    if (businessInfo) {
      reset({
        address: businessInfo.address,
        businessHours: businessInfo.businessHours,
        email: businessInfo.email,
        phone: businessInfo.phone,
      });
    }
    setIsEditing(false);
  };

  // Loading/error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!businessInfo) return <div>No data found</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Existing form JSX */}
    </form>
  );
}
```

---

## Validation

- [ ] Component renders without errors
- [ ] Loading state shows while fetching
- [ ] Error state shows if API fails
- [ ] Form displays current business info
- [ ] Edit button enables all fields
- [ ] Save button calls API and shows success toast
- [ ] Cancel button resets form to original values
- [ ] Validation errors show for invalid inputs
- [ ] No TypeScript errors

---

## Notes

- React Query handles caching automatically
- Mutation's `onSuccess` callback shows toast
- Form validation remains unchanged (Zod schema)
- Component simpler without Zustand initialization logic
