# Technical Design: Admin ScrollToTopButton Component

**Date**: 2026-02-13
**Component**: ScrollToTopButton for Admin App

---

## Component Specification

### Functional Requirements
- FR1: Appear after user scrolls 300px from top
- FR2: Fixed position bottom-right corner
- FR3: Smooth scroll to top on click
- FR4: Fade in/out with CSS transitions
- FR5: Keyboard accessible with focus states

### Non-Functional Requirements
- NFR1: Performance - throttle scroll events (200ms)
- NFR2: Accessibility - WCAG 2.1 AA compliant
- NFR3: Design - follow admin glassmorphism theme
- NFR4: Responsive - adjust positioning on mobile

---

## Design System Alignment

### Admin Theme
- **Colors**: Blue theme (--primary, --primary-foreground)
- **Shadows**: Box shadows enabled (shadow-lg)
- **Borders**: Subtle (rounded-md)
- **Animations**: CSS transitions (NOT Framer Motion)
- **Typography**: Inter-style sans-serif

### Component Styling
```tsx
// Button styling
<button
  className="fixed bottom-8 right-8 z-50 h-10 w-10 rounded-md bg-primary text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
>
```

### Responsive Adjustments
```tsx
// Mobile: smaller spacing
className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8"
```

---

## Implementation Architecture

### Component Structure
```tsx
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Throttled scroll handler (200ms)
  useEffect(() => {
    let throttleTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (throttleTimeout) return;

      throttleTimeout = setTimeout(() => {
        setIsVisible(window.scrollY > 300);
        throttleTimeout = null;
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="..."
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
```

### CSS Transitions
```css
/* Fade in/out */
.scroll-button {
  opacity: 0;
  transition: opacity 300ms ease-in-out, transform 200ms ease;
}

.scroll-button.visible {
  opacity: 1;
}

/* Or use Tailwind */
transition-all duration-300 ease-in-out
```

---

## Performance Optimization

### Throttle Implementation
```typescript
// Closure-based throttle
let throttleTimeout: NodeJS.Timeout | null = null;

const handleScroll = () => {
  if (throttleTimeout) return;

  throttleTimeout = setTimeout(() => {
    setIsVisible(window.scrollY > 300);
    throttleTimeout = null;
  }, 200);
};
```

**Benefits**:
- Reduces setState calls from ~100/sec to ~5/sec
- Prevents layout thrashing
- Improves performance on low-end devices

### Passive Event Listener
```typescript
window.addEventListener("scroll", handleScroll, { passive: true });
```

**Benefits**:
- Tells browser scroll won't be prevented
- Enables scroll optimization
- Improves scroll performance

---

## Accessibility Implementation

### ARIA Attributes
```tsx
<button
  aria-label="Scroll to top"
  onClick={scrollToTop}
>
```

### Focus States
```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Keyboard Support
- **Space/Enter**: Trigger scroll (native button behavior)
- **Tab**: Focus button (when visible)
- **Esc**: No special handling needed

---

## Testing Strategy

### Unit Tests (Future)
```typescript
describe('ScrollToTopButton', () => {
  it('shows after scrolling 300px', () => {});
  it('hides when at top', () => {});
  it('scrolls to top smoothly on click', () => {});
  it('throttles scroll events', () => {});
});
```

### Manual Tests
1. Scroll down 300px - button appears
2. Scroll to top - button disappears
3. Click button - smooth scroll to top
4. Tab to button - focus ring visible
5. Press Space/Enter - scrolls to top
6. Test on mobile - responsive positioning

---

## Integration Points

### Layout.tsx Modification
```tsx
// Before
export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// After
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
```

---

## Browser Compatibility

### window.scrollTo({ behavior: 'smooth' })
- ✅ Chrome/Edge 61+
- ✅ Firefox 36+
- ✅ Safari 15.4+
- ✅ All modern browsers (2024+)

### CSS Transitions
- ✅ Universal support

### Passive Event Listeners
- ✅ Chrome 51+
- ✅ All modern browsers

---

## Edge Cases

### Case 1: Initial Load at Scroll Position
- **Scenario**: Page loaded via back button with scroll position
- **Solution**: Check scroll on mount
- **Implementation**: Add initial check in useEffect

### Case 2: Rapid Scroll Events
- **Scenario**: User scrolls very fast
- **Solution**: Throttle prevents excessive updates
- **Implementation**: Already covered

### Case 3: Small Viewport Height
- **Scenario**: Page shorter than 300px
- **Solution**: Button never appears (expected behavior)
- **Implementation**: No changes needed

### Case 4: Fixed Positioning with Sidebar
- **Scenario**: Sidebar affects layout
- **Solution**: Fixed position relative to viewport, not parent
- **Implementation**: Works correctly with ml-64 offset

---

## Performance Metrics

### Target Metrics
- Initial render: < 1ms
- Scroll event handling: < 5ms (with throttle)
- Scroll to top animation: ~500ms (smooth)
- Memory footprint: < 1KB

### Monitoring
- Use React DevTools Profiler
- Check scroll event frequency
- Verify no memory leaks on unmount

---

## Comparison: Client vs Admin

| Aspect | Client | Admin |
|--------|--------|-------|
| Animation | Framer Motion | CSS Transitions |
| Button Shape | rounded-full | rounded-md |
| Shadow | shadow-lg | shadow-lg |
| Colors | Warm beige | Blue primary |
| Throttle | ❌ No | ✅ Yes (200ms) |
| Icon Size | size-5 (20px) | h-4 w-4 (16px) |
| Button Size | size-10 md:size-12 | h-10 w-10 |

---

## Future Enhancements

### Phase 2 (Optional)
1. **Scroll Progress Indicator**: Show % scrolled
2. **Hide on Scroll Down**: Only show when scrolling up
3. **Customizable Threshold**: Accept props for scroll threshold
4. **Animation Options**: Support different animation styles

### Phase 3 (Advanced)
1. **Smooth Scroll Polyfill**: For older browsers
2. **Analytics**: Track button usage
3. **A/B Testing**: Test different positions/styles

---

**Design Complete**
**Next**: Implementation phase
