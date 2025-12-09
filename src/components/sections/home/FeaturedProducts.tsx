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

export default function FeaturedProducts() {
    const firestore = useFirestore();
    const featuredProductsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, "products"),
            where("showOnHome", "==", true),
            limit(12)
        );
    }, [firestore]);

    const { data: products, isLoading } = useCollection<Product>(featuredProductsQuery);
    
    if (isLoading) {
        return (
            <section className="py-16 sm:py-24 bg-secondary/30">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
            </section>
        );
    }
    
    if (!products || products.length === 0) {
        return null; // Don't render the section if there are no featured products
    }

    return (
        <section className="py-16 sm:py-24 bg-secondary/30">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Produtos em Destaque</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <BestsellerProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}