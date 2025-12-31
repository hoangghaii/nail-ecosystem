# Code Standards

Pink Nail Salon - Coding Conventions & Best Practices

---

## Core Principles

**YAGNI** - You Aren't Gonna Need It
**KISS** - Keep It Simple, Stupid
**DRY** - Don't Repeat Yourself

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
// Use @ alias for src imports
import { Button } from '@/components/ui/button'
import type { Service } from '@/types/service'
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
- Follow project design system (client vs admin)

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

**Last Updated**: 2025-12-31
