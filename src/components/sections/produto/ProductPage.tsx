'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ChevronRight, Download, Home, Info, Lightbulb, Minus, PackageSearch, Pencil, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import RelatedProductsSection from './RelatedProductsSection';

interface ProductPageProps {
  product: Product;
}

export default function ProductPage({ product }: ProductPageProps) {
  const [quantity, setQuantity] = useState(product.variations.quantities[0] || 1);
  const [mainImage, setMainImage] = useState(product.imageUrls[0]);
  const [artworkOption, setArtworkOption] = useState('professional-check');
  const [selectedMaterial, setSelectedMaterial] = useState(product.variations.materials?.[0] || '');
  const [selectedFormat, setSelectedFormat] = useState(product.variations.formats[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.variations.colors?.[0] || '');
  const [selectedFinishing, setSelectedFinishing] = useState(product.variations.finishings?.[0] || '');

  // Hardcoded rating for now
  const rating = 4.5;
  const reviewCount = 192;

  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    // Find the closest quantity from the available options
    const closestQuantity = product.variations.quantities.reduce((prev, curr) => 
        Math.abs(curr - newQuantity) < Math.abs(prev - newQuantity) ? curr : prev
    );
    setQuantity(closestQuantity);
  }
  
  const breadcrumbs = [
    { label: 'Início', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: product.name, href: `/produto/${product.id}` },
  ];

  // Dummy price calculation logic, you can adjust this
  const getPriceForQuantity = (q: number) => {
    const baseQuantity = product.variations.quantities[0] || 1;
    const discountFactor = Math.log10(q / baseQuantity + 1) / 2;
    const pricePerUnit = product.basePrice / baseQuantity * (1 - discountFactor);
    const totalPrice = pricePerUnit * q;
    return { pricePerUnit, totalPrice };
  }

  const selectedPrice = useMemo(() => getPriceForQuantity(quantity), [quantity, product]);


  return (
    <TooltipProvider>
    <div className="bg-background">
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
                    {product.imageUrls.slice(0, 4).map((url, i) => (
                    <div 
                        key={i} 
                        className="aspect-square relative bg-secondary/50 rounded-md cursor-pointer hover:ring-2 hover:ring-primary"
                        onClick={() => setMainImage(url)}
                    >
                        <Image
                            src={url}
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
                        <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial} className="flex flex-wrap gap-2">
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
                        <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="flex flex-wrap gap-2">
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
                        <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
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
                        <RadioGroup value={selectedFinishing} onValueChange={setSelectedFinishing} className="flex flex-wrap gap-2">
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
            
            {/* Arte Final */}
            <div className="grid gap-4 mb-8">
                <Label className='font-semibold text-base'>Como você quer sua arte?</Label>
                <RadioGroup value={artworkOption} onValueChange={setArtworkOption} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Label htmlFor="professional-design" className={cn("border-2 rounded-lg p-4 cursor-pointer transition-all has-[:checked]:border-orange-500 has-[:checked]:ring-2 has-[:checked]:ring-orange-200", artworkOption === 'professional-design' ? 'border-orange-500' : 'border-border')}>
                    <RadioGroupItem value="professional-design" id="professional-design" className="sr-only" />
                    <div className='flex justify-between items-start'>
                        <div className='flex gap-4'>
                        <div className="text-orange-500">
                            <Lightbulb className="w-6 h-6" />
                            <Pencil className="w-6 h-6 -mt-2 ml-2" />
                        </div>
                        <div>
                            <p className='font-bold'>Designer Profissional</p>
                        </div>
                        </div>
                        <div className='text-xs font-bold bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-md'>NOVO</div>
                    </div>
                    <p className='text-muted-foreground text-sm mt-2'>Não tenho o arquivo, preciso de criação profissional.</p>
                    <div className='flex items-center gap-2 mt-2'>
                        <p className='font-bold text-lg'>R$ 45,99 *</p>
                        <Tooltip>
                        <TooltipTrigger><Info className='w-4 h-4 text-blue-500'/></TooltipTrigger>
                        <TooltipContent><p>Informação sobre o serviço</p></TooltipContent>
                        </Tooltip>
                    </div>
                </Label>
                <Label htmlFor="professional-check" className={cn("border-2 rounded-lg p-4 cursor-pointer transition-all has-[:checked]:border-orange-500 has-[:checked]:ring-2 has-[:checked]:ring-orange-200", artworkOption === 'professional-check' ? 'border-orange-500' : 'border-border')}>
                    <RadioGroupItem value="professional-check" id="professional-check" className="sr-only" />
                    <div className='flex gap-4 items-start'>
                        <PackageSearch className="w-8 h-8 text-orange-500" />
                        <div>
                            <p className='font-bold'>Checagem Profissional</p>
                        </div>
                        </div>
                    <p className='text-muted-foreground text-sm mt-2'>Já tenho o arquivo mas quero uma conferência profissional.</p>
                    <div className='flex items-center gap-2 mt-2'>
                        <p className='font-bold text-lg'>R$ 16,99</p>
                        <Tooltip>
                        <TooltipTrigger><Info className='w-4 h-4 text-blue-500'/></TooltipTrigger>
                        <TooltipContent><p>Informação sobre o serviço</p></TooltipContent>
                        </Tooltip>
                    </div>
                </Label>
                </RadioGroup>
            </div>
            

            {/* Quantidade */}
                <div className="grid gap-4 mb-8">
                    <Label className="font-semibold text-base">Escolha a quantidade</Label>
                    <RadioGroup value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val))}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Quantidade</TableHead>
                                    <TableHead>Valor por unidade</TableHead>
                                    <TableHead className="text-right">Valor Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {product.variations.quantities.map((q) => {
                                    const { pricePerUnit, totalPrice } = getPriceForQuantity(q);
                                    return (
                                        <TableRow key={q}>
                                            <TableCell>
                                                <Label htmlFor={`quantity-${q}`} className="flex items-center gap-3 font-medium cursor-pointer">
                                                    <RadioGroupItem value={q.toString()} id={`quantity-${q}`} />
                                                    {q} unidades
                                                </Label>
                                            </TableCell>
                                            <TableCell>
                                                {pricePerUnit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/un
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </RadioGroup>
                </div>


            {/* Preço e Compra */}
            <div className="space-y-4 pb-32">
                <div className='border rounded-lg p-3 flex items-center gap-3 bg-secondary/30'>
                    <Truck className="h-6 w-6 text-primary" />
                    <div>
                        <p className='font-semibold'>Frete e prazo</p>
                        <p className='text-sm text-muted-foreground'>Calcule o frete e o prazo de entrega estimados para sua região.</p>
                    </div>
                </div>
                <div className='space-y-4'>
                    <h3 className="text-lg font-semibold mt-6 mb-2">Especificações do Produto</h3>
                    <div className='border rounded-lg'>
                    <div className='flex justify-between items-center p-3 border-b'>
                        <span className='font-medium'>Prazo de produção</span>
                        <span className='text-muted-foreground'>4 dias úteis + frete <Info className='inline w-4 h-4 text-blue-500' /></span>
                    </div>
                    <div className='flex justify-between items-center p-3 border-b'>
                        <span className='font-medium'>Material</span>
                        <span className='text-muted-foreground'>{selectedMaterial}</span>
                    </div>
                    <div className='flex justify-between items-center p-3 border-b'>
                        <span className='font-medium'>Formato</span>
                        <span className='text-muted-foreground'>{selectedFormat}</span>
                    </div>
                    <div className='flex justify-between items-center p-3 border-b'>
                        <span className='font-medium'>Cor de Impressão</span>
                        <span className='text-muted-foreground'>{selectedColor}</span>
                    </div>
                    <div className='flex justify-between items-center p-3'>
                        <span className='font-medium'>Acabamento</span>
                        <span className='text-muted-foreground'>{selectedFinishing}</span>
                    </div>
                    </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
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
        </div>

        <Separator className="my-12" />

        <RelatedProductsSection category={product.categoryId} currentProductId={product.id} />

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4 z-50">
                <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className='hidden md:block'>
                        <p className="text-sm text-muted-foreground font-medium">{product.name} - {quantity} unidades</p>
                    </div>
                    <div className='flex items-center gap-4 w-full md:w-auto'>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold text-primary">
                                {selectedPrice.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>

                    <Button size="lg" className="w-full md:w-auto text-lg">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Comprar
                    </Button>
                </div>
            </div>
    </div>
    </TooltipProvider>
  );
}
