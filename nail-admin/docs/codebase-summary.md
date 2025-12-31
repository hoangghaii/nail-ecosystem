# Codebase Summary

**Project**: Pink Nail Admin Dashboard
**Version**: 0.2.0
**Last Updated**: 2025-12-05
**Generated From**: repomix-output.xml

## Project Statistics

- **Total Files**: 69 files
- **Total Tokens**: 42,286 tokens
- **Total Characters**: 164,919 chars
- **TypeScript Coverage**: 100% (no `any` types)
- **Build Status**: PASS (0 errors)

## Top Files by Size

1. `CLAUDE.md` - 4,159 tokens (9.8%) - Project instructions
2. `src/components/banners/HeroSettingsCard.tsx` - 2,741 tokens (6.5%)
3. `src/pages/BannersPage.tsx` - 2,707 tokens (6.4%)
4. `src/index.css` - 1,994 tokens (4.7%)

## Directory Structure

```
nail-admin/
├── docs/                     # Project documentation
├── src/
│   ├── components/
│   │   ├── auth/            # ProtectedRoute (1 file)
│   │   ├── banners/         # Banner components (3 files)
│   │   ├── gallery/         # Gallery components (4 files)
│   │   ├── layout/          # Layout components (3 files)
│   │   ├── shared/          # Reusable components (4 files)
│   │   └── ui/              # shadcn/ui primitives (23 files)
│   ├── data/                # Mock data (3 files)
│   ├── lib/                 # Utils, Firebase (2 files)
│   ├── pages/               # Pages (7 files)
│   ├── services/            # Service layer (7 files)
│   ├── store/               # Zustand stores (4 files)
│   └── types/               # TypeScript types (7 files)
├── CLAUDE.md                # Development instructions
├── package.json             # Dependencies
└── vite.config.ts           # Build configuration
```

## Core Technologies

- **React**: 19.2 + **TypeScript**: 5.9
- **Build**: Vite 7.2, **Styling**: Tailwind CSS v4
- **UI**: shadcn/ui (Radix UI primitives)
- **State**: Zustand 5.0
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table v8
- **Storage**: Firebase Storage 11.1

## State Management (Zustand)

### authStore.ts (42 lines)

```typescript
{
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login(user, token); // Saves to localStorage
  logout(); // Clears localStorage
  initializeAuth(); // Loads from localStorage on mount
}
```

### bannersStore.ts (90 lines) ✨ NEW v0.1.0

```typescript
{
  banners: Banner[] // In-memory state
  isInitialized: boolean
  initializeBanners() // Load mock data once
  addBanner(banner)
  updateBanner(id, data)
  deleteBanner(id)
  setPrimaryBanner(id) // Only one primary
  toggleBannerActive(id)
  reorderBanners(bannerIds) // Drag-drop support
}
```

### heroSettingsStore.ts (77 lines) ✨ NEW v0.1.0

```typescript
{
  settings: HeroSettings; // In-memory state
  isInitialized: boolean;
  initializeSettings(); // Load defaults once
  setDisplayMode(mode); // image | video | carousel
  setCarouselInterval(interval); // 2-10 seconds
  setShowControls(show);
  updateSettings(settings);
  resetSettings();
}
```

### galleryStore.ts (78 lines) ✨ NEW v0.2.0

```typescript
{
  galleryItems: GalleryItem[] // In-memory state
  isInitialized: boolean
  initializeGallery() // Load mock data once
  addGalleryItem(item)
  addMultipleItems(items) // Bulk add
  updateGalleryItem(id, data)
  deleteGalleryItem(id)
  deleteMultipleItems(ids) // Bulk delete
  toggleFeatured(id)
  setGalleryItems(items)
}
```

## Key Components

### Banner Management ✅ Complete

**BannerFormModal** (289 lines)

- Create/edit modal with React Hook Form + Zod
- Image/Video upload to Firebase
- Type field (image/video), CTA fields
- Validation: title (3-100 chars), description (0-500 chars)

**HeroSettingsCard** (376 lines)

- Display mode: Image/Video/Carousel
- Carousel interval slider (2-10s)
- Show controls toggle
- Auto-save on changes
- Primary banner preview

**BannersPage** (372 lines)

- DataTable with TanStack Table
- Drag-drop reordering (HTML5 API)
- Primary banner selection
- Active/inactive toggle
- Filtering: all | active
- Type-based filtering by display mode

### Gallery Management ✅ Complete (v0.2.0)

**GalleryFormModal** (335 lines)

- Create/edit modal with React Hook Form + Zod
- Image upload to Firebase Storage
- Category selection (extensions, manicure, nail-art, pedicure, seasonal)
- Featured toggle
- Validation: title (3-100 chars), description (0-500 chars)

**CategoryFilter** (59 lines)

- Category filtering tabs
- Active category highlighting
- Item counts per category

**DeleteGalleryDialog** (109 lines)

- Single and bulk delete confirmation
- Item preview with count

**FeaturedBadge** (21 lines)

- Visual indicator for featured items

**GalleryPage** (331 lines)

- Grid layout with image preview
- Category filtering
- Bulk selection and delete
- Featured item toggle
- DataTable integration for list view

### Booking Management ✅ Complete (v0.2.0)

**BookingDetailsModal** (138 lines)

- Dialog-based centered modal (consistent with BannersPage, GalleryPage)
- View booking details (customer info, appointment details)
- Status badge indicator
- Update status action button
- Replaced BookingDetailsDrawer (Sheet component)

**BookingsPage** - Booking list and management

- DataTable with booking rows
- Status filtering and actions
- Modal-based detail view

### Shared Components

**DataTable** (74 lines) - Generic table with sorting, pagination
**ImageUpload** (170 lines) - Firebase upload, 5MB max
**VideoUpload** (165 lines) - Firebase upload, 50MB max
**StatusBadge** (64 lines) - Variant-based badges

### UI Primitives (shadcn/ui)

23 components: button, card, dialog, dropdown-menu, input, label, radio-group, select, switch, table, textarea, etc.

## Services (Dual-Mode Architecture)

### banners.service.ts (151 lines) ✨ Updated v0.1.0

```typescript
class BannersService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<Banner[]> {
    if (this.useMockApi) {
      return useBannersStore.getState().banners; // Zustand
    }
    const res = await fetch("/api/banners");
    return res.json();
  }

  async create(data): Promise<Banner> {
    if (this.useMockApi) {
      const banner = { ...data, id: `banner_${Date.now()}`, ... };
      useBannersStore.getState().addBanner(banner); // Zustand
      return banner;
    }
    // Real API call
  }

  // update, delete, setPrimary, toggleActive, reorder...
}
```

### gallery.service.ts (155 lines) ✨ NEW v0.2.0

```typescript
class GalleryService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<GalleryItem[]> {
    if (this.useMockApi) {
      return useGalleryStore.getState().galleryItems; // Zustand
    }
    const res = await fetch("/api/gallery");
    return res.json();
  }

  async create(data): Promise<GalleryItem> {
    if (this.useMockApi) {
      const item = { ...data, id: `gallery_${Date.now()}`, ... };
      useGalleryStore.getState().addGalleryItem(item); // Zustand
      return item;
    }
    // Real API call
  }

  // update, delete, createMultiple, deleteMultiple, toggleFeatured, getFeatured, getByCategory...
}
```

### Other Services

- **auth.service.ts** (102 lines) - Mock JWT login
- **heroSettings.service.ts** (69 lines) - Uses heroSettingsStore
- **imageUpload.service.ts** (89 lines) - Firebase Storage
- **storage.service.ts** (58 lines) - localStorage wrapper with `nail_admin_` prefix

## Type Definitions

### Admin-Only Types ✨ NEW v0.1.0

**banner.types.ts**

```typescript
interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  type: "image" | "video"; // ✨ NEW
  ctaText?: string;
  ctaLink?: string;
  sortIndex: number;
  active: boolean;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**heroSettings.types.ts**

```typescript
type HeroDisplayMode = "image" | "video" | "carousel";

interface HeroSettings {
  displayMode: HeroDisplayMode;
  carouselInterval: number; // milliseconds
  showControls: boolean;
  updatedAt: Date;
}
```

### Shared Types (Client Project Sync)

- **service.types.ts** - Service, ServiceCategory
- **gallery.types.ts** - GalleryItem, GalleryCategory
- **booking.types.ts** - Booking, BookingStatus, CustomerInfo
- **contact.types.ts** - Contact inquiries

**CRITICAL**: Types must remain compatible with client project at:
`/Users/hainguyen/Documents/nail-project/nail-client`

## Pages

1. **LoginPage** (93 lines) - Auth form
2. **DashboardPage** (18 lines) - Overview (placeholder)
3. **BannersPage** (372 lines) ✅ Full CRUD implementation
4. **GalleryPage** (331 lines) ✅ Full CRUD implementation (v0.2.0)
5. **ServicesPage** (18 lines) - Placeholder
6. **BookingsPage** ✅ Booking management (v0.2.0)
7. **ContactsPage** (18 lines) - Placeholder

## Mock Data

**mockBanners.ts** (130 lines)

- 5 sample banners (3 image, 2 video)
- Realistic titles, descriptions, CTA
- Proper sortIndex (0-4)
- Mix of active/inactive, one primary

**mockGallery.ts** (380 lines) ✨ NEW v0.2.0

- 20 sample gallery items
- 5 categories (extensions, manicure, nail-art, pedicure, seasonal)
- Mix of featured/non-featured items
- Realistic titles and descriptions

**initializeMockData.ts** (30 lines)

- Auto-initializes Zustand stores on app mount
- Initializes banners, gallery, and hero settings
- Idempotent (safe to run multiple times)
- Called from `main.tsx`

## Key Architecture Decisions

### Zustand Migration (v0.1.0 - v0.2.0) ✨

**Before**:

```
localStorage:
  - nail_admin_banners
  - nail_admin_gallery
  - nail_admin_heroSettings
```

**After**:

```
Zustand Stores (in-memory):
  - bannersStore (v0.1.0)
  - galleryStore (v0.2.0)
  - heroSettingsStore (v0.1.0)

localStorage (auth only):
  - nail_admin_auth_token
  - nail_admin_auth_user
```

**Benefits**:

- Better performance (no serialize/deserialize)
- Reactive updates
- Simpler component logic
- Type-safe state management
- Bulk operations support

### Dual-Mode Service Pattern

```
VITE_USE_MOCK_API=true  → Zustand stores (dev)
VITE_USE_MOCK_API=false → REST API calls (prod)
```

No frontend code changes needed to switch.

### TypeScript verbatimModuleSyntax

```typescript
// ✅ Correct
import type { Banner } from "@/types/banner.types";

// ❌ Wrong (build error)
import { Banner } from "@/types/banner.types";
```

## Implementation Status

### ✅ Complete (v0.2.0)

- Authentication with JWT
- Banner CRUD (create, read, update, delete)
- Gallery CRUD (create, read, update, delete) ✨ NEW v0.2.0
- Booking details view with modal UI ✨ NEW v0.2.0
- Hero settings component
- Drag-drop reordering (banners)
- Primary banner selection
- Active/inactive toggle
- Type filtering (image/video)
- Category filtering (gallery)
- Featured item toggle (gallery)
- Bulk delete operations (gallery)
- Zustand state management (banners, gallery, hero settings, bookings)
- DataTable, ImageUpload, VideoUpload
- Mock data initialization
- Firebase Storage integration
- Consistent Dialog-based modal pattern across all pages

### ⏳ Planned

- Services CRUD
- Bookings management
- Contacts management
- Dashboard analytics
- Backend API integration

## Build & Development

**Commands**:

```bash
npm run dev      # Dev server on :5173
npm run build    # Production build
npm run lint     # ESLint check
npx tsc --noEmit # Type check
```

**Build Output**: 0 errors, bundle size warning acceptable

## Security

- JWT authentication
- Protected routes with redirect
- File upload validation (type, size)
- Firebase Storage security rules
- Environment variables for credentials

## Performance

- Zustand for efficient state updates
- Vite HMR for fast development
- Ready for lazy loading (React.lazy)
- Image/Video optimization via Firebase CDN

## Related Documentation

- [Project Overview PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Project Roadmap](./project-roadmap.md)
- [Design Guidelines](./design-guidelines.md)
