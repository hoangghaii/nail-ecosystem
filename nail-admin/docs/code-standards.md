# Code Standards & Best Practices

**Project**: Pink Nail Admin Dashboard
**Version**: 0.1.0
**Last Updated**: 2025-12-04

## Overview

This document defines coding standards, patterns, and best practices for the Pink Nail Admin Dashboard project.

## Core Principles

### KISS (Keep It Simple, Stupid)

- Prefer simple, straightforward solutions
- Avoid unnecessary complexity
- Write code that's easy to understand

### DRY (Don't Repeat Yourself)

- Extract common logic into reusable functions
- Use shared components for repeated UI patterns
- Maintain single source of truth

### Type Safety First

- No `any` types (100% type coverage)
- Use `import type` for type-only imports (verbatimModuleSyntax)
- Zod schemas for runtime validation

## File Organization

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── banners/           # Banner-specific components
│   ├── layout/            # Layout components (Sidebar, Topbar)
│   ├── shared/            # Reusable cross-feature components
│   └── ui/                # Base UI primitives (shadcn/ui)
├── pages/                 # Page-level components
├── services/              # API service layer
├── store/                 # Zustand stores
├── types/                 # TypeScript type definitions
├── data/                  # Mock data and initialization
├── lib/                   # Utilities and Firebase config
└── App.tsx                # Main app with routing
```

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `BannersPage.tsx`, `HeroSettingsCard.tsx`)
- **Services**: camelCase + `.service.ts` (e.g., `banners.service.ts`)
- **Stores**: camelCase + `Store.ts` (e.g., `bannersStore.ts`)
- **Types**: camelCase + `.types.ts` (e.g., `banner.types.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)

### Code

- **Variables**: camelCase
- **Functions**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## TypeScript Standards

### verbatimModuleSyntax Compliance

**CRITICAL**: Always use `import type` for type-only imports:

```typescript
// ✅ Correct
import type { Banner } from "@/types/banner.types";
import type { User } from "@/types/auth.types";

// ❌ Wrong (causes build error)
import { Banner } from "@/types/banner.types";
```

### Strict Mode

- No `any` types (use `unknown` if type is truly unknown)
- Enable all strict checks
- No implicit any
- No unchecked indexed access

### Type Definitions

```typescript
// Prefer interfaces for object shapes
interface Banner {
  id: string;
  title: string;
  active: boolean;
}

// Use type for unions, intersections, utilities
type HeroDisplayMode = "image" | "video" | "carousel";
type BannerUpdate = Partial<Omit<Banner, "id">>;
```

## Component Patterns

### Functional Components with TypeScript

```typescript
import type { FC } from "react";

interface Props {
  title: string;
  onSave: () => void;
}

export const Component: FC<Props> = ({ title, onSave }) => {
  return <div>{title}</div>;
};
```

### Hooks Usage

```typescript
// State
const [isOpen, setIsOpen] = useState(false);

// Effects
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);

// Zustand store
const banners = useBannersStore((state) => state.banners);
const addBanner = useBannersStore((state) => state.addBanner);
```

## Zustand Store Pattern

### Store Structure

```typescript
import { create } from "zustand";

import type { Banner } from "@/types/banner.types";

type BannersState = {
  banners: Banner[];
  isInitialized: boolean;
  initializeBanners: () => void;
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
};

export const useBannersStore = create<BannersState>((set, get) => ({
  banners: [],
  isInitialized: false,

  initializeBanners: () => {
    if (!get().isInitialized) {
      set({ banners: MOCK_BANNERS, isInitialized: true });
    }
  },

  addBanner: (banner) => {
    set((state) => ({ banners: [...state.banners, banner] }));
  },

  updateBanner: (id, data) => {
    set((state) => ({
      banners: state.banners.map((b) =>
        b.id === id ? { ...b, ...data, updatedAt: new Date() } : b,
      ),
    }));
  },

  deleteBanner: (id) => {
    set((state) => ({
      banners: state.banners.filter((b) => b.id !== id),
    }));
  },
}));
```

### Usage in Components

```typescript
// Select specific state
const banners = useBannersStore((state) => state.banners);
const addBanner = useBannersStore((state) => state.addBanner);

// Initialize on mount
useEffect(() => {
  initializeBanners();
}, [initializeBanners]);
```

## Service Layer Pattern

### Dual-Mode Architecture

```typescript
import type { Banner } from "@/types/banner.types";
import { useBannersStore } from "@/store/bannersStore";

export class BannersService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<Banner[]> {
    if (this.useMockApi) {
      // Mock mode: Get from Zustand store
      return useBannersStore.getState().banners;
    }

    // Real API mode: Fetch from backend
    const response = await fetch("/api/banners");
    if (!response.ok) throw new Error("Failed to fetch banners");
    return response.json();
  }

  async create(
    data: Omit<Banner, "id" | "createdAt" | "updatedAt">,
  ): Promise<Banner> {
    if (this.useMockApi) {
      const newBanner: Banner = {
        ...data,
        id: `banner_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      useBannersStore.getState().addBanner(newBanner);
      return newBanner;
    }

    const response = await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create banner");
    return response.json();
  }
}

export const bannersService = new BannersService();
```

## Form Validation Pattern

### React Hook Form + Zod

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(500).optional(),
  imageUrl: z.string().min(1, "Image is required"),
  ctaText: z.string().max(30).optional(),
  ctaLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  active: z.boolean().default(true),
});

type BannerFormData = z.infer<typeof bannerSchema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<BannerFormData>({
  resolver: zodResolver(bannerSchema),
  defaultValues: {
    active: true,
  },
});

const onSubmit = async (data: BannerFormData) => {
  try {
    await bannersService.create(data);
    toast.success("Banner created successfully!");
  } catch (error) {
    console.error("Error creating banner:", error);
    toast.error("Failed to create banner");
  }
};
```

## Error Handling

### Try-Catch with User Feedback

```typescript
const handleDelete = async (id: string) => {
  try {
    await bannersService.delete(id);
    toast.success("Banner deleted successfully!");
    loadBanners(); // Refresh data
  } catch (error) {
    console.error("Error deleting banner:", error);
    toast.error("Failed to delete banner. Please try again.");
  }
};
```

### Service Layer Errors

```typescript
async delete(id: string): Promise<void> {
  if (this.useMockApi) {
    const banner = await this.getById(id);
    if (!banner) {
      throw new Error("Banner not found");
    }
    useBannersStore.getState().deleteBanner(id);
    return;
  }

  const response = await fetch(`/api/banners/${id}`, {
    method: "DELETE",
  });

  if (response.status === 404) {
    throw new Error("Banner not found");
  }

  if (!response.ok) {
    throw new Error("Failed to delete banner");
  }
}
```

## Styling Standards

### Tailwind CSS Usage

```typescript
// ✅ Good: Semantic, consistent classes
<Card className="border-border bg-card">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription className="text-muted-foreground">
      Description
    </CardDescription>
  </CardHeader>
</Card>

// ❌ Avoid: Arbitrary values, inline styles
<div className="bg-[#f0f0f0]" style={{ padding: "12px" }}>
```

### Component Variants

```typescript
// Use cn() utility for className merging
import { cn } from "@/lib/utils";

export const Button = ({ className, variant = "default", ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground",
        className
      )}
      {...props}
    />
  );
};
```

## Shared Type Compatibility

### CRITICAL: Client Project Sync

Types shared with `/Users/hainguyen/Documents/nail-project/nail-client`:

- `Service`, `ServiceCategory`
- `GalleryItem`, `GalleryCategory`
- `Booking`, `BookingStatus`, `CustomerInfo`

**Rule**: Never modify shared types without updating both projects.

### Admin-Only Types

- `Banner` - Admin-specific hero banners
- `HeroSettings` - Display mode configuration
- `Contact` - Customer inquiries with admin notes
- `User`, `Auth` - Authentication types

## Testing Standards

### Manual Testing Checklist

- ✅ TypeScript compilation (`npx tsc --noEmit`)
- ✅ Build succeeds (`npm run build`)
- ✅ No console errors in development
- ✅ Forms validate correctly
- ✅ CRUD operations work in mock mode
- ✅ Responsive on mobile/tablet/desktop
- ✅ Keyboard navigation works
- ✅ Toast notifications appear correctly

## Git Standards

### Commit Messages

```
feat(banners): add drag-and-drop reordering
fix(hero-settings): correct carousel interval validation
docs: update README with Zustand migration
refactor(services): simplify dual-mode pattern
```

### Pre-Commit Checklist

- ✅ No TypeScript errors
- ✅ Code formatted with Prettier
- ✅ No console.log statements (use toast for user feedback)
- ✅ Types imported correctly (import type)
- ✅ Meaningful commit message

## Performance Best Practices

### Component Optimization

```typescript
// Memoize expensive operations
const sortedBanners = useMemo(() => {
  return banners.sort((a, b) => a.sortIndex - b.sortIndex);
}, [banners]);

// Memoize callbacks
const handleDelete = useCallback(
  (id: string) => {
    deleteBanner(id);
  },
  [deleteBanner],
);
```

### Lazy Loading

```typescript
// Lazy load route components
const BannersPage = lazy(() => import("@/pages/BannersPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
```

## Security Standards

### Input Validation

- Validate all user inputs with Zod schemas
- Sanitize file uploads (type, size checks)
- Never expose sensitive data in client-side code
- Use environment variables for API keys

### Firebase Storage

```typescript
// File type validation
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
  throw new Error("Invalid file type");
}

if (file.size > MAX_IMAGE_SIZE) {
  throw new Error("File too large");
}
```

## Accessibility Standards

### Radix UI Compliance

- Use Radix UI primitives for accessible components
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios

### Example

```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Banner
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Banner</DialogTitle>
      <DialogDescription>
        Add a new hero banner to your website.
      </DialogDescription>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

## Related Documentation

- [Project Overview PDR](./project-overview-pdr.md)
- [System Architecture](./system-architecture.md)
- [Codebase Summary](./codebase-summary.md)
- [Project Roadmap](./project-roadmap.md)
