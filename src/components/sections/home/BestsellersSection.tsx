'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import BestsellerProductCard from "@/components/shared/BestsellerProductCard";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import { Product } from "@/lib/definitions";
import { Loader2 } from "lucide-react";

export default function BestsellersSection() {
    const firestore = useFirestore();
    const bestsellersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, "products"),
            where("isBestseller", "==", true),
            limit(12)
        );
    }, [firestore]);

    const { data: products, isLoading } = useCollection<Product>(bestsellersQuery);
    
    if (isLoading) {
        return (
            <section className="py-16 sm:py-24 bg-background">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
            </section>
        );
    }
    
    if (!products || products.length === 0) {
        return null; // Don't render the section if there are no bestseller products
    }

    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Mais Vendidos</h2>
                </div>
                 <Carousel
                    opts={{
                        align: "start",
                        loop: products.length > 4,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {products.map((product) => (
                        <CarouselItem key={product.id} className="basis-[80%] sm:basis-1/2 lg:basis-1/4">
                            <div className="p-1 h-full">
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
