import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SpecialOfferBanner from "@/components/home/SpecialOfferBanner";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <SpecialOfferBanner />
      <NewArrivals />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
