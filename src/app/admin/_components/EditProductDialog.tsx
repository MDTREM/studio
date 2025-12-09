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
import { Loader2, Trash2, Upload } from 'lucide-react';
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
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, query, updateDoc } from 'firebase/firestore';
import type { Product, Category } from '@/lib/definitions';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const productFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  shortDescription: z.string().min(10, { message: 'A descrição curta deve ter pelo menos 10 caracteres.' }),
  description: z.string().optional(),
  imageUrl: z.array(
    z.object({ value: z.string().url({ message: 'Por favor, insira uma URL válida.' }) })
  ).min(1, 'Adicione pelo menos uma URL de imagem.'),
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

interface EditProductDialogProps {
  product: Product;
  children: React.ReactNode;
}

const generateKeywords = (name: string): string[] => {
    if (!name) return [];
    const nameLower = name.toLowerCase();
    const words = nameLower.split(' ');
    const keywords = new Set<string>();

    keywords.add(nameLower);

    words.forEach(word => {
        if (word.length > 2) {
            keywords.add(word);
        }
    });

    for (const word of words) {
        if (word.length > 3) {
            for (let i = 3; i < word.length; i++) {
                keywords.add(word.substring(0, i));
            }
        }
    }

    return Array.from(keywords);
}

export default function EditProductDialog({ product, children }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { firestore, storage } = useFirebase();
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "categories"));
  }, [firestore]);
  const { data: categories } = useCollection<Category>(categoriesQuery);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description || '',
        imageUrl: product.imageUrl ? product.imageUrl.map(url => ({ value: url })) : [{ value: '' }],
        imageHint: product.imageHint || '',
        basePrice: product.basePrice,
        categoryId: product.categoryId,
        variations: {
            formats: product.variations.formats.join(', '),
            finishings: product.variations.finishings.join(', '),
            quantities: product.variations.quantities.join(', '),
        }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrl"
  });

  const handleFileUpload = (file: File, index: number) => {
    if (!storage) return;
    if (!file.type.startsWith('image/')) {
        toast({ title: "Formato inválido", description: "Por favor, selecione um arquivo de imagem.", variant: "destructive" });
        return;
    }

    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(prev => {
                const newProgress = [...prev];
                newProgress[index] = progress;
                return newProgress;
            });
        },
        (error) => {
            console.error("Upload error:", error);
            toast({ title: "Erro no Upload", description: "Não foi possível enviar a imagem.", variant: "destructive" });
            setUploadProgress(prev => {
                const newProgress = [...prev];
                newProgress[index] = 0;
                return newProgress;
            });
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                form.setValue(`imageUrl.${index}.value`, downloadURL, { shouldValidate: true });
                 setUploadProgress(prev => {
                    const newProgress = [...prev];
                    newProgress[index] = 0; // Reset progress
                    return newProgress;
                });
            });
        }
    );
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!firestore) return;

    const productRef = doc(firestore, 'products', product.id);

    const updatedProductData = {
        ...data,
        keywords: generateKeywords(data.name),
        imageUrl: data.imageUrl.map(url => url.value),
        variations: {
            ...data.variations,
            formats: data.variations.formats.split(',').map(s => s.trim()),
            finishings: data.variations.finishings.split(',').map(s => s.trim()),
            quantities: data.variations.quantities.split(',').map(s => parseInt(s.trim(), 10)),
        }
    };
    
    try {
        await updateDoc(productRef, updatedProductData);
        toast({
            title: 'Produto Atualizado!',
            description: `O produto "${data.name}" foi atualizado com sucesso.`,
        });
        setOpen(false);
    } catch (error: any) {
        console.error("Error updating document: ", error);
        toast({
            variant: 'destructive',
            title: 'Erro ao atualizar produto',
            description: error.message,
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Modifique os detalhes do produto.
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
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <div>
              <Label>Imagens do Produto</Label>
               {fields.map((field, index) => (
                <div key={field.id} className="mt-2 space-y-2">
                    <FormField
                    control={form.control}
                    name={`imageUrl.${index}.value`}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input placeholder="URL da imagem ou faça upload" {...field} />
                                </FormControl>
                                <Input id={`edit-upload-${index}`} type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], index)} />
                                <Button type="button" variant="outline" size="icon" asChild>
                                    <Label htmlFor={`edit-upload-${index}`} className="cursor-pointer"><Upload className="h-4 w-4" /></Label>
                                </Button>
                                {fields.length > 1 && (
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    {uploadProgress[index] > 0 && <Progress value={uploadProgress[index]} className="h-2" />}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: '' })}
                disabled={fields.length >= 10}
              >
                Adicionar outra Imagem
              </Button>
               <FormMessage>
                {form.formState.errors.imageUrl?.root?.message}
              </FormMessage>
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
                    Salvar alterações
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
