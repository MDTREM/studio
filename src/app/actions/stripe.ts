'use server';

import { CartItem } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = headers().get('origin') || 'http://localhost:9002';
    
    try {
        const line_items = items.map(item => ({
            price_data: {
                currency: 'brl',
                product_data: {
                    name: item.product.name,
                    description: `${item.selectedFormat} / ${item.selectedFinishing}`,
                    images: [item.product.imageUrls[0]],
                },
                unit_amount: Math.round(item.totalPrice / item.quantity * 100), // Preço por unidade em centavos
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'boleto'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            client_reference_id: userId, // Adiciona o ID do usuário do Firebase
            metadata: {
                // Converte o carrinho para uma string JSON para ser armazenado nos metadados
                cartItems: JSON.stringify(items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    selectedFormat: item.selectedFormat,
                    selectedFinishing: item.selectedFinishing,
                })))
            }
        });

        return { sessionId: session.id };
    } catch (error: any) {
        console.error("Stripe Action Error:", error);
        return { error: "Não foi possível criar a sessão de pagamento." };
    }
}
