import CategoriesSection from "@/components/sections/home/CategoriesSection";
import Hero from "@/components/sections/home/Hero";
import InfoCarousel from "@/components/sections/home/InfoCarousel";

export default function Home() {
  return (
    <>
      <Hero />
      <InfoCarousel />
      <CategoriesSection />
    </>
  );
}
