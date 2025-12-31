# Shared Packages Overview

**Location**: `/packages`
**Count**: 7 packages
**Purpose**: Code sharing across monorepo apps

## Package Summary

| Package | Type | Exports | Usage |
|---------|------|---------|-------|
| @repo/types | Types | 4 (service, gallery, booking, auth) | All apps |
| @repo/utils | Utils | 3 (cn, format, hooks) | All apps |
| @repo/typescript-config | Config | 3 (base, react, nestjs) | All apps |
| @repo/eslint-config | Config | 2 (react, nestjs) | All apps |
| @repo/tailwind-config | Config | 3 (base, client, admin) | Frontend apps |
| @repo/prettier-config | Config | 1 (standard) | All apps |
| packages/ui | UI | 0 (empty) | None - intentionally empty |

---

## @repo/types

**Purpose**: Single source of truth for TypeScript types

**Exports**:
```typescript
// @repo/types/service
export type Service = { id, name, description, price, duration, category, imageUrl?, featured? }
export const ServiceCategory = { EXTENSIONS, MANICURE, NAIL_ART, PEDICURE, SPA }
export type ServiceCardProps = { variant: "default" | "featured" | "compact" }

// @repo/types/gallery
export type GalleryItem = { id, imageUrl, title, category, featured, metadata }
export const GalleryCategory = { ALL, EXTENSIONS, MANICURE, NAIL_ART, PEDICURE, SEASONAL }

// @repo/types/booking
export type Booking = { id, customerInfo, serviceId, date, timeSlot, status, notes }
export const BookingStatus = { PENDING, CONFIRMED, COMPLETED, CANCELLED }
export type CustomerInfo = { firstName, lastName, email, phone }

// @repo/types/auth
export type User = { id, name, email, role, avatar? }
export type AuthResponse = { token, user, expiresAt }
export type LoginCredentials = { email, password, rememberMe? }
```

**Impact**: 100% type duplication eliminated

---

## @repo/utils

**Purpose**: Shared utilities and React hooks

**Exports**:
```typescript
// @repo/utils/cn
export function cn(...inputs: ClassValue[]): string
// Uses clsx + tailwind-merge for className optimization

// @repo/utils/format
export function formatCurrency(amount: number): string  // "$99.00"
export function formatDate(date: Date | string): string // "December 31, 2025"
export function formatTime(date: Date | string): string // "11:59 PM"

// @repo/utils/hooks
export function useDebounce<T>(value: T, delay?: number): T
// Default delay: 300ms, used in admin search (BookingsPage, ContactsPage, GalleryPage)
```

**Dependencies**: clsx, tailwind-merge
**Peer Dependencies**: react ^18 || ^19

---

## @repo/typescript-config

**Purpose**: Centralized TypeScript configurations

**Files**:
- **base.json**: Strict mode, ES modules, verbatim syntax
- **react.json**: Extends base + React/Vite specifics (ES2020, ESNext, JSX)
- **nestjs.json**: Extends base + Node/NestJS specifics (ES2021, commonjs, decorators)

**Usage**:
```json
// apps/client/tsconfig.json
{
  "extends": "@repo/typescript-config/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## @repo/eslint-config

**Purpose**: Consistent linting rules

**Files**:
- **react.js**: For React/Vite apps (perfectionist sorting, react-hooks, react-refresh)
- **nestjs.js**: For NestJS apps (relaxed rules for decorators/any)

**Features**:
- Alphabetical imports/interfaces/objects (perfectionist plugin)
- React hooks rules
- TypeScript recommended rules
- Ignores: dist, build, node_modules, .turbo, .claude

---

## @repo/tailwind-config

**Purpose**: Design system themes

**Files**:
- **base.js**: Empty template
- **client-theme.js**: Warm/cozy theme (beige/cream palette fdf8f6 → 43302b)
- **admin-theme.js**: Professional theme (blue palette, CSS variables)

**Design Separation**:
- Client: Borders, NO shadows, organic shapes
- Admin: Glassmorphism, WITH shadows, modern

---

## @repo/prettier-config

**Purpose**: Code formatting consistency

**Config**: Standard Prettier settings

---

## packages/ui

**Status**: **Intentionally Empty**

**Reason**: Different design systems prevent sharing

**Analysis**:
- Admin: 31 components (10 shadcn/ui + 21 custom)
- Client: 31 components (15 shadcn/ui + 16 custom)
- Common names (button, card, etc.) have different styling
- Only 1 shareable item found: useDebounce (moved to @repo/utils)

**Decision**: Keep UI components separate per app

**Documentation**: See `packages/ui/README.md`

---

## Import Patterns

**Types**:
```typescript
import { Service, ServiceCategory } from "@repo/types/service";
import { Booking, BookingStatus } from "@repo/types/booking";
```

**Utils**:
```typescript
import { cn } from "@repo/utils/cn";
import { formatCurrency, formatDate } from "@repo/utils/format";
import { useDebounce } from "@repo/utils/hooks";
```

**Configs**:
```json
// tsconfig.json
{ "extends": "@repo/typescript-config/react.json" }

// eslint.config.js
import reactConfig from "@repo/eslint-config/react.js";

// tailwind.config.js
import clientTheme from "@repo/tailwind-config/client-theme.js";
```

---

## Architecture Benefits

1. **Type Safety**: Shared types prevent drift
2. **Code Reuse**: Utilities used across all apps
3. **Consistency**: Centralized configs enforce standards
4. **Maintainability**: Update once, apply everywhere
5. **Performance**: Turborepo caches shared package builds

---

**Total Packages**: 7 (6 active + 1 intentionally empty)
**Type Duplication**: 0% (eliminated)
**Shared Code**: ~500 LOC across packages
