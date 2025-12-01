'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { Order, OrderStatus } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { collection, query, doc, where, orderBy, getDocs, collectionGroup } from "firebase/firestore";
import { ListFilter, MoreHorizontal, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAdmin } from "../layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const statusColors: { [key in OrderStatus]: string } = {
    'Em análise': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Em produção': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Pronto para retirada': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Entregue': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const availableStatuses: OrderStatus[] = ['Em análise', 'Em produção', 'Pronto para retirada', 'Entregue', 'Cancelado'];

export default function AdminOrdersPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [statusFilters, setStatusFilters] = useState<OrderStatus[]>([]);
    const { isAdmin, isCheckingAdmin } = useAdmin(); // Consumir o contexto

    const allOrdersQuery = useMemoFirebase(() => {
        if (!firestore || isCheckingAdmin || !isAdmin) return null;
        
        const baseQuery = collectionGroup(firestore, 'orders');
        const queryConstraints: any[] = [orderBy("createdAt", "desc")];
        
        if (statusFilters.length > 0) {
            queryConstraints.push(where("status", "in", statusFilters));
        }

        return query(baseQuery, ...queryConstraints);
    }, [firestore, statusFilters, isCheckingAdmin, isAdmin]);

    const { data: allOrders, isLoading } = useCollection<Order>(allOrdersQuery);
    
    const handleStatusChange = (orderId: string, customerId: string, newStatus: OrderStatus) => {
        if (!firestore) return;
        const orderDocRef = doc(firestore, 'users', customerId, 'orders', orderId);
        updateDocumentNonBlocking(orderDocRef, { status: newStatus });

        toast({
            title: "Status Atualizado!",
            description: `O pedido foi atualizado para "${newStatus}".`,
        });
    }

    const handleFilterChange = (status: OrderStatus, checked: boolean) => {
        setStatusFilters(prev => {
            if (checked) {
                return [...prev, status];
            } else {
                return prev.filter(s => s !== status);
            }
        });
    }

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Pedidos</h1>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Filtrar
                            </span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableStatuses.map(status => (
                            <DropdownMenuCheckboxItem 
                                key={status}
                                checked={statusFilters.includes(status)}
                                onCheckedChange={(checked) => handleFilterChange(status, !!checked)}
                            >
                                {status}
                            </DropdownMenuCheckboxItem>
                        ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Card>
                <CardHeader>
                <CardTitle>Gerenciamento de Pedidos</CardTitle>
                <CardDescription>
                    Acompanhe e atualize o status de todos os pedidos.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    {(isLoading || isCheckingAdmin) && <div>Carregando pedidos...</div>}
                    {!isLoading && !isCheckingAdmin && !allOrders?.length && <div className="py-8 text-center text-muted-foreground">Nenhum pedido encontrado.</div>}
                    {allOrders && allOrders.length > 0 && (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-20"><span className="sr-only">Expandir</span></TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead className="hidden sm:table-cell">Itens</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Data</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead>
                                    <span className="sr-only">Ações</span>
                                </TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {allOrders.map((order: Order) => (
                                <Accordion type="single" collapsible asChild key={order.id}>
                                <AccordionItem value={order.id!} asChild>
                                    <>
                                    <TableRow>
                                        <TableCell>
                                            <AccordionTrigger className="p-0 [&[data-state=open]>svg]:rotate-90">
                                                <Package className="h-4 w-4" />
                                            </AccordionTrigger>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="hidden text-sm text-muted-foreground md:inline">
                                            {order.customerEmail}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{order.items?.length || 0}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("border", statusColors[order.status])}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {order.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Mudar Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {availableStatuses.map(status => (
                                                        <DropdownMenuItem 
                                                            key={status} 
                                                            onClick={() => handleStatusChange(order.id!, order.customerId, status)}
                                                            disabled={order.status === status}
                                                        >
                                                            {status}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell colSpan={7} className="p-0">
                                        <AccordionContent>
                                            <div className="p-6 bg-muted/50">
                                                <h4 className="font-semibold mb-2">Detalhes do Pedido #{order.id?.substring(0, 7)}</h4>
                                                <div className="space-y-2">
                                                    {order.items?.map((item, index) => (
                                                        <div key={index} className="flex justify-between items-center text-sm p-2 rounded bg-background">
                                                            <div>
                                                                <p><span className="font-medium">{item.quantity}x</span> {item.productName}</p>
                                                                <p className="text-xs text-muted-foreground">{item.variation.format} / {item.variation.finishing} {item.artworkFee > 0 && "/ Com Design"}</p>
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
                            ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
