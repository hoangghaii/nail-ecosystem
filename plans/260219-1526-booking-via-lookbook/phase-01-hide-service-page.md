# Phase 01: Hide Service Page

**Parent Plan:** [plan.md](./plan.md)

---

## Overview

- **Date:** 2026-02-19
- **Priority:** High (blocks Phase 02)
- **Status:** Pending
- **Description:** Remove all customer-facing entry points to `/services` and redirect any direct URL access to `/gallery`.

---

## Key Insights

From code analysis:

1. **Header nav** (`Header.tsx` L7-13): `navigation` array contains `{ href: "/services", name: "Dịch Vụ" }` at index 1. Rendered in both desktop and mobile menus.
2. **Footer** (`Footer.tsx` L50-55): Has a `<Link to="/services">` "Dịch Vụ Của Chúng Tôi" in "Liên Kết Nhanh" section.
3. **Router** (`App.tsx` L33-40): `/services` route is lazy-loaded, renders `<ServicesPage>`.
4. **HomePage** (`HomePage.tsx` L25): Renders `<ServicesOverview>` — the "Dịch Vụ Nổi Bật" section.
5. **ServicesOverview** (`ServicesOverview.tsx` L151-160): Contains `<Link to="/services">` "Xem Tất Cả Dịch Vụ" CTA at bottom. Individual service cards link to `/booking` directly (already OK since that redirect changes in Phase 02).
6. **BookingPage** (`BookingPage.tsx` L157): "← Thay đổi dịch vụ" link points to `/services` — must change in Phase 02.
7. **`ServicesPage`** lazy import still exists in `App.tsx` but can be removed to shrink bundle.

No other files reference `/services` routes found in navigation context (Hero CTAs go to `/gallery` and `/booking`, already correct).

---

## Requirements

### Functional
- `/services` URL must not be accessible to customers — redirect to `/gallery`
- Header nav must not show "Dịch Vụ" link
- Footer "Liên Kết Nhanh" must not show "Dịch Vụ Của Chúng Tôi"
- `ServicesOverview` section on HomePage must be hidden or replaced with Lookbook CTA
- "Xem Tất Cả Dịch Vụ" CTA in `ServicesOverview` must not link to `/services`

### Non-functional
- No broken nav or console errors
- Bundle: remove unused lazy import of `ServicesPage` (optional but clean)
- YAGNI: no feature flag — direct code removal (task is "temporary" but simpler to restore from git)

---

## Architecture

```
Before:
  Header nav: Home | Dịch Vụ | Lookbook | Đặt Lịch | Liên Hệ
  Footer: Dịch Vụ Của Chúng Tôi | Lookbook | Đặt Lịch | Liên Hệ
  Router: / | /services | /gallery | /booking | /contact
  HomePage: HeroSection > LookbookHighlight > AboutSection > ServicesOverview

After:
  Header nav: Home | Lookbook | Đặt Lịch | Liên Hệ
  Footer: Lookbook | Đặt Lịch | Liên Hệ
  Router: / | /gallery | /booking | /contact  (+  /services → redirect /gallery)
  HomePage: HeroSection > LookbookHighlight > AboutSection  [ServicesOverview removed]
```

**Redirect strategy:** Replace `/services` `<Route>` with a `<Navigate to="/gallery" replace />` element. This handles direct URL access and bookmarks gracefully.

---

## Related Code Files

| File | Path | Action |
|------|------|--------|
| Router | `apps/client/src/App.tsx` | Modify — replace ServicesPage route with Navigate redirect; remove lazy import |
| Header | `apps/client/src/components/layout/Header.tsx` | Modify — remove `/services` entry from `navigation` array |
| Footer | `apps/client/src/components/layout/Footer.tsx` | Modify — remove `/services` link from quick links |
| HomePage | `apps/client/src/pages/HomePage.tsx` | Modify — remove `<ServicesOverview />` import and usage |
| ServicesOverview | `apps/client/src/components/home/ServicesOverview.tsx` | No change needed (file kept, just not rendered — or delete if confirmed unused) |
| ServicesPage | `apps/client/src/pages/ServicesPage.tsx` | No change needed (file kept for potential re-enable) |

---

## Implementation Steps

### Step 1 — Remove "Dịch Vụ" from Header nav

File: `apps/client/src/components/layout/Header.tsx`

Remove the services entry from the `navigation` array (line 9):

```typescript
// BEFORE
const navigation = [
  { href: "/", name: "Trang Chủ" },
  { href: "/services", name: "Dịch Vụ" },   // ← REMOVE THIS LINE
  { href: "/gallery", name: "Lookbook" },
  { href: "/booking", name: "Đặt Lịch" },
  { href: "/contact", name: "Liên Hệ" },
];

// AFTER
const navigation = [
  { href: "/", name: "Trang Chủ" },
  { href: "/gallery", name: "Lookbook" },
  { href: "/booking", name: "Đặt Lịch" },
  { href: "/contact", name: "Liên Hệ" },
];
```

### Step 2 — Remove "/services" link from Footer

File: `apps/client/src/components/layout/Footer.tsx`

Remove the `<li>` block containing the `/services` link (lines 49-55):

```typescript
// REMOVE this entire <li> block:
<li>
  <Link
    to="/services"
    className="text-sm transition-opacity hover:opacity-80"
  >
    Dịch Vụ Của Chúng Tôi
  </Link>
</li>
```

### Step 3 — Replace /services route with redirect in Router

File: `apps/client/src/App.tsx`

a) Remove the `ServicesPage` lazy import (lines 13-15):
```typescript
// REMOVE:
const ServicesPage = lazy(() =>
  import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage })),
);
```

b) Add `Navigate` to the React Router import:
```typescript
// BEFORE:
import { BrowserRouter, Routes, Route } from "react-router-dom";
// AFTER:
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
```

c) Replace the `/services` route (lines 34-41) with a redirect:
```typescript
// BEFORE:
<Route
  path="/services"
  element={
    <Suspense fallback={<PageLoader />}>
      <ServicesPage />
    </Suspense>
  }
/>

// AFTER:
<Route path="/services" element={<Navigate to="/gallery" replace />} />
```

d) If `Suspense` is now only used for gallery/booking/contact (still 3 lazy routes), keep the import. Otherwise remove if unused. Check: `GalleryPage`, `BookingPage`, `ContactPage` are still lazy — `Suspense` stays.

### Step 4 — Remove ServicesOverview from HomePage

File: `apps/client/src/pages/HomePage.tsx`

a) Remove import:
```typescript
// REMOVE:
import { ServicesOverview } from "@/components/home/ServicesOverview";
```

b) Remove component from JSX:
```typescript
// BEFORE:
<HeroSection />
<LookbookHighlight />
<AboutSection />
<ServicesOverview />    // ← REMOVE

// AFTER:
<HeroSection />
<LookbookHighlight />
<AboutSection />
```

---

## Todo Checklist

- [ ] Remove `{ href: "/services", name: "Dịch Vụ" }` from `Header.tsx` navigation array
- [ ] Remove `/services` `<li>` link from `Footer.tsx`
- [ ] Add `Navigate` to Router import in `App.tsx`
- [ ] Remove `ServicesPage` lazy import from `App.tsx`
- [ ] Replace `/services` `<Route>` with `<Navigate to="/gallery" replace />` in `App.tsx`
- [ ] Remove `ServicesOverview` import from `HomePage.tsx`
- [ ] Remove `<ServicesOverview />` from `HomePage.tsx` JSX
- [ ] Run `npm run type-check` — verify 0 errors
- [ ] Manual test: navigate to `/services` → should redirect to `/gallery`
- [ ] Manual test: header no longer shows "Dịch Vụ" link
- [ ] Manual test: footer no longer shows "Dịch Vụ Của Chúng Tôi"
- [ ] Manual test: HomePage no longer shows "Dịch Vụ Nổi Bật" section

---

## Success Criteria

- Visiting `http://localhost:5173/services` redirects to `/gallery` (browser URL changes)
- Header nav shows 4 items: Trang Chủ | Lookbook | Đặt Lịch | Liên Hệ
- Footer "Liên Kết Nhanh" has no services link
- HomePage shows: HeroSection → LookbookHighlight → AboutSection (no ServicesOverview)
- `npm run type-check` passes
- No console errors or broken imports

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Someone has bookmarked `/services` | High | Low | `Navigate replace` handles gracefully |
| `ServicesPage` import lingering elsewhere | Low | Low | Global grep before removing lazy import |
| `Suspense` import becomes unused | Low | Medium | Keep — still needed for 3 other lazy routes |
| `ServicesOverview` referenced elsewhere | Low | Low | Only used in `HomePage.tsx` |

---

## Security Considerations

- No security impact — this is navigation/routing only
- `/services` API endpoints remain intact for admin and future use
- No auth or data exposure changes

---

## Next Steps

After Phase 01 complete:
- Proceed to Phase 02: update `BookingPage` "← Thay đổi dịch vụ" link and improve Lookbook booking UX
- Confirm whether `ServicesPage.tsx` and `ServicesOverview.tsx` files should be deleted or kept for future re-enable
