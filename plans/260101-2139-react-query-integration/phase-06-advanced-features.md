# Phase 6: Advanced Features

**Priority**: P3 (Optional)
**Blockers**: Phase 5 complete
**Estimated Time**: 2-3 hours

---

## Overview

Optional enhancements: prefetching, polling, offline support. Implement based on business needs.

---

## Features

### 1. Prefetching (Admin)
**When**: User hovers over list item, prefetch detail page
**Time**: 30 minutes

```typescript
function ServiceListItem({ service }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.services.detail(service.id),
      queryFn: () => servicesService.getById(service.id),
      staleTime: 60_000, // 1min
    });
  };

  return <div onMouseEnter={handleMouseEnter}>...</div>;
}
```

### 2. Polling (Admin Dashboard)
**When**: Dashboard needs real-time booking updates
**Time**: 30 minutes

```typescript
function Dashboard() {
  const { data: bookings } = useBookings({
    refetchInterval: 30_000, // Poll every 30s
  });
}
```

### 3. Offline Support (Admin - Optional)
**When**: Admin needs to work offline
**Time**: 60 minutes

```bash
npm install @tanstack/react-query-persist-client
```

---

## Testing
- [ ] Prefetching improves perceived performance
- [ ] Polling updates data automatically
- [ ] Offline support works (if implemented)

---

## Success Criteria
- [x] Advanced features implemented based on needs
- [x] Performance monitored
- [x] No negative impact on UX
