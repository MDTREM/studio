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
  const imageUrl = product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl[0] : 'https://placehold.co/600x400/FF6B07/white?text=Sem+Imagem';
  
  return (
    <Link href={`/produto/${product.id}`} className="group block">
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
            <div className="relative aspect-video">
            <Image
                src={imageUrl}
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
            <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{product.name}</CardTitle>
            <CardDescription>{product.shortDescription}</CardDescription>
            </CardContent>
            <CardFooter className="p-6 flex justify-between items-center">
            <div>
                <p className="text-sm text-muted-foreground">A partir de</p>
                <p className="text-xl font-bold text-primary">
                {product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold">
                Comprar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
            </CardFooter>
        </div>
        </Card>
    </Link>
  );
}
