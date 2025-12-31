# Phase 4: Hero Settings Component

**Date**: 2025-12-02
**Priority**: P0 (Core Feature)
**Status**: 🔴 Not Started
**Estimate**: 2-3 hours

## Context

**Related Files**:

- `src/pages/BannersPage.tsx` (Phase 3)
- `src/services/heroSettings.service.ts` (Phase 1)
- `src/types/heroSettings.types.ts` (Phase 1)

**Dependencies**: Phase 1, Phase 3

## Overview

Build hero display settings component that controls how banners appear on the client website. Supports three display modes: single image, single video, or carousel. When in Image/Video mode, shows primary banner only; in Carousel mode, shows all active banners.

## Key Insights

- Settings affect client-side hero section rendering
- Display mode change should show immediate preview
- Primary banner selection is mode-dependent (Image/Video modes only)
- Carousel mode ignores primary flag (shows all active)
- Settings stored separately from banners (global config)
- Should be accessible from Banners page (sticky card or separate tab)

## Requirements

### Display Modes

1. **Image Mode**
   - Show primary banner's image only
   - Static display (no animation)
   - Client shows: Hero image with CTA button

2. **Video Mode**
   - Show primary banner's video only
   - Auto-play, loop, muted (client-side)
   - Client shows: Hero video with overlay CTA

3. **Carousel Mode**
   - Show all active banners in rotation
   - Auto-advance every 5 seconds (client-side)
   - Client shows: Sliding carousel with navigation dots

### UI Layout

```
┌─────────────────────────────────────┐
│ Hero Display Settings                │
├─────────────────────────────────────┤
│ Select how banners appear on website│
│                                      │
│ ○ Image - Show single image banner  │
│ ○ Video - Show single video banner  │
│ ● Carousel - Show all active banners│
│                                      │
│ Current Primary Banner:              │
│ ┌─────────────────────┐             │
│ │ [Preview Image]      │             │
│ │ "Summer Sale 2024"   │             │
│ └─────────────────────┘             │
│                          [Save]      │
└─────────────────────────────────────┘
```

### Hero Settings Card

**Location**: Top of Banners page (above data table)

**Components**:

- Radio button group (3 options)
- Description text for each mode
- Primary banner preview (when mode is Image/Video)
- Save button (disabled until mode changes)
- Last updated timestamp

## Architecture Decisions

### Component Placement: Separate Page vs Embedded

**Decision**: Embed in BannersPage as sticky card
**Rationale**:

- Settings and banners are tightly coupled
- Avoid navigation overhead (context switching)
- Show settings + banner list in same view
- Easy to see which banner is primary

**Trade-off**: Page becomes longer (acceptable, settings at top)

### State Management: Local vs Global Store

**Decision**: Use local component state with API sync
**Rationale**:

- Settings rarely change (not frequently accessed)
- No need for global state (not used in other pages)
- Simpler implementation

**Trade-off**: Need to refetch if navigating away and back (acceptable)

### Primary Banner Preview: Full vs Thumbnail

**Decision**: Show thumbnail preview (same as table)
**Rationale**:

- Consistent with data table design
- Saves space (settings card stays compact)
- Full preview available in edit modal

## Related Code Files

### Files to Create

1. **src/components/banners/HeroSettingsCard.tsx** - Hero settings component

### Files to Modify

1. **src/pages/BannersPage.tsx** - Add HeroSettingsCard above table

### Files to Reference

1. `src/services/heroSettings.service.ts` (Phase 1)
2. `src/services/banners.service.ts` (Phase 1)
3. `src/components/ui/card.tsx` (existing)
4. `src/components/ui/button.tsx` (existing)

## Implementation Steps

### Step 1: Create Hero Settings Card Component

**File**: `src/components/banners/HeroSettingsCard.tsx`

```typescript
import * as React from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

import type { HeroSettings, HeroDisplayMode } from "@/types/heroSettings.types";
import type { Banner } from "@/types/banner.types";
import { heroSettingsService } from "@/services/heroSettings.service";
import { bannersService } from "@/services/banners.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface HeroSettingsCardProps {
  onSettingsChange?: () => void;
}

export function HeroSettingsCard({ onSettingsChange }: HeroSettingsCardProps) {
  const [settings, setSettings] = React.useState<HeroSettings | null>(null);
  const [selectedMode, setSelectedMode] = React.useState<HeroDisplayMode>("carousel");
  const [primaryBanner, setPrimaryBanner] = React.useState<Banner | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const hasChanges = settings?.mode !== selectedMode;

  React.useEffect(() => {
    fetchSettings();
    fetchPrimaryBanner();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await heroSettingsService.get();
      setSettings(data);
      setSelectedMode(data.mode);
    } catch (error) {
      toast.error("Failed to load hero settings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrimaryBanner = async () => {
    try {
      const banner = await bannersService.getPrimary();
      setPrimaryBanner(banner);
    } catch (error) {
      console.error("Failed to load primary banner:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await heroSettingsService.update(selectedMode);
      toast.success("Hero settings updated successfully");
      await fetchSettings();
      onSettingsChange?.();
    } catch (error) {
      toast.error("Failed to update hero settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Display Settings</CardTitle>
        <CardDescription>
          Choose how banners appear on your website's hero section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="heroMode"
              value="image"
              checked={selectedMode === "image"}
              onChange={(e) => setSelectedMode(e.target.value as HeroDisplayMode)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium">Image Mode</div>
              <div className="text-sm text-muted-foreground">
                Display the primary banner as a static hero image
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="heroMode"
              value="video"
              checked={selectedMode === "video"}
              onChange={(e) => setSelectedMode(e.target.value as HeroDisplayMode)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium">Video Mode</div>
              <div className="text-sm text-muted-foreground">
                Display the primary banner's video as an auto-playing hero background
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="heroMode"
              value="carousel"
              checked={selectedMode === "carousel"}
              onChange={(e) => setSelectedMode(e.target.value as HeroDisplayMode)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium">Carousel Mode</div>
              <div className="text-sm text-muted-foreground">
                Display all active banners in a rotating carousel
              </div>
            </div>
          </label>
        </div>

        {(selectedMode === "image" || selectedMode === "video") && (
          <div className="pt-4 border-t border-border">
            <Label className="text-sm font-medium mb-3 block">
              Current Primary Banner
            </Label>
            {primaryBanner ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50">
                <img
                  src={primaryBanner.imageUrl}
                  alt={primaryBanner.title}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium">{primaryBanner.title}</div>
                  {primaryBanner.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {primaryBanner.description}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-dashed border-border bg-muted/50 text-center text-sm text-muted-foreground">
                No primary banner set. Create a banner and mark it as primary.
              </div>
            )}
          </div>
        )}

        {hasChanges && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              You have unsaved changes
            </p>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        )}

        {settings && !hasChanges && (
          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            Last updated: {new Date(settings.updatedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### Step 2: Integrate Hero Settings into Banners Page

**File**: `src/pages/BannersPage.tsx` (modify)

Add import:

```typescript
import { HeroSettingsCard } from "@/components/banners/HeroSettingsCard";
```

Add component above DataTable:

```typescript
return (
  <div className="p-8 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Banners</h1>
        <p className="text-muted-foreground mt-1">
          Manage hero section banners for your website
        </p>
      </div>
      <Button onClick={() => setFormModal({ open: true, banner: null })}>
        <Plus className="h-4 w-4 mr-2" />
        New Banner
      </Button>
    </div>

    {/* Hero Settings Card */}
    <HeroSettingsCard onSettingsChange={fetchBanners} />

    {/* Banners Data Table */}
    <DataTable
      columns={columns}
      data={banners}
      isLoading={isLoading}
      emptyMessage="No banners yet. Create your first banner to get started."
    />

    {/* Modals */}
    <BannerFormModal ... />
    <DeleteBannerDialog ... />
  </div>
);
```

### Step 3: Add Visual Indicator for Mode-Specific Banners

**File**: `src/pages/BannersPage.tsx` (enhance)

Add helper to show which banner is relevant for current mode:

```typescript
const columns: ColumnDef<Banner>[] = [
  // ... existing columns
  {
    accessorKey: "isPrimary",
    header: "Primary",
    cell: ({ row }) => {
      const isPrimary = row.original.isPrimary;
      const hasVideo = !!row.original.videoUrl;

      if (!isPrimary) return null;

      return (
        <div className="flex flex-col gap-1">
          <StatusBadge variant="primary">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Primary
          </StatusBadge>
          {hasVideo && (
            <span className="text-xs text-muted-foreground">
              Has video
            </span>
          )}
        </div>
      );
    },
  },
  // ... rest of columns
];
```

### Step 4: Add Warning for Missing Video

**File**: `src/components/banners/HeroSettingsCard.tsx` (enhance)

Add warning when Video mode selected but primary banner has no video:

```typescript
{(selectedMode === "video") && primaryBanner && !primaryBanner.videoUrl && (
  <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
    <p className="text-sm text-warning flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      Primary banner has no video. Please upload a video or switch to Image/Carousel mode.
    </p>
  </div>
)}
```

### Step 5: Add Mock Data Seed for Hero Settings

**File**: `src/data/mockData.ts` (create or modify)

```typescript
import type { HeroSettings } from "@/types/heroSettings.types";

export const defaultHeroSettings: HeroSettings = {
  mode: "carousel",
  updatedAt: new Date(),
};

// Initialize on app load
export function initializeMockData() {
  const storage = window.localStorage;
  const prefix = "nail_admin_";

  // Check if hero settings exist, if not, set default
  if (!storage.getItem(prefix + "hero_settings")) {
    storage.setItem(
      prefix + "hero_settings",
      JSON.stringify(defaultHeroSettings),
    );
  }

  // Check if banners exist, if not, create sample banner
  if (!storage.getItem(prefix + "banners")) {
    const sampleBanner = {
      id: crypto.randomUUID(),
      title: "Welcome to Pink Nail Salon",
      description: "Premium nail care services in a relaxing atmosphere",
      imageUrl:
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920",
      sortIndex: 0,
      isActive: true,
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.setItem(prefix + "banners", JSON.stringify([sampleBanner]));
  }
}
```

Call in `src/main.tsx`:

```typescript
import { initializeMockData } from "@/data/mockData";

// Initialize mock data
if (import.meta.env.VITE_USE_MOCK_API === "true") {
  initializeMockData();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Todo List

- [ ] Create HeroSettingsCard component
- [ ] Add radio button group with 3 modes
- [ ] Display primary banner preview
- [ ] Add save button with change detection
- [ ] Integrate into BannersPage above table
- [ ] Add warning for Video mode without video
- [ ] Create mock data seed for hero settings
- [ ] Test mode switching (Image/Video/Carousel)
- [ ] Test save settings and refetch
- [ ] Test primary banner preview updates
- [ ] Verify localStorage persistence
- [ ] Test with no primary banner set

## Success Criteria

- [ ] Hero settings card displays on Banners page
- [ ] Radio buttons select display mode
- [ ] Primary banner preview shows for Image/Video modes
- [ ] Save button enabled only when mode changes
- [ ] Settings persist in localStorage
- [ ] Warning shows when Video mode but no video
- [ ] Last updated timestamp displays correctly
- [ ] Component responsive on mobile/tablet/desktop

## Risk Assessment

**Medium Risk**:

- Mode validation (ensure primary banner exists before enabling mode)
- Client-side sync (client app must fetch settings to render hero)

**Low Risk**:

- Radio button group (simple UI)
- Settings persistence (localStorage stable)

## Security Considerations

- Validate display mode enum values (only 'image' | 'video' | 'carousel')
- No sensitive data in settings (safe for localStorage)
- Client-side settings read-only (admin controls only)

## Next Steps

After Phase 4 completion:

1. Proceed to Phase 5: Testing & validation
2. Document hero settings integration for client project
3. Create API endpoint spec for hero settings (for backend migration)
4. Test hero display on client website with different modes
