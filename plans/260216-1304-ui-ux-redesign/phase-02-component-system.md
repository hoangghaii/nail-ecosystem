# Phase 02: Component System

**Date**: Weeks 3-4 (2026-02-28 to 2026-03-13)
**Priority**: Critical (P0)
**Status**: Implementation Ready
**Review**: Pending

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

- [ ] Update Button component with new variants and styles
- [ ] Add pill variant to Button (rounded-full + glow effect)
- [ ] Update Input component with soft focus states
- [ ] Update Card component with shadow elevation
- [ ] Update Badge component for filter pills
- [ ] Add active variant to Badge
- [ ] Create component test page (optional, for visual verification)
- [ ] Test all button variants (default, outline, ghost, pill)
- [ ] Test input focus transitions (200ms smooth)
- [ ] Test card hover effects (shadow-soft-lg)
- [ ] Test badge active/inactive states
- [ ] Verify touch targets ≥44×44px on mobile
- [ ] Run type-check (no errors)
- [ ] Run build (no warnings)
- [ ] Check no visual regressions on existing pages

---

## Success Criteria

**Technical**:
- [ ] All components compile without TypeScript errors
- [ ] Components use design tokens from Tailwind config
- [ ] Hover/focus states accessible (keyboard + screen reader)
- [ ] Transitions smooth (200ms duration)

**Design**:
- [ ] Buttons match spec (16px radius, shadows, pill variant)
- [ ] Inputs have soft cream background (#FDF8F5)
- [ ] Cards elevated via shadows (no thick borders)
- [ ] Badges work as rounded pills for filters

**Performance**:
- [ ] No performance regressions (Lighthouse 95+)
- [ ] Component bundle size minimal (use existing CVA)

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

## Next Steps

After completion:
1. Apply updated components to existing pages incrementally
2. Proceed to [Phase 03: Animation Framework](./phase-03-animation-framework.md)
3. Document component variants in Storybook (optional, future)

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 01 completion required
