"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay";

const banners = [
    {
        desktop: "https://i.imgur.com/1RGGAIM.png",
        mobile: "https://i.imgur.com/oqKW2Se.png",
        alt: "Novo banner principal",
    },
    {
        desktop: "https://i.imgur.com/T0wPi26.png",
        mobile: "https://i.imgur.com/DHLrPss.png",
        alt: "Banner secundário",
    },
]

export default function Hero() {
  return (
    <section className="relative w-full md:h-[60vh] bg-black">
         <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 5000,
                }),
            ]}
            className="w-full h-full"
        >
            <CarouselContent>
                {banners.map((banner, index) => (
                    <CarouselItem key={index} className="p-0">
                         {/* Imagem para Mobile */}
                        <div className="md:hidden relative w-full aspect-square">
                            <Image
                            src={banner.mobile}
                            alt={banner.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            />
                        </div>
                        {/* Imagem para Desktop */}
                        <div className="hidden md:block relative w-full h-full">
                            <Image
                            src={banner.desktop}
                            alt={banner.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    </section>
  );
}

    