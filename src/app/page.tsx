import CategoriesSection from "@/components/sections/home/CategoriesSection";
import Hero from "@/components/sections/home/Hero";
import InfoCarousel from "@/components/sections/home/InfoCarousel";
import PrinterBanners from "@/components/sections/home/PrinterBanners";
import PromoBanners from "@/components/sections/home/PromoBanners";
import FeaturedProducts from "@/components/sections/home/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Hero />
      <InfoCarousel />
      <PromoBanners />
      <FeaturedProducts />
      <CategoriesSection />
      <PrinterBanners />
    </>
  );
}
