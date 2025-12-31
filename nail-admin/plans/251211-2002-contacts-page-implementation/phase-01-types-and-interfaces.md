# Phase 1: Types and Interfaces

**Duration**: 30 minutes
**Dependencies**: None
**Risk**: Low

---

## Objectives

1. Define BusinessInfo type for admin-editable business contact data
2. Verify existing Contact type matches requirements
3. Create Zod validation schemas for forms

---

## Type Definitions

### 1.1 BusinessInfo Type

**File**: `src/types/businessInfo.types.ts`

```typescript
export type BusinessInfo = {
  address: {
    city: string;
    state: string;
    street: string;
    zip: string;
  };
  businessHours: BusinessHours[];
  email: string;
  id: string; // Singleton record ID (e.g., "business_info_001")
  phone: string;
  updatedAt: Date;
};

export type BusinessHours = {
  close?: string; // "07:00 PM" format
  closed: boolean; // True if closed that day
  day: string; // "Monday", "Tuesday", etc.
  open?: string; // "09:00 AM" format
};

export type BusinessInfoFormData = {
  address: {
    city: string;
    state: string;
    street: string;
    zip: string;
  };
  businessHours: BusinessHours[];
  email: string;
  phone: string;
};
```

**Notes**:

- Matches client site `businessInfo.ts` structure
- `closed` boolean controls whether open/close times are required
- `updatedAt` tracks last modification (not createdAt since singleton)

---

### 1.2 Contact Type Verification

**File**: `src/types/contact.types.ts` (existing)

```typescript
export type Contact = {
  adminNotes?: string; // ✅ Admin-only internal notes
  createdAt: Date; // ✅ Submission timestamp
  email: string; // ✅ Customer email
  firstName: string; // ✅ Customer first name
  id: string; // ✅ Unique identifier
  lastName: string; // ✅ Customer last name
  message: string; // ✅ Customer message content
  phone?: string; // ✅ Optional phone (may be omitted)
  respondedAt?: Date; // ✅ Timestamp when status changed to RESPONDED
  status: ContactStatus; // ✅ NEW | READ | RESPONDED | ARCHIVED
  subject: string; // ✅ Message subject/topic
};

export const ContactStatus = {
  ARCHIVED: "archived",
  NEW: "new",
  READ: "read",
  RESPONDED: "responded",
} as const;

export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];
```

**Verification**: ✅ Type matches requirements

- Has all required fields for customer messages
- Includes adminNotes for internal tracking
- respondedAt timestamp for status tracking
- Status enum matches UI requirements (NEW=blue, READ=gray, RESPONDED=green, ARCHIVED=muted)

---

### 1.3 Form Data Types

**File**: `src/types/businessInfo.types.ts` (append)

```typescript
export type ContactNotesFormData = {
  adminNotes: string;
  status: ContactStatus;
};
```

**Usage**: ContactDetailsModal form data

---

## Zod Validation Schemas

### 2.1 Business Info Schema

**File**: `src/components/contacts/BusinessInfoForm.tsx` (inline)

```typescript
import { z } from "zod";

const businessHoursSchema = z
  .object({
    closed: z.boolean(),
    day: z.string(),
    close: z.string().optional(),
    open: z.string().optional(),
  })
  .refine(
    (data) => {
      // If not closed, open and close must be provided
      if (!data.closed) {
        return !!data.open && !!data.close;
      }
      return true;
    },
    {
      message: "Open and close times required when not closed",
    },
  )
  .refine(
    (data) => {
      // If not closed, open time must be before close time
      if (!data.closed && data.open && data.close) {
        const openTime = convertTo24Hour(data.open);
        const closeTime = convertTo24Hour(data.close);
        return openTime < closeTime;
      }
      return true;
    },
    {
      message: "Open time must be before close time",
    },
  );

export const businessInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format")
    .min(10, "Phone must be at least 10 digits"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z
      .string()
      .min(2, "State is required")
      .max(2, "Use 2-letter state code"),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  }),
  businessHours: z.array(businessHoursSchema),
});

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
```

**Helper Function**:

```typescript
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = modifier === "AM" ? "00" : "12";
  } else if (modifier === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours}:${minutes}`;
}
```

---

### 2.2 Contact Notes Schema

**File**: `src/components/contacts/ContactDetailsModal.tsx` (inline)

```typescript
import { z } from "zod";
import { ContactStatus } from "@/types/contact.types";

export const contactNotesSchema = z.object({
  adminNotes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  status: z.enum([
    ContactStatus.NEW,
    ContactStatus.READ,
    ContactStatus.RESPONDED,
    ContactStatus.ARCHIVED,
  ]),
});

export type ContactNotesFormData = z.infer<typeof contactNotesSchema>;
```

**Notes**:

- adminNotes optional (can be empty)
- Max length 1000 chars (prevents excessive data)
- Status required (must select one)

---

## Type Import Rules

**CRITICAL**: Use type-only imports due to `verbatimModuleSyntax: true`

```typescript
// ✅ Correct
import type { Contact, ContactStatus } from "@/types/contact.types";
import type { BusinessInfo, BusinessHours } from "@/types/businessInfo.types";

// ❌ Wrong (causes build error)
import { Contact, ContactStatus } from "@/types/contact.types";
```

**Exception**: Import ContactStatus constant object for values

```typescript
import { ContactStatus } from "@/types/contact.types"; // ✅ OK (not type-only)
```

---

## Files to Create

1. `src/types/businessInfo.types.ts` - BusinessInfo and BusinessHours types

---

## Files to Verify

1. `src/types/contact.types.ts` - Ensure matches structure above (already exists)

---

## Validation Rules Summary

| Field                  | Rule                                          | Error Message                                   |
| ---------------------- | --------------------------------------------- | ----------------------------------------------- |
| Email                  | Valid email format                            | "Invalid email address"                         |
| Phone                  | Contains digits, spaces, dashes, parens, plus | "Invalid phone format"                          |
| Phone                  | Min 10 characters                             | "Phone must be at least 10 digits"              |
| ZIP                    | Format: 12345 or 12345-6789                   | "Invalid ZIP code format"                       |
| State                  | 2 characters                                  | "Use 2-letter state code"                       |
| Business Hours (Open)  | Present if not closed                         | "Open and close times required when not closed" |
| Business Hours (Times) | Open < Close                                  | "Open time must be before close time"           |
| Admin Notes            | Max 1000 chars                                | "Notes must be less than 1000 characters"       |

---

## Testing Checklist

- [ ] Import types without build errors (type-only imports)
- [ ] Zod schemas validate correctly (test with invalid data)
- [ ] Time comparison works (12:00 PM > 09:00 AM)
- [ ] Optional phone field works for Contact type
- [ ] BusinessHours closed=true allows empty open/close

---

## Next Phase

**Phase 2: Mock Data Generation** - Generate realistic contacts and business info using these types
