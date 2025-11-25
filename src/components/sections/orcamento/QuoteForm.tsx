'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/lib/definitions';
import { ArrowRight, Check, FileUp, Loader2, Phone } from 'lucide-react';
import { useAuth, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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

  const firestore = useFirestore();
  const { user } = useAuth();


  useEffect(() => {
    if (selectedProduct) {
      setSize(selectedProduct.variations.formats[0] || '');
      setQuantity(selectedProduct.variations.quantities[0]?.toString() || '');
      setFinishing(selectedProduct.variations.finishings[0] || '');
    } else {
        setSize('');
        setQuantity('');
        setFinishing('');
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct && quantity) {
      const calculatePrice = () => {
        let price = selectedProduct.basePrice;
        const qty = parseInt(quantity);
        const baseQuantity = selectedProduct.variations.quantities[0] || 1;
        const discountFactor = Math.log10(qty / baseQuantity + 1) / 2;
        const pricePerUnit = selectedProduct.basePrice / baseQuantity * (1-discountFactor);

        setEstimatedPrice(pricePerUnit * qty);
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
    if (size) message += `*Tamanho:* ${size}\n`;
    message += `*Quantidade:* ${quantity}\n`;
    if(finishing) message += `*Acabamento:* ${finishing}\n`;
    if(estimatedPrice) message += `*Preço Estimado:* ${estimatedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    return encodeURIComponent(message);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !selectedProduct) return;

    setIsSubmitting(true);
    
    const orderData = {
        customerId: user?.uid || 'anonymous',
        customerName: user?.displayName || 'Cliente Anônimo',
        customerEmail: user?.email || '',
        orderDate: new Date().toISOString(),
        status: 'Em análise',
        items: [
            {
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                quantity: parseInt(quantity),
                price: estimatedPrice,
                variation: {
                    size,
                    finishing,
                }
            }
        ],
        totalAmount: estimatedPrice,
        artworkUrl: '', // Artwork will be sent separately
    };

    addDocumentNonBlocking(collection(firestore, 'orders_items'), orderData)
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
        setIsSubmitting(false);
      });
  }

  if (isSubmitted) {
    return (
        <Card className="w-full shadow-lg">
            <CardContent className="p-10 text-center">
                <Check className="w-16 h-16 mx-auto text-green-500 bg-green-100 rounded-full p-2 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Pedido Enviado!</h2>
                <p className="text-muted-foreground mb-6">
                    Seu pedido de orçamento foi enviado com sucesso. Se você tem uma arte pronta, por favor, envie para nosso e-mail ou WhatsApp junto com o número do seu pedido.
                </p>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Próximos Passos</AlertTitle>
                    <AlertDescription>
                        Nossa equipe entrará em contato em breve para confirmar os detalhes e solicitar sua arte.
                    </AlertDescription>
                </Alert>
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
                      {selectedProduct.variations.formats.map(s => (
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

                {selectedProduct.variations.finishings && selectedProduct.variations.finishings.length > 0 && (
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
                )}

              <div className="grid gap-2">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Como enviar sua arte?</AlertTitle>
                    <AlertDescription>
                        Após finalizar o pedido, nossa equipe entrará em contato para solicitar o arquivo da sua arte por e-mail ou WhatsApp.
                    </AlertDescription>
                </Alert>
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
                <a href={`https://wa.me/5531982190935?text=${getWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer">
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
