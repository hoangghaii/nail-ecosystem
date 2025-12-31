import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-16 lg:py-20">
      {/* Large Organic Blob Background */}
      <motion.div
        className="absolute -top-32 left-0 right-0 h-[300px] md:h-[550px] bg-muted/40"
        style={{
          clipPath: "ellipse(120% 100% at 50% 0%)",
        }}
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
            {/* Tagline */}
            <motion.p
              className="font-sans text-base md:text-lg text-secondary font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Nơi Vẻ Đẹp Gặp Gỡ Nghệ Thuật
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              Chăm Sóc Móng Cao Cấp
            </motion.h1>

            {/* Description */}
            <motion.p
              className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              Trải nghiệm nghệ thuật làm móng đẹp với các chuyên viên giàu kinh
              nghiệm và sản phẩm cao cấp. Bộ móng hoàn hảo đang chờ đón bạn.
            </motion.p>

            {/* CTA Buttons */}
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

          {/* Right: Hero Video */}
          <motion.div
            className="order-2 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Video container with primary border */}
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
              {/* Hero Video */}
              <div className="overflow-hidden rounded-[20px] md:rounded-[28px] lg:rounded-[32px]">
                <video
                  className="aspect-[4/3] h-auto w-full object-cover"
                  controls
                  preload="metadata"
                  poster="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&h=800&fit=crop"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
