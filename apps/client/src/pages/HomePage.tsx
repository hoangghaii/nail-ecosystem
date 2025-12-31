import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedGallery } from "@/components/home/FeaturedGallery";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { useHomePage } from "@/hooks/useHomePage";

export function HomePage() {
  useHomePage();

  return (
    <div className="bg-background">
      <HeroSection />
      <ServicesOverview />
      <FeaturedGallery />
      <AboutSection />
    </div>
  );
}
