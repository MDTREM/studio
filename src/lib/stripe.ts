'use client';
import Stripe from 'stripe';

// Declara a variável stripe que pode ser nula inicialmente.
let stripe: Stripe | null = null;

// A função getStripe agora serve para inicializar a instância se ela ainda não existir.
export const getStripe = (): Stripe => {
  // Se a instância já foi criada, retorne-a.
  if (!stripe) {
    // Se a chave secreta não estiver definida em produção, lance um erro.
    // Isso evita que a aplicação execute sem a configuração necessária.
    if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
        throw new Error('STRIPE_SECRET_KEY is not set in production environment variables for runtime.');
    }

    // Cria a instância da Stripe. Em ambientes de não produção sem a chave,
    // a string vazia permitirá que o build passe, mas as chamadas de API falharão em tempo de execução.
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return stripe;
};
