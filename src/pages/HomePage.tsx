import { Hero } from "@/components/landing/Hero";
import { CategorySection } from "@/components/landing/CategorySection";
import { ProductSection } from "@/components/landing/ProductSection";
import { PromoBanner } from "@/components/landing/PromoBanner";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { Newsletter } from "@/components/landing/Newsletter";

export function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <ProductSection />
      <PromoBanner />
      <BenefitsSection />
      <Newsletter />
    </>
  );
}
