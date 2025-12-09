import CategoriesSection from "@/components/sections/home/CategoriesSection";
import Hero from "@/components/sections/home/Hero";
import InfoCarousel from "@/components/sections/home/InfoCarousel";
import PrinterBanners from "@/components/sections/home/PrinterBanners";
import FeaturedProducts from "@/components/sections/home/FeaturedProducts";
import BestsellersSection from "@/components/sections/home/BestsellersSection";

export default function Home() {
  return (
    <>
      <Hero />
      <InfoCarousel />
      <CategoriesSection />
      <BestsellersSection />
      <FeaturedProducts />
      <PrinterBanners />
    </>
  );
}
