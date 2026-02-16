/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Phase 1 Design Foundation - Dusty Rose Palette (#D1948B)
        primary: {
          50: 'oklch(0.9650 0.0150 28.44)',  // Very light dusty rose
          100: 'oklch(0.9300 0.0300 28.44)', // Light dusty rose
          200: 'oklch(0.8800 0.0450 28.44)', // Lighter dusty rose
          300: 'oklch(0.8200 0.0600 28.44)', // Light-mid dusty rose
          400: 'oklch(0.7700 0.0680 28.44)', // Mid-light dusty rose
          500: 'oklch(0.7236 0.0755 28.44)', // Blueprint Dusty Rose #D1948B
          600: 'oklch(0.6500 0.0755 28.44)', // Mid-dark dusty rose
          700: 'oklch(0.5500 0.0700 28.44)', // Dark dusty rose
          800: 'oklch(0.4500 0.0600 28.44)', // Darker dusty rose
          900: 'oklch(0.3500 0.0450 28.44)', // Very dark dusty rose
          950: 'oklch(0.2800 0.0300 28.44)', // Deepest dusty rose
        },
        // Phase 1 Design Foundation - Cream/Neutral Palette (#FDF8F5)
        neutral: {
          50: 'oklch(0.9900 0.0020 53.45)',  // Purest cream
          100: 'oklch(0.9821 0.0067 53.45)', // Blueprint Cream #FDF8F5
          200: 'oklch(0.9500 0.0100 53.45)', // Light cream
          300: 'oklch(0.9000 0.0150 53.45)', // Cream
          400: 'oklch(0.8500 0.0200 53.45)', // Mid cream
          500: 'oklch(0.8000 0.0250 53.45)', // Warm beige
          600: 'oklch(0.7000 0.0250 53.45)', // Warm taupe
          700: 'oklch(0.6000 0.0200 53.45)', // Darker taupe
          800: 'oklch(0.5000 0.0150 53.45)', // Deep taupe
          900: 'oklch(0.4000 0.0100 53.45)', // Very dark taupe
          950: 'oklch(0.3500 0.0050 53.45)', // Deepest taupe
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        input: '12px',
        button: '16px',
      },
    },
  },
};
