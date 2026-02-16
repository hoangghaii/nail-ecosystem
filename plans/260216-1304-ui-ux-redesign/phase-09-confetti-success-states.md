# Phase 09: Confetti & Success States

**Date**: Weeks 17-18 (2026-06-06 to 2026-06-19)
**Priority**: Low (P3) - Nice-to-Have
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 08: Booking Flow Enhancement](./phase-08-booking-flow-enhancement.md)
- **Research**: [researcher-02-technical-stack.md](./research/researcher-02-technical-stack.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md) - Confetti celebration
- **Next Phase**: [phase-10-homepage-polish.md](./phase-10-homepage-polish.md)

---

## Key Insights

**Technical Stack Research**:
- canvas-confetti: ~5KB gzipped, <10ms page load impact
- Keep particles <100 for smooth 60fps
- GPU-accelerated canvas rendering
- Built-in prefers-reduced-motion support (disabled by default, must enable)

**Performance**:
- Duration: 3 seconds (not overwhelming)
- Particle count: 50-80 per burst
- Fire from both sides for balanced effect
- Brand colors: #D1948B (dusty rose), #FDF8F5 (cream), #333333 (charcoal)

---

## Requirements

**Confetti Specs**:
- Trigger: On booking confirmation render
- Duration: 3 seconds
- Colors: Brand palette (#D1948B, #FDF8F5, #333333)
- Origin: Fire from left + right sides
- Particles: 50-80 per burst

**Accessibility**:
- Respect prefers-reduced-motion (skip animation)
- No animation on user preference
- z-index: 9999 (above all content)

---

## Architecture

**Approach**: Install canvas-confetti, create utility wrapper, trigger on success

**Lazy Loading**: Import confetti dynamically to avoid blocking main bundle

**Integration Point**: BookingConfirmation component

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/package.json`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/booking/BookingConfirmation.tsx`

**Files to Create**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/utils/confetti.ts`

---

## Implementation Steps

1. **Install canvas-confetti**
   - Run: `npm install canvas-confetti --workspace=client`
   - Run: `npm install --save-dev @types/canvas-confetti --workspace=client`
   - Verify in `apps/client/package.json`:
     ```json
     "dependencies": {
       "canvas-confetti": "^1.9.3"
     },
     "devDependencies": {
       "@types/canvas-confetti": "^1.6.4"
     }
     ```

2. **Create Confetti Utility**
   - Create `apps/client/src/utils/confetti.ts`:
     ```typescript
     export async function celebrateBooking() {
       // Lazy load to avoid blocking main bundle
       const confetti = (await import('canvas-confetti')).default;

       const duration = 3000;
       const animationEnd = Date.now() + duration;
       const defaults = {
         startVelocity: 30,
         spread: 360,
         ticks: 60,
         zIndex: 9999,
         colors: ['#D1948B', '#FDF8F5', '#333333'], // Brand colors
       };

       function randomInRange(min: number, max: number) {
         return Math.random() * (max - min) + min;
       }

       const interval: NodeJS.Timeout = setInterval(() => {
         const timeLeft = animationEnd - Date.now();

         if (timeLeft <= 0) {
           return clearInterval(interval);
         }

         const particleCount = 50 * (timeLeft / duration);

         // Fire from left
         confetti({
           ...defaults,
           particleCount,
           origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
         });

         // Fire from right
         confetti({
           ...defaults,
           particleCount,
           origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
         });
       }, 250);
     }
     ```

3. **Integrate into BookingConfirmation**
   - Open `apps/client/src/components/booking/BookingConfirmation.tsx`
   - Add celebrateBooking on mount:
     ```tsx
     import { useEffect } from 'react';
     import { celebrateBooking } from '@/utils/confetti';

     export function BookingConfirmation({ booking, onClose }: Props) {
       useEffect(() => {
         // Check user preference
         const prefersReducedMotion = window.matchMedia(
           '(prefers-reduced-motion: reduce)'
         ).matches;

         if (!prefersReducedMotion) {
           celebrateBooking();
         }
       }, []);

       return (
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.3 }}
           className="text-center space-y-6"
         >
           {/* Existing confirmation content */}
         </motion.div>
       );
     }
     ```

4. **Test Confetti Animation**
   - Complete a test booking
   - Verify confetti fires on confirmation screen
   - Check 3-second duration
   - Verify brand colors visible

5. **Test Accessibility**
   - Enable prefers-reduced-motion in OS:
     - macOS: System Preferences → Accessibility → Display → Reduce motion
     - Windows: Settings → Ease of Access → Display → Show animations
   - Complete booking
   - Verify confetti skipped

6. **Test Performance**
   - Open Chrome DevTools Performance tab
   - Record during confetti animation
   - Verify 60fps (frame time <16ms)
   - Check canvas-confetti clears after animation

7. **Test on Mobile**
   - Complete booking on mobile device
   - Verify confetti visible and performant
   - Check no frame drops

---

## Todo List

- [ ] Install canvas-confetti package
- [ ] Install @types/canvas-confetti dev dependency
- [ ] Create apps/client/src/utils/confetti.ts utility
- [ ] Implement celebrateBooking function with brand colors
- [ ] Add lazy loading (dynamic import)
- [ ] Integrate into BookingConfirmation component
- [ ] Add prefers-reduced-motion check
- [ ] Test confetti fires on booking confirmation
- [ ] Verify 3-second duration
- [ ] Verify brand colors (#D1948B, #FDF8F5, #333333)
- [ ] Verify z-index 9999 (above all content)
- [ ] Test with prefers-reduced-motion enabled (confetti skipped)
- [ ] Test performance (60fps, no jank)
- [ ] Test on mobile (smooth animation)
- [ ] Verify confetti clears after animation ends
- [ ] Check no console errors

---

## Success Criteria

**Technical**:
- [ ] Confetti fires on BookingConfirmation mount
- [ ] prefers-reduced-motion respected
- [ ] Lazy loaded (not in main bundle)
- [ ] z-index correct (above all content)

**Design**:
- [ ] Brand colors used (#D1948B, #FDF8F5, #333333)
- [ ] Fires from both sides (balanced effect)
- [ ] Duration: 3 seconds (not overwhelming)
- [ ] Particle count appropriate (50-80)

**Performance**:
- [ ] 60fps smooth animation (frame time <16ms)
- [ ] Bundle size increase acceptable (<10KB)
- [ ] No performance issues on mid-tier devices
- [ ] Works on all browsers (Chrome, Safari, Firefox, Edge)

**UX**:
- [ ] Adds delight without being overwhelming
- [ ] Users smile :)

---

## Risk Assessment

**Low Risk**:
- canvas-confetti battle-tested library
- Small bundle size impact

**Mitigation**:
- Lazy load to avoid blocking main bundle
- Test on low-end devices (throttle CPU 4x)
- Make animation opt-in if user complaints arise

---

## Security Considerations

**N/A** - Confetti animation has no security implications

---

## Next Steps

After completion:
1. Consider adding confetti to other success states (optional)
2. Proceed to [Phase 10: Homepage Polish](./phase-10-homepage-polish.md)
3. Apply design system to homepage sections

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 08 completion required
