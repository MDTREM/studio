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
import { Loader2, PlusCircle, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const categoryFormSchema = z.object({
  id: z.string().min(2, { message: 'O ID deve ter pelo menos 2 caracteres.' }).regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífens.'),
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  imageUrl: z.string().url({ message: 'Por favor, insira uma URL válida ou faça upload de uma imagem.' }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { firestore, storage } = useFirebase();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: '',
      name: '',
      imageUrl: '',
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

    const categoryRef = doc(firestore, 'categories', data.id);
    
    // The imageHint is no longer part of the form, so we don't include it.
    const categoryData = {
      id: data.id,
      name: data.name,
      imageUrl: data.imageUrl,
    }

    setDocumentNonBlocking(categoryRef, categoryData, { merge: false });
    
    toast({
        title: 'Categoria Adicionada!',
        description: `A categoria "${data.name}" foi criada com sucesso.`,
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar Categoria
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da nova categoria. O ID será usado na URL.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID da Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: cartoes-de-visita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder="URL da imagem ou faça upload" {...field} />
                        </FormControl>
                        <Input id={`upload-category-new`} type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                        <Button type="button" variant="outline" size="icon" asChild>
                            <Label htmlFor={`upload-category-new`} className="cursor-pointer"><Upload className="h-4 w-4" /></Label>
                        </Button>
                    </div>
                    {uploadProgress > 0 && <Progress value={uploadProgress} className="h-2 mt-2" />}
                    <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar categoria
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
