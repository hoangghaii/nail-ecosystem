/**
 * Animation Utilities - Motion (Framer Motion) Variants
 *
 * Reusable animation configurations following performance best practices:
 * - GPU-accelerated properties only (scale, opacity, x, y, rotate)
 * - Avoid layout-triggering properties (width, height, top, left)
 * - Respect prefers-reduced-motion for accessibility
 * - Duration: 200-400ms for premium feel
 *
 * @see https://motion.dev/docs/react-quick-start
 */

import type { Transition, Variants } from "motion/react";

/**
 * Check if user prefers reduced motion (accessibility)
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get transition config respecting user motion preferences
 */
export const getTransition = (
  duration: number = 0.3,
  type: "spring" | "tween" = "tween"
): Transition => {
  if (prefersReducedMotion()) {
    return { duration: 0 };
  }

  if (type === "spring") {
    return {
      damping: 30,
      stiffness: 300,
      type: "spring",
    };
  }

  return {
    duration,
    ease: "easeOut",
    type: "tween",
  };
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

/**
 * Page entrance/exit animations
 * Usage: Apply to page wrapper div
 *
 * @example
 * ```tsx
 * <motion.div
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 *   variants={pageVariants}
 *   transition={getTransition(0.4)}
 * >
 *   {children}
 * </motion.div>
 * ```
 */
export const pageVariants: Variants = {
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
  initial: {
    opacity: 0,
    y: 20,
  },
};

/**
 * Fade-in only (no vertical movement)
 * Good for subtle page transitions
 */
export const fadeVariants: Variants = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  initial: { opacity: 0 },
};

/**
 * Slide in from right (good for modal/drawer entrance)
 */
export const slideInRightVariants: Variants = {
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 100,
  },
  initial: {
    opacity: 0,
    x: 100,
  },
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

/**
 * Stagger children animations
 * Apply to parent container, children will animate sequentially
 *
 * @example
 * ```tsx
 * <motion.div variants={staggerContainer} initial="initial" animate="animate">
 *   <motion.div variants={staggerItem}>Item 1</motion.div>
 *   <motion.div variants={staggerItem}>Item 2</motion.div>
 * </motion.div>
 * ```
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  initial: {},
};

/**
 * Stagger item (child of staggerContainer)
 */
export const staggerItem: Variants = {
  animate: {
    opacity: 1,
    y: 0,
  },
  initial: {
    opacity: 0,
    y: 20,
  },
};

/**
 * Fast stagger (50ms delay) - good for lists
 */
export const fastStaggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  initial: {},
};

// ============================================================================
// HOVER & INTERACTION ANIMATIONS
// ============================================================================

/**
 * Hover scale effect (subtle zoom)
 * Apply directly to whileHover/whileTap props
 *
 * @example
 * ```tsx
 * <motion.div
 *   whileHover={{ scale: 1.05 }}
 *   whileTap={{ scale: 0.95 }}
 *   transition={getTransition(0.2)}
 * >
 *   Hover me
 * </motion.div>
 * ```
 */
export const hoverScale = {
  hover: { scale: 1.05 },
  rest: { scale: 1 },
  tap: { scale: 0.95 },
};

/**
 * Strong hover scale for cards/images
 */
export const strongHoverScale = {
  hover: { scale: 1.1 },
  rest: { scale: 1 },
  tap: { scale: 0.98 },
};

/**
 * Button tap animation (scale down on press)
 */
export const tapScale = {
  scale: 0.95,
};

/**
 * Subtle button tap (for large buttons)
 */
export const subtleTapScale = {
  scale: 0.98,
};

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

/**
 * Modal entrance/exit (zoom + fade)
 * Apply to modal content wrapper
 *
 * @example
 * ```tsx
 * <motion.div
 *   initial="hidden"
 *   animate="visible"
 *   exit="hidden"
 *   variants={modalVariants}
 *   transition={getTransition(0.3)}
 * >
 *   Modal content
 * </motion.div>
 * ```
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

/**
 * Modal overlay fade (backdrop)
 */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Drawer slide in from bottom (mobile-friendly)
 */
export const drawerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ============================================================================
// PRESET TRANSITION CONFIGS
// ============================================================================

/**
 * Fast transition (200ms) - hover effects, button taps
 */
export const fastTransition: Transition = {
  duration: 0.2,
  ease: "easeOut",
  type: "tween",
};

/**
 * Base transition (300ms) - default for most animations
 */
export const baseTransition: Transition = {
  duration: 0.3,
  ease: "easeOut",
  type: "tween",
};

/**
 * Slow transition (400ms) - page transitions, modals
 */
export const slowTransition: Transition = {
  duration: 0.4,
  ease: "easeOut",
  type: "tween",
};

/**
 * Spring transition - bouncy, natural feel
 */
export const springTransition: Transition = {
  damping: 30,
  stiffness: 300,
  type: "spring",
};

/**
 * Gentle spring - softer bounce
 */
export const gentleSpringTransition: Transition = {
  damping: 40,
  stiffness: 200,
  type: "spring",
};
