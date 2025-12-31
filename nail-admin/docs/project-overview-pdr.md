# Project Overview & Product Development Requirements (PDR)

**Project Name**: Pink Nail Admin Dashboard
**Version**: 0.1.0
**Last Updated**: 2025-12-04
**Status**: Active Development - Foundation + Banner CRUD Complete
**Repository**: /Users/hainguyen/Documents/nail-project/nail-admin

## Executive Summary

Pink Nail Admin Dashboard is a modern React-based admin panel for managing nail salon business operations. Built with shadcn/ui's professional blue theme and Zustand state management, it provides comprehensive CRUD operations for banners, services, gallery, bookings, and customer contacts. The system features a dual-mode architecture supporting both mock data (for development) and real API integration (for production).

## Project Purpose

### Vision

Provide nail salon businesses with a professional, easy-to-use admin dashboard that streamlines business operations and enhances customer service management.

### Mission

Deliver a type-safe, performant, and maintainable admin panel that:

- Simplifies content management (banners, services, gallery)
- Streamlines booking and customer inquiry handling
- Provides seamless integration with client-facing website
- Supports rapid development with mock data
- Enables smooth transition to production API

### Value Proposition

- **Professional Design**: shadcn/ui blue theme with consistent, modern aesthetics
- **Type Safety**: Full TypeScript coverage with shared types from client project
- **Developer Experience**: Zustand state management, React Hook Form, Zod validation
- **Flexible Architecture**: Dual-mode service layer (mock/real API)
- **Production Ready**: Firebase Storage, authentication, protected routes

## Target Users

### Primary User

**Nail Salon Admin/Manager**

- Manages business content (banners, services, gallery)
- Handles customer bookings and inquiries
- Updates pricing and service offerings
- Monitors business operations

## Key Features

### 1. Authentication System ✅

- JWT-based authentication with mock login
- Protected routes with automatic redirect
- Session persistence with localStorage
- Demo credentials for development
- Zustand store for auth state management

### 2. Banner Management (Complete CRUD) ✅

**Features**:

- Create/edit/delete hero section banners
- Image and video upload to Firebase Storage
- Drag-and-drop reordering (HTML5 native API)
- Primary banner selection
- Active/inactive toggle
- Type field (image/video) for filtering
- Hero display mode settings (Image/Video/Carousel)
- Auto-save settings
- Mock data initialization

**Technical Details**:

- Zustand store (`bannersStore`) for state management
- TanStack Table for data display
- React Hook Form + Zod for validation
- Firebase Storage integration
- Type-safe service layer with dual-mode support

### 3. Hero Settings Component ✅

**Features**:

- Display mode selection (Image/Video/Carousel)
- Carousel interval configuration (2-10 seconds)
- Navigation controls toggle
- Auto-save on changes
- Primary banner preview
- Warning for missing primary banner
- Filtering by banner type

**Technical Details**:

- Zustand store (`heroSettingsStore`) for settings
- RadioGroup for mode selection
- Slider for interval control
- Real-time validation and save

### 4. Shared Component Library ✅

- **DataTable**: TanStack Table v8 with sorting, pagination
- **ImageUpload**: Firebase Storage with drag-drop, preview, validation
- **VideoUpload**: Firebase Storage for video files
- **StatusBadge**: Variant-based status indicators
- **Form Components**: Dialog, Input, Label, Textarea, Switch, RadioGroup

### 5. Gallery CRUD (Complete) ✅

**Features**:

- Create/edit/delete gallery items
- Image upload to Firebase Storage
- Category filtering (all, extensions, manicure, nail-art, pedicure, seasonal)
- Featured item toggle
- Bulk selection and delete operations
- Grid view with image preview
- Mock data initialization with 20 sample items

**Technical Details**:

- Zustand store (`galleryStore`) for state management
- Grid layout for gallery display
- React Hook Form + Zod for validation
- Type-safe service layer with dual-mode support

### 6. Services CRUD (Planned)

- Manage nail services with categories
- Pricing and duration configuration
- Image uploads for service previews
- Featured service toggle
- Category filtering

### 7. Bookings Management (Planned)

- View customer bookings
- Status updates (pending/confirmed/completed/cancelled)
- Customer information display
- Booking notes and special requests
- Date and service filtering

### 8. Contacts Management (Planned)

- Customer inquiry management
- Admin notes and follow-up status
- Response functionality
- Contact archival

## Technical Requirements

### Functional Requirements

**FR1: Authentication**

- Secure login with JWT tokens
- Protected routes requiring authentication
- Session persistence across page reloads
- Automatic logout on token expiry

**FR2: Banner Management**

- Full CRUD operations (create, read, update, delete)
- Image/video upload to Firebase Storage
- Drag-and-drop reordering
- Primary banner selection (only one primary)
- Active/inactive status toggle
- Hero display mode configuration

**FR3: State Management**

- Zustand stores for global state
- In-memory state for banners and hero settings
- localStorage persistence for authentication
- Auto-initialization with mock data

**FR4: Type Safety**

- TypeScript strict mode compliance
- Shared types with client project
- Type-safe service layer
- Zod schema validation for forms

**FR5: Dual-Mode Architecture**

- Environment variable toggle (`VITE_USE_MOCK_API`)
- Mock mode with in-memory state
- API mode with REST endpoints
- No code changes needed to switch modes

### Non-Functional Requirements

**NFR1: Performance**

- Page load time < 2 seconds
- Smooth drag-drop interactions
- Optimized bundle size
- Lazy loading for images/videos

**NFR2: Usability**

- Responsive design (mobile/tablet/desktop)
- Intuitive UI with clear navigation
- Toast notifications for user feedback
- Loading states for async operations

**NFR3: Maintainability**

- Modular component structure
- Reusable shared components
- Clear separation of concerns
- Comprehensive type definitions

**NFR4: Security**

- JWT token authentication
- Protected routes
- File upload validation (type, size)
- Firebase Storage security rules

**NFR5: Accessibility**

- WCAG 2.1 AA compliance via Radix UI
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels

## Technology Stack

### Frontend

- **React**: 19.2 - UI library
- **TypeScript**: 5.9 - Type safety
- **Vite**: 7.2 - Build tool
- **Tailwind CSS**: 4.0 - Styling

### UI & Components

- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Component patterns (blue theme)
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Forms & Validation

- **React Hook Form**: 7.54 - Form management
- **Zod**: 3.24 - Schema validation
- **@hookform/resolvers**: React Hook Form + Zod integration

### State & Data

- **Zustand**: 5.0 - State management
- **TanStack Table**: 8.21 - Data tables
- **React Router**: 6.28 - Routing

### Cloud Services

- **Firebase**: 11.1 - Storage for images/videos

### Development Tools

- **ESLint**: 9.17 - Linting
- **Prettier**: 3.4 - Code formatting
- **Husky**: 9.1 - Git hooks

## Implementation Status

### Phase 1: Foundation (Complete - Nov 30, 2025) ✅

- Project setup and dependencies
- TypeScript configuration with strict mode
- shadcn/ui blue theme design system
- Layout components (Sidebar, Topbar, Layout)
- Authentication system with Zustand store
- Protected routes
- Firebase Storage configuration

### Phase 2: Banner CRUD (Complete - Dec 3, 2025) ✅

- Banner types and hero settings types
- Zustand stores (bannersStore, heroSettingsStore)
- Service layer with dual-mode support
- DataTable component with TanStack Table
- ImageUpload and VideoUpload components
- Banner CRUD page with full operations
- HeroSettingsCard component
- Drag-and-drop reordering
- Mock data initialization

### Phase 3: Gallery CRUD (Complete - Dec 4, 2025) ✅

- Gallery image management
- Category filtering and featured toggle
- Bulk delete operations
- Mock data initialization

### Phase 4: Services CRUD (Planned)

- Services management system
- Category filtering
- Pricing and duration configuration

### Phase 5: Bookings & Contacts (Planned)

- Bookings management (view-only with status updates)
- Contacts management with admin notes

## Success Metrics

### Development Metrics

- **TypeScript Coverage**: 100% (no `any` types)
- **Build Status**: 0 errors (warnings acceptable)
- **Code Quality**: 8.0+/10 per feature
- **Type Compliance**: verbatimModuleSyntax pass

### Feature Completeness

- **Banner CRUD**: 100% ✅
- **Gallery CRUD**: 100% ✅ (except bulk upload UI)
- **Services CRUD**: 0% (planned)
- **Bookings**: 0% (planned)
- **Contacts**: 0% (planned)
- **Overall Progress**: 50% (2 of 4 CRUD features)

### User Experience

- Responsive design on all devices
- Accessible UI (WCAG 2.1 AA)
- Fast page loads (< 2s)
- Clear error messages
- Smooth interactions

## Constraints & Limitations

### Technical Constraints

- Client-side only (no SSR)
- Firebase Storage dependency
- Single admin user (no multi-user roles yet)
- Video uploads limited to 50MB

### Design Constraints

- Light mode only (dark mode planned)
- English language only (no i18n yet)
- Desktop-first design (mobile responsive)

### Operational Constraints

- Requires Firebase project configuration
- Demo credentials for development
- No real backend API yet

## Risks & Mitigation

| Risk                             | Impact | Likelihood | Mitigation                        |
| -------------------------------- | ------ | ---------- | --------------------------------- |
| Type incompatibility with client | High   | Low        | Regular sync checks, shared types |
| Firebase quota exhaustion        | Medium | Low        | Monitor usage, size limits        |
| Build size growth                | Medium | Medium     | Code splitting, lazy loading      |
| Performance regression           | Medium | Medium     | Performance monitoring            |

## Companion Project

**Pink Nail Client Website**

- Location: `/Users/hainguyen/Documents/nail-project/nail-client`
- Relationship: Shares type definitions (Service, Gallery, Booking)
- **CRITICAL**: Types must remain compatible between projects

## Related Documentation

- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Project Roadmap](./project-roadmap.md)
- [Design Guidelines](./design-guidelines.md)

## Unresolved Questions

None at this time. Banner and Gallery CRUD implementations are complete and documented.
