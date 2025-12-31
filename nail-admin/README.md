# Pink Nail Admin Dashboard

A modern React admin dashboard for managing a nail salon business with shadcn/ui blue theme and Zustand state management.

## Features

- ✨ **Authentication**: Mock login system with JWT-based auth
- 🎨 **shadcn/ui Blue Theme**: Professional design system with clean, modern aesthetics
- 🔒 **Protected Routes**: Secure routes requiring authentication
- 📱 **Responsive Layout**: Fixed sidebar and sticky topbar
- 🎯 **Type-Safe**: Full TypeScript support with shared types from client project
- 💾 **Zustand State Management**: In-memory state with localStorage persistence for auth
- ☁️ **Firebase Storage**: Cloud storage for images and videos
- 📊 **Data Tables**: Sortable, paginated tables with TanStack Table

## Pages

- **Dashboard**: Overview with quick stats and actions ✅
- **Banners**: Full CRUD for hero section banners ✅
  - Create/edit/delete banners
  - Image/video uploads to Firebase Storage
  - Drag-and-drop reordering
  - Primary banner selection
  - Active/inactive toggle
  - Hero display mode settings (Image/Video/Carousel)
  - Type field (image/video) for filtering
  - Zustand store for state management
- **Gallery**: Full CRUD for portfolio images ✅
  - Create/edit/delete gallery items
  - Image upload to Firebase Storage
  - Category filtering (all, extensions, manicure, nail-art, pedicure, seasonal)
  - Featured item toggle
  - Bulk delete operations
  - Grid view with image preview
  - Zustand store for state management
- **Services**: Manage nail services with pricing (coming soon)
- **Bookings**: View and update customer bookings (coming soon)
- **Contacts**: Manage customer inquiries (CRUD - coming soon)

## Tech Stack

- **Frontend**: React 19.2 + TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **UI Components**: Radix UI primitives
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand 5.0 for global state management
- **Notifications**: Sonner toasts
- **Icons**: Lucide React
- **Data Tables**: TanStack Table v8
- **Cloud Storage**: Firebase Storage

## Getting Started

### Installation

```bash
npm install
```

### Configure Environment

Update `.env` with your Firebase credentials or keep `VITE_USE_MOCK_API=true` to use mock data.

```env
VITE_USE_MOCK_API=true
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173 and login with demo credentials.

### Build

```bash
npm run build
```

## Demo Credentials

- **Email**: admin@pinknail.com
- **Password**: admin123

## Design System

### shadcn/ui Blue Theme

Built on shadcn/ui component library with a professional blue color scheme:

- **Primary**: Professional blue `oklch(0.492 0.147 255.75)`
- **Background**: Clean white `oklch(1 0 0)`
- **Muted**: Light gray `oklch(0.961 0.004 255.75)`
- **Border**: Subtle gray `oklch(0.898 0.003 255.75)`
- **Destructive**: Red `oklch(0.577 0.245 27.325)`
- **Success**: Green `oklch(0.629 0.176 152.87)`
- **Warning**: Amber `oklch(0.755 0.153 79.98)`

### Component Patterns

- Cards with `bg-card` and `border-border`
- Text with `text-muted-foreground` for secondary content
- Interactive elements with `hover:bg-accent`
- All styling uses Tailwind CSS utility classes
- Dark mode support via CSS variables

## Project Structure

```
src/
├── components/
│   ├── auth/           # Protected route components
│   ├── banners/        # Banner-specific components
│   ├── layout/         # Sidebar, Topbar, Layout
│   ├── shared/         # Reusable components (DataTable, ImageUpload, etc.)
│   └── ui/             # Base UI components (Button, Input, Card, etc.)
├── pages/              # Page components
├── services/           # API services (auth, storage, banners, etc.)
├── store/              # Zustand stores (authStore, bannersStore, heroSettingsStore)
├── types/              # TypeScript type definitions
├── data/               # Mock data and initialization
├── lib/                # Utilities and Firebase config
├── App.tsx             # Main app with routing
└── index.css           # Design system styles
```

## State Management Architecture

### Zustand Stores

The application uses Zustand for global state management with three main stores:

**authStore** - Authentication state with localStorage persistence:

- User information and token
- Login/logout actions
- Session initialization

**bannersStore** - Banner management with in-memory state:

- Banner list with full CRUD operations
- Primary banner selection
- Active/inactive toggling
- Drag-and-drop reordering
- Auto-initialization with mock data

**heroSettingsStore** - Hero display settings:

- Display mode (image/video/carousel)
- Carousel interval and controls
- Auto-save functionality

### Data Flow

```
User Action → Service Layer → Zustand Store → UI Update
                    ↓
            [Mock: In-memory state]
            [Real: REST API + State sync]
```

## Implementation Status

### ✅ Completed (v0.2.0)

1. **Foundation**
   - Authentication system with protected routes
   - shadcn/ui blue theme design system
   - Layout components (Sidebar, Topbar)
   - Type system aligned with client project
   - Zustand state management integration

2. **Banner Management (Complete CRUD)**
   - Banner listing with DataTable (TanStack Table)
   - Create/edit banner forms with validation (React Hook Form + Zod)
   - Delete confirmation dialogs
   - Image/video upload to Firebase Storage
   - Drag-and-drop reordering (HTML5 native)
   - Primary banner selection
   - Active/inactive toggle
   - Type field (image/video) for filtering
   - Hero display mode settings (Image/Video/Carousel)
   - Auto-save settings
   - Zustand stores for banners and hero settings
   - Mock data initialization with 5 sample banners

3. **Gallery Management (Complete CRUD)**
   - Gallery listing with grid view
   - Create/edit gallery item forms with validation
   - Delete confirmation dialogs (single and bulk)
   - Image upload to Firebase Storage
   - Category filtering (all, extensions, manicure, nail-art, pedicure, seasonal)
   - Featured item toggle
   - Bulk selection and delete operations
   - Zustand store for gallery state management
   - Mock data initialization with 20 sample items

4. **Shared Components**
   - DataTable with TanStack Table (sorting, pagination, row actions)
   - ImageUpload with Firebase Storage integration
   - VideoUpload with Firebase Storage integration
   - StatusBadge component
   - CategoryFilter component
   - FeaturedBadge component
   - Form modals (Dialog, Input, Label, Textarea, Switch, RadioGroup)

### ⏳ Coming Soon

5. **Services CRUD** - Manage nail services with pricing
6. **Bookings Management** - View and update customer bookings
7. **Contacts Management** - Manage customer inquiries with admin notes
8. **Dashboard Enhancements** - Real statistics and widgets
9. **Backend API Integration** - Replace mock data with real API

## Key Architecture Decisions

### Zustand Migration (v0.1.0 - v0.2.0)

Migrated from pure localStorage to Zustand stores for improved state management:

- **Authentication**: Still uses localStorage for persistence (login sessions)
- **Banners**: In-memory Zustand store with mock data initialization
- **Gallery**: In-memory Zustand store with mock data initialization (v0.2.0)
- **Hero Settings**: In-memory Zustand store with default settings
- **Benefits**: Better performance, reactive updates, simplified component logic

### Dual-Mode Service Architecture

Services support both mock and real API modes via `VITE_USE_MOCK_API`:

**Mock Mode** (`VITE_USE_MOCK_API=true`):

- Banners, gallery, and hero settings: Zustand in-memory state
- Auth data: localStorage with `nail_admin_` prefix
- No backend required

**Real API Mode** (`VITE_USE_MOCK_API=false`):

- Expected endpoints:
  - `POST /api/auth/login`
  - `GET /api/banners`, `POST /api/banners`, `PATCH /api/banners/:id`, `DELETE /api/banners/:id`
  - `GET /api/gallery`, `POST /api/gallery`, `PATCH /api/gallery/:id`, `DELETE /api/gallery/:id`
  - `POST /api/gallery/bulk`, `DELETE /api/gallery/bulk-delete`
  - `GET /api/hero-settings`, `PUT /api/hero-settings`
- Standard REST conventions
- JWT bearer token authentication
- No frontend code changes needed to switch

## Type System

### Shared Types (Synchronized with Client Project)

**CRITICAL**: These types must remain compatible with `/Users/hainguyen/Documents/nail-project/nail-client`:

- `Service` - Service with id, name, description, category, price, duration, imageUrl, featured
- `ServiceCategory` - "extensions" | "manicure" | "nail-art" | "pedicure" | "spa"
- `GalleryItem` - Gallery image with metadata
- `GalleryCategory` - "all" | "extensions" | "manicure" | "nail-art" | "pedicure" | "seasonal"
- `Booking` - Booking with id, serviceId, date, timeSlot, customerInfo, notes, status
- `BookingStatus` - "pending" | "confirmed" | "completed" | "cancelled"
- `CustomerInfo` - firstName, lastName, email, phone

**Rule**: Never modify shared types without updating both projects.

### Admin-Only Types

- `Banner` - Hero section banners (NEW in v0.1.0)
- `HeroSettings` - Hero display mode configuration (NEW in v0.1.0)
- `Contact` - Customer inquiries with admin notes
- `User` - Admin user (id, email, name, role, avatar)
- `Auth` - Authentication types (AuthResponse, LoginCredentials)

## TypeScript Configuration

**Important**: Uses `verbatimModuleSyntax: true`

**Rule**: Always use `type` imports for type-only imports:

```typescript
// ✅ Correct
import type { User, AuthResponse } from "@/types/auth.types";

// ❌ Wrong (causes build error)
import { User, AuthResponse } from "@/types/auth.types";
```

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Format code
npm run format
```

## Banner CRUD Features

### Display Modes

- **Image**: Single static image from primary banner (filtered by type="image")
- **Video**: Single video background from primary banner (filtered by type="video")
- **Carousel**: Rotating carousel of all active banners (respects type filtering)

### Banner Operations

- **Create**: Add new banner with image/video upload, title, description, CTA
- **Read**: View all banners with filtering (all/active)
- **Update**: Edit banner details, change primary status, toggle active state
- **Delete**: Remove banner with confirmation
- **Reorder**: Drag-and-drop to change display order (native HTML5 API)

### Hero Settings

- Display mode selection (Image/Video/Carousel)
- Carousel interval (2-10 seconds)
- Navigation controls toggle
- Auto-save on changes
- Primary banner preview
- Warning for missing primary banner

## Firebase Integration

### Storage Structure

```
/banners/
  ├── {timestamp}-{filename}.jpg
  └── {timestamp}-{filename}.mp4
/services/
  └── {timestamp}-{filename}.jpg
/gallery/
  └── {timestamp}-{filename}.jpg
```

### Upload Limits

- **Images**: 5MB max
- **Videos**: 50MB max
- Supported formats: jpg, jpeg, png, gif, webp (images), mp4, webm, mov (videos)

## License

MIT
