'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore, setDocumentNonBlocking, useUser } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AuthError, onAuthStateChanged } from 'firebase/auth';

export default function SignupPage() {
  const [accountType, setAccountType] = useState('pf');
  const [date, setDate] = useState<Date | undefined>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cpf, setCpf] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if user becomes authenticated
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async () => {
    if (!auth || !firestore) return;
    setIsSubmitting(true);

    try {
      const unsubscribe = onAuthStateChanged(auth, (newUser) => {
        if (newUser) {
          const userRef = doc(firestore, "users", newUser.uid);
          const userData = {
              id: newUser.uid,
              email,
              name: accountType === 'pf' ? name : companyName,
              phone,
              address,
              isAdmin: false,
              ...(accountType === 'pf' && { cpf, birthDate: date }),
              ...(accountType === 'pj' && { companyName, tradingName, cnpj }),
          };
          setDocumentNonBlocking(userRef, userData, { merge: true });
          unsubscribe();
          // The useEffect will handle the redirect to /dashboard
        }
      });
      // The function was being called without arguments, causing the error.
      initiateEmailSignUp(auth, email, password);

    } catch (error) {
      console.error('Error signing up:', error);
      const authError = error as AuthError;
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: authError.message,
      });
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar uma conta</CardTitle>
          <CardDescription>
            Insira suas informações para criar uma conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>Tipo de cadastro</Label>
            <RadioGroup defaultValue="pf" onValueChange={setAccountType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pf" id="pf" />
                <Label htmlFor="pf">Pessoa Física</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pj" id="pj" />
                <Label htmlFor="pj">Pessoa Jurídica</Label>
              </div>
            </RadioGroup>
          </div>

          {accountType === 'pf' ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Seu Nome Completo" required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" required value={cpf} onChange={e => setCpf(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "dd/MM/yyyy") : <span>Selecione a data</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="companyName">Razão Social</Label>
                <Input id="companyName" placeholder="Nome da sua empresa" required value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tradingName">Nome Fantasia</Label>
                <Input id="tradingName" placeholder="Nome popular da sua empresa" value={tradingName} onChange={e => setTradingName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0001-00" required value={cnpj} onChange={e => setCnpj(e.target.value)} />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" placeholder="(11) 99999-9999" required value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" placeholder="Rua, Número, Bairro, Cidade - Estado" required value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemplo.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleSignup} disabled={isSubmitting || isUserLoading}>
            {isSubmitting || isUserLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/login" className="underline text-primary">
            Acessar
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
