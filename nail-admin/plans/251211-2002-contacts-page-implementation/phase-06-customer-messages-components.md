# Phase 6: Customer Messages Components

**Duration**: 2.5 hours
**Dependencies**: Phase 4 (State Management)
**Risk**: Medium (Dialog complexity, status change logic)

---

## Objectives

1. Build StatusFilter component for contact status filtering
2. Create ContactDetailsModal (Dialog) for viewing/editing messages
3. Add StatusBadge styling for contact statuses
4. Implement status change with respondedAt timestamp update

---

## Component 1: StatusFilter

**File**: `src/components/contacts/StatusFilter.tsx`

```typescript
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContactStatus } from "@/types/contact.types";

type StatusFilterProps = {
  activeStatus: ContactStatus | "all";
  onStatusChange: (status: ContactStatus | "all") => void;
  statusCounts: Record<ContactStatus | "all", number>;
};

const statusLabels: Record<ContactStatus | "all", string> = {
  all: "All",
  archived: "Archived",
  new: "New",
  read: "Read",
  responded: "Responded",
};

export function StatusFilter({
  activeStatus,
  onStatusChange,
  statusCounts,
}: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(statusLabels) as Array<ContactStatus | "all">).map(
        (status) => (
          <Button
            key={status}
            variant={activeStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(status)}
            className="gap-2"
          >
            {statusLabels[status]}
            <Badge
              variant={activeStatus === status ? "secondary" : "outline"}
              className="ml-1"
            >
              {statusCounts[status]}
            </Badge>
          </Button>
        )
      )}
    </div>
  );
}
```

**Notes**:

- Same pattern as BookingsPage StatusFilter
- Active status uses default button variant
- Badge shows count for each status
- Flexible wrapping on mobile (flex-wrap)

---

## Component 2: StatusBadge (Contact Variant)

**File**: `src/components/layout/shared/StatusBadge.tsx` (modify existing)

Add contact variant to existing StatusBadge:

```typescript
// Add to existing StatusBadge component

const contactVariants = {
  archived: "bg-muted text-muted-foreground",
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  read: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  responded: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

// In StatusBadge component
if (variant === "contact") {
  return (
    <Badge className={contactVariants[status as ContactStatus]}>
      {status.toUpperCase()}
    </Badge>
  );
}
```

**Color Mapping**:

- NEW: Blue (new inquiry, needs attention)
- READ: Gray (acknowledged but not responded)
- RESPONDED: Green (customer received response)
- ARCHIVED: Muted (closed/resolved)

---

## Component 3: ContactDetailsModal

**File**: `src/components/contacts/ContactDetailsModal.tsx`

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Contact, ContactStatus } from "@/types/contact.types";

import { StatusBadge } from "@/components/layout/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactsService } from "@/services/contacts.service";
import { ContactStatus as ContactStatusEnum } from "@/types/contact.types";

const contactNotesSchema = z.object({
  adminNotes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
  status: z.enum([
    ContactStatusEnum.NEW,
    ContactStatusEnum.READ,
    ContactStatusEnum.RESPONDED,
    ContactStatusEnum.ARCHIVED,
  ]),
});

type ContactNotesFormData = z.infer<typeof contactNotesSchema>;

type ContactDetailsModalProps = {
  contact?: Contact;
  onClose: () => void;
  onSuccess: () => void;
  open: boolean;
};

export function ContactDetailsModal({
  contact,
  onClose,
  onSuccess,
  open,
}: ContactDetailsModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ContactNotesFormData>({
    resolver: zodResolver(contactNotesSchema),
  });

  // Initialize form when contact changes
  useEffect(() => {
    if (contact) {
      reset({
        adminNotes: contact.adminNotes || "",
        status: contact.status,
      });
    }
  }, [contact, reset]);

  const selectedStatus = watch("status");

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ContactNotesFormData) => {
    if (!contact) return;

    setIsSaving(true);
    try {
      await contactsService.update(contact.id, {
        adminNotes: data.adminNotes || "",
        status: data.status,
      });
      toast.success("Contact updated successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contact Message Details</DialogTitle>
          <DialogDescription>
            View and manage customer contact message
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
            <h3 className="text-sm font-semibold">Customer Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-background p-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-background p-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              {contact.phone && (
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-background p-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Submission Date */}
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-background p-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    📅
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-medium">
                    {format(new Date(contact.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-semibold">Subject</Label>
              <p className="mt-1 text-base">{contact.subject}</p>
            </div>

            <div>
              <Label className="text-sm font-semibold">Message</Label>
              <div className="mt-1 rounded-md border border-border bg-muted/30 p-3">
                <p className="whitespace-pre-wrap text-sm">{contact.message}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setValue("status", value as ContactStatus, { shouldDirty: true })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ContactStatusEnum.NEW}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="new" variant="contact" />
                    <span>New</span>
                  </div>
                </SelectItem>
                <SelectItem value={ContactStatusEnum.READ}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="read" variant="contact" />
                    <span>Read</span>
                  </div>
                </SelectItem>
                <SelectItem value={ContactStatusEnum.RESPONDED}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="responded" variant="contact" />
                    <span>Responded</span>
                  </div>
                </SelectItem>
                <SelectItem value={ContactStatusEnum.ARCHIVED}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="archived" variant="contact" />
                    <span>Archived</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes (Private)</Label>
            <Textarea
              id="adminNotes"
              {...register("adminNotes")}
              placeholder="Add internal notes about this contact..."
              rows={4}
              className={errors.adminNotes ? "border-destructive" : ""}
            />
            {errors.adminNotes && (
              <p className="text-sm text-destructive">
                {errors.adminNotes.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              These notes are private and not visible to customers
            </p>
          </div>

          {/* Responded Timestamp */}
          {contact.respondedAt && (
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                Responded on{" "}
                {format(new Date(contact.respondedAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !isDirty}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Component Breakdown

### Modal Structure

**Dialog vs Sheet**: Use Dialog (not Sheet) per requirements

- Dialog: Center overlay, suitable for forms
- Sheet: Side panel, better for navigation

```typescript
<Dialog open={open} onOpenChange={handleClose}>
  <DialogContent className="max-w-2xl">
```

**Width**: `max-w-2xl` provides adequate space for content without overwhelming

---

### Customer Info Section

**Layout**: Muted background card with icon-label-value pattern

```typescript
<div className="flex items-start gap-3">
  <div className="rounded-md bg-background p-2">
    <Mail className="h-4 w-4 text-muted-foreground" />
  </div>
  <div>
    <p className="text-xs text-muted-foreground">Email</p>
    <a href={`mailto:${contact.email}`} className="font-medium text-primary">
      {contact.email}
    </a>
  </div>
</div>
```

**Clickable Links**:

- Email: `mailto:` link
- Phone: `tel:` link

---

### Message Display

**Whitespace Preservation**: Use `whitespace-pre-wrap` for line breaks

```typescript
<p className="whitespace-pre-wrap text-sm">{contact.message}</p>
```

**Border Styling**: Muted background distinguishes message content

---

### Status Select with Badges

**Visual Status Preview**:

```typescript
<SelectItem value={ContactStatusEnum.NEW}>
  <div className="flex items-center gap-2">
    <StatusBadge status="new" variant="contact" />
    <span>New</span>
  </div>
</SelectItem>
```

**Benefit**: User sees badge color before selecting

---

### Admin Notes Field

**Private Label**:

```typescript
<Label htmlFor="adminNotes">Admin Notes (Private)</Label>
```

**Helper Text**:

```typescript
<p className="text-xs text-muted-foreground">
  These notes are private and not visible to customers
</p>
```

**Purpose**: Clarify notes are internal-only

---

### Responded Timestamp Display

**Conditional Rendering**:

```typescript
{contact.respondedAt && (
  <div className="rounded-md border border-border bg-muted/30 p-3">
    <p className="text-xs text-muted-foreground">
      Responded on {format(new Date(contact.respondedAt), "MMM d, yyyy 'at' h:mm a")}
    </p>
  </div>
)}
```

**Auto-set**: Service layer sets respondedAt when status changes to RESPONDED

---

## Component Index File

**File**: `src/components/contacts/index.ts`

```typescript
export { BusinessInfoForm } from "./BusinessInfoForm";
export { ContactDetailsModal } from "./ContactDetailsModal";
export { StatusFilter } from "./StatusFilter";
```

**Usage**: Simplifies imports in ContactsPage

---

## Interaction Flow

### Opening Modal

```typescript
// In ContactsPage
const handleRowClick = (contact: Contact) => {
  setSelectedContact(contact);
  setIsDetailsModalOpen(true);
};
```

---

### Saving Changes

```typescript
const onSubmit = async (data: ContactNotesFormData) => {
  await contactsService.update(contact.id, {
    adminNotes: data.adminNotes || "",
    status: data.status,
  });
  toast.success("Contact updated successfully!");
  onSuccess(); // Triggers parent to reload data
  handleClose();
};
```

**Flow**:

1. Form submission
2. Service call (updates store)
3. Success toast
4. Parent refresh callback
5. Close modal

---

## Validation Rules

| Field       | Rule           | Error Message                                  |
| ----------- | -------------- | ---------------------------------------------- |
| Status      | Required, enum | Must be one of: NEW, READ, RESPONDED, ARCHIVED |
| Admin Notes | Max 1000 chars | "Notes must be less than 1000 characters"      |

---

## Mobile Responsiveness

**Customer Info Grid**:

```typescript
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
```

**Behavior**:

- Mobile: Single column (stacked)
- Tablet+: Two columns

---

## Testing Scenarios

### Modal Tests

- [ ] Open modal → Form initializes with contact data
- [ ] Change status → Select dropdown works
- [ ] Add notes → Textarea accepts input
- [ ] Save → Updates contact, shows toast, closes modal
- [ ] Cancel → Discards changes, closes modal
- [ ] Click outside → Closes modal without saving

---

### Status Change Tests

- [ ] Change to RESPONDED (first time) → Sets respondedAt
- [ ] Change to RESPONDED (again) → Doesn't overwrite respondedAt
- [ ] Change from RESPONDED to READ → Preserves respondedAt

---

### Validation Tests

- [ ] Notes > 1000 chars → Error message
- [ ] Form dirty → Save button enabled
- [ ] Form pristine → Save button disabled

---

## Accessibility

- All form fields have labels
- Select has SelectTrigger for keyboard navigation
- Dialog has proper ARIA roles (handled by Radix)
- Focus trap within dialog
- Escape key closes dialog

---

## Files to Create

1. `src/components/contacts/StatusFilter.tsx` - Status filter buttons
2. `src/components/contacts/ContactDetailsModal.tsx` - Message details dialog
3. `src/components/contacts/index.ts` - Component exports

---

## Files to Modify

1. `src/components/layout/shared/StatusBadge.tsx` - Add contact variant

---

## Next Phase

**Phase 7: Page Integration** - Assemble ContactsPage with both sections
