# Phase 4: Admin UI Components

## 🎯 Goal
Create reusable modal components for category create/edit/delete operations.

## 📦 Tasks

### 4.1 Create CategoryFormModal

**File**: `apps/admin/src/components/gallery/CategoryFormModal.tsx`

**Pattern**: Follow `BannerFormModal.tsx` structure

**Features**:
- **Create vs Edit Mode**: Detects based on `category` prop
- **Form Validation**: Zod schema + React Hook Form
- **Auto-Slug Preview**: Read-only slug generated from name (create mode only)
- **Fields**: name, description, isActive (switch)
- **Loading States**: Disabled submit during mutation
- **Cleanup**: Reset form on modal close

**Schema**:
```typescript
const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  description: z.string().optional(),
  isActive: z.boolean(),
});
```

**Slug Preview Logic**:
```typescript
const slugPreview = useMemo(() => {
  const name = form.watch("name");
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}, [form.watch("name")]);
```

**Complete code in plan.md**

### 4.2 Create DeleteCategoryDialog

**File**: `apps/admin/src/components/gallery/DeleteCategoryDialog.tsx`

**Pattern**: Follow `DeleteBannerDialog.tsx` structure

**Features**:
- **AlertDialog** (destructive action pattern)
- **Category Preview**: Show name, description, slug before deletion
- **Protection Warning**: Message about categories in use
- **Loading State**: Disabled delete button during mutation
- **Error Handling**: Specific toast for protection errors

**Protection Warning**:
```tsx
<div className="rounded-lg border-l-4 border-destructive bg-destructive/10 p-3">
  <p className="text-sm font-medium text-destructive">⚠️ Warning</p>
  <p className="mt-1 text-sm text-muted-foreground">
    If this category is assigned to any gallery items, deletion will
    fail. Make sure to reassign items to another category first.
  </p>
</div>
```

**Complete code in plan.md**

### 4.3 Update Component Exports

**File**: `apps/admin/src/components/gallery/index.ts`

Add exports:
```typescript
export * from "./CategoryFormModal";
export * from "./DeleteCategoryDialog";
```

## 🔑 UI Components Used

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`
- `Input`, `Textarea`, `Switch`
- `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`
- `Button` (variant: outline, destructive)

## ✅ Verification

1. Type-check:
```bash
cd apps/admin
npm run type-check
```

2. Visual verification (after integration):
- Create modal opens with empty form
- Edit modal pre-fills with category data
- Slug preview updates as name changes
- Delete dialog shows category details
- All forms validate correctly

## 📁 Files Modified

- `apps/admin/src/components/gallery/CategoryFormModal.tsx` (NEW)
- `apps/admin/src/components/gallery/DeleteCategoryDialog.tsx` (NEW)
- `apps/admin/src/components/gallery/index.ts` (UPDATED)

## ⏭️ Next Phase

Phase 5: Admin GalleryPage Integration
