import AgendasSection from "@/components/sections/home/AgendasSection";
import BestsellersSection from "@/components/sections/home/BestsellersSection";
import CategoriesSection from "@/components/sections/home/CategoriesSection";
import Hero from "@/components/sections/home/Hero";
import InfoCarousel from "@/components/sections/home/InfoCarousel";
import PromoBanners from "@/components/sections/home/PromoBanners";

export default function Home() {
  return (
    <>
      <Hero />
      <InfoCarousel />
      <PromoBanners />
      <BestsellersSection />
      <CategoriesSection />
      <AgendasSection />
    </>
  );
}
