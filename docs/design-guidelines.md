# Design Guidelines - Pink Nail Admin Dashboard

**Last Updated**: 2025-12-03
**Version**: 1.0.0

## Design System Overview

This admin dashboard uses the **shadcn/ui blue theme design system** with a professional, clean aesthetic. All components follow Radix UI accessibility standards and use OKLCH color space for consistent theming.

---

## Color Palette

### Light Mode

```css
--primary: oklch(0.488 0.243 264.376); /* Professional blue */
--primary-foreground: oklch(0.97 0.014 254.604); /* Light text on blue */
--secondary: oklch(0.967 0.001 286.375); /* Light gray */
--secondary-foreground: oklch(0.21 0.006 285.885); /* Dark text on gray */
--background: oklch(1 0 0); /* White */
--foreground: oklch(0.141 0.005 285.823); /* Dark blue-gray text */
--card: oklch(1 0 0); /* White card background */
--card-foreground: oklch(0.141 0.005 285.823); /* Dark text on cards */
--muted: oklch(0.967 0.001 286.375); /* Light gray background */
--muted-foreground: oklch(0.552 0.016 285.938); /* Muted text */
--accent: oklch(0.967 0.001 286.375); /* Accent background */
--accent-foreground: oklch(0.21 0.006 285.885); /* Text on accent */
--destructive: oklch(0.577 0.245 27.325); /* Red for errors */
--border: oklch(0.92 0.004 286.32); /* Border gray */
--input: oklch(0.92 0.004 286.32); /* Input border */
--ring: oklch(0.708 0 0); /* Focus ring */
```

### Semantic Colors (Custom)

```css
/* Success (Green) */
--success: oklch(0.629 0.176 152.87);
--success-foreground: oklch(0.2 0.15 152.87);

/* Warning (Amber) */
--warning: oklch(0.755 0.153 79.98);
--warning-foreground: oklch(0.3 0.14 79.98);
```

---

## Typography

### Font Families

```css
--font-sans:
  "Montserrat", "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
--font-serif: "Playfair", ui-serif, Georgia, serif;
```

**Usage Guidelines**:

- **Body text**: Use `font-sans` (Montserrat/Be Vietnam Pro)
- **Headings**: Use `font-serif` (Playfair) for elegant headers
- All fonts support Vietnamese diacritical marks

### Type Scale

- **Headings**: Applied automatically via `@layer base` (h1-h6 use `font-serif`)
- **Body**: Default `text-base` (16px) on desktop, `text-sm` (14px) on mobile
- **Small text**: `text-sm` for secondary information
- **Extra small**: `text-xs` for labels, badges, captions

---

## Component Patterns

### 1. Dialog Component ✨ STANDARD MODAL PATTERN

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

**IMPORTANT - Consistent Modal Pattern**:

All modals across the application use Dialog (centered popup), NOT Sheet (side drawer):

- **BannersPage**: BannerFormModal (Dialog)
- **GalleryPage**: GalleryFormModal (Dialog)
- **BookingsPage**: BookingDetailsModal (Dialog) ✨ Migrated from Sheet to Dialog
- Form/detail modals: `max-w-2xl` + `max-h-[90vh]` + `overflow-y-auto`
- Confirmation dialogs: `max-w-lg`

---

### 2. StatusBadge Component

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

**Styling**:

- Rounded: `rounded-full`
- Padding: `px-3 py-1`
- Text: `text-xs font-medium`
- Icons: `h-3 w-3` (lucide-react)

---

### 3. ImageUpload Component

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

**Usage**:

```tsx
import { ImageUpload } from "@/components/shared/ImageUpload";

<ImageUpload
  value={imageUrl}
  onChange={(url) => setValue("imageUrl", url)}
  folder="banners"
/>;
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

**States**:

- Empty: Shows upload zone with icon
- Uploading: Shows spinner + progress bar
- Uploaded: Shows image preview + action buttons

**Styling**:

- Upload zone: `border-2 border-dashed border-border bg-muted/50`
- Dragging state: `border-primary bg-primary/10`
- Preview: `h-48 w-full object-cover`
- Progress bar: `bg-primary` with animated width

---

### 4. VideoUpload Component

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

**Usage**:

```tsx
import { VideoUpload } from "@/components/shared/VideoUpload";

<VideoUpload
  value={videoUrl}
  onChange={(url) => setValue("videoUrl", url)}
  folder="banners"
/>;
```

**Features**:

- Drag-and-drop zone
- File input click to upload
- Video preview with controls
- Upload progress bar
- Replace and Remove buttons
- File validation (MP4, WebM, max 50MB)
- Firebase Storage integration
- Toast notifications (sonner)

**States**:

- Empty: Shows upload zone with video icon
- Uploading: Shows spinner + progress bar
- Uploaded: Shows video player + action buttons

**Styling**:

- Upload zone: Same as ImageUpload
- Preview: `h-64 w-full object-cover`
- Video controls: Native browser controls

---

## Design Tokens

### Spacing

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

### Border Radius

```css
--radius: 0.65rem; /* Base radius */
--radius-sm: 0.45rem; /* Small radius */
--radius-md: 0.5rem; /* Medium radius */
--radius-lg: 0.65rem; /* Large radius */
--radius-xl: 0.85rem; /* Extra large radius */
```

**Usage**:

- Buttons: `rounded-md`
- Cards: `rounded-lg`
- Badges: `rounded-full`
- Inputs: `rounded-md`
- Dialogs: `rounded-lg`

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
transition-colors  /* Color changes */
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

### Upload Progress

```tsx
<div
  className="h-full bg-primary transition-all duration-300"
  style={{ width: `${uploadProgress}%` }}
/>
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

---

## Future Enhancements

- [ ] Add progress component for multi-step forms
- [ ] Create DataTable component for CRUD operations
- [ ] Add skeleton loaders for async content
- [ ] Implement toast queue system
- [ ] Add dark mode toggle UI
- [ ] Create reusable form components
- [ ] Add input mask components (phone, date, etc.)

---

**End of Design Guidelines**
