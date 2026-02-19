# Phase 01 — Generate PNG Icons from SVG

## Context Links

- Source SVG: `/Users/hainguyen/Documents/nail-project/apps/client/public/muse-nail-icon.svg`
- Plan overview: [plan.md](./plan.md)
- Phase 02 depends on this output: [phase-02-vite-config.md](./phase-02-vite-config.md)

---

## Overview

**Date**: 2026-02-19
**Priority**: High (blocks Phase 02)
**Status**: Pending

Generate two PNG icons required by the PWA manifest. Source SVG is a 100x100 circular nail icon with `#F9F5F2` background and `#CFAE88` stroke. ImageMagick v7 (`magick` command) is confirmed available at `/opt/homebrew/bin/magick`.

---

## Key Insights

- SVG native size: 100x100, viewBox matches — ImageMagick will upscale cleanly via vector rendering
- ImageMagick v7 deprecates `convert` in favor of `magick` — must use `magick` not `convert`
- Icons dir `apps/client/public/icons/` does not exist — must `mkdir -p` first
- SVG has circular border design — auto-crops cleanly to square canvas
- Density flag (`-density`) needed for clean SVG rasterization at high resolution
- Background of SVG is already present (`#F9F5F2`) — no transparency compositing needed

---

## Requirements

**Functional**
- `icon-192.png`: 192x192px PNG, for standard PWA icon
- `icon-512.png`: 512x512px PNG, for PWA splash/maskable use
- Both must be valid, non-corrupt PNG files
- Color fidelity must match SVG source (`#CFAE88` gold border, `#F9F5F2` background)

**Non-functional**
- Idempotent: re-running commands overwrites existing files safely
- No new npm packages required (ImageMagick is system tool)

---

## Architecture

```
muse-nail-icon.svg (100x100 vector)
    |
    | magick  -density 300 -background none -resize 192x192
    v
icon-192.png (192x192 raster)

    | magick  -density 300 -background none -resize 512x512
    v
icon-512.png (512x512 raster)
```

**Density reasoning**: `-density 300` instructs ImageMagick to render SVG at 300 DPI before resizing — ensures anti-aliasing quality. Then `-resize` scales to exact pixel target.

---

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `apps/client/public/icons/icon-192.png` | Create | 192x192 PNG output |
| `apps/client/public/icons/icon-512.png` | Create | 512x512 PNG output |

No existing files modified.

---

## Implementation Steps

1. **Create icons directory**
   ```bash
   mkdir -p /Users/hainguyen/Documents/nail-project/apps/client/public/icons
   ```

2. **Generate icon-192.png**
   ```bash
   magick \
     -density 300 \
     -background none \
     /Users/hainguyen/Documents/nail-project/apps/client/public/muse-nail-icon.svg \
     -resize 192x192 \
     /Users/hainguyen/Documents/nail-project/apps/client/public/icons/icon-192.png
   ```

3. **Generate icon-512.png**
   ```bash
   magick \
     -density 300 \
     -background none \
     /Users/hainguyen/Documents/nail-project/apps/client/public/muse-nail-icon.svg \
     -resize 512x512 \
     /Users/hainguyen/Documents/nail-project/apps/client/public/icons/icon-512.png
   ```

4. **Verify outputs**
   ```bash
   magick identify \
     /Users/hainguyen/Documents/nail-project/apps/client/public/icons/icon-192.png \
     /Users/hainguyen/Documents/nail-project/apps/client/public/icons/icon-512.png
   ```
   Expected output lines:
   ```
   icon-192.png PNG 192x192 192x192+0+0 ...
   icon-512.png PNG 512x512 512x512+0+0 ...
   ```

5. **Visual spot-check** (optional but recommended)
   Open files in macOS Preview or browser to confirm color fidelity.

---

## Todo List

- [ ] Create `apps/client/public/icons/` directory
- [ ] Run ImageMagick command for `icon-192.png`
- [ ] Run ImageMagick command for `icon-512.png`
- [ ] Run `magick identify` to verify dimensions and format
- [ ] Visual spot-check both PNGs

---

## Success Criteria

- `apps/client/public/icons/icon-192.png` exists, is valid PNG, 192x192px
- `apps/client/public/icons/icon-512.png` exists, is valid PNG, 512x512px
- Both files render the nail icon correctly (gold border, cream background)
- `magick identify` reports correct dimensions without errors

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ImageMagick SVG renderer produces poor quality | Low | Medium | Use `-density 300` flag; visually verify output |
| `magick` command not found in PATH | Low | High | Confirmed at `/opt/homebrew/bin/magick` — use full path if needed |
| SVG has external font references that fail to resolve | Low | Low | Icon SVG is purely geometric (circle + shapes), no text/fonts observed |
| Output PNG has unexpected transparency artifacts | Low | Medium | SVG has explicit `fill="#F9F5F2"` background circle — solid output expected |

---

## Security Considerations

- No network calls; purely local file operations
- ImageMagick processes local SVG only — no external URL fetch risk
- Output PNGs served as static assets — no server-side processing

---

## Next Steps

After Phase 01 completes, proceed to **Phase 02** to reference these icons in the `vite.config.ts` manifest configuration.
