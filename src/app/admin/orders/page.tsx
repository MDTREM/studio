import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders } from "@/lib/data";
import { Order } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { ListFilter } from "lucide-react";

const statusColors = {
    'Em análise': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Em produção': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Pronto para retirada': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Entregue': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function AdminOrdersPage() {
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
                        <DropdownMenuCheckboxItem checked>
                            Em análise
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Em produção</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Entregue</DropdownMenuCheckboxItem>
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
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {orders.map((order: Order) => (
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
                                {new Date(order.date).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                                {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </>
    );
}
