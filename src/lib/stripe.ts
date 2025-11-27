import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('STRIPE_SECRET_KEY is not set in production environment variables.');
      } else {
        // Provide a dummy key for build/dev environments if needed, but erroring is safer.
        throw new Error('STRIPE_SECRET_KEY is not set. Please add it to your .env.local file.');
      }
    }

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return stripe;
};
