# Phase 1 Color Palette - OKLCH Format

**Last Updated**: 2026-02-16
**Phase**: 1 - Design Foundation
**Browser Support**: OKLCH format supported by 93%+ modern browsers

---

## Primary Colors

```css
/* Dusty Rose - Primary brand color */
--color-dusty-rose: oklch(0.7236 0.0755 28.44); /* #D1948B */

/* Cream - Background base */
--color-cream: oklch(0.9821 0.0067 53.45); /* #FDF8F5 */

/* White - Card backgrounds */
--color-white: oklch(1 0 0); /* #FFFFFF */
```

---

## Supporting Colors

```css
/* Soft Gold - Secondary/accent */
--color-soft-gold: oklch(0.7706 0.0641 70.6); /* #CFAE88 */

/* Warm Sepia - Primary text */
--color-warm-sepia: oklch(0.3791 0.0153 17.85); /* #4A3F3F */

/* Warm Taupe - Secondary text */
--color-warm-taupe: oklch(0.5399 0.0164 17.67); /* #786B6B */

/* Pale Pink - Borders/muted backgrounds */
--color-pale-pink: oklch(0.9002 0.0211 43.84); /* #EBDAD3 */
```

---

## Semantic Mappings

```css
--background: var(--color-cream);         /* Page background */
--foreground: var(--color-warm-sepia);    /* Primary text */
--card: var(--color-white);               /* Card backgrounds */
--card-foreground: var(--color-warm-sepia);
--primary: var(--color-dusty-rose);       /* Primary actions */
--primary-foreground: var(--color-white);
--secondary: var(--color-soft-gold);      /* Secondary actions */
--secondary-foreground: var(--color-warm-sepia);
--muted: var(--color-pale-pink);          /* Muted backgrounds */
--muted-foreground: var(--color-warm-taupe);
--accent: var(--color-soft-gold);         /* Accent elements */
--accent-foreground: var(--color-warm-sepia);
--border: var(--color-pale-pink);         /* Border color */
--input: var(--color-pale-pink);          /* Input borders */
--ring: var(--color-dusty-rose);          /* Focus rings */
--destructive: oklch(0.577 0.245 27.325); /* Error red */
--destructive-foreground: var(--color-white);
```

---

## Usage Guidelines

### When to Use Each Color

**Dusty Rose** (`--color-dusty-rose`):
- Primary CTA buttons
- Active states
- Focus rings
- Brand highlights

**Cream** (`--color-cream`):
- Page backgrounds
- Section backgrounds
- Subtle fill colors

**White** (`--color-white`):
- Card backgrounds
- Content containers
- Modal overlays

**Soft Gold** (`--color-soft-gold`):
- Secondary buttons
- Accent borders (frames)
- Hover states
- Decorative elements

**Warm Sepia** (`--color-warm-sepia`):
- Headings
- Body text (primary)
- Icons (primary)

**Warm Taupe** (`--color-warm-taupe`):
- Secondary text
- Muted content
- Placeholder text

**Pale Pink** (`--color-pale-pink`):
- Borders
- Dividers
- Muted backgrounds
- Input borders

---

## Why OKLCH?

**Perceptually Uniform**: Unlike RGB/HSL, OKLCH maintains consistent perceived lightness across different hues.

**Wider Color Gamut**: Access to more vibrant colors beyond sRGB, future-proofing for HDR displays.

**Predictable Adjustments**: Changing lightness/chroma produces expected visual results.

**Browser Support**: Supported by Chrome 111+, Safari 15.4+, Firefox 113+ (93%+ coverage).

---

## Future Color Scales

Phase 2+ will introduce full 50-950 scales:

```css
/* Example: Dusty Rose scale (future) */
--dusty-rose-50: oklch(0.98 0.01 28.44);
--dusty-rose-100: oklch(0.95 0.02 28.44);
--dusty-rose-200: oklch(0.90 0.03 28.44);
/* ... */
--dusty-rose-500: oklch(0.7236 0.0755 28.44); /* Current primary */
/* ... */
--dusty-rose-900: oklch(0.35 0.05 28.44);
--dusty-rose-950: oklch(0.25 0.03 28.44);
```

This will enable:
- Hover/active state variations
- Gradient backgrounds
- Accent color variations
- Accessibility-compliant contrast ratios
