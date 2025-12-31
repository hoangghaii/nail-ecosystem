# Client App - Customer Website

**Path**: `/apps/client`
**Port**: 5173 (dev) / 80 (prod)
**Framework**: React 19.2 + Vite 7.2 + TypeScript 5.9

## Purpose

Customer-facing website for Pink Nail Salon with online booking, service browsing, gallery showcase, and contact functionality.

## Entry Point

**src/main.tsx**:
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" richColors />
  </StrictMode>,
);
```

## Routing (React Router v7)

**App.tsx**:
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="services" element={<ServicesPage />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="booking" element={<BookingPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

## Directory Structure

```
src/
├── assets/             Static images, fonts
├── components/
│   ├── banner/         Banner components
│   ├── gallery/        Gallery grid, filters, modals
│   ├── home/           Home page sections (Hero, About, Services, Gallery)
│   ├── layout/         Header, Footer, Layout wrapper
│   ├── services/       Service cards, filters
│   ├── shared/         Shared UI components
│   └── ui/             Shadcn/ui Radix components (15 components)
├── data/               Static data (business hours, contact info)
├── hooks/              Custom hooks (6 page-specific hooks)
├── lib/
│   └── validations/    Yup schemas for forms
├── pages/              5 page components
├── services/           API service layer (axios)
├── styles/             Global CSS (Tailwind v4)
└── types/              TypeScript definitions
```

## UI Components (shadcn/ui)

**15 Radix UI components**:
- badge, breadcrumb, button, card, calendar, date-picker
- dialog, form, input, label, popover, select
- separator, sonner, tabs, textarea

**Design System**:
- Theme: Warm, cozy, feminine, organic
- Colors: Beige/cream/warm grays (fdf8f6 → 43302b)
- Borders: YES, Shadows: NO
- Typography: Font sans (Poppins-style)

## Tech Stack

### Core
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.0 (SWC compiler)

### Styling
- Tailwind CSS v4 (@tailwindcss/vite)
- @repo/tailwind-config/client-theme
- Radix UI primitives

### Forms & Validation
- React Hook Form 7.54.2
- Yup 1.6.3
- @hookform/resolvers

### State Management
- Zustand (lightweight state)
- TanStack Query (React Query) - server state

### Routing
- React Router 7.9.6 (upgraded from v6)

### Animations
- Motion (Framer Motion fork) - performance optimized

### UI Utilities
- Sonner (toast notifications)
- date-fns (date formatting)
- class-variance-authority (CVA)
- clsx + tailwind-merge (via @repo/utils/cn)

### PWA
- vite-plugin-pwa (offline support, service worker)
- workbox (caching strategies)

### HTTP Client
- Axios (API calls to nail-api:3000)

## Configuration Files

**vite.config.ts**:
```typescript
export default defineConfig({
  plugins: [
    react({ babel: { plugins: [["babel-plugin-react-compiler"]] } }),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,webp}"],
      },
    }),
  ],
  resolve: { alias: { "@": "/src" } },
  server: { port: 5173, host: true },
  build: { outDir: "dist" },
});
```

**tsconfig.json**:
```json
{
  "extends": "@repo/typescript-config/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Pages (5)

| Page | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| HomePage | `/` | Landing page | Hero, About, Services preview, Gallery |
| ServicesPage | `/services` | Service catalog | Filterable by category, pricing, duration |
| GalleryPage | `/gallery` | Portfolio showcase | Filterable by category, lightbox modal |
| BookingPage | `/booking` | Online booking | Multi-step form, time slot selection |
| ContactPage | `/contact` | Contact form | Business info, hours, map, form |

## Hooks (Custom)

```
hooks/
├── useBookingPage.ts       Booking form state + validation
├── useContactPage.ts       Contact form state
├── useFeaturedGallery.ts   Home page gallery data
├── useGalleryPage.ts       Gallery filtering + modal
├── useHomePage.ts          Home page data aggregation
└── useServicesPage.ts      Service filtering
```

## API Services

**services/** (Axios):
```
├── booking.service.ts      POST /bookings, GET /bookings/:id
├── contact.service.ts      POST /contacts
├── gallery.service.ts      GET /gallery, GET /gallery/:id
├── service.service.ts      GET /services, GET /services/:id
└── api.ts                  Base axios config
```

**Base URL**:
- Dev: `http://localhost:3000` (direct)
- Prod: `/api` (nginx rewrite)

## Environment Variables

**.env**:
```
VITE_API_BASE_URL=http://localhost:3000
```

**.env.production**:
```
VITE_API_BASE_URL=/api
```

## Build Output

**dist/**:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      ~648 KB (gzipped ~200 KB)
│   ├── index-[hash].css     ~69 KB (gzipped ~11 KB)
│   ├── react-vendor-[hash].js
│   └── router-vendor-[hash].js
├── registerSW.js
├── sw.js
├── workbox-[hash].js
└── manifest.webmanifest
```

**Build Time**: 2.6s (Vite)
**Bundle Size**: ~750 KB total (gzipped ~210 KB)

## Docker Configuration

**Dockerfile** (multi-stage):
```dockerfile
FROM node:24.12.0-alpine AS base
# Copy workspace package.json files
# Install deps with npm ci

FROM dependencies AS development
# Vite dev server on :5173
# CHOKIDAR_USEPOLLING for hot-reload

FROM dependencies AS builder
# npm run build --filter=client

FROM nginx:1.27-alpine AS production
# Copy dist → /usr/share/nginx/html
# Custom nginx config
```

## Scripts

```json
{
  "dev": "vite --port 5173",
  "build": "tsc -b && vite build",
  "type-check": "tsc -b",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

## Key Features

1. **PWA Support**: Offline-first, service worker, manifest
2. **Responsive Design**: Mobile-first, Tailwind breakpoints
3. **Performance**: Code splitting, lazy loading, React 19 compiler
4. **Accessibility**: Radix UI primitives (WAI-ARIA compliant)
5. **SEO**: Meta tags, semantic HTML
6. **Type Safety**: Full TypeScript, shared @repo/types
7. **Design System**: Warm/cozy theme, consistent branding

## Dependencies (Key)

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "vite": "^7.2.0",
  "typescript": "~5.9.3",
  "@repo/types": "*",
  "@repo/utils": "*",
  "@radix-ui/react-*": "^1.x",
  "react-hook-form": "^7.54.2",
  "motion": "^11.18.4",
  "zustand": "^5.0.2",
  "@tanstack/react-query": "^5.66.3"
}
```

---

**Status**: Production-ready
**Port**: 5173 (dev) / 80 (prod via nginx)
**Design**: Warm/cozy/feminine (intentionally different from admin)
