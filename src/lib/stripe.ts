import Stripe from 'stripe';

// Variável para armazenar a instância da Stripe em cache após a primeira inicialização.
let stripe: Stripe | null = null;

// Função para obter a instância da Stripe.
// Ela cria a instância na primeira vez que é chamada e a retorna nas chamadas subsequentes.
export const getStripe = (): Stripe => {
  // Se a instância já foi criada, retorne-a do cache.
  if (!stripe) {
    // Se a chave secreta não estiver definida em produção, lance um erro claro.
    // Isso só acontecerá em tempo de execução, não durante o build.
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY não está definida nas variáveis de ambiente.');
    }

    // Cria a nova instância da Stripe.
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return stripe;
};
