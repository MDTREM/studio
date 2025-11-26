'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { AuthError } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLoginError = (error: AuthError) => {
    console.error('Error signing in:', error);
    let description = 'Ocorreu um erro desconhecido. Tente novamente.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'E-mail ou senha inválidos. Por favor, verifique suas credenciais.';
    }
    toast({
      variant: 'destructive',
      title: 'Erro ao entrar',
      description: description,
    });
    setIsSubmitting(false); // Re-enable the form
  }

  const handleLogin = async () => {
    if (!auth) return;
    setIsSubmitting(true);
    // initiateEmailSignIn is non-blocking. The useEffect above will handle the redirect on success.
    // We now pass an error handler callback.
    initiateEmailSignIn(auth, email, password, handleLoginError);
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
            <Input id="email" type="email" placeholder="m@exemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting} />
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={isSubmitting || isUserLoading}>
            {isSubmitting || isUserLoading ? 'Entrando...' : 'Entrar'}
          </Button>
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
