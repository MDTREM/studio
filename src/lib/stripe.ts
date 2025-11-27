import Stripe from 'stripe';

// During the build process on Vercel, environment variables might not be available.
// We check if we are in a build environment (where VERCEL_ENV is defined)
// and relax the requirement for the key. It will still be required at runtime.
if (!process.env.STRIPE_SECRET_KEY && process.env.VERCEL_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is not set in the environment variables for production runtime.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
  typescript: true,
});
