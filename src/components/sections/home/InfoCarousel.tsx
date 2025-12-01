
'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CreditCard, ShieldCheck, Brush, Truck } from "lucide-react";

const infoItems = [
    {
        icon: <CreditCard className="h-8 w-8 text-primary" />,
        title: "Cartão de crédito",
        description: "pagamento em até 6x"
    },
    {
        icon: <Truck className="h-8 w-8 text-primary" />,
        title: "Entregamos",
        description: "em todo Brasil"
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: "Compra garantida",
        description: "loja 100% segura"
    },
    {
        icon: <Brush className="h-8 w-8 text-primary" />,
        title: "Design Profissional",
        description: "Fazemos a sua arte"
    }
]

export default function InfoCarousel() {

  return (
    <section className="border-y bg-background">
        <div className="container max-w-7xl mx-auto px-4 md:hidden">
            <Carousel
                className="w-full"
                plugins={[
                Autoplay({
                    delay: 3000,
                }),
                ]}
                opts={{
                loop: true,
                }}
            >
                <CarouselContent>
                {infoItems.map((item, index) => (
                    <CarouselItem key={index}>
                        <div className="flex items-center justify-center gap-4 py-4">
                            {item.icon}
                            <div>
                                <p className="font-bold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
            </Carousel>
        </div>
        <div className="hidden md:grid md:grid-cols-4 gap-4 container max-w-7xl mx-auto px-4 py-6">
            {infoItems.map((item, index) => (
                 <div key={index} className="flex items-center justify-center gap-4">
                    {item.icon}
                    <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
}
