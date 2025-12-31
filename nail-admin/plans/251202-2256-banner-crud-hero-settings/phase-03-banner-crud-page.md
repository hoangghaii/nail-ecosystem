# Phase 3: Banner CRUD Page

**Date**: 2025-12-02
**Priority**: P0 (Core Feature)
**Status**: 🔴 Not Started
**Estimate**: 5-6 hours

## Context

**Related Files**:

- `src/pages/DashboardPage.tsx` (existing page example)
- `src/components/layout/Layout.tsx` (existing layout)
- `src/App.tsx` (router configuration)
- Phase 1: Banner types and services
- Phase 2: Shared components (DataTable, Dialog, ImageUpload)

**Dependencies**: Phase 1, Phase 2

## Overview

Build complete banner management page with data table, create/edit modals, delete confirmations, drag-drop reordering, and active/primary toggles. This is the first full CRUD implementation in the admin dashboard.

## Key Insights

- HTML5 Drag API for reordering (lightweight, no external library)
- Modal state management (create vs edit mode)
- Form state with React Hook Form + Zod validation
- Optimistic UI updates (instant feedback)
- Toast notifications for success/error (Sonner)
- Empty state for first-time users

## Requirements

### Page Layout

```
┌─────────────────────────────────────────────────┐
│ Banners                                  [+ New]│
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ Title   │ Image │ Active │ Primary │ Actions│ │
│ ├─────────────────────────────────────────────┤ │
│ │ Summer  │ 🖼️    │ ✅     │ ⭐      │ ⋮      │ │
│ │ Promo   │ 🖼️    │ ✅     │         │ ⋮      │ │
│ │ Holiday │ 🖼️    │ ❌     │         │ ⋮      │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Data Table Columns

1. **Drag Handle** - Icon for reordering
2. **Image** - Thumbnail preview (48x48)
3. **Title** - Banner title
4. **Description** - Truncated description (max 50 chars)
5. **Active** - Status badge (Active/Inactive)
6. **Primary** - Badge (Primary/Not Primary)
7. **Actions** - Dropdown menu (Edit, Delete, Set Primary)

### Create/Edit Modal

**Fields**:

- Title (required, max 100 chars)
- Description (optional, max 500 chars)
- Image Upload (required)
- Video Upload (optional)
- CTA Text (optional, max 50 chars)
- CTA Link (optional, URL validation)
- Active (checkbox, default: true)
- Primary (checkbox, default: false)

**Validation**:

- Title: Required, 1-100 chars
- Description: Max 500 chars
- Image: Required (unless editing and already has image)
- Video: Optional, MP4/WebM only, max 50MB
- CTA Link: Valid URL format if provided

### Actions Menu

- **Edit** - Open edit modal with pre-filled data
- **Set Primary** - Make this banner primary (unset others)
- **Delete** - Confirm deletion dialog

### Reordering

- Drag handle icon (⋮⋮) on each row
- Drag row to new position
- Update sortIndex on drop
- Visual feedback during drag (highlight drop zone)

## Architecture Decisions

### Drag-and-Drop: HTML5 API vs Library

**Decision**: Use HTML5 Drag API for Phase 1
**Rationale**:

- No external dependencies (keep bundle small)
- Simple reordering use case (not complex drag scenarios)
- Can upgrade to library later if needed (react-beautiful-dnd, dnd-kit)

**Trade-off**: Less polished mobile experience (acceptable for admin dashboard)

### Form State: Single Modal vs Separate Create/Edit

**Decision**: Single modal with mode prop ('create' | 'edit')
**Rationale**:

- DRY principle (shared form logic)
- Consistent UX
- Easier to maintain

### Optimistic Updates: Yes or No

**Decision**: Use optimistic updates for toggles (active, primary)
**Rationale**:

- Instant feedback (better UX)
- Mock API is fast, so rollback unlikely
- Real API should be fast enough for toggles

**Trade-off**: Need rollback logic for API failures

## Related Code Files

### Files to Create

1. **src/pages/BannersPage.tsx** - Main page component
2. **src/components/banners/BannerFormModal.tsx** - Create/edit modal
3. **src/components/banners/BannerTableRow.tsx** - Draggable table row
4. **src/components/banners/DeleteBannerDialog.tsx** - Delete confirmation

### Files to Reference

1. `src/services/banners.service.ts` (Phase 1)
2. `src/components/shared/DataTable.tsx` (Phase 2)
3. `src/components/ui/dialog.tsx` (Phase 2)
4. `src/components/shared/ImageUpload.tsx` (Phase 2)

## Implementation Steps

### Step 1: Create Banner Form Modal

**File**: `src/components/banners/BannerFormModal.tsx`

```typescript
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import type { Banner } from "@/types/banner.types";
import { bannersService } from "@/services/banners.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { VideoUpload } from "@/components/shared/VideoUpload";

const bannerFormSchema = z.object({
  title: z.string().min(1, "Title required").max(100, "Max 100 characters"),
  description: z.string().max(500, "Max 500 characters").optional(),
  imageUrl: z.string().url("Invalid image URL"),
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  ctaText: z.string().max(50, "Max 50 characters").optional(),
  ctaLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
  isPrimary: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerFormSchema>;

interface BannerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
  onSuccess: () => void;
}

export function BannerFormModal({
  open,
  onOpenChange,
  banner,
  onSuccess,
}: BannerFormModalProps) {
  const isEdit = !!banner;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: banner
      ? {
          title: banner.title,
          description: banner.description || "",
          imageUrl: banner.imageUrl,
          videoUrl: banner.videoUrl || "",
          ctaText: banner.ctaText || "",
          ctaLink: banner.ctaLink || "",
          isActive: banner.isActive,
          isPrimary: banner.isPrimary,
        }
      : {
          title: "",
          description: "",
          imageUrl: "",
          videoUrl: "",
          ctaText: "",
          ctaLink: "",
          isActive: true,
          isPrimary: false,
        },
  });

  const imageUrl = watch("imageUrl");
  const videoUrl = watch("videoUrl");

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await bannersService.update(banner.id, data);
        toast.success("Banner updated successfully");
      } else {
        const sortIndex = 0; // Will be set by service
        await bannersService.create({ ...data, sortIndex });
        toast.success("Banner created successfully");
      }
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Banner" : "Create Banner"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Summer Sale Banner"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Describe your banner..."
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label>Banner Image *</Label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue("imageUrl", url)}
              onRemove={() => setValue("imageUrl", "")}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div>
            <Label>Banner Video (Optional)</Label>
            <VideoUpload
              value={videoUrl}
              onChange={(url) => setValue("videoUrl", url)}
              onRemove={() => setValue("videoUrl", "")}
            />
            {errors.videoUrl && (
              <p className="text-sm text-destructive mt-1">
                {errors.videoUrl.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input
                id="ctaText"
                {...register("ctaText")}
                placeholder="Book Now"
              />
              {errors.ctaText && (
                <p className="text-sm text-destructive mt-1">
                  {errors.ctaText.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="ctaLink">CTA Button Link</Label>
              <Input
                id="ctaLink"
                {...register("ctaLink")}
                placeholder="https://example.com/booking"
              />
              {errors.ctaLink && (
                <p className="text-sm text-destructive mt-1">
                  {errors.ctaLink.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isActive")} />
              <span className="text-sm">Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isPrimary")} />
              <span className="text-sm">Primary Banner</span>
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 2: Create Delete Confirmation Dialog

**File**: `src/components/banners/DeleteBannerDialog.tsx`

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  bannerTitle: string;
}

export function DeleteBannerDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  bannerTitle,
}: DeleteBannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Banner</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{bannerTitle}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 3: Create Banners Page

**File**: `src/pages/BannersPage.tsx`

```typescript
import * as React from "react";
import { Plus, GripVertical, MoreVertical, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import type { Banner } from "@/types/banner.types";
import { bannersService } from "@/services/banners.service";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BannerFormModal } from "@/components/banners/BannerFormModal";
import { DeleteBannerDialog } from "@/components/banners/DeleteBannerDialog";

export default function BannersPage() {
  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [formModal, setFormModal] = React.useState<{
    open: boolean;
    banner: Banner | null;
  }>({ open: false, banner: null });
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    banner: Banner | null;
  }>({ open: false, banner: null });
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const fetchBanners = React.useCallback(async () => {
    try {
      const data = await bannersService.getAll();
      setBanners(data);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = async () => {
    if (!deleteDialog.banner) return;

    setIsDeleting(true);
    try {
      await bannersService.delete(deleteDialog.banner.id);
      toast.success("Banner deleted successfully");
      setDeleteDialog({ open: false, banner: null });
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await bannersService.setPrimary(id);
      toast.success("Primary banner updated");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to set primary banner");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newBanners = [...banners];
    const draggedBanner = newBanners[draggedIndex];
    newBanners.splice(draggedIndex, 1);
    newBanners.splice(index, 0, draggedBanner);

    setBanners(newBanners);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    try {
      const ids = banners.map((b) => b.id);
      await bannersService.reorder(ids);
      toast.success("Banner order updated");
    } catch (error) {
      toast.error("Failed to update order");
      fetchBanners(); // Revert on error
    } finally {
      setDraggedIndex(null);
    }
  };

  const columns: ColumnDef<Banner>[] = [
    {
      id: "drag",
      header: "",
      cell: ({ row }) => (
        <div
          className="cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={() => handleDragStart(row.index)}
          onDragOver={(e) => handleDragOver(e, row.index)}
          onDragEnd={handleDragEnd}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      ),
    },
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.imageUrl}
          alt={row.original.title}
          className="h-12 w-12 rounded object-cover"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const desc = row.original.description || "";
        return (
          <span className="text-muted-foreground">
            {desc.length > 50 ? desc.slice(0, 50) + "..." : desc}
          </span>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge variant={row.original.isActive ? "active" : "inactive"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "isPrimary",
      header: "Primary",
      cell: ({ row }) =>
        row.original.isPrimary ? (
          <StatusBadge variant="primary">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Primary
          </StatusBadge>
        ) : null,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                setFormModal({ open: true, banner: row.original })
              }
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {!row.original.isPrimary && (
              <DropdownMenuItem
                onClick={() => handleSetPrimary(row.original.id)}
              >
                <Star className="h-4 w-4 mr-2" />
                Set as Primary
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                setDeleteDialog({ open: true, banner: row.original })
              }
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground mt-1">
            Manage hero section banners for your website
          </p>
        </div>
        <Button onClick={() => setFormModal({ open: true, banner: null })}>
          <Plus className="h-4 w-4 mr-2" />
          New Banner
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={banners}
        isLoading={isLoading}
        emptyMessage="No banners yet. Create your first banner to get started."
      />

      <BannerFormModal
        open={formModal.open}
        onOpenChange={(open) =>
          setFormModal({ open, banner: open ? formModal.banner : null })
        }
        banner={formModal.banner}
        onSuccess={fetchBanners}
      />

      <DeleteBannerDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, banner: open ? deleteDialog.banner : null })
        }
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        bannerTitle={deleteDialog.banner?.title || ""}
      />
    </div>
  );
}
```

### Step 4: Add Route in App.tsx

**File**: `src/App.tsx` (modify)

```typescript
import BannersPage from "@/pages/BannersPage";

// Inside <ProtectedRoute>
<Route path="/banners" element={<BannersPage />} />
```

### Step 5: Add Navigation Item

**File**: `src/components/layout/Sidebar.tsx` (modify)

Add to navigation items:

```typescript
{
  name: "Banners",
  href: "/banners",
  icon: Image, // Import from lucide-react
}
```

## Todo List

- [ ] Create BannerFormModal component
- [ ] Create DeleteBannerDialog component
- [ ] Create BannersPage with data table
- [ ] Implement drag-and-drop reordering
- [ ] Add route in App.tsx
- [ ] Add navigation item in Sidebar
- [ ] Test create banner flow
- [ ] Test edit banner flow
- [ ] Test delete banner with confirmation
- [ ] Test drag-and-drop on desktop
- [ ] Test primary banner toggle
- [ ] Test form validation errors
- [ ] Test empty state display

## Success Criteria

- [ ] Can create banner with image upload
- [ ] Can edit existing banner (pre-fills form)
- [ ] Can delete banner with confirmation
- [ ] Drag-drop reordering updates sortIndex
- [ ] Primary banner badge displays correctly
- [ ] Active/Inactive status shows with correct colors
- [ ] Form validation prevents invalid submissions
- [ ] Toast notifications show on success/error
- [ ] Empty state displays when no banners
- [ ] Page responsive on mobile/tablet/desktop

## Risk Assessment

**High Risk**:

- Drag-and-drop UX on touch devices (HTML5 API limitations)

**Medium Risk**:

- Form modal complexity (many fields, uploads)
- Optimistic updates rollback (if reorder fails)

**Low Risk**:

- Data table rendering (TanStack Table stable)
- Delete confirmation (simple dialog)

## Security Considerations

- Validate all form inputs (Zod schema)
- Prevent deletion of primary banner (show warning)
- Sanitize user input (React escapes by default)
- File upload validation (client + server-side)

## Next Steps

After Phase 3 completion:

1. Proceed to Phase 4: Build Hero Settings component
2. Test full banner CRUD workflow
3. Gather user feedback on drag-drop UX
4. Consider mobile-optimized reordering (touch-friendly)
