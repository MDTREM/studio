"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Brush, CalendarDays } from "lucide-react";

const bannerItems = [
    {
        icon: <Brush className="h-5 w-5" />,
        text: "Precisando de arte? Temos uma equipe especializada pra atender você",
        bgColor: "bg-white",
        textColor: "text-black"
    },
    {
        icon: <CalendarDays className="h-5 w-5" />,
        text: "AGENDAS 2026 | Personalize e organize o seu ano com praticidade!",
        bgColor: "bg-primary",
        textColor: "text-primary-foreground"
    }
]

export default function TopBanner() {
  return (
    <Carousel
        opts={{
            align: "start",
            loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        orientation="vertical"
        className="w-full h-10"
    >
        <CarouselContent className="-mt-0 h-full">
            {bannerItems.map((item, index) => (
                 <CarouselItem key={index} className="pt-0">
                     <div className={`h-full w-full flex items-center justify-center p-2 text-sm font-medium ${item.bgColor} ${item.textColor}`}>
                        <div className="flex items-center justify-center gap-2">
                            {item.icon}
                            <span>{item.text}</span>
                        </div>
                    </div>
                 </CarouselItem>
            ))}
        </CarouselContent>
    </Carousel>
  );
}
