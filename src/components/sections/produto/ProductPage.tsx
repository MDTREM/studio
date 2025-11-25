'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Download, ShoppingCart, Star, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  const [quantity, setQuantity] = useState(product.variations.quantities[0]?.toString() || '');
  const [selectedFormat, setSelectedFormat] = useState(product.variations.formats[0] || '');
  
  // Hardcoded rating for now
  const rating = 4.5;
  const reviewCount = 14;

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Imagens do Produto */}
        <div>
          <div className="aspect-square w-full relative bg-secondary rounded-lg mb-4">
            {/* Imagem Principal */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              data-ai-hint={product.imageHint}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {/* Thumbnails */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square relative bg-secondary/50 rounded-md cursor-pointer hover:ring-2 hover:ring-primary">
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
          <div className="space-y-4">
            {product.variations.models && (
                 <div className="grid gap-2">
                    <Label className='font-semibold'>Modelo</Label>
                    <RadioGroup defaultValue={product.variations.models[0]} className="flex flex-wrap gap-2">
                        {product.variations.models.map(model => (
                            <Label key={model} htmlFor={`model-${model}`} className="border rounded-md p-3 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer">
                                <RadioGroupItem value={model} id={`model-${model}`} className="sr-only" />
                                {model}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
            {product.variations.materials && (
                 <div className="grid gap-2">
                    <Label className='font-semibold'>Material</Label>
                    <RadioGroup defaultValue={product.variations.materials[0]} className="flex flex-wrap gap-2">
                        {product.variations.materials.map(material => (
                             <Label key={material} htmlFor={`material-${material}`} className="border rounded-md p-3 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer">
                                <RadioGroupItem value={material} id={`material-${material}`} className="sr-only" />
                                {material}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
             <div className="grid gap-2">
                <Label htmlFor="format" className='font-semibold'>Formato</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger id="format"><SelectValue /></SelectTrigger>
                    <SelectContent>
                    {product.variations.formats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             {product.variations.colors && (
                 <div className="grid gap-2">
                    <Label className='font-semibold'>Cor</Label>
                    <RadioGroup defaultValue={product.variations.colors[0]} className="flex flex-wrap gap-2">
                        {product.variations.colors.map(color => (
                             <Label key={color} htmlFor={`color-${color}`} className="border rounded-md p-3 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer">
                                <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                                {color}
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            )}
             <div className="grid gap-2">
                <Label htmlFor="finishing" className='font-semibold'>Acabamento</Label>
                <Select>
                    <SelectTrigger id="finishing"><SelectValue placeholder="Selecione um acabamento" /></SelectTrigger>
                    <SelectContent>
                    {product.variations.finishings.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="quantity" className='font-semibold'>Escolha a quantidade</Label>
                 <RadioGroup defaultValue={quantity} onValueChange={setQuantity} className="flex flex-wrap gap-2">
                    {product.variations.quantities.map(q => (
                         <Label key={q} htmlFor={`quantity-${q}`} className="border rounded-md p-3 has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary cursor-pointer min-w-[60px] text-center">
                            <RadioGroupItem value={q.toString()} id={`quantity-${q}`} className="sr-only" />
                            {q}
                        </Label>
                    ))}
                </RadioGroup>
            </div>
          </div>
          
          <Separator className="my-6" />

          {/* Preço e Compra */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <span className="text-muted-foreground">/ {quantity} unids.</span>
            </div>
            <Button size="lg" className="w-full text-lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar
            </Button>
            <div className='border rounded-lg p-3 flex items-center gap-3'>
                <Truck className="h-6 w-6 text-primary" />
                <div>
                    <p className='font-semibold'>Frete e prazo</p>
                    <p className='text-sm text-muted-foreground'>Calcule o frete e o prazo de entrega estimados para sua região.</p>
                </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full mt-8">
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
  );
}
