import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import OurPromise from "@/components/home/OurPromise";
import Testimonials from "@/components/home/Testimonials";
import StoreLocations from "@/components/home/StoreLocations";
import FaqSection from "@/components/home/FaqSection";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <OurPromise />
      <Testimonials />
      <StoreLocations />
      <FaqSection />
      <Newsletter />
    </>
  );
}
