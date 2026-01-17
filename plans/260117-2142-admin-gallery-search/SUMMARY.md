# Admin Gallery Search - Quick Summary

**Plan ID:** 260117-2142-admin-gallery-search
**Effort:** 15-20 minutes
**Complexity:** LOW (copy Bookings pattern)

---

## What to Build

Add search to Admin Gallery page - search by **title, description, price** within selected category.

---

## Implementation (5 Phases)

### Phase 1: Backend DTO (3 min)
**File:** `apps/api/src/modules/gallery/dto/query-gallery.dto.ts`

Add after line 49:
```typescript
@ApiPropertyOptional({
  description: 'Search across title, description, and price',
  example: 'french',
})
@IsOptional()
@IsString()
search?: string;
```

---

### Phase 2: Backend Service (5 min)
**File:** `apps/api/src/modules/gallery/gallery.service.ts`

**2.1:** Update destructuring (line 50-58):
```typescript
const {
  categoryId,
  category,
  featured,
  isActive,
  search, // ADD
  page = 1,
  limit = 10,
} = query;
```

**2.2:** Add search logic after line 76:
```typescript
if (search && search.trim()) {
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchRegex = new RegExp(escapedSearch, 'i');

  filter.$or = [
    { title: searchRegex },
    { description: searchRegex },
    { price: searchRegex },
  ];
}
```

---

### Phase 3: Frontend Service (2 min)
**File:** `apps/admin/src/services/gallery.service.ts`

**3.1:** Update type (line 13-19):
```typescript
export type GalleriesQueryParams = {
  categoryId?: string;
  featured?: boolean;
  isActive?: boolean;
  search?: string; // ADD
  limit?: number;
  page?: number;
};
```

**3.2:** Update buildQueryString (after line 109):
```typescript
if (params.search) searchParams.append("search", params.search);
```

---

### Phase 4: Frontend Hook (3 min)
**File:** `apps/admin/src/hooks/api/useGallery.ts`

**4.1:** Update destructuring (line 30):
```typescript
const { categoryId, featured, isActive, search, limit, page, ...queryOptions } =
  options || {};
```

**4.2:** Update filters (line 35):
```typescript
const filters: GalleriesQueryParams | undefined =
  categoryId || featured || isActive || search || page || limit
    ? { categoryId, featured, isActive, search, limit, page }
    : undefined;
```

---

### Phase 5: Frontend UI (5 min)
**File:** `apps/admin/src/components/gallery/gallery-items-tab.tsx`

**5.1:** Import useDebounce (line 15):
```typescript
import { useDebounce } from "@repo/utils/hooks";
```

**5.2:** Add debounced search (after line 58):
```typescript
const debouncedSearch = useDebounce(searchQuery, 300);
```

**5.3:** Update hook call (line 60):
```typescript
const { data, isLoading } = useGalleryItems({
  categoryId: activeCategory,
  search: debouncedSearch || undefined, // ADD
  limit: 100,
});
```

**5.4:** Clear search on category change (line 100):
```typescript
useEffect(() => {
  if (categories.length > 0) {
    setActiveCategory(categories[0]._id);
    setSearchQuery(""); // ADD
  }
}, [categories]);
```

**5.5:** Update placeholder (line 136):
```typescript
placeholder="Search by title, description, or price..."
```

---

## Testing

**Manual test:**
1. Open Admin Gallery page
2. Select category
3. Type "french" → Wait 300ms → See filtered results
4. Clear search → See all items in category
5. Switch category → Search cleared

**Type check:**
```bash
npm run type-check
```

---

## Files Modified

1. `apps/api/src/modules/gallery/dto/query-gallery.dto.ts` (+7 lines)
2. `apps/api/src/modules/gallery/gallery.service.ts` (+13 lines)
3. `apps/admin/src/services/gallery.service.ts` (+2 lines)
4. `apps/admin/src/hooks/api/useGallery.ts` (+2 lines)
5. `apps/admin/src/components/gallery/gallery-items-tab.tsx` (+5 lines)

**Total:** 29 lines across 5 files

---

## Key Points

✅ Same pattern as Bookings (proven safe)
✅ Regex escaping prevents ReDoS attacks
✅ 300ms debounce reduces API calls
✅ Search within selected category only
✅ Clears on category change (better UX)
✅ No MongoDB index needed (≤100 items)

---

**Full Plan:** `./plan.md`
