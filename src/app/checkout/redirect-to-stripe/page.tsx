'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Carregue a chave pública da Stripe a partir das variáveis de ambiente.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RedirectToStripePage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    const redirectToCheckout = async () => {
      if (!sessionId) {
        toast({
          variant: 'destructive',
          title: 'Erro no Checkout',
          description: 'ID da sessão de pagamento não encontrado.',
        });
        return;
      }

      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe.js não foi carregado.');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Erro ao redirecionar para o checkout da Stripe:", error);
          throw new Error(error.message);
        }
      } catch (err: any) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível redirecionar',
          description: err.message || 'Houve um problema ao conectar com o sistema de pagamento.',
        });
      }
    };

    redirectToCheckout();
  }, [sessionId, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Redirecionando para o pagamento...</h1>
        <p className="text-muted-foreground mt-2">Por favor, aguarde. Você será redirecionado para um ambiente seguro para finalizar sua compra.</p>
    </div>
  );
}