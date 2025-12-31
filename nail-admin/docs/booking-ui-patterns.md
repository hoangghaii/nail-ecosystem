# Booking Management UI Patterns & Best Practices

**Research Date**: 2025-12-06
**Context**: Pink Nail Admin Dashboard - Building Bookings CRUD feature

---

## 1. List/Table Views

### Recommended Column Layout

- **Customer**: Name (searchable, link to contact)
- **Service**: Service name + category badge
- **Date/Time**: ISO format (2025-12-15 14:30), sortable
- **Status**: Color-coded badge (see section 3)
- **Actions**: Quick-edit status + view details + delete

### Key UX Decisions

| Pattern    | Pro                                 | Con                | Recommendation             |
| ---------- | ----------------------------------- | ------------------ | -------------------------- |
| **Table**  | Compact, sortable, multiple filters | Mobile unfriendly  | Primary for desktop        |
| **Cards**  | Mobile-friendly, visual             | Vertical scrolling | Use for <20 items          |
| **Hybrid** | Responsive table→cards              | Complex CSS        | Best for modern dashboards |

**Implementation**: Use shadcn/ui DataTable with TanStack Table v8

```typescript
// src/components/shared/DataTable.tsx pattern
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Customer</TableHead>
      <TableHead>Service</TableHead>
      <TableHead>DateTime</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {bookings.map(booking => (
      <BookingRow key={booking.id} booking={booking} />
    ))}
  </TableBody>
</Table>
```

---

## 2. Filtering Patterns

### Multi-Level Filter Architecture (Recommended for nail salon)

**Tier 1 - Status Filter** (Most critical)

- Faceted filter: pending, confirmed, completed, cancelled
- Use checkbox group, not dropdown (see multiple simultaneously)
- Color-coded: pending=amber, confirmed=blue, completed=green, cancelled=gray

```typescript
const statusFilters = {
  'pending': { label: 'Pending', color: 'bg-amber-100', variant: 'outline' },
  'confirmed': { label: 'Confirmed', color: 'bg-blue-100', variant: 'default' },
  'completed': { label: 'Completed', color: 'bg-green-100', variant: 'secondary' },
  'cancelled': { label: 'Cancelled', color: 'bg-gray-100', variant: 'outline' }
}

// Render as filter buttons
Object.entries(statusFilters).map(([status, config]) => (
  <Button
    key={status}
    variant={selectedStatus === status ? 'default' : 'outline'}
    onClick={() => toggleStatusFilter(status)}
  >
    {config.label}
  </Button>
))
```

**Tier 2 - Date Range Filter**

- Preset buttons: Today, Upcoming (7 days), Upcoming (30 days), Past
- Advanced option: Custom date range picker
- TanStack Table: Use `inDateRange` filter with accessor for date field

```typescript
const dateFilters = {
  today: (date) => isToday(date),
  upcoming7: (date) => isWithinDays(date, 7),
  upcoming30: (date) => isWithinDays(date, 30),
  past: (date) => isPast(date),
};
```

**Tier 3 - Customer Search**

- Text search: Full-text across firstName, lastName, email, phone
- Debounced (300ms) to avoid excessive re-renders
- TanStack Table: Use `includesString` filter with custom accessor

```typescript
const searchFilters = [
  table.getColumn("firstName")?.setFilterValue(searchTerm),
  table.getColumn("lastName")?.setFilterValue(searchTerm),
  table.getColumn("email")?.setFilterValue(searchTerm),
];
```

### Implementation via TanStack Table

Reference: [TanStack Table Filtering Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)

```typescript
const table = useReactTable({
  data: bookings,
  columns: bookingColumns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
});
```

---

## 3. Status Update Workflows

### State Machine (Canonical Workflow)

**Valid Transitions**:

```
pending  → confirmed, cancelled
confirmed → completed, cancelled
completed → (terminal)
cancelled → (terminal)
```

**Rules**:

- Cannot transition from completed/cancelled
- Pending→completed forbidden (must confirm first)
- Cancellation always allowed (up to completed)

### UI Implementation Strategy

**Inline Status Update** (Recommended for confirmed→completed only)

- Use dropdown menu in actions column
- Show spinner during update
- Optimistic update with rollback on error
- Toast notification on success

```typescript
// src/components/bookings/BookingStatusMenu.tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      {statusLabel}
      <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    {getValidTransitions(booking.status).map(status => (
      <DropdownMenuItem
        key={status}
        onClick={() => updateStatus(booking.id, status)}
      >
        {status}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

**Confirmation Modal** (For destructive transitions)

- pending→cancelled or confirmed→cancelled
- Dialog title: "Cancel Booking?"
- Body: Show customer name, service, date
- Warning: "Customer will be notified"
- Buttons: "Confirm" (red), "Cancel" (gray)

```typescript
// Dialog pattern
<AlertDialog open={showCancel} onOpenChange={setShowCancel}>
  <AlertDialogContent>
    <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
    <AlertDialogDescription>
      Customer ({booking.customerInfo.firstName}) will lose their
      {booking.service.name} reservation on{' '}
      {formatDate(booking.date, booking.timeSlot)}
    </AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
      <AlertDialogAction className="bg-red-600">
        Cancel Booking
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Visual Feedback Hierarchy

- **Loading**: Button spinner
- **Success**: Toast (green, "Booking confirmed")
- **Error**: Toast (red, "Failed to update booking")
- **Confirmation**: Modal for high-risk actions

Reference: [Confirmation Dialog Best Practices](https://www.designsystemscollective.com/designing-success-part-2-dos-don-ts-and-use-cases-of-confirmation-patterns-6e760ccd1708)

---

## 4. Booking Details View

### Modal/Drawer Layout (Right-side drawer recommended for desktop)

**Section 1: Service Details** (Read-only)

```
Service: [Service Name] → [Category Badge]
Duration: 60 minutes | Price: $45
Description: [Service description]
```

**Section 2: Customer Info** (Editable optional)

```
Name: [First] [Last]
Email: [email]
Phone: [phone]
```

**Section 3: Booking DateTime** (Read-only)

```
Date: 2025-12-15 (Monday)
Time: 2:30 PM - 3:30 PM
Status: [Status Badge]
```

**Section 4: Notes** (Editable)

```
[Multiline textarea for admin notes]
```

**Section 5: Actions**

- Button: "Confirm" (pending only)
- Button: "Complete" (confirmed only)
- Button: "Cancel" (pending/confirmed)
- Button: "Delete"

### Component Structure

```typescript
// src/pages/BookingDetailsDrawer.tsx
<Drawer open={isOpen} onOpenChange={onClose}>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Booking Details</DrawerTitle>
    </DrawerHeader>

    <div className="space-y-6 px-4">
      <ServiceSection booking={booking} />
      <CustomerSection booking={booking} />
      <DateTimeSection booking={booking} />
      <NotesSection booking={booking} />
    </div>

    <DrawerFooter>
      <ActionButtons booking={booking} />
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## 5. Performance Considerations

### Pagination Strategy

| Option          | When to Use          | Setup                               |
| --------------- | -------------------- | ----------------------------------- |
| **Server-side** | >1000 bookings/month | API: `?page=1&limit=20`             |
| **Client-side** | <500 bookings/month  | TanStack: `getPaginationRowModel()` |
| **Hybrid**      | 500-5000/month       | Fetch 500 at once, paginate client  |

**Current Project**: Start with client-side (mock data), upgrade to server-side when backend ready.

```typescript
const table = useReactTable({
  data: bookings,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 20 } }
})

// Pagination controls
<Pagination>
  <Button onClick={() => table.previousPage()}>Previous</Button>
  <span>Page {table.getState().pagination.pageIndex + 1}</span>
  <Button onClick={() => table.nextPage()}>Next</Button>
</Pagination>
```

### Optimization Tips

1. **Memoization**: Wrap columns definition with `useMemo`
2. **Debounced Filters**: 300ms delay on search input (prevent table thrashing)
3. **Virtual Scrolling**: Use `react-window` if >100 rows visible
4. **Lazy Load Details**: Load booking notes only when drawer opens

---

## 6. Implementation Checklist (Nail Salon Context)

**Foundation**

- [ ] Create `Booking` interface matching shared types (id, serviceId, date, timeSlot, customerInfo, notes, status)
- [ ] Create `bookingsService.ts` with dual-mode (mock/API)
- [ ] Create `useBookingsStore.ts` (Zustand for CRUD state)

**Table Features**

- [ ] DataTable component with TanStack Table
- [ ] Status column with color-coded badges
- [ ] DateTime sorting (by date + time slot)
- [ ] Customer name search (debounced)

**Filters**

- [ ] Status faceted filter (checkboxes)
- [ ] Date range presets (Today, Upcoming 7/30d, Past)
- [ ] Customer search box

**Status Updates**

- [ ] Inline dropdown for status changes
- [ ] Confirmation modal for cancellations
- [ ] Toast notifications (success/error)
- [ ] Optimistic updates

**Details View**

- [ ] Right-side drawer for booking details
- [ ] Editable customer notes field
- [ ] Action buttons (Confirm, Complete, Cancel, Delete)
- [ ] Service info display

**Polish**

- [ ] Empty state when no bookings
- [ ] Loading skeleton for table
- [ ] Mobile-responsive table (cards fallback)
- [ ] Accessibility: ARIA labels on status badges

---

## 7. Design System Integration

### shadcn/ui Components to Use

- `<Table>` + `<TableHeader>` + `<TableBody>` - TanStack Table wrapper
- `<Badge>` with variants for status (default, secondary, outline)
- `<DropdownMenu>` for inline status updates
- `<AlertDialog>` for cancellation confirmation
- `<Drawer>` for booking details (right sidebar)
- `<Button>` with variants for actions
- `<Input>` + `<Label>` for customer search
- `<Textarea>` for admin notes

### Color Scheme (Blue Theme)

```css
pending: bg-amber-50 text-amber-900 border-amber-200    /* Warning */
confirmed: bg-blue-50 text-blue-900 border-blue-200     /* Primary */
completed: bg-green-50 text-green-900 border-green-200  /* Success */
cancelled: bg-gray-50 text-gray-900 border-gray-200     /* Neutral */
```

---

## References

- [shadcn/ui Data Table Documentation](https://ui.shadcn.com/docs/components/data-table)
- [TanStack Table Column Filtering](https://tanstack.com/table/v8/docs/guide/column-filtering)
- [Confirmation Dialog UX Patterns](https://www.designsystemscollective.com/designing-success-part-2-dos-don-ts-and-use-cases-of-confirmation-patterns-6e760ccd1708)
- [Status Design Pattern (UI Patterns)](https://ui-patterns.com/patterns/Status)
- [shadcn/ui Badge Component](https://ui.shadcn.com/docs/components/badge)

---

**Next Step**: Use this research to implement `BookingsPage` with full CRUD + filtering workflows.
