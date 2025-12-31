# Form Validation & Data Management Research Report

**Date**: 2025-12-11
**Task**: ContactsPage Implementation
**Limit**: 5 tool calls, ≤150 lines

---

## 1. Form Validation Patterns (React Hook Form + Zod)

### Existing Pattern Analysis

- **LoginPage** establishes baseline: `zodResolver(schema)` + `useForm` hook
- Error handling: Conditionally apply `border-destructive` className to Input
- Error display: Render `<p className="text-sm text-destructive">` below input
- Type inference: `type LoginForm = z.infer<typeof loginSchema>`

### Validation Schema for Contacts (Admin Notes Form)

```typescript
const contactNotesSchema = z.object({
  adminNotes: z.string().max(500, "Max 500 characters").optional(),
  status: z.enum([
    ContactStatus.NEW,
    ContactStatus.READ,
    ContactStatus.RESPONDED,
    ContactStatus.ARCHIVED,
  ]),
});
```

### Email/Phone Validation

- Email: `z.string().email("Invalid email address")`
- Phone: `z.string().regex(/^[0-9\-\+\(\)\s]+$/, "Invalid phone format")` (US)

---

## 2. Inline Form Editing Pattern

### Key Insight from BannersPage

- Modal-based editing: State pattern `selectedBanner` + `isFormModalOpen` boolean
- No inline editing implemented yet (all CRUD via modals)

### For Admin Notes (Inline Approach)

**Don't create modal for admin notes**—use card with inline edit:

1. Initial state: Read-only text display
2. Click "Edit" → Show form with `<textarea>` + "Save"/"Cancel" buttons
3. `isEditing` state controls UI mode
4. Save calls `contactsService.updateAdminNotes()` → reload
5. Cancel discards changes, reverts to read-only

**Form State Pattern**:

```typescript
const [isEditing, setIsEditing] = useState(false);
const { register, handleSubmit, reset } = useForm<NotesForm>({
  resolver: zodResolver(contactNotesSchema),
  defaultValues: { adminNotes: contact.adminNotes },
});

const onSave = async (data) => {
  await contactsService.updateAdminNotes(contact.id, data);
  setIsEditing(false);
  toast.success("Notes saved!");
};

const onCancel = () => {
  reset();
  setIsEditing(false);
};
```

---

## 3. DataTable Patterns with Filters

### BookingsPage Blueprint

**Status Filter**:

- `useState<BookingStatusType | "all">` for active filter
- `statusCounts` computed via `useMemo` (all/pending/confirmed/completed/cancelled)
- Filter applied in `filteredBookings` logic

**Search Pattern**:

- `useDebounce(searchQuery, 300)` hook (custom, in `@/hooks/useDebounce`)
- Multi-field search: firstName, lastName, email, phone
- Applied via `filter()` with `.toLowerCase().includes(query)`

**Column Definitions**:

- `accessorFn` + `cell` render for computed columns
- `header` (string) or `header` (component) for column titles
- `DataTableColumnHeader` component enables sorting
- `StatusBadge` component for status cells

### Contacts Table Columns

```typescript
const columns: ColumnDef<Contact>[] = useMemo(() => [
  {
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.firstName} {row.original.lastName}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.subject,
    header: "Subject",
  },
  {
    accessorFn: (row) => row.status,
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} variant="contact" />,
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(row.original)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Notes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange(row.original)}>
            Change Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
], []);
```

---

## Implementation Checklist

- [ ] Create `contactsService` with CRUD + status/notes updates
- [ ] Implement `StatusFilter` component (similar to BookingsPage)
- [ ] Build `DataTable` with 5 columns + row click handler
- [ ] Add inline edit form for admin notes (card-based, not modal)
- [ ] Use `useDebounce` for search (firstName, lastName, email)
- [ ] Apply `border-destructive` + error text pattern for validation
- [ ] Add `StatusBadge` variant="contact" for status column
- [ ] Implement `useMemo` for filtering logic

---

## Unresolved Questions

1. Should contact details open in modal or dedicated details page?
2. Should admin notes support markdown or plain text only?
3. Does "status change" require confirmation dialog?
