# Phase 05: Gallery Filtering System

**Date**: Weeks 9-10 (2026-04-11 to 2026-04-24)
**Priority**: Critical (P0)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 04: Gallery Masonry Layout](./phase-04-gallery-masonry-layout.md)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md) - Nail shapes + styles filtering
- **Next Phase**: [phase-06-gallery-hover-effects.md](./phase-06-gallery-hover-effects.md)

---

## Key Insights

**Design Patterns Research**:
- Pill-style filters for few options (2-4 visible at once)
- Minimum tap target: 44×48px (iOS/Android guidelines)
- Active pill: solid background + highlight color
- Inactive pill: outline with hover effect
- Multi-dimensional filtering: Nail shapes + Styles simultaneously

**UX Patterns**:
- Horizontal scroll on mobile (thumb-friendly)
- Clear All CTA for reset
- Filtering feels instant (<100ms)

---

## Requirements

**Filter Categories** (from Blueprint):
1. **Nail Shapes**: Almond, Coffin, Square, Stiletto
2. **Nail Styles**: Vẽ 3D, Tráng Gương, Đính Đá, Ombre

**Interaction**:
- Pill-style buttons (rounded-full)
- Active state visually distinct (primary bg)
- Multi-select support (shape AND style)
- "Tất Cả" option to show all items
- "Xóa Bộ Lọc" to reset both filters

---

## Architecture

**Approach**: Extract FilterPills component, multi-dimensional filtering logic

**State Management**:
- `selectedShape`: string (current nail shape filter)
- `selectedStyle`: string (current style filter)
- `filteredGallery`: computed via useMemo (shape AND style match)

**Filter Logic**: AND operation (both filters must match)

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/GalleryPage.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/hooks/useGalleryPage.ts`

**Files to Create**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/gallery/FilterPills.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/data/filter-config.ts` (optional)

---

## Implementation Steps

1. **Define Filter Configurations**
   - Create filter constants in GalleryPage or separate config:
     ```typescript
     const NAIL_SHAPES = [
       { slug: 'all', label: 'Tất Cả' },
       { slug: 'almond', label: 'Almond' },
       { slug: 'coffin', label: 'Coffin' },
       { slug: 'square', label: 'Square' },
       { slug: 'stiletto', label: 'Stiletto' },
     ];

     const NAIL_STYLES = [
       { slug: 'all', label: 'Tất Cả' },
       { slug: '3d', label: 'Vẽ 3D' },
       { slug: 'mirror', label: 'Tráng Gương' },
       { slug: 'gem', label: 'Đính Đá' },
       { slug: 'ombre', label: 'Ombre' },
     ];
     ```

2. **Create FilterPills Component**
   - Create `apps/client/src/components/gallery/FilterPills.tsx`:
     ```tsx
     import { motion } from 'motion/react';
     import { cn } from '@repo/utils/cn';

     interface FilterPillsProps {
       filters: Array<{ slug: string; label: string }>;
       selected: string;
       onSelect: (slug: string) => void;
     }

     export function FilterPills({ filters, selected, onSelect }: FilterPillsProps) {
       return (
         <div className="flex flex-wrap gap-3 justify-center">
           {filters.map((filter) => (
             <motion.button
               key={filter.slug}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => onSelect(filter.slug)}
               className={cn(
                 "rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 shadow-soft-sm",
                 selected === filter.slug
                   ? "bg-primary text-primary-foreground shadow-soft-md"
                   : "bg-card border-2 border-border text-foreground hover:border-primary hover:shadow-soft-md"
               )}
             >
               {filter.label}
             </motion.button>
           ))}
         </div>
       );
     }
     ```

3. **Add Filter State to GalleryPage**
   - Update `apps/client/src/pages/GalleryPage.tsx`:
     ```tsx
     const [selectedShape, setSelectedShape] = useState('all');
     const [selectedStyle, setSelectedStyle] = useState('all');
     ```

4. **Implement Multi-Dimensional Filter Logic**
   - Add filtering logic with useMemo:
     ```tsx
     const filteredGallery = useMemo(() => {
       return gallery.filter(item => {
         const shapeMatch = selectedShape === 'all' || item.nailShape === selectedShape;
         const styleMatch = selectedStyle === 'all' || item.style === selectedStyle;
         return shapeMatch && styleMatch;
       });
     }, [gallery, selectedShape, selectedStyle]);
     ```

5. **Layout Filter Section**
   - Add filter UI above masonry gallery:
     ```tsx
     <div className="mb-12 space-y-6">
       {/* Nail Shapes */}
       <div>
         <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">
           Dáng Móng
         </h3>
         <FilterPills
           filters={NAIL_SHAPES}
           selected={selectedShape}
           onSelect={setSelectedShape}
         />
       </div>

       {/* Nail Styles */}
       <div>
         <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">
           Phong Cách
         </h3>
         <FilterPills
           filters={NAIL_STYLES}
           selected={selectedStyle}
           onSelect={setSelectedStyle}
         />
       </div>
     </div>
     ```

6. **Add Reset Filters Button**
   - Show when any filter active:
     ```tsx
     {(selectedShape !== 'all' || selectedStyle !== 'all') && (
       <div className="text-center mb-6">
         <button
           onClick={() => {
             setSelectedShape('all');
             setSelectedStyle('all');
           }}
           className="text-sm text-primary hover:underline font-medium"
         >
           Xóa Bộ Lọc
         </button>
       </div>
     )}
     ```

7. **Handle Empty State**
   - Show message when no items match filters:
     ```tsx
     {filteredGallery.length === 0 && (
       <div className="text-center py-12">
         <p className="text-muted-foreground">
           Không tìm thấy mẫu móng phù hợp. Thử bộ lọc khác?
         </p>
       </div>
     )}
     ```

8. **Test Filter Interactions**
   - Test single filter (shape only)
   - Test single filter (style only)
   - Test combined filters (shape AND style)
   - Test "Tất Cả" resets individual filter
   - Test "Xóa Bộ Lọc" resets both

9. **Test Mobile Responsiveness**
   - Pills wrap nicely on mobile
   - No horizontal scroll
   - Touch targets ≥44px
   - Filtering instant (<100ms)

---

## Todo List

- [ ] Define NAIL_SHAPES and NAIL_STYLES constants
- [ ] Create FilterPills component
- [ ] Add filter state (selectedShape, selectedStyle)
- [ ] Implement multi-dimensional filter logic with useMemo
- [ ] Add filter UI section above gallery
- [ ] Add "Xóa Bộ Lọc" reset button
- [ ] Handle empty state (no matching items)
- [ ] Test single filter (shape only)
- [ ] Test single filter (style only)
- [ ] Test combined filters (shape AND style)
- [ ] Test "Tất Cả" option resets filter
- [ ] Test "Xóa Bộ Lọc" resets both filters
- [ ] Verify pills wrap on mobile (no horizontal scroll)
- [ ] Verify touch targets ≥44×48px
- [ ] Test keyboard accessibility (Tab + Enter)
- [ ] Verify filtering feels instant (<100ms)

---

## Success Criteria

**Technical**:
- [ ] Filtering updates gallery in real-time (no page reload)
- [ ] Multi-dimensional filtering works correctly (AND logic)
- [ ] useMemo prevents unnecessary re-renders
- [ ] Keyboard accessible (Tab + Enter)

**Design**:
- [ ] Pills match spec (rounded-full, shadows)
- [ ] Active state visually distinct
- [ ] Pills wrap gracefully on mobile
- [ ] Empty state message clear

**UX**:
- [ ] Filtering feels instant (<100ms)
- [ ] Clear which filters active
- [ ] Easy to reset filters
- [ ] Mobile: no horizontal scroll, thumb-friendly

---

## Risk Assessment

**Low Risk**:
- Simple state management (useState + useMemo)
- No external dependencies

**Mitigation**:
- Test with large datasets (100+ gallery items)
- Verify performance with React DevTools Profiler

---

## Security Considerations

**N/A** - Client-side filtering has no security implications

---

## Next Steps

After completion:
1. Test filter persistence (optional: URL query params)
2. Proceed to [Phase 06: Gallery Hover Effects](./phase-06-gallery-hover-effects.md)
3. Combine filtering with hover effects for polished UX

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 04 completion required
