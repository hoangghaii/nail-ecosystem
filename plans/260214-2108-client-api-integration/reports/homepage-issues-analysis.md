# Homepage Issues Analysis

**Date**: 2026-02-15
**Status**: API Connected ✅ | Issues Found

---

## Issue 1: Hero Section "Not Implemented" ❓

### Status: ✅ **ALREADY IMPLEMENTED**

The hero section IS fully implemented in `/apps/client/src/components/home/HeroSection.tsx`.

### Features Implemented

**Visual Elements**:
- ✅ Organic blob background (ellipse shape)
- ✅ Horizontal 2-column layout (content + video)
- ✅ Tagline: "Nơi Vẻ Đẹp Gặp Gỡ Nghệ Thuật"
- ✅ Main heading: "Chăm Sóc Móng Cao Cấp"
- ✅ Description text
- ✅ Hero video with controls and poster image
- ✅ Border-based design (matches client theme)

**Interactive Elements**:
- ✅ CTA Button 1: "Đặt Lịch Ngay" → `/booking`
- ✅ CTA Button 2: "Xem Dịch Vụ" → `/services`
- ✅ Video play/pause state tracking
- ✅ Animated border color on hover/play
- ✅ Motion (Framer Motion) animations for entrance

**Responsive**:
- ✅ Mobile: Stacked layout, centered text
- ✅ Desktop: 2-column layout, left-aligned text
- ✅ Tablet: Responsive button sizing

### Video Source

**Current**:
- Poster: Unsplash image (nail salon photo)
- Video: Sample video (BigBuckBunny.mp4)

**Recommendation**: Replace with actual salon video/images when available.

---

## Issue 2: Services Overview - No Images ❌

### Status: ❌ **MISSING** - Images not in seed data

### Root Cause

**ServicesOverview component** (`apps/client/src/components/home/ServicesOverview.tsx`) expects `service.imageUrl`:

```tsx
<motion.img
  src={service.imageUrl}  // ← imageUrl is undefined
  alt={service.name}
  className="rounded-[16px] h-56 w-full object-cover"
/>
```

**API Response** (example service):
```json
{
  "_id": "696a475b58d14615a4ab3bf1",
  "name": "Classic Manicure",
  "description": "Traditional manicure with nail shaping...",
  "price": 25,
  "duration": 30,
  "category": "manicure",
  "featured": true,
  "isActive": true,
  "sortIndex": 0,
  // ❌ NO imageUrl field
}
```

**Seed Data** (`apps/api/src/seeds/data/services.data.ts`):
- ✅ Has: name, description, price, duration, category, featured, isActive, sortIndex
- ❌ Missing: imageUrl

**Type Definition** (`packages/types/src/service.ts`):
```typescript
export type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  imageUrl?: string;  // ← Optional field defined
  featured?: boolean;
};
```

**Schema** (`apps/api/src/modules/services/schemas/service.schema.ts`):
```typescript
@Prop()
imageUrl?: string;  // ← Field exists in schema (optional)
```

### Impact

**Current Behavior**:
- Services load from API ✅
- Service cards render ✅
- Images fail to display ❌ (broken image or undefined src)
- Name, description, price, duration display correctly ✅

**User Experience**:
- Services show as cards with text only
- No visual appeal for featured services
- Looks incomplete/broken

---

## Solution: Add Images to Seed Data

### Option 1: Placeholder Images (Quick Fix)

Update `/apps/api/src/seeds/data/services.data.ts`:

```typescript
export const servicesData = [
  {
    name: 'Classic Manicure',
    description: 'Traditional manicure with nail shaping, cuticle care, and polish application',
    category: 'manicure',
    price: 25,
    duration: 30,
    featured: true,
    isActive: true,
    sortIndex: 0,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop',
  },
  {
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish with LED curing for 2-3 weeks of shine',
    category: 'manicure',
    price: 40,
    duration: 45,
    featured: true,
    isActive: true,
    sortIndex: 1,
    imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop',
  },
  // ... add imageUrl to all services
];
```

**Steps**:
1. Add `imageUrl` field to all 19 services in seed data
2. Use Unsplash/Pexels free nail salon images
3. Delete existing services: MongoDB Compass or API endpoint
4. Re-seed database: Restart API or call seed endpoint
5. Verify images display on homepage

### Option 2: Graceful Fallback (Defensive Coding)

Update `/apps/client/src/components/home/ServicesOverview.tsx`:

```tsx
<motion.img
  src={service.imageUrl || '/placeholder-service.jpg'}
  alt={service.name}
  onError={(e) => {
    e.currentTarget.src = '/placeholder-service.jpg';
  }}
  className="rounded-[16px] h-56 w-full object-cover"
/>
```

**Benefits**:
- Handles missing images gracefully
- Shows placeholder instead of broken image
- Prevents layout shift

**Requires**:
- Add placeholder image to `apps/client/public/placeholder-service.jpg`

### Option 3: Upload Real Images (Production Ready)

1. **Prepare Images**:
   - Take/collect 19 service photos (one per service)
   - Optimize images (compress, resize to 800x600)
   - Upload to Cloudinary (already configured)

2. **Update Seed Data**:
   - Replace placeholder URLs with Cloudinary URLs
   - Format: `https://res.cloudinary.com/dqcmzla9k/image/upload/v1234567890/services/classic-manicure.jpg`

3. **Re-seed Database**

---

## Recommended Action

**Immediate (Phase 1 completion)**:
1. **Use Option 2** (graceful fallback) to prevent broken images
2. **Add placeholder-service.jpg** to client public folder
3. Test ServicesOverview displays cards without errors

**Short-term (Before Phase 2)**:
1. **Use Option 1** (Unsplash placeholders) for better visual appeal
2. Update seed data with free stock images
3. Re-seed database
4. Test services show images

**Long-term (Production)**:
1. **Use Option 3** (real salon images) for branding
2. Upload actual service photos
3. Update seed data with Cloudinary URLs

---

## Testing Steps

**After Fix**:
1. Navigate to http://localhost:5173 (homepage)
2. Scroll to "Dịch vụ Nổi bật" section
3. Verify 3 service cards display:
   - ✅ Service image (not broken)
   - ✅ Service name
   - ✅ Description
   - ✅ Price
   - ✅ Duration
   - ✅ "Đặt Lịch Ngay" button

**Browser Console**:
- Check for image load errors (404, CORS, etc.)
- Verify no React errors

---

## Summary

| Issue | Status | Solution | Priority |
|-------|--------|----------|----------|
| Hero Section | ✅ Implemented | None needed | N/A |
| Services Images | ❌ Missing | Add imageUrl to seed data | P1 |

**Next Step**: Choose Option 1, 2, or 3 above to fix service images before moving to Phase 2.
