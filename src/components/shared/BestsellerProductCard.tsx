'use client';
import Image from 'next/image';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Link from 'next/link';

interface BestsellerProductCardProps {
  product: Product;
}

export default function BestsellerProductCard({ product }: BestsellerProductCardProps) {
  const minQuantity = product.variations.quantities[0] || 1;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 group">
      <div className="relative">
        <Link href={`/orcamento?produto=${product.id}`}>
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={`Imagem do produto ${product.name}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.imageHint}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow text-center">
        <h3 className="font-semibold text-sm mb-2 truncate">{product.name}</h3>
        <div className="flex-grow">
          <p className="text-2xl font-bold text-primary">
            {product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-xs text-muted-foreground">
             / {minQuantity} unidades
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-2">
            <Button size="sm" asChild>
                <Link href={`/orcamento?produto=${product.id}`}>
                    Comprar agora mesmo
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
