'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acessar sua conta</CardTitle>
          <CardDescription>
            Use seu e-mail e senha ou provedor social.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemplo.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required />
          </div>
          <Button className="w-full">Entrar</Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.62-3.8 1.62-3.36 0-6.2-2.73-6.2-6.1s2.84-6.1 6.2-6.1c1.8 0 3 .74 3.9 1.62l2.55-2.55C17.52 3.14 15.22 2 12.48 2c-5.4 0-9.9 4.5-9.9 9.9s4.5 9.9 9.9 9.9c2.73 0 4.93-1 6.5-2.58 1.6-1.6 2.3-4 2.3-6.4 0-.5-.07-.9-.12-1.32H12.48z"></path></svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="#" className="underline text-primary">
            Crie agora
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
