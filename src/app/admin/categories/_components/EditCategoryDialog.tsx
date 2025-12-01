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
import { Loader2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking, useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, doc, query } from 'firebase/firestore';
import type { Category } from '@/lib/definitions';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const categoryFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  imageUrl: z.string().url({ message: 'Por favor, insira uma URL válida.' }).optional().or(z.literal('')),
  parentId: z.string().optional(),
  showOnHome: z.boolean().default(true),
  showInMenu: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface EditCategoryDialogProps {
  category: Category;
  children: React.ReactNode;
}

export default function EditCategoryDialog({ category, children }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { firestore, storage } = useFirebase();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "categories"));
  }, [firestore]);
  const { data: categories } = useCollection<Category>(categoriesQuery);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      imageUrl: category.imageUrl || '',
      parentId: category.parentId || '',
      showOnHome: category.showOnHome ?? true,
      showInMenu: category.showInMenu ?? true,
    },
  });

  const handleFileUpload = (file: File) => {
    if (!storage) return;
    if (!file.type.startsWith('image/')) {
        toast({ title: "Formato inválido", description: "Por favor, selecione um arquivo de imagem.", variant: "destructive" });
        return;
    }

    const storageRef = ref(storage, `categories/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
        },
        (error) => {
            console.error("Upload error:", error);
            toast({ title: "Erro no Upload", description: "Não foi possível enviar a imagem.", variant: "destructive" });
            setUploadProgress(0);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                form.setValue(`imageUrl`, downloadURL, { shouldValidate: true });
                setUploadProgress(0); // Reset progress
            });
        }
    );
  };

  const onSubmit = (data: CategoryFormValues) => {
    if (!firestore) return;

    const categoryRef = doc(firestore, 'categories', category.id);
    
    const updatedData = {
        name: data.name,
        imageUrl: data.imageUrl,
        parentId: data.parentId || null,
        showOnHome: data.showOnHome,
        showInMenu: data.showInMenu,
    }

    updateDocumentNonBlocking(categoryRef, updatedData);
    
    toast({
        title: 'Categoria Atualizada!',
        description: `A categoria "${data.name}" foi atualizada com sucesso.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Modifique os detalhes da categoria. O ID não pode ser alterado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <FormItem>
                <FormLabel>ID da Categoria</FormLabel>
                <FormControl>
                    <Input disabled value={category.id} />
                </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cartões de Visita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategoria de (Opcional)</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhuma (categoria principal)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Remove the current category from the list of possible parents */}
                      {categories?.filter(c => c.id !== category.id).map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem (Opcional)</FormLabel>
                   <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder="URL da imagem ou faça upload" {...field} />
                        </FormControl>
                        <Input id={`upload-category-edit-${category.id}`} type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                        <Button type="button" variant="outline" size="icon" asChild>
                            <Label htmlFor={`upload-category-edit-${category.id}`} className="cursor-pointer"><Upload className="h-4 w-4" /></Label>
                        </Button>
                    </div>
                    {uploadProgress > 0 && <Progress value={uploadProgress} className="h-2 mt-2" />}
                  <FormDescription>
                    Use o link direto da imagem (final .png, .jpg) ou faça o upload.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="showOnHome"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Mostrar na Página Inicial</FormLabel>
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
              name="showInMenu"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Mostrar no Menu Principal</FormLabel>
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
                    Salvar alterações
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
