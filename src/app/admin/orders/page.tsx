'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Order, OrderStatus, User } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { collection, query, doc, where, orderBy, getDocs, collectionGroup, updateDoc } from "firebase/firestore";
import { ListFilter, MoreHorizontal, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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
    const { isAdmin, isCheckingAdmin } = useAdmin();

    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchAllOrders = async () => {
            if (!firestore || !isAdmin) {
                if (!isCheckingAdmin) setIsLoading(false);
                return;
            };
            setIsLoading(true);

            try {
                const usersCollectionRef = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                const allUsers = usersSnapshot.docs.map(doc => doc.data() as User);

                const ordersPromises = allUsers.map(user => {
                    const ordersRef = collection(firestore, 'users', user.id, 'orders');
                    return getDocs(query(ordersRef, orderBy("createdAt", "desc")));
                });

                const ordersSnapshots = await Promise.all(ordersPromises);

                let fetchedOrders: Order[] = [];
                ordersSnapshots.forEach(snapshot => {
                    const userOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                    fetchedOrders = [...fetchedOrders, ...userOrders];
                });
                
                // Sort by creation date, descending
                fetchedOrders.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.orderDate);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.orderDate);
                    return dateB.getTime() - dateA.getTime();
                });

                setAllOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast({ title: 'Erro ao buscar pedidos', description: 'Não foi possível carregar os pedidos de todos os usuários.', variant: 'destructive' });
            } finally {
                setIsLoading(false);
            }
        };

        if (!isCheckingAdmin) {
            fetchAllOrders();
        }
    }, [firestore, isAdmin, isCheckingAdmin, toast]);
    
    const handleStatusChange = async (orderId: string, customerId: string, newStatus: OrderStatus) => {
        if (!firestore) return;
        const orderDocRef = doc(firestore, 'users', customerId, 'orders', orderId);
        
        try {
            await updateDoc(orderDocRef, { status: newStatus });
            // Update local state to reflect change immediately
            setAllOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );

            toast({
                title: "Status Atualizado!",
                description: `O pedido foi atualizado para "${newStatus}".`,
            });
        } catch (error: any) {
            toast({
                title: "Erro ao atualizar",
                description: error.message,
                variant: "destructive",
            });
        }
    }

    if (isCheckingAdmin) {
        return <div>Verificando permissões...</div>;
    }
    
    if (!isAdmin) {
        return null;
    }

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Pedidos</h1>
                <div className="ml-auto flex items-center gap-2">
                    {/* Filter button can be added here if needed */}
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
                    {(isLoading) && <div>Carregando pedidos...</div>}
                    {!isLoading && !allOrders?.length && <div className="py-8 text-center text-muted-foreground">Nenhum pedido encontrado.</div>}
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
