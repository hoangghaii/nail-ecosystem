# Phase 2: Admin Service Layer

## 🎯 Goal
Create service class for gallery categories API calls following the `BannersService` pattern.

## 📦 Tasks

### 2.1 Create `galleryCategory.service.ts`

**File**: `apps/admin/src/services/galleryCategory.service.ts`

**Pattern**: Follow `bannersService` architecture (singleton class)

```typescript
import type {
  GalleryCategoryItem,
  CreateGalleryCategoryDto,
  UpdateGalleryCategoryDto,
} from "@repo/types/gallery-category";
import type { PaginationResponse } from "@repo/types/pagination";
import { apiClient } from "@/lib/apiClient";

export class GalleryCategoryService {
  async getAll(): Promise<PaginationResponse<GalleryCategoryItem>> {
    return apiClient.get<PaginationResponse<GalleryCategoryItem>>(
      "/gallery-categories"
    );
  }

  async getById(id: string): Promise<GalleryCategoryItem | null> {
    try {
      return await apiClient.get<GalleryCategoryItem>(
        `/gallery-categories/${id}`
      );
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async getBySlug(slug: string): Promise<GalleryCategoryItem | null> {
    try {
      return await apiClient.get<GalleryCategoryItem>(
        `/gallery-categories/slug/${slug}`
      );
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(
    data: CreateGalleryCategoryDto
  ): Promise<GalleryCategoryItem> {
    return apiClient.post<GalleryCategoryItem>("/gallery-categories", data);
  }

  async update(
    id: string,
    data: UpdateGalleryCategoryDto
  ): Promise<GalleryCategoryItem> {
    return apiClient.patch<GalleryCategoryItem>(
      `/gallery-categories/${id}`,
      data
    );
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/gallery-categories/${id}`);
  }

  async toggleActive(id: string): Promise<GalleryCategoryItem> {
    const category = await this.getById(id);
    if (!category) throw new Error("Category not found");
    return this.update(id, { isActive: !category.isActive });
  }

  async getActive(): Promise<GalleryCategoryItem[]> {
    const categories = await this.getAll();
    return (
      categories?.data
        ?.filter((c) => c.isActive)
        .sort((a, b) => a.name.localeCompare(b.name)) || []
    );
  }
}

export const galleryCategoryService = new GalleryCategoryService();
```

## 🔑 Key Features

- **404 Error Handling**: `getById()` and `getBySlug()` return `null` instead of throwing
- **Singleton Pattern**: Export single instance `galleryCategoryService`
- **Helper Methods**:
  - `toggleActive()` - Convenience method for active/inactive toggle
  - `getActive()` - Returns only active categories, sorted alphabetically
- **Type Safety**: Full TypeScript typing with shared types

## ✅ Verification

Test service layer:
```bash
cd apps/admin
npm run type-check
```

Expected: No type errors

## 📁 Files Modified

- `apps/admin/src/services/galleryCategory.service.ts` (NEW)

## ⏭️ Next Phase

Phase 3: Admin React Query Hooks
