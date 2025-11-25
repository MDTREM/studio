'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/lib/definitions';
import { ArrowRight, Check, FileUp, Loader2, Phone } from 'lucide-react';

interface QuoteFormProps {
  products: Product[];
  selectedProductId?: string;
}

export default function QuoteForm({ products, selectedProductId }: QuoteFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    products.find(p => p.id === selectedProductId)
  );
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [finishing, setFinishing] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setSize(selectedProduct.variations.sizes[0] || '');
      setQuantity(selectedProduct.variations.quantities[0]?.toString() || '');
      setFinishing(selectedProduct.variations.finishings[0] || '');
    } else {
        setSize('');
        setQuantity('');
        setFinishing('');
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct && size && quantity) {
      // Onde você pode alterar o cálculo do orçamento
      // A lógica atual é um exemplo simples. Altere conforme suas regras de negócio.
      const calculatePrice = () => {
        let price = selectedProduct.basePrice;
        const qty = parseInt(quantity);

        // Fator de quantidade
        if (qty > 100) price *= 0.9;
        if (qty > 500) price *= 0.85;

        // Fator de tamanho (exemplo)
        if (size.includes('A5')) price *= 1.2;
        if (size.includes('10x10')) price *= 1.1;

        // Fator de acabamento (exemplo)
        if (finishing.includes('Fosca')) price += 20;
        if (finishing.includes('Especial')) price += 50;

        setEstimatedPrice(price);
      };
      calculatePrice();
    } else {
      setEstimatedPrice(null);
    }
  }, [selectedProduct, size, quantity, finishing]);
  
  const handleProductChange = (productId: string) => {
    setSelectedProduct(products.find(p => p.id === productId));
  }

  const getWhatsAppMessage = () => {
    let message = `Olá! Gostaria de um orçamento para o seguinte item:\n\n`;
    message += `*Produto:* ${selectedProduct?.name}\n`;
    message += `*Tamanho:* ${size}\n`;
    message += `*Quantidade:* ${quantity}\n`;
    if(finishing) message += `*Acabamento:* ${finishing}\n`;
    if(estimatedPrice) message += `*Preço Estimado:* ${estimatedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    return encodeURIComponent(message);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular chamada de API
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
    }, 2000);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  if (isSubmitted) {
    return (
        <Card className="w-full shadow-lg">
            <CardContent className="p-10 text-center">
                <Check className="w-16 h-16 mx-auto text-green-500 bg-green-100 rounded-full p-2 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Pedido Enviado!</h2>
                <p className="text-muted-foreground">
                    Seu pedido de orçamento foi enviado com sucesso. Em breve, nossa equipe entrará em contato para confirmar os detalhes.
                </p>
                <Button onClick={() => setIsSubmitted(false)} className="mt-6">Fazer Novo Orçamento</Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Detalhes do Orçamento</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="product">Tipo de Material</Label>
            <Select onValueChange={handleProductChange} defaultValue={selectedProduct?.id}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Selecione o material" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="size">Tamanho</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Selecione o tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct.variations.sizes.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Select value={quantity} onValueChange={setQuantity}>
                    <SelectTrigger id="quantity">
                      <SelectValue placeholder="Selecione a quantidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct.variations.quantities.map(q => (
                        <SelectItem key={q} value={q.toString()}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="finishing">Acabamento</Label>
                <Select value={finishing} onValueChange={setFinishing}>
                  <SelectTrigger id="finishing">
                    <SelectValue placeholder="Selecione o acabamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct.variations.finishings.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Enviar sua arte (opcional)</Label>
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline">
                    <Label htmlFor="artwork" className="cursor-pointer">
                      <FileUp className="mr-2 h-4 w-4" />
                      Anexar arquivo
                    </Label>
                  </Button>
                  <Input
                    id="artwork"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                  {fileName && <p className="text-sm text-muted-foreground truncate">{fileName}</p>}
                </div>
                <p className="text-sm text-muted-foreground">Envie seu arquivo em PDF, CDR, AI ou JPG.</p>
              </div>
            </>
          )}

          {estimatedPrice !== null && (
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <p className="text-muted-foreground">Valor Estimado:</p>
              <p className="text-3xl font-bold text-primary">
                {estimatedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
            <Button variant="outline" asChild>
                <a href={`https://wa.me/5511999999999?text=${getWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" />
                    Enviar para WhatsApp
                </a>
            </Button>
            <Button type="submit" disabled={!selectedProduct || isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" /> }
                {isSubmitting ? "Enviando..." : "Finalizar Pedido"}
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
