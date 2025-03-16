import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeatureSection from "@/components/home/FeatureSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeatureSection />
      <CategorySection />
      <FeaturedProducts />
    </main>
  );
}
