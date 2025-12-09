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
import { collection, query, where, documentId, getDocs, orderBy } from "firebase/firestore";
import { HomepageSection, Product } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function ProductCarouselSection({ section }: { section: HomepageSection }) {
    const firestore = useFirestore();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!firestore || !section.productIds || section.productIds.length === 0) {
                setIsLoading(false);
                setProducts([]);
                return;
            }
            setIsLoading(true);
            try {
                // Firestore 'in' query is limited to 30 items. If you have more, you'll need to paginate.
                const productsRef = collection(firestore, 'products');
                const q = query(productsRef, where(documentId(), 'in', section.productIds.slice(0, 30)));
                const querySnapshot = await getDocs(q);
                
                // We need to sort the products based on the order in productIds array
                const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                const orderedProducts = section.productIds.map(id => fetchedProducts.find(p => p.id === id)).filter((p): p is Product => !!p);

                setProducts(orderedProducts);
            } catch (error) {
                console.error("Error fetching products for section:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [firestore, section.productIds]);
    
    if (isLoading) {
        return (
            <section className="py-16 sm:py-24 bg-secondary/30">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
            </section>
        );
    }
    
    if (products.length === 0) {
        return null; // Don't render section if no products
    }

    return (
        <section className="py-16 sm:py-24 bg-secondary/30 even:bg-background">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{section.title}</h2>
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
                            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
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


export default function HomepageSections() {
    const firestore = useFirestore();
    const sectionsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "homepage_sections"), where("active", "==", true), orderBy("order", "asc"));
    }, [firestore]);
    const { data: sections, isLoading } = useCollection<HomepageSection>(sectionsQuery);

    if (isLoading) {
        return (
            <div className="py-16 sm:py-24 bg-secondary/30">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
            </div>
        );
    }

    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <>
            {sections.map(section => (
                <ProductCarouselSection key={section.id} section={section} />
            ))}
        </>
    );
}
