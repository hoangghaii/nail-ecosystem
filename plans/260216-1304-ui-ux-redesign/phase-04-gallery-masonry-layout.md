# Phase 04: Gallery Masonry Layout

**Date**: Weeks 7-8 (2026-03-28 to 2026-04-10)
**Priority**: Critical (P0)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 03: Animation Framework](./phase-03-animation-framework.md)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md), [researcher-02-technical-stack.md](./research/researcher-02-technical-stack.md)
- **Next Phase**: [phase-05-gallery-filtering-system.md](./phase-05-gallery-filtering-system.md)

---

## Key Insights

**Design Patterns Research**:
- Pinterest-style masonry layout industry standard for galleries
- 4 cols (desktop) → 3 cols (tablet) → 2 cols (mobile)
- 2-column mobile prevents horizontal scroll while showing visual density
- CSS Grid hybrid outperforms JavaScript libraries for Core Web Vitals

**Technical Stack Research**:
- react-masonry-css: CSS-driven, dependency-free, IE10+ compatible
- No height-based sorting (performance killer)
- Sequential distribution across columns
- Minimal computational overhead

---

## Requirements

**Layout Specs**:
- Desktop (>1024px): 3 columns, 20px gap
- Tablet (640-1024px): 2 columns, 16px gap
- Mobile (<640px): 2 columns, 12px gap (per blueprint spec)

**Image Handling**:
- Variable heights (natural aspect ratios)
- Lazy loading below fold
- Sharp images (no stretching/squashing)

**Performance**:
- Layout shift (CLS) <0.1
- Smooth filter transitions (no re-render flash)

---

## Architecture

**Approach**: Replace current grid with react-masonry-css

**Breakpoint Config**:
```javascript
{
  default: 3,  // >1024px
  1024: 2,     // 640-1024px
  640: 2       // <640px (mobile)
}
```

**CSS Strategy**: Flexbox-based columns, break-inside: avoid for items

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/GalleryCard.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/styles/index.css` (or gallery.css)
- `/Users/hainguyen/Documents/nail-project/apps/client/package.json`

**Dependencies**:
- react-masonry-css (to install)

---

## Implementation Steps

1. **Install react-masonry-css**
   - Run: `npm install react-masonry-css --workspace=client`
   - Verify in `apps/client/package.json`: `"react-masonry-css": "^1.0.16"`

2. **Import Masonry in GalleryPage**
   - Open `apps/client/src/pages/GalleryPage.tsx`
   - Add import: `import Masonry from 'react-masonry-css'`

3. **Configure Breakpoints**
   - Define breakpoint object in GalleryPage:
     ```typescript
     const breakpointColumns = {
       default: 3,  // >1024px
       1024: 2,     // 640-1024px
       640: 2       // <640px
     };
     ```

4. **Replace Grid with Masonry**
   - Find current gallery grid rendering
   - Replace with:
     ```tsx
     <Masonry
       breakpointCols={breakpointColumns}
       className="flex w-full gap-6"
       columnClassName="masonry-column space-y-6"
     >
       {filteredGallery.map((item, index) => (
         <GalleryCard key={item._id} item={item} index={index} />
       ))}
     </Masonry>
     ```

5. **Add Masonry CSS**
   - Open `apps/client/src/styles/index.css`
   - Add masonry styles:
     ```css
     .masonry-column {
       background-clip: padding-box;
     }

     .masonry-column > div {
       margin-bottom: 1.5rem;
     }

     .masonry-column > div:last-child {
       margin-bottom: 0;
     }

     /* Prevent item splitting */
     .masonry-column > * {
       break-inside: avoid;
     }
     ```

6. **Update GalleryCard for Variable Heights**
   - Open `apps/client/src/components/gallery/GalleryCard.tsx`
   - Remove fixed height from image wrapper
   - Let images maintain natural aspect ratio:
     ```tsx
     <div className="relative overflow-hidden rounded-[16px]">
       <img
         src={item.imageUrl}
         alt={item.title}
         className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
         loading="lazy"
       />
     </div>
     ```

7. **Handle Loading State**
   - Create masonry skeleton loader:
     ```tsx
     {isLoading && (
       <Masonry breakpointCols={breakpointColumns} className="flex w-full gap-6">
         {Array.from({ length: 12 }).map((_, i) => (
           <div key={i} className="animate-pulse bg-muted rounded-[16px] h-64" />
         ))}
       </Masonry>
     )}
     ```

8. **Test Responsive Breakpoints**
   - Open browser DevTools, toggle device toolbar
   - Test at 375px (mobile), 768px (tablet), 1440px (desktop)
   - Verify column counts match spec
   - Check gaps consistent at each breakpoint

9. **Verify Performance**
   - Run Lighthouse audit on GalleryPage
   - Check CLS <0.1 (no layout shift)
   - Verify lazy loading works (Network tab shows progressive image loads)

---

## Todo List

- [ ] Install react-masonry-css package
- [ ] Import Masonry in GalleryPage component
- [ ] Define breakpoint columns config
- [ ] Replace current grid with Masonry component
- [ ] Add masonry CSS styles to index.css
- [ ] Update GalleryCard to support variable heights
- [ ] Remove fixed heights from image containers
- [ ] Add lazy loading to images (loading="lazy")
- [ ] Create masonry skeleton loader
- [ ] Test at 375px mobile breakpoint (2 columns)
- [ ] Test at 768px tablet breakpoint (2 columns)
- [ ] Test at 1440px desktop breakpoint (3 columns)
- [ ] Verify gap spacing (12px mobile, 16px tablet, 20px desktop)
- [ ] Run Lighthouse audit (CLS <0.1)
- [ ] Test filter transitions (no flash on re-render)
- [ ] Verify no image stretching/squashing

---

## Success Criteria

**Technical**:
- [ ] Masonry renders correctly at all breakpoints
- [ ] No layout shift on load (CLS <0.1)
- [ ] Images lazy load below fold
- [ ] Filter transitions smooth (no re-render flash)

**Design**:
- [ ] Gallery feels like Pinterest/high-end portfolio
- [ ] Columns balanced (no one column significantly longer)
- [ ] Images sharp, aspect ratios preserved
- [ ] 2-column mobile readable on 375px screen

**Performance**:
- [ ] Lighthouse Performance: 95+ maintained
- [ ] No jank when filtering (60fps)
- [ ] Time to Interactive <3s

---

## Risk Assessment

**Low Risk**:
- react-masonry-css battle-tested, widely used
- CSS-driven (minimal JavaScript overhead)

**Mitigation**:
- Test on low-end devices (throttle CPU 4x)
- Verify accessibility (keyboard navigation preserved)

---

## Security Considerations

**N/A** - Layout library has no security implications

---

## Next Steps

After completion:
1. Verify masonry works with empty state (no items)
2. Proceed to [Phase 05: Gallery Filtering System](./phase-05-gallery-filtering-system.md)
3. Test filter transitions with new masonry layout

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 03 completion required
