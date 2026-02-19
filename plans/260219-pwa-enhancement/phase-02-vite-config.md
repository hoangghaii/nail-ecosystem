# Phase 02 — Update VitePWA Manifest + runtimeCaching

## Context Links

- Target file: `/Users/hainguyen/Documents/nail-project/apps/client/vite.config.ts`
- Plan overview: [plan.md](./plan.md)
- Blocked by: [phase-01-icons.md](./phase-01-icons.md) (icons must exist first)
- Implementation steps: [phase-02-vite-config-implementation.md](./phase-02-vite-config-implementation.md)
- Plugin installed: `vite-plugin-pwa@^1.2.0` (`apps/client/package.json`)

---

## Overview

**Date**: 2026-02-19
**Priority**: High
**Status**: Pending (blocked by Phase 01)

Extend the existing `VitePWA()` call in `vite.config.ts` with two additions:
1. `manifest` object — brand identity for PWA install prompt and OS integration
2. `workbox.runtimeCaching` array — offline-capable caching for Cloudinary images and API responses

---

## Key Insights

- Current `VitePWA` config is minimal: only `registerType` and `devOptions`. No `manifest`, no `workbox`.
- `vite-plugin-pwa@1.x` stable API — `manifest` and `workbox` keys unchanged from `0.x`.
- `workbox` key maps to Workbox `generateSW` config — `runtimeCaching` is standard array.
- Brand colors sourced from `index.html` OG meta + design system:
  - `theme_color: "#D1948B"` — dusty rose (primary brand)
  - `background_color: "#FDF8F5"` — warm cream (body background)
- Production API path `/api/(gallery|services)` matches Nginx proxy. Dev path (`localhost:3000`) differs — dev caching miss is silent and acceptable.
- `injectManifest` strategy NOT used — staying with default `generateSW` (KISS).
- `VitePWA()` infers types from inline object — no manual type import needed.

---

## Requirements

**Functional**
- Browser offers "Add to Home Screen" on mobile after manifest is present
- App name: "Pink Nail Art Studio", short name: "Pink. Nails"
- Icons: 192px (standard) and 512px (any + maskable) from Phase 01
- Cloudinary images cached 7 days, max 100 entries (CacheFirst)
- API gallery/services cached 24h, max 50 entries (NetworkFirst, 5s timeout)

**Non-functional**
- `npm run type-check` exits 0
- `npx turbo build --filter=client` exits 0
- Existing `registerType: "autoUpdate"` and `devOptions` preserved unchanged

---

## Architecture

### Before

```ts
VitePWA({
  devOptions: { enabled: true },
  registerType: "autoUpdate",
})
```

### After

```ts
VitePWA({
  devOptions: { enabled: true },
  manifest: {
    name: "Pink Nail Art Studio",
    short_name: "Pink. Nails",
    description:
      "Nail art studio cao cấp - Nơi sự sáng tạo gặp gỡ nghệ thuật",
    theme_color: "#D1948B",
    background_color: "#FDF8F5",
    display: "standalone",
    start_url: "/",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
  registerType: "autoUpdate",
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "cloudinary-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 604800, // 7 days
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern: /\/api\/(gallery|services)/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-responses",
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 86400, // 24 hours
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
})
```

### Cache Strategy Rationale

| Cache | Strategy | Reason |
|-------|----------|--------|
| Cloudinary images | CacheFirst | CDN-hosted, content-addressed URLs — never mutate |
| API gallery/services | NetworkFirst | Data mutates (admin CRUD); fresh data preferred; cache = offline fallback |

**`cacheableResponse: { statuses: [0, 200] }`** — status `0` covers opaque cross-origin responses. Cloudinary has CORS headers but including `0` is safe defensive default.

---

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `apps/client/vite.config.ts` | Modify | Add `manifest` + `workbox` blocks to `VitePWA()` |

No other files touched.

---

## Security Considerations

- Runtime caching intercepts GET only — no risk of caching POST/PATCH/DELETE mutations
- Only `statuses: [0, 200]` cached — 4xx/5xx errors never cached
- Cloudinary assets are public CDN — client-side caching is safe and intended
- API responses stored in browser Cache Storage — cleared on cache clear or SW update
- No auth tokens in gallery/services responses (public read endpoints)
