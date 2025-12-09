'use client';
import Image from 'next/image';
import { Product, Favorite } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, serverTimestamp, query, deleteDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface BestsellerProductCardProps {
  product: Product;
}

export default function BestsellerProductCard({ product }: BestsellerProductCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  // Safely get the image URL
  const imageUrl = product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl[0] : 'https://placehold.co/400x400/FF6B07/white?text=Sem+Imagem';

  const favoritesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'favorites'));
  }, [firestore, user]);

  const { data: favorites } = useCollection<Favorite>(favoritesQuery);
  const isFavorited = favorites?.some(fav => fav.id === product.id);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating when clicking the heart
    if (!user) {
      toast({
        title: "Faça login para favoritar",
        description: "Você precisa estar conectado para adicionar produtos aos seus favoritos.",
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }
    if (!firestore) return;

    const favoriteRef = doc(firestore, 'users', user.uid, 'favorites', product.id);

    try {
        if (isFavorited) {
          await deleteDoc(favoriteRef);
          toast({
            title: "Removido dos favoritos!",
            description: `"${product.name}" foi removido da sua lista de desejos.`,
          });
        } else {
          await setDoc(favoriteRef, {
            productId: product.id,
            createdAt: serverTimestamp(),
          }, { merge: false });
          toast({
            title: "Adicionado aos favoritos!",
            description: `"${product.name}" foi adicionado à sua lista de desejos.`,
          });
        }
    } catch (error: any) {
        toast({
            title: "Erro ao favoritar",
            description: error.message,
            variant: "destructive"
        });
    }
  };

  const minQuantity = product.variations.quantities?.[0] || 1;

  return (
    <Link href={`/produto/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-lg flex flex-col sm:flex-row md:flex-col">
        <div className="relative w-full sm:w-2/5 md:w-full">
          <div className="relative aspect-square w-full overflow-hidden bg-primary flex items-center justify-center">
            <Image src={imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={product.imageHint} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
            onClick={toggleFavorite}
            aria-label="Adicionar aos favoritos"
          >
            <Heart className={cn("h-4 w-4 text-muted-foreground", isFavorited && "fill-red-500 text-red-500")} />
          </Button>
        </div>
        
        <CardContent className="p-4 flex flex-col flex-grow w-full sm:w-3/5 md:w-full">
          <p className="text-xs text-primary font-medium mb-1 uppercase">{product.categoryId}</p>
          <h3 className="font-bold text-base mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">{product.shortDescription}</p>

          <div className="mt-auto">
              <p className="text-2xl font-bold text-primary">
                  {product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-sm font-normal text-muted-foreground">
                  / {minQuantity} unidade
              </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
