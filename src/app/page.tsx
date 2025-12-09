import CategoriesSection from "@/components/sections/home/CategoriesSection";
import Hero from "@/components/sections/home/Hero";
import InfoCarousel from "@/components/sections/home/InfoCarousel";
import PrinterBanners from "@/components/sections/home/PrinterBanners";
import PromoBanners from "@/components/sections/home/PromoBanners";
import HomepageSections from "@/components/sections/home/HomepageSections";

export default function Home() {
  return (
    <>
      <Hero />
      <InfoCarousel />
      <PromoBanners />
      <HomepageSections />
      <CategoriesSection />
      <PrinterBanners />
    </>
  );
}
