import { motion } from "motion/react";

import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedGallery } from "@/components/home/FeaturedGallery";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { useHomePage } from "@/hooks/useHomePage";
import { getTransition, pageVariants } from "@/utils/animations";

export function HomePage() {
  useHomePage();

  return (
    <motion.div
      animate="animate"
      className="bg-background"
      exit="exit"
      initial="initial"
      transition={getTransition(0.4)}
      variants={pageVariants}
    >
      <HeroSection />
      <ServicesOverview />
      <FeaturedGallery />
      <AboutSection />
    </motion.div>
  );
}
