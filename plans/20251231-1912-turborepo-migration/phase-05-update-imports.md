# Phase 5: Update Import Statements

**Estimated Time**: 3-4 hours
**Risk Level**: MEDIUM-HIGH
**Rollback**: Medium - git reset recommended

---

## Objectives

Replace local imports with workspace package imports in all apps.

---

## 5.1 Update apps/client Imports

### Types
**Before**:
```typescript
import type { Service } from '@/types/service.types';
import type { GalleryItem } from '@/types/gallery.types';
```

**After**:
```typescript
import type { Service } from '@repo/types/service';
import type { GalleryItem } from '@repo/types/gallery';
```

### Utils
**Before**:
```typescript
import { cn } from '@/lib/utils';
```

**After**:
```typescript
import { cn } from '@repo/utils/cn';
```

### Find and Replace Commands
```bash
cd apps/client

# Find all files importing types
grep -r "from '@/types/" src/

# Can use global find-replace in IDE or manual updates
```

---

## 5.2 Update apps/admin Imports

Same pattern as client - replace local type imports with @repo/types.

---

## 5.3 Delete Duplicate Files

After imports updated and verified:

```bash
# In apps/client
rm -rf src/types/service.types.ts
rm -rf src/types/gallery.types.ts
rm -rf src/types/booking.types.ts

# In apps/admin
rm -rf src/types/service.types.ts
rm -rf src/types/gallery.types.ts
rm -rf src/types/booking.types.ts
rm -rf src/types/auth.types.ts
```

Keep app-specific types (businessInfo, banner, heroSettings, contact in admin).

---

## Validation

```bash
# Type-check all apps
pnpm turbo type-check

# Should pass with no errors
```

---

## Deliverables

- [x] All shared type imports updated to @repo/types
- [x] All utility imports updated to @repo/utils
- [x] Duplicate type files deleted
- [x] Type-check passes

---

## Rollback Strategy

```bash
git checkout HEAD -- apps/client/src/
git checkout HEAD -- apps/admin/src/
```

**Risk**: MEDIUM-HIGH - Code changes across many files
