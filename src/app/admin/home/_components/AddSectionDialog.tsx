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
import { setDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';

const sectionFormSchema = z.object({
  id: z.string().min(3, 'ID deve ter pelo menos 3 caracteres').regex(/^[a-z0-9_]+$/, 'Use apenas letras minúsculas, números e underscore.'),
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

export default function AddSectionDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      id: '',
      title: '',
    },
  });

  const onSubmit = (data: SectionFormValues) => {
    if (!firestore) return;

    // Use o ID do formulário para criar a referência do documento
    const sectionRef = doc(firestore, 'homepage_sections', data.id);

    const sectionData = {
      ...data,
      active: true,
      order: 99, // Será reordenado, colocado no final inicialmente.
      productIds: [],
      createdAt: serverTimestamp(),
    };
    
    // Use setDocumentNonBlocking para criar o documento com o ID especificado
    setDocumentNonBlocking(sectionRef, sectionData, { merge: false });
    
    toast({
      title: 'Seção Adicionada!',
      description: `A seção "${data.title}" foi criada com sucesso.`,
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
            Adicionar Seção
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Seção</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da nova seção da página inicial.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID da Seção</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: mais_vendidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Seção</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mais Vendidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Seção
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
