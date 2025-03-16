import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FeatureSection from "@/components/home/FeatureSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeatureSection />
      <CategorySection />
      <FeaturedProducts />
      <TestimonialsSection />
    </main>
  );
}
