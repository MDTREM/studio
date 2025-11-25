'use client';
import Image from 'next/image';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface BestsellerProductCardProps {
  product: Product;
}

const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

export default function BestsellerProductCard({ product }: BestsellerProductCardProps) {
  // Exemplo de cálculo de desconto e parcelas
  const discountedPrice = product.basePrice * 0.9; // 10% de desconto
  const installmentPrice = discountedPrice / 6;
  const whatsappNumber = "5511999999999";
  const message = `Olá! Tenho interesse no produto ${product.name}. Poderia me passar mais informações?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


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
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
          10% OFF
        </div>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm mb-2 truncate">{product.name}</h3>
        <div className="flex-grow">
          <p className="text-xs text-muted-foreground line-through">
            {product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-lg font-bold text-primary">
            {discountedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
          <p className="text-xs text-muted-foreground">
            ou 6x de {installmentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-2">
            <Button size="sm" asChild>
                <Link href={`/orcamento?produto=${product.id}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Comprar agora
                </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> + informações no WhatsApp
                </a>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}