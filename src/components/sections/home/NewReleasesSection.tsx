
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
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Product } from "@/lib/definitions";

export default function NewReleasesSection() {
    const firestore = useFirestore();
    // Assuming you have a 'createdAt' field in your products
    const newProductsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "products"), orderBy("createdAt", "desc"), limit(8));
    }, [firestore]);
    
    const { data: newProducts, isLoading } = useCollection<Product>(newProductsQuery);

    if (isLoading) {
        return <div className="container max-w-7xl mx-auto px-4 text-center py-12">Carregando lançamentos...</div>;
    }


    if (!newProducts || newProducts.length === 0) {
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
                        loop: newProducts.length > 4,
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
