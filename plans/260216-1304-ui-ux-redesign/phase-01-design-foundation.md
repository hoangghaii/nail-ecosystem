# Phase 01: Design Foundation

**Date**: Weeks 1-2 (2026-02-16 to 2026-02-27)
**Priority**: Critical (P0)
**Status**: ✅ COMPLETED
**Review**: ✅ APPROVED (see reports/260216-qa-agent-to-dev-team-phase1-design-foundation-review.md)

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: None (foundation phase)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md), [researcher-02-technical-stack.md](./research/researcher-02-technical-stack.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md)
- **Next Phase**: [phase-02-component-system.md](./phase-02-component-system.md)

---

## Key Insights

**Design Patterns Research**:
- 2026 trend: Luxury minimalism with warm neutrals (dusty rose, cream, champagne)
- Typography: Serif (Playfair Display) for luxury headers, sans-serif (Be Vietnam Pro) for body
- Borders over shadows for refinement
- Organic shapes with 8-16px rounded corners

**Technical Stack Research**:
- Google Fonts preconnect + font-display: swap = fastest approach
- OKLCH colors for wider gamut (93% browser support)
- Tailwind v4 native support for both
- Font weights needed: 400, 500, 600, 700

---

## Requirements

**Color Palette**:
- Primary: Dusty Rose (#D1948B) - OKLCH conversion required
- Background: Cream (#FDF8F5) - OKLCH conversion required
- Text: Charcoal (#333333)
- Neutrals: Beige/cream/warm gray scale

**Typography**:
- Display/Headers: Playfair Display (serif)
- Body/UI: Be Vietnam Pro (sans-serif)
- Weights: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

**Design Tokens**:
- Border radius scale: 12px, 16px, 20px
- Spacing scale: Tailwind default enhanced
- Shadow system: Soft shadows only (minimal use)
- Transition timing: 200-400ms for premium feel

---

## Architecture

**Approach**: Extend @repo/tailwind-config/client-theme with new design system

**Files to Modify**:
1. `packages/tailwind-config/client-theme.js` - Color palette + typography
2. `apps/client/index.html` - Google Fonts preconnect
3. `apps/client/src/styles/index.css` - Global font family declarations

**Design System Structure**:
```javascript
// Tailwind theme extension
{
  colors: {
    primary: { /* dusty rose scale in OKLCH */ },
    neutral: { /* cream/beige scale in OKLCH */ },
    charcoal: '#333333'
  },
  fontFamily: {
    display: ['Playfair Display', 'serif'],
    body: ['Be Vietnam Pro', 'sans-serif']
  },
  borderRadius: {
    card: '20px',
    input: '12px',
    button: '16px'
  }
}
```

**Performance Considerations**:
- Preconnect reduces font load by ~100ms
- font-display: swap prevents FOIT
- OKLCH colors: 93% browser support, fallback strategy for Windows 7 (if needed)

---

## Related Code Files

**Shared Packages**:
- `/Users/hainguyen/Documents/nail-project/packages/tailwind-config/client-theme.js`
- `/Users/hainguyen/Documents/nail-project/packages/tailwind-config/base.js`

**Client App**:
- `/Users/hainguyen/Documents/nail-project/apps/client/index.html`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/styles/index.css`
- `/Users/hainguyen/Documents/nail-project/apps/client/tailwind.config.ts`

---

## Implementation Steps

1. **Convert HEX colors to OKLCH**
   - Use https://oklch.com/ converter
   - Dusty Rose #D1948B → OKLCH value
   - Cream #FDF8F5 → OKLCH value
   - Generate 50-950 scale for both palettes

2. **Update Tailwind client theme**
   - Modify `packages/tailwind-config/client-theme.js`
   - Add OKLCH color definitions
   - Add font family declarations
   - Add custom border radius tokens
   - Add soft shadow tokens

3. **Add Google Fonts preconnect**
   - Edit `apps/client/index.html`
   - Add preconnect to fonts.googleapis.com and fonts.gstatic.com
   - Add stylesheet link with Playfair Display + Be Vietnam Pro
   - Include font-display=swap parameter

4. **Configure global CSS**
   - Update `apps/client/src/styles/index.css`
   - Set font-display: Playfair Display for headings
   - Set font-body: Be Vietnam Pro for body text
   - Add CSS custom properties for design tokens

5. **Verify Turborepo build**
   - Run `npm run type-check` from root
   - Run `npm run build` to verify Tailwind compilation
   - Check for OKLCH browser support warnings

6. **Test font loading**
   - Open DevTools Network tab
   - Verify fonts load in <200ms with preconnect
   - Check font-display swap behavior

---

## Todo List

- [x] Convert HEX colors to OKLCH (use oklch.com) ✅
- [x] Update packages/tailwind-config/client-theme.js with new palette ✅
- [x] Add font family definitions to client theme ✅
- [x] Add custom border radius tokens ✅
- [x] Add soft shadow tokens (minimal) ✅
- [x] Add Google Fonts preconnect to apps/client/index.html ✅
- [x] Update apps/client/src/styles/index.css with font declarations ✅
- [x] Test font loading performance (DevTools) ✅
- [x] Run npm run type-check (verify no errors) ✅ PASSED
- [x] Run npm run build (verify Tailwind compilation) ✅ PASSED
- [x] Verify OKLCH browser support (93% target) ✅ CONFIRMED
- [ ] Document color palette in design-guidelines.md ⚠️ DEFERRED to Phase 12

---

## Success Criteria

**Technical**:
- [x] All colors defined in OKLCH format ✅
- [x] Fonts load in <200ms (preconnect + swap) ✅
- [x] Tailwind builds without errors ✅
- [x] TypeScript type-check passes ✅
- [x] No console errors in browser ✅

**Design**:
- [x] Color palette matches blueprint (#D1948B, #FDF8F5) ✅
- [x] Typography uses Playfair Display + Be Vietnam Pro ✅
- [x] Border radius tokens create organic feel ✅
- [x] Soft shadows minimal, refined ✅

**Performance**:
- [x] Lighthouse Performance: 95+ maintained ✅
- [x] Font load time: <200ms ✅
- [x] No layout shift from font loading (CLS <0.1) ✅

---

## Risk Assessment

**Low Risk**:
- Google Fonts CDN outage → Self-host as fallback
- OKLCH browser compatibility → 93% support, fallback to sRGB for older browsers

**Mitigation**:
- Add @supports (color: oklch(0 0 0)) for progressive enhancement
- Document self-hosting process in case of CDN issues
- Test on Windows 7 (Chrome 109) if target audience requires

---

## Security Considerations

**N/A** - Design tokens and fonts have no security implications

---

## Next Steps

After completion:
1. Verify design system in isolation (create test page with all tokens)
2. Proceed to [Phase 02: Component System](./phase-02-component-system.md)
3. Apply new tokens to existing components incrementally

---

**Phase Status**: ✅ COMPLETED (2026-02-16)
**Actual Effort**: Implementation complete, review complete
**Blocking**: None
**Review Report**: [260216-qa-agent-to-dev-team-phase1-design-foundation-review.md](./reports/260216-qa-agent-to-dev-team-phase1-design-foundation-review.md)
