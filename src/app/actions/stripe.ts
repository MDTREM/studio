'use server';

import { CartItem } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = headers().get('origin') || 'http://localhost:9003';
    
    try {
        const line_items = items.map(item => {
            // Lógica de preço simplificada e robusta.
            // O `totalPrice` do carrinho agora é a fonte da verdade, e nós derivamos o preço unitário dele.
            const unitAmount = item.quantity > 0 ? item.totalPrice / item.quantity : 0;
            const unitAmountInCents = Math.round(unitAmount * 100);

            // Verificação crucial: a Stripe exige um valor mínimo (geralmente 50 centavos para BRL).
            // Se o valor unitário for menor que isso, a transação falhará.
            if (unitAmountInCents < 50) {
                 throw new Error(`O valor unitário para o produto ${item.product.name} (R$${unitAmount.toFixed(2)}) é menor que o mínimo de R$0,50 permitido para pagamento.`);
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
