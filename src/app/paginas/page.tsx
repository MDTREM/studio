import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const mainRoutes = [
    { route: "/", description: "Página inicial com banners, categorias e produtos em destaque." },
    { route: "/catalogo", description: "Catálogo completo de todos os produtos, com filtros." },
    { route: "/produto/exemplo-id", description: "Página de detalhes de um produto específico (substitua o ID)." },
    { route: "/carrinho", description: "Carrinho de compras para revisar e finalizar o pedido." },
    { route: "/orcamento", description: "Formulário de orçamento online para produtos personalizados." },
    { route: "/atendimento", description: "Central de atendimento com FAQ e formas de contato." },
    { route: "/servicos", description: "Página sobre serviços de aluguel e conserto de impressoras." },
];

const userRoutes = [
    { route: "/login", description: "Página de login para clientes existentes." },
    { route: "/signup", description: "Página de cadastro para novos clientes." },
    { route: "/dashboard", description: "Painel do cliente, redireciona para 'Meus Pedidos'." },
    { route: "/dashboard/pedidos", description: "Lista de pedidos realizados pelo cliente." },
    { route: "/dashboard/meus-dados", description: "Formulário para o cliente editar seus dados cadastrais." },
    { route: "/desejos", description: "Lista de produtos favoritados pelo cliente." },
];

const adminRoutes = [
    { route: "/admin", description: "Painel de administração para gerenciar produtos." },
    { route: "/admin/categories", description: "Gerenciamento de categorias de produtos." },
    { route: "/admin/orders", description: "Visualização e gerenciamento de todos os pedidos dos clientes." },
    { route: "/admin/customers", description: "Lista de todos os clientes cadastrados." },
];

const checkoutRoutes = [
     { route: "/checkout/success", description: "Página de sucesso após um pagamento bem-sucedido (requer simulação)." },
     { route: "/checkout/cancel", description: "Página exibida se o pagamento for cancelado." },
];

export default function PaginasPage() {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Mapa do Site</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Use esta página para navegar facilmente entre as diferentes seções da aplicação.
                </p>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Páginas Principais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rota</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead className="text-right">Acessar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mainRoutes.map(item => (
                                    <TableRow key={item.route}>
                                        <TableCell className="font-mono">{item.route}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={item.route}>
                                                    Ir <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Área do Cliente</CardTitle>
                        <CardDescription>Requer login para a maioria das páginas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rota</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead className="text-right">Acessar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userRoutes.map(item => (
                                    <TableRow key={item.route}>
                                        <TableCell className="font-mono">{item.route}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={item.route}>
                                                    Ir <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Painel de Administração</CardTitle>
                        <CardDescription>Requer login com um usuário administrador.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rota</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead className="text-right">Acessar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminRoutes.map(item => (
                                    <TableRow key={item.route}>
                                        <TableCell className="font-mono">{item.route}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={item.route}>
                                                    Ir <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Fluxo de Pagamento</CardTitle>
                        <CardDescription>Essas páginas são acessadas via redirecionamento do Stripe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rota</TableHead>
                                    <TableHead>Descrição</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {checkoutRoutes.map(item => (
                                    <TableRow key={item.route}>
                                        <TableCell className="font-mono">{item.route}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
