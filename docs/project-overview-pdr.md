# Project Overview & Product Development Requirements

**Project**: Pink Nail Salon - Complete Business Management System
**Architecture**: Turborepo Monorepo
**Status**: Production-ready
**Version**: 0.1.0
**Last Updated**: 2025-12-31

## Executive Summary

Pink Nail Salon is a production-ready monorepo ecosystem consisting of three interconnected applications: customer website, admin dashboard, and backend API. Built with Turborepo for optimal build performance (79x faster with caching), the system eliminates type duplication through shared packages while maintaining distinct design systems for customer-facing and admin interfaces.

**Key Achievements**:
- **Build Performance**: 7s full build / 89ms cached (79x improvement)
- **Type Safety**: 100% shared types via @repo/types
- **Code Reuse**: 7 shared packages across apps
- **Zero Duplication**: Eliminated 100% type duplication

## System Architecture

### Monorepo Structure

```
pink-nail-salon/
├── apps/
│   ├── client/          # Customer website (React + Vite)
│   ├── admin/           # Admin dashboard (React + Vite)
│   └── api/             # Backend API (NestJS)
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── utils/           # Shared utilities
│   ├── typescript-config/  # TS configurations
│   ├── eslint-config/   # Linting rules
│   ├── tailwind-config/ # Tailwind themes
│   ├── prettier-config/ # Code formatting
│   └── ui/              # UI components (intentionally empty)
└── tooling/
    └── prettier-config/ # Tooling config
```

### Applications

#### Client App (apps/client)
**Purpose**: Customer-facing website for service browsing, booking, and engagement
**Port**: 5173 (dev) / 80 (prod)
**Tech**: React 19.2 + Vite 7.2 + TypeScript 5.9

**Features**:
- Service browsing with filters
- Online booking system
- Gallery showcase
- Contact forms
- PWA support

**Design**:
- Warm, cozy, feminine aesthetic
- Soft neutrals (beige, cream, warm grays)
- Border-based design (NO shadows)
- Organic shapes
- Motion (Framer Motion) animations

**Pages**:
- Home (Hero, About, Services, Gallery sections)
- Services (filterable service cards)
- Gallery (categorized images with modals)
- Booking (multi-step form)
- Contact (business info + customer messages)

#### Admin App (apps/admin)
**Purpose**: Business dashboard for salon management
**Port**: 5174 (dev) / 81 (prod)
**Tech**: React 19.2 + Vite 7.2 + TypeScript 5.9

**Features**:
- Service management (CRUD)
- Gallery management (CRUD, categories)
- Booking management (view, update status)
- Contact management (business info, messages)
- Analytics dashboard (future)

**Design**:
- Professional, clean, modern
- Blue theme (shadcn/ui style)
- Glassmorphism with shadows
- Structured layouts
- Simple CSS transitions

**Modules**:
- Dashboard (overview + analytics)
- Services (manage service catalog)
- Gallery (manage images + categories)
- Bookings (manage appointments)
- Contacts (business info + customer messages)
- Settings (app config + banner management)

#### API App (apps/api)
**Purpose**: Backend services and data management
**Port**: 3000 (dev & prod)
**Tech**: NestJS 11 + TypeScript 5.7

**Features**:
- RESTful API endpoints
- JWT authentication (access + refresh tokens)
- MongoDB + Mongoose (data persistence)
- Redis (caching, sessions)
- Cloudinary (image uploads)
- Rate limiting & throttling
- Health checks

**Modules**:
- Auth (register, login, refresh, logout)
- Services (CRUD operations)
- Gallery (CRUD + categories)
- Bookings (CRUD + status management)
- Upload (Cloudinary integration)
- Health (service health checks)

### Shared Packages

#### @repo/types
**Purpose**: Centralized TypeScript type definitions
**Exports**:
- `service` - Service, ServiceCategory types
- `gallery` - Gallery, GalleryCategory types
- `booking` - Booking, BookingStatus types
- `auth` - User, LoginCredentials types

**Impact**: Eliminated 100% type duplication between client and admin

#### @repo/utils
**Purpose**: Shared utility functions and hooks
**Exports**:
- `cn` - Tailwind class name merger (clsx + tailwind-merge)
- `format` - formatCurrency, formatDate, formatPhoneNumber
- `hooks` - useDebounce (shared React hook)

**Usage**: All apps import utilities instead of duplicating code

#### @repo/typescript-config
**Purpose**: Centralized TypeScript configurations
**Configs**:
- `base.json` - Common TS settings (strict mode, ES2022)
- `react.json` - React-specific settings (JSX preserve, DOM lib)
- `nestjs.json` - Node.js backend settings (CommonJS, Node libs)

**Benefits**: Consistent TypeScript settings across all apps

#### @repo/eslint-config
**Purpose**: Centralized ESLint rules
**Configs**:
- `react.js` - React + TypeScript linting
- `nestjs.js` - NestJS + Node.js linting

**Rules**: Perfectionist plugin, React hooks, React refresh

#### @repo/tailwind-config
**Purpose**: Tailwind CSS theme configurations
**Configs**:
- `base.js` - Common Tailwind settings
- `client-theme.js` - Warm theme for customer site
- `admin-theme.js` - Blue theme for dashboard

**Design Separation**: Maintains distinct visual identities per app

#### @repo/prettier-config
**Purpose**: Code formatting standards
**Config**: Standard Prettier rules for consistency

#### packages/ui
**Purpose**: Placeholder for potential shared UI components
**Status**: **Intentionally empty**
**Rationale**: Client and admin have fundamentally different design systems (warm/organic vs professional/modern), making component sharing impractical. Only shared hook: useDebounce in @repo/utils.

## Tech Stack

### Frontend (Client + Admin)

**Core**:
- React 19.2
- TypeScript 5.9
- Vite 7.2 (SWC compiler)

**Styling**:
- Tailwind CSS v4
- Radix UI primitives
- shadcn/ui pattern

**Routing**:
- React Router v7

**Forms**:
- React Hook Form 7.54
- Zod (client) / Yup (admin) validation
- @hookform/resolvers

**State Management**:
- Zustand (global state)
- TanStack Query (server state, data fetching)

**Animations**:
- Motion (Framer Motion) for client
- CSS transitions for admin

**HTTP Client**:
- Axios with interceptors

### Backend (API)

**Framework**:
- NestJS 11
- TypeScript 5.7
- Node.js 25 (Alpine Linux)

**Database**:
- MongoDB 9.0 (primary database)
- Mongoose 9.1 (ODM)

**Caching**:
- Redis 7.4
- ioredis 5.4 (client)

**Authentication**:
- JWT (access + refresh tokens)
- Argon2 (password hashing)
- @nestjs/jwt

**Validation**:
- class-validator
- class-transformer

**File Upload**:
- Cloudinary SDK
- Multer (multipart/form-data)

**Security**:
- @nestjs/throttler (rate limiting)
- Helmet (HTTP headers)
- CORS configuration

### Build System & DevOps

**Turborepo**:
- Version 2.3.0
- Build orchestration
- Task caching (79x faster)
- Parallel execution

**Package Management**:
- npm workspaces
- npm 11.7.0
- Node >= 20.0.0

**Containerization**:
- Docker multi-stage builds
- Docker Compose (dev + prod)
- BuildKit cache mounts
- Non-root users (uid 1001)

**Reverse Proxy**:
- Nginx 1.27 (Alpine)
- Production routing (/, /admin, /api)
- Static file serving

## Production Architecture

### Nginx Reverse Proxy

**Routes**:
```
http://localhost/          → client:80       (customer website)
http://localhost/admin     → admin:81        (dashboard)
http://localhost/api       → api:3000        (backend)
http://localhost/health    → api:3000/health (health check)
```

**Static Files**:
- Client: Nginx serves from /usr/share/nginx/html/client
- Admin: Nginx serves from /usr/share/nginx/html/admin

**Benefits**:
- Single entry point (port 80/443)
- Path-based routing
- Static file optimization
- Load balancing ready

### Docker Services

**Development** (`docker-compose.dev.yml`):
- Hot-reload enabled (CHOKIDAR_USEPOLLING=true)
- Volume mounts for source code
- Direct port access (5173, 5174, 3000)
- MongoDB + Redis containers

**Production** (`docker-compose.prod.yml`):
- Multi-stage builds (optimized images)
- Nginx reverse proxy
- Resource limits (CPU, memory)
- Health checks + dependencies
- Log rotation

### Multi-Stage Dockerfile Strategy

**Client/Admin**:
1. **base**: Node.js Alpine base image
2. **deps**: Install dependencies with cache mounts
3. **dev**: Development stage (hot-reload)
4. **builder**: Build app with Turbo
5. **production**: Nginx serving static files

**API**:
1. **base**: Node.js Alpine base image
2. **deps**: Install all dependencies
3. **dev**: Development stage (watch mode)
4. **builder**: Build app with Turbo
5. **prod-deps**: Install only production dependencies
6. **production**: Run NestJS with PM2

## Performance Metrics

### Build Performance

**Before Turborepo Migration**:
- Build time: ~20s per app (sequential)
- Type duplication: 100% (client/admin)
- No caching: Every build from scratch

**After Turborepo Migration**:
- Full build: 7.023s (all apps, parallel)
- Cached build: 89ms (FULL TURBO)
- Type duplication: 0% (@repo/types)
- Cache hit rate: 100% on repeat builds

**Improvement**: 79x faster with caching (98.7% time reduction)

### Type-Check Performance

**Parallel Execution**:
- All apps: 3.937s
- Turborepo parallelizes across apps
- Shared configs ensure consistency

### Docker Build Performance

**BuildKit Cache Mounts**:
- npm dependencies cached between builds
- Faster rebuilds on code changes
- Efficient layer caching

## Functional Requirements

### Customer Website (Client)

**FR-C1: Service Browsing**
- Display service catalog with images, names, descriptions, prices
- Filter services by category (Manicure, Pedicure, etc.)
- Responsive grid layout

**FR-C2: Online Booking**
- Multi-step booking form (service → date/time → customer info)
- Date picker with business hours validation
- Form validation (Yup schemas)
- Submit booking to API

**FR-C3: Gallery Showcase**
- Display categorized nail art images
- Filter by category
- Lightbox modal for image viewing
- Lazy loading for performance

**FR-C4: Contact Information**
- Display business hours, address, phone, email
- Contact form submission
- Google Maps integration (future)

**FR-C5: Responsive Design**
- Mobile-first approach
- Tablet and desktop breakpoints
- Touch-friendly interactions

### Admin Dashboard (Admin)

**FR-A1: Service Management**
- CRUD operations for services
- Image upload to Cloudinary
- Category management
- Price and description editing

**FR-A2: Gallery Management**
- CRUD operations for gallery images
- Category assignment
- Bulk upload support
- Image optimization

**FR-A3: Booking Management**
- View all bookings in table
- Filter by status (pending, confirmed, cancelled)
- Update booking status
- Export bookings (future)

**FR-A4: Contact Management**
- Update business hours
- Update contact information
- View customer messages
- Respond to inquiries (future)

**FR-A5: Banner & Hero Settings**
- Manage homepage banners
- Configure hero section settings
- Upload hero background images

**FR-A6: Authentication**
- Admin login with JWT
- Token refresh mechanism
- Logout and session management
- Role-based access (future)

### Backend API (API)

**FR-API1: RESTful Endpoints**
- Services: GET, POST, PATCH, DELETE /services[/:id]
- Gallery: GET, POST, PATCH, DELETE /gallery[/:id]
- Bookings: GET, POST, PATCH, DELETE /bookings[/:id]
- Auth: POST /auth/{register,login,refresh,logout}
- Upload: POST /upload
- Health: GET /health

**FR-API2: Authentication & Authorization**
- JWT access tokens (15min expiry)
- JWT refresh tokens (7d expiry)
- Argon2 password hashing
- Token validation middleware

**FR-API3: Data Validation**
- DTO validation with class-validator
- Transform inputs with class-transformer
- Consistent error responses

**FR-API4: File Upload**
- Cloudinary integration
- Image optimization
- Secure file handling
- Size and type restrictions

**FR-API5: Caching**
- Redis caching for frequently accessed data
- Cache invalidation on updates
- Session storage

**FR-API6: Rate Limiting**
- Throttle API requests (default: 10 req/min)
- Prevent abuse
- Configurable per endpoint

## Non-Functional Requirements

### Performance

**NFR-P1: Build Speed**
- Full build: < 10s
- Cached build: < 100ms
- Achievement: 7s / 89ms ✓

**NFR-P2: Page Load**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse score: > 90

**NFR-P3: API Response**
- Endpoint latency: < 200ms (p95)
- Database queries: < 100ms
- Redis cache hits: < 10ms

### Scalability

**NFR-S1: Horizontal Scaling**
- Stateless API servers (Redis sessions)
- Load balancer ready (Nginx)
- Database replication support

**NFR-S2: Caching Strategy**
- Redis for session and data caching
- Turbo remote caching (future)
- CDN for static assets (future)

### Security

**NFR-SEC1: Authentication**
- Secure JWT implementation
- Argon2 password hashing
- Token rotation on refresh

**NFR-SEC2: Input Validation**
- All inputs validated (DTOs)
- XSS protection
- SQL injection prevention (Mongoose)

**NFR-SEC3: HTTPS**
- Production requires HTTPS
- Secure cookies
- CORS configuration

**NFR-SEC4: Rate Limiting**
- API throttling enabled
- DDoS protection
- Abuse prevention

### Maintainability

**NFR-M1: Code Standards**
- TypeScript strict mode
- ESLint + Prettier enforcement
- YAGNI + KISS + DRY principles

**NFR-M2: Documentation**
- Comprehensive README files
- API documentation (OpenAPI future)
- Code comments for complex logic

**NFR-M3: Testing**
- Unit tests (Jest, Vitest)
- E2E tests (Playwright future)
- API tests (Supertest)

**NFR-M4: Monorepo Benefits**
- Shared packages eliminate duplication
- Centralized tooling configs
- Atomic commits across apps

## Design System Requirements

### Client Design System

**Colors**:
- Background: #fdf8f6 (cream)
- Primary: #c8a882 (warm beige)
- Accent: #8b6f47 (brown)
- Text: #43302b (dark brown)

**Typography**:
- Font family: Poppins-style sans-serif
- Headings: Bold, organic
- Body: Regular, readable

**Components**:
- Borders: 1-2px solid, rounded corners
- Shadows: NONE (border-based design)
- Buttons: Warm tones, hover states
- Cards: Bordered, subtle backgrounds

### Admin Design System

**Colors**:
- Background: #f8fafc (light gray)
- Primary: #3b82f6 (blue)
- Accent: #0ea5e9 (sky blue)
- Text: #1e293b (slate)

**Typography**:
- Font family: Inter-style sans-serif
- Headings: Semibold, structured
- Body: Regular, professional

**Components**:
- Borders: Subtle, shadows enabled
- Shadows: Box shadows for depth (glassmorphism)
- Buttons: Blue tones, smooth transitions
- Cards: Shadowed, clean backgrounds

**Critical**: UI components NOT shared due to fundamentally different design philosophies.

## Data Models

### Service
```typescript
interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  category: ServiceCategory;
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum ServiceCategory {
  MANICURE = "manicure",
  PEDICURE = "pedicure",
  NAIL_ART = "nail-art",
  EXTENSIONS = "extensions",
  SPA = "spa"
}
```

### Gallery
```typescript
interface Gallery {
  _id: string;
  title: string;
  imageUrl: string;
  category: GalleryCategory;
  description?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

enum GalleryCategory {
  MANICURE = "manicure",
  PEDICURE = "pedicure",
  NAIL_ART = "nail-art",
  EXTENSIONS = "extensions"
}
```

### Booking
```typescript
interface Booking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string; // Service ID
  date: Date;
  time: string; // "HH:mm" format
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed"
}
```

### User (Admin)
```typescript
interface User {
  _id: string;
  email: string;
  password: string; // Argon2 hashed
  name: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff"
}
```

## API Endpoints

See `./api-endpoints.md` for complete reference.

**Quick Reference**:
- `POST /auth/register` - Register admin user
- `POST /auth/login` - Login (returns access + refresh tokens)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate refresh token)
- `GET /services` - List services (supports filters)
- `POST /services` - Create service (admin)
- `PATCH /services/:id` - Update service (admin)
- `DELETE /services/:id` - Delete service (admin)
- `GET /gallery` - List gallery images (supports filters)
- `POST /gallery` - Upload gallery image (admin)
- `GET /bookings` - List bookings (admin)
- `POST /bookings` - Create booking (public)
- `PATCH /bookings/:id` - Update booking status (admin)
- `POST /upload` - Upload image to Cloudinary (admin)
- `GET /health` - Health check

## Deployment

### Development

```bash
# Local development
npm install
npm run dev

# Docker development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production

```bash
# Setup environment
cp apps/client/.env.example apps/client/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with production credentials

# Deploy with Docker
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify deployment
docker compose ps
docker compose logs -f nginx
```

### Environment Variables

**Client** (`apps/client/.env`):
- `VITE_API_BASE_URL` - API base URL (dev: http://localhost:3000, prod: /api)

**Admin** (`apps/admin/.env`):
- `VITE_API_BASE_URL` - API base URL
- `VITE_USE_MOCK_API` - Use mock data (dev: true, prod: false)

**API** (`apps/api/.env`):
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Testing Strategy

### Unit Testing
- **Client/Admin**: Vitest (future implementation)
- **API**: Jest (implemented for core modules)

### Integration Testing
- **API**: Supertest (E2E tests for endpoints)
- Database integration tests with MongoDB Memory Server

### E2E Testing
- **Client/Admin**: Playwright (future implementation)
- User flow testing (booking, service browsing)

### Manual Testing
- Currently primary testing method
- Comprehensive user flow validation
- Cross-browser testing

## Future Enhancements

### Phase 1 (Near-term)
- Remote caching for Turborepo (GitHub Actions)
- CI/CD pipeline (automated testing + deployment)
- OpenAPI/Swagger documentation
- Google Maps integration (client contact page)

### Phase 2 (Mid-term)
- Analytics dashboard (admin)
- Email notifications (booking confirmations)
- SMS reminders (booking reminders)
- Payment integration (Stripe/SePay)

### Phase 3 (Long-term)
- Customer portal (booking history, profile)
- Loyalty program
- Appointment rescheduling
- Staff scheduling module
- Inventory management

## Success Metrics

**Technical**:
- Build time: < 10s (✓ 7s achieved)
- Cached build: < 100ms (✓ 89ms achieved)
- Type duplication: 0% (✓ achieved)
- Code coverage: > 80% (future)

**Business**:
- Uptime: > 99.5%
- API latency: < 200ms (p95)
- Customer booking completion rate: > 70%
- Admin task completion time: < 30s per operation

## Conclusion

Pink Nail Salon represents a production-ready monorepo demonstrating modern web development best practices. The Turborepo migration achieved significant performance improvements while maintaining code quality and developer experience. The system is fully containerized, scalable, and ready for production deployment with comprehensive documentation and clear upgrade paths.

---

**Document Version**: 1.0
**Last Review**: 2025-12-31
**Next Review**: Q2 2025
