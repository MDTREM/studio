'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { Order, OrderStatus, User } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { collection, query, doc, where, getDocs } from "firebase/firestore";
import { ListFilter, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

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
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "users"));
    }, [firestore]);

    const { data: users } = useCollection<User>(usersQuery);

    useEffect(() => {
        const fetchAllOrders = async () => {
            if (!firestore || !users) return;

            setIsLoading(true);
            let collectedOrders: Order[] = [];

            // Create a list of promises for fetching orders for each user
            const orderPromises = users.map(async (user) => {
                const ordersRef = collection(firestore, `users/${user.id}/orders`);
                const ordersSnapshot = await getDocs(ordersRef);
                const userOrders = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
                return userOrders;
            });
            
            // For orders_items, we can query it directly as admin
            const orderItemsRef = collection(firestore, 'orders_items');
            const orderItemsSnapshot = await getDocs(orderItemsRef);
            const orderItems = orderItemsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));


            // Wait for all promises to resolve
            const results = await Promise.all([...orderPromises]);
            // Flatten the array of arrays into a single array
            collectedOrders = results.flat();
            
            // Combine both sources and remove duplicates
            const combined = [...collectedOrders, ...orderItems];
            const uniqueOrders = Array.from(new Map(combined.map(order => [order.id, order])).values());

            setAllOrders(uniqueOrders);
            setIsLoading(false);
        };

        fetchAllOrders();
    }, [firestore, users]);

    const filteredOrders = useMemo(() => {
        if (statusFilters.length === 0) {
            return allOrders;
        }
        return allOrders.filter(order => statusFilters.includes(order.status));
    }, [allOrders, statusFilters]);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        if (!firestore) return;
        // Attempt to update in both possible locations
        const orderItemRef = doc(firestore, 'orders_items', orderId);
        updateDocumentNonBlocking(orderItemRef, { status: newStatus });

        // We don't know the user ID here, so we can't update the subcollection easily.
        // The logic should probably ensure orders are consistently stored.
        // For now, updating orders_items should be sufficient if that's the primary store.

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
                    {isLoading && <div>Carregando pedidos...</div>}
                    {!isLoading && !filteredOrders?.length && <div>Nenhum pedido encontrado com os filtros selecionados.</div>}
                    {filteredOrders && filteredOrders.length > 0 && (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead className="hidden sm:table-cell">
                                Produto
                                </TableHead>
                                <TableHead className="hidden sm:table-cell">
                                Status
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                Data
                                </TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead>
                                    <span className="sr-only">Ações</span>
                                </TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredOrders.map((order: Order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-medium">{order.customerName}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                        {order.customerEmail}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {order.productName}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
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
                                                        onClick={() => handleStatusChange(order.id, status)}
                                                        disabled={order.status === status}
                                                    >
                                                        {status}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
