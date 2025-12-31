# Admin App - Dashboard

**Path**: `/apps/admin`
**Port**: 5174 (dev) / 81 (prod)
**Framework**: React 19.2 + Vite 7.2 + TypeScript 5.9

## Purpose

Admin dashboard for managing bookings, services, gallery, banners, contacts, and business information.

## Entry Point

**src/main.tsx**:
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { initializeMockData } from "./data/initializeMockData";
import App from "./App.tsx";
import "./styles/index.css";

if (import.meta.env.VITE_USE_MOCK_API === "true") {
  initializeMockData();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </StrictMode>,
);
```

## Routing (Protected)

**App.tsx**:
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
    </Route>
  </Routes>
</BrowserRouter>
```

## Directory Structure

```
src/
├── components/
│   ├── auth/              ProtectedRoute, LoginForm
│   ├── banners/           Banner CRUD components
│   ├── bookings/          StatusFilter, BookingDetailsModal
│   ├── contacts/          Contact management UI
│   ├── gallery/           Gallery CRUD components
│   ├── layout/            Topbar, Sidebar, Layout
│   │   └── shared/        DataTable, ImageUpload, VideoUpload, StatusBadge
│   └── ui/                Shadcn/ui components (10 components)
├── data/                  Mock data initialization
├── hooks/                 Custom hooks (removed useDebounce → @repo/utils)
├── lib/                   Firebase, validations
├── pages/                 7 pages (Dashboard, Banners, Services, Gallery, Bookings, Contacts, Login)
├── services/              API service layer (axios)
├── store/                 Zustand stores (authStore)
└── types/                 TypeScript definitions
```

## UI Components (shadcn/ui)

**10 Radix UI components**:
- button, card, dialog, dropdown-menu, input
- label, radio-group, select, sheet, switch, textarea

**Design System**:
- Theme: Professional, clean, modern
- Colors: Blue theme (shadcn/ui default)
- Glassmorphism: WITH shadows
- Typography: System fonts

**Shared Components** (layout/shared/):
- **DataTable**: TanStack Table wrapper with sorting
- **ImageUpload**: Cloudinary upload with drag-drop
- **VideoUpload**: Cloudinary video upload
- **StatusBadge**: Booking/contact status display

## Tech Stack

### Core
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4

### Styling
- Tailwind CSS v4
- @repo/tailwind-config/admin-theme
- Radix UI

### Forms
- React Hook Form 7.54.2
- Zod 3.24.1 (schema validation)

### State
- Zustand (authStore)
- TanStack Query (server state)

### Data Tables
- TanStack Table 8.22.1 (sorting, filtering)

### Backend
- Firebase Admin SDK (auth)
- Axios (API calls)

### Other
- Sonner (notifications)
- date-fns (formatting)
- Lucide React (icons)

## Pages (7)

| Page | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| LoginPage | `/login` | Authentication | Email/password, remember me, redirect |
| DashboardPage | `/` | Overview | Stats, charts, recent activity |
| BannersPage | `/banners` | Hero banners | CRUD, primary flag, image/video upload |
| ServicesPage | `/services` | Service mgmt | CRUD, categories, pricing |
| GalleryPage | `/gallery` | Portfolio mgmt | CRUD, categories, debounced search |
| BookingsPage | `/bookings` | Appointments | Status updates, filters, details modal |
| ContactsPage | `/contacts` | Inquiries | Read/respond, status updates |

## Authentication

**ProtectedRoute.tsx**:
```typescript
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
```

**authStore** (Zustand):
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

## API Services

**services/**:
```
├── banner.service.ts       CRUD banners
├── booking.service.ts      CRUD bookings, update status
├── contact.service.ts      CRUD contacts, update status
├── gallery.service.ts      CRUD gallery items
├── imageUpload.service.ts  Cloudinary image upload
├── service.service.ts      CRUD services
├── videoUpload.service.ts  Cloudinary video upload
└── api.ts                  Base axios config
```

**Base URL**:
- Dev: `http://localhost:3000` (direct)
- Prod: `/api` (nginx rewrite)

## Mock Data

**VITE_USE_MOCK_API=true**: Local development without backend

**data/initializeMockData.ts**:
- Generates sample data for all entities
- Stored in localStorage
- Mocks API responses

## Environment Variables

**.env**:
```
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000
```

**.env.production**:
```
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api
```

## Shared Imports

```typescript
// From monorepo packages
import { useDebounce } from "@repo/utils/hooks";
import { cn } from "@repo/utils/cn";
import { formatCurrency, formatDate } from "@repo/utils/format";
import { BookingStatus, ServiceCategory } from "@repo/types/service";
```

**Updated**: BookingsPage, ContactsPage, GalleryPage use `@repo/utils/hooks`

## Build Output

**dist/**:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      ~694 KB (gzipped ~206 KB)
│   ├── index-[hash].css     ~45 KB (gzipped ~9 KB)
│   ├── react-vendor-[hash].js
│   └── router-vendor-[hash].js
```

**Build Time**: 2.3s (Vite)

## Docker Configuration

**Dockerfile** (identical to client):
```dockerfile
FROM node:24.12.0-alpine AS base
# Copy workspace packages

FROM dependencies AS development
# Vite dev server on :5174

FROM dependencies AS builder
# npm run build --filter=admin

FROM nginx:1.27-alpine AS production
# Port 81 (different from client:80)
```

## Scripts

```json
{
  "dev": "vite --port 5174",
  "build": "tsc -b && vite build",
  "type-check": "tsc -b",
  "preview": "vite preview"
}
```

## Key Features

1. **Authentication**: Protected routes, JWT tokens
2. **CRUD Operations**: Full management for all entities
3. **File Uploads**: Cloudinary integration (images, videos)
4. **Data Tables**: Sorting, filtering, pagination
5. **Status Management**: Booking/contact status workflows
6. **Mock Mode**: Local dev without backend
7. **Type Safety**: Shared @repo/types
8. **Debounced Search**: Performance optimization

## Dependencies (Key)

```json
{
  "react": "^19.2.0",
  "vite": "^7.2.4",
  "typescript": "~5.9.3",
  "@repo/types": "*",
  "@repo/utils": "*",
  "@tanstack/react-table": "^8.22.1",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "zustand": "^5.0.2",
  "firebase": "^11.2.0"
}
```

---

**Status**: Production-ready
**Port**: 5174 (dev) / 81 (prod via nginx)
**Design**: Professional/modern (intentionally different from client)
