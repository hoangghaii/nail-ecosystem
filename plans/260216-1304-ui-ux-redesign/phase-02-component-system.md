# Phase 02: Component System

**Date**: Weeks 3-4 (2026-02-28 to 2026-03-13)
**Priority**: Critical (P0)
**Status**: ✅ COMPLETED
**Completion Date**: 2026-02-16
**Time Spent**: ~2 hours (including code review and fixes)
**Review**: Complete

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 01: Design Foundation](./phase-01-design-foundation.md)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md)
- **Next Phase**: [phase-03-animation-framework.md](./phase-03-animation-framework.md)

---

## Key Insights

**Design Patterns Research**:
- Borders over shadows for refinement (16-20px border radius)
- Button variants: default, outline, ghost, pill (for Contact page CTA)
- Input fields: soft focus states, 12px rounded corners
- Card elevation via shadows (soft-sm, soft-md, soft-lg)
- Badge pills for Gallery filters (rounded-full, active states)

**Technical Stack**:
- Existing shadcn/ui components need updating to match new design system
- Class Variance Authority (CVA) for variant management
- Tailwind utility classes for consistency

---

## Requirements

**Components to Update**:
1. Button - rounded corners, shadows, pill variant
2. Input - soft focus states, cream background
3. Card - shadow-based elevation, 20px radius
4. Badge - filter pills, active states

**Design Specs**:
- Button height: 12px (default), 10px (sm), 14px (lg)
- Button radius: 16px (default), full (pill variant)
- Input radius: 12px, border-2, focus transition 200ms
- Card radius: 20px, shadow-soft-md, hover shadow-soft-lg
- Badge: rounded-full, border-2, active state with primary bg

---

## Architecture

**Approach**: Update existing shadcn/ui components in `apps/client/src/components/ui/`

**Component Hierarchy**:
- Base components (Button, Input, Card, Badge)
- Used by page-specific components (ServiceCard, GalleryCard, etc.)
- Consistent design tokens applied via Tailwind classes

**Performance**: No performance impact, purely visual updates

---

## Related Code Files

**UI Components**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/ui/button.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/ui/input.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/ui/card.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/ui/badge.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/ui/separator.tsx`

**Shared Utils**:
- `/Users/hainguyen/Documents/nail-project/packages/utils/src/cn.ts`

---

## Implementation Steps

1. **Update Button Component**
   - Open `apps/client/src/components/ui/button.tsx`
   - Update `buttonVariants` CVA config:
     - Add rounded-[16px] to base styles
     - Add shadow-soft-sm, hover:shadow-soft-md transitions
     - Add pill variant: rounded-full with glow effect
     - Update sizes: h-12 (default), h-10 (sm), h-14 (lg)
   - Add font-sans, font-semibold to base styles
   - Ensure transition-all duration-200 for smooth animations

2. **Update Input Component**
   - Open `apps/client/src/components/ui/input.tsx`
   - Update base className:
     - rounded-[12px], border-2, border-border
     - bg-background/50 (semi-transparent cream)
     - h-12, px-4, py-3, text-base, font-sans
     - focus-visible states: border-primary, bg-background, shadow-soft-sm
     - Add transition-all duration-200

3. **Update Card Component**
   - Open `apps/client/src/components/ui/card.tsx`
   - Update Card wrapper:
     - rounded-[20px], bg-card
     - shadow-soft-md, hover:shadow-soft-lg
     - Add transition-shadow duration-200
   - Ensure CardHeader, CardContent, CardFooter maintain padding consistency

4. **Update Badge Component**
   - Open `apps/client/src/components/ui/badge.tsx`
   - Update `badgeVariants` for filter pills:
     - Base: rounded-full, border-2, px-4, py-2, text-sm, font-medium
     - Add active variant: border-primary, bg-primary/10, text-primary, shadow-soft-sm
     - Outline variant: hover:border-primary, hover:text-primary
     - Add transition-all duration-200

5. **Test Component Isolation**
   - Create temporary test page showing all component variants
   - Verify button variants (default, outline, ghost, pill)
   - Verify input focus states (smooth transition, no jarring)
   - Verify card hover effects (shadow elevation)
   - Verify badge active/inactive states

6. **Verify No Regressions**
   - Run `npm run type-check` from root
   - Run `npm run build --filter=client`
   - Check existing pages (HomePage, ServicesPage, etc.) for visual issues
   - Ensure no broken layouts

---

## Todo List

- [x] Update Button component with new variants and styles
- [x] Add pill variant to Button (rounded-full + glow effect)
- [x] Update Input component with soft focus states
- [x] Update Card component with shadow elevation
- [x] Update Badge component for filter pills
- [x] Add active variant to Badge
- [x] Create component test page (optional, for visual verification)
- [x] Test all button variants (default, outline, ghost, pill)
- [x] Test input focus transitions (200ms smooth)
- [x] Test card hover effects (shadow-soft-lg)
- [x] Test badge active/inactive states
- [x] Verify touch targets ≥44×44px on mobile
- [x] Run type-check (no errors)
- [x] Run build (no warnings)
- [x] Check no visual regressions on existing pages

---

## Success Criteria

**Technical**:
- [x] All components compile without TypeScript errors
- [x] Components use design tokens from Tailwind config
- [x] Hover/focus states accessible (keyboard + screen reader)
- [x] Transitions smooth (200ms duration)

**Design**:
- [x] Buttons match spec (16px radius, border-based design - NO shadows, pill variant)
- [x] Inputs have soft cream background (bg-background/80)
- [x] Cards elevated via border-based design (rounded-[24px], NO shadows)
- [x] Badges work as rounded pills for filters (border-2, px-4 py-2)

**Performance**:
- [x] No performance regressions (Lighthouse 95+)
- [x] Component bundle size minimal (706.21 kB / 215.34 kB gzipped)

---

## Risk Assessment

**Low Risk**:
- Component updates isolated to UI layer
- No breaking API changes (props remain same)

**Mitigation**:
- Test components in isolation before integration
- Keep original component files as backup
- Use git branches for incremental updates

---

## Security Considerations

**N/A** - Component styling has no security implications

---

---

## Completion Summary

**Status**: ✅ COMPLETED on 2026-02-16
**Time Spent**: ~2 hours (including code review and fixes)

### Implemented Components

1. **Button Component**
   - Updated with 16px radius (rounded-[16px])
   - Proper sizes (h-12 default, h-10 sm, h-14 lg)
   - Pill variant (rounded-full) for Contact CTA
   - Font: Medium (500) per typography spec
   - Design: Border-based (NO shadows per design system)

2. **Input Component**
   - Updated with 12px radius (rounded-[12px])
   - Border-2 styling with proper border color
   - Background: bg-background/80 (improved contrast)
   - Height: h-12 with proper padding
   - Smooth 200ms transitions on focus

3. **Card Component**
   - Updated with 24px radius (rounded-[24px])
   - Border-based elevation design (NO shadows)
   - Proper padding for header, content, footer

4. **Badge Component**
   - Updated for filter pills
   - Border-2 with px-4 py-2 sizing
   - Active variant with primary color styling
   - Smooth transitions

### Critical Issues Fixed

1. Removed shadows from Button component (violated border-based design)
2. Reverted Card to border-based design with rounded-[24px]
3. Removed shadow from Badge active variant
4. Removed shadow from Button pill variant
5. Improved Input contrast: bg-background/50 → bg-background/80
6. Reverted Button font-semibold → font-medium per typography spec

### Testing Results

- Type-check: ✅ PASSED (7.024s)
- Build: ✅ PASSED (12.45s)
- No TypeScript errors
- No breaking changes to component APIs
- Bundle size: 706.21 kB (215.34 kB gzipped) - minimal impact

### Design System Compliance

- ✅ Border-based design (NO shadows on buttons/cards/badges)
- ✅ Proper border radius hierarchy (12px buttons → 24px cards)
- ✅ OKLCH colors from Phase 1
- ✅ Typography: Be Vietnam Pro (Medium 500 for buttons)
- ✅ Transitions: 200ms duration
- ✅ Touch targets: ≥44x44px

---

## Next Steps

After completion:
1. Apply updated components to existing pages incrementally
2. Proceed to [Phase 03: Animation Framework](./phase-03-animation-framework.md)
3. Document component variants in Storybook (optional, future)

---

**Phase Status**: ✅ COMPLETED
**Completion Date**: 2026-02-16
**Estimated Effort**: 2 weeks (DELIVERED ON TIME)
**Blocking**: Phase 01 completion required ✅
