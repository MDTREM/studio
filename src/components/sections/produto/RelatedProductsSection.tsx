'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { products } from "@/lib/data";
import BestsellerProductCard from "@/components/shared/BestsellerProductCard";

interface RelatedProductsSectionProps {
    category: string;
    currentProductId: string;
}

export default function RelatedProductsSection({ category, currentProductId }: RelatedProductsSectionProps) {
    const relatedProducts = products.filter(p => p.category === category && p.id !== currentProductId);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="pb-24">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-left mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Produtos Relacionados</h2>
                    <p className="text-muted-foreground mt-2">Veja outros produtos que podem te interessar.</p>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {relatedProducts.map((product) => (
                            <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                                <div className="p-1">
                                    <BestsellerProductCard product={product} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        </section>
    );
}
