# Scout Report: Admin UI Patterns

8 core UI patterns from admin dashboard for building expense management system.

## 1. Dashboard Card Pattern

Location: `/apps/admin/src/pages/DashboardPage.tsx`

**Responsive grid layout** (md:2cols, lg:4cols) with icon + label + value:

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {stats.map((stat) => (
    <Card key={stat.label}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
        <stat.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
      </CardContent>
    </Card>
  ))}
</div>
```

**Pattern**: Icon top-right, label + value stacked, responsive grid

## 2. Form Modal Pattern

Location: `/apps/admin/src/components/gallery/GalleryFormModal.tsx`

**React Hook Form + Zod validation with Dialog wrapper**:

```tsx
const formSchema = z.object({
  title: z.string().min(1, "Title required"),
  category: z.string().min(1, "Category required"),
  imageUrl: z.string().url("Valid URL required"),
  description: z.string().optional(),
  featured: z.boolean().default(false),
});

export function GalleryFormModal({ mode, item, onSuccess }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: item || { title: "", category: "", imageUrl: "", description: "", featured: false },
  });

  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (mode === "create") {
      await createMutation.mutateAsync(values);
    } else {
      await updateMutation.mutateAsync({ id: item!._id, data: values });
    }
    onSuccess();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="title" render={...} />
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

**Pattern**: Separate create/edit modes, shared form schema, mutation isPending state

## 3. Table Component Pattern

Location: `/apps/admin/src/components/bookings/BookingTable.tsx`

**TanStack React Table with column definitions**:

```tsx
const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    accessorKey: "customerInfo.firstName",
    header: "Customer",
    cell: ({ row }) => `${row.original.customerInfo.firstName} ${row.original.customerInfo.lastName}`,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuItem onClick={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(row.original._id)}>Delete</DropdownMenuItem>
      </DropdownMenu>
    ),
  },
];

const table = useReactTable({
  data: bookings?.data || [],
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});
```

**Pattern**: Declarative columns, actions column with dropdown, sorting support

## 4. List Page with Infinite Scroll

Location: `/apps/admin/src/pages/GalleryPage.tsx`

**Infinite scroll with debounced search (300ms) and filters**:

```tsx
export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteGalleryItems({
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
    search: debouncedSearch || undefined,
  });

  return (
    <div>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.pages.map((page) =>
          page.data.map((item) => <GalleryCard key={item._id} item={item} />)
        )}
      </div>

      <InfiniteScrollTrigger
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}
```

**Pattern**: Debounced search, category filter, infinite scroll trigger component

## 5. Delete Confirmation Dialog

Location: `/apps/admin/src/components/gallery/GalleryCard.tsx`

**AlertDialog with destructive action**:

```tsx
<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Item?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the gallery item.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Pattern**: AlertDialog (not Dialog), descriptive warning, destructive styling

## 6. API Service Class Pattern

Location: `/apps/admin/src/services/gallery.service.ts`

```tsx
export type GalleryQueryParams = {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
};

export class GalleryService {
  async getAll(params?: GalleryQueryParams): Promise<PaginationResponse<GalleryItem>> {
    const queryString = new URLSearchParams();
    if (params?.categoryId) queryString.append("categoryId", params.categoryId);
    if (params?.search) queryString.append("search", params.search);
    if (params?.page) queryString.append("page", params.page.toString());
    if (params?.limit) queryString.append("limit", params.limit.toString());

    const response = await fetch(`${API_URL}/gallery?${queryString}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.json();
  }

  async create(data: CreateGalleryDto): Promise<GalleryItem> {
    const response = await fetch(`${API_URL}/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const galleryService = new GalleryService();
```

**Pattern**: Singleton service instance, typed params, URLSearchParams for query building

## 7. TanStack Query Hook Pattern

Location: `/apps/admin/src/hooks/api/useGallery.ts`

```tsx
export function useInfiniteGalleryItems(params: Omit<GalleryQueryParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: ["gallery", "infinite", params],
    queryFn: ({ pageParam = 1 }) => galleryService.getAll({ ...params, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!storage.get("auth_token", ""),
    staleTime: 30_000,
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGalleryDto) => galleryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery item created");
    },
    onError: () => {
      toast.error("Failed to create gallery item");
    },
  });
}
```

**Pattern**: Infinite query with initialPageParam, mutation with cache invalidation + toast

## 8. Infinite Scroll Trigger Component

Location: `/apps/admin/src/components/layout/shared/InfiniteScrollTrigger.tsx`

```tsx
export function InfiniteScrollTrigger({ hasMore, isLoading, onLoadMore }: Props) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div ref={loadMoreRef} className="py-4 text-center">
      {isLoading ? (
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
      ) : (
        <Button variant="outline" onClick={onLoadMore}>Load More</Button>
      )}
    </div>
  );
}
```

**Pattern**: Intersection Observer API with fallback button, auto-cleanup

---

## For Expense Management Implementation

**Create these components**:
1. **ExpenseFormModal** - Copy GalleryFormModal pattern (React Hook Form + Zod)
2. **ExpensesPage** - Copy GalleryPage pattern (infinite scroll + filters)
3. **ExpenseService** class - Follow GalleryService pattern
4. **useInfiniteExpenses** hook - Follow useInfiniteGalleryItems pattern
5. **ProfitChartWidget** - Use DashboardPage card pattern for dashboard integration

**UI Component Directory Structure**:
- `/apps/admin/src/components/ui/` - Base components (Dialog, Card, Button, etc.)
- `/apps/admin/src/components/layout/shared/` - Shared components (DataTable, InfiniteScrollTrigger)
- `/apps/admin/src/hooks/api/` - API query hooks
- `/apps/admin/src/services/` - API service classes
- `/apps/admin/src/pages/` - Page-level components
- `/apps/admin/src/components/expenses/` - NEW: Expense-specific components

**Key Patterns to Replicate**:
- Debounced search: 300ms
- Infinite scroll: 20 items per page
- Form validation: Zod schema
- Mutations: Invalidate queries + toast notifications
- Auth check: `!!storage.get("auth_token", "")`
- Query staleTime: 30_000ms
