# Scout Report: Types & TanStack Query Patterns

Shared types and TanStack Query hook patterns for expense tracking implementation.

## 1. Type Definition Structure (`@repo/types`)

**Pagination Response Pattern**:
```typescript
export type PaginationResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
```

**Entity Type Pattern** (Service example):
```typescript
export type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: ServiceCategory;
  imageUrl?: string;
  featured?: boolean;
};

// Enum-like pattern for constants
export const ServiceCategory = {
  EXTENSIONS: 'extensions',
  MANICURE: 'manicure',
  NAIL_ART: 'nail-art',
  PEDICURE: 'pedicure',
  SPA: 'spa',
} as const;
export type ServiceCategory = (typeof ServiceCategory)[keyof typeof ServiceCategory];
```

**Booking Type Pattern**:
```typescript
export type Booking = {
  customerInfo: CustomerInfo;
  date: Date;
  id?: string;
  notes?: string;
  serviceId: string;
  status: BookingStatus;
  timeSlot: TimeSlot;
};

export const BookingStatus = {
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  CONFIRMED: "confirmed",
  PENDING: "pending",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
```

## 2. Query Keys Pattern

Location: `/apps/admin/src/hooks/api/queryKeys.ts` (inferred from usage)

**Hierarchical factory pattern**:
```typescript
export const queryKeys = {
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters?: { category?: string }) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters?: BookingsQueryParams) =>
      [...queryKeys.bookings.lists(), filters] as const,
  },
  // Pattern repeats for: gallery, banners, contacts, businessInfo
} as const;
```

**For Expenses**:
```typescript
expenses: {
  all: ['expenses'] as const,
  lists: () => [...queryKeys.expenses.all, 'list'] as const,
  list: (filters?: ExpenseQueryParams) =>
    [...queryKeys.expenses.lists(), filters] as const,
},
analytics: {
  all: ['analytics'] as const,
  profit: (params?: ProfitQueryParams) =>
    [...queryKeys.analytics.all, 'profit', params] as const,
},
```

## 3. Service Layer Pattern

**Query Params Type**:
```typescript
export type BookingsQueryParams = {
  date?: string; // ISO format: YYYY-MM-DD
  limit?: number;
  page?: number;
  search?: string;
  serviceId?: string;
  sortBy?: "date" | "createdAt" | "customerName";
  sortOrder?: "asc" | "desc";
  status?: BookingStatus;
};

export class BookingsService {
  async getAll(params?: BookingsQueryParams): Promise<PaginationResponse<Booking>> {
    const queryString = new URLSearchParams();
    if (params?.status) queryString.append("status", params.status);
    // ... build query string

    const response = await fetch(`${API_URL}/bookings?${queryString}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.json();
  }

  async getById(id: string): Promise<Booking | null> { }
  async update(id: string, data: Partial<Omit<Booking, "id">>): Promise<Booking> { }
  async updateStatus(id: string, status: BookingStatus): Promise<Booking> { }
}
```

## 4. TanStack Query Hook Patterns

**Basic Query Hook**:
```typescript
export function useBookings(options?: UseBookingsOptions) {
  const { date, limit, page, search, serviceId, sortBy, sortOrder, status, ...queryOptions } = options || {};

  const filters = status || serviceId || date || search || sortBy || sortOrder || page || limit
    ? { date, limit, page, search, serviceId, sortBy, sortOrder, status }
    : undefined;

  return useQuery({
    enabled: !!storage.get("auth_token", ""),
    queryFn: () => bookingsService.getAll(filters),
    queryKey: ["bookings", "list", filters], // Or use queryKeys.bookings.list(filters)
    staleTime: 30_000,
    ...queryOptions,
  });
}
```

**Infinite Query Hook**:
```typescript
export function useInfiniteBookings(params: Omit<BookingsQueryParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: ["bookings", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      bookingsService.getAll({ ...params, limit: 20, page: pageParam }),
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
```

**Mutation with Optimistic Update**:
```typescript
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingsService.updateStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Status updated");
    },

    onError: () => {
      toast.error("Failed to update status");
    },
  });
}
```

**Create Mutation**:
```typescript
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingDto) => bookingsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created");
    },
    onError: () => {
      toast.error("Failed to create booking");
    },
  });
}
```

## 5. Key Patterns for Expense Implementation

**Expense Type** (add to `packages/types/src/expense.ts`):
```typescript
export type Expense = {
  _id: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const ExpenseCategory = {
  SUPPLIES: 'supplies',
  MATERIALS: 'materials',
  UTILITIES: 'utilities',
  OTHER: 'other',
} as const;
export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];
```

**Analytics Type**:
```typescript
export type ProfitAnalytics = {
  revenue: number;
  expenses: number;
  profit: number;
  bookingsCount: number;
  expensesCount: number;
  chartData: ChartDataPoint[];
};

export type ChartDataPoint = {
  date: string; // "2026-02-01"
  revenue: number;
  expenses: number;
  profit: number;
};
```

**useExpenses Hook**:
```typescript
export function useInfiniteExpenses(params: Omit<ExpenseQueryParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: ["expenses", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      expenseService.getAll({ ...params, page: pageParam, limit: 20 }),
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
```

**useAnalytics Hook** (singleton pattern):
```typescript
export function useProfitAnalytics(params?: ProfitQueryParams) {
  return useQuery({
    queryKey: ["analytics", "profit", params],
    queryFn: () => analyticsService.getProfit(params),
    enabled: !!storage.get("auth_token", ""),
    staleTime: 60_000, // Longer cache for aggregated data
  });
}
```

## 6. Key Conventions

**MongoDB IDs**: Use `_id` (not `id`)

**Auth Check**: `!!storage.get("auth_token", "")`

**Toast Notifications**:
- Success: `toast.success("Message")`
- Error: `toast.error("Message")`

**Cache Management**:
- Invalidate after mutations: `queryClient.invalidateQueries({ queryKey: ["entity"] })`
- StaleTime for lists: `30_000ms` (30s)
- StaleTime for analytics: `60_000ms` (60s)

**Query Keys**:
- Use hierarchical factory pattern
- Include filters in key for proper caching
- Use `as const` for type safety

**Type Safety**:
- Merge QueryOptions generically: `...queryOptions`
- Use `Omit<T, "field">` for partial params
- Define service method return types explicitly

---

**Files to Reference**:
- `/packages/types/src/booking.ts` - Entity type structure
- `/apps/admin/src/hooks/api/useBookings.ts` - Complete hook patterns
- `/apps/admin/src/services/bookings.service.ts` - Service layer structure
