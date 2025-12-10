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
import { Loader2, PlusCircle, Trash2, Upload } from 'lucide-react';
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
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, serverTimestamp, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/lib/definitions';
import { Switch } from '@/components/ui/switch';

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
  }),
  showOnHome: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNew: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const generateKeywords = (name: string): string[] => {
    if (!name) return [];
    const nameLower = name.toLowerCase();
    const words = nameLower.split(' ');
    const keywords = new Set<string>();

    // Add full name
    keywords.add(nameLower);

    // Add individual words
    words.forEach(word => {
        if (word.length > 2) { // Avoid very short words
            keywords.add(word);
        }
    });

    // Add partial strings
    for (const word of words) {
        if (word.length > 3) {
            for (let i = 3; i < word.length; i++) {
                keywords.add(word.substring(0, i));
            }
        }
    }

    return Array.from(keywords);
}

export default function AddProductDialog() {
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
        name: '',
        shortDescription: '',
        description: '',
        imageUrl: [{ value: '' }],
        imageHint: '',
        basePrice: 0,
        categoryId: '',
        variations: {
            formats: '',
            finishings: '',
            quantities: '',
        },
        showOnHome: false,
        isBestseller: false,
        isNew: false,
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

    const productData = {
        ...data,
        createdAt: serverTimestamp(),
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
        await addDoc(collection(firestore, 'products'), productData);
        toast({
          title: 'Produto Adicionado!',
          description: `O produto "${data.name}" foi criado com sucesso.`,
        });
        setOpen(false);
        form.reset();
      } catch (error: any) {
        console.error("Error adding document: ", error);
        toast({
          variant: 'destructive',
          title: 'Erro ao adicionar produto',
          description: error.message,
        });
      }
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
                                <Input id={`upload-${index}`} type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], index)} />
                                <Button type="button" variant="outline" size="icon" asChild>
                                    <Label htmlFor={`upload-${index}`} className="cursor-pointer"><Upload className="h-4 w-4" /></Label>
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
            <FormField
              control={form.control}
              name="showOnHome"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                  <div className="space-y-0.5">
                    <FormLabel>Mostrar na Página Inicial</FormLabel>
                    <FormDescription>
                      Marque para destacar este produto na home.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isBestseller"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Marcar como Mais Vendido</FormLabel>
                    <FormDescription>
                      Este produto aparecerá na seção "Mais Vendidos".
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isNew"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Marcar como Novidade</FormLabel>
                    <FormDescription>
                      Este produto aparecerá na seção "Novidades".
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
