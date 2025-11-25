
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

export default function NewReleasesSection() {
    // For now, we'll feature the first 4 products as "New Releases"
    // This can be updated later to filter by a specific category or property
    const newProducts = products.slice(0, 4);

    if (newProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Lançamentos</h2>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {newProducts.map((product) => (
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
