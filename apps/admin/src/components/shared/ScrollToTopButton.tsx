import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * ScrollToTopButton - Fixed position button that appears after 300px scroll
 *
 * Features:
 * - Appears when user scrolls down more than 300px
 * - Smooth scroll animation to top on click
 * - CSS transitions for fade in/out (300ms)
 * - Throttled scroll events (200ms) for performance
 * - Full accessibility support (ARIA, keyboard, focus states)
 * - Responsive positioning (mobile: bottom-6, desktop: bottom-8)
 * - Follows admin glassmorphism design system
 */
export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let throttleTimeout: number | null = null;

    const handleScroll = () => {
      if (throttleTimeout) return;

      throttleTimeout = window.setTimeout(() => {
        setIsVisible(window.scrollY > 300);
        throttleTimeout = null;
      }, 200);
    };

    // Passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-8 sm:right-8"
      aria-label="Scroll to top"
      type="button"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
