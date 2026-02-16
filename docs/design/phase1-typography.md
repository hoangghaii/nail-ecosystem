# Phase 1 Typography System

**Last Updated**: 2026-02-16
**Phase**: 1 - Design Foundation

---

## Font Families

```css
--font-sans: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;
--font-serif: "Playfair Display", ui-serif, Georgia, serif;
```

---

## Font Loading Optimization

**Preconnect** for faster font loading (in `apps/client/index.html`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Font Weights Loaded**:
- **Be Vietnam Pro**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Playfair Display**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

---

## Typography Hierarchy

### Headings (Playfair Display - Serif)

```css
/* H1 - Hero sections, page titles */
.text-h1 {
  @apply font-serif text-5xl lg:text-6xl font-bold tracking-tight text-foreground;
}

/* H2 - Section headers */
.text-h2 {
  @apply font-serif text-4xl lg:text-5xl font-semibold text-foreground;
}

/* H3 - Subsection headers */
.text-h3 {
  @apply font-serif text-2xl lg:text-3xl font-semibold text-foreground;
}

/* H4 - Card headers, smaller sections */
.text-h4 {
  @apply font-serif text-xl lg:text-2xl font-semibold text-foreground;
}
```

### Body Text (Be Vietnam Pro - Sans)

```css
/* Large body - Intros, lead paragraphs */
.text-body-large {
  @apply font-sans text-base lg:text-lg leading-relaxed text-muted-foreground;
}

/* Default body - Main content */
.text-body {
  @apply font-sans text-base leading-relaxed text-muted-foreground;
}

/* Small body - Captions, helper text */
.text-body-small {
  @apply font-sans text-sm text-muted-foreground;
}
```

### Base Styles

All headings automatically use serif font:

```css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif text-foreground;
  }

  body {
    @apply font-sans text-foreground;
  }
}
```

---

## Usage Guidelines

### When to Use Serif (Playfair Display)

**Use for**:
- All headings (h1-h6)
- Page titles
- Section headers
- Hero text
- Emphasis on elegance

**Example**:

```tsx
<h1 className="text-h1">Welcome to Pink. Nails</h1>
<h2 className="text-h2">Our Services</h2>
<h3 className="text-h3">Manicure & Pedicure</h3>
```

### When to Use Sans (Be Vietnam Pro)

**Use for**:
- Body text
- Paragraphs
- Navigation
- Buttons
- Form labels
- UI elements

**Example**:

```tsx
<p className="text-body">
  Experience luxury nail care in a warm, welcoming environment.
</p>
<button className="btn-primary font-sans">Book Appointment</button>
```

---

## Responsive Typography

**Mobile-First Approach**: Start with smaller sizes, scale up with `lg:` breakpoint.

```tsx
/* Mobile: text-5xl (48px), Desktop: text-6xl (60px) */
<h1 className="text-5xl lg:text-6xl">

/* Mobile: text-base (16px), Desktop: text-lg (18px) */
<p className="text-base lg:text-lg">
```

**Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Utility Classes

```css
.text-heading      /* Generic heading style (serif, foreground) */
.text-h1          /* Hero/page title */
.text-h2          /* Section header */
.text-h3          /* Subsection header */
.text-h4          /* Card header */
.text-body-large  /* Lead paragraph */
.text-body        /* Default body */
.text-body-small  /* Caption/helper */
```

---

## Vietnamese Language Support

Both fonts fully support Vietnamese diacritical marks:

```
Be Vietnam Pro: Tiếng Việt ✓
Playfair Display: Vietnamese diacritics ✓
```

---

## Font Weight Guidelines

**Playfair Display (Headings)**:
- 400 (Regular): Subtle headers, less emphasis
- 500 (Medium): Default headings
- 600 (Semibold): Section headers (h2-h3)
- 700 (Bold): Hero text (h1), strong emphasis

**Be Vietnam Pro (Body)**:
- 400 (Regular): Body text
- 500 (Medium): Buttons, labels
- 600 (Semibold): Strong labels, emphasis
- 700 (Bold): Rarely used, special emphasis only

---

## Accessibility

**Line Height**: `leading-relaxed` (1.625) for improved readability.

**Contrast**: All text meets WCAG AA standards:
- Warm Sepia on Cream: 8.2:1 (AAA)
- Warm Taupe on Cream: 4.6:1 (AA)

**Font Size**: Minimum 14px (text-sm) for body text, 16px (text-base) preferred.
