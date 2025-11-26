import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <div className="container max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <Card className="w-full text-center">
                <CardHeader>
                    <div className="mx-auto bg-red-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
                        <XCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Pagamento Cancelado</CardTitle>
                    <CardDescription>
                        A sua compra não foi finalizada.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6 text-muted-foreground">
                        Parece que você cancelou o pagamento ou houve um problema. Seu carrinho ainda está salvo se quiser tentar novamente.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild variant="outline">
                            <Link href="/carrinho">Voltar ao Carrinho</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/catalogo">Continuar Comprando</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
