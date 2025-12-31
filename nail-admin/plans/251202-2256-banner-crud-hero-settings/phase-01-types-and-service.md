# Phase 1: Types and Service Layer

**Date**: 2025-12-02
**Priority**: P0 (Foundation)
**Status**: 🔴 Not Started
**Estimate**: 2-3 hours

## Context

**Related Files**:

- `src/types/banner.types.ts` (existing)
- `src/services/storage.service.ts` (existing)
- `src/services/imageUpload.service.ts` (existing)
- Client types: `/Users/hainguyen/Documents/nail-project/nail-client/src/types/banner.types.ts`

**Dependencies**: None (foundation phase)

## Overview

Extend Banner type with hero-specific fields (video, CTA, sorting, primary flag) and create dual-mode service layer for CRUD operations. Maintain type compatibility with client project.

## Key Insights

- Current Banner type lacks: `videoUrl`, `ctaText`, `ctaLink`, `sortIndex`, `isPrimary`
- Client project needs hero display data, so types MUST be shared
- Dual-mode pattern: `VITE_USE_MOCK_API` env variable controls localStorage vs API
- TypeScript constraint: `verbatimModuleSyntax: true` requires `import type` for types
- Mock data uses `nail_admin_` prefix in localStorage

## Requirements

### Banner Type Fields

```typescript
export type Banner = {
  id: string; // UUID
  title: string; // Required, max 100 chars
  description?: string; // Optional, max 500 chars
  imageUrl: string; // Required, Firebase Storage URL
  videoUrl?: string; // Optional, Firebase Storage URL (MP4/WebM)
  ctaText?: string; // Optional, CTA button text
  ctaLink?: string; // Optional, CTA button URL
  sortIndex: number; // For drag-drop ordering (0-based)
  isActive: boolean; // Display toggle
  isPrimary: boolean; // Primary banner for Image/Video mode
  createdAt: Date;
  updatedAt: Date;
};
```

### Hero Settings Type

```typescript
export type HeroSettings = {
  mode: "image" | "video" | "carousel";
  updatedAt: Date;
};
```

### Service Methods

- `getAll(): Promise<Banner[]>` - Get all banners, sorted by sortIndex
- `getActive(): Promise<Banner[]>` - Get active banners only
- `getPrimary(): Promise<Banner | null>` - Get primary banner
- `getById(id: string): Promise<Banner>` - Get single banner
- `create(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner>`
- `update(id: string, data: Partial<Banner>): Promise<Banner>`
- `delete(id: string): Promise<void>`
- `reorder(ids: string[]): Promise<void>` - Batch update sortIndex
- `setPrimary(id: string): Promise<void>` - Set as primary, unset others

## Architecture Decisions

### Type Compatibility Strategy

**Decision**: Extend existing Banner type in-place, not create new type
**Rationale**: Client project will eventually need these fields for hero display
**Action**: Coordinate with client project to sync types

### Mock Data Storage Keys

- Banners: `nail_admin_banners` (array of Banner)
- Hero Settings: `nail_admin_hero_settings` (HeroSettings object)

### Primary Banner Logic

- Only one banner can be `isPrimary: true` at a time
- When setting primary, auto-unset all others
- If no primary exists and banner created, auto-set as primary
- If primary deleted, auto-set next active banner as primary

### Dual-Mode Implementation

```typescript
class BannersService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<Banner[]> {
    if (this.useMockApi) {
      const banners = storage.get<Banner[]>("banners", []);
      return banners.sort((a, b) => a.sortIndex - b.sortIndex);
    }
    const response = await fetch("/api/banners");
    return response.json();
  }
}
```

## Related Code Files

### Files to Create

1. **src/services/banners.service.ts** - Banner CRUD service
2. **src/services/heroSettings.service.ts** - Hero display settings service
3. **src/types/heroSettings.types.ts** - Hero settings type

### Files to Modify

1. **src/types/banner.types.ts** - Extend Banner type
2. **Client project types** - Sync Banner type (coordinate separately)

## Implementation Steps

### Step 1: Update Banner Type

**File**: `src/types/banner.types.ts`

```typescript
export type Banner = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string; // NEW
  ctaText?: string; // NEW
  ctaLink?: string; // NEW
  sortIndex: number; // RENAMED from displayOrder
  isActive: boolean; // RENAMED from active
  isPrimary: boolean; // NEW
  createdAt: Date;
  updatedAt: Date;
};

// Zod schema for validation
export const bannerSchema = z.object({
  title: z.string().min(1, "Title required").max(100, "Max 100 characters"),
  description: z.string().max(500, "Max 500 characters").optional(),
  imageUrl: z.string().url("Invalid image URL"),
  videoUrl: z.string().url("Invalid video URL").optional(),
  ctaText: z.string().max(50, "Max 50 characters").optional(),
  ctaLink: z.string().url("Invalid URL").optional(),
  sortIndex: z.number().int().min(0),
  isActive: z.boolean(),
  isPrimary: z.boolean(),
});

export type BannerFormData = z.infer<typeof bannerSchema>;
```

### Step 2: Create Hero Settings Type

**File**: `src/types/heroSettings.types.ts`

```typescript
export type HeroDisplayMode = "image" | "video" | "carousel";

export type HeroSettings = {
  mode: HeroDisplayMode;
  updatedAt: Date;
};

export const heroSettingsSchema = z.object({
  mode: z.enum(["image", "video", "carousel"]),
});

export type HeroSettingsFormData = z.infer<typeof heroSettingsSchema>;
```

### Step 3: Create Banners Service

**File**: `src/services/banners.service.ts`

```typescript
import type { Banner } from "@/types/banner.types";
import { storage } from "./storage.service";

class BannersService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";
  private storageKey = "banners";

  async getAll(): Promise<Banner[]> {
    if (this.useMockApi) {
      const banners = storage.get<Banner[]>(this.storageKey, []);
      return banners.sort((a, b) => a.sortIndex - b.sortIndex);
    }
    const response = await fetch("/api/banners");
    if (!response.ok) throw new Error("Failed to fetch banners");
    return response.json();
  }

  async getActive(): Promise<Banner[]> {
    const banners = await this.getAll();
    return banners.filter((b) => b.isActive);
  }

  async getPrimary(): Promise<Banner | null> {
    const banners = await this.getAll();
    return banners.find((b) => b.isPrimary) || null;
  }

  async getById(id: string): Promise<Banner> {
    const banners = await this.getAll();
    const banner = banners.find((b) => b.id === id);
    if (!banner) throw new Error("Banner not found");
    return banner;
  }

  async create(
    data: Omit<Banner, "id" | "createdAt" | "updatedAt">,
  ): Promise<Banner> {
    if (this.useMockApi) {
      const banners = await this.getAll();

      // Auto-set as primary if none exist
      let isPrimary = data.isPrimary;
      if (banners.length === 0 || !banners.some((b) => b.isPrimary)) {
        isPrimary = true;
      }

      // Auto-assign sortIndex if not provided
      const sortIndex = data.sortIndex ?? banners.length;

      const newBanner: Banner = {
        id: crypto.randomUUID(),
        ...data,
        isPrimary,
        sortIndex,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // If setting as primary, unset others
      if (isPrimary) {
        banners.forEach((b) => (b.isPrimary = false));
      }

      banners.push(newBanner);
      storage.set(this.storageKey, banners);
      return newBanner;
    }

    const response = await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create banner");
    return response.json();
  }

  async update(id: string, data: Partial<Banner>): Promise<Banner> {
    if (this.useMockApi) {
      const banners = await this.getAll();
      const index = banners.findIndex((b) => b.id === id);
      if (index === -1) throw new Error("Banner not found");

      const updated = {
        ...banners[index],
        ...data,
        updatedAt: new Date(),
      };

      // If setting as primary, unset others
      if (data.isPrimary === true) {
        banners.forEach((b, i) => {
          if (i !== index) b.isPrimary = false;
        });
      }

      banners[index] = updated;
      storage.set(this.storageKey, banners);
      return updated;
    }

    const response = await fetch(`/api/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update banner");
    return response.json();
  }

  async delete(id: string): Promise<void> {
    if (this.useMockApi) {
      const banners = await this.getAll();
      const banner = banners.find((b) => b.id === id);
      if (!banner) throw new Error("Banner not found");

      const wasPrimary = banner.isPrimary;
      const filtered = banners.filter((b) => b.id !== id);

      // If deleted was primary, set next active banner as primary
      if (wasPrimary && filtered.length > 0) {
        const nextActive = filtered.find((b) => b.isActive);
        if (nextActive) nextActive.isPrimary = true;
      }

      storage.set(this.storageKey, filtered);
      return;
    }

    const response = await fetch(`/api/banners/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete banner");
  }

  async reorder(ids: string[]): Promise<void> {
    if (this.useMockApi) {
      const banners = await this.getAll();
      const reordered = ids.map((id, index) => {
        const banner = banners.find((b) => b.id === id);
        if (!banner) throw new Error(`Banner ${id} not found`);
        return { ...banner, sortIndex: index, updatedAt: new Date() };
      });
      storage.set(this.storageKey, reordered);
      return;
    }

    const response = await fetch("/api/banners/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error("Failed to reorder banners");
  }

  async setPrimary(id: string): Promise<void> {
    const banners = await this.getAll();
    banners.forEach((b) => {
      b.isPrimary = b.id === id;
      b.updatedAt = new Date();
    });

    if (this.useMockApi) {
      storage.set(this.storageKey, banners);
      return;
    }

    const response = await fetch(`/api/banners/${id}/set-primary`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to set primary banner");
  }
}

export const bannersService = new BannersService();
```

### Step 4: Create Hero Settings Service

**File**: `src/services/heroSettings.service.ts`

```typescript
import type { HeroSettings, HeroDisplayMode } from "@/types/heroSettings.types";
import { storage } from "./storage.service";

class HeroSettingsService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";
  private storageKey = "hero_settings";

  async get(): Promise<HeroSettings> {
    if (this.useMockApi) {
      return storage.get<HeroSettings>(this.storageKey, {
        mode: "carousel",
        updatedAt: new Date(),
      });
    }

    const response = await fetch("/api/hero-settings");
    if (!response.ok) throw new Error("Failed to fetch hero settings");
    return response.json();
  }

  async update(mode: HeroDisplayMode): Promise<HeroSettings> {
    const settings: HeroSettings = {
      mode,
      updatedAt: new Date(),
    };

    if (this.useMockApi) {
      storage.set(this.storageKey, settings);
      return settings;
    }

    const response = await fetch("/api/hero-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error("Failed to update hero settings");
    return response.json();
  }
}

export const heroSettingsService = new HeroSettingsService();
```

### Step 5: Update Image Upload Service for Video Support

**File**: `src/services/imageUpload.service.ts` (modify)

Add video upload method:

```typescript
async uploadVideo(
  file: File,
  folder: "banners",
  onProgress?: (progress: number) => void,
): Promise<string> {
  // Validate file type
  const validTypes = ["video/mp4", "video/webm"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Only MP4 and WebM videos are supported");
  }

  // Validate file size (50MB max)
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size > maxSize) {
    throw new Error("Video file must be less than 50MB");
  }

  // Use same upload logic as images
  return this.uploadImage(file, folder, onProgress);
}
```

## Todo List

- [ ] Update Banner type in `src/types/banner.types.ts`
- [ ] Create HeroSettings type in `src/types/heroSettings.types.ts`
- [ ] Create banners.service.ts with all CRUD methods
- [ ] Create heroSettings.service.ts
- [ ] Add video upload method to imageUpload.service.ts
- [ ] Add Zod schemas for validation
- [ ] Test mock mode CRUD operations in browser console
- [ ] Verify TypeScript compilation (no verbatimModuleSyntax errors)
- [ ] Coordinate Banner type sync with client project

## Success Criteria

- [ ] Banner type includes all new fields (videoUrl, ctaText, ctaLink, sortIndex, isPrimary)
- [ ] BannersService implements all CRUD methods with dual-mode pattern
- [ ] Primary banner logic works (auto-set, enforce single primary)
- [ ] Reorder method updates sortIndex correctly
- [ ] Hero settings service stores/retrieves display mode
- [ ] No TypeScript errors (verbatimModuleSyntax compliant)
- [ ] Mock data persists in localStorage with correct prefix
- [ ] Video upload validates file type and size

## Risk Assessment

**High Risk**:

- Type compatibility with client project (must coordinate changes)
- Breaking existing Banner references (if any)

**Medium Risk**:

- Primary banner auto-selection edge cases (no active banners)
- Reorder logic (array index vs sortIndex mismatch)

**Low Risk**:

- Dual-mode pattern (established pattern in project)
- Mock data storage (stable localStorage API)

## Security Considerations

- Validate file types on upload (only MP4/WebM for video)
- Enforce file size limits (50MB for video, 5MB for images)
- Sanitize URLs for ctaLink (validate URL format)
- Prevent XSS in title/description (React escapes by default)

## Next Steps

After Phase 1 completion:

1. Proceed to Phase 2: Build shared components (DataTable, Dialog, ImageUpload)
2. Seed mock data with sample banners for testing
3. Update client project Banner type to match
