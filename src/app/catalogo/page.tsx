'use client';
import ProductCard from '@/components/shared/ProductCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Product } from '@/lib/definitions';
import { collection, query, where } from 'firebase/firestore';
import { Filter, Search } from 'lucide-react';

// A página agora recebe `searchParams` como props.
export default function CatalogoPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // O hook `useSearchParams` foi removido.
  const currentCategory = searchParams?.categoria as string | undefined;
  const searchQuery = searchParams?.q as string | undefined;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
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
