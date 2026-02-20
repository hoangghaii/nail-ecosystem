# Gallery Constants & Filtering Implementation Analysis

**Date**: 2026-02-19  
**Project**: Pink Nail Salon Ecosystem  
**Status**: Complete Analysis

---

## Overview

This analysis documents:
1. All occurrences of NAIL_SHAPES and NAIL_STYLES constants
2. Gallery "category" field usage across the entire stack
3. Current gallery filter implementation (client & admin)
4. Shared types, schema, and API endpoints
5. How admin gallery form currently works

---

## Documents in This Plan

### 1. SUMMARY.md (Start Here)
Quick reference guide with:
- Constants definitions
- Type definitions
- MongoDB schema structure
- Client-side filtering logic
- API endpoints reference
- Admin form structure
- Gallery categories list
- Filter flow diagram

**Best for**: Quick lookup, understanding the big picture

### 2. DETAILED_OCCURRENCES.md
Line-by-line breakdown of all occurrences:
- NAIL_SHAPES (definition + 2 usages)
- NAIL_STYLES (definition + 2 usages)
- category field usage (6 locations)
- nailShape field usage (6 locations)
- style field usage (6 locations)
- categoryId field usage (8 locations)
- Enum definitions for API DTOs
- Seed data for gallery categories

**Best for**: Pinpointing exact code locations and line numbers

### 3. scout-report.md (Comprehensive)
Full 1000-line report with:
- Executive summary
- Complete code listings
- Architecture diagrams
- Filter flow explanations
- Known gaps and issues
- Implementation pattern analysis
- Recommendations for improvements
- Complete file checklist

**Best for**: Understanding implementation details and context

---

## Key Findings at a Glance

### NAIL_SHAPES Constant
**Location**: `apps/client/src/data/filter-config.ts` (lines 1-7)

Contains 5 items:
- all, almond, coffin, square, stiletto

**Uses**: UI labels in Vietnamese + slug for filtering

### NAIL_STYLES Constant
**Location**: `apps/client/src/data/filter-config.ts` (lines 9-15)

Contains 5 items:
- all, 3d, mirror, gem, ombre

**Uses**: UI labels in Vietnamese + slug for filtering

---

## Architecture Summary

```
Two-Tier Filtering System:

TIER 1: Backend (categoryId)
├─ User selects category (dropdown)
├─ Client converts slug to categoryId
├─ API query: GET /gallery?categoryId=...
└─ Database filters by categoryId (indexed)

TIER 2: Client-Side (nailShape & style)
├─ User selects shape (pill buttons)
├─ User selects style (pill buttons)
├─ useMemo filters items by shape & style
└─ Renders filtered gallery items
```

---

## Type System

### From packages/types/src/gallery.ts
```typescript
type GalleryItem = {
  _id: string;
  category: string;          // category slug
  nailShape?: 'almond' | 'coffin' | 'square' | 'stiletto';
  style?: '3d' | 'mirror' | 'gem' | 'ombre';
  // ... other fields
}
```

### From packages/types/src/gallery-category.ts
```typescript
type GalleryCategoryItem = {
  _id: string;               // MongoDB ObjectId
  name: string;              // "Manicure"
  slug: string;              // "manicure"
  description?: string;
  sortIndex: number;
  isActive: boolean;
}
```

---

## Current Implementation Status

### Client App ✅
- [x] NAIL_SHAPES constant
- [x] NAIL_STYLES constant
- [x] Category filtering (backend via hook)
- [x] Shape filtering (client-side)
- [x] Style filtering (client-side)
- [x] Filter pills UI component
- [x] Reset filters button

### Admin App ⚠️
- [x] Category dropdown in form
- ❌ No shape field
- ❌ No style field

### API ✅
- [x] categoryId filtering
- [x] category filtering (deprecated)
- [x] nailShape field
- [x] style field
- [x] Proper indexing
- [x] DTO validation

---

## Gallery Categories in Database

1. Manicure (slug: `manicure`)
2. Pedicure (slug: `pedicure`)
3. Nail Art (slug: `nail-art`)
4. Extensions (slug: `extensions`)
5. Special Occasions (slug: `special-occasions`)
6. Seasonal Collections (slug: `seasonal`)

**Note**: "all" is NOT a real category - it's a UI filter value.

---

## Known Gaps

### Gap 1: Admin Cannot Set Shape/Style
- Issue: GalleryFormModal doesn't have fields for nailShape or style
- Impact: These values can only be set via DB or direct API calls
- Status: Design decision to keep form simple

### Gap 2: No Server-Side Shape/Style Filtering
- Issue: API returns all shapes/styles regardless of query
- Reason: By design - client handles this filtering
- Impact: Slight performance overhead, but acceptable for current data scale

### Gap 3: Category Field Ambiguity
- Issue: `category: string` in GalleryItem type is unclear
- What It Is: Actually stores category slug (e.g., "manicure")
- Better Name: `categorySlug`

### Gap 4: Backward Compatibility
- Issue: Legacy `category` string field still in schema
- Reason: Migration from old system
- Plan: Should be removed in future cleanup

---

## Files Affected

### Client
- `/apps/client/src/data/filter-config.ts` - Constants
- `/apps/client/src/pages/GalleryPage.tsx` - Page logic
- `/apps/client/src/hooks/useGalleryPage.ts` - Data fetching
- `/apps/client/src/components/gallery/FilterPills.tsx` - UI

### Admin
- `/apps/admin/src/components/gallery/GalleryFormModal.tsx` - Form

### Shared Types
- `/packages/types/src/gallery.ts` - Gallery type
- `/packages/types/src/gallery-category.ts` - Category type

### API
- `/apps/api/src/modules/gallery/schemas/gallery.schema.ts` - MongoDB schema
- `/apps/api/src/modules/gallery/dto/create-gallery.dto.ts` - Create DTO
- `/apps/api/src/modules/gallery/dto/query-gallery.dto.ts` - Query DTO
- `/apps/api/src/modules/gallery/gallery.service.ts` - Business logic
- `/apps/api/src/modules/gallery/gallery.controller.ts` - Endpoints
- `/apps/api/src/seeds/data/gallery-categories.data.ts` - Seed data

---

## How to Use This Analysis

### For Adding New Filter
1. Add to NAIL_SHAPES or NAIL_STYLES in `filter-config.ts`
2. Update type definitions in `/packages/types/src/gallery.ts`
3. Update MongoDB schema enum in `/apps/api/src/modules/gallery/schemas/gallery.schema.ts`
4. Update DTO enum in `/apps/api/src/modules/gallery/dto/create-gallery.dto.ts`
5. No API changes needed (already returns shape/style)
6. Client filtering works automatically with useMemo

### For Making Filters Dynamic
1. Move NAIL_SHAPES/NAIL_STYLES to database
2. Create API endpoints to fetch filters
3. Cache in Zustand or TanStack Query
4. Replace hardcoded arrays with API calls

### For Server-Side Filtering
1. Add nailShape and style to QueryGalleryDto
2. Update GalleryService.findAll() filtering logic
3. Add query parameters to API calls
4. Client can optionally use these instead of client-side filtering

---

## Next Steps for Enhancement

### Recommended
1. Add nailShape and style fields to admin form
2. Make gallery categories editable in admin
3. Add server-side filtering for shape/style (optional)

### Future Improvements
1. Make filter options dynamic (database-driven)
2. Add filter persistence to URL query params
3. Add filter analytics/tracking
4. Create filter management UI in admin

---

## Document Index

| Document | Purpose | Best For |
|----------|---------|----------|
| **README.md** | This file - overview and index | Navigation |
| **SUMMARY.md** | Quick reference with code snippets | Quick lookup |
| **DETAILED_OCCURRENCES.md** | Line-by-line breakdown | Pinpointing code |
| **scout-report.md** | Comprehensive 1000+ line analysis | Deep understanding |

---

## Report Generated

- **Date**: 2026-02-19
- **Analysis Type**: Complete Codebase Scout
- **Files Analyzed**: 13 primary files
- **Total Occurrences Documented**: 50+
- **Status**: Complete and ready for reference

---

## Questions to Resolve

None at this time - all requested information has been documented.

---

**For more details, see specific documents in this directory.**
