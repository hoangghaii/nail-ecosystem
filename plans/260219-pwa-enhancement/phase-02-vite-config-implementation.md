# Phase 02 — Implementation Steps: VitePWA Config Update

## Context Links

- Design doc: [phase-02-vite-config.md](./phase-02-vite-config.md)
- Target file: `/Users/hainguyen/Documents/nail-project/apps/client/vite.config.ts`
- Plan overview: [plan.md](./plan.md)

---

## Overview

**Date**: 2026-02-19
**Status**: Pending (blocked by Phase 01 icon generation)

Execution steps for replacing the minimal `VitePWA()` call with the expanded manifest + workbox config. See design doc for architecture and rationale.

---

## Implementation Steps

**Step 1 — Verify current file state**

Read `apps/client/vite.config.ts` to confirm content hasn't changed since planning.
- Expected: `VitePWA` block at lines 29–34
- Formatting: 2-space indent, double quotes

**Step 2 — Locate exact replacement target**

Current `VitePWA` block (lines 29–34):
```ts
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
    }),
```

**Step 3 — Apply replacement**

Replace the block above with:
```ts
    VitePWA({
      devOptions: {
        enabled: true,
      },
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
    }),
```

**Step 4 — Type-check**

```bash
cd /Users/hainguyen/Documents/nail-project && npm run type-check
```

Must exit 0. If TypeScript error on `workbox` key — check `vite-plugin-pwa` type exports; the `workbox` property accepts `InjectManifestOptions | GenerateSWOptions` depending on `strategies` field (default is `generateSW`).

**Step 5 — Build**

```bash
cd /Users/hainguyen/Documents/nail-project && npx turbo build --filter=client
```

Must exit 0. Expected new outputs in `apps/client/dist/`:
- `sw.js` — generated service worker with runtime caching
- `manifest.webmanifest` — PWA manifest with brand data

**Step 6 — Verify manifest output**

```bash
cat /Users/hainguyen/Documents/nail-project/apps/client/dist/manifest.webmanifest
```

Must contain:
- `"name": "Pink Nail Art Studio"`
- `"short_name": "Pink. Nails"`
- `"theme_color": "#D1948B"`
- `"background_color": "#FDF8F5"`
- `"icons"` array with both `icon-192.png` and `icon-512.png`

**Step 7 — Dev smoke test (optional)**

```bash
npx turbo dev --filter=client
```

Open `http://localhost:5173` → DevTools → Application tab:
- "Manifest" panel: verify name, colors, icons load
- "Service Workers" panel: verify SW registered and active

---

## Todo List

- [ ] Read `vite.config.ts` to confirm current state matches plan
- [ ] Apply `VitePWA` block replacement (Step 3)
- [ ] Run `npm run type-check` — must exit 0
- [ ] Run `npx turbo build --filter=client` — must exit 0
- [ ] Verify `dist/manifest.webmanifest` has correct brand data
- [ ] Verify `dist/sw.js` exists
- [ ] (Optional) Dev server smoke test via DevTools Application tab

---

## Success Criteria

- `npm run type-check` passes, no TypeScript errors
- `npx turbo build --filter=client` succeeds
- `dist/manifest.webmanifest` contains correct name, colors, icons
- `dist/sw.js` exists and includes Cloudinary + API cache rules
- No regression in react/tailwindcss plugins

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| TS error on `workbox.runtimeCaching` type | Low | Medium | `vite-plugin-pwa@1.x` fully types this; if error occurs, verify `strategies` default is `"generateSW"` |
| `urlPattern` misses dev API (`localhost:3000`) | Medium | Low | NetworkFirst silently falls through; production Nginx path `/api/...` is correct |
| SW caches stale API responses | Low | Medium | NetworkFirst always attempts fresh fetch first; cache used only on offline/timeout |
| `purpose: "any maskable"` clips logo on Android | Medium | Low | SVG background circle ~96% canvas fill; clipping in safe zone acceptable |
| Turbo cached build serves stale dist | Low | Low | Run `npm run clean` to clear Turbo cache; rebuilt from scratch |

---

## Next Steps

After phase completes:
1. Full validation: `npm run type-check && npm run build`
2. Browser DevTools check (Manifest + Service Workers panels)
3. Mobile test: verify "Add to Home Screen" prompt appears
4. Noted for future (out of scope): add `<link rel="apple-touch-icon">` in `index.html` for iOS PWA
