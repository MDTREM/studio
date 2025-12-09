'use client';

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
import { Button } from "@/components/ui/button";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { HomepageSection } from "@/lib/definitions";
import { doc, deleteDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

interface DeleteSectionDialogProps {
    section: HomepageSection;
}

export default function DeleteSectionDialog({ section }: DeleteSectionDialogProps) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!firestore) return;
        const sectionRef = doc(firestore, 'homepage_sections', section.id);
        try {
            await deleteDoc(sectionRef);
            toast({
              title: "Seção Excluída!",
              description: `A seção "${section.title}" foi removida permanentemente.`,
            });
        } catch (error: any) {
            toast({
                title: "Erro ao excluir",
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Isso excluirá permanentemente a seção
                    "{section.title}" e removerá ela da sua página inicial.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
