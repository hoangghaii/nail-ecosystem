import { cn } from "@repo/utils/cn";
import { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  alt: string;
  className?: string;
  placeholderClassName?: string;
  src: string;
  style?: React.CSSProperties;
}

/**
 * LazyImage Component
 *
 * Progressive image loading with IntersectionObserver
 * - Shows placeholder while loading
 * - Loads image only when near viewport
 * - Fade-in transition when loaded
 */
export function LazyImage({
  alt,
  className,
  placeholderClassName,
  src,
  style,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // IntersectionObserver to detect when image enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Error fallback
  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/30 text-muted-foreground text-sm",
          className
        )}
        style={style}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className="relative" style={style}>
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 bg-muted/50 animate-pulse rounded-md",
            placeholderClassName
          )}
        />
      )}

      {/* Actual image (only load when in view) */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
}
