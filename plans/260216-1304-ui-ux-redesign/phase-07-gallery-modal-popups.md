# Phase 07: Gallery Modal Popups

**Date**: Weeks 13-14 (2026-05-09 to 2026-05-22)
**Priority**: Critical (P0)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 06: Gallery Hover Effects](./phase-06-gallery-hover-effects.md)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md) - Modal with booking CTA
- **Next Phase**: [phase-08-booking-flow-enhancement.md](./phase-08-booking-flow-enhancement.md)

---

## Key Insights

**Design Patterns Research**:
- Modal layout: Image left (high-res) + Details right (metadata + CTA)
- Max width: 672px (max-w-2xl) for detail modals
- Max height: 90vh with scrollable content
- Backdrop: blur effect + semi-transparent overlay
- Animation: zoom + fade-in (200ms) for premium feel
- CTA: "Đặt Lịch Theo Mẫu Này" bottom-right, high contrast

**Accessibility**:
- Focus trap (keyboard users can't tab outside modal)
- ESC to close
- Click outside to close
- ARIA labels for screen readers

---

## Requirements

**Modal Structure**:
- **Left**: Enlarged image (aspect-square or aspect-auto)
- **Right**: Title, description, metadata (artist, polish, duration, price), CTA button
- **Close**: Top-right X button, ESC key, click outside

**Booking Integration**:
- "Đặt Lịch Theo Mẫu Này" button navigates to BookingPage
- Pass gallery item data via route state
- Pre-fill service category in booking form

**Metadata Fields** (optional):
- Artist name
- Polish type used
- Duration estimate
- Price estimate

---

## Architecture

**Approach**: Extend existing ImageLightbox or create GalleryDetailModal component

**Navigation**:
- Use React Router navigate with state:
  ```typescript
  navigate('/booking', {
    state: {
      fromGallery: true,
      galleryItem: item,
      service: matchedService,
    }
  });
  ```

**Component**: Radix UI Dialog (existing in shadcn/ui)

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/ImageLightbox.tsx` (existing)
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`

**Files to Create** (optional):
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/GalleryDetailModal.tsx`

**Shared Components**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/ui/dialog.tsx`

---

## Implementation Steps

1. **Extend ImageLightbox Component**
   - Check if `ImageLightbox.tsx` exists in gallery folder
   - If exists: enhance with detail view + CTA
   - If not: create new `GalleryDetailModal.tsx`

2. **Create Modal Layout**
   - Two-column grid (image left, details right):
     ```tsx
     <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-[24px]">
         <div className="grid md:grid-cols-2 gap-0">
           {/* Left: Image */}
           <div className="relative aspect-square md:aspect-auto bg-muted">
             <img
               src={item.imageUrl}
               alt={item.title}
               className="w-full h-full object-cover"
             />
           </div>

           {/* Right: Details */}
           <div className="p-8 md:p-12 flex flex-col">
             {/* Content sections */}
           </div>
         </div>
       </DialogContent>
     </Dialog>
     ```

3. **Add Title and Description**
   - Use DialogHeader for title:
     ```tsx
     <DialogHeader>
       <DialogTitle className="font-serif text-3xl mb-4">
         {item.title}
       </DialogTitle>
     </DialogHeader>

     <div className="flex-1 space-y-6">
       <p className="font-sans text-base text-muted-foreground leading-relaxed">
         {item.description}
       </p>
     </div>
     ```

4. **Add Metadata Section**
   - Metadata grid with optional fields:
     ```tsx
     <div className="space-y-3 border-t border-b border-border py-6">
       {item.artist && (
         <div className="flex justify-between">
           <span className="text-sm text-muted-foreground">Thợ</span>
           <span className="font-medium">{item.artist}</span>
         </div>
       )}
       {item.polish && (
         <div className="flex justify-between">
           <span className="text-sm text-muted-foreground">Sơn</span>
           <span className="font-medium">{item.polish}</span>
         </div>
       )}
       {item.duration && (
         <div className="flex justify-between">
           <span className="text-sm text-muted-foreground">Thời Gian</span>
           <span className="font-medium">{item.duration}</span>
         </div>
       )}
       {item.price && (
         <div className="flex justify-between">
           <span className="text-sm text-muted-foreground">Giá Dự Kiến</span>
           <span className="font-semibold text-primary text-xl">
             {formatCurrency(item.price)}
           </span>
         </div>
       )}
     </div>
     ```

5. **Add CTA Button**
   - Prominent booking button at bottom:
     ```tsx
     <Button
       size="lg"
       className="w-full rounded-[16px] shadow-soft-lg hover:shadow-glow mt-auto"
       onClick={() => onBookDesign(item)}
     >
       Đặt Lịch Theo Mẫu Này
     </Button>
     ```

6. **Implement Booking Navigation**
   - Add handler in GalleryPage.tsx:
     ```tsx
     const navigate = useNavigate();

     const handleBookDesign = (item: GalleryItem) => {
       // Find matching service by category
       const matchedService = services.find(s => s.category === item.category);

       navigate('/booking', {
         state: {
           fromGallery: true,
           galleryItem: item,
           service: matchedService,
         },
       });
     };
     ```

7. **Add Modal Animations**
   - Smooth entrance/exit with Motion:
     ```tsx
     <DialogContent asChild>
       <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.95 }}
         transition={{ duration: 0.2 }}
         className="max-w-6xl p-0 overflow-hidden rounded-[24px]"
       >
         {/* modal content */}
       </motion.div>
     </DialogContent>
     ```

8. **Handle Keyboard Navigation**
   - ESC to close: handled by Radix Dialog automatically
   - Focus trap: handled by Radix Dialog automatically
   - Add ARIA labels for accessibility

9. **Test Modal Interactions**
   - Click card → modal opens
   - ESC key → modal closes
   - Click outside → modal closes
   - Close button → modal closes
   - "Đặt Lịch" → navigates to booking with state

10. **Test Mobile Responsiveness**
    - Modal scrollable on small screens
    - Image stacks above details on mobile
    - CTA button remains visible (sticky bottom if needed)

---

## Todo List

- [ ] Check if ImageLightbox.tsx exists or create GalleryDetailModal.tsx
- [ ] Create two-column modal layout (image + details)
- [ ] Add DialogTitle with font-serif styling
- [ ] Add description section
- [ ] Add metadata section (artist, polish, duration, price)
- [ ] Handle missing metadata gracefully (conditional rendering)
- [ ] Add "Đặt Lịch Theo Mẫu Này" CTA button
- [ ] Implement handleBookDesign navigation handler
- [ ] Connect button to navigation with state
- [ ] Add Motion animations (zoom + fade)
- [ ] Test ESC key closes modal
- [ ] Test click outside closes modal
- [ ] Test close button closes modal
- [ ] Test CTA navigates to booking
- [ ] Verify focus trap works (can't tab outside)
- [ ] Test on mobile (modal scrollable, responsive)
- [ ] Add ARIA labels for accessibility
- [ ] Test with screen reader (VoiceOver/NVDA)

---

## Success Criteria

**Technical**:
- [ ] Modal opens in <100ms
- [ ] Focus trap works correctly
- [ ] Keyboard accessible (ESC, Tab navigation)
- [ ] ARIA labels correct for screen readers

**Design**:
- [ ] Modal centers on screen
- [ ] Image aspect ratio preserved
- [ ] Metadata displays correctly (handles missing fields)
- [ ] CTA button prominent and clickable

**UX**:
- [ ] Modal feels premium (smooth animations)
- [ ] Booking integration seamless
- [ ] Mobile: modal scrollable if content tall
- [ ] Accessibility: WCAG AA compliant

---

## Risk Assessment

**Low Risk**:
- Radix Dialog handles focus management
- Navigation state well-supported in React Router

**Mitigation**:
- Test navigation state persists correctly
- Verify modal doesn't break with missing data fields

---

## Security Considerations

**N/A** - Modal UI has no security implications

---

## Next Steps

After completion:
1. Test booking flow receives gallery data correctly
2. Proceed to [Phase 08: Booking Flow Enhancement](./phase-08-booking-flow-enhancement.md)
3. Pre-fill booking form with gallery item data

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 06 completion required
