'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart();

    // Limpa o carrinho quando o cliente chega a esta página.
    useEffect(() => {
        clearCart();
    }, [clearCart]);
    
    return (
        <div className="container max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-14rem)]">
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
                <CardContent>
                    <p className="mb-6 text-muted-foreground">
                        Você receberá um e-mail com a confirmação e os detalhes do seu pedido em breve. Nossa equipe entrará em contato para solicitar o arquivo da sua arte, caso ainda não o tenha enviado.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard">Ver Meus Pedidos</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
