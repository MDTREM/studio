'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";

export default function ContatoPage() {
  const searchParams = useSearchParams();
  const assunto = searchParams.get('assunto') || '';

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Entre em Contato</CardTitle>
          <CardDescription>
            Preencha o formulário abaixo e nossa equipe retornará o mais breve possível.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" placeholder="Sobre o que você gostaria de falar?" defaultValue={assunto} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" placeholder="Digite sua mensagem aqui..." className="min-h-[120px]" required />
            </div>
            <Button type="submit" className="w-full">
              Enviar Mensagem
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
