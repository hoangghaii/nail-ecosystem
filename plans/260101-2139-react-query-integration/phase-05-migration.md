# Phase 5: Component Migration

**Priority**: P2
**Blockers**: Phases 2-4 complete
**Estimated Time**: 4-6 hours

---

## Overview

Migrate components from direct service calls to React Query hooks. Do this **incrementally** - one page at a time, test thoroughly, then move to next.

---

## Migration Strategy

### Approach: Page-by-Page Incremental

**DO**:
- ✅ Migrate one page at a time
- ✅ Test thoroughly after each page
- ✅ Keep service imports as backup
- ✅ Verify in DevTools after migration
- ✅ Commit after each successful page

**DON'T**:
- ❌ Migrate all pages at once (risky)
- ❌ Delete service files during migration
- ❌ Change component logic (only data fetching)
- ❌ Change UI/UX behavior

---

## Migration Pattern

### Before (Direct Service Call)
```typescript
function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    servicesService
      .getAll()
      .then(setServices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await servicesService.delete(id);
      setServices(services.filter((s) => s.id !== id));
      toast.success('Deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return <ServicesTable data={services} onDelete={handleDelete} />;
}
```

### After (React Query Hook)
```typescript
function ServicesPage() {
  const { data: services, isLoading, error } = useServices();
  const deleteService = useDeleteService();

  const handleDelete = (id: string) => {
    if (confirm('Delete?')) {
      deleteService.mutate(id); // Automatic cache invalidation
    }
  };

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <ServicesTable
      data={services}
      onDelete={handleDelete}
      isDeleting={deleteService.isPending}
    />
  );
}
```

**Benefits**:
- Declarative loading/error states
- Automatic cache management
- No manual state updates needed
- Background refetching automatic
- Cleaner, less code

---

## Migration Order

### Admin App (Recommended Order)

1. **Services Page** (Start here - most common pattern)
   - List view
   - Detail view
   - Create/Edit forms
   - Delete confirmation
   - **Time**: 45 minutes

2. **Gallery Page**
   - Similar pattern to services
   - **Time**: 30 minutes

3. **Bookings Page**
   - List with filters
   - Detail view
   - Status updates
   - **Time**: 45 minutes

4. **Dashboard Page**
   - Stats display
   - Recent bookings
   - **Time**: 30 minutes

5. **Banners Page**
   - CRUD operations
   - **Time**: 20 minutes

6. **Contacts Page**
   - List with filters
   - Mark as read
   - **Time**: 20 minutes

7. **Settings Pages**
   - Business info
   - Hero settings
   - **Time**: 30 minutes

**Total Admin**: ~4 hours

---

### Client App (Recommended Order)

1. **Services Page**
   - Service list
   - Service details
   - **Time**: 30 minutes

2. **Gallery Page**
   - Gallery grid
   - Image modal
   - **Time**: 20 minutes

3. **Booking Form**
   - Form submission
   - Success/error handling
   - **Time**: 30 minutes

**Total Client**: ~1.5 hours

---

## Testing Checklist (Per Page)

### Before Migration
- [ ] Take screenshot of current page
- [ ] Document current behavior
- [ ] Note any bugs/issues

### After Migration
- [ ] Page loads without errors
- [ ] Data displays correctly
- [ ] Loading state shows on initial load
- [ ] Error state shows on failure
- [ ] All CRUD operations work
- [ ] Cache updates after mutations
- [ ] Background refetching works
- [ ] Compare to screenshot (should be identical)
- [ ] No console errors
- [ ] DevTools shows queries

### Regression Testing
- [ ] Navigate away and back (cache should work)
- [ ] Refresh page (refetch should happen)
- [ ] Test with slow network (DevTools Network tab)
- [ ] Test with API error (stop backend)
- [ ] Test concurrent operations

---

## Rollback Per Page

If migration causes issues:

```typescript
// Temporarily revert to old pattern
function ServicesPage() {
  // Comment out: const { data } = useServices();

  // Use old pattern temporarily
  const [services, setServices] = useState<Service[]>([]);
  // ... old implementation
}
```

**Keep service files** until ALL pages migrated successfully.

---

## Common Migration Patterns

### Pattern 1: Simple List
```typescript
// Before: useState + useEffect
// After: useQuery hook
const { data, isLoading, error } = useResources();
```

### Pattern 2: Detail with ID from Route
```typescript
const { id } = useParams();
const { data: item, isLoading } = useResource(id);
// enabled: !!id handled in hook
```

### Pattern 3: Create/Edit Form
```typescript
const createResource = useCreateResource();
const updateResource = useUpdateResource();

const handleSubmit = (data) => {
  if (isEditing) {
    updateResource.mutate({ id, data });
  } else {
    createResource.mutate(data);
  }
};

// Loading state
const isSubmitting = createResource.isPending || updateResource.isPending;
```

### Pattern 4: Delete with Confirmation
```typescript
const deleteResource = useDeleteResource();

const handleDelete = (id: string) => {
  if (confirm('Delete?')) {
    deleteResource.mutate(id);
  }
};
```

### Pattern 5: Optimistic Toggle
```typescript
const toggleFeatured = useToggleResourceFeatured();

const handleToggle = (id: string, featured: boolean) => {
  toggleFeatured.mutate({ id, featured });
  // UI updates immediately (optimistic)
  // Reverts if API fails
};
```

---

## Success Criteria

- [x] All admin pages migrated (7 pages)
- [x] All client pages migrated (3 pages)
- [x] Zero breaking changes to UI
- [x] All CRUD operations work
- [x] Cache behavior verified
- [x] No console errors
- [x] DevTools shows all queries
- [x] Performance same or better
- [x] Ready to deprecate service layer
