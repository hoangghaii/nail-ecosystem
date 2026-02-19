import { motion } from "motion/react";

import { AboutSection } from "@/components/home/AboutSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LookbookHighlight } from "@/components/home/LookbookHighlight";
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
      <LookbookHighlight />
      <AboutSection />
      <ServicesOverview />
    </motion.div>
  );
}
