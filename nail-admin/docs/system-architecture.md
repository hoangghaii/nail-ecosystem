# System Architecture

**Last Updated**: 2025-12-05
**Version**: 0.2.0
**Project**: Pink Nail Admin Dashboard

## Overview

Pink Nail Admin Dashboard implements a modern client-side React architecture with Zustand state management and a dual-mode service layer pattern. The system is designed for managing a nail salon business through a professional admin interface with shadcn/ui blue theme components, featuring both mock data (Zustand in-memory stores) and real API integration capabilities.

## Architectural Pattern

### Pattern Classification

**Primary Pattern**: Layered Architecture with Service Layer Pattern
**Secondary Patterns**:

- Model-View-Controller (MVC) via React
- Repository Pattern (services as data repositories)
- Strategy Pattern (dual-mode API toggle)
- Observer Pattern (Zustand state management)
- Compound Component Pattern (shadcn/ui components)

### Design Philosophy

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Type Safety First**: Full TypeScript coverage with strict mode
- **Component Reusability**: Shared components and UI primitives
- **API Flexibility**: Seamless switching between mock and real APIs
- **Progressive Enhancement**: Build on solid foundation, add features incrementally
- **Accessibility**: WCAG 2.1 AA compliance via Radix UI

## System Components

### 1. Presentation Layer

#### 1.1 Pages (Route-level Components)

**Location**: `src/pages/`
**Responsibility**: Page-level orchestration, data fetching, state management
**Key Pages**:

- `LoginPage.tsx` - Authentication UI
- `DashboardPage.tsx` - Overview dashboard with stats
- `BannersPage.tsx` - Banner management (CRUD complete) - Uses Dialog modals
- `GalleryPage.tsx` - Gallery management (CRUD complete) - Uses Dialog modals
- `BookingsPage.tsx` - Booking management (view/update status) ✨ Uses Dialog modals
- `ServicesPage.tsx` - Service management (placeholder)
- `ContactsPage.tsx` - Contact management (placeholder)

**Technology**: React 19.2 functional components with hooks

#### 1.2 Layout Components

**Location**: `src/components/layout/`
**Responsibility**: Application structure and navigation

**Components**:

- `Layout.tsx` - Main layout wrapper with sidebar and topbar
- `Sidebar.tsx` - Fixed navigation sidebar (250px width)
  - Logo section
  - Navigation links with active state
  - Responsive collapse on mobile
- `Topbar.tsx` - Sticky top bar
  - Page title
  - User dropdown menu
  - Logout action

**Features**:

- Fixed sidebar navigation
- Sticky topbar (z-index: 40)
- Active route highlighting
- Responsive design (mobile-first)

#### 1.3 Feature Components

**Location**: `src/components/[feature]/`
**Responsibility**: Feature-specific UI logic

**Banner Components** (`src/components/banners/`):

- `BannerFormModal.tsx` - Create/edit modal with React Hook Form + Zod validation
  - Title, description fields
  - Image/video upload
  - CTA text/link
  - Active toggle
  - Form validation and error display
  - **Dialog component** (centered popup)
- `DeleteBannerDialog.tsx` - Confirmation dialog with AlertTriangle icon
- `HeroSettingsCard.tsx` - Hero display mode configuration
  - Radio group for display modes (Image/Video/Carousel)
  - Carousel interval slider
  - Auto-play and controls toggles
  - Auto-save on change
- `index.ts` - Barrel export

**Gallery Components** (`src/components/gallery/`) ✨ NEW v0.2.0:

- `GalleryFormModal.tsx` - Create/edit modal with React Hook Form + Zod validation
  - Title, description fields
  - Image upload to Firebase Storage
  - Category selection (extensions, manicure, nail-art, pedicure, seasonal)
  - Featured toggle
  - Form validation and error display
  - **Dialog component** (centered popup)
- `DeleteGalleryDialog.tsx` - Confirmation dialog for single/bulk delete
  - Item count display
  - Preview of items to be deleted
- `CategoryFilter.tsx` - Category filtering tabs
  - Item counts per category
  - Active category highlighting
- `FeaturedBadge.tsx` - Visual indicator for featured items
- `index.ts` - Barrel export

**Booking Components** (`src/components/bookings/`) ✨ NEW v0.2.0:

- `BookingDetailsModal.tsx` - View booking details modal
  - Customer information (name, email, phone)
  - Appointment details (date, time, service)
  - Status badge
  - Update status action
  - Notes display
  - **Dialog component** (centered popup) - Migrated from Sheet for UI consistency
- `index.ts` - Barrel export

**Implementation**:

- React Hook Form for form state
- Zod for validation schemas
- Sonner for toast notifications
- Firebase Storage integration
- Bulk operations support

#### 1.4 Shared Components

**Location**: `src/components/shared/`
**Responsibility**: Reusable cross-feature components

**DataTable** (`DataTable.tsx`):

- Built on TanStack Table v8
- Generic column definitions
- Sorting support
- Pagination (client-side)
- Row actions (edit, delete)
- Loading skeleton states
- Empty state handling
- Responsive design

**ImageUpload** (`ImageUpload.tsx`):

- Firebase Storage integration
- Drag-and-drop upload
- File validation (type: image/\*, size: <5MB)
- Image preview
- Upload progress indicator
- Delete functionality
- Folder organization

**VideoUpload** (`VideoUpload.tsx`):

- Firebase Storage for videos
- Drag-and-drop interface
- File validation (type: video/\*, size: <50MB)
- Video preview
- Upload progress
- Delete functionality
- Folder organization

**StatusBadge** (`StatusBadge.tsx`):

- Variant-based styling (default, success, destructive, warning)
- Status indicators (active/inactive, pending/confirmed/completed/cancelled)
- Consistent badge design

#### 1.5 UI Primitives (shadcn/ui)

**Location**: `src/components/ui/`
**Responsibility**: Base UI components with consistent design

**Components**:

- `button.tsx` - Button variants (default, destructive, outline, ghost, link, secondary)
- `card.tsx` - Card layout (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `dialog.tsx` - Modal dialogs (Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter)
  - **STANDARD MODAL PATTERN**: All modals use Dialog (centered popup), NOT Sheet (side drawer)
  - Consistent styling: `max-w-2xl` + `max-h-[90vh]` + `overflow-y-auto` for detail modals
- `dropdown-menu.tsx` - Dropdown menus with Radix UI
- `input.tsx` - Text input with focus ring
- `label.tsx` - Form labels
- `radio-group.tsx` - Radio button groups
- `switch.tsx` - Toggle switches
- `textarea.tsx` - Multi-line text input
- `sheet.tsx` - Side drawer (NOT used for modals to maintain UI consistency)

**Design System**:

- OKLCH color space
- CSS variable-based theming
- Professional blue primary color
- Consistent spacing (4px grid)
- Accessible focus states
- Dark mode support

### 2. Business Logic Layer

#### 2.1 Service Layer

**Location**: `src/services/`
**Responsibility**: API communication and business logic
**Pattern**: Dual-mode architecture controlled by `VITE_USE_MOCK_API` environment variable

**Architecture**:

```typescript
class ServiceName {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async method(): Promise<ReturnType> {
    if (this.useMockApi) {
      // Mock implementation (localStorage)
      return mockData;
    }
    // Real API implementation
    const response = await fetch("/api/endpoint");
    return response.json();
  }
}
```

**Services**:

**auth.service.ts** - Authentication management:

- `login(credentials)` - Authenticate user, return JWT token
- `logout()` - Clear session
- `getCurrentUser()` - Get current authenticated user
- Mock JWT with 1-day (or 30-day) expiry
- Token stored in localStorage (`nail_admin_token`)

**banners.service.ts** - Banner CRUD:

- `getAll()` - Fetch all banners sorted by sortIndex
- `getById(id)` - Fetch single banner
- `create(banner)` - Create new banner with auto-generated ID and timestamps
- `update(id, data)` - Update banner fields
- `delete(id)` - Delete banner and reorder remaining
- `setPrimary(id)` - Set banner as primary, unset others
- `toggleActive(id)` - Toggle active status
- `reorder(bannerId, newIndex)` - Update sortIndex for drag-and-drop

**heroSettings.service.ts** - Hero settings persistence:

- `get()` - Fetch current hero settings with defaults
- `update(settings)` - Update hero settings and timestamp

**imageUpload.service.ts** - Firebase Storage integration:

- `uploadImage(file, folder)` - Upload image, return public URL
- `uploadVideo(file, folder)` - Upload video, return public URL
- `deleteFile(url)` - Delete file from storage by URL
- Folder structure: `/banners`, `/services`, `/gallery`
- Progress tracking
- Error handling

**storage.service.ts** - localStorage wrapper:

- `set<T>(key, value)` - Store typed data with `nail_admin_` prefix
- `get<T>(key, defaultValue)` - Retrieve typed data with fallback
- `remove(key)` - Remove single key
- `clear()` - Clear all prefixed keys
- JSON serialization/deserialization
- Type-safe operations

**Mock Mode** (`VITE_USE_MOCK_API=true`):

- Data persisted in localStorage with `nail_admin_` prefix
- Simulated network delays (800ms for auth)
- Full CRUD operations
- No backend required

**Real API Mode** (`VITE_USE_MOCK_API=false`):

- Expected endpoints:
  - `POST /api/auth/login`
  - `GET /api/banners`
  - `POST /api/banners`
  - `PUT /api/banners/:id`
  - `DELETE /api/banners/:id`
  - `GET /api/hero-settings`
  - `PUT /api/hero-settings`
- Standard REST conventions
- JWT bearer token authentication
- No frontend code changes needed

#### 2.2 State Management

**Location**: `src/store/`
**Technology**: Zustand 5.0.2
**Responsibility**: Global application state

**authStore.ts** - Authentication state with localStorage persistence:

```typescript
{
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  initializeAuth: () => void  // Called on app mount
}
```

**bannersStore.ts** - Banner management with in-memory state:

```typescript
{
  banners: Banner[]
  isInitialized: boolean
  initializeBanners: () => void          // Auto-load mock data
  addBanner: (banner: Banner) => void
  updateBanner: (id: string, data: Partial<Banner>) => void
  deleteBanner: (id: string) => void
  setBanners: (banners: Banner[]) => void
  setPrimaryBanner: (id: string) => void
  toggleBannerActive: (id: string) => void
  reorderBanners: (bannerIds: string[]) => void
}
```

**heroSettingsStore.ts** - Hero display settings with in-memory state:

```typescript
{
  settings: HeroSettings
  isInitialized: boolean
  initializeSettings: () => void                        // Load defaults
  setDisplayMode: (mode: HeroDisplayMode) => void
  setCarouselInterval: (interval: number) => void
  setShowControls: (show: boolean) => void
  updateSettings: (settings: Partial<HeroSettings>) => void
  resetSettings: () => void
}
```

**galleryStore.ts** - Gallery management with in-memory state ✨ NEW v0.2.0:

```typescript
{
  galleryItems: GalleryItem[]
  isInitialized: boolean
  initializeGallery: () => void                    // Auto-load mock data
  addGalleryItem: (item: GalleryItem) => void
  addMultipleItems: (items: GalleryItem[]) => void // Bulk add
  updateGalleryItem: (id: string, data: Partial<GalleryItem>) => void
  deleteGalleryItem: (id: string) => void
  deleteMultipleItems: (ids: string[]) => void     // Bulk delete
  toggleFeatured: (id: string) => void
  setGalleryItems: (items: GalleryItem[]) => void
}
```

**Features**:

- In-memory state for banners, gallery, and hero settings (faster, reactive)
- localStorage persistence only for authentication (session management)
- Auto-initialization with mock data on first load
- Bulk operations support (gallery)
- Token expiry handling
- Type-safe state updates
- Optimistic UI updates

**Pattern**: Zustand stores with initialization guards

#### 2.3 Data Initialization

**Location**: `src/data/`
**Responsibility**: Mock data seeding

**initializeMockData.ts** - Auto-initialization logic:

- Runs on app mount in `main.tsx`
- Initializes Zustand stores on first load
- Seeds banners if not initialized
- Seeds gallery if not initialized
- Seeds hero settings if not initialized
- Idempotent (safe to run multiple times)

**mockBanners.ts** - Sample banner data:

- 5 pre-configured banners
- Various display types (image, video)
- Realistic content for testing
- Proper sortIndex ordering

**mockGallery.ts** - Sample gallery data ✨ NEW v0.2.0:

- 20 pre-configured gallery items
- 5 categories (extensions, manicure, nail-art, pedicure, seasonal)
- Mix of featured/non-featured items
- Realistic titles and descriptions
- Placeholder images

### 3. Data Layer

#### 3.1 Type System

**Location**: `src/types/`
**Responsibility**: TypeScript type definitions
**Strategy**: Shared types must remain compatible with client project

**Type Files**:

**Shared Types** (synchronized with `/Users/hainguyen/Documents/nail-project/nail-client`):

- `service.types.ts` - Service, ServiceCategory
- `gallery.types.ts` - GalleryItem, GalleryCategory
- `booking.types.ts` - Booking, BookingStatus, CustomerInfo
- **Rule**: Never modify without updating both projects

**Admin-Only Types**:

- `banner.types.ts` - Banner entity (NEW in v0.1.0)
  - id, title, description, imageUrl, videoUrl
  - ctaText, ctaLink
  - sortIndex, active, isPrimary
  - createdAt, updatedAt timestamps
- `heroSettings.types.ts` - HeroSettings, HeroDisplayMode (NEW in v0.1.0)
  - displayMode: "image" | "video" | "carousel"
  - carouselInterval, autoPlay, showControls
  - updatedAt timestamp
- `contact.types.ts` - Contact entity
  - id, name, email, phone, message
  - adminNotes, status (new/contacted/resolved)
  - createdAt, updatedAt timestamps
- `auth.types.ts` - User, LoginCredentials, AuthResponse
  - User: id, email, name, role ("admin"), avatar
  - JWT-based authentication types

**TypeScript Configuration**:

- `verbatimModuleSyntax: true` - **CRITICAL**: Must use `import type` for type-only imports
- Strict mode enabled
- No implicit any
- Path alias: `@/*` → `./src/*`

#### 3.2 Data Storage

**Zustand Stores** (In-Memory State - Mock Mode):

```
bannersStore:
  - banners: Banner[]          # In-memory array, initialized from MOCK_BANNERS
  - isInitialized: boolean     # Prevents re-initialization

galleryStore:                  # ✨ NEW v0.2.0
  - galleryItems: GalleryItem[] # In-memory array, initialized from MOCK_GALLERY
  - isInitialized: boolean     # Prevents re-initialization

heroSettingsStore:
  - settings: HeroSettings     # In-memory object with defaults
  - isInitialized: boolean     # Prevents re-initialization
```

**localStorage Structure** (Authentication Only):

```
nail_admin_auth_token    → JWT token string
nail_admin_auth_user     → User object
```

**Firebase Storage Structure**:

```
/banners/
  ├── {timestamp}-{filename}.jpg
  └── {timestamp}-{filename}.mp4
/services/
  └── {timestamp}-{filename}.jpg
/gallery/
  └── {timestamp}-{filename}.jpg
```

**Data Flow** (Zustand Migration):

```
User Action (Component)
    ↓
Service Layer
    ↓
├─→ Mock: Zustand Store (in-memory)
└─→ Real: REST API + Store Sync
    ↓
Zustand Store Update
    ↓
UI Re-render (React)
```

**Key Changes**:

- Banners: localStorage → Zustand store (v0.1.0 - better performance, reactive updates)
- Gallery: localStorage → Zustand store (v0.2.0 - bulk operations support)
- Hero Settings: localStorage → Zustand store (v0.1.0 - simpler state management)
- Auth: Remains in localStorage (session persistence required)

### 4. Integration Layer

#### 4.1 Firebase Integration

**Purpose**: Cloud storage for images and videos
**SDK Version**: 11.1.0
**Configuration**: `src/lib/firebase.ts`

**Initialized Services**:

- Firebase Storage only (no Auth, Firestore, etc.)

**Environment Variables**:

```env
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

**Upload Flow**:

1. User selects file via ImageUpload/VideoUpload component
2. File validation (type, size)
3. Generate unique filename (timestamp + original name)
4. Upload to Firebase Storage with progress tracking
5. Get public download URL
6. Return URL to form
7. Save URL in banner/service/gallery entity

**Security Rules** (Firebase Console):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;  // Require authentication
    }
  }
}
```

#### 4.2 React Router Integration

**Version**: 6.28.0
**Configuration**: `src/App.tsx`

**Route Structure**:

```
/
├── /login (public)
└── / (protected)
    ├── /dashboard
    ├── /banners
    ├── /services
    ├── /gallery
    ├── /bookings
    └── /contacts
```

**Protection**: `<ProtectedRoute>` wrapper component checks `authStore.isAuthenticated`

**Redirect Logic**:

- Not authenticated → `/login`
- Authenticated → Requested route

#### 4.3 Form Validation

**Technology**: React Hook Form 7.54.2 + Zod 3.24.1
**Pattern**: Schema-based validation with type inference

**Example** (BannerFormModal):

```typescript
const bannerSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  imageUrl: z.string().min(1, "Image is required"),
  videoUrl: z.string().optional(),
  ctaText: z.string().max(30).optional(),
  ctaLink: z.string().url().optional().or(z.literal("")),
  active: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<BannerFormData>({
  resolver: zodResolver(bannerSchema),
});
```

**Benefits**:

- Type-safe form data
- Automatic error messages
- Runtime validation
- Schema reusability

### 5. Build & Development Layer

#### 5.1 Build System

**Tool**: Vite 7.2.0
**Compiler**: SWC (faster than Babel)
**Configuration**: `vite.config.ts`

**Features**:

- Hot Module Replacement (HMR)
- Path alias resolution (`@/*`)
- React plugin with Fast Refresh
- Development server on port 5173
- Production build optimization

**Build Output** (`dist/`):

- Minified JavaScript bundles
- CSS extraction and minification
- Asset optimization
- Source maps (optional)

#### 5.2 Code Quality

**Linting**: ESLint 9.17.0 with TypeScript plugin
**Formatting**: Prettier 3.4.2
**Git Hooks**: Husky 9.1.7

**Pre-commit Hook**:

- Format code with Prettier
- Auto-fix on commit

**ESLint Rules**:

- React Hooks rules enforcement
- React Refresh compatibility
- TypeScript type checking
- No unused variables

**Prettier Configuration**:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

#### 5.3 Type Checking

**Compiler**: TypeScript 5.9.0
**Configuration**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

**Critical Settings**:

- `verbatimModuleSyntax: true` - Enforces `import type` for types
- `strict: true` - All strict checks enabled
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUncheckedIndexedAccess: true`

**Path Mapping**:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### 6. UI/UX Layer

#### 6.1 Design System

**Framework**: Tailwind CSS v4.0.18
**Component Library**: shadcn/ui (Radix UI primitives)
**Color Space**: OKLCH (perceptually uniform)

**Color Palette** (Professional Blue Theme):

```css
--color-background: oklch(1 0 0); /* White */
--color-foreground: oklch(0.145 0.007 255.75); /* Dark blue-gray */
--color-primary: oklch(0.492 0.147 255.75); /* Professional blue */
--color-secondary: oklch(0.961 0.004 255.75); /* Light gray */
--color-muted: oklch(0.961 0.004 255.75); /* Light background */
--color-accent: oklch(0.961 0.004 255.75); /* Accent background */
--color-destructive: oklch(0.577 0.245 27.325); /* Red */
--color-border: oklch(0.898 0.003 255.75); /* Border gray */
--color-ring: oklch(0.492 0.147 255.75); /* Focus ring (blue) */
--color-success: oklch(0.629 0.176 152.87); /* Green */
--color-warning: oklch(0.755 0.153 79.98); /* Amber */
```

**Dark Mode Support**:

```css
@media (prefers-color-scheme: dark) {
  --color-background: oklch(0.145 0.007 255.75);
  --color-foreground: oklch(0.98 0.002 255.75);
  /* ... other dark mode colors */
}
```

**Typography**:

- Font: System font stack (no web fonts for performance)
- Sizes: 0.875rem (sm), 1rem (base), 1.125rem (lg), 1.25rem (xl), etc.
- Line heights: 1.5 (base), 1.25 (tight), 1.75 (relaxed)

**Spacing**:

- 4px grid system
- Consistent padding/margin scales
- Responsive utilities

#### 6.2 Responsive Design

**Strategy**: Mobile-first approach
**Breakpoints** (Tailwind defaults):

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Responsive Patterns**:

- Fixed sidebar on desktop, collapsible on mobile
- Stacked cards on mobile, grid on desktop
- Responsive data tables (horizontal scroll)
- Touch-friendly button sizes (min 44x44px)

#### 6.3 Accessibility

**Standards**: WCAG 2.1 AA compliance
**Foundation**: Radix UI primitives (accessible by default)

**Features**:

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management in modals
- Screen reader support
- Color contrast ratios ≥4.5:1
- Focus indicators

## Component Interactions

### Banner CRUD Flow

```
┌─────────────────┐
│  BannersPage    │
└────────┬────────┘
         │ Mounts
         ↓
    loadBanners()
         │
         ↓
┌─────────────────────┐
│ bannersService      │
│ .getAll()           │
└────────┬────────────┘
         │
    ┌────┴────┐
    ↓         ↓
[Mock]    [Real API]
localStorage  fetch()
    │         │
    └────┬────┘
         ↓
    Banner[] data
         │
         ↓
┌─────────────────┐
│ State Update    │
│ setBanners()    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ DataTable       │
│ Renders rows    │
└────────┬────────┘
         │
         ├─→ Edit Button → BannerFormModal
         ├─→ Delete Button → DeleteBannerDialog
         ├─→ Set Primary → bannersService.setPrimary()
         ├─→ Toggle Active → bannersService.toggleActive()
         └─→ Drag & Drop → bannersService.reorder()
```

### Form Submission Flow

```
User fills BannerFormModal
         ↓
React Hook Form
         ↓
Zod Validation
         │
    ┌────┴────┐
    ↓         ↓
 Invalid   Valid
    │         │
    ↓         ↓
 Errors   Submit Handler
displayed      │
              ↓
       ImageUpload.uploadImage()
              │
              ↓
       Firebase Storage
              │
              ↓
       Public URL returned
              │
              ↓
       bannersService.create/update()
              │
         ┌────┴────┐
         ↓         ↓
      [Mock]    [Real]
    localStorage  API
         │         │
         └────┬────┘
              ↓
         Success
              │
              ├─→ toast.success()
              ├─→ onSuccess callback
              └─→ Close modal
```

### Authentication Flow

```
LoginPage form submission
         ↓
authService.login(credentials)
         │
    ┌────┴────┐
    ↓         ↓
 [Mock]    [Real]
Check creds  POST /api/login
    │         │
    └────┬────┘
         ↓
   AuthResponse
   { token, user }
         ↓
authStore.login(response)
         │
         ├─→ Store token in localStorage
         ├─→ Store user in state
         └─→ Set isAuthenticated = true
         ↓
Navigate to /dashboard
         ↓
ProtectedRoute checks isAuthenticated
         ↓
    ┌────┴────┐
    ↓         ↓
  true      false
    │         │
    ↓         ↓
 Render   Redirect
  page    to /login
```

## Data Flow Diagrams

### Application Bootstrap Flow

```
main.tsx entry point
    ↓
Initialize Mock Data (if needed)
    ↓
Render <App />
    ↓
authStore.initializeAuth()
    ↓
Check localStorage for token
    │
    ├─→ Token exists & valid → Set authenticated
    └─→ No token or expired → Set unauthenticated
    ↓
Render Router
    │
    ├─→ /login (public)
    └─→ / (protected routes)
        │
        └─→ Check authentication
            │
            ├─→ Authenticated → Render page
            └─→ Not authenticated → Redirect to /login
```

### State Management Flow

```
User Action (e.g., toggle banner active)
    ↓
Component event handler
    ↓
Service method call
    ↓
    ┌────────────┴───────────┐
    ↓                        ↓
[Mock Mode]            [Real API Mode]
localStorage update     HTTP request
    ↓                        ↓
Update local data      Update server data
    ↓                        ↓
    └────────────┬───────────┘
                 ↓
            Success response
                 ↓
    Component state update
    (e.g., setBanners with new data)
                 ↓
            React re-render
                 ↓
            UI updated
```

### File Upload Flow

```
User selects file in ImageUpload
    ↓
File validation (type, size)
    │
    ├─→ Invalid → Show error
    └─→ Valid → Continue
            ↓
    Generate unique filename
    (timestamp-originalname.ext)
            ↓
    Upload to Firebase Storage
    with progress tracking
            ↓
    Get public download URL
            ↓
    Return URL to form
    (setValue("imageUrl", url))
            ↓
    Form submission includes URL
            ↓
    Banner saved with imageUrl
```

## Technology Stack

### Frontend Technologies

- **React**: 19.2.0 - UI library
- **TypeScript**: 5.9.0 - Type safety
- **Vite**: 7.2.0 - Build tool
- **React Router**: 6.28.0 - Routing
- **Tailwind CSS**: 4.0.18 - Styling

### UI & Components

- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Component patterns
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Forms & Validation

- **React Hook Form**: 7.54.2
- **Zod**: 3.24.1
- **@hookform/resolvers**: 3.9.1

### State & Data

- **Zustand**: 5.0.2 - State management
- **TanStack Table**: 8.21.0 - Data tables
- **@dnd-kit**: Drag-and-drop

### Cloud Services

- **Firebase**: 11.1.0 - Storage

### Development Tools

- **ESLint**: 9.17.0
- **Prettier**: 3.4.2
- **Husky**: 9.1.7
- **TypeScript ESLint**: 8.19.1

## Security Architecture

### Frontend Security

**Authentication**:

- JWT-based token authentication
- Token stored in localStorage (encrypted in production)
- Automatic session expiry
- Remember me option (30-day vs 1-day expiry)

**Protected Routes**:

- Authentication check via `ProtectedRoute` component
- Automatic redirect to `/login` if not authenticated
- Session persistence across page reloads

**Input Validation**:

- Zod schema validation on all forms
- Client-side validation before submission
- Type-safe form data
- XSS prevention via React's automatic escaping

**File Upload Security**:

- File type validation (whitelist approach)
- File size limits (images: 5MB, videos: 50MB)
- Unique filenames to prevent collisions
- Firebase Storage security rules (auth required for write)

**Environment Variables**:

- Sensitive config in `.env` (gitignored)
- No hardcoded credentials
- Public read-only Firebase credentials (safe for client-side)

### API Security (Backend Responsibility)

When integrating real API:

- HTTPS only
- CORS configuration
- Rate limiting
- Input sanitization
- SQL injection prevention
- CSRF protection
- JWT secret rotation

## Scalability Considerations

### Performance Optimization

**Code Splitting** (Ready for):

- React.lazy for route-level components
- Dynamic imports for large libraries
- Chunk optimization

**Asset Optimization**:

- Image lazy loading
- Firebase Storage CDN
- Vite build optimization (tree shaking, minification)

**State Management**:

- Zustand lightweight store (<1KB)
- Selective re-renders
- Memoization where needed

**Data Fetching**:

- Client-side caching potential
- Optimistic UI updates
- Debounced search inputs

### Horizontal Scalability

**Client-Side**:

- Static build (CDN-friendly)
- No server-side rendering (SSR) needed
- Deployable to any static host (Vercel, Netlify, Firebase Hosting)

**Backend (Future)**:

- Stateless API design
- JWT authentication (no session storage)
- Database connection pooling
- Caching layer (Redis)
- Load balancing ready

### Vertical Scalability

**Component Reusability**:

- Shared component library
- Consistent design patterns
- Easy to add new features

**Type System**:

- Shared types with client project
- Type safety prevents runtime errors
- Easy refactoring

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Node.js 18+
├── npm dependencies
├── Vite dev server (port 5173)
├── Firebase Storage (test project)
└── localStorage (mock data)
```

### Production Build

```
npm run build
    ↓
Vite build process
    ↓
TypeScript compilation
    ↓
Asset optimization
    ↓
dist/ folder
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js (minified, tree-shaken)
    │   ├── index-[hash].css (extracted, minified)
    │   └── [images, fonts]
    └── vite.svg
```

### Deployment Options

**Option 1: Static Hosting (Recommended)**:

- Vercel, Netlify, Firebase Hosting
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git

**Option 2: Traditional Server**:

- Nginx/Apache serving static files
- Custom domain configuration
- Manual deployments

**Environment Variables** (Production):

```bash
VITE_USE_MOCK_API=false
VITE_FIREBASE_API_KEY=prod_key
VITE_FIREBASE_STORAGE_BUCKET=prod_bucket.appspot.com
# ... other Firebase config
```

**Backend API** (When ready):

- Deployed separately (e.g., Node.js, Python, Go)
- CORS configured for admin domain
- JWT authentication
- Database connection (PostgreSQL, MongoDB, etc.)

## Module Dependencies

### Dependency Graph

```
Pages
  ↓ imports
Components (feature, shared, ui)
  ↓ imports
Services
  ↓ imports
Types

Store (Zustand) ←→ Components
Utils ←→ Components
```

### Critical Dependencies

**Must remain compatible**:

- React 19.x
- TypeScript 5.x
- Tailwind CSS 4.x
- Radix UI components
- Firebase 11.x

**Can upgrade independently**:

- Vite
- ESLint
- Prettier
- Lucide icons
- Zustand

## Banner Management Module (Detailed)

### Module Structure

```
Banner Management
├── UI Layer
│   ├── BannersPage (orchestration)
│   ├── BannerFormModal (create/edit)
│   ├── DeleteBannerDialog (delete confirmation)
│   ├── HeroSettingsCard (display mode config)
│   ├── DataTable (banner list)
│   ├── ImageUpload (image upload)
│   └── VideoUpload (video upload)
├── Service Layer
│   ├── bannersService (CRUD operations)
│   ├── heroSettingsService (settings persistence)
│   └── imageUploadService (Firebase upload)
├── Data Layer
│   ├── Banner type (entity definition)
│   ├── HeroSettings type (settings definition)
│   ├── mockBanners (sample data)
│   └── localStorage (mock storage)
└── State Layer
    └── Component state (React.useState)
```

### Banner Entity Schema

```typescript
Banner {
  id: string                 // UUID
  title: string              // 3-100 chars
  description?: string       // 0-500 chars
  imageUrl: string           // Firebase Storage URL (required)
  videoUrl?: string          // Firebase Storage URL (optional)
  ctaText?: string           // 0-30 chars
  ctaLink?: string           // Valid URL
  sortIndex: number          // For drag-drop ordering
  active: boolean            // Display toggle
  isPrimary: boolean         // Primary banner flag (only one)
  createdAt: Date            // Auto-generated
  updatedAt: Date            // Auto-updated
}
```

### Hero Settings Schema

```typescript
HeroSettings {
  displayMode: "image" | "video" | "carousel"
  carouselInterval: number   // Milliseconds (3000-10000)
  autoPlay: boolean          // Auto-play carousel
  showControls: boolean      // Show carousel controls
  updatedAt: Date            // Auto-updated
}
```

### Banner Operations

**Create Banner**:

1. User clicks "Create Banner"
2. BannerFormModal opens
3. User fills form (title, description, uploads image/video)
4. Zod validates input
5. bannersService.create() called
6. Generate UUID, timestamps
7. Calculate sortIndex (max + 1)
8. Save to localStorage/API
9. Refresh banner list
10. Toast success notification

**Edit Banner**:

1. User clicks edit button in DataTable
2. BannerFormModal opens with pre-filled data
3. User modifies fields
4. bannersService.update() called with partial data
5. Update updatedAt timestamp
6. Save to localStorage/API
7. Refresh banner list
8. Toast success notification

**Delete Banner**:

1. User clicks delete button
2. DeleteBannerDialog opens with confirmation
3. User confirms
4. bannersService.delete() called
5. Remove from storage
6. Reorder remaining banners (update sortIndex)
7. Refresh banner list
8. Toast success notification

**Set Primary**:

1. User clicks star icon
2. bannersService.setPrimary() called
3. Set target banner isPrimary = true
4. Set all others isPrimary = false
5. Save to storage
6. Refresh banner list
7. Toast success notification

**Toggle Active**:

1. User clicks toggle switch
2. bannersService.toggleActive() called
3. Flip active boolean
4. Update updatedAt timestamp
5. Save to storage
6. Refresh banner list
7. Toast success notification

**Reorder (Drag & Drop)**:

1. User drags banner row
2. @dnd-kit handles UI state
3. On drop, bannersService.reorder() called
4. Update sortIndex for moved banner
5. Adjust sortIndex for affected banners
6. Save to storage
7. Refresh banner list
8. Toast success notification

### Hero Settings Operations

**Update Display Mode**:

1. User selects radio option (Image/Video/Carousel)
2. heroSettingsService.update() called immediately (auto-save)
3. Update displayMode field
4. Update updatedAt timestamp
5. Save to localStorage/API
6. Toast success notification

**Update Carousel Settings**:

1. User adjusts interval slider or toggles
2. Debounced update (500ms delay)
3. heroSettingsService.update() called
4. Save changes
5. Toast success notification

## Monitoring & Observability

### Error Handling

**Pattern**: Try-catch with user-friendly messages

```typescript
try {
  await bannersService.create(data);
  toast.success("Banner created!");
} catch (error) {
  console.error("Error creating banner:", error);
  toast.error("Failed to create banner. Please try again.");
}
```

**Logging**:

- `console.error()` for errors
- `console.warn()` for warnings
- Production: Replace with error tracking service (Sentry, LogRocket)

### Performance Metrics (Development)

- React DevTools Profiler
- Lighthouse audit
- Bundle size analysis (`npm run build -- --analyze`)

### User Feedback

- Toast notifications (Sonner)
- Loading states (spinners, skeleton loaders)
- Error messages (inline, toast)
- Success confirmations

## Future Architecture Evolution

### Planned Enhancements

**API Integration**:

- Replace mock mode with real backend
- WebSocket for real-time updates
- Offline support with service workers

**State Management**:

- Expand Zustand store for complex state
- Add React Query for server state management
- Optimistic updates

**Performance**:

- Code splitting by route
- Image optimization (next-gen formats)
- Virtual scrolling for large lists
- Memoization with React.memo

**Features**:

- Multi-language support (i18n)
- Advanced filtering and search
- Export functionality (CSV, PDF)
- Bulk operations
- Role-based access control (RBAC)

**Testing**:

- Unit tests (Vitest)
- Integration tests (React Testing Library)
- E2E tests (Playwright)
- Visual regression testing

## References

### Internal Documentation

- [Codebase Summary](./codebase-summary.md)
- [Project Overview PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)

### External Resources

- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [TanStack Table](https://tanstack.com/table/latest)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Firebase Storage](https://firebase.google.com/docs/storage)

## Unresolved Questions

None identified. Banner and Gallery CRUD module architectures are complete and documented.
