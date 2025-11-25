
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
import { collection, query } from "firebase/firestore";
import { Product } from "@/lib/definitions";

export default function BestsellersSection() {
    const firestore = useFirestore();
    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "products"));
    }, [firestore]);
    const { data: products, isLoading } = useCollection<Product>(productsQuery);

    if (isLoading) {
        return <div className="container max-w-7xl mx-auto px-4 text-center py-12">Carregando...</div>;
    }

    if (!products) {
        return null;
    }

    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Mais Vendidos</h2>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {products.map((product) => (
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
