# UI/UX Redesign Technical Stack Research
**Date**: 2026-02-16
**Research Focus**: Font performance, color systems, layout libraries, animation frameworks

---

## 1. Google Fonts Performance Optimization

### Recommended Strategy
**Preconnect + font-display: swap** = fastest approach for Google Fonts CDN.

```html
<!-- HTML head - establishes early connection -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Font Weights for Redesign
- **Playfair Display** (display/serif): 400, 500, 600, 700
- **Be Vietnam Pro** (body/sans-serif): 400, 500, 600, 700

### Performance Impact
- Preconnect reduces load time by ~100ms
- `font-display: swap` prevents FOIT (flash of invisible text)
- Fonts load in parallel with page rendering
- CSS `@import` = AVOID (sequential parsing, adds ~200-400ms)

### Alternative: Self-Hosting
**Better performance but requires maintenance:**
- Download font files (.woff2 format preferred)
- Store in `/public/fonts/`
- Use `@font-face` with `font-display: swap`
- Eliminates CDN dependency, cuts load time further

**Vite optimization**: Use `?inline` query for small font files or `?url` for lazy loading.

---

## 2. Tailwind CSS v4 + OKLCH Colors

### OKLCH Benefits
- **Wider Color Gamut**: Utilizes Display P3 (more vivid than sRGB)
- **Perceptually Uniform**: Better color relationships across hues
- **Modern Displays**: Takes advantage of high-quality screens

### Browser Compatibility
| Browser | Support | Min Version |
|---------|---------|-------------|
| Chrome  | ✓ Full  | 111+        |
| Firefox | ✓ Full  | 113+        |
| Safari  | ✓ Full  | 15.4+       |
| Edge    | ✓ Full  | 111+        |
| **Coverage** | **~93% global** | **7% still use older browsers** |

### Windows 7 Edge Case
- Last Chrome version: 109 (OKLCH not supported)
- Tailwind v4 **does NOT transpile OKLCH** (no fallback)
- Requires conditional design or PostCSS plugin

### Fallback Strategies

**Option 1: sRGB Gradient Fallback** (Tailwind v4 native)
```html
<!-- sRGB interpolation for older browsers -->
<div class="bg-linear-to-r/srgb from-indigo-500 to-teal-400"></div>

<!-- OKLCH interpolation for modern browsers -->
<div class="bg-linear-to-r/oklch from-indigo-500 to-teal-400"></div>
```

**Option 2: PostCSS Plugin** (for strict compatibility)
```bash
npm install @csstools/postcss-oklab-function
```
Converts OKLCH → RGB at build time.

### HEX to OKLCH Conversion
Use online converters:
- [oklch.com](https://oklch.com/) - Interactive picker
- [oklch.fyi](https://oklch.fyi/) - Full color converter
- [OpenReplay Converter](https://openreplay.com/tools/hex-to-oklch/) - Batch conversion

**Recommended**: Store converted colors in `tailwind.config.js` for consistency.

---

## 3. react-masonry-css Library

### Architecture
- **CSS-driven** distribution (not JavaScript calculations)
- Distributes items **sequentially across columns**
- No sorting by height (kills performance)
- **Dependency-free**, IE 10+ compatible

### Breakpoint Configuration
```javascript
const breakpointColumnsObj = {
  default: 4,      // >1100px
  1100: 3,         // 1100-700px
  700: 2,          // 700-500px
  500: 1           // <500px (mobile)
};

<Masonry breakpointCols={breakpointColumnsObj}>
  {items.map(item => (
    <div key={item.id} className="masonry-item">
      {item.content}
    </div>
  ))}
</Masonry>
```

### CSS Implementation
```css
.masonry {
  display: flex;
  width: auto;
  margin-left: -16px; /* gutter offset */
}

.masonry-column {
  padding-left: 16px; /* gutter */
  background-clip: padding-box;
}

.masonry-item {
  break-inside: avoid; /* prevent item splitting */
  margin-bottom: 16px;
}

/* Mobile responsive gutter */
@media (max-width: 800px) {
  .masonry {
    margin-left: -8px;
  }
  .masonry-column {
    padding-left: 8px;
  }
}
```

### Performance Characteristics
- Single render pass (optimal)
- Equal-width items only (must use CSS to enforce widths)
- No height-based optimization (suitable for uniformly-sized content)
- Minimal computational overhead

### Alternatives
- **CSS Grid masonry**: `masonry-auto-flow: dense` (better results, requires `@supports`)
- **react-responsive-masonry**: JavaScript-based height balancing (slower)

**Decision**: Use react-masonry-css for uniform gallery items; CSS Grid for variable heights.

---

## 4. canvas-confetti Library

### Bundle Size & Performance
- **Size**: ~5KB gzipped
- **Performance**: < 10ms impact on page load
- **Particles**: Keep < 100 for smooth 60fps
- **Canvas Rendering**: GPU-accelerated, minimal overhead

### Basic Usage
```javascript
import confetti from 'canvas-confetti';

// Simple celebration
confetti();

// Custom configuration
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#FAA500', '#FFD700', '#FFA500']
});
```

### Accessibility: prefers-reduced-motion
```javascript
confetti({
  disableForReducedMotion: true // Respect user motion preferences
});

// Library respects @media (prefers-reduced-motion: reduce)
// Promise resolves immediately without animation
```

**Current Status**: Disabled by default; maintainer considering enabling in v1.0

**Implementation Recommendation**: Enable `disableForReducedMotion: true` for all celebrations.

### Performance Optimization
- Use `particleCount: 50-80` for smooth animations
- Avoid overlapping confetti calls
- Specify `origin` point to reduce canvas area
- Use color palette matching design system

---

## 5. Motion (Framer Motion) for Animations

### GPU-Accelerated Properties
Animate only these for optimal performance:
- `scale`, `scaleX`, `scaleY`
- `rotate`, `rotateX`, `rotateY`
- `skewX`, `skewY`
- `x`, `y`, `opacity`

```jsx
import { motion } from 'framer-motion';

// Good: GPU-accelerated
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
>
  Hover me
</motion.div>

// Bad: triggers layout recalculations
<motion.div
  animate={{ top: 100 }} // Avoid!
  transition={{ duration: 0.2 }}
>
  Don't use top/left
</motion.div>
```

### Scale Transform Best Practices
```jsx
// Overlay scale effect
<motion.div
  whileHover={{
    scale: 1.08,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  className="w-full h-full"
>
  Gallery Item
</motion.div>
```

### Performance Optimization
| Technique | Benefit | Note |
|-----------|---------|------|
| Use `will-change` sparingly | GPU prep | Only on actual animated elements |
| Motion values over state | No re-renders | Updates styles directly |
| Use `translateZ(0)` | Force GPU | For 2D animations on weak devices |
| Stagger animations | Distributes load | Keep ~50-100ms between starts |
| Duration: 200-400ms | Smooth feel | Too fast feels jarring |

### Animation Duration Recommendations
- Hover effects: 150-250ms
- Page transitions: 300-500ms
- Celebration animations: 600-800ms
- Layout shifts: 200-400ms

### useMotionValue Hook (Advanced)
```jsx
import { useMotionValue, useTransform } from 'framer-motion';

const x = useMotionValue(0);
const opacity = useTransform(x, [0, 100], [1, 0.5]);

// Updates without triggering React re-renders
```

---

## Implementation Roadmap

### Phase 1: Fonts (Week 1)
1. Add preconnect + Google Fonts link to Vite HTML template
2. Update `apps/client/tailwind.config.js` with font family
3. Test font loading (DevTools Network tab)

### Phase 2: Colors (Week 1-2)
1. Extract brand colors from design
2. Convert HEX → OKLCH using tool
3. Update `packages/tailwind-config/client-theme.ts`
4. Add `@supports` wrapper for Windows 7 (if needed)

### Phase 3: Layout (Week 2)
1. Install `react-masonry-css`
2. Implement gallery grid with breakpoint config
3. CSS gutter styling per design system
4. Test responsive behavior

### Phase 4: Animations (Week 3-4)
1. Replace Framer Motion with optimized GPU properties
2. Test on low-end devices (DevTools throttling)
3. Add confetti celebrations (booking confirmation)
4. Implement accessibility checks

---

## Performance Checklist

- [ ] Fonts loaded via preconnect (not @import)
- [ ] `font-display: swap` applied
- [ ] OKLCH colors defined in Tailwind config
- [ ] Fallback colors for Windows 7 (if required)
- [ ] Masonry grid uses CSS flexbox layout
- [ ] Confetti respects `prefers-reduced-motion`
- [ ] Animations use GPU-accelerated properties only
- [ ] No `will-change` on non-animated elements
- [ ] Animation durations 150-500ms
- [ ] Bundle size < 50KB additional

---

## Browser Support Summary

| Feature | Chrome | Firefox | Safari | Edge | Support |
|---------|--------|---------|--------|------|---------|
| OKLCH Colors | 111+ | 113+ | 15.4+ | 111+ | 93% |
| Preconnect | 49+ | 39+ | 10+ | 15+ | 99%+ |
| Font-display | 58+ | 58+ | 11+ | 79+ | 98%+ |
| Canvas-confetti | All | All | All | All | 99%+ |
| Framer Motion | All | All | All | All | 99%+ |
| CSS Masonry | All | All | All | All | 98%+ |

---

## Unresolved Questions

1. **Windows 7 support required?** Impacts OKLCH fallback strategy
2. **Target LCP (Largest Contentful Paint)?** Affects font optimization priority
3. **Mobile device throttling targets?** Influences animation frame budgets
4. **Bundle size SLO?** Constrains library selection
5. **Analytics integration?** For celebration confetti event tracking

---

## References & Resources

### Font Performance
- [Optimizing Google Fonts - WP Rocket](https://docs.wp-rocket.me/article/1312-optimize-google-fonts)
- [Making Google Fonts Faster - Sia Codes](https://sia.codes/posts/making-google-fonts-faster/)
- [Google Fonts Performance Guide](https://googlefonts.3perf.com/)

### OKLCH Colors
- [Tailwind CSS v4 Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [OKLCH.com Color Picker](https://oklch.com/)
- [Using OKLCH in Tailwind - Studio 1902](https://1902.studio/en/journal/using-oklch-colors-in-tailwind-css/)

### React Masonry
- [react-masonry-css GitHub](https://github.com/paulcollett/react-masonry-css)
- [Masonry Layouts in React - LogRocket](https://blog.logrocket.com/create-responsive-masonry-layouts-react-app/)

### Canvas Confetti
- [canvas-confetti GitHub](https://github.com/catdad/canvas-confetti)
- [Canvas Confetti npm Package](https://www.npmjs.com/package/canvas-confetti)

### Framer Motion
- [Motion Documentation](https://www.framer.com/motion/)
- [Animation Performance Guide](https://motion.dev/docs/performance)
- [GPU Acceleration Best Practices - StartupHouse](https://startup-house.com/blog/mastering-framer-motion)

---

**Report Status**: Complete
**Confidence Level**: High (sourced from official docs & community research)
**Last Updated**: 2026-02-16
