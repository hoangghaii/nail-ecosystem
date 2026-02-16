# Phase 03: Animation Framework

**Date**: Weeks 5-6 (2026-03-14 to 2026-03-27)
**Priority**: High (P1)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 02: Component System](./phase-02-component-system.md)
- **Research**: [researcher-02-technical-stack.md](./research/researcher-02-technical-stack.md)
- **Next Phase**: [phase-04-gallery-masonry-layout.md](./phase-04-gallery-masonry-layout.md)

---

## Key Insights

**Technical Stack Research**:
- Motion (Framer Motion) for GPU-accelerated animations
- Animate only: scale, rotate, x, y, opacity (GPU-friendly)
- Avoid: top, left, width, height (triggers layout recalculation)
- Duration: 200-400ms for premium feel
- Respect prefers-reduced-motion for accessibility

**Performance**:
- Use will-change sparingly (only on animated elements)
- Motion values over state (no re-renders)
- Stagger animations: 50-100ms between starts

---

## Requirements

**Animation Types**:
1. Page transitions (fade-in, slide-in)
2. Hover effects (scale, shadow, overlay)
3. Button interactions (scale on tap)
4. Modal entrance/exit (zoom + fade)
5. Filter transitions (smooth gallery re-layout)

**Design Specs**:
- Hover scale: 1.05x - 1.1x
- Duration: 200ms (hover), 300-500ms (page transitions)
- Easing: spring for interactions, ease-out for transitions
- Stagger delay: 100ms for sequential animations

---

## Architecture

**Approach**: Integrate Motion (Framer Motion) for consistent animations

**Files to Create**:
- `apps/client/src/utils/animations.ts` - Reusable animation variants
- Update components to use motion components

**Performance Strategy**:
- Use `<motion.div>` only where needed (not everywhere)
- Lazy load Motion where possible
- GPU-accelerated properties only

---

## Related Code Files

**New Files**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/utils/animations.ts`

**Components to Update**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/HomePage.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/GalleryCard.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/ui/button.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/package.json`

---

## Implementation Steps

1. **Verify Motion Installation**
   - Check `apps/client/package.json` for `motion` or `framer-motion`
   - Current project likely has Motion already installed
   - If not: `npm install motion --workspace=client`

2. **Create Animation Utilities**
   - Create `apps/client/src/utils/animations.ts`
   - Define reusable animation variants:
     ```typescript
     // Page entrance animations
     export const pageVariants = {
       initial: { opacity: 0, y: 20 },
       animate: { opacity: 1, y: 0 },
       exit: { opacity: 0, y: -20 },
     };

     // Stagger children animations
     export const staggerContainer = {
       animate: { transition: { staggerChildren: 0.1 } }
     };

     // Hover scale effect
     export const hoverScale = {
       rest: { scale: 1 },
       hover: { scale: 1.05 },
       tap: { scale: 0.95 },
     };

     // Modal animations
     export const modalVariants = {
       hidden: { opacity: 0, scale: 0.95 },
       visible: { opacity: 1, scale: 1 },
     };
     ```

3. **Apply Page Transitions**
   - Wrap page components with motion.div
   - Apply fade-in effect on mount
   - Example for HomePage:
     ```tsx
     <motion.div
       initial="initial"
       animate="animate"
       exit="exit"
       variants={pageVariants}
       transition={{ duration: 0.4 }}
     >
       {/* page content */}
     </motion.div>
     ```

4. **Add Hover Animations to Gallery**
   - Update GalleryCard to use motion
   - Image zoom on hover (scale: 1.1)
   - Smooth transition 300-500ms
   - GPU-accelerated transform only

5. **Button Tap Animations**
   - Add whileTap={{ scale: 0.95 }} to buttons
   - Subtle feedback for user interactions
   - 150ms duration for quick response

6. **Test Animation Performance**
   - Open Chrome DevTools Performance tab
   - Record during animations (gallery hover, page transitions)
   - Verify 60fps (frame time <16ms)
   - Check no layout thrashing

7. **Accessibility Check**
   - Test with prefers-reduced-motion enabled
   - Animations should skip or reduce
   - Add media query handling:
     ```typescript
     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.3 };
     ```

---

## Todo List

- [ ] Verify Motion package installed in apps/client
- [ ] Create apps/client/src/utils/animations.ts utility file
- [ ] Define reusable animation variants (page, stagger, hover, modal)
- [ ] Apply page transitions to HomePage
- [ ] Apply page transitions to GalleryPage
- [ ] Apply page transitions to BookingPage
- [ ] Add hover scale to GalleryCard images
- [ ] Add whileTap to Button component
- [ ] Test animations in Chrome DevTools (60fps check)
- [ ] Test prefers-reduced-motion accessibility
- [ ] Verify no layout shift during animations (CLS <0.1)
- [ ] Document animation patterns in code comments

---

## Success Criteria

**Technical**:
- [ ] All animations 60fps (frame time <16ms)
- [ ] GPU-accelerated properties only (scale, opacity, x, y)
- [ ] No layout thrashing (check Performance tab)
- [ ] prefers-reduced-motion respected

**Design**:
- [ ] Animations feel premium (200-400ms duration)
- [ ] Transitions smooth, not jarring
- [ ] Hover effects subtle (1.05x - 1.1x scale)
- [ ] Modal entrance/exit polished

**Performance**:
- [ ] Lighthouse Performance: 95+ maintained
- [ ] Bundle size increase acceptable (<10KB for Motion)
- [ ] No animation lag on mid-tier devices

---

## Risk Assessment

**Medium Risk**:
- Motion bundle size (~25KB gzipped) - acceptable for features gained
- Over-animation can feel gimmicky - keep subtle

**Mitigation**:
- Use animations sparingly (only where value-added)
- Test on low-end devices (throttle CPU 4x in DevTools)
- Lazy load Motion on non-critical pages

---

## Security Considerations

**N/A** - Animation library has no security implications

---

## Next Steps

After completion:
1. Apply animations to all major page transitions
2. Proceed to [Phase 04: Gallery Masonry Layout](./phase-04-gallery-masonry-layout.md)
3. Use animation utilities in upcoming phases (hover effects, modals)

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 02 completion required
