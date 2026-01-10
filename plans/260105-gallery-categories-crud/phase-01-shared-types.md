# Phase 1: Shared Types Foundation

## 🎯 Goal
Create shared TypeScript types for gallery categories in `@repo/types` package to be used across all apps.

## 📦 Tasks

### 1.1 Create `gallery-category.ts`

**File**: `packages/types/src/gallery-category.ts`

```typescript
export type GalleryCategoryItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortIndex: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateGalleryCategoryDto = {
  name: string;
  slug?: string;
  description?: string;
  sortIndex?: number;
  isActive?: boolean;
};

export type UpdateGalleryCategoryDto = Partial<CreateGalleryCategoryDto>;
```

**Key Points**:
- Mirror backend API schema exactly
- Optional timestamps for flexibility
- DTOs for create/update operations
- Slug optional in create (backend auto-generates)

### 1.2 Update Package Exports

**File**: `packages/types/src/index.ts`

Add:
```typescript
export * from './gallery-category';
```

### 1.3 Preserve Backward Compatibility

**No changes to**: `packages/types/src/gallery.ts`

Keep existing `GalleryCategory` enum:
```typescript
export const GalleryCategory = {
  ALL: 'all',
  EXTENSIONS: 'extensions',
  MANICURE: 'manicure',
  NAIL_ART: 'nail-art',
  PEDICURE: 'pedicure',
  SEASONAL: 'seasonal',
} as const;
```

**Rationale**: Maintain backward compatibility during migration. Will be deprecated after full migration.

## ✅ Verification

Run type-check:
```bash
cd packages/types
npm run type-check
```

Expected: No errors

## 📁 Files Modified

- `packages/types/src/gallery-category.ts` (NEW)
- `packages/types/src/index.ts` (UPDATED)

## ⏭️ Next Phase

Phase 2: Admin Service Layer
