
'use client';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { Favorite, Product } from '@/lib/definitions';
import { collection, doc, documentId, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/shared/ProductCard';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DesejosPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const favoritesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'favorites'));
  }, [firestore, user]);

  const { data: favorites } = useCollection<Favorite>(favoritesQuery);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!firestore || !favorites || favorites.length === 0) {
        setFavoriteProducts([]);
        setIsLoading(false);
        return;
      }

      const productIds = favorites.map(f => f.productId);
      const productsRef = collection(firestore, 'products');
      const q = query(productsRef, where(documentId(), 'in', productIds));
      
      const productSnap = await getDocs(q);
      const products = productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setFavoriteProducts(products);
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchFavoriteProducts();
  }, [firestore, favorites]);

  if (!user && !isLoading) {
    return (
        <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Sua lista de desejos está vazia</h1>
            <p className="text-muted-foreground mb-6">
                Faça login para ver seus produtos favoritos ou comece a explorar para adicionar alguns!
            </p>
            <div className="flex gap-4 justify-center">
                 <Button asChild>
                    <Link href="/catalogo">
                        Explorar produtos
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/login">
                        Fazer Login
                    </Link>
                </Button>
            </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="container max-w-7xl mx-auto px-4 py-12">Carregando sua lista de desejos...</div>;
  }
  
  if (favoriteProducts.length === 0) {
    return (
        <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Sua lista de desejos está vazia</h1>
            <p className="text-muted-foreground mb-6">
            Você ainda não adicionou nenhum produto. Comece a explorar e adicione o que mais gostar!
            </p>
            <Button asChild>
                <Link href="/catalogo">
                    Explorar produtos
                </Link>
            </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sua Lista de Desejos</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Seus produtos favoritos, todos em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
