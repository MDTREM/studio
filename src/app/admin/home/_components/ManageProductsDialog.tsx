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
import { HomepageSection, Product } from '@/lib/definitions';
import { Check, ChevronsUpDown, Loader2, Pencil } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CommandList } from 'cmdk';

interface ManageProductsDialogProps {
  section: HomepageSection;
  allProducts: Product[];
}

export default function ManageProductsDialog({ section, allProducts }: ManageProductsDialogProps) {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(section.productIds || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!firestore) return;
    setIsSubmitting(true);
    const sectionRef = doc(firestore, 'homepage_sections', section.id);
    try {
        await updateDoc(sectionRef, { productIds: selectedProductIds });
        toast({
          title: 'Produtos atualizados!',
          description: `A seção "${section.title}" foi atualizada com sucesso.`,
        });
        setIsSubmitting(false);
        setOpen(false);
    } catch (error: any) {
        toast({
            title: 'Erro ao atualizar',
            description: error.message,
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  };
  
  const productOptions = allProducts.map(p => ({ value: p.id, label: p.name }));

  const handleSelect = (currentValue: string) => {
    setSelectedProductIds(prev => 
        prev.includes(currentValue)
            ? prev.filter(id => id !== currentValue)
            : [...prev, currentValue]
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-3.5 w-3.5 mr-2" />
          Gerenciar Produtos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Produtos em "{section.title}"</DialogTitle>
          <DialogDescription>
            Selecione os produtos que devem aparecer nesta seção.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-full justify-between"
              >
                {selectedProductIds.length > 0 ? `${selectedProductIds.length} produtos selecionados` : 'Selecione os produtos...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[375px] p-0">
              <Command>
                <CommandInput placeholder="Buscar produto..." />
                <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                        {productOptions.map((option) => (
                        <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={handleSelect}
                        >
                            <Check
                                className={cn(
                                    'mr-2 h-4 w-4',
                                    selectedProductIds.includes(option.value) ? 'opacity-100' : 'opacity-0'
                                )}
                            />
                            {option.label}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
