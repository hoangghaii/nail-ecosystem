# PWA Enhancement — Pink Nail Client App

**Date**: 2026-02-19
**Status**: Planning
**Scope**: `apps/client` only

## Objective

Two targeted improvements to VitePWA:
1. Web App Manifest with brand identity (icons + colors)
2. Runtime caching: Cloudinary images (CacheFirst) + API responses (NetworkFirst)

## Context

- `vite-plugin-pwa: ^1.2.0` — already installed, zero-config currently
- `VitePWA({ registerType: "autoUpdate", devOptions: { enabled: true } })` — no manifest, no workbox config
- Source icon: `apps/client/public/muse-nail-icon.svg` (100x100 SVG, confirmed valid)
- ImageMagick v7 available: `magick` command (not `convert`)
- Icons dir: `apps/client/public/icons/` does not exist yet
- Production API served at `/api` path via Nginx reverse proxy

## Phases

| # | Phase | File | Status |
|---|-------|------|--------|
| 1 | Generate PNG icons from SVG | [phase-01-icons.md](./phase-01-icons.md) | ✅ COMPLETED 2026-02-19 |
| 2 | Update VitePWA manifest + runtimeCaching | [phase-02-vite-config.md](./phase-02-vite-config.md) (design) · [phase-02-vite-config-implementation.md](./phase-02-vite-config-implementation.md) (steps) | ✅ COMPLETED 2026-02-19 |

## Files Modified

| File | Action | Note |
|------|--------|------|
| `apps/client/public/icons/icon-192.png` | Create | ImageMagick from SVG |
| `apps/client/public/icons/icon-512.png` | Create | ImageMagick from SVG |
| `apps/client/vite.config.ts` | Modify | Add manifest + workbox |

## Key Constraints

- YAGNI/KISS: only 2 files modified + 2 files created
- Type-check + build must pass post-change
- `vite-plugin-pwa@^1.2.0` API must be respected
- ImageMagick v7 uses `magick` not `convert`

## Dependency Order

Phase 1 (icons) → Phase 2 (vite config references icons)

## Validation

```bash
cd /Users/hainguyen/Documents/nail-project
npm run type-check        # must pass
npx turbo build --filter=client   # must pass
```

---

## Unresolved Questions

1. **Maskable icon**: Current SVG has a background circle — safe zone (80% of canvas) coverage unknown. The `purpose: "any maskable"` on icon-512 may clip logo. Should icon-512 have separate `purpose: "any"` and `purpose: "maskable"` entries with a padded maskable variant?
2. **API URL pattern**: `urlPattern: /\/api\/(gallery|services)/` assumes production Nginx path. In dev, API is at `http://localhost:3000/gallery` (no `/api` prefix). Should the pattern also cover `localhost:3000`?
3. **`vite-plugin-pwa` version lock**: `^1.2.0` allows minor updates — workbox config API is stable in v1.x but should be pinned for reproducibility?
4. **SVG rasterization quality**: ImageMagick SVG rendering uses librsvg/inkscape if available; without it falls back to internal renderer which may differ. Should we verify output visually before committing?
