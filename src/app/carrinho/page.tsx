'use client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Trash2, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { createCheckoutSession } from '@/app/actions/stripe';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to add your public key to the .env.local file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Você precisa estar logado!',
            description: 'Por favor, faça login para finalizar a compra.',
        });
        router.push('/login?redirect=/carrinho');
        return;
    }

    setIsSubmitting(true);

    // This function will handle the async operations
    const performCheckout = async () => {
        try {
            const { sessionId, error } = await createCheckoutSession(cartItems, user.uid);

            if (error || !sessionId) {
                console.error("Server-side error:", error);
                throw new Error(error || 'Não foi possível criar a sessão de checkout.');
            }

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe.js não carregou.');
            }
            
            // Use the official redirectToCheckout method
            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

            if (stripeError) {
                console.error("Stripe redirection error: ", stripeError);
                throw new Error(stripeError.message);
            }

        } catch (error: any) {
            console.error("Error during checkout process: ", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao iniciar a compra',
                description: error.message || 'Houve um problema ao conectar com o sistema de pagamento. Tente novamente.',
            });
            setIsSubmitting(false); // Only re-enable form on error
        }
    };
    
    // Call the async function
    performCheckout();
  };
  
  if (cartCount === 0) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-6">
          Parece que você ainda não adicionou nenhum produto. Que tal explorar nosso catálogo?
        </p>
        <Button asChild>
          <Link href="/catalogo">
            <ArrowLeft className="mr-2" />
            Voltar para o catálogo
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Seu Carrinho</h1>
        <p className="text-muted-foreground mt-2">Revise seus itens e prossiga para a finalização.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px] hidden sm:table-cell">Produto</TableHead>
                            <TableHead>Detalhes</TableHead>
                            <TableHead className="w-[120px] text-center">Quantidade</TableHead>
                            <TableHead className="w-[120px] text-right">Subtotal</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {cartItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                    src={item.product.imageUrl[0]}
                                    alt={item.product.name}
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <p className="font-bold">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                    {item.selectedFormat} / {item.selectedFinishing}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        className="w-20 text-center"
                                    />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                                <TableCell>
                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFromCart(item.id)}
                                    >
                                    <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-24">
                <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Frete</span>
                        <span className="text-sm">A calcular</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                </CardContent>
                <CardFooter>
                <Button size="lg" className="w-full" onClick={handleCheckout} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isSubmitting ? 'Processando...' : 'Ir para Pagamento'}
                </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
