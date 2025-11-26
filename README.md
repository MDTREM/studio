# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Product Management & Stripe

A quick note on how product management works with payment providers like Stripe:

You only need to create and manage your products in one place: **this application's admin panel**.

When a customer checks out, the application sends the product name and price directly to Stripe at the time of the transaction. You do **not** need to create or duplicate your products inside the Stripe dashboard. Use the Stripe dashboard for managing payments, payouts, and viewing financial reports, but use this site's admin panel as the single source of truth for your product catalog.
