# Banner Filtering by Display Setting - Requirement Analysis

## Requirement Summary

"All banners list should be filtered by display setting (image, carousel, video)"

This requirement addresses inconsistency in the BannersPage table, which currently shows ALL banners regardless of the current Hero Display Mode setting.

## Current System Architecture

### Display Modes & Their Behavior

**Image Mode** (`displayMode === "image"`):

- Only primary banner is shown on client
- Visual: Single static image
- Banners needed: 1 (primary)

**Video Mode** (`displayMode === "video"`):

- Only primary banner is shown on client (with video background)
- Visual: Single video background
- Banners needed: 1 (primary with videoUrl)

**Carousel Mode** (`displayMode === "carousel"`):

- All active banners shown in rotation
- Visual: Rotating slideshow
- Banners needed: Multiple (all active)

### Current Implementation Status

**Files Involved**:

- `src/pages/BannersPage.tsx` - Shows ALL banners, no filtering
- `src/components/banners/HeroSettingsCard.tsx` - Controls display mode
- `src/services/banners.service.ts` - Has helper methods (getPrimary, getActive)
- `src/types/banner.types.ts` - Banner type with videoUrl field
- `src/types/heroSettings.types.ts` - Display mode definitions

**Current Table Display**:

- Shows all banners without regard to current display mode
- Columns: Drag handle, image, title, status, actions
- Status badges show: active/inactive and primary indicator

## Problem Analysis

### Why This Matters

When display mode is IMAGE or VIDEO:

- Admin sees carousel banners that won't be used (confusing)
- Creates cognitive overload with irrelevant data
- Harder to focus on managing the single primary banner

When display mode is CAROUSEL:

- All banners should be visible (current behavior is correct)
- But no indication these are for carousel context

### Impact Assessment

**Low Severity** - Current behavior is functional, but UX could be improved

- Admins can still create/edit/manage all banners
- No data loss or critical functionality broken
- Just information clarity issue

## Interpretation Options

### Option 1: Manual Filter Dropdown (Recommended)

**How it works**:

- Add dropdown filter above table: "Filter by Display Mode"
- Options: "All", "Image/Video (Primary only)", "Carousel (All Active)"
- Admin manually selects filter
- Table updates dynamically

**Pros**:

- Admin has explicit control
- Can compare banners across modes
- Clear intent when switching contexts
- Easier to implement

**Cons**:

- Requires extra click/interaction
- Filter state not persistent

**Implementation**:

```tsx
// Add to BannersPage component
const [displayModeFilter, setDisplayModeFilter] = useState<
  "all" | "primary" | "carousel"
>("all");

// Filter banners based on selection
const filteredBanners = useMemo(() => {
  switch (displayModeFilter) {
    case "primary":
      return banners.filter((b) => b.isPrimary);
    case "carousel":
      return banners.filter((b) => b.active);
    default:
      return banners;
  }
}, [banners, displayModeFilter]);
```

### Option 2: Automatic Filtering by Current Mode

**How it works**:

- Read current display mode from HeroSettings
- Automatically show only relevant banners
- No user interaction needed

**Pros**:

- Automatic context awareness
- Cleaner, focused UI
- No filtering dropdown needed

**Cons**:

- Less flexible - can't see all banners without changing mode
- Requires reading HeroSettings in BannersPage (adds complexity)
- Could be surprising to admin (why did banners disappear?)

**Implementation**:

```tsx
// In BannersPage
const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);

const filteredBanners = useMemo(() => {
  if (!heroSettings) return banners;

  if (
    heroSettings.displayMode === "image" ||
    heroSettings.displayMode === "video"
  ) {
    return banners.filter((b) => b.isPrimary);
  }
  // carousel mode
  return banners;
}, [banners, heroSettings]);
```

### Option 3: Hybrid - Filter + Visual Indicators

**How it works**:

- Show all banners by default
- Add visual indicators: "Used in [mode]" badges
- Optional: Add collapsible groups by mode

**Pros**:

- Complete visibility of all banners
- Clear labeling of what's used where
- Flexible for comparison

**Cons**:

- More complex UI
- Doesn't reduce clutter as much

## Technical Considerations

### Banner Metadata

Current Banner type needs consideration:

```typescript
type Banner = {
  id: string;
  title: string;
  imageUrl: string; // Always required
  videoUrl?: string; // Optional, for video mode
  sortIndex: number;
  active: boolean;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

**For filtering logic**:

- `videoUrl` field is optional - could be banners with/without video
- `active` field indicates carousel eligibility
- `isPrimary` field indicates image/video mode eligibility

### Service Layer

Available helper methods in `bannersService`:

```typescript
async getPrimary(): Promise<Banner | null>        // Gets primary banner
async getActive(): Promise<Banner[]>               // Gets all active banners
```

These can be leveraged for filtering.

## Recommendation

**Implement Option 1: Manual Filter Dropdown**

**Rationale**:

1. **Simplicity** - Easier to implement (5-10 lines of state + UI)
2. **Flexibility** - Admin can see all banners when needed
3. **Clarity** - Explicit filter shows admin intent
4. **Non-breaking** - Doesn't change default behavior
5. **Aligns with patterns** - DataTable already supports similar filters in other pages

**Implementation Plan**:

1. Add filter state to BannersPage
2. Create filter UI (dropdown or buttons)
3. Update filteredBanners with logic
4. Update DataTable to use filteredBanners
5. Add visual label showing current filter

**Estimated effort**: 1-2 hours

## Alternative: Lazy Implementation

If you want even simpler approach first:

- Add **informational card** above table
- Shows current display mode and what banners are "active"
- Educates admin without filtering
- Can upgrade to filtering later if needed

---

**Next Step**: Decide on Option 1, 2, or 3, then proceed with implementation.
