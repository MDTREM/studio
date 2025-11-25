'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ChevronRight, Download, Home, Minus, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  const [quantity, setQuantity] = useState(product.variations.quantities[0] || 1);
  const [mainImage, setMainImage] = useState(product.imageUrl);

  // Hardcoded rating for now
  const rating = 4.5;
  const reviewCount = 192;

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  }

  const breadcrumbs = [
    { label: 'Início', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: product.name, href: `/produto/${product.id}` },
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 sm:py-16">
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
            {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label === 'Início' ? <Home className="h-4 w-4" /> : crumb.label}
                </Link>
                </div>
            ))}
        </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Imagens do Produto */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 w-full md:w-20">
                {Array.from({ length: 4 }).map((_, i) => (
                <div 
                    key={i} 
                    className="aspect-square relative bg-secondary/50 rounded-md cursor-pointer hover:ring-2 hover:ring-primary"
                    onClick={() => setMainImage(`https://picsum.photos/seed/${product.id}-${i}/600/600`)}
                >
                    <Image
                        src={`https://picsum.photos/seed/${product.id}-${i}/200/200`}
                        alt={`${product.name} thumbnail ${i+1}`}
                        fill
                        className="object-cover rounded-md"
                        data-ai-hint={product.imageHint}
                    />
                </div>
                ))}
            </div>
            <div className="aspect-square w-full relative bg-secondary rounded-lg">
                <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                data-ai-hint={product.imageHint}
                />
            </div>
        </div>

        {/* Detalhes do Produto e Compra */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.shortDescription}</p>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-primary fill-primary' : 'text-gray-300'}`} />
                ))}
            </div>
            <span className="text-sm text-muted-foreground">({reviewCount} avaliações)</span>
          </div>

          <Separator className="my-6" />

          {/* Variações */}
          <div className="space-y-6">
            {product.variations.materials && product.variations.materials.length > 0 && (
                 <div className="grid gap-3">
                    <Label className='font-semibold text-base'>Material</Label>
                    <RadioGroup defaultValue={product.variations.materials[0]} className="flex flex-wrap gap-2">
                        {product.variations.materials.map(material => (
                             <Label key={material} htmlFor={`material-${material}`} className="border rounded-md px-4 py-2 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer transition-colors">
                                <RadioGroupItem value={material} id={`material-${material}`} className="sr-only" />
                                {material}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
            {product.variations.formats && product.variations.formats.length > 0 && (
                <div className="grid gap-3">
                    <Label htmlFor="format" className='font-semibold text-base'>Formato</Label>
                    <RadioGroup defaultValue={product.variations.formats[0]} className="flex flex-wrap gap-2">
                        {product.variations.formats.map(f => (
                            <Label key={f} htmlFor={`format-${f}`} className="border rounded-md px-4 py-2 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer transition-colors">
                                <RadioGroupItem value={f} id={`format-${f}`} className="sr-only" />
                                {f}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
            {product.variations.colors && product.variations.colors.length > 0 && (
                 <div className="grid gap-3">
                    <Label className='font-semibold text-base'>Cor</Label>
                    <RadioGroup defaultValue={product.variations.colors[0]} className="flex flex-wrap gap-2">
                        {product.variations.colors.map(color => (
                             <Label key={color} htmlFor={`color-${color}`} className="border rounded-md px-4 py-2 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer transition-colors">
                                <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                                {color}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
            {product.variations.finishings && product.variations.finishings.length > 0 && (
                <div className="grid gap-3">
                    <Label htmlFor="finishing" className='font-semibold text-base'>Acabamento</Label>
                    <RadioGroup defaultValue={product.variations.finishings[0]} className="flex flex-wrap gap-2">
                        {product.variations.finishings.map(f => (
                            <Label key={f} htmlFor={`finishing-${f}`} className="border rounded-md px-4 py-2 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer transition-colors">
                                <RadioGroupItem value={f} id={`finishing-${f}`} className="sr-only" />
                                {f}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
          </div>
          
          <Separator className="my-8" />

          {/* Preço e Compra */}
          <div className="space-y-4 pb-32">
            <div className='border rounded-lg p-3 flex items-center gap-3 bg-secondary/30'>
                <Truck className="h-6 w-6 text-primary" />
                <div>
                    <p className='font-semibold'>Frete e prazo</p>
                    <p className='text-sm text-muted-foreground'>Calcule o frete e o prazo de entrega estimados para sua região.</p>
                </div>
            </div>
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                <AccordionTrigger>Especificações do Produto</AccordionTrigger>
                <AccordionContent>
                    {product.description || 'Descrição detalhada do produto não disponível.'}
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                <AccordionTrigger>Utilize o gabarito</AccordionTrigger>
                <AccordionContent className='flex flex-col items-start gap-4'>
                    <p>Para garantir a qualidade da impressão, utilize nossos gabaritos.</p>
                    <Button variant="outline">
                        <Download className='mr-2 h-4 w-4' />
                        Baixar gabarito
                    </Button>
                </AccordionContent>
                </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
       <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4">
            <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className='hidden md:block'>
                    <p className="text-sm text-muted-foreground font-medium">{product.name}</p>
                </div>
                <div className='flex items-center gap-4 w-full md:w-auto'>
                     <div className="flex items-center gap-2">
                        <span className='font-semibold text-sm'>Quantidade:</span>
                        <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(-50)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input 
                                type="number" 
                                className="h-8 w-16 text-center border-x" 
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                            />
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(50)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                     <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-primary">{product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                </div>

                <Button size="lg" className="w-full md:w-auto text-lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Comprar
                </Button>
            </div>
        </div>
    </div>
  );
}
