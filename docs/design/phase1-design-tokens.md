# Phase 1 Design Tokens

**Last Updated**: 2026-02-16
**Phase**: 1 - Design Foundation

---

## Border Radius Hierarchy

**The Golden Rule**: Parent container radius > Child element radius

```css
--radius-xl: 2.5rem;  /* 40px - Large sections/containers */
--radius-lg: 2rem;    /* 32px - Medium sections */
--radius-md: 1.5rem;  /* 24px - Cards */
--radius-sm: 0.75rem; /* 12px - Buttons/inputs */
--radius-xs: 0.5rem;  /* 8px - Small elements */
--radius: 1.25rem;    /* 20px - Default/frame elements */
```

### Usage Examples

**Nested Hierarchy**:

```tsx
/* Large container → Medium card → Small button */
<div className="rounded-[32px]">       {/* --radius-lg */}
  <div className="rounded-[24px]">     {/* --radius-md */}
    <button className="rounded-[12px]">{/* --radius-sm */}
      Click Me
    </button>
  </div>
</div>
```

**Image Frames** (border-based design):

```tsx
<div className="frame-gold">           {/* rounded-[20px] border-2 */}
  <img className="frame-image" />      {/* rounded-[16px] */}
</div>
```

### When to Use Each Radius

- **40px (xl)**: Hero sections, page containers
- **32px (lg)**: Section containers, large cards
- **24px (md)**: Cards, panels
- **20px (radius)**: Image frames, bordered containers
- **12px (sm)**: Buttons, inputs, badges
- **8px (xs)**: Small pills, tags

---

## Shadow System (Soft & Minimal)

**IMPORTANT**: Use shadows sparingly - border-based design is preferred.

```css
--shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.08), 0 2px 4px -2px oklch(0 0 0 / 0.05);
--shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.08), 0 4px 6px -4px oklch(0 0 0 / 0.05);
```

### When to Use Shadows

**DO Use Shadows For**:
- Popovers/Dropdowns (elevation): `shadow-md`
- Modals/Dialogs (depth): `shadow-lg`
- Floating action buttons: `shadow-md`

**DON'T Use Shadows For**:
- Cards (use borders instead)
- Buttons (use borders instead)
- Bordered elements (double-styling is heavy)

**Example**:

```tsx
/* ✅ Correct: Card with border, no shadow */
<div className="rounded-[24px] border border-border bg-card p-6">
  Card content
</div>

/* ❌ Wrong: Card with both border and shadow (heavy) */
<div className="rounded-[24px] border shadow-md">...</div>

/* ✅ Correct: Modal with shadow, no border */
<div className="rounded-lg shadow-lg bg-card p-8">
  Modal content
</div>
```

---

## Transition Timings

```css
--transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1); /* Hover states */
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1); /* Default transitions */
--transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1); /* Complex animations */
```

### Usage Guidelines

**Fast (200ms)** - Immediate feedback:
- Button hover states
- Link underlines
- Color changes
- Opacity changes

**Base (300ms)** - Smooth transitions:
- Background changes
- Border color shifts
- Size changes
- Transform transitions

**Slow (400ms)** - Complex animations:
- Multi-property transitions
- Layout shifts
- Enter/exit animations
- Modal open/close

### Examples

```tsx
/* Fast hover feedback */
<button className="transition-colors duration-200 hover:bg-primary/90">
  Hover Me
</button>

/* Smooth background transition */
<div className="transition-all duration-300 hover:bg-muted">
  Interactive Card
</div>

/* Complex animation */
<div className="transition-all duration-400 data-[state=open]:opacity-100 data-[state=closed]:opacity-0">
  Animated Content
</div>
```

---

## Spacing Scale

Using Tailwind's default spacing:

```css
/* Common spacing values */
0.25rem (4px)   /* gap-1, p-1 */
0.5rem  (8px)   /* gap-2, p-2 */
0.75rem (12px)  /* gap-3, p-3 */
1rem    (16px)  /* gap-4, p-4 */
1.5rem  (24px)  /* gap-6, p-6 */
2rem    (32px)  /* gap-8, p-8 */
3rem    (48px)  /* gap-12, p-12 */
```

### Usage Patterns

**Tight spacing** (4px-8px):
- Icon-text gaps
- Badge padding
- Stacked elements

**Standard spacing** (12px-16px):
- Button padding
- Input padding
- Card inner spacing

**Generous spacing** (24px-48px):
- Section padding
- Card container padding
- Layout margins

---

## Container Utilities

Pre-defined container patterns:

```css
.container-section {
  @apply rounded-[32px] border border-border bg-background p-8;
}

.container-card {
  @apply rounded-[24px] border border-border bg-card p-6;
}
```

**Usage**:

```tsx
<section className="container-section">
  Section content
</section>

<div className="container-card">
  Card content
</div>
```

---

## Frame Utilities (Border-Based Design)

```css
.frame-gold {
  @apply rounded-[20px] border-2 border-secondary p-2 bg-card;
}

.frame-primary {
  @apply rounded-[20px] border-2 border-primary p-2 bg-card;
}

.frame-image {
  @apply rounded-[16px] w-full h-full object-cover;
}
```

**Usage**:

```tsx
/* Gold-framed image */
<div className="frame-gold">
  <img src="gallery.jpg" className="frame-image" alt="Gallery" />
</div>

/* Primary-framed image */
<div className="frame-primary">
  <img src="featured.jpg" className="frame-image" alt="Featured" />
</div>
```

**Note**: Frame outer radius (20px) > image radius (16px) maintains visual hierarchy.

---

## Button Utilities

```css
.btn-base {
  @apply inline-flex items-center justify-center rounded-[12px]
         font-sans font-medium transition-colors duration-200
         disabled:opacity-50 focus-visible:outline-none
         focus-visible:ring-2 focus-visible:ring-primary
         focus-visible:ring-offset-2;
}

.btn-primary {
  @apply btn-base bg-primary text-primary-foreground hover:bg-primary/90;
}

.btn-secondary {
  @apply btn-base bg-secondary text-secondary-foreground hover:bg-secondary/90;
}

.btn-outline {
  @apply btn-base border border-border bg-background hover:bg-muted;
}
```

**Usage**:

```tsx
<button className="btn-primary px-6 py-3">Book Now</button>
<button className="btn-secondary px-6 py-3">Learn More</button>
<button className="btn-outline px-6 py-3">View Gallery</button>
```

---

## Focus Ring Standard

All interactive elements use consistent focus styling:

```css
.focus-ring {
  @apply focus-visible:outline-none
         focus-visible:ring-2
         focus-visible:ring-primary
         focus-visible:ring-offset-2;
}
```

**Applied to**:
- Buttons
- Links
- Inputs
- Interactive cards
- Custom controls

**Example**:

```tsx
<a href="#" className="focus-ring">Navigation Link</a>
<input className="focus-ring" />
<button className="btn-primary"> {/* focus-ring included */}
```
