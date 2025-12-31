# Phase 7: Page Integration

**Duration**: 1.5 hours
**Dependencies**: Phase 5 (Business Info), Phase 6 (Customer Messages)
**Risk**: Low

---

## Objectives

1. Assemble ContactsPage with two main sections
2. Implement search with useDebounce hook
3. Add DataTable with row click handler
4. Wire up routing and navigation

---

## ContactsPage Component

**File**: `src/pages/ContactsPage.tsx`

```typescript
import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { Contact, ContactStatus as ContactStatusType } from "@/types/contact.types";

import {
  BusinessInfoForm,
  ContactDetailsModal,
  StatusFilter,
} from "@/components/contacts";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/components/layout/shared/DataTable";
import { StatusBadge } from "@/components/layout/shared/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { contactsService } from "@/services/contacts.service";
import { useContactsStore } from "@/store/contactsStore";

export function ContactsPage() {
  const contacts = useContactsStore((state) => state.contacts);
  const initializeContacts = useContactsStore(
    (state) => state.initializeContacts
  );

  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState<ContactStatusType | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await contactsService.getAll();
      useContactsStore.getState().setContacts(data);
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Failed to load contacts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeContacts();
    loadContacts();
  }, [initializeContacts]);

  const handleRowClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsModalOpen(true);
  };

  // Filter and search logic
  const filteredContacts = useMemo(() => {
    let items = contacts;

    // Filter by status
    if (activeStatus !== "all") {
      items = items.filter((contact) => contact.status === activeStatus);
    }

    // Filter by search query (name, email, subject, message)
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      items = items.filter(
        (contact) =>
          contact.firstName.toLowerCase().includes(query) ||
          contact.lastName.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.subject.toLowerCase().includes(query) ||
          contact.message.toLowerCase().includes(query)
      );
    }

    return items;
  }, [contacts, activeStatus, debouncedSearch]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<ContactStatusType | "all", number> = {
      all: contacts.length,
      archived: 0,
      new: 0,
      read: 0,
      responded: 0,
    };

    contacts.forEach((contact) => {
      counts[contact.status]++;
    });

    return counts;
  }, [contacts]);

  // Define table columns
  const columns: ColumnDef<Contact>[] = useMemo(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {format(new Date(row.original.createdAt), "MMM d, yyyy")}
          </div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        id: "date",
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Customer" />
        ),
        id: "customer",
      },
      {
        accessorFn: (row) => row.phone,
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {row.original.phone || "—"}
          </div>
        ),
        header: "Phone",
        id: "phone",
      },
      {
        accessorFn: (row) => row.subject,
        cell: ({ row }) => (
          <div className="max-w-xs truncate">{row.original.subject}</div>
        ),
        header: "Subject",
        id: "subject",
      },
      {
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} variant="contact" />
        ),
        header: "Status",
        id: "status",
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage business contact information and customer messages
        </p>
      </div>

      {/* Section 1: Business Contact Information */}
      <BusinessInfoForm />

      {/* Section 2: Customer Messages */}
      <div className="space-y-4">
        {/* Status Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Status</CardTitle>
            <CardDescription>
              View messages by their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusFilter
              activeStatus={activeStatus}
              statusCounts={statusCounts}
              onStatusChange={setActiveStatus}
            />
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Messages</CardTitle>
                <CardDescription>
                  {filteredContacts.length} of {contacts.length} messages
                </CardDescription>
              </div>
              <div className="w-full max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, subject, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading contacts...
                  </p>
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    {searchQuery || activeStatus !== "all"
                      ? "No messages found matching your filters"
                      : "No customer messages found"}
                  </p>
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredContacts}
                onRowClick={handleRowClick}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Details Modal */}
      <ContactDetailsModal
        contact={selectedContact}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onSuccess={loadContacts}
      />
    </div>
  );
}
```

---

## Component Breakdown

### Page Layout Structure

**Two Main Sections**:

1. Business Info Form (top)
2. Customer Messages (bottom) with Status Filter + Table

**Spacing**: `space-y-6` provides consistent vertical rhythm

---

### Search Implementation

**Debounced Search**:

```typescript
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 300);
```

**Multi-field Search**:

```typescript
contact.firstName.toLowerCase().includes(query) ||
  contact.lastName.toLowerCase().includes(query) ||
  contact.email.toLowerCase().includes(query) ||
  contact.subject.toLowerCase().includes(query) ||
  contact.message.toLowerCase().includes(query);
```

**Benefits**:

- Searches across 5 fields (name, email, subject, message content)
- 300ms debounce prevents excessive filtering during typing

---

### DataTable Columns

**Date Column** (Sortable):

```typescript
{
  accessorFn: (row) => row.createdAt,
  cell: ({ row }) => (
    <div className="whitespace-nowrap">
      {format(new Date(row.original.createdAt), "MMM d, yyyy")}
    </div>
  ),
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Date" />
  ),
  id: "date",
}
```

**Customer Column** (Name + Email):

```typescript
{
  accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  cell: ({ row }) => (
    <div>
      <p className="font-medium">{row.original.firstName} {row.original.lastName}</p>
      <p className="text-xs text-muted-foreground">{row.original.email}</p>
    </div>
  ),
  header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
  id: "customer",
}
```

**Phone Column** (Optional):

```typescript
{
  cell: ({ row }) => (
    <div className="whitespace-nowrap">{row.original.phone || "—"}</div>
  ),
}
```

**Subject Column** (Truncated):

```typescript
{
  cell: ({ row }) => (
    <div className="max-w-xs truncate">{row.original.subject}</div>
  ),
}
```

**Status Column** (Badge):

```typescript
{
  cell: ({ row }) => (
    <StatusBadge status={row.original.status} variant="contact" />
  ),
}
```

---

### Filter Logic

**Status Filter**:

```typescript
if (activeStatus !== "all") {
  items = items.filter((contact) => contact.status === activeStatus);
}
```

**Search Filter**:

```typescript
if (debouncedSearch) {
  const query = debouncedSearch.toLowerCase();
  items = items.filter(/* multi-field search */);
}
```

**Order**: Status filter applied first, then search (efficient)

---

### Loading States

**Loading Spinner**:

```typescript
<div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
```

**Empty State**:

```typescript
{
  searchQuery || activeStatus !== "all"
    ? "No messages found matching your filters"
    : "No customer messages found";
}
```

**Conditional Rendering**: Loading → Empty → Data

---

## Routing Integration

**File**: `src/App.tsx` (modify)

```typescript
import { ContactsPage } from "@/pages/ContactsPage";

// Inside ProtectedRoute
<Route path="/contacts" element={<ContactsPage />} />
```

---

## Navigation Integration

**File**: `src/components/layout/Sidebar.tsx` (modify)

```typescript
import { Mail } from "lucide-react"; // Add to existing imports

// Add to navigation items array
const navigationItems = [
  // ... existing items
  {
    icon: Mail,
    label: "Contacts",
    path: "/contacts",
  },
];
```

**Icon**: `Mail` (envelope icon, suitable for contact messages)

---

## Mobile Responsiveness

### Search Input Layout

**Desktop**: Aligned right in CardHeader
**Mobile**: Full width below title

```typescript
<div className="flex items-center justify-between">
  <div>
    <CardTitle>Customer Messages</CardTitle>
    <CardDescription>...</CardDescription>
  </div>
  <div className="w-full max-w-sm">
    <Input ... />
  </div>
</div>
```

**Breakpoint Behavior**:

- Mobile: Stack vertically (flex wraps)
- Desktop: Side-by-side

---

### DataTable Responsiveness

**Horizontal Scroll**: DataTable component handles overflow automatically

```typescript
<DataTable
  columns={columns}
  data={filteredContacts}
  onRowClick={handleRowClick}
/>
```

**Mobile UX**: Table scrolls horizontally on small screens (DataTable component built-in)

---

## Performance Optimizations

### useMemo for Filtering

```typescript
const filteredContacts = useMemo(() => {
  // Filtering logic
}, [contacts, activeStatus, debouncedSearch]);
```

**Why**: Prevents re-filtering on every render (only when dependencies change)

---

### useMemo for Status Counts

```typescript
const statusCounts = useMemo(() => {
  // Count logic
}, [contacts]);
```

**Why**: Counts only recalculate when contacts array changes

---

### Column Definitions Memoization

```typescript
const columns: ColumnDef<Contact>[] = useMemo(() => [...], []);
```

**Why**: Empty dependency array means columns defined once (stable reference)

---

## Testing Scenarios

### Page Load Tests

- [ ] Page loads without errors
- [ ] Business info form displays
- [ ] Contacts table displays
- [ ] Status filter shows correct counts

---

### Search Tests

- [ ] Search by first name → Filters correctly
- [ ] Search by email → Filters correctly
- [ ] Search by subject → Filters correctly
- [ ] Search by message content → Filters correctly
- [ ] Clear search → Shows all contacts

---

### Filter Tests

- [ ] Click "New" → Shows only NEW contacts
- [ ] Click "All" → Shows all contacts
- [ ] Filter + Search combination → Both applied

---

### Interaction Tests

- [ ] Click table row → Opens ContactDetailsModal
- [ ] Modal save → Refreshes table data
- [ ] Status change → Badge updates in table

---

## Files to Create

1. `src/pages/ContactsPage.tsx` - Main page component

---

## Files to Modify

1. `src/App.tsx` - Add /contacts route
2. `src/components/layout/Sidebar.tsx` - Add Contacts nav item

---

## Integration Checklist

- [ ] Import all components (BusinessInfoForm, ContactDetailsModal, StatusFilter)
- [ ] Import DataTable and DataTableColumnHeader
- [ ] Import StatusBadge with contact variant
- [ ] Import useDebounce hook
- [ ] Add route to App.tsx
- [ ] Add navigation to Sidebar.tsx
- [ ] Test page loads at /contacts URL

---

## Common Issues & Solutions

### Issue 1: DataTable not displaying

**Fix**: Ensure DataTable component exists in `src/components/layout/shared/DataTable.tsx`

---

### Issue 2: StatusBadge showing wrong colors

**Fix**: Verify StatusBadge.tsx has `variant="contact"` case with contact status styles

---

### Issue 3: Search not debouncing

**Fix**: Check useDebounce hook exists at `src/hooks/useDebounce.ts`

---

### Issue 4: Modal not opening

**Fix**: Verify Dialog component imported from `@/components/ui/dialog`

---

## Accessibility Considerations

- Page has h1 heading ("Contacts")
- Sections have clear labels (CardTitle)
- Search input has placeholder
- Table rows are clickable (keyboard accessible via DataTable)
- Modal traps focus (Radix Dialog built-in)

---

## Next Phase

**Phase 8: Testing & Validation** - Comprehensive testing of all features
