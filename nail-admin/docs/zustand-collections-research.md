# Zustand Collection Management Patterns (2025)

## 1. Store Structure

### Normalization vs Arrays

**Recommended: Hybrid Normalization**

- Use normalized map for O(1) lookups: `itemsById: Record<string, Item>`
- Maintain array of IDs for ordering: `itemIds: string[]`
- Prevents duplicate data updates from triggering unnecessary renders

```typescript
type CollectionsStore = {
  items: Record<string, Item>;
  itemIds: string[];
};
```

**Why**: Arrays require O(N) to find/update items. Maps provide O(1) access. ID array preserves view order without duplicating item data.

---

## 2. CRUD Operations with Immer Middleware

**Setup**:

```typescript
import { create } from "zustand";
import { immer } from "zustand/middleware";

export const useItemsStore = create<Store>()(
  immer((set) => ({
    items: {},
    itemIds: [],

    // ADD
    add: (item: Item) =>
      set((state) => {
        state.items[item.id] = item;
        state.itemIds.push(item.id);
      }),

    // UPDATE
    update: (id: string, data: Partial<Item>) =>
      set((state) => {
        if (state.items[id]) {
          Object.assign(state.items[id], data);
        }
      }),

    // DELETE
    delete: (id: string) =>
      set((state) => {
        delete state.items[id];
        state.itemIds = state.itemIds.filter((iid) => iid !== id);
      }),

    // BULK
    addMany: (items: Item[]) =>
      set((state) => {
        items.forEach((item) => {
          state.items[item.id] = item;
          state.itemIds.push(item.id);
        });
      }),
  })),
);
```

**Immer Benefits**: Mutate "draft" state directly—no spread operators needed. Handles nested updates efficiently.

**Middleware Order**: Use `devtools(immer(...))` not `immer(devtools(...))` to preserve type safety.

---

## 3. Filtering & Search with Selectors

**Pattern: Separate Action from State**

```typescript
// ✅ Efficient: Only components using filtered data re-render
const useVisibleItems = () => {
  const items = useItemsStore((s) => s.items);
  const itemIds = useItemsStore((s) => s.itemIds);
  const filters = useItemsStore((s) => s.filters);

  return useMemo(
    () =>
      itemIds
        .map((id) => items[id])
        .filter((item) => matchesFilters(item, filters)),
    [items, itemIds, filters],
  );
};

// ❌ Inefficient: Re-renders on ANY state change
const useVisibleItems = () => useItemsStore();
```

**Client-Side Filtering**:

- Store filters separately: `filters: { category: string; status: string; search: string }`
- Compute derived state in selectors (not store mutations)
- TanStack Query for server-side filtering with pagination

---

## 4. Performance Optimization

### Selector Memoization

- **Zustand v4+**: No longer requires manual memoization (uses `useSyncExternalStore`)
- Use atomic selectors: separate hooks per state slice
- Avoid object creation in selectors—return stable references

```typescript
// ✅ Stable
const useItemCount = () => useItemsStore((s) => s.itemIds.length);

// ⚠️ Unstable (new object every render)
const useItem = (id: string) =>
  useItemsStore((s) => ({ item: s.items[id] }));

// ✅ Use reselect for complex transformations
import { createSelector } from 'reselect';
const selectVisibleItems = createSelector(
  (s) => s.items,
  (s) => s.itemIds,
  (s) => s.filters,
  (items, ids, filters) => ids.map(id => items[id]).filter(...)
);
```

### Batch Updates

```typescript
// Single transaction
useItemsStore.setState((state) => {
  state.items[id1].status = "active";
  state.items[id2].status = "active";
});
```

---

## 5. TypeScript Type-Safe Patterns

**Complete Typed Example**:

```typescript
import type { StateCreator } from "zustand";

interface Item {
  id: string;
  name: string;
  status: "active" | "inactive";
}

interface CollectionsStore {
  items: Record<string, Item>;
  itemIds: string[];
  filters: { search: string; status?: Item["status"] };

  add: (item: Item) => void;
  update: (id: string, data: Partial<Item>) => void;
  delete: (id: string) => void;
  setFilter: (filters: Partial<CollectionsStore["filters"]>) => void;
}

// ✅ Use `type` imports for verbatimModuleSyntax: true
import type { StateCreator } from "zustand";

export const useStore = create<CollectionsStore>()(
  immer((set) => ({
    items: {},
    itemIds: [],
    filters: { search: "" },

    add: (item) =>
      set((state) => {
        state.items[item.id] = item;
        state.itemIds.push(item.id);
      }),

    setFilter: (filters) =>
      set((state) => {
        state.filters = { ...state.filters, ...filters };
      }),
  })),
);
```

---

## 6. Advanced: Sliced Stores

For large apps, split concerns:

```typescript
const createItemsSlice: StateCreator<Store, [["zustand/immer", never]]> = (
  set,
) => ({
  items: {},
  addItem: (item) =>
    set((state) => {
      state.items[item.id] = item;
    }),
});

const createFiltersSlice: StateCreator<Store, [["zustand/immer", never]]> = (
  set,
) => ({
  filters: {},
  setFilter: (f) =>
    set((state) => {
      state.filters = f;
    }),
});

export const useStore = create<Store>()(
  immer((...args) => ({
    ...createItemsSlice(...args),
    ...createFiltersSlice(...args),
  })),
);
```

---

## Key Takeaways

1. **Normalize collections** with maps + ID arrays for O(1) performance
2. **Use Immer middleware** for clean mutation-based updates
3. **Separate selectors** for each component need (no full store access)
4. **Compute filters in selectors**, not mutations
5. **Keep stores small**—multiple focused stores beat one monolith
6. **Type everything**—use `type` imports with `verbatimModuleSyntax: true`

---

## References

- [TkDodo's Working with Zustand](https://tkdodo.eu/blog/working-with-zustand)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Normalization Best Practices](https://dev.to/it-wibrc/beyond-the-array-why-normalized-maps-and-sets-supercharge-your-frontend-performance-12k9)
- [Medium: Mastering Zustand with TypeScript (Oct 2025)](https://medium.com/@Shantanupokale/mastering-zustand-with-typescript-from-basics-to-advanced-0624c28ba44f)
- [Zustand CRUD Tutorials (2025)](https://www.ninjamonk.in/blog/simplifying-state-management-implementing-crud-in-react-js-using-zustand/)
