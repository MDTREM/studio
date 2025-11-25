'use client';
import Image from 'next/image';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';

interface BestsellerProductCardProps {
  product: Product;
}

export default function BestsellerProductCard({ product }: BestsellerProductCardProps) {
  const minQuantity = product.variations.quantities[0] || 1;
  // Hardcoded rating for now, this can be added to the product definition later
  const rating = 4.5;
  const reviewCount = 14;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 group">
      <div className="relative">
        <Link href={`/produto/${product.id}`}>
          <div className="relative aspect-square w-full overflow-hidden bg-primary flex items-center justify-center">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={product.imageHint} />
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-primary font-medium mb-1 uppercase">{product.categoryId}</p>
        <h3 className="font-bold text-base mb-1 truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-primary fill-primary' : 'text-gray-300'}`} />
                ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount} avaliações)</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">{product.shortDescription}</p>

        <div className="mt-auto">
            <p className="text-2xl font-bold text-primary">
                {product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                <span className="text-sm font-normal text-muted-foreground"> / {minQuantity} unidade</span>
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
