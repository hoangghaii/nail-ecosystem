# Pink Nail Salon - Client App (Customer Website)

Customer-facing website for Pink Nail Salon built with React, TypeScript, and Vite.

---

## Overview

**Purpose**: Customer-facing website for browsing services, viewing gallery, booking appointments, and contacting the salon.

**Tech Stack**:
- React 19.2 + TypeScript 5.9
- Vite 7.2 (SWC)
- TanStack Query v5 (data fetching)
- React Router v7
- React Hook Form + Zod (forms)
- Tailwind CSS v4
- Motion (Framer Motion)
- Radix UI (shadcn/ui pattern)

**Design System**: Warm, organic, feminine theme with border-based styling (NO shadows)

---

## Features

### ✅ Completed Features

**Homepage**:
- Hero section (image/video/carousel modes)
- Services overview (3 featured services)
- Featured gallery (8 items, masonry layout)
- About section
- Business info footer

**Services Page**:
- All services displayed from API
- Category filtering
- Service details (name, price, duration, description)
- Loading skeletons
- Error handling with retry

**Gallery Page**:
- All gallery items from API
- Category filtering
- Lazy image loading (IntersectionObserver)
- Image lightbox/modal
- Loading skeletons
- Error handling with retry

**Booking Page**:
- Service selection dropdown (live API data)
- Date picker (future dates only)
- Time slot selection
- Customer info form (validated with Zod)
- Success confirmation
- Error handling with retry
- Loading states

**Contact Page**:
- Business info (from API)
- Contact form
- Form validation
- Success/error states

**Performance Optimizations**:
- Desktop prefetching (services + gallery)
- Lazy image loading (IntersectionObserver)
- Mobile-specific cache tuning (10min vs 5min)
- Smart retry logic (skip 4xx, retry 5xx/network)

---

## API Integration

**Status**: ✅ 100% Complete

All pages connected to backend API via TanStack Query:
- Services: `GET /services`
- Gallery: `GET /gallery`, `GET /gallery-categories`
- Bookings: `POST /bookings`
- Contacts: `POST /contacts`
- Business Info: `GET /business-info`
- Banners: `GET /banners`

**Patterns**:
- Service layer (`src/services/`)
- Custom hooks (`src/hooks/api/`)
- Loading skeletons
- Error boundaries + error messages
- Form validation (React Hook Form + Zod)
- Prefetching (desktop only)
- Lazy loading (images)

**Documentation**: See `docs/api-integration-guide.md` for detailed patterns and examples.

---

## Project Structure

```
src/
├── components/
│   ├── booking/         # Booking form components
│   ├── gallery/         # Gallery components
│   ├── home/            # Homepage sections
│   ├── layout/          # Header, Footer
│   ├── shared/          # Shared components
│   │   ├── skeletons/   # Loading skeletons
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── LazyImage.tsx
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── api/             # TanStack Query hooks
│   │   ├── useServices.ts
│   │   ├── useGallery.ts
│   │   ├── useBookings.ts
│   │   └── useBusinessInfo.ts
│   ├── useHomePage.ts   # Homepage prefetching
│   └── ...
├── lib/
│   ├── apiClient.ts     # Axios instance
│   ├── queryClient.ts   # TanStack Query config
│   └── utils.ts
├── pages/               # Route pages
├── services/            # API service layer
│   ├── services.service.ts
│   ├── gallery.service.ts
│   ├── bookings.service.ts
│   └── ...
├── types/               # Local types (global in @repo/types)
├── App.tsx
└── main.tsx
```

---

## Development

### Setup

```bash
# From root of monorepo
npm install

# Run client app only
npx turbo dev --filter=client

# Or run all apps
npm run dev
```

### Environment Variables

Create `apps/client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

**Production**: Set `VITE_API_URL=/api` (nginx routes to backend)

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 5173)

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run type-check   # TypeScript type checking
npm run lint         # ESLint
npm run lint -- --fix # Auto-fix linting issues
```

---

## Design Guidelines

**Theme**: Warm, cozy, feminine, organic

**Colors**:
- Beige/cream/warm grays (neutrals)
- Soft accents (avoid harsh colors)

**Styling**:
- Border-based design (NO shadows)
- Organic shapes (rounded corners)
- Responsive typography (mobile-first)

**Animations**:
- Motion (Framer Motion)
- Smooth transitions (duration: 300-400ms)
- Fade-in effects

**Full Guidelines**: See `/docs/design-guidelines.md`

---

## Performance

**Optimizations**:
- Prefetching (desktop only, bandwidth-aware)
- Lazy image loading (IntersectionObserver)
- Mobile cache tuning (longer cache for bandwidth)
- Smart retry (skip 4xx errors)
- Code splitting (React.lazy)
- PWA support (service worker)

**Build Stats**:
- Main bundle: ~215KB gzipped
- CSS: ~11.5KB gzipped
- Initial load: <2s on 3G

**Lighthouse Scores** (Target):
- Performance: >80
- Accessibility: >90
- Best Practices: >90
- SEO: >80

---

## Testing

**Manual Testing**:
- All pages tested on desktop + mobile
- Forms validated
- Loading states verified
- Error states verified
- Mobile responsiveness confirmed

**Future**:
- Vitest (unit tests)
- Playwright (E2E tests)

---

## Deployment

**Docker**:

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up client

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**Standalone**:

```bash
npm run build
npm run preview  # Test production build locally
```

**Production URL Structure** (nginx):
- Homepage: `/`
- Services: `/services`
- Gallery: `/gallery`
- Booking: `/booking`
- Contact: `/contact`
- API: `/api/*` (proxied to backend)

---

## Known Limitations

**Future Enhancements**:
- Real-time booking availability
- SSR for SEO (currently CSR)
- Search functionality
- Pagination for large galleries
- Image optimization (Cloudinary transformations)
- User authentication (customer accounts)

---

## Documentation

- **API Integration Guide**: `docs/api-integration-guide.md` - Patterns and examples
- **Design Guidelines**: `/docs/design-guidelines.md` - UI/UX standards
- **Code Standards**: `/docs/code-standards.md` - Coding conventions
- **Main README**: `/README.md` - Monorepo overview

---

## Tech Stack Details

**Frontend**:
- React 19.2 (concurrent features)
- TypeScript 5.9 (strict mode)
- Vite 7.2 (SWC, fast builds)

**Data Fetching**:
- TanStack Query v5 (caching, prefetching)
- Axios (HTTP client)

**Forms**:
- React Hook Form (performance)
- Zod (validation)

**Routing**:
- React Router v7

**Styling**:
- Tailwind CSS v4 (utility-first)
- Radix UI (accessible primitives)
- shadcn/ui pattern (copy-paste components)

**Animations**:
- Motion (Framer Motion fork)

**Build**:
- Turborepo 2.3 (monorepo builds)
- Vite 7.2 (bundling)
- SWC (transpilation)

---

## Contributing

1. Follow design guidelines (`/docs/design-guidelines.md`)
2. Use shared types from `@repo/types`
3. Add loading states for async operations
4. Add error handling with retry
5. Test on mobile + desktop
6. Run `npm run type-check` before committing
7. Run `npm run lint -- --fix` before committing

---

## License

Private project for Pink Nail Salon.
