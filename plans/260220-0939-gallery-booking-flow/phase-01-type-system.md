# Phase 01 — Type System Update

## Context Links

- Plan: [plan.md](./plan.md)
- Target file: `apps/client/src/types/navigation.ts`

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-20 |
| Description | Add `ServicesNavigationState` union type + type guard to `navigation.ts` |
| Priority | High — blocks phases 02, 03, 04 |
| Implementation status | completed |
| Review status | completed |

---

## Key Insights

- `navigation.ts` already defines `BookingNavigationState` (two-variant union) and `isValidBookingState` type guard.
- No equivalent type exists for navigating to `/services` with gallery context.
- Keeping the type local to `apps/client/src/types/` is correct — `ServicesNavigationState` is pure client routing state, not a shared domain type.
- `verbatimModuleSyntax: true` is enforced — `import type` required for `GalleryItem`.

---

## Requirements

1. `ServicesNavigationState` type: `{ fromGallery: true; galleryItem: GalleryItem }`.
2. `isValidServicesState(state: unknown): state is ServicesNavigationState` type guard.
3. Guard validates: state is object, `fromGallery === true`, `galleryItem` exists, `galleryItem._id` is string.
4. Export both type and guard from same file.

---

## Architecture

No new files. Append to existing `apps/client/src/types/navigation.ts`.

```typescript
// Existing imports already have GalleryItem from "@repo/types/gallery" — reuse.
// (If not present, add the import.)

/**
 * Navigation state passed to ServicesPage when entering from Gallery.
 */
export type ServicesNavigationState = {
  fromGallery: true;
  galleryItem: GalleryItem;
};

/**
 * Type guard for ServicesNavigationState
 */
export function isValidServicesState(
  state: unknown
): state is ServicesNavigationState {
  if (!state || typeof state !== "object") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = state as any;
  return (
    s.fromGallery === true &&
    !!s.galleryItem &&
    typeof s.galleryItem._id === "string"
  );
}
```

---

## Related Code Files

- `apps/client/src/types/navigation.ts` — modify
- `apps/client/src/components/services/ServiceCard.tsx` — consumer (Phase 03)
- `apps/client/src/pages/ServicesPage.tsx` — consumer (Phase 04)

---

## Implementation Steps

1. Read current `navigation.ts` (already read — lines 1-48).
2. Check if `GalleryItem` is already imported. It is not — `navigation.ts` currently imports `GalleryItem` and `Service` (line 1-2 shows both imports exist in BookingNavigationState). Confirm `GalleryItem` import already present: `import type { GalleryItem } from "@repo/types/gallery";` — YES, line 1.
3. Append `ServicesNavigationState` type after `isValidBookingState` function.
4. Append `isValidServicesState` guard after the type.
5. Run `npm run type-check` from root to verify.

---

## Todo List

- [ ] Append `ServicesNavigationState` type to `navigation.ts`
- [ ] Append `isValidServicesState` guard to `navigation.ts`
- [ ] Verify `GalleryItem` import already present (it is — line 1)
- [ ] Run `npm run type-check`

---

## Success Criteria

- `navigation.ts` exports `ServicesNavigationState` and `isValidServicesState`
- No TS errors
- Existing `BookingNavigationState` and `isValidBookingState` unchanged

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Import conflict | Low | `GalleryItem` already imported on line 1 |
| Type guard false positive | Low | Guard checks `_id` string + `fromGallery === true` |

---

## Security Considerations

Type guard validates incoming router state defensively — prevents type confusion if state is tampered or stale.

---

## Next Steps

Phase 02 depends on this type being exported. Implement Phase 01 before 02, 03, 04.
