# Code Standards

Pink Nail Salon - Turborepo Monorepo - Coding Conventions & Best Practices

---

## Core Principles

**YAGNI** - You Aren't Gonna Need It
**KISS** - Keep It Simple, Stupid
**DRY** - Don't Repeat Yourself

**Monorepo-Specific**:
- Share code via packages, not duplication
- Single source of truth for types (@repo/types)
- Centralized tooling configs

---

## General Guidelines

### File Naming
- **kebab-case** for all file names
- Descriptive names that convey purpose without reading content
- Examples: `user-authentication-service.ts`, `booking-form-validation.ts`

### File Size Management
- Keep code files under 200 lines for optimal context management
- Split large files into focused components/modules
- Use composition over inheritance
- Extract utilities into separate modules

---

## TypeScript Standards

### Configuration
```json
{
  "strict": true,
  "verbatimModuleSyntax": true
}
```

### Type Imports
```typescript
// ✅ Correct
import type { User } from './types'
import { fetchUser } from './api'

// ❌ Incorrect
import { User, fetchUser } from './api'
```

### Path Aliases
```typescript
// Use @ alias for src imports (within apps)
import { Button } from '@/components/ui/button'

// Use @repo/* for shared packages
import type { Service } from '@repo/types/service'
import { cn } from '@repo/utils/cn'
import { formatCurrency } from '@repo/utils/format'
```

---

## Monorepo Standards (Turborepo)

### Shared Package Imports

**Critical**: Always import shared types from @repo/types:

```typescript
// ✅ Correct - import from shared package
import type { Service, ServiceCategory } from '@repo/types/service'
import type { Booking, BookingStatus } from '@repo/types/booking'
import type { Gallery, GalleryCategory } from '@repo/types/gallery'

// ❌ Wrong - DO NOT duplicate types in apps
// apps/client/src/types/service.ts should re-export from @repo/types
```

### Shared Utilities

```typescript
// ✅ Use shared utilities instead of duplicating
import { cn } from '@repo/utils/cn'
import { formatCurrency, formatDate } from '@repo/utils/format'
import { useDebounce } from '@repo/utils/hooks'

// ❌ Wrong - DO NOT duplicate utility functions
```

### TypeScript Config Extension

```json
// apps/client/tsconfig.json
{
  "extends": "@repo/typescript-config/react",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}

// apps/api/tsconfig.json
{
  "extends": "@repo/typescript-config/nestjs",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Tailwind Config Extension

```typescript
// apps/client/tailwind.config.ts
import clientTheme from '@repo/tailwind-config/client-theme'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  ...clientTheme,
}

// apps/admin/tailwind.config.ts
import adminTheme from '@repo/tailwind-config/admin-theme'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  ...adminTheme,
}
```

### Adding New Shared Types

1. Add to `packages/types/src/[module].ts`
2. Update `packages/types/package.json` exports if new module:
   ```json
   {
     "exports": {
       "./service": "./src/service.ts",
       "./your-new-module": "./src/your-new-module.ts"
     }
   }
   ```
3. Run `pnpm run type-check` from root to verify all apps
4. Apps auto-import updated types (no changes needed)

### Adding New Utilities

1. Add to `packages/utils/src/[utility].ts`
2. Update `packages/utils/package.json` exports:
   ```json
   {
     "exports": {
       "./your-util": "./src/your-util.ts"
     }
   }
   ```
3. Use in apps: `import { yourUtil } from '@repo/utils/your-util'`

### Turborepo Task Naming

```bash
# Build all apps (respects dependency graph)
pnpm run build

# Type-check all apps (parallel)
pnpm run type-check

# Lint all apps (parallel)
pnpm run lint

# Build specific app only
pnpm exec turbo build --filter=client
pnpm exec turbo build --filter=admin
pnpm exec turbo build --filter=api
```

### Package Dependencies

**Shared packages** should:
- Have minimal dependencies
- Use peer dependencies for React/TypeScript
- Not depend on app-specific code

**Apps** should:
- Depend on shared packages via workspace protocol
- Not duplicate code that could be shared

```json
// apps/client/package.json
{
  "dependencies": {
    "@repo/types": "*",
    "@repo/utils": "*"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "@repo/eslint-config": "*",
    "@repo/tailwind-config": "*"
  }
}
```

---

## React Standards

### Component Structure
```typescript
// ✅ Functional components only
export function ServiceCard({ service }: ServiceCardProps) {
  return <div>...</div>
}

// ✅ Props interface
interface ServiceCardProps {
  service: Service
  onSelect?: (id: string) => void
}
```

### Hooks
```typescript
// ✅ Custom hooks prefix with 'use'
function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  // ...
  return { bookings, loading, error }
}
```

---

## Styling Standards

### Tailwind CSS
```typescript
// ✅ Utility-first approach
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">

// ✅ Use design system tokens
<div className="text-primary-600 bg-neutral-50">

// ❌ Avoid inline styles
<div style={{ padding: '24px' }}>
```

### Component-Specific Styles
- Use Tailwind utilities first
- Extract repeated patterns to components
- **Critical**: Follow project design system (client vs admin)
- **Do NOT** share UI components between client and admin (packages/ui intentionally empty)

### Design System Separation

**Client** (apps/client):
- Warm, cozy, feminine theme
- Borders YES, Shadows NO
- Uses `@repo/tailwind-config/client-theme`

**Admin** (apps/admin):
- Professional, modern theme
- Borders subtle, Shadows YES (glassmorphism)
- Uses `@repo/tailwind-config/admin-theme`

**Rationale for packages/ui being empty**:
- Fundamentally different design philosophies
- Sharing UI components would compromise design integrity
- Only shared hook: `useDebounce` in `@repo/utils`

---

## API Standards (NestJS)

### RESTful Conventions
```typescript
// ✅ Proper HTTP methods
GET    /services      // List
GET    /services/:id  // Get one
POST   /services      // Create
PATCH  /services/:id  // Update
DELETE /services/:id  // Delete
```

### DTOs & Validation
```typescript
// ✅ Use class-validator
export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @Min(0)
  price: number
}
```

### Error Handling
```typescript
// ✅ Use NestJS exceptions
throw new NotFoundException('Service not found')
throw new BadRequestException('Invalid input')
```

---

## Testing Standards

### Unit Tests
```typescript
describe('ServiceService', () => {
  it('should create a service', async () => {
    // Arrange
    const dto = { name: 'Test', price: 50 }

    // Act
    const result = await service.create(dto)

    // Assert
    expect(result).toBeDefined()
    expect(result.name).toBe('Test')
  })
})
```

---

## Security Standards

### Authentication
- Use JWT with secure secrets
- Implement refresh token rotation
- Hash passwords with Argon2

### Input Validation
- Validate all user inputs
- Sanitize data before database operations
- Use DTOs for type safety

### OWASP Top 10
- XSS protection (React handles this)
- SQL injection prevention (Mongoose handles this)
- CSRF protection (SameSite cookies)
- Rate limiting (implemented)

---

## Git Standards

### Commit Messages
```bash
# ✅ Conventional commits
feat(services): add service filtering by category
fix(auth): resolve token expiration issue
docs(api): update endpoint documentation
refactor(bookings): extract validation logic
test(gallery): add integration tests

# ❌ Avoid
fixed stuff
updates
WIP
```

### Branch Naming
```bash
feature/service-filtering
fix/auth-token-expiration
refactor/booking-validation
feat/turborepo-migration
```

### Monorepo Commit Scope

When committing changes affecting multiple apps/packages:

```bash
# ✅ Specify affected workspace
feat(types): add new booking status enum
fix(client): resolve service filter bug
refactor(utils): optimize formatCurrency function
chore(root): update Turborepo to 2.3.0

# ✅ Multiple scopes for cross-cutting changes
feat(client,admin): add new service category filter
fix(types,api): align booking status types
```

---

## Performance Standards

### Frontend
- Code splitting with lazy loading
- Optimize images (use Cloudinary transformations)
- Minimize bundle size
- Use React.memo for expensive components

### Backend
- Database indexing
- Redis caching for frequently accessed data
- Pagination for large datasets
- Rate limiting to prevent abuse

### Monorepo Build Performance
- Turborepo caching enabled (89ms cached builds)
- Parallel task execution across apps
- BuildKit cache mounts in Docker
- Dependency graph optimization

**Commands**:
```bash
# Full build: 7s
pnpm run build

# Cached build: 89ms (FULL TURBO)
pnpm run build

# Clear cache if needed
pnpm run clean
```

---

## Accessibility Standards

### ARIA Labels
```typescript
<button aria-label="Book service">
  <CalendarIcon />
</button>
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus indicators visible
- Logical tab order

---

## Documentation Standards

### Code Comments
```typescript
// ✅ Document complex logic
// Calculate discounted price based on membership tier
const finalPrice = applyDiscount(basePrice, tier)

// ❌ Avoid obvious comments
// Set the name
const name = "Service"
```

### JSDoc (when needed)
```typescript
/**
 * Fetches bookings for a specific date range
 * @param startDate - ISO 8601 date string
 * @param endDate - ISO 8601 date string
 * @returns Promise resolving to array of bookings
 */
async function getBookings(startDate: string, endDate: string): Promise<Booking[]>
```

---

## Monorepo Best Practices

### When to Create a Shared Package

Create new package in `packages/` when:
- Code is used by 2+ apps
- Types must be shared across apps
- Utility functions are app-agnostic
- Configuration can be centralized

**Do NOT** create shared package for:
- App-specific business logic
- UI components with different design systems
- One-off utilities used by single app

### Workspace Protocol

Use workspace protocol for local dependencies:

```json
{
  "dependencies": {
    "@repo/types": "*",       // Always latest local version
    "@repo/utils": "workspace:*"  // Explicit workspace protocol
  }
}
```

### Type Safety Across Workspaces

**Always** use `import type` for @repo/types with verbatimModuleSyntax:

```typescript
// ✅ Correct
import type { Service } from '@repo/types/service'

// ❌ Wrong - build error with verbatimModuleSyntax
import { Service } from '@repo/types/service'
```

### Shared Package Structure

Standard structure for packages/*:

```
packages/[name]/
├── src/
│   └── index.ts         # Main export
├── package.json         # With "exports" field
├── tsconfig.json        # Extends @repo/typescript-config
└── README.md            # Usage documentation
```

---

**Last Updated**: 2025-12-31
**Turborepo**: Complete (7/7 phases)
