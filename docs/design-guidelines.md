# Design Guidelines - Pink Nail Salon Client Website

**Last Updated**: 2026-02-18
**Version**: 2.1.0 (Phase 5 Gallery Filtering)
**Status**: Phase 5 Complete - FilterPills component, multi-dimensional filtering, Motion animations

---

## Design System Overview

This customer-facing website uses a **warm, organic, border-based design system** with OKLCH color space for future-proof color consistency. The design emphasizes softness, femininity, and natural elegance through earth tones, serif typography, and minimal shadows.

**Design Philosophy**: Border-based (NO shadows), organic shapes, cozy aesthetic

**Browser Support**: OKLCH format supported by 93%+ modern browsers

---

## Phase 1 Documentation Structure

Phase 1 design documentation is modularized for easier navigation:

### Core Design System

1. **[Color Palette](./design/phase1-color-palette.md)** - OKLCH colors, semantic mappings, usage guidelines
2. **[Typography](./design/phase1-typography.md)** - Font families, hierarchy, responsive typography
3. **[Design Tokens](./design/phase1-design-tokens.md)** - Border radius, shadows, transitions, spacing

### Quick Reference

**Primary Colors**:
- Dusty Rose: `oklch(0.7236 0.0755 28.44)` - #D1948B
- Cream: `oklch(0.9821 0.0067 53.45)` - #FDF8F5

**Typography**:
- Headings: Playfair Display (serif, 400-700)
- Body: Be Vietnam Pro (sans, 400-700)

**Design Tokens**:
- Border radius: 12px (buttons) → 24px (cards) → 32px (sections)
- Shadows: Minimal, soft (sm/md/lg)
- Transitions: 200ms (fast) / 300ms (base) / 400ms (slow)

---

## Component Patterns

### 1. FilterPills Component ✨ PHASE 5 FILTERING PATTERN

**Location**: `/src/components/gallery/FilterPills.tsx`

**Purpose**: Reusable pill-style filter buttons with Motion animations

**Props**:

```typescript
interface FilterPillsProps {
  filters: Array<{ label: string; slug: string }>;
  onSelect: (slug: string) => void;
  selected: string;
}
```

**Usage**:

```tsx
import { FilterPills } from "@/components/gallery/FilterPills";
import { NAIL_SHAPES, NAIL_STYLES } from "@/data/filter-config";

// Nail shape filter
<FilterPills
  filters={NAIL_SHAPES}
  onSelect={setSelectedShape}
  selected={selectedShape}
/>

// Nail style filter
<FilterPills
  filters={NAIL_STYLES}
  onSelect={setSelectedStyle}
  selected={selectedStyle}
/>
```

**Features**:
- Motion animations (scale on hover/tap)
- Spring physics (stiffness: 300, damping: 30)
- Active state styling (filled primary)
- Inactive state styling (bordered outline)
- Touch-friendly sizing (min-height: 48px)
- Responsive layout (flex-wrap)
- Accessibility (keyboard navigation, focus states)

**Styling**:
- Active: `bg-primary text-primary-foreground shadow-md`
- Inactive: `border-2 border-border bg-card hover:border-primary hover:shadow-md`
- Rounded: `rounded-full`
- Padding: `px-6 py-2.5`

**Filter Configuration** (`/src/data/filter-config.ts`):

```typescript
export const NAIL_SHAPES = [
  { label: "Tất Cả", slug: "all" },
  { label: "Almond", slug: "almond" },
  { label: "Coffin", slug: "coffin" },
  { label: "Square", slug: "square" },
  { label: "Stiletto", slug: "stiletto" },
];

export const NAIL_STYLES = [
  { label: "Tất Cả", slug: "all" },
  { label: "Vẽ 3D", slug: "3d" },
  { label: "Tráng Gương", slug: "mirror" },
  { label: "Đính Đá", slug: "gem" },
  { label: "Ombre", slug: "ombre" },
];
```

**Multi-Dimensional Filtering Logic**:

Gallery filtering uses AND logic for multiple filters:

```typescript
const filters = {
  categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
  nailShape: selectedShape !== 'all' ? selectedShape : undefined,
  style: selectedStyle !== 'all' ? selectedStyle : undefined,
};
```

**Reset Functionality**:

All filters can be reset independently:

```typescript
const resetFilters = () => {
  setSelectedCategory('all');
  setSelectedShape('all');
  setSelectedStyle('all');
};
```

**Empty State Handling**:

When no items match filters, show helpful message:

```tsx
{items.length === 0 && (
  <div className="col-span-full py-16 text-center">
    <p className="text-muted-foreground">
      Không tìm thấy mẫu nail nào phù hợp
    </p>
  </div>
)}
```

---

### 2. Dialog Component ✨ STANDARD MODAL PATTERN

**Location**: `/src/components/ui/dialog.tsx`

**Usage**:

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description text here.</DialogDescription>
    </DialogHeader>
    <div>{/* Dialog content */}</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

**Features**:
- Blur backdrop (`backdrop-blur-sm`)
- Keyboard navigation (Esc to close)
- Focus trap inside dialog
- Close button in top-right corner
- Smooth open/close animations
- Accessible (ARIA labels, roles)

**Styling**:
- Max width: `max-w-lg` (512px) or `max-w-2xl` (672px) for detail modals
- Max height: `max-h-[90vh]` for scrollable content
- Border: `border-border`
- Background: `bg-card`
- Shadow: `shadow-lg`
- Rounded corners: `rounded-lg`

---

### 3. StatusBadge Component

**Location**: `/src/components/shared/StatusBadge.tsx`

**Props**:

```typescript
type StatusBadgeProps = {
  status?: "active" | "inactive";
  isPrimary?: boolean;
  variant?: "default" | "outline";
  className?: string;
};
```

**Usage**:

```tsx
import { StatusBadge } from "@/components/shared/StatusBadge";

<StatusBadge status="active" />
<StatusBadge status="inactive" variant="outline" />
<StatusBadge isPrimary />
```

**Variants**:

| Status      | Icon  | Color (default)      | Color (outline)          |
| ----------- | ----- | -------------------- | ------------------------ |
| `active`    | Check | Green bg, green text | Green border, green text |
| `inactive`  | X     | Gray bg, gray text   | Gray border, gray text   |
| `isPrimary` | Star  | Blue bg, white text  | Blue border, blue text   |

---

### 4. ImageUpload Component

**Location**: `/src/components/shared/ImageUpload.tsx`

**Props**:

```typescript
type ImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  folder: "banners" | "services" | "gallery";
  className?: string;
};
```

**Features**:
- Drag-and-drop zone
- File input click to upload
- Image preview with thumbnail
- Upload progress bar
- Replace and Remove buttons
- File validation (JPG, PNG, WebP, max 5MB)
- Firebase Storage integration
- Toast notifications (sonner)

---

### 5. VideoUpload Component

**Location**: `/src/components/shared/VideoUpload.tsx`

**Props**:

```typescript
type VideoUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  folder: "banners" | "services" | "gallery";
  className?: string;
};
```

**Features**:
- Drag-and-drop zone
- Video preview with controls
- Upload progress bar
- File validation (MP4, WebM, max 50MB)
- Firebase Storage integration

---

## Accessibility Guidelines

All components follow WCAG 2.1 AA standards:

1. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
2. **Focus States**: All interactive elements have visible focus rings (`focus-visible:ring-2 focus-visible:ring-ring`)
3. **Keyboard Navigation**: All components are keyboard accessible
4. **ARIA Labels**: Proper ARIA attributes on all interactive components
5. **Screen Reader Support**: Semantic HTML + ARIA for assistive technologies

### Focus Ring

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

---

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large screens */
```

### Mobile-First Approach

All components are designed mobile-first:

```tsx
// Mobile base styles, then scale up
<div className="text-sm md:text-base lg:text-lg">Content</div>
```

### Touch Targets

- Minimum touch target size: 44x44px (iOS/Android guidelines)
- Buttons: `h-10` (40px) default, `h-9` (36px) small, `h-11` (44px) large

---

## Animation & Transitions

### Transition Classes

```css
transition-colors  /* Color changes (200ms) */
transition-opacity /* Opacity changes */
transition-all     /* All properties */
```

**Duration**: Default 200ms (smooth, not jarring)

### Dialog Animations

```tsx
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95
```

---

## Component Composition Patterns

### Form Field Pattern

```tsx
<div className="space-y-2">
  <Label htmlFor="field">Field Label</Label>
  <Input id="field" placeholder="Enter value..." />
  <p className="text-xs text-muted-foreground">Helper text</p>
</div>
```

### Card Pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>{/* Card content */}</CardContent>
  <CardFooter>{/* Actions */}</CardFooter>
</Card>
```

### Button Group Pattern

```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Confirm</Button>
</div>
```

---

## File Validation Standards

### Image Uploads

- **Accepted types**: JPG, PNG, WebP
- **Max size**: 5MB
- **Error messages**: User-friendly, specific

### Video Uploads

- **Accepted types**: MP4, WebM
- **Max size**: 50MB
- **Error messages**: User-friendly, specific

### Validation Implementation

```typescript
const validateFile = (file: File): string | null => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Invalid file type. Please upload JPG, PNG, or WebP.";
  }
  if (file.size > MAX_SIZE) {
    return "File size exceeds 5MB. Please choose a smaller file.";
  }
  return null;
};
```

---

## Toast Notification Patterns

Using `sonner` library:

```typescript
import { toast } from "sonner";

// Success
toast.success("Image uploaded successfully!");

// Error
toast.error("Failed to upload image. Please try again.");

// Loading
toast.loading("Uploading...");

// Promise-based
toast.promise(uploadPromise, {
  loading: "Uploading...",
  success: "Upload complete!",
  error: "Upload failed.",
});
```

---

## Icon Usage

Using `lucide-react`:

```tsx
import { Check, X, Star, Upload, Trash2, ImagePlus, Video } from "lucide-react";

// Standard size
<Check className="h-4 w-4" />

// Small (badges)
<Check className="h-3 w-3" />

// Large (upload zone)
<ImagePlus className="h-8 w-8" />

// With color
<Check className="h-4 w-4 text-green-500" />
```

---

## CSS Utility Patterns

### cn() Helper

```typescript
import { cn } from "@/lib/utils";

// Merge Tailwind classes safely
<div className={cn("base-classes", condition && "conditional-classes", className)} />
```

### Conditional Styling

```tsx
className={cn(
  "base-classes",
  isDragging && "border-primary bg-primary/10",
  isLoading && "cursor-not-allowed opacity-50",
)}
```

---

## Best Practices

1. **Always use `cn()` for className merging** to avoid conflicts
2. **Use semantic HTML** (button, input, label, etc.)
3. **Follow mobile-first approach** for responsive design
4. **Add loading states** to all async operations
5. **Show error messages** clearly to users
6. **Validate user input** before processing
7. **Use toast notifications** for feedback
8. **Test keyboard navigation** on all interactive components
9. **Ensure proper ARIA labels** for accessibility
10. **Use forwardRef** for components that need refs
11. **Prefer borders over shadows** for border-based design
12. **Follow radius hierarchy** (parent > child)
13. **Use OKLCH colors** for consistency and future-proofing

---

## Future Enhancements

- [ ] Add progress component for multi-step forms
- [ ] Create DataTable component for CRUD operations
- [ ] Add skeleton loaders for async content
- [ ] Implement toast queue system
- [ ] Add dark mode toggle UI
- [ ] Create reusable form components
- [ ] Add input mask components (phone, date, etc.)
- [ ] Implement color scales (50-950) for all primary colors
- [ ] Add Motion (Framer Motion) animations
- [ ] Create organic shape components

---

**End of Design Guidelines**
