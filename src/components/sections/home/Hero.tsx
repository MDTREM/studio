"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Phone } from "lucide-react";

const heroBanners = PlaceHolderImages.filter(img => img.id.startsWith("hero-banner"));

const heroContent = [
    {
        title: "Black Friday com até 50% OFF!",
        description: "Aproveite nossas ofertas imperdíveis em todo o site. Renove seus materiais gráficos com qualidade e economia.",
        image: heroBanners[0],
    },
    {
        title: "Feliz Natal e um Próspero Ano Novo!",
        description: "Celebre as festas de fim de ano com materiais personalizados. Cartões, brindes e muito mais para sua empresa brilhar.",
        image: heroBanners[1],
    },
    {
        title: "Prepare sua Empresa para 2025",
        description: "Comece o ano novo com o pé direito. Planeje seus impressos e materiais de divulgação com a Ouro Gráfica.",
        image: heroBanners[2],
    }
]

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh]">
      <Carousel
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
          {heroContent.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[60vh] md:h-[80vh]">
                <Image
                  src={item.image.imageUrl}
                  alt={item.image.description}
                  fill
                  className="object-cover"
                  data-ai-hint={item.image.imageHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container max-w-7xl px-4 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">
                      {item.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-200 mb-8 drop-shadow-md">
                      {item.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/orcamento">
                          Fazer Orçamento Online <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="secondary">
                        <Link href="https://wa.me/5511999999999" target="_blank">
                          Chamar no WhatsApp <Phone className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
      </Carousel>
    </section>
  );
}
