# Phase 06: Gallery Hover Effects

**Date**: Weeks 11-12 (2026-04-25 to 2026-05-08)
**Priority**: High (P1)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 05: Gallery Filtering System](./phase-05-gallery-filtering-system.md)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md) - Zoom + overlay + quick actions
- **Next Phase**: [phase-07-gallery-modal-popups.md](./phase-07-gallery-modal-popups.md)

---

## Key Insights

**Design Patterns Research**:
- Image zoom: 1.05x - 1.1x subtle scale on hover
- Dusty rose overlay at 40% opacity (#D1948B)
- Quick action buttons appear on hover ("Xem Chi Tiết" + "Save")
- Transitions: 300-500ms for premium feel
- Performance: use will-change: transform for GPU hint

**Accessibility**:
- Touch devices: tap-to-reveal (no hover stuck states)
- prefers-reduced-motion: disable animations
- Focus states still visible

---

## Requirements

**Hover Effects**:
1. Image zoom 1.1x (scale transform)
2. Dusty rose overlay fade-in (opacity 0.4)
3. Quick action buttons appear:
   - "Xem Chi Tiết" button (primary)
   - "Save" icon button (heart icon)

**Performance**:
- 60fps smooth animations
- GPU-accelerated (transform + opacity only)
- No layout shift

---

## Architecture

**Approach**: Update GalleryCard component with Motion hover variants

**Animation Strategy**:
- Image: CSS transform scale (GPU-accelerated)
- Overlay: Motion whileHover opacity transition
- Buttons: Opacity 0 → 1 on hover

**Touch Handling**: Detect touch devices, disable hover or make tap-to-reveal

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/GalleryCard.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/styles/index.css` (optional for fallback)

---

## Implementation Steps

1. **Update GalleryCard Structure**
   - Open `apps/client/src/components/gallery/GalleryCard.tsx`
   - Wrap image in hover group container:
     ```tsx
     <div className="relative overflow-hidden rounded-[16px] cursor-pointer group">
       {/* Image with zoom */}
       <img
         src={item.imageUrl}
         alt={item.title}
         className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-110"
         loading="lazy"
       />

       {/* Dusty rose overlay */}
       <motion.div
         initial={{ opacity: 0 }}
         whileHover={{ opacity: 0.4 }}
         transition={{ duration: 0.3 }}
         className="absolute inset-0 bg-primary pointer-events-none"
       />

       {/* Quick action buttons */}
       <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <Button
           size="sm"
           variant="default"
           className="shadow-lg"
           onClick={(e) => {
             e.stopPropagation();
             onImageClick();
           }}
         >
           Xem Chi Tiết
         </Button>
         <Button
           size="icon"
           variant="outline"
           className="bg-white/90 backdrop-blur-sm"
           onClick={(e) => {
             e.stopPropagation();
             handleSaveDesign();
           }}
         >
           <Heart className="size-4" />
         </Button>
       </div>
     </div>
     ```

2. **Add Performance Optimization**
   - Add will-change hint for GPU acceleration:
     ```css
     /* apps/client/src/styles/index.css */
     .gallery-card:hover img {
       will-change: transform;
     }
     ```

3. **Handle Touch Devices**
   - Detect touch capability:
     ```tsx
     const isTouchDevice = 'ontouchstart' in window;
     ```
   - Conditional overlay rendering:
     ```tsx
     {!isTouchDevice && (
       <motion.div /* overlay */ />
     )}
     ```
   - For touch: open modal on tap (no hover effect)

4. **Implement Save Design Functionality** (optional)
   - Add to-do for Phase 07 or future
   - Placeholder handler for now:
     ```tsx
     const handleSaveDesign = () => {
       console.log('Save design:', item._id);
       // Future: Add to favorites, localStorage, or API
     };
     ```

5. **Test Hover Performance**
   - Open Chrome DevTools Performance tab
   - Record while hovering over multiple cards
   - Verify 60fps (frame time <16ms)
   - Check no layout recalculation (only transform + opacity)

6. **Test Accessibility**
   - Enable prefers-reduced-motion in OS settings
   - Verify animations disabled or reduced
   - Add CSS media query fallback:
     ```css
     @media (prefers-reduced-motion: reduce) {
       .gallery-card img {
         transition: none !important;
       }
     }
     ```

7. **Test on Mobile**
   - Verify no hover stuck states on mobile Safari/Chrome
   - Tap should open modal directly (implement in Phase 07)
   - No double-tap required

---

## Todo List

- [ ] Update GalleryCard with hover group container
- [ ] Add image zoom on hover (scale: 1.1, duration: 500ms)
- [ ] Add dusty rose overlay with Motion whileHover
- [ ] Add quick action buttons (Xem Chi Tiết + Save icon)
- [ ] Stop propagation on button clicks (prevent card click)
- [ ] Add will-change: transform CSS hint
- [ ] Detect touch devices (disable hover for touch)
- [ ] Implement handleSaveDesign placeholder
- [ ] Test hover performance in Chrome DevTools (60fps)
- [ ] Verify no layout shift during hover
- [ ] Test prefers-reduced-motion accessibility
- [ ] Add CSS fallback for reduced motion
- [ ] Test on mobile Safari (no hover stuck states)
- [ ] Test on Android Chrome (tap behavior)
- [ ] Verify overlay color matches brand (#D1948B at 40% opacity)

---

## Success Criteria

**Technical**:
- [ ] Hover effects 60fps smooth
- [ ] GPU-accelerated (transform + opacity only)
- [ ] No layout shift (CLS <0.1)
- [ ] prefers-reduced-motion respected

**Design**:
- [ ] Image zoom subtle (1.1x, not excessive)
- [ ] Overlay color matches brand (#D1948B)
- [ ] Buttons appear smoothly (300ms fade-in)
- [ ] Focus states still visible for accessibility

**Performance**:
- [ ] No jank on hover (check Performance tab)
- [ ] Works smoothly on mid-tier devices
- [ ] Touch: no hover stuck states

---

## Risk Assessment

**Low Risk**:
- CSS transforms well-supported
- Motion library handles cross-browser differences

**Mitigation**:
- Test on Safari (webkit-specific prefixes may be needed)
- Fallback to CSS-only hover if Motion issues arise

---

## Security Considerations

**N/A** - Hover effects have no security implications

---

## Next Steps

After completion:
1. Test hover + filter interaction (smooth re-layout)
2. Proceed to [Phase 07: Gallery Modal Popups](./phase-07-gallery-modal-popups.md)
3. Connect "Xem Chi Tiết" to modal opening

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 05 completion required
