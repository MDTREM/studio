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
import { Product } from "@/lib/definitions";
import { collection, query, where, limit } from "firebase/firestore";

interface RelatedProductsSectionProps {
    category: string;
    currentProductId: string;
}

export default function RelatedProductsSection({ category, currentProductId }: RelatedProductsSectionProps) {
    const firestore = useFirestore();
    const relatedProductsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, "products"), 
            where("categoryId", "==", category),
            limit(10) // Fetch a few more to filter out the current one
        );
    }, [firestore, category]);

    const { data: relatedProducts, isLoading } = useCollection<Product>(relatedProductsQuery);
    
    const filteredProducts = relatedProducts?.filter(p => p.id !== currentProductId);

    if (isLoading) {
        return <div className="container max-w-7xl mx-auto px-4">Carregando produtos relacionados...</div>
    }

    if (!filteredProducts || filteredProducts.length === 0) {
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
                        {filteredProducts.map((product) => (
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
