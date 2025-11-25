'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

const productFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  shortDescription: z.string().min(10, { message: 'A descrição curta deve ter pelo menos 10 caracteres.' }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }),
  imageHint: z.string().optional(),
  basePrice: z.coerce.number().positive({ message: 'O preço deve ser um número positivo.' }),
  categoryId: z.string().min(1, { message: 'A categoria é obrigatória.' }),
  variations: z.object({
    formats: z.string().min(1, { message: 'Pelo menos um formato é obrigatório.'}),
    finishings: z.string().min(1, { message: 'Pelo menos um acabamento é obrigatório.'}),
    quantities: z.string().min(1, { message: 'Pelo menos uma quantidade é obrigatória.'}),
  })
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
        name: '',
        shortDescription: '',
        description: '',
        imageUrl: '',
        imageHint: '',
        basePrice: 0,
        categoryId: '',
        variations: {
            formats: '',
            finishings: '',
            quantities: '',
        }
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (!firestore) return;

    const productData = {
        ...data,
        createdAt: serverTimestamp(),
        variations: {
            ...data.variations,
            // Convert comma-separated strings to arrays
            formats: data.variations.formats.split(',').map(s => s.trim()),
            finishings: data.variations.finishings.split(',').map(s => s.trim()),
            quantities: data.variations.quantities.split(',').map(s => parseInt(s.trim(), 10)),
        }
    };
    
    addDocumentNonBlocking(collection(firestore, 'products'), productData)
      .then(() => {
        toast({
          title: 'Produto Adicionado!',
          description: `O produto "${data.name}" foi criado com sucesso.`,
        });
        setOpen(false);
        form.reset();
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Erro ao adicionar produto',
          description: error.message,
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar Produto
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do novo produto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cartão de Visita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Input placeholder="Uma breve descrição para a listagem" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Completa (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva os detalhes do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID da Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: cartoes-visita" {...field} />
                  </FormControl>
                   <FormDescription>
                    Este deve ser o mesmo ID usado na URL (ex: /catalogo?categoria=adesivos)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Preço Base (R$)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                        <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <h4 className="font-medium text-lg mt-4">Variações do Produto</h4>
            <p className="text-sm text-muted-foreground -mt-2 mb-2">Insira os valores separados por vírgula. Ex: 1000, 2000, 5000</p>
            <div className="grid grid-cols-1 gap-4">
                 <FormField
                    control={form.control}
                    name="variations.quantities"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantidades</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: 100,250,500" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="variations.formats"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Formatos/Tamanhos</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: 9x5cm, 10x15cm" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="variations.finishings"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Acabamentos</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Laminação Fosca, Verniz Localizado" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar produto
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
