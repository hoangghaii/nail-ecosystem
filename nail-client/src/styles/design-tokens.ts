export const colors = {
  // Accent - Soft Charcoal (subtle highlights)
  accent: {
    DEFAULT: "oklch(0.45 0 0)", // #5A5A5A - Darker gray for better readability
    foreground: "oklch(0.985 0 0)", // #FAFAFA - Light text
  },

  // Background
  background: "oklch(1 0 0)", // #FFFFFF - Pure white

  // Borders - Light Gray
  border: "oklch(0.922 0 0)", // #E5E5E5 - Light border

  // Primary - Deep Black (for headings, primary elements)
  primary: {
    DEFAULT: "oklch(0.145 0 0)", // #1A1A1A - Rich black
    foreground: "oklch(0.985 0 0)", // #FAFAFA - Off-white text
  },

  // Secondary - Warm Gray (for backgrounds, cards)
  secondary: {
    DEFAULT: "oklch(0.97 0 0)", // #F5F5F5 - Light warm gray
    foreground: "oklch(0.205 0 0)", // #2D2D2D - Dark gray text
  },
} as const;

export const spacing = {
  card: "1.5rem", // 24px - Card padding
  container: "1.5rem", // 24px - Container padding
  section: "5rem", // 80px - Section padding
} as const;

export const borderRadius = {
  "2xl": "24px", // Hero sections, major containers
  lg: "16px", // Cards, containers
  md: "12px", // Buttons, inputs
  sm: "8px", // Small elements (badges, tags)
  xl: "20px", // Large cards
} as const;

// Typography scale
export const typography = {
  body: "text-base text-accent leading-relaxed",
  h1: "text-4xl md:text-5xl lg:text-6xl font-bold text-primary",
  h2: "text-3xl md:text-4xl lg:text-5xl font-semibold text-primary",
  h3: "text-2xl md:text-3xl font-semibold text-primary",
  h4: "text-xl md:text-2xl font-medium text-primary",
  small: "text-sm text-accent",
} as const;
