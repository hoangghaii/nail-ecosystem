# Phase 04 — Admin: Nail Options Management Pages

**Date:** 2026-02-19
**Status:** pending — depends on Phase 03

---

## Objective

Add admin pages to manage nail shapes and nail styles. Follow the exact same pattern as the existing gallery categories tab (`gallery-categories-tab.tsx`, `CategoryFormModal.tsx`, `DeleteCategoryDialog.tsx`).

---

## Files to Create

```
apps/admin/src/services/nailOptions.service.ts         [CREATE]
apps/admin/src/hooks/api/useNailOptions.ts             [CREATE]
apps/admin/src/components/nail-options/
├── nail-options-tab.tsx                               [CREATE]
├── nail-option-form-modal.tsx                         [CREATE]
└── delete-nail-option-dialog.tsx                      [CREATE]
apps/admin/src/pages/NailOptionsPage.tsx               [CREATE]
```

## Files to Modify

```
apps/admin/src/App.tsx                    [modify] — add route /nail-options
apps/admin/src/components/layout/Sidebar.tsx  [modify] — add nav entry
```

---

## Service

`apps/admin/src/services/nailOptions.service.ts`

Pattern: mirrors `galleryCategory.service.ts` exactly.

```typescript
// Two service instances sharing same shape
class NailOptionService {
  constructor(private readonly basePath: string) {}

  async getAll(): Promise<PaginationResponse<NailShapeItem | NailStyleItem>> { ... }
  async create(data: CreateNailOptionDto): Promise<...> { ... }
  async update(id: string, data: UpdateNailOptionDto): Promise<...> { ... }
  async delete(id: string): Promise<void> { ... }
}

export const nailShapesService = new NailOptionService('/nail-shapes');
export const nailStylesService = new NailOptionService('/nail-styles');
```

---

## React Query Hooks

`apps/admin/src/hooks/api/useNailOptions.ts`

Export hooks:
- `useNailShapes()` — GET `/nail-shapes`
- `useNailStyles()` — GET `/nail-styles`
- `useCreateNailShape()` / `useCreateNailStyle()`
- `useUpdateNailShape()` / `useUpdateNailStyle()`
- `useDeleteNailShape()` / `useDeleteNailStyle()`

Add query keys to `packages/utils/src/api/queryKeys.ts`:
```typescript
nailShapes: {
  all: ['nail-shapes'] as const,
  lists: () => [...queryKeys.nailShapes.all, 'list'] as const,
},
nailStyles: {
  all: ['nail-styles'] as const,
  lists: () => [...queryKeys.nailStyles.all, 'list'] as const,
},
```

---

## UI Components

### `nail-options-tab.tsx`

Single component that renders a table of nail options (shape or style) with:
- Columns: Value, Label (EN), Label (VI), Sort Index, Active, Actions
- Actions: Edit, Delete
- Empty state with "Add first option" button

Props:
```typescript
type NailOptionsTabProps = {
  items: NailShapeItem[] | NailStyleItem[];
  isLoading: boolean;
  onEdit: (item: NailShapeItem | NailStyleItem) => void;
  onDelete: (item: NailShapeItem | NailStyleItem) => void;
  onCreate: () => void;
};
```

### `nail-option-form-modal.tsx`

Dialog with fields: `value` (text, required), `label` (text, required), `labelVi` (text, required), `sortIndex` (number), `isActive` (switch).

Zod schema:
```typescript
const schema = z.object({
  value: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  label: z.string().min(1).max(50),
  labelVi: z.string().min(1).max(50),
  sortIndex: z.number().default(0),
  isActive: z.boolean().default(true),
});
```

### `delete-nail-option-dialog.tsx`

Simple confirmation dialog — same pattern as `DeleteCategoryDialog.tsx`.

---

## Page

`apps/admin/src/pages/NailOptionsPage.tsx`

Uses `Tabs` component with two tabs: "Nail Shapes" and "Nail Styles".

```tsx
<Tabs defaultValue="shapes">
  <TabsList>
    <TabsTrigger value="shapes">Nail Shapes</TabsTrigger>
    <TabsTrigger value="styles">Nail Styles</TabsTrigger>
  </TabsList>
  <TabsContent value="shapes">
    <NailOptionsTab items={shapes} ... />
  </TabsContent>
  <TabsContent value="styles">
    <NailOptionsTab items={styles} ... />
  </TabsContent>
</Tabs>
```

---

## Routing + Navigation

`apps/admin/src/App.tsx` — add route:
```tsx
<Route path="/nail-options" element={<NailOptionsPage />} />
```

`apps/admin/src/components/layout/Sidebar.tsx` — add nav item:
```typescript
{ icon: Palette, label: "Nail Options", to: "/nail-options" },
```
Import `Palette` from `lucide-react`.

---

## Todo List

- [ ] Add `nailShapes`/`nailStyles` to `packages/utils/src/api/queryKeys.ts`
- [ ] Create `nailOptions.service.ts`
- [ ] Create `useNailOptions.ts` hooks
- [ ] Create `nail-options-tab.tsx`
- [ ] Create `nail-option-form-modal.tsx`
- [ ] Create `delete-nail-option-dialog.tsx`
- [ ] Create `NailOptionsPage.tsx`
- [ ] Add route in `App.tsx`
- [ ] Add sidebar nav entry in `Sidebar.tsx`
- [ ] Verify admin can create/edit/delete shapes and styles

---

## Success Criteria

- `/nail-options` page renders with two tabs
- Can create, edit, delete nail shapes and styles
- Changes persist to MongoDB via API
- Sidebar shows "Nail Options" link, active state works
