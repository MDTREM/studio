'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { User } from "@/lib/definitions";
import { collection, query } from "firebase/firestore";

export default function AdminCustomersPage() {
    const firestore = useFirestore();
    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "users"));
    }, [firestore]);

    const { data: users, isLoading } = useCollection<User>(usersQuery);

    if (isLoading) {
        return <div>Carregando clientes...</div>
    }

    if (!users) {
        return <div>Nenhum cliente encontrado.</div>
    }

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Clientes</CardTitle>
                    <CardDescription>
                        Visualize todos os clientes cadastrados na plataforma.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                                <TableHead>
                                    <span className="sr-only">Ações</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="hidden md:table-cell">{user.phone || '-'}</TableCell>
                                    <TableCell className="hidden md:table-cell">{user.address || '-'}</TableCell>
                                    <TableCell>
                                        {/* Ações como Ver Detalhes, etc, podem ser adicionadas aqui */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
