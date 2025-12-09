'use client';
import ProductCard from '@/components/shared/ProductCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Product } from '@/lib/definitions';
import { collection, query, where } from 'firebase/firestore';
import { Filter, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CatalogoClientPage() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('categoria');
  const searchQuery = searchParams.get('q');
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let productsCollection: any = collection(firestore, 'products');
    
    const queryConstraints = [];

    if (currentCategory) {
      queryConstraints.push(where('categoryId', '==', currentCategory));
    }

    if (searchQuery) {
        queryConstraints.push(where('keywords', 'array-contains', searchQuery.toLowerCase()));
    }

    if (queryConstraints.length > 0) {
        return query(productsCollection, ...queryConstraints);
    }

    return query(productsCollection);
  }, [firestore, currentCategory, searchQuery]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const getFilterText = () => {
    if (searchQuery) {
        return `Resultados da busca para: "${searchQuery}"`;
    }
    if (currentCategory) {
        return `Categoria: ${currentCategory}`;
    }
    return 'Todos os produtos';
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nosso Catálogo</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Explore nossa variedade de produtos e encontre a solução perfeita para divulgar sua marca.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {searchQuery ? <Search className="w-5 h-5 text-muted-foreground" /> : <Filter className="w-5 h-5 text-muted-foreground" />}
        <span className="font-semibold">Filtros:</span>
        <span className="text-sm text-muted-foreground">
          {getFilterText()}
        </span>
      </div>
        {isLoading && <p>Carregando produtos...</p>}
        {products && products.length > 0 && (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {products.map((product) => (
                  <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1 h-full">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
        )}
        {!isLoading && (!products || products.length === 0) && (
            <div className="text-center py-16">
                <p className="text-lg font-semibold">Nenhum produto encontrado.</p>
                <p className="text-muted-foreground mt-2">
                    {searchQuery ? 'Tente uma busca diferente.' : 'Verifique os filtros ou a categoria selecionada.'}
                </p>
            </div>
        )}
    </div>
  );
}
