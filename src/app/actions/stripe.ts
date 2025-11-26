'use server';

import { CartItem } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = headers().get('origin') || 'http://localhost:9003';
    
    try {
        const line_items = items.map(item => {
            // Lógica de cálculo robusta para o preço unitário em centavos.
            const unitAmount = item.totalPrice / item.quantity;
            const unitAmountInCents = Math.round(unitAmount * 100);

            // Garante que o valor seja pelo menos o mínimo aceitável pela Stripe (ex: R$0,50 ou BRL 50 centavos)
            // A Stripe exige um valor mínimo (geralmente 50 centavos para BRL).
            if (unitAmountInCents < 50) {
                 throw new Error(`O valor calculado para o produto ${item.product.name} é inválido (menor que o mínimo).`);
            }

            const validImages = item.product.imageUrls.filter(url => url && url.startsWith('http'));

            return {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: item.product.name,
                        description: `${item.selectedFormat} / ${item.selectedFinishing}`,
                        ...(validImages.length > 0 && { images: [validImages[0]] })
                    },
                    unit_amount: unitAmountInCents,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            client_reference_id: userId, 
            metadata: {
                cartItems: JSON.stringify(items.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    selectedFormat: item.selectedFormat,
                    selectedFinishing: item.selectedFinishing,
                })))
            }
        });

        return { sessionId: session.id };
    } catch (error: any) {
        // Log do erro detalhado no servidor para diagnóstico
        console.error("Erro ao criar sessão de checkout da Stripe:", error.message);
        // Retorna uma mensagem de erro clara para o cliente
        return { error: `Não foi possível criar a sessão de pagamento: ${error.message}` };
    }
}
