'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { AuthError, signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      initiateEmailSignIn(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      const authError = error as AuthError;
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description: authError.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acessar sua conta</CardTitle>
          <CardDescription>
            Use seu e-mail e senha para entrar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleLogin}>Entrar</Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/signup" className="underline text-primary">
            Crie agora
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
