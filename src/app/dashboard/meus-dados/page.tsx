'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoc, useFirebase, useUser } from "@/firebase";
import { User } from "@/lib/definitions";
import { doc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  document: z.string().optional(), // Para CPF/CNPJ
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function MyDataPage() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isDataLoading } = useDoc<User>(userDocRef);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        values: {
            name: userData?.name || '',
            phone: userData?.phone || '',
            address: userData?.address || '',
            document: userData?.document || userData?.cpf || userData?.cnpj || '',
        }
    });

    const onSubmit = async (data: ProfileFormValues) => {
        if (!userDocRef) return;
        try {
            await updateDoc(userDocRef, {
                name: data.name,
                phone: data.phone,
                address: data.address,
                document: data.document,
            });
            toast({
                title: "Dados atualizados!",
                description: "Suas informações foram salvas com sucesso.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar",
                description: "Não foi possível salvar suas informações. Tente novamente.",
            });
        }
    };

    if (isUserLoading || isDataLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Carregando seus dados...</p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Meus Dados</CardTitle>
                <CardDescription>
                    Mantenha suas informações de contato e entrega atualizadas.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo / Razão Social</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="document"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPF / CNPJ</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input type="tel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endereço de Entrega</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
