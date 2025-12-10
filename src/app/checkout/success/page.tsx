'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useDoc, useFirebase } from "@/firebase";
import { Order } from "@/lib/definitions";
import { doc } from "firebase/firestore";
import Image from "next/image";

function SuccessPageContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const { user, firestore } = useFirebase();

    const orderDocRef = useMemoFirebase(() => {
        if (!firestore || !user || !orderId) return null;
        return doc(firestore, 'users', user.uid, 'orders', orderId);
    }, [firestore, user, orderId]);

    const { data: order, isLoading } = useDoc<Order>(orderDocRef);

    useEffect(() => {
        if(order) {
            clearCart();
        }
    }, [order, clearCart]);

    return (
        <div className="container max-w-3xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <Card className="w-full text-center">
                <CardHeader>
                    <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Pagamento Aprovado!</CardTitle>
                    <CardDescription>
                        Seu pedido foi recebido e está sendo processado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-left">
                    {isLoading && (
                        <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                        </div>
                    )}
                    {order && (
                        <div className="space-y-4">
                            <div className="p-4 border rounded-lg bg-secondary/50">
                                <h3 className="font-semibold mb-3">Resumo do Pedido #{order.id?.substring(0, 7)}</h3>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="font-medium">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.variation?.format} / {item.variation?.finishing} {item.artworkFee > 0 && "/ Com Design"}
                                                </p>
                                            </div>
                                            <p>{item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="my-3" />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>{order.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Você receberá um e-mail com a confirmação e os detalhes do seu pedido em breve. Nossa equipe entrará em contato para solicitar o arquivo da sua arte, caso ainda não o tenha enviado.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/dashboard">Ver Meus Pedidos</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Carregando...</div>}>
            <SuccessPageContent />
        </Suspense>
    );
}
