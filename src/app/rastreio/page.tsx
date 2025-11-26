'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { Loader2, LogIn, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RastreioPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
        <div className="container max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <Card className="w-full text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Rastrear Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Verificando sua sessão...</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (user) {
    // Usuário está logado
    return (
        <div className="container max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <Card className="w-full text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Acesse seus Pedidos</CardTitle>
                    <CardDescription>
                        Todos os seus pedidos e seus status estão disponíveis no seu painel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Olá, <span className="font-semibold">{user.displayName || user.email}</span>!
                    </p>
                    <Button asChild size="lg">
                        <Link href="/dashboard">
                            <User className="mr-2" />
                            Ir para Meu Painel
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  // Usuário não está logado
  return (
    <div className="container max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-14rem)]">
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Rastrear Pedido</CardTitle>
          <CardDescription>
            Para rastrear seus pedidos, você precisa acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-4 text-muted-foreground">Faça login para ver o histórico e o status dos seus pedidos.</p>
            <Button asChild size="lg">
                <Link href="/login">
                    <LogIn className="mr-2" />
                    Fazer Login
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
