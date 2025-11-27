'use client';
import Stripe from 'stripe';

// Variável para armazenar a instância da Stripe em cache após a primeira inicialização.
let stripe: Stripe | null = null;

// Função para obter a instância da Stripe.
// Ela cria a instância na primeira vez que é chamada e a retorna nas chamadas subsequentes.
export const getStripe = (): Stripe => {
  // Se a instância já foi criada, retorne-a do cache.
  if (stripe) {
    return stripe;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Em produção, a chave É obrigatória. Lança erro se não estiver definida.
  if (process.env.NODE_ENV === 'production' && !secretKey) {
    throw new Error('STRIPE_SECRET_KEY não está definida nas variáveis de ambiente para o ambiente de produção.');
  }
  
  // Cria a nova instância da Stripe.
  // O fallback para '' é para o ambiente de build, que não precisa da chave real.
  stripe = new Stripe(secretKey ?? '', {
    apiVersion: '2024-06-20',
    typescript: true,
  });

  return stripe;
};
