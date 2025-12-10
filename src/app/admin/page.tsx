'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/lib/definitions";
import { Copy, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import AddProductDialog from "./_components/AddProductDialog";
import EditProductDialog from "./_components/EditProductDialog";
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
import ImportProductsDialog from "./_components/ImportProductsDialog";
import { Badge } from "@/components/ui/badge";


export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleDuplicate = async (product: Product) => {
    if (!firestore) return;
    
    // Create a new product object, omitting the id and adding a copy suffix.
    const { id, ...productData } = product;
    const newProductData = {
      ...productData,
      name: `${product.name} (Cópia)`,
      createdAt: serverTimestamp(), // Set a new creation timestamp
      // Reset visibility flags
      showOnHome: false,
      isBestseller: false,
      isNew: false,
    };

    try {
      await addDoc(collection(firestore, 'products'), newProductData);
      toast({
        title: "Produto Duplicado!",
        description: `Uma cópia de "${product.name}" foi criada com sucesso.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao duplicar produto',
        description: error.message,
      });
    }
  };


  const handleDelete = async (productId: string, productName: string) => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', productId);
    try {
        await deleteDoc(productRef);
        toast({
          title: "Produto Excluído!",
          description: `O produto "${productName}" foi removido.`,
        });
    } catch (error: any) {
        toast({
            title: "Erro ao excluir",
            description: error.message,
            variant: "destructive"
        });
    }
  };

  if (isLoading) {
    return <div>Carregando produtos...</div>;
  }

  if (!products) {
    return (
      <div>
        <AddProductDialog />
        <p>Nenhum produto encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Produtos</h1>
        <div className="ml-auto flex items-center gap-2">
            <ImportProductsDialog />
            <AddProductDialog />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Produtos</CardTitle>
          <CardDescription>
            Adicione, edite e remova produtos do seu catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Visibilidade</TableHead>
                <TableHead className="hidden md:table-cell">
                  Preço Base
                </TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => {
                const imageUrl = product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl[0] : 'https://placehold.co/64x64/FF6B07/white?text=Sem+Img';
                return (
                <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={imageUrl}
                            width="64"
                            data-ai-hint={product.imageHint}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1.5">
                        <Badge variant={product.showOnHome ? "default" : "secondary"}>
                          {product.showOnHome ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                          Destaque
                        </Badge>
                        <Badge variant={product.isBestseller ? "default" : "secondary"}>
                          {product.isBestseller ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                          Mais Vendido
                        </Badge>
                         <Badge variant={product.isNew ? "default" : "secondary"}>
                          {product.isNew ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                          Novidade
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                                <EditProductDialog product={product}>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Editar
                                  </DropdownMenuItem>
                                </EditProductDialog>
                                <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>Duplicar</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>Excluir</DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto
                                "{product.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id, product.name)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
