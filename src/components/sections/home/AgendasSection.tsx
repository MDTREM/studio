
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
import { collection, query, where } from "firebase/firestore";
import { Product } from "@/lib/definitions";

export default function AgendasSection() {
    const firestore = useFirestore();
    const agendasQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "products"), where("categoryId", "==", "agendas"));
    }, [firestore]);
    const { data: agendaProducts, isLoading } = useCollection<Product>(agendasQuery);


    if (isLoading) {
        return <div className="container max-w-7xl mx-auto px-4 text-center py-12">Carregando agendas...</div>;
    }

    if (!agendaProducts || agendaProducts.length === 0) {
        return null; // Don't render the section if there are no products in this category
    }

    return (
        <section className="py-16 sm:py-24 bg-secondary/30">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Agendas e Calendários</h2>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {agendaProducts.map((product) => (
                            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
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
