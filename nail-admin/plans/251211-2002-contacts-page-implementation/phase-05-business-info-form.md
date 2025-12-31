# Phase 5: Business Info Form Component

**Duration**: 2 hours
**Dependencies**: Phase 4 (State Management)
**Risk**: Medium (inline editing UX, time validation)

---

## Objectives

1. Build inline editing form for business contact information
2. Implement phone, email, address, business hours fields
3. Add Zod validation with error display
4. Save changes with toast notifications

---

## Component Structure

**File**: `src/components/contacts/BusinessInfoForm.tsx`

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { BusinessInfo, BusinessHours } from "@/types/businessInfo.types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { businessInfoService } from "@/services/businessInfo.service";
import { useBusinessInfoStore } from "@/store/businessInfoStore";

// Validation Schema
const businessHoursSchema = z
  .object({
    closed: z.boolean(),
    day: z.string(),
    close: z.string().optional(),
    open: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.closed) {
        return !!data.open && !!data.close;
      }
      return true;
    },
    {
      message: "Open and close times required when not closed",
    }
  )
  .refine(
    (data) => {
      if (!data.closed && data.open && data.close) {
        const openTime = convertTo24Hour(data.open);
        const closeTime = convertTo24Hour(data.close);
        return openTime < closeTime;
      }
      return true;
    },
    {
      message: "Open time must be before close time",
    }
  );

const businessInfoSchema = z.object({
  address: z.object({
    city: z.string().min(1, "City is required"),
    state: z
      .string()
      .min(2, "State is required")
      .max(2, "Use 2-letter state code"),
    street: z.string().min(1, "Street is required"),
    zip: z
      .string()
      .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format (e.g., 94102)"),
  }),
  businessHours: z.array(businessHoursSchema),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format")
    .min(10, "Phone must be at least 10 digits"),
});

type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;

// Helper: Convert 12-hour time to 24-hour for comparison
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = modifier === "AM" ? "00" : "12";
  } else if (modifier === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
}

export function BusinessInfoForm() {
  const businessInfo = useBusinessInfoStore((state) => state.businessInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
  });

  // Initialize form with current business info
  useEffect(() => {
    if (businessInfo) {
      reset({
        email: businessInfo.email,
        phone: businessInfo.phone,
        address: businessInfo.address,
        businessHours: businessInfo.businessHours,
      });
    }
  }, [businessInfo, reset]);

  const businessHours = watch("businessHours");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (businessInfo) {
      reset({
        email: businessInfo.email,
        phone: businessInfo.phone,
        address: businessInfo.address,
        businessHours: businessInfo.businessHours,
      });
    }
    setIsEditing(false);
  };

  const onSubmit = async (data: BusinessInfoFormData) => {
    setIsSaving(true);
    try {
      await businessInfoService.update(data);
      toast.success("Business information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating business info:", error);
      toast.error("Failed to update business information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!businessInfo) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              Loading business information...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Business Contact Information</CardTitle>
            <CardDescription>
              Contact details displayed on the client website
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Details</h3>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-base">{businessInfo.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="hello@pinknail.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-base">{businessInfo.email}</p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>

            {/* Street */}
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              {isEditing ? (
                <>
                  <Input
                    id="street"
                    {...register("address.street")}
                    placeholder="123 Beauty Lane"
                    className={errors.address?.street ? "border-destructive" : ""}
                  />
                  {errors.address?.street && (
                    <p className="text-sm text-destructive">
                      {errors.address.street.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-base">{businessInfo.address.street}</p>
              )}
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <>
                    <Input
                      id="city"
                      {...register("address.city")}
                      placeholder="San Francisco"
                      className={errors.address?.city ? "border-destructive" : ""}
                    />
                    {errors.address?.city && (
                      <p className="text-sm text-destructive">
                        {errors.address.city.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base">{businessInfo.address.city}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                {isEditing ? (
                  <>
                    <Input
                      id="state"
                      {...register("address.state")}
                      placeholder="CA"
                      maxLength={2}
                      className={errors.address?.state ? "border-destructive" : ""}
                    />
                    {errors.address?.state && (
                      <p className="text-sm text-destructive">
                        {errors.address.state.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base">{businessInfo.address.state}</p>
                )}
              </div>

              {/* ZIP */}
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                {isEditing ? (
                  <>
                    <Input
                      id="zip"
                      {...register("address.zip")}
                      placeholder="94102"
                      className={errors.address?.zip ? "border-destructive" : ""}
                    />
                    {errors.address?.zip && (
                      <p className="text-sm text-destructive">
                        {errors.address.zip.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base">{businessInfo.address.zip}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Hours Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Hours</h3>

            {businessHours?.map((schedule, index) => (
              <div
                key={schedule.day}
                className="grid grid-cols-1 items-start gap-4 sm:grid-cols-4"
              >
                {/* Day */}
                <div className="font-medium">{schedule.day}</div>

                {isEditing ? (
                  <>
                    {/* Closed Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`closed-${index}`}
                        checked={schedule.closed}
                        onCheckedChange={(checked) => {
                          setValue(`businessHours.${index}.closed`, !!checked);
                          if (checked) {
                            setValue(`businessHours.${index}.open`, "");
                            setValue(`businessHours.${index}.close`, "");
                          }
                        }}
                      />
                      <Label htmlFor={`closed-${index}`} className="text-sm">
                        Closed
                      </Label>
                    </div>

                    {/* Open Time */}
                    <div className="space-y-1">
                      <Input
                        {...register(`businessHours.${index}.open`)}
                        placeholder="09:00 AM"
                        disabled={schedule.closed}
                        className={
                          errors.businessHours?.[index]?.open
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.businessHours?.[index]?.open && (
                        <p className="text-xs text-destructive">
                          {errors.businessHours[index].open.message}
                        </p>
                      )}
                    </div>

                    {/* Close Time */}
                    <div className="space-y-1">
                      <Input
                        {...register(`businessHours.${index}.close`)}
                        placeholder="07:00 PM"
                        disabled={schedule.closed}
                        className={
                          errors.businessHours?.[index]?.close
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.businessHours?.[index]?.close && (
                        <p className="text-xs text-destructive">
                          {errors.businessHours[index].close.message}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="col-span-3 text-muted-foreground">
                    {schedule.closed
                      ? "Closed"
                      : `${schedule.open} - ${schedule.close}`}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## Component Breakdown

### State Management

```typescript
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
```

- `isEditing`: Controls read-only vs edit mode
- `isSaving`: Loading state during save operation

---

### Form Initialization

```typescript
useEffect(() => {
  if (businessInfo) {
    reset({
      email: businessInfo.email,
      phone: businessInfo.phone,
      address: businessInfo.address,
      businessHours: businessInfo.businessHours,
    });
  }
}, [businessInfo, reset]);
```

**Purpose**: Populate form with current business info on load

---

### Inline Editing Pattern

**Read-Only Mode**:

```typescript
<p className="text-base">{businessInfo.phone}</p>
```

**Edit Mode**:

```typescript
<Input
  id="phone"
  {...register("phone")}
  className={errors.phone ? "border-destructive" : ""}
/>
```

**Toggle**:

```typescript
{isEditing ? <Input /> : <p>{value}</p>}
```

---

## Validation Error Display

**Pattern**: Red border + error message below field

```typescript
<Input
  className={errors.phone ? "border-destructive" : ""}
/>
{errors.phone && (
  <p className="text-sm text-destructive">
    {errors.phone.message}
  </p>
)}
```

**Visual**: Red border matches destructive color (oklch(0.577 0.245 27.325))

---

## Business Hours Editing

### Closed Checkbox Logic

```typescript
<Checkbox
  checked={schedule.closed}
  onCheckedChange={(checked) => {
    setValue(`businessHours.${index}.closed`, !!checked);
    if (checked) {
      // Clear times when closed
      setValue(`businessHours.${index}.open`, "");
      setValue(`businessHours.${index}.close`, "");
    }
  }}
/>
```

**Behavior**:

- Check "Closed" → Clear open/close times, disable inputs
- Uncheck "Closed" → Enable inputs for time entry

---

### Time Input Format

**Expected Format**: "09:00 AM", "07:00 PM"

**Validation**:

- If not closed, open and close must be present
- Open time must be before close time (uses `convertTo24Hour` helper)

---

## Toast Notifications

```typescript
// Success
toast.success("Business information updated successfully!");

// Error
toast.error("Failed to update business information. Please try again.");
```

**Timing**: Show immediately after save attempt

---

## Mobile Responsiveness

**Grid Breakpoints**:

```typescript
// City, State, ZIP row
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
```

**Behavior**:

- Mobile: Stacked (1 column)
- Tablet+: 3 columns (sm:grid-cols-3)

**Business Hours**:

```typescript
<div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-4">
```

- Mobile: Stacked
- Tablet+: Day | Closed | Open | Close (4 columns)

---

## Testing Scenarios

### Validation Tests

- [ ] Empty phone → "Phone must be at least 10 digits"
- [ ] Invalid email → "Invalid email address"
- [ ] Invalid ZIP (1234) → "Invalid ZIP code format"
- [ ] State > 2 chars → "Use 2-letter state code"
- [ ] Open time > Close time → "Open time must be before close time"
- [ ] Closed unchecked, no times → "Open and close times required"

---

### Interaction Tests

- [ ] Click Edit → Form switches to edit mode
- [ ] Click Cancel → Changes discarded, read-only mode restored
- [ ] Check Closed → Open/close inputs disabled and cleared
- [ ] Uncheck Closed → Open/close inputs enabled
- [ ] Submit valid form → Success toast, read-only mode

---

### Edge Cases

- [ ] businessInfo null → Show loading spinner
- [ ] Service error → Error toast, stay in edit mode
- [ ] Rapid Edit/Cancel clicks → No state corruption

---

## Files to Create

1. `src/components/contacts/BusinessInfoForm.tsx` - Main form component

---

## Files to Reference

1. `src/services/businessInfo.service.ts` - Service calls
2. `src/store/businessInfoStore.ts` - State subscription

---

## Accessibility Considerations

- All inputs have associated labels (`<Label htmlFor="...">`)
- Checkbox has label (`<Label htmlFor="closed-${index}">`)
- Disabled state on inputs when closed
- Error messages linked to inputs (aria-describedby implicit via react-hook-form)

---

## Performance Optimizations

- Form only re-renders on businessInfo change (selective store subscription)
- Validation runs on submit (not on every keystroke)
- useEffect dependency array prevents unnecessary resets

---

## Next Phase

**Phase 6: Customer Messages Components** - Build DataTable, StatusFilter, ContactDetailsModal
