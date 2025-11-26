'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { Order } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const statusColors = {
  'Em análise': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Em produção': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Pronto para retirada': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Entregue': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    useEffect(() => {
      // Quando o carregamento terminar e não houver usuário, redirecione para o login.
      if (!isUserLoading && !user) {
        router.push('/login');
      }
    }, [isUserLoading, user, router]);

    const userOrdersQuery = useMemoFirebase(() => {
        // Só cria a query se o usuário estiver carregado e existir.
        if (!firestore || !user) return null;
        return query(collection(firestore, "orders_items"), where("customerId", "==", user.uid));
    }, [firestore, user]);
    
    const { data: userOrders, isLoading: areOrdersLoading } = useCollection<Order>(userOrdersQuery);
    
    // Mostra o estado de carregamento enquanto o usuário ou os pedidos estão sendo carregados.
    if (isUserLoading || areOrdersLoading) {
        return <div className="container max-w-7xl mx-auto px-4 py-12 text-center">Carregando seus dados...</div>
    }

    // Se o carregamento terminou e ainda não há usuário, não renderize nada (o useEffect irá redirecionar).
    if (!user) {
        return null;
    }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Seu Painel</h1>
        <p className="text-muted-foreground mt-2">Veja e gerencie seus pedidos recentes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Pedidos</CardTitle>
          <CardDescription>A lista dos seus últimos pedidos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Pedido</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders && userOrders.length > 0 ? userOrders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border", statusColors[order.status])}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    {order.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">Nenhum pedido encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
