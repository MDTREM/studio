import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={product.imageUrls[0]}
            alt={`Imagem do produto ${product.name}`}
            fill
            className="object-cover"
            data-ai-hint={product.imageHint}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <div className="flex flex-col flex-grow">
        <CardContent className="p-6 flex-grow">
          <CardTitle className="text-xl font-bold mb-2">{product.name}</CardTitle>
          <CardDescription>{product.shortDescription}</CardDescription>
        </CardContent>
        <CardFooter className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">A partir de</p>
            <p className="text-xl font-bold text-primary">
              {product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <Button asChild>
            <Link href={`/produto/${product.id}`}>
              Orçar <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
