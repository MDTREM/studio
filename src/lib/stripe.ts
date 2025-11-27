import Stripe from 'stripe';

// We need to check for the key at runtime, but not during the build process.
// Vercel (and other platforms) might not have production environment variables
// available at build time.
if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
    // This check will now only run in a production runtime environment.
    throw new Error('STRIPE_SECRET_KEY is not set in the environment variables for production runtime.');
}

// Initialize Stripe with the secret key. The empty string fallback allows the build to pass.
// The check above will prevent the app from running in production without the key.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
  typescript: true,
});
