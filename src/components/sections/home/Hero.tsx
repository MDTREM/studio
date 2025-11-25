"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh]">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[60vh] md:h-[80vh] bg-primary flex items-center justify-center">
                <h1 className="text-4xl font-bold text-primary-foreground">Banner</h1>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {api?.scrollSnapList().map((_, index) => (
            <button key={index} onClick={() => api.scrollTo(index)} className={cn(
                "w-2 h-2 rounded-full",
                current === index + 1 ? "bg-white" : "bg-white/50"
            )}></button>
        ))}
      </div>
    </section>
  );
}
