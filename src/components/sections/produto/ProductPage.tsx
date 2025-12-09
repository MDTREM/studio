'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ChevronRight, Download, FileUp, Home, Info, Lightbulb, Link as LinkIcon, Loader2, Minus, PackageSearch, Pencil, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import RelatedProductsSection from './RelatedProductsSection';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductPageProps {
  product: Product;
}
const ART_DESIGN_COST = 35.00;

export default function ProductPage({ product }: ProductPageProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [artworkOption, setArtworkOption] = useState('i-have-design');
    const [artworkFile, setArtworkFile] = useState<File | null>(null);
    const [artworkLink, setArtworkLink] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');
    const [selectedFormat, setSelectedFormat] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedFinishing, setSelectedFinishing] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cep, setCep] = useState('');
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingOptions, setShippingOptions] = useState<{name: string, price: number, days: number}[] | null>(null);

    const { addToCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();

    // Effect to safely initialize state when product data is available.
    useEffect(() => {
        if (product) {
            setMainImage(product.imageUrl?.[0] || null);
            if (product.variations?.quantities?.[0]) {
              setQuantity(product.variations.quantities[0]);
            }
            if (product.variations?.materials?.[0]) {
                setSelectedMaterial(product.variations.materials[0]);
            }
            if (product.variations?.formats?.[0]) {
                setSelectedFormat(product.variations.formats[0]);
            }
            if (product.variations?.colors?.[0]) {
                setSelectedColor(product.variations.colors[0]);
            }
            if (product.variations?.finishings?.[0]) {
                setSelectedFinishing(product.variations.finishings[0]);
            }
        }
    }, [product]);
    
    const breadcrumbs = [
        { label: 'Início', href: '/' },
        { label: 'Catálogo', href: '/catalogo' },
        { label: product.name, href: `/produto/${product.id}` },
    ];

    const getPriceForQuantity = (q: number) => {
        if (!product?.variations?.quantities || !product.basePrice || q <= 0) {
            return { pricePerUnit: product.basePrice || 0, totalPrice: (product.basePrice || 0) * q };
        }
        const baseQuantity = product.variations.quantities[0] || 1;
        const pricePerUnit = (product.basePrice / (baseQuantity > 0 ? baseQuantity : 1));
        const totalPrice = pricePerUnit * q;
        return { pricePerUnit, totalPrice };
    }

    const selectedPrice = useMemo(() => {
        let finalPrice = getPriceForQuantity(quantity).totalPrice;
        if (artworkOption === 'professional-design') {
            finalPrice += ART_DESIGN_COST;
        }
        return finalPrice;
    }, [quantity, product, artworkOption]);

    const handleAddToCart = () => {
        const artworkFee = artworkOption === 'professional-design' ? ART_DESIGN_COST : 0;
        const finalPrice = selectedPrice;

        const cartItem = {
            id: `${product.id}-${selectedFormat}-${selectedFinishing}-${artworkFee > 0 ? 'with-design' : 'no-design'}`,
            product,
            quantity,
            selectedFormat,
            selectedFinishing,
            artworkFee: artworkFee,
            totalPrice: finalPrice, // Envia o preço final calculado
        };
        addToCart(cartItem);
        toast({
            title: "Produto adicionado!",
            description: `${product.name} foi adicionado ao seu carrinho.`,
        });
        setIsDialogOpen(true);
    };

    const handleCalculateShipping = () => {
      if (!cep) return;
      setIsCalculatingShipping(true);
      setShippingOptions(null);

      // Simula uma chamada de API de frete
      setTimeout(() => {
        setShippingOptions([
          { name: 'SEDEX', price: 25.50, days: 3 },
          { name: 'PAC', price: 15.80, days: 7 },
          { name: 'Retirar na Loja', price: 0, days: 1 },
        ]);
        setIsCalculatingShipping(false);
      }, 1000);
    };
    
    // Helper to check if a variation array is valid and not empty
    const hasVariations = (key: 'models' | 'materials' | 'formats' | 'colors' | 'finishings' | 'quantities') => {
        return product?.variations?.[key] && Array.isArray(product.variations[key]) && (product.variations[key] as any[]).length > 0 && (product.variations[key] as any[])[0] !== '';
    }


    return (
        <TooltipProvider>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-start">
                {/* Imagens do Produto */}
                <div className="w-full lg:sticky lg:top-24">
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary">
                            {mainImage && (
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                data-ai-hint={product.imageHint}
                                priority
                                sizes="(max-width: 1023px) 100vw, 50vw"
                            />
                            )}
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {product.imageUrl?.slice(0, 5).map((url, i) => (
                            <button
                                key={i} 
                                className={cn(
                                    "aspect-square w-full relative bg-secondary/50 rounded-md cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all",
                                    mainImage === url && "ring-primary"
                                )}
                                onClick={() => setMainImage(url)}
                            >
                                <Image
                                    src={url}
                                    alt={`${product.name} thumbnail ${i+1}`}
                                    fill
                                    className="object-cover rounded-md"
                                    data-ai-hint={product.imageHint}
                                    sizes="20vw"
                                />
                            </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detalhes do Produto e Compra */}
                <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
                <p className="text-muted-foreground mt-2">{product.shortDescription}</p>

                <Separator className="my-6" />

                {/* Variações */}
                <div className="space-y-6">
                    {hasVariations('materials') && (
                        <div className="grid gap-3">
                            <Label className='font-semibold text-base'>Material</Label>
                            <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial} className="flex flex-wrap gap-2">
                                {product.variations.materials!.map(material => (
                                    <div key={material}>
                                        <RadioGroupItem value={material} id={`material-${material}`} className="sr-only" />
                                        <Label htmlFor={`material-${material}`} className={cn("border rounded-md px-4 py-2 cursor-pointer transition-colors", selectedMaterial === material && "bg-primary text-primary-foreground border-primary")}>
                                            {material}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    {hasVariations('formats') && (
                        <div className="grid gap-3">
                            <Label htmlFor="format" className='font-semibold text-base'>Formato</Label>
                            <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="flex flex-wrap gap-2">
                                {product.variations.formats!.map(f => (
                                    <div key={f}>
                                        <RadioGroupItem value={f} id={`format-${f}`} className="sr-only" />
                                        <Label htmlFor={`format-${f}`} className={cn("border rounded-md px-4 py-2 cursor-pointer transition-colors", selectedFormat === f && "bg-primary text-primary-foreground border-primary")}>
                                          {f}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    {hasVariations('colors') && (
                        <div className="grid gap-3">
                            <Label className='font-semibold text-base'>Cor</Label>
                            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                                {product.variations.colors!.map(color => (
                                    <div key={color}>
                                        <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                                        <Label htmlFor={`color-${color}`} className={cn("border rounded-md px-4 py-2 cursor-pointer transition-colors", selectedColor === color && "bg-primary text-primary-foreground border-primary")}>
                                            {color}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    {hasVariations('finishings') && (
                        <div className="grid gap-3">
                            <Label htmlFor="finishing" className='font-semibold text-base'>Acabamento</Label>
                            <RadioGroup value={selectedFinishing} onValueChange={setSelectedFinishing} className="flex flex-wrap gap-2">
                                {product.variations.finishings!.map(f => (
                                    <div key={f}>
                                        <RadioGroupItem value={f} id={`finishing-${f}`} className="sr-only" />
                                        <Label htmlFor={`finishing-${f}`} className={cn("border rounded-md px-4 py-2 cursor-pointer transition-colors", selectedFinishing === f && "bg-primary text-primary-foreground border-primary")}>
                                          {f}
                                        </Label>
                                    </div>
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
                        <Label htmlFor="professional-design" className={cn("border-2 rounded-lg p-4 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-ring", artworkOption === 'professional-design' ? 'border-primary' : 'border-border')}>
                            <RadioGroupItem value="professional-design" id="professional-design" className="sr-only" />
                            <div className='flex gap-4 items-start'>
                            <div className="text-primary">
                                <Lightbulb className="w-8 h-8" />
                            </div>
                            <div>
                                <p className='font-bold'>Designer Profissional</p>
                                <p className='text-muted-foreground text-sm mt-1'>Não tenho o arquivo, preciso de criação profissional.</p>
                            </div>
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                                <p className='font-bold text-lg'>R$ {ART_DESIGN_COST.toFixed(2).replace('.', ',')}</p>
                                <Tooltip>
                                <TooltipTrigger type='button' onClick={e => e.preventDefault()}><Info className='w-4 h-4 text-blue-500'/></TooltipTrigger>
                                <TooltipContent><p>Nossa equipe criará a arte para você.</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </Label>
                        <Label htmlFor="i-have-design" className={cn("border-2 rounded-lg p-4 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-ring", artworkOption === 'i-have-design' ? 'border-primary' : 'border-border')}>
                            <RadioGroupItem value="i-have-design" id="i-have-design" className="sr-only" />
                             <div className='flex gap-4 items-start'>
                                <FileUp className="w-8 h-8 text-primary" />
                                <div>
                                    <p className='font-bold'>Já tenho o design</p>
                                    <p className='text-muted-foreground text-sm mt-1'>Vou enviar meu arquivo pronto para impressão.</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                                <p className='font-bold text-lg'>Grátis</p>
                            </div>
                        </Label>
                    </RadioGroup>
                    {artworkOption === 'i-have-design' && (
                        <div className="space-y-4 mt-4 p-4 border rounded-lg bg-secondary/30">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="artwork-link">Link da Arte (Google Drive, etc.)</Label>
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                    <Input id="artwork-link" type="url" placeholder="https://..." value={artworkLink} onChange={(e) => setArtworkLink(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 border-t"></div>
                                <span className="text-xs text-muted-foreground">OU</span>
                                <div className="flex-1 border-t"></div>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="artwork-file">Anexar arte</Label>
                                <Input id="artwork-file" type="file" onChange={(e) => setArtworkFile(e.target.files ? e.target.files[0] : null)} />
                                <p className="text-xs text-muted-foreground">Formatos aceitos: PDF, AI, CDR, JPG, PNG.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {hasVariations('quantities') && (
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
                                {product.variations.quantities!.map((q) => {
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
                )}


                {/* Preço e Compra */}
                <div className="space-y-4">
                    <div className='border rounded-lg p-4 bg-secondary/30'>
                        <div className='flex items-start gap-3'>
                            <Truck className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <p className='font-semibold'>Calcular frete e prazo</p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-2">
                                    <Input 
                                      placeholder="Digite seu CEP" 
                                      className="w-full sm:w-48"
                                      value={cep}
                                      onChange={e => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    />
                                    <Button onClick={handleCalculateShipping} disabled={!cep || isCalculatingShipping} className='mt-2 sm:mt-0'>
                                        {isCalculatingShipping ? <Loader2 className="mr-2 animate-spin" /> : null}
                                        Calcular
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {isCalculatingShipping && (
                            <div className="mt-4 text-center text-muted-foreground">Calculando...</div>
                        )}
                        {shippingOptions && (
                          <div className="mt-4 space-y-2">
                            {shippingOptions.map(option => (
                              <div key={option.name} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-background">
                                <div>
                                  <p className="font-medium">{option.name}</p>
                                  <p className="text-muted-foreground">
                                    {option.price > 0 ? `Até ${option.days} dias úteis` : 'Pronto em até 1 dia útil'}
                                  </p>
                                </div>
                                <p className="font-semibold text-primary">
                                  {option.price > 0 ? option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Grátis'}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                    <div className='space-y-4'>
                        <h3 className="text-lg font-semibold mt-6 mb-2">Especificações do Produto</h3>
                        <div className='border rounded-lg'>
                        <div className='flex justify-between items-center p-3 border-b'>
                            <span className='font-medium'>Prazo de produção</span>
                            <span className='text-muted-foreground'>4 dias úteis + frete <Tooltip><TooltipTrigger type='button' onClick={e => e.preventDefault()}><Info className='inline w-4 h-4 text-blue-500'/></TooltipTrigger><TooltipContent><p>O prazo pode variar.</p></TooltipContent></Tooltip></span>
                        </div>
                         {selectedMaterial && <div className='flex justify-between items-center p-3 border-b'>
                            <span className='font-medium'>Material</span>
                            <span className='text-muted-foreground'>{selectedMaterial}</span>
                        </div>}
                        {selectedFormat && <div className='flex justify-between items-center p-3 border-b'>
                            <span className='font-medium'>Formato</span>
                            <span className='text-muted-foreground'>{selectedFormat}</span>
                        </div>}
                        {selectedColor && <div className='flex justify-between items-center p-3 border-b'>
                            <span className='font-medium'>Cor de Impressão</span>
                            <span className='text-muted-foreground'>{selectedColor}</span>
                        </div>}
                        {selectedFinishing && <div className='flex justify-between items-center p-3'>
                            <span className='font-medium'>Acabamento</span>
                            <span className='text-muted-foreground'>{selectedFinishing}</span>
                        </div>}
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
                                    {selectedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                        </div>

                        <Button size="lg" className="w-full md:w-auto text-lg" onClick={handleAddToCart}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Comprar
                        </Button>
                    </div>
                </div>
        </div>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Produto adicionado ao carrinho!</AlertDialogTitle>
                <AlertDialogDescription>
                    O que você gostaria de fazer agora?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-between">
                <AlertDialogCancel asChild>
                    <Button variant="outline">Continuar Comprando</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Link href="/carrinho">
                        <Button>Finalizar Compra</Button>
                    </Link>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </TooltipProvider>
      );
}
