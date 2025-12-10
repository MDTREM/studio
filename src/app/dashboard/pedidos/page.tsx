'use client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { Order, OrderItem, OrderStatus } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Package } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const statusColors: { [key in OrderStatus]: string } = {
  'Em análise': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Em produção': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'Pronto para retirada': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Entregue': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function DashboardOrdersPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userOrdersQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, "users", user.uid, "orders"), orderBy("createdAt", "desc"));
    }, [firestore, user]);
    
    const { data: userOrders, isLoading: areOrdersLoading } = useCollection<Order>(userOrdersQuery);
    
    if (user && areOrdersLoading) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Carregando seus pedidos...</p>
          </div>
        );
    }

  return (
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
                <TableHead>Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders && userOrders.length > 0 ? userOrders.map((order: Order) => (
                 <Accordion type="single" collapsible asChild key={order.id}>
                    <AccordionItem value={order.id!} asChild>
                        <>
                        <TableRow>
                            <TableCell className="font-medium flex items-center gap-2">
                                <AccordionTrigger className="p-0 [&[data-state=open]>svg]:rotate-90">
                                    <Package className="h-4 w-4" />
                                </AccordionTrigger>
                                {order.id?.substring(0, 7)}...
                            </TableCell>
                            <TableCell>{order.items?.length || 0}</TableCell>
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
                        <TableRow>
                            <TableCell colSpan={5} className="p-0">
                                <AccordionContent>
                                    <div className="p-4 bg-muted/50">
                                        <h4 className="font-semibold text-sm mb-2">Itens do Pedido</h4>
                                        <div className="space-y-1">
                                            {order.items?.map((item: OrderItem, index: number) => (
                                                <div key={index} className="flex justify-between items-center text-xs p-2 rounded bg-background">
                                                    <div>
                                                        <p><span className="font-medium">{item.quantity}x</span> {item.productName}</p>
                                                        <p className="text-muted-foreground">{item.variation.format} / {item.variation.finishing} {item.artworkFee > 0 && "/ Com Design"}</p>
                                                    </div>
                                                    <p className="font-medium">{item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </TableCell>
                        </TableRow>
                        </>
                    </AccordionItem>
                </Accordion>
              )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Você ainda não fez nenhum pedido.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
