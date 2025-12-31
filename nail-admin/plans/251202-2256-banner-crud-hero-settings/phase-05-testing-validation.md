# Phase 5: Testing & Validation

**Date**: 2025-12-02
**Priority**: P0 (Quality Assurance)
**Status**: 🔴 Not Started
**Estimate**: 2-3 hours

## Context

**Related Files**:

- All Phase 1-4 implementations
- `tsconfig.json` (TypeScript configuration)
- `.env` (environment variables)

**Dependencies**: Phase 1, Phase 2, Phase 3, Phase 4

## Overview

Comprehensive testing and validation of the Banner CRUD with Hero Settings feature. Covers type checking, manual testing, edge case validation, error handling, and mock data seeding.

## Key Insights

- TypeScript `verbatimModuleSyntax: true` must pass (no runtime import errors)
- Manual testing required (no automated tests yet)
- Mock data must be realistic (representative of production)
- Edge cases often reveal bugs (empty states, missing data)
- Error handling must be user-friendly (toast notifications)
- Responsive design must work on mobile/tablet/desktop

## Requirements

### Type Checking

- [ ] Run `npx tsc --noEmit` (0 errors)
- [ ] All imports use `import type` for type-only imports
- [ ] All `verbatimModuleSyntax` errors resolved
- [ ] No `any` types (use proper typing)

### Functional Testing

**Banner CRUD**:

- [ ] Create banner with image upload
- [ ] Create banner with image + video upload
- [ ] Edit banner (pre-fills form correctly)
- [ ] Update banner image/video
- [ ] Delete banner (shows confirmation)
- [ ] Delete primary banner (auto-sets next as primary)
- [ ] Drag-drop reorder banners

**Hero Settings**:

- [ ] Switch to Image mode (shows primary banner)
- [ ] Switch to Video mode (shows primary banner)
- [ ] Switch to Carousel mode (hides primary preview)
- [ ] Save settings (persists in localStorage)
- [ ] Reload page (settings load correctly)

**Validation**:

- [ ] Title required (shows error)
- [ ] Title max 100 chars (shows error)
- [ ] Description max 500 chars (shows error)
- [ ] Image required for new banner (shows error)
- [ ] Video file type validation (only MP4/WebM)
- [ ] Video file size validation (max 50MB)
- [ ] CTA link URL validation (invalid URL shows error)

**Edge Cases**:

- [ ] No banners (empty state displays)
- [ ] No primary banner (warning in Video/Image mode)
- [ ] Primary banner deleted (next active becomes primary)
- [ ] All banners inactive (still shows in table)
- [ ] Very long title/description (truncates correctly)
- [ ] Missing image URL (placeholder or error)

### Error Handling

- [ ] Upload fails (shows error toast)
- [ ] Network error (shows error toast, doesn't crash)
- [ ] Invalid form data (shows field-specific errors)
- [ ] Delete fails (shows error toast, doesn't remove from table)
- [ ] Reorder fails (reverts to original order)

### UI/UX Testing

- [ ] Desktop (1920x1080) - all features work
- [ ] Tablet (768x1024) - responsive layout
- [ ] Mobile (375x667) - touch-friendly, no overflow
- [ ] Dark mode (if implemented) - readable colors
- [ ] Loading states (skeletons, spinners)
- [ ] Hover states (buttons, table rows)
- [ ] Focus states (keyboard navigation)

### Performance

- [ ] Image upload progress displays
- [ ] Video upload progress displays (large files)
- [ ] Table renders quickly (100+ banners)
- [ ] No layout shift during load
- [ ] Drag-drop smooth (no jank)

## Architecture Decisions

### Testing Strategy: Manual vs Automated

**Decision**: Manual testing for Phase 1, automated later
**Rationale**:

- Project has no test setup yet (Vitest, React Testing Library)
- Manual testing faster for MVP validation
- Automated tests can be added in Phase 6

**Trade-off**: No regression protection (acceptable for now)

### Mock Data: Minimal vs Comprehensive

**Decision**: Comprehensive mock data with multiple scenarios
**Rationale**:

- Test edge cases (long text, no video, inactive banners)
- Representative of production data
- Easier to demo feature

## Related Code Files

### Files to Create

1. **src/data/mockBanners.ts** - Sample banner data

### Files to Modify

1. **src/data/mockData.ts** - Enhanced mock data initialization

### Files to Test

- All Phase 1-4 files (types, services, components, pages)

## Implementation Steps

### Step 1: Create Comprehensive Mock Data

**File**: `src/data/mockBanners.ts`

```typescript
import type { Banner } from "@/types/banner.types";

export const mockBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Summer Sale 2024",
    description: "Get 20% off all manicure and pedicure services this summer!",
    imageUrl:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920",
    videoUrl: "https://storage.googleapis.com/sample-videos/nail-promo.mp4",
    ctaText: "Book Now",
    ctaLink: "https://pinknail.com/booking",
    sortIndex: 0,
    isActive: true,
    isPrimary: true,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "banner-2",
    title: "New Nail Art Collection",
    description:
      "Discover our latest seasonal nail art designs featuring floral patterns and metallic accents.",
    imageUrl:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1920",
    ctaText: "View Gallery",
    ctaLink: "https://pinknail.com/gallery",
    sortIndex: 1,
    isActive: true,
    isPrimary: false,
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "banner-3",
    title: "Spa Package Special",
    description:
      "Pamper yourself with our exclusive spa package including full nail treatment and massage.",
    imageUrl:
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1920",
    ctaText: "Learn More",
    ctaLink: "https://pinknail.com/spa-packages",
    sortIndex: 2,
    isActive: true,
    isPrimary: false,
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-01"),
  },
  {
    id: "banner-4",
    title: "Holiday Special - Coming Soon",
    description: "Stay tuned for our holiday promotions launching next month!",
    imageUrl:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1920",
    sortIndex: 3,
    isActive: false,
    isPrimary: false,
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-04-20"),
  },
  {
    id: "banner-5",
    title: "Grand Opening Anniversary",
    description:
      "Celebrating 5 years of beautiful nails! Special discounts all week long with complimentary champagne for all customers.",
    imageUrl:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920",
    ctaText: "Celebrate With Us",
    ctaLink: "https://pinknail.com/anniversary",
    sortIndex: 4,
    isActive: true,
    isPrimary: false,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
];
```

### Step 2: Update Mock Data Initialization

**File**: `src/data/mockData.ts` (modify)

```typescript
import type { HeroSettings } from "@/types/heroSettings.types";
import type { Banner } from "@/types/banner.types";
import { mockBanners } from "./mockBanners";

export const defaultHeroSettings: HeroSettings = {
  mode: "carousel",
  updatedAt: new Date(),
};

export function initializeMockData() {
  const storage = window.localStorage;
  const prefix = "nail_admin_";

  // Initialize hero settings
  const settingsKey = prefix + "hero_settings";
  if (!storage.getItem(settingsKey)) {
    storage.setItem(settingsKey, JSON.stringify(defaultHeroSettings));
    console.log("✅ Initialized hero settings (default: carousel mode)");
  }

  // Initialize banners
  const bannersKey = prefix + "banners";
  if (!storage.getItem(bannersKey)) {
    // Convert Date objects to ISO strings for localStorage
    const bannersData = mockBanners.map((banner) => ({
      ...banner,
      createdAt: banner.createdAt.toISOString(),
      updatedAt: banner.updatedAt.toISOString(),
    }));
    storage.setItem(bannersKey, JSON.stringify(bannersData));
    console.log(`✅ Initialized ${mockBanners.length} sample banners`);
  }

  // Log current data for debugging
  console.log("📦 Mock Data Status:");
  console.log("  - Hero Settings:", storage.getItem(settingsKey) ? "✅" : "❌");
  console.log("  - Banners:", storage.getItem(bannersKey) ? "✅" : "❌");
}

// Clear all mock data (useful for testing)
export function clearMockData() {
  const storage = window.localStorage;
  const prefix = "nail_admin_";

  Object.keys(storage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => storage.removeItem(key));

  console.log("🗑️  Cleared all mock data");
}

// Expose to window for debugging
if (import.meta.env.DEV) {
  (window as any).mockData = {
    init: initializeMockData,
    clear: clearMockData,
  };
  console.log(
    "🔧 Debug tools available: window.mockData.init(), window.mockData.clear()",
  );
}
```

### Step 3: Create Testing Checklist Document

**File**: `src/data/TESTING_CHECKLIST.md`

````markdown
# Banner CRUD Testing Checklist

## Pre-Testing Setup

- [ ] `.env` has `VITE_USE_MOCK_API=true`
- [ ] Run `npm run dev`
- [ ] Open browser console (check for errors)
- [ ] Login with demo credentials
- [ ] Navigate to Banners page

## Type Checking

```bash
npx tsc --noEmit
```
````

Expected: 0 errors

## Feature Testing

### Hero Settings

- [ ] Card displays above data table
- [ ] 3 radio options visible (Image, Video, Carousel)
- [ ] Current mode pre-selected correctly
- [ ] Primary banner preview shows for Image/Video modes
- [ ] No preview in Carousel mode
- [ ] Change mode → Save button appears
- [ ] Click Save → Success toast → Settings saved
- [ ] Reload page → Mode persists
- [ ] Last updated timestamp displays

### Create Banner

- [ ] Click "New Banner" button → Modal opens
- [ ] Form has all fields (title, description, image, video, CTA)
- [ ] Upload image → Preview displays
- [ ] Upload progress bar shows
- [ ] Upload completes → Image URL set
- [ ] Submit without title → Error "Title required"
- [ ] Submit without image → Error "Image required"
- [ ] Submit with 101-char title → Error "Max 100 characters"
- [ ] Submit valid form → Success toast → Banner added to table
- [ ] Modal closes automatically

### Edit Banner

- [ ] Click actions menu (⋮) → Click "Edit"
- [ ] Modal opens with pre-filled data
- [ ] Title, description pre-filled correctly
- [ ] Image preview shows existing image
- [ ] Change title → Click "Update" → Success toast
- [ ] Table updates with new title
- [ ] Modal closes automatically

### Delete Banner

- [ ] Click actions menu (⋮) → Click "Delete"
- [ ] Confirmation dialog shows banner title
- [ ] Click "Cancel" → Dialog closes, banner remains
- [ ] Click "Delete" → Success toast → Banner removed from table
- [ ] Delete primary banner → Next active banner becomes primary

### Reordering

- [ ] Drag handle (⋮⋮) visible on each row
- [ ] Drag row to new position
- [ ] Drop → Row moves to new position
- [ ] Success toast "Banner order updated"
- [ ] Reload page → Order persists

### Set Primary

- [ ] Click actions menu (⋮) → Click "Set as Primary"
- [ ] Success toast → Primary badge appears on banner
- [ ] Previous primary banner loses primary badge
- [ ] Hero Settings preview updates (if in Image/Video mode)

### Validation

**Title**:

- [ ] Empty title → Error
- [ ] 1 character → Valid
- [ ] 100 characters → Valid
- [ ] 101 characters → Error

**Description**:

- [ ] 500 characters → Valid
- [ ] 501 characters → Error

**Image Upload**:

- [ ] PDF file → Error "Please select an image file"
- [ ] 6MB image → Error "Image must be less than 5MB"
- [ ] Valid image → Success

**Video Upload**:

- [ ] AVI file → Error "Only MP4 and WebM videos are supported"
- [ ] 51MB video → Error "Video must be less than 50MB"
- [ ] Valid MP4 → Success

**CTA Link**:

- [ ] "not-a-url" → Error "Invalid URL"
- [ ] "https://example.com" → Valid

### Edge Cases

- [ ] No banners → Empty state displays "No banners yet..."
- [ ] All banners inactive → Table still shows all
- [ ] Banner with 500-char description → Truncates in table (shows ...)
- [ ] Delete last banner → Empty state displays
- [ ] Create first banner → Auto-set as primary
- [ ] Video mode but primary has no video → Warning shows

### Error Handling

- [ ] Disconnect internet → Upload fails → Error toast
- [ ] Submit invalid form → Field-specific errors show
- [ ] Delete fails (simulate) → Error toast, banner remains

### Responsive Design

**Desktop (1920x1080)**:

- [ ] Hero Settings card full width
- [ ] Data table displays all columns
- [ ] Modal centered, proper width
- [ ] Drag-drop smooth

**Tablet (768x1024)**:

- [ ] Layout responsive, no overflow
- [ ] Table horizontally scrollable if needed
- [ ] Modal adapts to width

**Mobile (375x667)**:

- [ ] Hero Settings card stacks vertically
- [ ] Table scrollable
- [ ] Modal full width on small screen
- [ ] Touch-friendly buttons (min 44x44px)

### Performance

- [ ] Image upload progress displays (0% → 100%)
- [ ] Video upload progress displays (large file)
- [ ] Table renders quickly with 5+ banners
- [ ] No layout shift during page load
- [ ] Drag-drop no lag/jank

## Post-Testing

- [ ] Check browser console → No errors
- [ ] Check localStorage → Data persists
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Test with Firefox disabled (Firebase fails gracefully)

## Bugs Found

_Document any bugs discovered during testing:_

1.
2.
3.

## Notes

_Additional observations or improvements:_

````

### Step 4: TypeScript Verification Script

Create a script to verify TypeScript compliance:

```bash
#!/bin/bash
# scripts/verify-types.sh

echo "🔍 Verifying TypeScript types..."

# Run TypeScript compiler
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "✅ TypeScript verification passed (0 errors)"
  exit 0
else
  echo "❌ TypeScript verification failed"
  exit 1
fi
````

Make executable:

```bash
chmod +x scripts/verify-types.sh
```

Add to `package.json`:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "verify": "bash scripts/verify-types.sh"
  }
}
```

### Step 5: Manual Testing Session

**Schedule**: 2-hour testing session

**Roles**:

- Tester 1: Follow checklist systematically
- Tester 2: Exploratory testing (break things)

**Environment**:

- Chrome DevTools open (console, network tab)
- Mock API enabled (`VITE_USE_MOCK_API=true`)
- Clear localStorage before starting

**Process**:

1. Clear mock data: `window.mockData.clear()`
2. Reload page (triggers mock data initialization)
3. Follow testing checklist step-by-step
4. Document bugs in `TESTING_CHECKLIST.md`
5. Fix critical bugs immediately
6. Log non-critical bugs for Phase 6

## Todo List

- [ ] Create mockBanners.ts with comprehensive sample data
- [ ] Update mockData.ts with initialization logic
- [ ] Create TESTING_CHECKLIST.md document
- [ ] Create TypeScript verification script
- [ ] Run `npm run type-check` (fix any errors)
- [ ] Execute manual testing checklist
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on tablet (iPad or browser dev tools)
- [ ] Test on mobile (iPhone or browser dev tools)
- [ ] Document bugs found
- [ ] Fix critical bugs
- [ ] Verify all success criteria met

## Success Criteria

- [ ] TypeScript compilation passes (0 errors)
- [ ] All CRUD operations work correctly
- [ ] All validation rules enforce correctly
- [ ] All edge cases handled gracefully
- [ ] Error handling shows user-friendly messages
- [ ] Responsive design works on all screen sizes
- [ ] Performance acceptable (no lag, smooth uploads)
- [ ] Mock data persists correctly in localStorage
- [ ] No console errors during normal operation
- [ ] Feature ready for production (with real API)

## Risk Assessment

**Medium Risk**:

- Cross-browser compatibility (Safari may have issues)
- Mobile drag-drop UX (HTML5 API less reliable)

**Low Risk**:

- Type checking (established patterns)
- Mock data persistence (localStorage stable)

## Security Considerations

- Verify file upload validation (client-side)
- Check for XSS vulnerabilities (React escapes by default)
- Test Firebase Storage rules (if configured)
- Validate all user inputs (Zod schemas)

## Next Steps

After Phase 5 completion:

1. Deploy to staging environment (Vercel/Netlify)
2. Share with stakeholders for feedback
3. Create API endpoint documentation for backend team
4. Plan Phase 6: Enhancements (accessibility, animations, tests)
5. Update client project to consume banner data and hero settings
