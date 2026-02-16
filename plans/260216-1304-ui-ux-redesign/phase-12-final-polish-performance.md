# Phase 12: Final Polish & Performance

**Date**: Weeks 23-24 (2026-07-18 to 2026-07-31)
**Priority**: Critical (P0)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 11: Contact Page Redesign](./phase-11-contact-page-redesign.md)
- **Research**: All research reports
- **Docs**: [code-standards.md](/Users/hainguyen/Documents/nail-project/docs/code-standards.md)

---

## Overview

Final phase: Cross-browser testing, performance optimization, accessibility audit, SEO, launch prep.

**Goals**:
- Lighthouse Performance: ≥95
- Lighthouse Accessibility: 100
- Zero critical bugs
- Production-ready

---

## Requirements

**Performance Targets**:
- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 95+
- Page load time: <2s on 4G
- CLS: <0.1, FID: <100ms, LCP: <2.5s

**Browser Support**:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Accessibility**: WCAG AA compliance

---

## Architecture

**Optimization Strategy**:
1. Code splitting (lazy load pages)
2. Image optimization (lazy loading, explicit dimensions)
3. Font optimization (already using preconnect + swap)
4. Bundle size reduction

**Testing Tools**:
- Lighthouse (Chrome DevTools)
- axe DevTools (accessibility)
- BrowserStack (cross-browser)
- React DevTools Profiler

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/vite.config.ts`
- `/Users/hainguyen/Documents/nail-project/apps/client/index.html`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/App.tsx`
- Various components (optimization)

---

## Implementation Steps

### 1. Performance Optimization

**Code Splitting**:
```tsx
// apps/client/src/App.tsx
import { lazy, Suspense } from 'react';

const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/gallery" element={<GalleryPage />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/contact" element={<ContactPage />} />
  </Routes>
</Suspense>
```

**Image Optimization**:
- Verify all images have `loading="lazy"`
- Add explicit width/height to prevent CLS
- Use Cloudinary responsive transforms (already in place)

**Bundle Analysis**:
```bash
npm run build --workspace=client -- --analyze
```

### 2. Accessibility Audit

**Run axe DevTools**:
- Install axe DevTools extension
- Run on all pages
- Fix critical/serious issues

**Common Fixes**:
- [ ] All images have alt text
- [ ] Form labels properly associated
- [ ] Focus indicators visible
- [ ] Color contrast ≥4.5:1 (WCAG AA)
- [ ] Keyboard navigation works
- [ ] ARIA labels on icon-only buttons
- [ ] Heading hierarchy (h1 → h2 → h3)

**Screen Reader Testing**:
- [ ] VoiceOver (macOS/iOS)
- [ ] NVDA (Windows)
- [ ] TalkBack (Android)

### 3. Cross-Browser Testing

**Test on**:
- [ ] Chrome (latest) - Primary
- [ ] Safari (latest) - Check webkit prefixes
- [ ] Firefox (latest) - Check backdrop-filter
- [ ] Edge (latest) - Check flexbox quirks
- [ ] Mobile Safari (iOS) - Touch interactions
- [ ] Chrome Mobile (Android) - Performance

**Known Issues to Check**:
- Safari: Motion animations may need prefixes
- Firefox: backdrop-filter support
- Edge: Flexbox quirks

### 4. Lighthouse Audit

**Run on All Pages**:
- [ ] HomePage
- [ ] GalleryPage
- [ ] BookingPage
- [ ] ServicesPage
- [ ] ContactPage

**Target Scores**:
- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 95+

**Common Optimizations**:
- Eliminate render-blocking resources
- Properly size images
- Minimize main-thread work
- Reduce JavaScript execution time

### 5. SEO Optimization

**Update Meta Tags** (`apps/client/index.html`):
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Pink Nail Art Studio - Nail art cao cấp tại TP.HCM. Chuyên vẽ 3D, tráng gương, đính đá. Đặt lịch online ngay." />
  <meta name="keywords" content="nail art, nail salon, vẽ móng, đắp móng, TP.HCM, Pink Nail" />

  <!-- Open Graph -->
  <meta property="og:title" content="Pink. Nail Art Studio | Nơi Bộ Móng Trở Thành Tác Phẩm" />
  <meta property="og:description" content="Nail art studio cao cấp - Nơi sự sáng tạo gặp gỡ nghệ thuật" />
  <meta property="og:image" content="/og-image.jpg" />
  <meta property="og:type" content="website" />

  <title>Pink. Nail Art Studio | Nail Art Cao Cấp TP.HCM</title>

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png" />
</head>
```

### 6. Error Handling

**Error Boundaries**:
```tsx
// apps/client/src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl">Oops!</h1>
            <p className="text-muted-foreground">Something went wrong.</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 7. Final Checklist

**Functional**:
- [ ] All console errors/warnings resolved
- [ ] No dead links (run link checker)
- [ ] Forms submit successfully
- [ ] Booking flow end-to-end works
- [ ] Gallery filters functional
- [ ] Navigation works correctly

**Responsive**:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12/13)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1440px (Desktop)

**Performance**:
- [ ] Bundle size <500KB initial load
- [ ] Time to Interactive <3s on 4G
- [ ] No jank (animations 60fps)

**Accessibility**:
- [ ] No axe violations
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus visible

---

## Todo List

### Performance
- [ ] Implement code splitting (lazy load pages)
- [ ] Verify all images have loading="lazy"
- [ ] Add explicit width/height to images
- [ ] Run bundle analyzer
- [ ] Optimize bundle size (<500KB)

### Accessibility
- [ ] Run axe DevTools on all pages
- [ ] Fix critical accessibility issues
- [ ] Verify alt text on all images
- [ ] Test keyboard navigation
- [ ] Test with VoiceOver
- [ ] Test with NVDA
- [ ] Verify color contrast ≥4.5:1
- [ ] Check heading hierarchy

### Cross-Browser
- [ ] Test on Chrome (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Edge (latest)
- [ ] Test on Mobile Safari
- [ ] Test on Chrome Mobile
- [ ] Document known issues

### Lighthouse
- [ ] Run Lighthouse on HomePage
- [ ] Run Lighthouse on GalleryPage
- [ ] Run Lighthouse on BookingPage
- [ ] Run Lighthouse on ServicesPage
- [ ] Run Lighthouse on ContactPage
- [ ] Achieve Performance ≥95 on all pages
- [ ] Achieve Accessibility 100 on all pages

### SEO
- [ ] Add meta description
- [ ] Add meta keywords
- [ ] Add Open Graph tags
- [ ] Add favicon
- [ ] Verify title tags
- [ ] Create sitemap (optional)

### Quality
- [ ] Implement ErrorBoundary
- [ ] Create 404 page
- [ ] Resolve all console errors
- [ ] Run link checker
- [ ] Test all forms
- [ ] Test booking end-to-end
- [ ] Test gallery filtering

### Documentation
- [ ] Update README.md
- [ ] Document deployment steps
- [ ] Create handoff doc
- [ ] Screenshot Lighthouse scores

---

## Success Criteria

**Performance**:
- [ ] Lighthouse Performance: ≥95 (all pages)
- [ ] Bundle size: <500KB initial
- [ ] Time to Interactive: <3s on 4G
- [ ] CLS: <0.1, FID: <100ms, LCP: <2.5s

**Accessibility**:
- [ ] Lighthouse Accessibility: 100 (all pages)
- [ ] Zero axe violations (critical/serious)
- [ ] Keyboard navigation: 100%
- [ ] Screen reader compatible

**Quality**:
- [ ] Zero critical bugs
- [ ] All features functional
- [ ] Cross-browser compatible
- [ ] Mobile responsive (320px+)

**Deliverables**:
- [ ] Lighthouse reports (all pages)
- [ ] Accessibility audit report
- [ ] Cross-browser compatibility matrix
- [ ] Deployment checklist
- [ ] Handoff documentation

---

## Risk Assessment

**Medium Risk**:
- Lighthouse scores may require multiple optimization rounds
- Browser compatibility issues may emerge late

**Mitigation**:
- Start testing early in phase
- Allocate buffer time for fixes
- Document workarounds for browser quirks

---

## Security Considerations

**Production Checklist**:
- [ ] Environment variables configured (.env)
- [ ] API endpoints use HTTPS
- [ ] No sensitive data in client bundle
- [ ] Google Maps API key restricted to domain

---

## Next Steps

After completion:
1. **Deployment**: Deploy to production
2. **Monitoring**: Set up error tracking (Sentry - optional)
3. **Analytics**: Add analytics if needed (future)
4. **Handoff**: Provide documentation to stakeholders

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 11 completion required

---

## Deliverables

### Lighthouse Reports
- Screenshot showing scores ≥95 Performance, 100 Accessibility
- JSON export for baseline comparison

### Accessibility Report
- axe DevTools audit results
- Screen reader testing notes
- WCAG compliance checklist

### Browser Compatibility Matrix
| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome  | Latest  | ✅ Pass | No issues |
| Safari  | Latest  | ✅ Pass | - |
| Firefox | Latest  | ✅ Pass | - |
| Edge    | Latest  | ✅ Pass | - |
| iOS Safari | Latest | ✅ Pass | - |
| Chrome Mobile | Latest | ✅ Pass | - |

### Deployment Checklist
- [ ] Build passes (`npm run build`)
- [ ] Environment variables configured
- [ ] Docker images built
- [ ] Production URLs configured
- [ ] Analytics configured (if needed)
- [ ] Error tracking configured (if needed)
- [ ] Backup created

---

**End of Implementation Plan**
