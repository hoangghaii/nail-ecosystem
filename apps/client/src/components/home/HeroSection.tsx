import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { usePrimaryBanner, useBanners } from "@/hooks/api/useBanners";
import { useHeroSettings } from "@/hooks/api/useHeroSettings";

import { HeroCarouselMode } from "./hero-carousel-mode";
import { HeroImageMode } from "./hero-image-mode";
import { HeroVideoMode } from "./hero-video-mode";

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch hero settings and banners
  const { data: settings, isLoading: settingsLoading } = useHeroSettings();
  const { data: primaryBanner, isLoading: primaryLoading } = usePrimaryBanner();
  const { data: allBanners = [], isLoading: bannersLoading } = useBanners();

  const isLoading = settingsLoading || primaryLoading || bannersLoading;

  // Display mode from settings (default to 'video')
  const displayMode = settings?.displayMode || "video";
  const carouselInterval = settings?.carouselInterval || 5000;
  const showControls = settings?.showControls !== false;

  // Determine which banners to show
  const banners =
    displayMode === "carousel"
      ? allBanners
      : primaryBanner
        ? [primaryBanner]
        : [];

  // Auto-advance carousel
  useEffect(() => {
    if (displayMode !== "carousel" || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, carouselInterval);

    return () => clearInterval(timer);
  }, [displayMode, banners.length, carouselInterval]);

  // Reset currentSlide if out of bounds (when banners array changes)
  useEffect(() => {
    if (currentSlide >= banners.length && banners.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSlide(0);
    }
  }, [banners.length, currentSlide]);

  // Loading state
  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // No banners fallback
  if (banners.length === 0) {
    return (
      <section className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Chăm Sóc Móng Cao Cấp
            </h1>
            <p className="mt-4 text-muted-foreground">
              Trải nghiệm nghệ thuật làm móng đẹp
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];

  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20">
      {/* Large Organic Blob Background */}
      <motion.div
        className="absolute -top-32 left-0 right-0 h-[300px] md:h-[550px] bg-muted/40"
        style={{ clipPath: "ellipse(120% 100% at 50% 0%)" }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Hero Content - Horizontal Layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 items-center">
          {/* Left: Content & CTAs */}
          <motion.div
            className="order-1 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="font-sans text-base md:text-lg text-secondary font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Nơi Vẻ Đẹp Gặp Gỡ Nghệ Thuật
            </motion.p>

            <motion.h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              Chăm Sóc Móng Cao Cấp
            </motion.h1>

            <motion.p
              className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              Trải nghiệm nghệ thuật làm móng đẹp với các chuyên viên giàu kinh
              nghiệm và sản phẩm cao cấp. Bộ móng hoàn hảo đang chờ đón bạn.
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 items-center justify-center sm:flex-row sm:gap-4 lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Link to="/booking" className="w-full sm:w-auto">
                <Button
                  size="default"
                  className="h-12 w-full min-w-[160px] rounded-full text-sm font-semibold sm:w-auto md:h-14 md:min-w-[180px] md:text-base"
                >
                  Đặt Lịch Ngay
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="default"
                  className="h-12 w-full min-w-[160px] rounded-full text-sm font-semibold sm:w-auto md:h-14 md:min-w-[180px] md:text-base"
                >
                  Xem Dịch Vụ
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Hero Media */}
          <motion.div
            className="order-2 lg:order-2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative rounded-[24px] border-2 border-primary bg-card p-2 md:rounded-[32px] md:border-4 lg:rounded-[40px] lg:border-4"
              animate={{
                borderColor: isPlaying
                  ? "var(--color-secondary)"
                  : "var(--color-primary)",
                scale: isPlaying ? 1.05 : 1,
              }}
              whileHover={{
                borderColor: "var(--color-secondary)",
                scale: isPlaying ? 1.05 : 1.02,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="overflow-hidden rounded-[20px] md:rounded-[28px] lg:rounded-[32px]">
                <AnimatePresence mode="wait">
                  {displayMode === "image" && (
                    <HeroImageMode banner={currentBanner} />
                  )}

                  {displayMode === "video" && (
                    <HeroVideoMode
                      banner={currentBanner}
                      showControls={showControls}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}

                  {displayMode === "carousel" && (
                    <HeroCarouselMode
                      banners={banners}
                      currentSlide={currentSlide}
                      showControls={false}
                      onNext={() =>
                        setCurrentSlide((prev) => (prev + 1) % banners.length)
                      }
                      onPrev={() =>
                        setCurrentSlide(
                          (prev) =>
                            (prev - 1 + banners.length) % banners.length,
                        )
                      }
                      onSlideSelect={setCurrentSlide}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
