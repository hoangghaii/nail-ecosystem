# Pink Nail Salon Client UI/UX Redesign - Implementation Plan

**Project**: Pink Nail Art Studio Client Website Redesign
**Approach**: Foundation First - 6 Month Sprint (12 Phases × 2 Weeks)
**Blueprint**: `/requirements/UI-upgrade.md`
**Target**: `apps/client/`
**Created**: 2026-02-16
**Status**: Ready for Implementation

---

## Executive Summary

### Project Overview

Transform Pink Nail Salon client website from a basic service site into a high-end nail art studio digital experience. Core focus: visual polish, masonry gallery with filtering, booking flow enhancement, and premium brand aesthetic.

### Timeline

- **Duration**: 6 months (24 weeks)
- **Structure**: 12 phases × 2-week sprints
- **Methodology**: Iterative, foundation-first approach
- **Deployment**: Progressive rollout with feature flags

### Key Objectives

1. **Brand Elevation**: Transition from utilitarian to premium nail art studio aesthetic
2. **Gallery Enhancement**: Masonry layout + advanced filtering + modal popups with booking integration
3. **Booking Polish**: Smooth 2-3 step flow with confetti celebration
4. **Performance**: Maintain/improve Lighthouse scores (95+ target)
5. **Mobile-First**: Touch-friendly, 2-column responsive gallery

### Success Metrics

- Gallery engagement: 40% increase in modal opens
- Booking conversion: 25% increase from gallery "Book this design" CTA
- Page load time: <2s on 4G
- Lighthouse Performance: 95+
- Mobile usability: 100/100
- Zero accessibility regressions

---

## Phase Breakdown

### Phase 1: Design Foundation (Weeks 1-2)

**Objective**: Establish new design system - colors, typography, tokens

#### Files to Modify

```
apps/client/src/styles/design-tokens.ts
apps/client/index.html
apps/client/src/App.css (or index.css)
packages/tailwind-config/client-theme.js
```

#### Technical Tasks

1. **Color Palette Migration**
   - Update `design-tokens.ts` colors object:
     ```typescript
     export const colors = {
       // Primary - Dusty Rose
       primary: {
         DEFAULT: "oklch(0.64 0.06 12)", // #D1948B
         foreground: "oklch(0.99 0 0)", // #FAFAFA
       },

       // Background - Cream/Nude
       background: "oklch(0.98 0.01 45)", // #FDF8F5

       // Text - Charcoal
       foreground: "oklch(0.22 0 0)", // #333333

       // Accent - Soft Charcoal (muted text)
       muted: {
         DEFAULT: "oklch(0.96 0.01 45)", // Lighter cream
         foreground: "oklch(0.45 0 0)", // #5A5A5A
       },

       // Secondary - for cards/highlights
       secondary: {
         DEFAULT: "oklch(0.97 0.01 45)", // Very light cream
         foreground: "oklch(0.22 0 0)", // Charcoal
       },

       // Border - subtle borders
       border: "oklch(0.92 0.01 45)", // #EAEAEA

       // Card background
       card: "oklch(1 0 0)", // Pure white for cards
     } as const;
     ```

2. **Typography Integration**
   - Add Google Fonts to `index.html` `<head>`:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap" rel="stylesheet">
     ```

   - Update CSS variables in `App.css`:
     ```css
     :root {
       --font-serif: 'Playfair Display', serif;
       --font-sans: 'Be Vietnam Pro', sans-serif;
     }
     ```

   - Update Tailwind config font families:
     ```javascript
     // packages/tailwind-config/client-theme.js
     module.exports = {
       theme: {
         extend: {
           fontFamily: {
             serif: ['Playfair Display', 'serif'],
             sans: ['Be Vietnam Pro', 'sans-serif'],
           },
         },
       },
     };
     ```

3. **Border Radius System**
   - Update `design-tokens.ts`:
     ```typescript
     export const borderRadius = {
       sm: "8px",    // Small elements (badges)
       md: "12px",   // Buttons, inputs
       lg: "16px",   // Cards
       xl: "20px",   // Large cards
       "2xl": "24px" // Hero sections
     } as const;
     ```

4. **Shadow System** (new)
   - Add to Tailwind config:
     ```javascript
     boxShadow: {
       'soft-sm': '0 2px 8px rgba(209, 148, 139, 0.08)',
       'soft-md': '0 4px 16px rgba(209, 148, 139, 0.1)',
       'soft-lg': '0 10px 30px rgba(209, 148, 139, 0.12)',
       'glow': '0 0 20px rgba(209, 148, 139, 0.3)',
     }
     ```

#### Deliverables

- [ ] Updated `design-tokens.ts` with new OKLCH color values
- [ ] Google Fonts loaded in `index.html`
- [ ] CSS variables for font families
- [ ] Tailwind config extended with fonts, shadows, radii
- [ ] Visual regression test baseline captured

#### QA Checklist

- [ ] All color references use new design tokens
- [ ] Fonts load correctly (check Network tab, no FOIT/FOUT)
- [ ] Typography renders correctly across browsers
- [ ] No hardcoded color values remaining
- [ ] Lighthouse Performance score maintained

#### Success Criteria

- All pages render with new color palette
- Typography loads in <200ms
- Zero console errors
- Design tokens exported correctly for reuse

---

### Phase 2: Component Foundation (Weeks 3-4)

**Objective**: Update base UI components (Button, Input, Card) with new design system

#### Files to Modify

```
apps/client/src/components/ui/button.tsx
apps/client/src/components/ui/input.tsx
apps/client/src/components/ui/card.tsx
apps/client/src/components/ui/badge.tsx
apps/client/src/components/ui/separator.tsx
```

#### Technical Tasks

1. **Button Component**
   - Update `buttonVariants` in `button.tsx`:
     ```typescript
     const buttonVariants = cva(
       "inline-flex items-center justify-center gap-2 font-sans font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-[16px] shadow-soft-sm hover:shadow-soft-md",
       {
         variants: {
           variant: {
             default: "bg-primary text-primary-foreground hover:bg-primary/90",
             outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/5",
             ghost: "hover:bg-muted hover:text-foreground",
             // Add 'pill' variant for Contact page CTA
             pill: "rounded-full bg-primary text-primary-foreground hover:shadow-glow",
           },
           size: {
             default: "h-12 px-6 py-3 text-base",
             sm: "h-10 px-4 py-2 text-sm",
             lg: "h-14 px-8 py-4 text-lg",
             icon: "h-12 w-12",
           },
         },
       }
     );
     ```

2. **Input Component**
   - Update base styles:
     ```typescript
     className={cn(
       "flex h-12 w-full rounded-[12px] border-2 border-border bg-background/50 px-4 py-3 text-base font-sans",
       "transition-all duration-200",
       "focus-visible:outline-none focus-visible:border-primary focus-visible:bg-background focus-visible:shadow-soft-sm",
       "placeholder:text-muted-foreground",
       "disabled:cursor-not-allowed disabled:opacity-50",
       className
     )}
     ```

3. **Card Component**
   - Update to shadow-based design:
     ```typescript
     const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
       ({ className, ...props }, ref) => (
         <div
           ref={ref}
           className={cn(
             "rounded-[20px] bg-card shadow-soft-md transition-shadow duration-200 hover:shadow-soft-lg",
             className
           )}
           {...props}
         />
       )
     );
     ```

4. **Badge Component**
   - Update for filter pills (Gallery page):
     ```typescript
     const badgeVariants = cva(
       "inline-flex items-center rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200",
       {
         variants: {
           variant: {
             default: "border-transparent bg-primary text-primary-foreground",
             outline: "border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
             // Active filter state
             active: "border-primary bg-primary/10 text-primary shadow-soft-sm",
           },
         },
       }
     );
     ```

#### Deliverables

- [ ] Updated Button with rounded corners, shadows, pill variant
- [ ] Updated Input with soft focus states
- [ ] Updated Card with shadow-based elevation
- [ ] Updated Badge for filter pills
- [ ] Component Storybook/demo page (optional)

#### QA Checklist

- [ ] All button variants render correctly
- [ ] Input focus states smooth (no jarring transitions)
- [ ] Card hover effects work on desktop
- [ ] Badge pills keyboard accessible
- [ ] Touch targets ≥44×44px on mobile
- [ ] No visual regressions on existing pages

#### Success Criteria

- Components match design specs (16-20px border radius)
- Shadows render correctly across browsers
- Hover/focus states accessible (keyboard + screen reader)
- Zero TypeScript errors

---

### Phase 3: Typography & Spacing Rollout (Weeks 5-6)

**Objective**: Apply new typography scale and spacing system across all pages

#### Files to Modify

```
apps/client/src/pages/HomePage.tsx
apps/client/src/pages/ServicesPage.tsx
apps/client/src/pages/GalleryPage.tsx
apps/client/src/pages/ContactPage.tsx
apps/client/src/pages/BookingPage.tsx
apps/client/src/components/layout/Header.tsx
apps/client/src/components/layout/Footer.tsx
apps/client/src/styles/design-tokens.ts
```

#### Technical Tasks

1. **Update Typography Scale**
   - Extend `design-tokens.ts`:
     ```typescript
     export const typography = {
       // Hero titles (Playfair Display)
       h1: "font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight",
       h2: "font-serif text-4xl md:text-5xl font-semibold text-foreground leading-snug",
       h3: "font-serif text-3xl md:text-4xl font-semibold text-foreground",
       h4: "font-serif text-2xl md:text-3xl font-medium text-foreground",

       // Body text (Be Vietnam Pro)
       body: "font-sans text-base md:text-lg text-foreground leading-relaxed",
       bodySmall: "font-sans text-sm md:text-base text-muted-foreground leading-relaxed",

       // UI elements
       button: "font-sans text-base font-semibold",
       caption: "font-sans text-xs text-muted-foreground",
     } as const;
     ```

2. **Spacing System**
   - Update `design-tokens.ts`:
     ```typescript
     export const spacing = {
       section: "6rem md:8rem", // 96px-128px between sections
       card: "1.5rem md:2rem",   // 24px-32px card padding
       container: "1rem md:1.5rem", // 16px-24px container padding
     } as const;
     ```

3. **Page-by-Page Updates**
   - **HomePage**:
     - Hero title: Apply `typography.h1`
     - Section headers: Apply `typography.h2`
     - Body text: Apply `typography.body`
     - Add `spacing.section` between major sections

   - **GalleryPage**:
     - Page title: `typography.h2`
     - Card titles: `typography.h4`
     - Descriptions: `typography.bodySmall`

   - **BookingPage**:
     - Step titles: `typography.h3`
     - Form labels: `font-sans text-sm font-medium`

   - **ServicesPage**:
     - Service names: `typography.h4`
     - Prices: `font-sans text-2xl font-bold text-primary`

   - **ContactPage**:
     - Page title: `typography.h2`
     - Form fields: Updated Input component handles this

4. **Header & Footer**
   - Navigation links: `font-sans text-base font-medium hover:text-primary transition-colors`
   - Logo text: `font-serif text-2xl font-bold`

#### Deliverables

- [ ] Typography scale defined in design tokens
- [ ] All headings use Playfair Display
- [ ] All body text uses Be Vietnam Pro
- [ ] Consistent spacing between sections (100px+ on desktop)
- [ ] Mobile responsive typography (smaller scales)

#### QA Checklist

- [ ] Font weights load correctly (400, 500, 600, 700)
- [ ] Line heights readable (1.5-1.7 for body text)
- [ ] Headings hierarchically correct (h1 > h2 > h3)
- [ ] Spacing feels "premium" (not cramped)
- [ ] Mobile typography scales down gracefully
- [ ] Accessibility: font sizes ≥16px for body text

#### Success Criteria

- Visual hierarchy clear and elegant
- Typography enhances brand perception (high-fashion feel)
- No horizontal scroll on mobile
- WCAG AA contrast ratios maintained

---

### Phase 4: Gallery - Masonry Layout (Weeks 7-8)

**Objective**: Implement Pinterest-style masonry layout for Gallery page

#### Dependencies

Install new package:
```bash
npm install react-masonry-css --workspace=client
```

#### Files to Modify

```
apps/client/src/pages/GalleryPage.tsx
apps/client/src/components/gallery/GalleryCard.tsx
apps/client/src/hooks/useGalleryPage.ts (if needed)
apps/client/package.json
```

#### Technical Tasks

1. **Install & Configure Masonry**
   - Add to `package.json`:
     ```json
     "dependencies": {
       "react-masonry-css": "^1.0.16"
     }
     ```

   - Import in `GalleryPage.tsx`:
     ```typescript
     import Masonry from 'react-masonry-css';
     ```

2. **Update GalleryPage Layout**
   - Replace current grid with masonry:
     ```typescript
     const breakpointColumns = {
       default: 3, // 3 columns on desktop
       1024: 2,    // 2 columns on tablet
       640: 2,     // 2 columns on mobile (per spec)
     };

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

3. **Add Masonry Styles**
   - Create `gallery.css` or add to `App.css`:
     ```css
     .masonry-column {
       background-clip: padding-box;
     }

     /* Prevent orphan items */
     .masonry-column > div {
       margin-bottom: 1.5rem;
     }

     .masonry-column > div:last-child {
       margin-bottom: 0;
     }
     ```

4. **Update GalleryCard for Variable Heights**
   - Remove fixed height from image wrapper
   - Let images maintain aspect ratio:
     ```typescript
     <div className="relative overflow-hidden rounded-[16px]">
       <LazyImage
         src={item.imageUrl}
         alt={item.title}
         className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
       />
     </div>
     ```

5. **Handle Loading State**
   - Masonry skeleton:
     ```typescript
     {isLoading && (
       <Masonry breakpointCols={breakpointColumns} className="flex w-full gap-6">
         {Array.from({ length: 12 }).map((_, i) => (
           <GalleryItemSkeleton key={i} variant="masonry" />
         ))}
       </Masonry>
     )}
     ```

#### Deliverables

- [ ] Masonry layout rendering correctly
- [ ] 3 columns on desktop, 2 on mobile
- [ ] Images maintain aspect ratio
- [ ] No layout shift on load
- [ ] Smooth animations on filter change

#### QA Checklist

- [ ] Masonry columns balanced (no one column significantly longer)
- [ ] Images sharp (no stretching/squashing)
- [ ] Responsive at all breakpoints
- [ ] Lazy loading works with masonry
- [ ] Performance: no jank when filtering
- [ ] Accessibility: keyboard navigation preserved

#### Success Criteria

- Gallery feels like Pinterest/high-end portfolio
- Layout shift (CLS) <0.1
- Filter transitions smooth (no re-render flash)
- Mobile usable (2-column readable on 375px screen)

---

### Phase 5: Gallery - Filter Pills (Weeks 9-10)

**Objective**: Replace current filter buttons with rounded pill filters for nail shapes + styles

#### Files to Modify

```
apps/client/src/pages/GalleryPage.tsx
apps/client/src/hooks/useGalleryPage.ts
apps/client/src/components/gallery/FilterPills.tsx (new)
apps/client/src/components/ui/badge.tsx (use existing)
```

#### Technical Tasks

1. **Define Filter Categories**
   - Update `useGalleryPage.ts` or create filter config:
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
   - New file: `FilterPills.tsx`:
     ```typescript
     export function FilterPills({
       filters,
       selected,
       onSelect
     }: FilterPillsProps) {
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

3. **Integrate Multi-Dimensional Filtering**
   - Update `GalleryPage.tsx`:
     ```typescript
     const [selectedShape, setSelectedShape] = useState('all');
     const [selectedStyle, setSelectedStyle] = useState('all');

     // Filter logic
     const filteredGallery = useMemo(() => {
       return gallery.filter(item => {
         const shapeMatch = selectedShape === 'all' || item.nailShape === selectedShape;
         const styleMatch = selectedStyle === 'all' || item.style === selectedStyle;
         return shapeMatch && styleMatch;
       });
     }, [gallery, selectedShape, selectedStyle]);
     ```

4. **Layout Filter Section**
   - Stacked filter groups:
     ```tsx
     <div className="mb-12 space-y-6">
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

5. **Add Reset Filters Button**
   - If both filters active:
     ```tsx
     {(selectedShape !== 'all' || selectedStyle !== 'all') && (
       <button
         onClick={() => {
           setSelectedShape('all');
           setSelectedStyle('all');
         }}
         className="text-sm text-primary hover:underline"
       >
         Xóa Bộ Lọc
       </button>
     )}
     ```

#### Deliverables

- [ ] Filter pills render as rounded pills (not rectangles)
- [ ] Two filter rows: Nail Shapes + Styles
- [ ] Active filter highlighted with primary color
- [ ] Multi-dimensional filtering works correctly
- [ ] Reset filters button

#### QA Checklist

- [ ] Filters update gallery in real-time (no page reload)
- [ ] "Tất Cả" resets filter to show all items
- [ ] Multiple filters combine correctly (AND logic)
- [ ] Pills keyboard accessible (Tab + Enter)
- [ ] Mobile: pills wrap nicely, no horizontal scroll
- [ ] Active state visually distinct

#### Success Criteria

- Filtering feels instant (<100ms)
- Pills match design spec (rounded-full, shadows)
- UX intuitive (clear which filters active)
- No empty state if no matches (show message)

---

### Phase 6: Gallery - Hover Effects (Weeks 11-12)

**Objective**: Add zoom + overlay hover effects to gallery cards

#### Files to Modify

```
apps/client/src/components/gallery/GalleryCard.tsx
apps/client/src/App.css (or gallery.css)
```

#### Technical Tasks

1. **Update GalleryCard Hover**
   - Add overlay with motion animation:
     ```typescript
     <div className="relative overflow-hidden rounded-[16px] cursor-pointer group">
       {/* Image with zoom */}
       <LazyImage
         src={item.imageUrl}
         alt={item.title}
         className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-110"
       />

       {/* Dusty rose overlay on hover */}
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
           onClick={onImageClick}
         >
           Xem Chi Tiết
         </Button>
         <Button
           size="icon-sm"
           variant="outline"
           className="bg-white/90 backdrop-blur-sm"
           onClick={handleSaveDesign}
         >
           <Heart className="size-4" />
         </Button>
       </div>
     </div>
     ```

2. **CSS Fallback for Non-Motion Browsers**
   - Add to `App.css`:
     ```css
     @media (prefers-reduced-motion: reduce) {
       .gallery-card img {
         transform: none !important;
       }
     }
     ```

3. **Performance Optimization**
   - Use `will-change` for smooth animations:
     ```css
     .gallery-card:hover img {
       will-change: transform;
     }
     ```

4. **Touch Device Handling**
   - Disable hover on touch (or make tap-to-reveal):
     ```typescript
     const isTouchDevice = 'ontouchstart' in window;

     {!isTouchDevice && (
       <motion.div /* overlay */ />
     )}
     ```

#### Deliverables

- [ ] Image zooms 1.1x on hover
- [ ] Dusty rose overlay (#D1948B) at 40% opacity
- [ ] "Xem Chi Tiết" + "Save" buttons appear
- [ ] Smooth transitions (300-500ms)
- [ ] Touch devices: tap to open modal (no hover)

#### QA Checklist

- [ ] Hover effects smooth (60fps)
- [ ] No layout shift when hovering
- [ ] Overlay color matches brand (#D1948B)
- [ ] Buttons clickable during hover
- [ ] Mobile: no hover stuck states
- [ ] Reduced motion: animations disabled

#### Success Criteria

- Hover feels premium and polished
- No performance issues (check Chrome DevTools Performance)
- Accessibility: focus states still visible
- Works on Chrome, Safari, Firefox, Edge

---

### Phase 7: Gallery - Modal Popup (Weeks 13-14)

**Objective**: Create modal popup with enlarged image + "Book this design" CTA

#### Files to Modify

```
apps/client/src/components/gallery/ImageLightbox.tsx (existing)
apps/client/src/components/gallery/GalleryDetailModal.tsx (new)
apps/client/src/pages/GalleryPage.tsx
apps/client/src/components/ui/dialog.tsx (use existing)
```

#### Technical Tasks

1. **Extend ImageLightbox Component**
   - Current lightbox already exists, enhance it:
     ```typescript
     export function ImageLightbox({ item, onClose, onBookDesign }: Props) {
       return (
         <Dialog open={isOpen} onOpenChange={onClose}>
           <DialogContent className="max-w-6xl p-0 overflow-hidden rounded-[24px]">
             <div className="grid md:grid-cols-2 gap-0">
               {/* Left: Enlarged Image */}
               <div className="relative aspect-square md:aspect-auto">
                 <img
                   src={item.imageUrl}
                   alt={item.title}
                   className="w-full h-full object-cover"
                 />
               </div>

               {/* Right: Details */}
               <div className="p-8 md:p-12 flex flex-col">
                 <DialogHeader>
                   <DialogTitle className="font-serif text-3xl mb-4">
                     {item.title}
                   </DialogTitle>
                 </DialogHeader>

                 <div className="flex-1 space-y-6">
                   {/* Description */}
                   <p className="font-sans text-base text-muted-foreground leading-relaxed">
                     {item.description}
                   </p>

                   {/* Metadata */}
                   <div className="space-y-3 border-t border-b border-border py-6">
                     {item.artist && (
                       <div className="flex justify-between">
                         <span className="text-sm text-muted-foreground">Thợ</span>
                         <span className="font-medium">{item.artist}</span>
                       </div>
                     )}
                     {item.polish && (
                       <div className="flex justify-between">
                         <span className="text-sm text-muted-foreground">Sơn Sử Dụng</span>
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
                           {item.price}
                         </span>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* CTA Button */}
                 <Button
                   size="lg"
                   className="w-full rounded-[16px] shadow-soft-lg hover:shadow-glow mt-auto"
                   onClick={() => onBookDesign(item)}
                 >
                   Đặt Lịch Theo Mẫu Này
                 </Button>
               </div>
             </div>
           </DialogContent>
         </Dialog>
       );
     }
     ```

2. **Connect to Booking Flow**
   - Update `GalleryPage.tsx`:
     ```typescript
     const handleBookDesign = (item: GalleryItem) => {
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

3. **Modal Animations**
   - Smooth entrance/exit:
     ```typescript
     <DialogContent
       className="..."
       asChild
     >
       <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.95 }}
         transition={{ duration: 0.2 }}
       >
         {/* modal content */}
       </motion.div>
     </DialogContent>
     ```

4. **Keyboard Navigation**
   - ESC to close: handled by Radix Dialog
   - Left/Right arrows to navigate: integrate with existing lightbox navigation

#### Deliverables

- [ ] Modal opens on card click
- [ ] Left side: full-size image
- [ ] Right side: title, description, metadata, price, CTA
- [ ] "Book this design" navigates to booking with pre-filled service
- [ ] Modal dismissible (ESC, click outside, close button)

#### QA Checklist

- [ ] Modal centers on screen
- [ ] Image aspect ratio preserved
- [ ] Metadata displays correctly (handle missing fields gracefully)
- [ ] CTA button prominent and clickable
- [ ] Mobile: modal scrollable if content tall
- [ ] Focus trap works (keyboard users can't tab outside modal)
- [ ] Accessibility: ARIA labels correct

#### Success Criteria

- Modal feels premium (smooth animations, polished layout)
- Booking integration seamless (no confusion)
- Accessibility: WCAG AA compliant
- Performance: modal opens in <100ms

---

### Phase 8: Booking - 3-Step Flow (Optional) (Weeks 15-16)

**Objective**: Expand booking from 2 steps to 3 steps for better UX (optional enhancement)

#### Files to Modify

```
apps/client/src/pages/BookingPage.tsx
apps/client/src/hooks/useBookingPage.ts
apps/client/src/components/booking/BookingSteps.tsx (extract from BookingPage)
```

#### Technical Tasks

**Note**: Current booking is 2 steps (Date/Time + Customer Info). Blueprint suggests *optionally* expanding to 3 steps. Recommended structure:

1. **Step 1: Choose Concept** (new)
   - Nail shape selection (visual cards with images)
   - Art complexity level (Simple / Complex / Masterpiece)

2. **Step 2: Artist & Time** (existing Step 1 expanded)
   - Artist selection (avatars + ratings)
   - Date picker (existing)
   - Time slots (existing, with disabled/available states)

3. **Step 3: Customer Info** (existing Step 2)
   - Name, email, phone (existing)

**Implementation**:

```typescript
const steps = [
  { id: 1, title: "Chọn Concept", icon: Palette },
  { id: 2, title: "Chọn Thời Gian", icon: Calendar },
  { id: 3, title: "Thông Tin", icon: User },
];

// Step 1: Concept Selection
{currentStep === 1 && (
  <div className="space-y-6">
    <h3 className="font-serif text-2xl font-semibold">
      Chọn Dáng Móng & Mức Độ Nghệ Thuật
    </h3>

    {/* Nail Shape Cards */}
    <div>
      <FormLabel>Dáng Móng</FormLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        {nailShapes.map(shape => (
          <button
            key={shape.id}
            onClick={() => form.setValue('nailShape', shape.id)}
            className={cn(
              "p-4 rounded-[16px] border-2 transition-all",
              form.watch('nailShape') === shape.id
                ? "border-primary bg-primary/5 shadow-soft-md"
                : "border-border hover:border-primary/50"
            )}
          >
            <img src={shape.image} alt={shape.name} className="w-full aspect-square object-cover rounded-[12px] mb-2" />
            <p className="font-sans text-sm font-medium">{shape.name}</p>
          </button>
        ))}
      </div>
    </div>

    {/* Art Complexity */}
    <div>
      <FormLabel>Mức Độ Nghệ Thuật</FormLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {artLevels.map(level => (
          <button
            key={level.id}
            onClick={() => form.setValue('artComplexity', level.id)}
            className={cn(
              "p-6 rounded-[16px] border-2 text-left transition-all",
              form.watch('artComplexity') === level.id
                ? "border-primary bg-primary/5 shadow-soft-md"
                : "border-border hover:border-primary/50"
            )}
          >
            <img src={level.image} alt={level.name} className="w-full aspect-[4/3] object-cover rounded-[12px] mb-3" />
            <h4 className="font-serif text-lg font-semibold mb-1">{level.name}</h4>
            <p className="text-sm text-muted-foreground">{level.description}</p>
            <p className="text-primary font-bold mt-2">{level.priceRange}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
)}
```

**Decision Point**: Implement this phase only if user requests enhanced booking flow. Current 2-step flow is functional. This is a "polish" enhancement.

#### Deliverables (If Implemented)

- [ ] Step 1: Visual nail shape + art complexity selectors
- [ ] Step 2: Artist avatars with ratings + time picker
- [ ] Step 3: Customer info form (existing)
- [ ] Progress indicator updated to 3 steps
- [ ] Validation at each step before proceeding

#### QA Checklist (If Implemented)

- [ ] Visual selectors clear and clickable
- [ ] Artist avatars load correctly
- [ ] Disabled time slots visually distinct
- [ ] Can't proceed without selecting all required fields
- [ ] Mobile: selectors thumb-friendly
- [ ] Back button works correctly

#### Success Criteria (If Implemented)

- Booking flow feels guided (not overwhelming)
- Visual selections more engaging than dropdowns
- Artist selection personalized
- Conversion rate maintained or improved

**Recommendation**: Skip this phase for MVP. Implement in future iteration based on user feedback.

---

### Phase 9: Booking - Confetti Animation (Weeks 17-18)

**Objective**: Add celebratory confetti animation to booking confirmation

#### Dependencies

Install new package:
```bash
npm install canvas-confetti --workspace=client
npm install --save-dev @types/canvas-confetti --workspace=client
```

#### Files to Modify

```
apps/client/src/components/booking/BookingConfirmation.tsx
apps/client/package.json
apps/client/src/utils/confetti.ts (new helper)
```

#### Technical Tasks

1. **Install Package**
   - Add to `package.json`:
     ```json
     "dependencies": {
       "canvas-confetti": "^1.9.3"
     },
     "devDependencies": {
       "@types/canvas-confetti": "^1.6.4"
     }
     ```

2. **Create Confetti Utility**
   - New file: `utils/confetti.ts`:
     ```typescript
     import confetti from 'canvas-confetti';

     export function celebrateBooking() {
       const duration = 3000;
       const animationEnd = Date.now() + duration;
       const defaults = {
         startVelocity: 30,
         spread: 360,
         ticks: 60,
         zIndex: 9999,
         colors: ['#D1948B', '#FDF8F5', '#333333'] // Brand colors
       };

       function randomInRange(min: number, max: number) {
         return Math.random() * (max - min) + min;
       }

       const interval: NodeJS.Timeout = setInterval(function() {
         const timeLeft = animationEnd - Date.now();

         if (timeLeft <= 0) {
           return clearInterval(interval);
         }

         const particleCount = 50 * (timeLeft / duration);

         // Fire from left
         confetti({
           ...defaults,
           particleCount,
           origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
         });

         // Fire from right
         confetti({
           ...defaults,
           particleCount,
           origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
         });
       }, 250);
     }
     ```

3. **Integrate into BookingConfirmation**
   - Update `BookingConfirmation.tsx`:
     ```typescript
     import { useEffect } from 'react';
     import { celebrateBooking } from '@/utils/confetti';

     export function BookingConfirmation({ booking, onClose }: Props) {
       useEffect(() => {
         // Trigger confetti on mount
         celebrateBooking();
       }, []);

       return (
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.3 }}
           className="..."
         >
           {/* Existing confirmation content */}
         </motion.div>
       );
     }
     ```

4. **Performance Consideration**
   - Lazy load confetti library:
     ```typescript
     const celebrateBooking = async () => {
       const confetti = (await import('canvas-confetti')).default;
       // ... confetti logic
     };
     ```

5. **Accessibility**
   - Respect `prefers-reduced-motion`:
     ```typescript
     useEffect(() => {
       const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

       if (!prefersReducedMotion) {
         celebrateBooking();
       }
     }, []);
     ```

#### Deliverables

- [ ] Confetti fires on booking confirmation render
- [ ] Confetti uses brand colors (#D1948B)
- [ ] Animation duration: 3 seconds
- [ ] Confetti originates from both sides
- [ ] Respects prefers-reduced-motion

#### QA Checklist

- [ ] Confetti renders above all content (z-index: 9999)
- [ ] Animation smooth (no jank)
- [ ] Confetti clears after animation ends
- [ ] No console errors
- [ ] Mobile: confetti visible and performant
- [ ] Accessibility: skipped if user prefers reduced motion

#### Success Criteria

- Confetti adds delight without being overwhelming
- Performance impact minimal (<50ms frame time)
- Works on all browsers (Chrome, Safari, Firefox, Edge)
- Users smile :)

---

### Phase 10: HomePage Enhancements (Weeks 19-20)

**Objective**: Apply new design system to HomePage - hero section, lookbook highlight, about section

#### Files to Modify

```
apps/client/src/pages/HomePage.tsx
apps/client/src/components/home/HeroSection.tsx
apps/client/src/components/home/LookbookHighlight.tsx (new)
apps/client/src/components/home/AboutSection.tsx
apps/client/src/components/home/ServiceHighlight.tsx
```

#### Technical Tasks

1. **Hero Section Redesign**
   - Update typography to Playfair Display:
     ```tsx
     <div className="text-center space-y-6">
       <motion.h1
         className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
       >
         Nơi Bộ Móng Trở Thành Tác Phẩm
       </motion.h1>

       <motion.p
         className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.2 }}
       >
         Nail art studio cao cấp - Nơi sự sáng tạo gặp gỡ nghệ thuật
       </motion.p>

       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.4 }}
       >
         <Button
           size="lg"
           className="rounded-[16px] shadow-glow hover:scale-105 transition-transform"
         >
           Khám Phá Lookbook
         </Button>
       </motion.div>
     </div>
     ```

2. **Lookbook Highlight Section** (new)
   - Create component showing 6 best gallery items in masonry-style grid:
     ```tsx
     export function LookbookHighlight() {
       const { data: gallery = [] } = useGallery({ featured: true, limit: 6 });

       return (
         <section className="py-24 bg-background">
           <div className="container mx-auto px-4">
             <div className="text-center mb-12">
               <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
                 Bộ Sưu Tập Mới Nhất
               </h2>
               <p className="font-sans text-lg text-muted-foreground">
                 Những mẫu móng nghệ thuật được yêu thích nhất
               </p>
             </div>

             {/* Asymmetric Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
               {gallery.map((item, index) => (
                 <motion.div
                   key={item._id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.1 }}
                   className={cn(
                     "relative overflow-hidden rounded-[20px] group cursor-pointer",
                     index === 0 && "md:col-span-2 md:row-span-2" // First item larger
                   )}
                 >
                   <img
                     src={item.imageUrl}
                     alt={item.title}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 </motion.div>
               ))}
             </div>

             <div className="text-center">
               <Button
                 variant="outline"
                 size="lg"
                 className="rounded-[16px] group"
               >
                 Xem Toàn Bộ Lookbook
                 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
             </div>
           </div>
         </section>
       );
     }
     ```

3. **About Section Redesign**
   - Update with new typography and spacing:
     ```tsx
     <section className="py-24 bg-secondary/30">
       <div className="container mx-auto px-4">
         <div className="grid md:grid-cols-2 gap-12 items-center">
           <div className="relative">
             <img
               src="/about-image.jpg"
               alt="Pink Nail Art Studio"
               className="rounded-[24px] shadow-soft-lg"
             />
           </div>

           <div className="space-y-6">
             <h2 className="font-serif text-4xl md:text-5xl font-semibold">
               Chúng Tôi Không Chỉ Đắp Móng,<br />
               Chúng Tôi Tạo Ra Sự Tự Tin
             </h2>

             <p className="font-sans text-lg text-muted-foreground leading-relaxed">
               Tại Pink Nail Art Studio, mỗi bộ móng là một tác phẩm nghệ thuật được
               chăm chút tỉ mỉ bởi những nghệ nhân tài hoa.
             </p>

             <ul className="space-y-4">
               {features.map(feature => (
                 <li key={feature.title} className="flex items-start gap-3">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                     <Check className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                     <h4 className="font-sans font-semibold mb-1">{feature.title}</h4>
                     <p className="text-sm text-muted-foreground">{feature.description}</p>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </div>
     </section>
     ```

4. **Section Spacing**
   - Ensure 100px+ between sections (per spec):
     ```tsx
     <div className="space-y-24 md:space-y-32">
       <HeroSection />
       <LookbookHighlight />
       <AboutSection />
       <ServiceHighlight />
     </div>
     ```

#### Deliverables

- [ ] Hero with new typography and CTA button
- [ ] Lookbook highlight section (6 featured items, asymmetric grid)
- [ ] About section with brand story + features
- [ ] 100px+ spacing between sections
- [ ] Smooth scroll animations

#### QA Checklist

- [ ] Hero text readable on all devices
- [ ] CTA button prominent and clickable
- [ ] Lookbook images load efficiently (lazy load)
- [ ] About section images optimized
- [ ] Mobile: sections stack gracefully
- [ ] Animations smooth, not overwhelming

#### Success Criteria

- HomePage feels premium and inviting
- Clear visual hierarchy guides user journey
- CTA buttons drive traffic to gallery/booking
- Page load time <2s

---

### Phase 11: Contact Page Polish (Weeks 21-22)

**Objective**: Update Contact page with new design system - pill buttons, subtle inputs, map styling

#### Files to Modify

```
apps/client/src/pages/ContactPage.tsx
apps/client/src/components/contact/ContactForm.tsx
apps/client/src/components/contact/ContactInfo.tsx
apps/client/src/components/contact/GoogleMap.tsx (if exists)
```

#### Technical Tasks

1. **ContactInfo Component**
   - Replace default icons with line icons (lucide-react):
     ```tsx
     import { MapPin, Phone, Mail, Clock } from 'lucide-react';

     <div className="space-y-6">
       {/* Address */}
       <div className="flex items-start gap-4">
         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
           <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
         </div>
         <div>
           <h4 className="font-sans font-semibold mb-1">Địa Chỉ</h4>
           <p className="text-sm text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</p>
         </div>
       </div>

       {/* Phone */}
       <div className="flex items-start gap-4">
         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
           <Phone className="w-5 h-5 text-primary" strokeWidth={1.5} />
         </div>
         <div>
           <h4 className="font-sans font-semibold mb-1">Điện Thoại</h4>
           <p className="text-sm text-muted-foreground">0123 456 789</p>
         </div>
       </div>

       {/* Hours with dynamic status */}
       <div className="flex items-start gap-4">
         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
           <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
         </div>
         <div>
           <h4 className="font-sans font-semibold mb-1">Giờ Mở Cửa</h4>
           <p className="text-sm text-muted-foreground">9:00 AM - 8:00 PM</p>
           <span className={cn(
             "inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium",
             isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
           )}>
             {isOpen ? "Đang Mở Cửa" : "Đã Đóng Cửa"}
           </span>
         </div>
       </div>
     </div>
     ```

2. **ContactForm Component**
   - Input fields already updated in Phase 2 (Input component)
   - Update submit button to pill shape:
     ```tsx
     <Button
       type="submit"
       size="lg"
       variant="pill"
       className="w-full md:w-auto"
       disabled={isSubmitting}
     >
       {isSubmitting ? "Đang Gửi..." : "Gửi Tin Nhắn"}
     </Button>
     ```

3. **Google Map Styling** (if integrated)
   - Add custom map styles (muted/retro theme to match brand):
     ```typescript
     const mapStyles = [
       {
         "featureType": "all",
         "elementType": "geometry",
         "stylers": [{ "color": "#FDF8F5" }] // Background cream
       },
       {
         "featureType": "road",
         "elementType": "geometry",
         "stylers": [{ "color": "#D1948B" }, { "lightness": 60 }] // Dusty rose roads
       },
       {
         "featureType": "water",
         "elementType": "geometry",
         "stylers": [{ "color": "#D1948B" }, { "lightness": 80 }]
       },
       // ... more style rules
     ];

     <GoogleMap
       options={{
         styles: mapStyles,
         disableDefaultUI: true,
         zoomControl: true,
       }}
     />
     ```

4. **Real-Time Open/Closed Status**
   - Add utility to check business hours:
     ```typescript
     function isBusinessOpen(): boolean {
       const now = new Date();
       const hours = now.getHours();
       const day = now.getDay();

       // Closed on Sundays (0)
       if (day === 0) return false;

       // Open 9 AM - 8 PM
       return hours >= 9 && hours < 20;
     }
     ```

#### Deliverables

- [ ] Line icons (thin stroke) for contact info
- [ ] Real-time open/closed status indicator
- [ ] Submit button as pill shape
- [ ] Google Map with custom muted/retro styling
- [ ] Form validation and error states

#### QA Checklist

- [ ] Icons render correctly at all sizes
- [ ] Open/closed status updates correctly by time
- [ ] Form submission works (test with API)
- [ ] Map loads without API key errors
- [ ] Mobile: form fields thumb-friendly
- [ ] Accessibility: form labels and errors announced

#### Success Criteria

- Contact page feels cohesive with rest of site
- Map visually harmonious with brand colors
- Form UX smooth and error-free
- Business hours accurate

---

### Phase 12: Final Polish & Performance (Weeks 23-24)

**Objective**: Cross-browser testing, performance optimization, accessibility audit, launch prep

#### Files to Modify

```
apps/client/vite.config.ts
apps/client/index.html
apps/client/src/App.tsx
Various components (optimization)
```

#### Technical Tasks

1. **Performance Optimization**
   - Code splitting:
     ```typescript
     // apps/client/src/App.tsx
     import { lazy, Suspense } from 'react';

     const GalleryPage = lazy(() => import('./pages/GalleryPage'));
     const BookingPage = lazy(() => import('./pages/BookingPage'));

     <Suspense fallback={<PageLoader />}>
       <Routes>
         <Route path="/gallery" element={<GalleryPage />} />
         <Route path="/booking" element={<BookingPage />} />
       </Routes>
     </Suspense>
     ```

   - Font optimization (already using Google Fonts with `display=swap`):
     - Verify `font-display: swap` in CSS
     - Consider self-hosting fonts for better control

   - Image optimization:
     - Add `loading="lazy"` to all images (already in LazyImage component)
     - Set explicit width/height to prevent CLS
     - Add WebP fallbacks (future: Cloudinary will handle this)

2. **Accessibility Audit**
   - Run axe DevTools on all pages
   - Fix critical issues:
     - [ ] All images have alt text
     - [ ] Form labels properly associated
     - [ ] Focus indicators visible
     - [ ] Color contrast ≥4.5:1 (WCAG AA)
     - [ ] Keyboard navigation works on all interactive elements
     - [ ] ARIA labels on icon-only buttons

   - Screen reader testing:
     - [ ] VoiceOver (macOS/iOS)
     - [ ] NVDA (Windows)
     - [ ] TalkBack (Android)

3. **Cross-Browser Testing**
   - Test on:
     - [ ] Chrome (latest)
     - [ ] Safari (latest)
     - [ ] Firefox (latest)
     - [ ] Edge (latest)
     - [ ] Mobile Safari (iOS)
     - [ ] Chrome Mobile (Android)

   - Known issues to check:
     - Safari: motion animations may need prefixes
     - Firefox: backdrop-filter support
     - Edge: Flexbox quirks

4. **Lighthouse Audit**
   - Run on all major pages:
     - [ ] HomePage
     - [ ] GalleryPage
     - [ ] BookingPage
     - [ ] ContactPage

   - Target scores:
     - Performance: 95+
     - Accessibility: 100
     - Best Practices: 95+
     - SEO: 95+

   - Common fixes:
     - Eliminate render-blocking resources
     - Properly size images
     - Use HTTPS
     - Add meta descriptions

5. **SEO Optimization**
   - Update meta tags in `index.html`:
     ```html
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <meta name="description" content="Pink Nail Art Studio - Nail art cao cấp tại TP.HCM. Chuyên vẽ 3D, tráng gương, đính đá. Đặt lịch online ngay." />
       <meta name="keywords" content="nail art, nail salon, vẽ móng, đắp móng, TP.HCM, Pink Nail" />
       <meta property="og:title" content="Pink. Nail Art Studio | Nơi Bộ Móng Trở Thành Tác Phẩm" />
       <meta property="og:description" content="Nail art studio cao cấp - Nơi sự sáng tạo gặp gỡ nghệ thuật" />
       <meta property="og:image" content="/og-image.jpg" />
       <meta property="og:type" content="website" />
       <title>Pink. Nail Art Studio | Nail Art Cao Cấp TP.HCM</title>

       <!-- Favicon -->
       <link rel="icon" type="image/png" href="/favicon.png" />
     </head>
     ```

6. **Error Tracking Setup** (Optional)
   - Consider Sentry or similar:
     ```bash
     npm install @sentry/react --workspace=client
     ```
   - Initialize in `main.tsx`:
     ```typescript
     import * as Sentry from '@sentry/react';

     if (import.meta.env.PROD) {
       Sentry.init({
         dsn: "...",
         environment: "production",
       });
     }
     ```

7. **Analytics Setup** (Not Required per Spec)
   - Spec says "no analytics or A/B testing needed"
   - Skip Google Analytics for MVP
   - If needed later, add Google Tag Manager

8. **Final Checklist**
   - [ ] All console errors/warnings resolved
   - [ ] No dead links (run link checker)
   - [ ] Forms submit successfully
   - [ ] Booking flow end-to-end works
   - [ ] Gallery filters functional
   - [ ] Mobile responsive at 320px, 375px, 768px, 1024px, 1440px
   - [ ] Print styles (optional)
   - [ ] Offline fallback (optional PWA)

#### Deliverables

- [ ] Lighthouse scores documented (screenshot)
- [ ] Accessibility audit report
- [ ] Cross-browser compatibility matrix
- [ ] Performance baseline (Lighthouse JSON export)
- [ ] SEO meta tags implemented
- [ ] Error tracking configured (optional)

#### QA Checklist

- [ ] No regressions from previous phases
- [ ] All animations smooth on mid-tier devices
- [ ] Bundle size acceptable (<500KB initial load)
- [ ] Time to Interactive <3s on 4G
- [ ] No accessibility violations (axe)
- [ ] 404 page exists and styled
- [ ] Error boundaries implemented

#### Success Criteria

- Lighthouse Performance: ≥95
- Lighthouse Accessibility: 100
- Zero critical bugs
- Site ready for production deployment
- Handoff documentation complete

---

## Technical Specifications

### Design Tokens

#### Color Palette (OKLCH for Tailwind v4)

```typescript
// apps/client/src/styles/design-tokens.ts
export const colors = {
  // Primary - Dusty Rose
  primary: {
    DEFAULT: "oklch(0.64 0.06 12)",      // #D1948B
    50: "oklch(0.97 0.01 12)",           // Very light dusty rose
    100: "oklch(0.94 0.02 12)",
    200: "oklch(0.88 0.03 12)",
    300: "oklch(0.78 0.04 12)",
    400: "oklch(0.71 0.05 12)",
    500: "oklch(0.64 0.06 12)",          // Base
    600: "oklch(0.56 0.05 12)",
    700: "oklch(0.48 0.04 12)",
    800: "oklch(0.40 0.03 12)",
    900: "oklch(0.28 0.02 12)",          // Very dark dusty rose
    foreground: "oklch(0.99 0 0)",       // #FAFAFA
  },

  // Background - Cream/Nude
  background: "oklch(0.98 0.01 45)",     // #FDF8F5

  // Foreground - Charcoal
  foreground: "oklch(0.22 0 0)",         // #333333

  // Card
  card: "oklch(1 0 0)",                  // #FFFFFF

  // Muted - for secondary text
  muted: {
    DEFAULT: "oklch(0.96 0.01 45)",      // Lighter cream
    foreground: "oklch(0.45 0 0)",       // #5A5A5A
  },

  // Secondary - for highlights/accents
  secondary: {
    DEFAULT: "oklch(0.97 0.01 45)",      // #F5F5F5
    foreground: "oklch(0.22 0 0)",       // #333333
  },

  // Border
  border: "oklch(0.92 0.01 45)",         // #EAEAEA

  // Input
  input: "oklch(0.92 0.01 45)",          // Same as border

  // Ring (focus indicators)
  ring: "oklch(0.64 0.06 12)",           // Same as primary
} as const;
```

#### Typography Scale

```typescript
export const typography = {
  // Headings (Playfair Display - Serif)
  h1: "font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1]",
  h2: "font-serif text-4xl md:text-5xl font-semibold text-foreground leading-[1.2]",
  h3: "font-serif text-3xl md:text-4xl font-semibold text-foreground leading-[1.25]",
  h4: "font-serif text-2xl md:text-3xl font-medium text-foreground leading-[1.3]",
  h5: "font-serif text-xl md:text-2xl font-medium text-foreground leading-[1.35]",

  // Body (Be Vietnam Pro - Sans-serif)
  body: "font-sans text-base md:text-lg text-foreground leading-relaxed",
  bodySmall: "font-sans text-sm md:text-base text-muted-foreground leading-relaxed",
  caption: "font-sans text-xs md:text-sm text-muted-foreground leading-normal",

  // UI Elements
  button: "font-sans text-base font-semibold",
  buttonSmall: "font-sans text-sm font-semibold",
  label: "font-sans text-sm font-medium text-foreground",
} as const;
```

#### Spacing System

```typescript
export const spacing = {
  // Section spacing (vertical)
  section: "6rem md:8rem lg:10rem",     // 96px-160px
  sectionSmall: "4rem md:6rem",         // 64px-96px

  // Component padding
  card: "1.5rem md:2rem",               // 24px-32px
  container: "1rem md:1.5rem lg:2rem",  // 16px-32px

  // Element spacing
  element: "1rem md:1.5rem",            // 16px-24px
  elementSmall: "0.5rem md:0.75rem",    // 8px-12px
} as const;
```

#### Border Radius System

```typescript
export const borderRadius = {
  sm: "8px",      // Badges, small chips
  md: "12px",     // Buttons, inputs
  lg: "16px",     // Cards, medium containers
  xl: "20px",     // Large cards
  "2xl": "24px",  // Hero sections, modals
  full: "9999px", // Pills, circular elements
} as const;
```

#### Shadow System

```typescript
export const shadows = {
  // Soft shadows with primary color tint
  'soft-sm': '0 2px 8px rgba(209, 148, 139, 0.08)',
  'soft-md': '0 4px 16px rgba(209, 148, 139, 0.1)',
  'soft-lg': '0 10px 30px rgba(209, 148, 139, 0.12)',
  'soft-xl': '0 20px 40px rgba(209, 148, 139, 0.15)',

  // Glow effect (for CTAs)
  'glow': '0 0 20px rgba(209, 148, 139, 0.3)',
  'glow-lg': '0 0 30px rgba(209, 148, 139, 0.4)',
} as const;
```

### Component Updates

#### Button Component Patterns

```typescript
// Default (primary CTA)
<Button size="lg" className="rounded-[16px]">
  Đặt Lịch Ngay
</Button>

// Outline variant
<Button variant="outline" size="lg" className="rounded-[16px]">
  Xem Thêm
</Button>

// Pill button (Contact page CTA)
<Button variant="pill" size="lg">
  Gửi Tin Nhắn
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Heart className="w-5 h-5" />
</Button>
```

#### Input Component Patterns

```typescript
// Text input
<Input
  type="text"
  placeholder="Nhập tên của bạn"
  className="rounded-[12px]"
/>

// Textarea
<Textarea
  placeholder="Tin nhắn của bạn..."
  className="rounded-[12px] min-h-[120px]"
/>

// Date picker (existing component, already styled)
<DatePicker
  date={selectedDate}
  onSelect={handleDateSelect}
/>
```

#### Card Component Patterns

```typescript
// Gallery card
<Card className="rounded-[20px] shadow-soft-md hover:shadow-soft-lg transition-shadow">
  <CardContent className="p-4">
    {/* content */}
  </CardContent>
</Card>

// Service card
<Card className="rounded-[20px] shadow-soft-md overflow-hidden">
  <img src="..." alt="..." className="w-full" />
  <CardContent className="p-6">
    {/* content */}
  </CardContent>
</Card>
```

### Dependencies & Packages

#### New Packages to Install

```json
{
  "dependencies": {
    "react-masonry-css": "^1.0.16",      // Phase 4: Gallery masonry
    "canvas-confetti": "^1.9.3"          // Phase 9: Booking confetti
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.6.4"   // Phase 9: Confetti types
  }
}
```

#### Google Fonts Integration

Add to `apps/client/index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap" rel="stylesheet">
```

**Performance Optimization**:
- Use `&display=swap` to prevent FOIT (Flash of Invisible Text)
- Preconnect to fonts.googleapis.com
- Consider self-hosting in future for better control

#### Existing Packages (No Changes)

All current dependencies remain compatible:
- React 19.2
- Motion (Framer Motion) 12.23
- Radix UI components
- TanStack Query
- React Router v7
- Lucide React icons
- Tailwind CSS v4

---

## Risk Mitigation

### Potential Issues & Strategies

#### 1. Typography Loading Issues

**Risk**: Google Fonts may cause FOIT/FOUT (Flash of Invisible/Unstyled Text)

**Mitigation**:
- Use `font-display: swap` in URL parameter
- Add font-face preload in `<head>`
- Implement CSS font-loading API for font load detection
- Fallback fonts: `serif` and `sans-serif` already specified

**Rollback Plan**:
- Revert to system fonts temporarily
- Self-host fonts if Google Fonts unreliable

#### 2. Masonry Layout Performance

**Risk**: Masonry may cause layout shifts or performance issues on low-end devices

**Mitigation**:
- Set explicit aspect ratios on images before load
- Use skeleton loaders with masonry layout
- Test on low-end devices (throttle CPU in DevTools)
- Implement virtualization if gallery grows very large

**Rollback Plan**:
- Revert to standard CSS Grid (3 columns, equal height)
- Keep filter functionality intact

#### 3. Color Contrast Accessibility

**Risk**: Dusty Rose (#D1948B) may not meet WCAG AA contrast on light backgrounds

**Mitigation**:
- Test all text/background combinations with contrast checker
- Use darker shade (primary-700) for small text if needed
- Ensure CTA buttons have sufficient contrast (white text on dusty rose = 4.5:1+)

**Rollback Plan**:
- Darken primary color slightly (adjust OKLCH lightness from 0.64 to 0.56)
- Keep charcoal (#333) for body text (excellent contrast)

#### 4. Browser Compatibility (Safari)

**Risk**: Safari may not support all CSS features (backdrop-filter, some OKLCH values)

**Mitigation**:
- Test early on Safari (macOS and iOS)
- Provide fallback colors in hex/rgb for OKLCH
- Use autoprefixer (already in Vite setup)

**Rollback Plan**:
- Convert OKLCH to hex in Tailwind config
- Remove backdrop-filter effects if causing issues

#### 5. Bundle Size Increase

**Risk**: New dependencies (masonry, confetti) may increase bundle size

**Mitigation**:
- Code-split Gallery and Booking pages (lazy load)
- Dynamic import confetti library only when needed
- Monitor bundle size with Vite build analyzer

**Rollback Plan**:
- Remove confetti (nice-to-have, not critical)
- Use CSS-only masonry (column-count) instead of library

#### 6. Mobile Performance

**Risk**: Animations and effects may cause jank on mobile

**Mitigation**:
- Test on real devices (iPhone, Android)
- Use `will-change` sparingly and only during animations
- Respect `prefers-reduced-motion`
- Throttle hover effects on touch devices

**Rollback Plan**:
- Disable animations on mobile via media query
- Remove hover effects, use tap-to-reveal instead

---

## Performance Budget

### Lighthouse Score Targets

| Metric           | Current | Target | Critical Threshold |
|------------------|---------|--------|--------------------|
| Performance      | 92      | 95+    | 90                 |
| Accessibility    | 95      | 100    | 95                 |
| Best Practices   | 92      | 95+    | 90                 |
| SEO              | 90      | 95+    | 85                 |

### Core Web Vitals

| Metric                | Target  | Good    | Needs Improvement |
|-----------------------|---------|---------|-------------------|
| LCP (Largest Contentful Paint) | <2.0s   | <2.5s   | <4.0s             |
| FID (First Input Delay)        | <80ms   | <100ms  | <300ms            |
| CLS (Cumulative Layout Shift)  | <0.08   | <0.1    | <0.25             |

### Bundle Size Budget

| Resource Type    | Budget  | Current | Notes                          |
|------------------|---------|---------|--------------------------------|
| Initial JS       | 300KB   | ~250KB  | After gzip                     |
| Fonts (WOFF2)    | 100KB   | ~80KB   | Playfair + Be Vietnam Pro      |
| CSS              | 50KB    | ~35KB   | Tailwind purged                |
| Images (hero)    | 200KB   | TBD     | Optimize with Cloudinary later |
| Total (initial)  | 650KB   | ~365KB  | Good starting point            |

### Font Loading Optimization

**Strategy**: `font-display: swap` + preconnect

```html
<!-- Already implemented in Phase 1 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="...&display=swap" rel="stylesheet">
```

**Performance Impact**:
- FOIT eliminated (swap to fallback immediately)
- Font load time: ~150-200ms on broadband
- Fallback fonts: system serif/sans-serif

**Future Optimization**:
- Self-host fonts for more control
- Subset fonts to Vietnamese + English characters only
- Use `font-display: optional` for non-critical text

### Image Optimization (Future - Cloudinary)

**Note**: User will add Cloudinary integration separately. Document best practices here:

**Recommended Transformations**:
```
https://res.cloudinary.com/.../image/upload/
  f_auto,q_auto,w_800,ar_4:3,c_fill/gallery-image.jpg
```

- `f_auto`: Auto format (WebP for modern browsers)
- `q_auto`: Auto quality (balance size/quality)
- `w_800`: Responsive widths (400, 800, 1200, 1600)
- `ar_4:3`: Aspect ratio (prevent CLS)
- `c_fill`: Crop to fill

**Responsive Images Pattern**:
```tsx
<img
  src="cloudinary-url-800w"
  srcSet="
    cloudinary-url-400w 400w,
    cloudinary-url-800w 800w,
    cloudinary-url-1200w 1200w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="..."
/>
```

---

## Mobile Responsiveness

### Breakpoint Strategy

```typescript
// Tailwind breakpoints (already configured)
const breakpoints = {
  sm: '640px',   // Mobile landscape, small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Gallery Responsive Rules

| Viewport    | Columns | Card Width | Spacing |
|-------------|---------|------------|---------|
| <640px      | 2       | ~165px     | 16px    |
| 640-1023px  | 2       | ~340px     | 24px    |
| 1024px+     | 3       | ~320px     | 24px    |

**Implementation** (Phase 4):
```typescript
const breakpointColumns = {
  default: 3,
  1024: 2,
  640: 2, // Per spec: 2 columns on mobile
};
```

### Touch-Friendly Interactions

#### Minimum Touch Targets

All interactive elements must meet **44×44px minimum** (iOS HIG, Material Design):

```typescript
// Button size variants
size: {
  sm: "h-10 px-4",      // 40px height (close to minimum)
  default: "h-12 px-6",  // 48px height ✅
  lg: "h-14 px-8",      // 56px height ✅
  icon: "size-12",      // 48×48px ✅
}
```

#### Mobile Hover Replacement

- **Desktop**: Hover shows overlay + buttons
- **Mobile**: Tap to open modal (no hover state)

```typescript
const isTouchDevice = 'ontouchstart' in window;

// Disable hover effects on touch
{!isTouchDevice && (
  <div className="group-hover:opacity-100">
    {/* hover-only elements */}
  </div>
)}
```

#### Mobile Gestures

- **Gallery Modal**: Swipe left/right to navigate (future enhancement)
- **Booking Form**: Native mobile date/time pickers on iOS/Android
- **Filters**: Horizontal scroll if pills exceed viewport width

### Mobile Typography Scale

```typescript
// Responsive font sizes (already in design tokens)
h1: "text-5xl md:text-6xl lg:text-7xl"      // 48px → 60px → 72px
h2: "text-4xl md:text-5xl"                  // 36px → 48px
body: "text-base md:text-lg"                // 16px → 18px
```

**Minimum Base Size**: 16px (prevents zoom on iOS input focus)

### Mobile Navigation

- Existing mobile menu (hamburger) remains unchanged
- Ensure sticky header on scroll (already implemented)
- Back button in browser works correctly (React Router handles this)

---

## Accessibility Compliance

### WCAG AA Requirements

#### Color Contrast

| Element              | Foreground      | Background      | Ratio  | Pass |
|----------------------|-----------------|-----------------|--------|------|
| Body text            | #333333 (charcoal) | #FDF8F5 (cream) | 11.2:1 | ✅ AAA |
| Primary button text  | #FAFAFA (white) | #D1948B (dusty rose) | 4.7:1 | ✅ AA |
| Muted text           | #5A5A5A         | #FDF8F5         | 6.3:1  | ✅ AA |
| Link text            | #D1948B         | #FFFFFF         | 3.1:1  | ⚠️ Needs testing |

**Action Required**: Test all link colors. If <4.5:1, use darker shade (primary-700).

#### Keyboard Navigation

All interactive elements must be keyboard accessible:

- **Tab**: Move focus between elements
- **Enter/Space**: Activate buttons, links
- **Arrow keys**: Navigate gallery modal (left/right)
- **ESC**: Close modals, dialogs

**Implementation**:
```tsx
// Example: Gallery card with keyboard support
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  {/* card content */}
</div>
```

#### Focus Indicators

Visible focus states (already in Button component):

```typescript
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
```

**Rule**: Focus ring must have ≥3:1 contrast with background.

#### Screen Reader Support

##### Semantic HTML

```tsx
// ✅ Correct
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/gallery">Gallery</a></li>
  </ul>
</nav>

// ❌ Wrong
<div onClick={handleNav}>Gallery</div>
```

##### ARIA Labels

```tsx
// Icon-only buttons
<Button size="icon" aria-label="Close modal">
  <X className="w-5 h-5" />
</Button>

// Loading states
<Button disabled aria-busy="true">
  <Loader2 className="animate-spin" />
  <span className="sr-only">Loading...</span>
  Submitting...
</Button>
```

##### Image Alt Text

```tsx
// Decorative images
<img src="pattern.svg" alt="" role="presentation" />

// Informative images
<img src="nail-art.jpg" alt="Almond-shaped nails with 3D floral design and gold accents" />
```

#### Motion & Animations

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**React Implementation**:
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
  {/* content */}
</motion.div>
```

### Accessibility Testing Checklist

- [ ] Run axe DevTools on all pages
- [ ] Test with keyboard only (unplug mouse)
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Check color contrast ratios (all combinations)
- [ ] Verify focus indicators visible
- [ ] Test with zoom at 200%
- [ ] Check responsive at 320px width
- [ ] Validate HTML (no errors)

---

## Testing Strategy

### Manual Testing Plan

#### Phase-by-Phase Testing

After each phase:

1. **Visual Regression Testing**
   - Take screenshots before changes
   - Compare after implementation
   - Use browser DevTools device emulation

2. **Functional Testing**
   - Test all interactive elements
   - Verify forms submit correctly
   - Check navigation works

3. **Responsive Testing**
   - Test at breakpoints: 320px, 375px, 768px, 1024px, 1440px
   - Portrait and landscape on mobile
   - Use Chrome DevTools + real devices

4. **Browser Testing**
   - Chrome (latest)
   - Safari (macOS/iOS)
   - Firefox (latest)
   - Edge (latest)

#### End-to-End User Flows

**Critical Paths**:

1. **Gallery → Booking**
   - Browse gallery
   - Apply filters
   - Click card to open modal
   - Click "Book this design"
   - Complete booking form
   - See confirmation with confetti

2. **Services → Booking**
   - View services
   - Click "Book Now"
   - Complete booking
   - Verify success

3. **Contact Form**
   - Fill out form
   - Submit
   - Verify toast notification
   - Check form cleared

### Automated Testing (Optional)

#### Unit Tests (Vitest)

Already configured in project. Add tests for:

```typescript
// utils/confetti.test.ts
describe('celebrateBooking', () => {
  it('should trigger confetti animation', () => {
    // Mock canvas-confetti
    // Assert confetti called with correct params
  });

  it('should not fire if prefers-reduced-motion', () => {
    // Mock matchMedia
    // Assert confetti not called
  });
});
```

#### Component Tests

```typescript
// GalleryCard.test.tsx
describe('GalleryCard', () => {
  it('should render image and title', () => {
    render(<GalleryCard item={mockItem} />);
    expect(screen.getByAltText(mockItem.title)).toBeInTheDocument();
  });

  it('should call onImageClick when clicked', () => {
    const handleClick = vi.fn();
    render(<GalleryCard item={mockItem} onImageClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### E2E Tests (Playwright - Future)

Currently not implemented. If needed:

```typescript
// e2e/booking-flow.spec.ts
test('complete booking from gallery', async ({ page }) => {
  await page.goto('/gallery');
  await page.click('[data-testid="gallery-card-0"]');
  await page.click('text=Đặt Lịch Theo Mẫu Này');
  await page.fill('input[name="date"]', '2026-03-01');
  await page.click('text=10:00 AM');
  await page.click('text=Tiếp Theo');
  await page.fill('input[name="firstName"]', 'John');
  // ... complete form
  await page.click('text=Xác Nhận Đặt Lịch');
  await expect(page.locator('text=Đặt Lịch Thành Công')).toBeVisible();
});
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All phases complete and tested
- [ ] Lighthouse scores meet targets (95+ performance)
- [ ] Accessibility audit passed (100 score)
- [ ] Cross-browser testing complete
- [ ] Mobile testing on real devices
- [ ] No console errors or warnings
- [ ] Bundle size within budget (<500KB)

### Build & Deploy

1. **Run Production Build**
   ```bash
   cd apps/client
   npm run build
   ```

2. **Verify Build Output**
   - Check `dist/` folder
   - Inspect bundle sizes
   - Test locally: `npm run preview`

3. **Deploy to Server**
   ```bash
   # Using Docker (from root)
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

4. **Nginx Configuration**
   - Verify nginx routes `/` to client
   - Check HTTPS certificates
   - Test reverse proxy

### Post-Deployment

- [ ] Smoke test all pages in production
- [ ] Verify Google Fonts load correctly
- [ ] Check all images load (no broken links)
- [ ] Test booking form submission (end-to-end)
- [ ] Monitor server logs for errors
- [ ] Lighthouse audit on production URL
- [ ] Share URL with stakeholders

### Rollback Plan

If critical issues found post-deployment:

1. **Quick Rollback**
   ```bash
   # Revert to previous Docker image
   docker compose down
   docker compose up -d previous-image-tag
   ```

2. **Identify Issue**
   - Check browser console
   - Review server logs
   - Test on different devices

3. **Hotfix or Full Rollback**
   - Minor CSS fix: hotfix and redeploy
   - Major bug: full rollback to previous version

---

## Handoff Documentation

### For Developers

#### Quick Start

```bash
# Install dependencies
npm install

# Run client dev server
cd apps/client
npm run dev

# Access at http://localhost:5173
```

#### Key Files to Know

- **Design Tokens**: `apps/client/src/styles/design-tokens.ts`
- **Tailwind Config**: `packages/tailwind-config/client-theme.js`
- **Global Styles**: `apps/client/src/App.css`
- **Main Routes**: `apps/client/src/App.tsx`
- **API Integration**: `apps/client/src/services/api.ts`

#### Making Changes

1. **Colors**: Edit `design-tokens.ts`, use OKLCH format
2. **Typography**: Fonts defined in `index.html` + Tailwind config
3. **Components**: Follow existing patterns in `components/ui/`
4. **Pages**: Page components in `pages/`, hooks in `hooks/`

#### Common Tasks

**Add a new color**:
```typescript
// design-tokens.ts
export const colors = {
  // ...existing
  accent: "oklch(0.70 0.08 45)", // New accent color
};
```

**Update button styles**:
```typescript
// components/ui/button.tsx
// Edit buttonVariants cva()
```

**Add new page**:
```tsx
// pages/NewPage.tsx
export function NewPage() { /* ... */ }

// App.tsx
<Route path="/new-page" element={<NewPage />} />
```

### For Designers

#### Design System Reference

**Colors**: Dusty Rose (#D1948B), Cream (#FDF8F5), Charcoal (#333333)

**Typography**:
- Headings: Playfair Display (Serif)
- Body: Be Vietnam Pro (Sans-serif)

**Spacing**: Sections 100px+ apart on desktop

**Border Radius**: 16-20px for all cards/buttons

**Shadows**: Soft shadows with dusty rose tint (no harsh black shadows)

#### Component Library

All UI components in `apps/client/src/components/ui/`:
- Button (variants: default, outline, pill)
- Input (rounded, soft focus states)
- Card (shadow-based elevation)
- Badge (for filter pills)
- Dialog (modal popups)

#### Design Files

- Figma mockups: [Link if available]
- Brand guidelines: [Link if available]
- Icon library: Lucide React (lucide.dev)

### For Content Editors

#### Updating Text Content

Most text is in Vietnamese. Key pages:

- **HomePage**: `apps/client/src/pages/HomePage.tsx`
- **GalleryPage**: `apps/client/src/pages/GalleryPage.tsx`
- **ContactPage**: `apps/client/src/pages/ContactPage.tsx`

Search for Vietnamese text strings and update as needed.

#### Updating Images

Images currently served from:
- Local: `apps/client/src/assets/`
- API: Fetched from backend (Gallery, Services)

**Future**: Cloudinary integration will replace local images.

#### SEO Meta Tags

Update in `apps/client/index.html`:
```html
<title>Your New Title</title>
<meta name="description" content="Your new description" />
```

---

## Future Enhancements (Post-MVP)

### Phase 13+: Cloudinary Integration

- Replace local images with Cloudinary URLs
- Implement responsive image transformations
- Optimize for WebP format
- Add lazy loading with blur placeholders

### Phase 14+: Advanced Gallery Features

- Save/favorite designs (user accounts needed)
- Share designs via social media
- Gallery search (by color, technique, etc.)
- Infinite scroll instead of pagination

### Phase 15+: Booking Enhancements

- Calendar integration (Google Calendar, iCal)
- Email/SMS reminders
- Online payment integration
- Loyalty program integration
- Multi-language support (English + Vietnamese)

### Phase 16+: Performance & PWA

- Convert to Progressive Web App (PWA)
- Offline mode with service worker
- Push notifications for booking reminders
- App install prompt

### Analytics (If Requested)

- Google Analytics 4 integration
- Heatmaps (Hotjar or similar)
- Conversion tracking
- A/B testing framework

---

## Appendix

### Resources

#### Documentation
- Tailwind CSS v4: https://tailwindcss.com/docs
- Radix UI: https://www.radix-ui.com/
- Motion (Framer Motion): https://motion.dev/
- React Router v7: https://reactrouter.com/

#### Design Inspiration
- Pinterest: https://pinterest.com (masonry layout reference)
- Awwwards: https://awwwards.com (high-end web design)
- Dribbble: https://dribbble.com (nail salon designs)

#### Tools
- OKLCH Color Picker: https://oklch.com/
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- Google Fonts: https://fonts.google.com/
- Lighthouse: Chrome DevTools > Lighthouse tab
- axe DevTools: Browser extension for accessibility

### Color Conversion Table

| Name          | Hex     | RGB              | OKLCH                  |
|---------------|---------|------------------|------------------------|
| Dusty Rose    | #D1948B | 209, 148, 139    | oklch(0.64 0.06 12)    |
| Cream         | #FDF8F5 | 253, 248, 245    | oklch(0.98 0.01 45)    |
| Charcoal      | #333333 | 51, 51, 51       | oklch(0.22 0 0)        |
| Soft Charcoal | #5A5A5A | 90, 90, 90       | oklch(0.45 0 0)        |
| White         | #FFFFFF | 255, 255, 255    | oklch(1 0 0)           |
| Off-white     | #FAFAFA | 250, 250, 250    | oklch(0.99 0 0)        |
| Light Gray    | #EAEAEA | 234, 234, 234    | oklch(0.92 0.01 45)    |

### Browser Support Matrix

| Browser         | Min Version | Notes                       |
|-----------------|-------------|-----------------------------|
| Chrome          | 90+         | Full support                |
| Safari          | 14+         | Test OKLCH fallbacks        |
| Firefox         | 88+         | Full support                |
| Edge            | 90+         | Chromium-based, full support|
| Mobile Safari   | iOS 14+     | Test touch interactions     |
| Chrome Mobile   | 90+         | Full support                |

**Polyfills**: Not needed for modern browsers. If supporting older browsers, add:
- `@csstools/postcss-oklab-function` for OKLCH

---

## Summary

This implementation plan provides a comprehensive roadmap for transforming the Pink Nail Salon client website into a premium nail art studio digital experience over 6 months (12 two-week sprints).

**Key Deliverables**:
- ✅ New brand-aligned design system (dusty rose + cream + serif typography)
- ✅ Pinterest-style masonry gallery with advanced filtering
- ✅ Modal popups with integrated booking flow
- ✅ Polished booking experience with confetti celebration
- ✅ Mobile-responsive, accessible, performant

**Success Metrics**:
- Gallery engagement: +40% modal opens
- Booking conversion: +25% from gallery
- Lighthouse Performance: 95+
- Accessibility: WCAG AA compliant

**Next Steps**:
1. Review and approve this plan
2. Begin Phase 1: Design Foundation (Weeks 1-2)
3. Schedule weekly check-ins to review progress
4. Iterate based on user feedback after MVP launch

**Questions?** See "Unresolved Questions" section in each phase or contact project lead.

---

**Document Version**: 1.0
**Last Updated**: 2026-02-16
**Author**: Claude (AI Technical Documentation Specialist)
**Approved By**: [Pending Review]
