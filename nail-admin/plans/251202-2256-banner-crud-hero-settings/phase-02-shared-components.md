# Phase 2: Shared Components

**Date**: 2025-12-02
**Priority**: P0 (Foundation)
**Status**: 🔴 Not Started
**Estimate**: 4-5 hours

## Context

**Related Files**:

- `src/components/ui/button.tsx` (existing)
- `src/components/ui/input.tsx` (existing)
- `src/components/ui/card.tsx` (existing)
- `src/services/imageUpload.service.ts` (existing)

**Dependencies**: Phase 1 (types and services)

## Overview

Build reusable components for data display (DataTable), user interactions (Dialog), and media uploads (ImageUpload, VideoUpload). These components will be used across all CRUD pages in the admin dashboard.

## Key Insights

- TanStack Table v8 for data tables (powerful, flexible, type-safe)
- Radix UI Dialog for modals (accessible, composable)
- Firebase Storage integration for uploads (already configured)
- shadcn/ui pattern: composition over configuration
- Progress feedback during uploads (onProgress callback)
- File validation before upload (client-side validation)

## Requirements

### DataTable Component

**Features**:

- Column configuration (header, accessor, cell renderer)
- Sorting (client-side for mock data)
- Row selection (optional, for bulk actions)
- Custom cell renderers (status badges, actions menu)
- Empty state message
- Loading skeleton
- Pagination (future enhancement)

### Dialog Component

**Features**:

- Radix UI Dialog primitive
- Title + description
- Content area (form container)
- Footer with actions (cancel/submit buttons)
- Close on backdrop click (configurable)
- Keyboard shortcuts (Escape to close)

### ImageUpload Component

**Features**:

- File input with preview
- Drag-and-drop support
- Upload progress bar
- Firebase Storage integration
- File validation (type, size)
- Delete uploaded image
- Replace image

### VideoUpload Component

**Features**:

- Same as ImageUpload but for video files
- Video preview (HTML5 video player)
- File size validation (max 50MB)
- Format validation (MP4/WebM only)

### StatusBadge Component

**Features**:

- Color-coded badges (active/inactive, primary/secondary)
- Size variants (sm, md, lg)
- Icon support (optional)

## Architecture Decisions

### DataTable: TanStack Table vs Simple Table

**Decision**: Use TanStack Table v8
**Rationale**:

- Type-safe column definitions
- Built-in sorting, filtering, pagination
- Headless UI (style with shadcn/ui)
- Future-proof for advanced features (row selection, infinite scroll)

### Dialog: Radix vs Custom Modal

**Decision**: Use Radix UI Dialog
**Rationale**:

- Accessibility built-in (focus trap, ARIA attributes)
- Portal rendering (avoids z-index issues)
- Keyboard navigation
- Animation support
- Follows shadcn/ui pattern

### Upload: Separate Image/Video Components vs Unified

**Decision**: Separate components, shared logic
**Rationale**:

- Different preview UIs (img vs video tag)
- Different validation rules (size, format)
- Clearer component API

## Related Code Files

### Files to Create

1. **src/components/shared/DataTable.tsx** - Generic data table
2. **src/components/ui/dialog.tsx** - Dialog primitive wrapper
3. **src/components/shared/ImageUpload.tsx** - Image upload with preview
4. **src/components/shared/VideoUpload.tsx** - Video upload with preview
5. **src/components/shared/StatusBadge.tsx** - Status badge component

### Files to Reference

1. `src/services/imageUpload.service.ts` - Upload service
2. `src/components/ui/button.tsx` - Button component
3. `src/components/ui/input.tsx` - Input component
4. `src/lib/utils.ts` - cn() utility

## Implementation Steps

### Step 1: Create Dialog Component

**File**: `src/components/ui/dialog.tsx`

```typescript
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

### Step 2: Create DataTable Component

**File**: `src/components/shared/DataTable.tsx`

```typescript
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No data available",
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-md border border-border">
        <div className="p-8 text-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Sortable column header helper
export function SortableHeader({ column, children }: { column: any; children: React.ReactNode }) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-4 h-auto p-2 hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
```

### Step 3: Create StatusBadge Component

**File**: `src/components/shared/StatusBadge.tsx`

```typescript
import { cn } from "@/lib/utils";

type BadgeVariant = "active" | "inactive" | "primary" | "secondary";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-border",
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
```

### Step 4: Create ImageUpload Component

**File**: `src/components/shared/ImageUpload.tsx`

```typescript
import * as React from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { imageUploadService } from "@/services/imageUpload.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: "banners" | "services" | "gallery";
  maxSizeMB?: number;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "banners",
  maxSizeMB = 5,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`Image must be less than ${maxSizeMB}MB`);
      return;
    }

    setError("");
    setIsUploading(true);
    setProgress(0);

    try {
      const url = await imageUploadService.uploadImage(
        file,
        folder,
        setProgress
      );
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      await imageUploadService.deleteImage(value);
      onRemove?.();
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value && !isUploading ? (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="h-48 w-full rounded-lg object-cover border border-border"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "h-48 w-full rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors flex flex-col items-center justify-center gap-2",
            isUploading && "cursor-not-allowed opacity-50"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Uploading... {Math.round(progress)}%
              </span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
              <span className="text-xs text-muted-foreground">
                Max size: {maxSizeMB}MB
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

### Step 5: Create VideoUpload Component

**File**: `src/components/shared/VideoUpload.tsx`

```typescript
import * as React from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { imageUploadService } from "@/services/imageUpload.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function VideoUpload({
  value,
  onChange,
  onRemove,
  className,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["video/mp4", "video/webm"];
    if (!validTypes.includes(file.type)) {
      setError("Only MP4 and WebM videos are supported");
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Video must be less than 50MB");
      return;
    }

    setError("");
    setIsUploading(true);
    setProgress(0);

    try {
      const url = await imageUploadService.uploadVideo(
        file,
        "banners",
        setProgress
      );
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      await imageUploadService.deleteImage(value);
      onRemove?.();
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value && !isUploading ? (
        <div className="relative group">
          <video
            src={value}
            controls
            className="h-48 w-full rounded-lg object-cover border border-border"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "h-48 w-full rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors flex flex-col items-center justify-center gap-2",
            isUploading && "cursor-not-allowed opacity-50"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Uploading... {Math.round(progress)}%
              </span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload video
              </span>
              <span className="text-xs text-muted-foreground">
                MP4 or WebM, max 50MB
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

## Todo List

- [ ] Create Dialog component with Radix UI
- [ ] Create DataTable component with TanStack Table
- [ ] Create StatusBadge component
- [ ] Create ImageUpload component with Firebase integration
- [ ] Create VideoUpload component
- [ ] Add uploadVideo method to imageUpload.service.ts
- [ ] Test Dialog open/close animations
- [ ] Test DataTable sorting
- [ ] Test ImageUpload file validation and progress
- [ ] Test VideoUpload with large files
- [ ] Verify all components use shadcn/ui theme colors

## Success Criteria

- [ ] Dialog component accessible (keyboard navigation, focus trap)
- [ ] DataTable displays data with sorting
- [ ] StatusBadge renders with correct colors for each variant
- [ ] ImageUpload validates file type and size
- [ ] ImageUpload shows upload progress
- [ ] VideoUpload supports MP4 and WebM only
- [ ] VideoUpload enforces 50MB limit
- [ ] All components use TypeScript strict mode
- [ ] All components follow shadcn/ui styling patterns

## Risk Assessment

**Medium Risk**:

- File upload progress tracking (Firebase API complexity)
- Video file size limits (may need backend compression)

**Low Risk**:

- Dialog component (Radix UI well-documented)
- DataTable (TanStack Table stable API)

## Security Considerations

- Client-side file validation (type, size) before upload
- Firebase Storage rules should enforce server-side validation
- Sanitize file names (avoid path traversal)
- CORS configuration for Firebase Storage

## Next Steps

After Phase 2 completion:

1. Proceed to Phase 3: Build BannersPage with CRUD UI
2. Test all components in isolation (Storybook-style testing)
3. Document component APIs and usage examples
