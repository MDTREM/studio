import { orders } from "@/lib/data";
import { Order } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const statusColors = {
  'Em análise': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Em produção': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Pronto para retirada': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Entregue': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function DashboardPage() {
  const userOrders = orders.slice(0, 3); // Simulating orders for a logged-in user

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
              {userOrders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border", statusColors[order.status])}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
