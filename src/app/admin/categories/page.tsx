'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import AddCategoryDialog from "./_components/AddCategoryDialog";
import EditCategoryDialog from "./_components/EditCategoryDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";

export default function AdminCategoriesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "categories"));
  }, [firestore]);

  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  const categoryMap = useMemo(() => {
    if (!categories) return new Map();
    return new Map(categories.map(c => [c.id, c.name]));
  }, [categories]);

  const handleDelete = (categoryId: string, categoryName: string) => {
    if (!firestore) return;
    const categoryRef = doc(firestore, 'categories', categoryId);
    deleteDocumentNonBlocking(categoryRef);
    toast({
      title: "Categoria Excluída!",
      description: `A categoria "${categoryName}" foi removida.`,
    });
  };

  if (isLoading) {
    return <div>Carregando categorias...</div>;
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Categorias</h1>
        <div className="ml-auto flex items-center gap-2">
            <AddCategoryDialog />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Categorias</CardTitle>
          <CardDescription>
            Adicione, edite e remova categorias de produtos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Imagem</span>
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">ID</TableHead>
                <TableHead>Categoria Pai</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories && categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={category.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={category.imageUrl || 'https://placehold.co/64x64/FF6B07/white?text=Sem+Img'}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{category.id}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.parentId ? categoryMap.get(category.parentId) : 'Nenhuma'}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <EditCategoryDialog category={category}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              Editar
                            </DropdownMenuItem>
                          </EditCategoryDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                              Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente a categoria
                            "{category.name}". Se esta categoria for pai de outras, elas ficarão órfãs.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(category.id, category.name)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && !categories?.length && (
            <div className="text-center p-4">
              Nenhuma categoria encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
