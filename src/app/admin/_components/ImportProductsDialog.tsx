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
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { Loader2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { Label } from '@/components/ui/label';

const generateKeywords = (name: string): string[] => {
    if (!name) return [];
    const nameLower = name.toLowerCase();
    const words = nameLower.split(' ');
    const keywords = new Set<string>();
    keywords.add(nameLower);
    words.forEach(word => {
        if (word.length > 2) keywords.add(word);
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

export default function ImportProductsDialog() {
  const [open, setOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo CSV para importar.',
      });
      return;
    }

    setIsImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const products = results.data as any[];
        if (products.length === 0) {
          toast({ variant: 'destructive', title: 'Arquivo vazio ou inválido' });
          setIsImporting(false);
          return;
        }

        try {
          const batch = writeBatch(firestore);
          let importedCount = 0;

          products.forEach((productData, index) => {
            // Basic validation
            if (!productData.name || !productData.basePrice || !productData.categoryId) {
                console.warn(`Skipping row ${index + 2}: missing required fields`);
                return;
            }

            const docId = productData.id || doc(collection(firestore, '_')).id;
            const productRef = doc(firestore, 'products', docId);

            const newProduct = {
              id: docId,
              name: productData.name,
              shortDescription: productData.shortDescription || '',
              description: productData.description || '',
              imageUrl: (productData.imageUrl || '').split(',').map((s:string) => s.trim()),
              imageHint: productData.imageHint || '',
              basePrice: parseFloat(productData.basePrice),
              categoryId: productData.categoryId,
              keywords: generateKeywords(productData.name),
              variations: {
                formats: (productData.formats || '').split(',').map((s:string) => s.trim()),
                finishings: (productData.finishings || '').split(',').map((s:string) => s.trim()),
                quantities: (productData.quantities || '').split(',').map((s:string) => parseInt(s.trim(), 10)),
              },
              createdAt: new Date(),
            };
            
            batch.set(productRef, newProduct, { merge: true });
            importedCount++;
          });

          await batch.commit();

          toast({
            title: 'Importação Concluída!',
            description: `${importedCount} produtos foram importados/atualizados com sucesso.`,
          });
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Erro na importação',
            description: error.message,
          });
        } finally {
          setIsImporting(false);
          setFile(null);
          setOpen(false);
        }
      },
      error: (error: any) => {
        toast({
            variant: 'destructive',
            title: 'Erro ao ler arquivo',
            description: error.message,
          });
        setIsImporting(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <Upload className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Importar
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Produtos por CSV</DialogTitle>
          <DialogDescription>
            Selecione um arquivo .csv para adicionar ou atualizar produtos em massa.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="file-upload">Arquivo CSV</Label>
                <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            <div className='text-xs text-muted-foreground space-y-2 p-4 bg-secondary/50 rounded-md'>
                <p className='font-bold'>Instruções:</p>
                <p>O arquivo deve ter as colunas: `id` (opcional), `name`, `shortDescription`, `description`, `imageUrl`, `imageHint`, `basePrice`, `categoryId`, `formats`, `finishings`, `quantities`.</p>
                <p>Para campos com múltiplos valores (como `imageUrl` ou `formats`), separe os valores por vírgulas (ex: "url1,url2,url3").</p>
                <p>Se um `id` for fornecido e já existir, o produto será atualizado. Caso contrário, um novo produto será criado.</p>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={isImporting || !file}>
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isImporting ? 'Importando...' : 'Iniciar Importação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
