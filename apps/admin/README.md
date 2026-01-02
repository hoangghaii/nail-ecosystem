# Pink Nail Salon - Admin Dashboard

Modern admin dashboard for managing Pink Nail Salon's business operations, built with React 19, TypeScript, and Vite.

---

## Features

### Core Functionality
- **Authentication** - JWT-based auth with auto token refresh
- **Services Management** - CRUD operations for nail services
- **Gallery Management** - Upload and organize portfolio images
- **Bookings Management** - View and manage customer appointments
- **Banner Management** - Control hero carousel banners
- **Contact Inquiries** - Respond to customer messages
- **Business Info** - Update salon contact details and hours
- **Hero Settings** - Configure homepage carousel behavior

### Technical Features
- **Real-time API Integration** - NestJS backend with auto JWT refresh
- **Image Upload** - Cloudinary integration via API
- **Type Safety** - Shared types via `@repo/types`
- **Form Validation** - React Hook Form + Zod
- **State Management** - Zustand
- **Toast Notifications** - Sonner
- **Design System** - shadcn/ui with custom theme

---

## Tech Stack

- **Framework**: React 19.2 + TypeScript 5.9
- **Build Tool**: Vite 7.2 (SWC)
- **Styling**: Tailwind CSS v4 + Radix UI
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **API Client**: Native Fetch with auto JWT handling
- **UI Components**: shadcn/ui pattern

---

## Prerequisites

**Running Services Required**:
- ✅ API backend on `localhost:3000` (NestJS)
- ✅ MongoDB connected
- ✅ Redis connected
- ✅ Cloudinary configured
- ✅ Test admin user created in database

---

## Setup

### 1. Environment Configuration

```bash
# Copy example env
cp .env.example .env

# Edit .env
nano .env
```

**Environment Variables**:

```bash
# API Base URL
# Dev: http://localhost:3000
# Prod: /api (nginx proxy)
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
# From project root
npm install

# Or from admin directory
cd apps/admin && npm install
```

### 3. Start Development Server

```bash
# From project root (with Turborepo)
npm run dev

# Or from admin directory
npm run dev
```

Admin dashboard will be available at: **http://localhost:5174**

---

## Development

### Project Structure

```
apps/admin/
├── src/
│   ├── components/         # UI components
│   │   ├── layout/        # Layout components (Header, Sidebar, etc.)
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Core utilities
│   │   └── apiClient.ts   # HTTP client with JWT auto-refresh
│   ├── pages/             # Page components (routes)
│   ├── services/          # API service layer
│   │   ├── auth.service.ts
│   │   ├── services.service.ts
│   │   ├── gallery.service.ts
│   │   ├── bookings.service.ts
│   │   ├── banners.service.ts
│   │   ├── contacts.service.ts
│   │   ├── businessInfo.service.ts
│   │   ├── heroSettings.service.ts
│   │   └── imageUpload.service.ts
│   ├── store/             # Zustand state management
│   ├── types/             # App-specific types
│   └── main.tsx           # Entry point
├── .env                   # Environment variables (git-ignored)
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Available Scripts

```bash
npm run dev          # Start development server (port 5174)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code with ESLint
npm run type-check   # TypeScript type checking
```

---

## API Integration

### Authentication Flow

1. **Login**: POST `/auth/login` → receive `accessToken` + `refreshToken`
2. **Auto Token Injection**: All API calls include `Authorization: Bearer {token}`
3. **Auto Refresh**: On 401 response → POST `/auth/refresh` → retry with new token
4. **Logout**: POST `/auth/logout` → clear tokens + redirect

### API Client Usage

```typescript
import { apiClient } from "@/lib/apiClient";

// GET request
const services = await apiClient.get<Service[]>("/services");

// POST request
const newService = await apiClient.post<Service>("/services", {
  name: "Gel Manicure",
  price: 50,
  duration: 60,
});

// PATCH request
const updated = await apiClient.patch<Service>(`/services/${id}`, {
  price: 55,
});

// DELETE request
await apiClient.delete(`/services/${id}`);

// File upload
const url = await apiClient.upload(file, "gallery");
```

### Error Handling

```typescript
import { ApiError } from "@repo/utils/api";

try {
  await apiClient.post("/services", data);
  toast.success("Service created!");
} catch (error) {
  if (ApiError.isApiError(error)) {
    toast.error(error.getUserMessage());
  }
}
```

---

## Authentication

### Default Credentials

**Development**:
```
Email: admin@pinknail.com
Password: (create in API database)
```

### Creating Admin User

```bash
# Via API endpoint
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pinknail.com",
    "password": "your_secure_password",
    "name": "Admin User",
    "role": "admin"
  }'
```

---

## Shared Packages

This app uses monorepo shared packages:

- **@repo/types** - Shared TypeScript types (Service, Booking, Gallery, etc.)
- **@repo/utils** - Utilities (cn, formatters, ApiError, useDebounce)
- **@repo/typescript-config** - TypeScript config (react.json)
- **@repo/eslint-config** - ESLint rules (react.js)
- **@repo/tailwind-config** - Tailwind theme (admin-theme.js)

**Import Example**:
```typescript
import { Service, ServiceCategory } from "@repo/types/service";
import { ApiError } from "@repo/utils/api";
import { cn } from "@repo/utils/cn";
import { formatCurrency } from "@repo/utils/format";
```

---

## Building for Production

### Build Command

```bash
# From project root
npm run build

# Or from admin directory
npm run build
```

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── index.html
```

### Environment Configuration

**Production `.env`**:
```bash
VITE_API_BASE_URL=/api
```

Nginx routes `/api/*` → backend server

---

## Deployment

### Docker Development

```bash
# From project root
docker compose -f docker-compose.yml -f docker-compose.dev.yml up admin
```

### Docker Production

```bash
# From project root
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Admin accessible at: `/admin` (via Nginx reverse proxy)

---

## Design System

### Theme

- **Colors**: Professional blue theme
- **Design**: Glassmorphism with shadows
- **Typography**: Geist Sans + Geist Mono
- **Animations**: Simple CSS transitions

### Key Components

- **Dashboard Cards** - Metrics overview
- **Data Tables** - Sortable, filterable tables
- **Forms** - React Hook Form + Zod validation
- **Modals** - Dialog components
- **Image Upload** - Drag-drop with preview
- **Toast Notifications** - Success/error messages

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5174
lsof -ti:5174 | xargs kill -9

# Or change port in vite.config.ts
```

### API Connection Failed

```bash
# Check API is running
curl http://localhost:3000/health

# Check environment variable
echo $VITE_API_BASE_URL

# Verify .env file
cat .env
```

### Build Errors

```bash
# Clear cache
npm run clean
rm -rf node_modules .turbo dist
npm install

# Type-check
npm run type-check

# Rebuild
npm run build
```

### Authentication Issues

```bash
# Clear browser storage
localStorage.clear()

# Check tokens
localStorage.getItem('auth_token')
localStorage.getItem('refresh_token')

# Verify API auth endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pinknail.com","password":"your_password"}'
```

---

## Performance

### Build Metrics

- **Bundle Size**: ~640KB (minified)
- **Build Time**: ~12s
- **Type-check Time**: ~6s

### Optimization Tips

1. **Code Splitting**: Use dynamic imports for routes
2. **Image Optimization**: Cloudinary auto-optimization
3. **Caching**: Turborepo caches builds (79x faster repeat builds)

---

## Contributing

### Code Standards

- **Style**: ESLint + Prettier (automatic)
- **Types**: Strict TypeScript
- **Naming**: kebab-case files, PascalCase components
- **Imports**: Absolute paths with `@/*` alias

### Commit Conventions

```bash
# Feature
git commit -m "feat(services): add bulk delete functionality"

# Fix
git commit -m "fix(auth): handle token refresh race condition"

# Docs
git commit -m "docs(readme): update API integration guide"
```

---

## Testing

### Manual Testing Checklist

**Authentication**:
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error shown)
- [ ] Token auto-refresh on 401
- [ ] Logout clears tokens

**Services CRUD**:
- [ ] List all services
- [ ] Create new service
- [ ] Update service
- [ ] Delete service
- [ ] Toggle featured status

**Gallery**:
- [ ] Upload single image
- [ ] Upload multiple images
- [ ] Delete image
- [ ] Toggle featured

**Bookings**:
- [ ] View all bookings
- [ ] Update booking status
- [ ] Filter by status
- [ ] Filter by date range

---

## License

Private - Pink Nail Salon

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review main project README: `/README.md`
- Check API documentation: `/docs/api-endpoints.md`

---

**Last Updated**: 2026-01-01
**Version**: 0.1.0
**Status**: Production-ready with real API integration
