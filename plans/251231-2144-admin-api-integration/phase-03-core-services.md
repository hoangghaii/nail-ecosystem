# Phase 3: Core Services Migration

**Priority**: P1
**Time**: 4-5 hours
**Depends**: Phase 2 complete

---

## Pattern (All Services)

### Remove
```typescript
private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true"

// Remove all mock if/else blocks
if (this.useMockApi) { ... }

// Remove Zustand imports
import { useXxxStore } from "@/store/xxxStore"
```

### Add
```typescript
import { apiClient } from '@/lib/apiClient'
```

### Replace Patterns
```typescript
// Before
const response = await fetch("/api/xxx")
if (!response.ok) throw new Error("Failed")
return response.json()

// After
return apiClient.get<Xxx[]>("/xxx")
```

---

## Task 3.1: Create Services Service

**NEW FILE**: `apps/admin/src/services/services.service.ts`

```typescript
import type { Service } from "@repo/types/service"
import { apiClient } from "@/lib/apiClient"

export class ServicesService {
  async getAll(): Promise<Service[]> {
    return apiClient.get<Service[]>("/services")
  }

  async getById(id: string): Promise<Service | null> {
    try {
      return await apiClient.get<Service>(`/services/${id}`)
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null
      }
      throw error
    }
  }

  async create(data: Omit<Service, "id">): Promise<Service> {
    return apiClient.post<Service>("/services", data)
  }

  async createWithUpload(file: File, data: Omit<Service, "id" | "imageUrl">): Promise<Service> {
    const formData = new FormData()
    formData.append('image', file)
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    return apiClient.post<Service>("/services/upload", formData)
  }

  async update(id: string, data: Partial<Omit<Service, "id">>): Promise<Service> {
    return apiClient.patch<Service>(`/services/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/services/${id}`)
  }

  async toggleFeatured(id: string): Promise<Service> {
    const service = await this.getById(id)
    if (!service) throw new Error("Service not found")
    return this.update(id, { featured: !service.featured })
  }

  async getByCategory(category: string): Promise<Service[]> {
    return apiClient.get<Service[]>(`/services?category=${category}`)
  }

  async getFeatured(): Promise<Service[]> {
    return apiClient.get<Service[]>("/services?featured=true")
  }
}

export const servicesService = new ServicesService()
```

---

## Task 3.2-3.7: Update Existing Services

Apply pattern to:
- `services/gallery.service.ts`
- `services/bookings.service.ts`
- `services/banners.service.ts`
- `services/contacts.service.ts`
- `services/businessInfo.service.ts`
- `services/heroSettings.service.ts`

### Example: gallery.service.ts

```typescript
import type { GalleryItem } from "@repo/types/gallery"
import { apiClient } from "@/lib/apiClient"
import { ApiError } from "@/lib/apiError"

export class GalleryService {
  async getAll(): Promise<GalleryItem[]> {
    return apiClient.get<GalleryItem[]>("/gallery")
  }

  async getById(id: string): Promise<GalleryItem | null> {
    try {
      return await apiClient.get<GalleryItem>(`/gallery/${id}`)
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null
      }
      throw error
    }
  }

  async create(data: Omit<GalleryItem, "id" | "createdAt">): Promise<GalleryItem> {
    return apiClient.post<GalleryItem>("/gallery", data)
  }

  async update(id: string, data: Partial<Omit<GalleryItem, "id" | "createdAt">>): Promise<GalleryItem> {
    return apiClient.patch<GalleryItem>(`/gallery/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/gallery/${id}`)
  }

  async toggleFeatured(id: string): Promise<GalleryItem> {
    const item = await this.getById(id)
    if (!item) throw new Error("Gallery item not found")
    return this.update(id, { featured: !item.featured })
  }

  async getFeatured(): Promise<GalleryItem[]> {
    return apiClient.get<GalleryItem[]>("/gallery?featured=true")
  }

  async getByCategory(category: string): Promise<GalleryItem[]> {
    if (category === "all") return this.getAll()
    return apiClient.get<GalleryItem[]>(`/gallery?category=${category}`)
  }

  // Bulk operations if API supports
  async createMultiple(items: Omit<GalleryItem, "id" | "createdAt">[]): Promise<GalleryItem[]> {
    return apiClient.post<GalleryItem[]>("/gallery/bulk", { items })
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    return apiClient.delete<void>("/gallery/bulk-delete", { body: { ids } })
  }
}

export const galleryService = new GalleryService()
```

---

## Validation Per Service

1. Start backend: `cd apps/api && npm run dev`
2. Start admin: `cd apps/admin && npm run dev`
3. Navigate to service page
4. Verify: Data loads from API
5. Test: Create new item
6. Test: Update existing item
7. Test: Delete item
8. Check: Console has no errors
9. Check: Network tab shows API calls with auth headers

---

## Completion Criteria

- [ ] services.service.ts created
- [ ] All 7 services updated (removed mock)
- [ ] All pages load real data
- [ ] CRUD operations work
- [ ] Auth headers present in requests
- [ ] 404 errors handled gracefully
- [ ] No TypeScript errors

---

## Next: Phase 4 - Media Upload
