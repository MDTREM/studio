'use client';
import BestsellerProductCard from '@/components/shared/BestsellerProductCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Category, Product } from '@/lib/definitions';
import { collection, query, where } from 'firebase/firestore';
import { Filter, Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import CategoryFilter from './_components/CategoryFilter';

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
    return 'Todos os produtos';
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nosso Catálogo</h1>
      </div>

      <div className='flex items-center mb-8 gap-4'>
        <CategoryFilter />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {searchQuery ? <Search className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            <span className="font-semibold">Mostrando:</span>
            <span>
                {currentCategory || getFilterText()}
            </span>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <BestsellerProductCard key={product.id} product={product} />
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
