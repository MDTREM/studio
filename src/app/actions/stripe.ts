'use server';

import { CartItem } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = headers().get('origin') || 'http://localhost:9003';
    
    try {
        const line_items = items.map(item => {
            const product = item.product;

            if (!product?.basePrice || item.quantity <= 0) {
                throw new Error(`Produto inválido ou quantidade zero para ${product.name}.`);
            }
            
            // LÓGICA FINAL, SIMPLES E SEGURA
            // 1. O `basePrice` é o preço unitário. Sem divisões, sem complexidade.
            // 2. Convertemos diretamente para centavos. É o método mais robusto.
            const unitAmountInCents = Math.round(product.basePrice * 100);

            // Garante que a imagem é uma URL válida.
            const imageUrl = item.product.imageUrl && item.product.imageUrl.length > 0 ? item.product.imageUrl[0] : undefined;

            return {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: item.product.name,
                        description: `${item.selectedFormat} / ${item.selectedFinishing}`,
                        ...(imageUrl && { images: [imageUrl] })
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
                cartItems: JSON.stringify(items.map(item => {
                    // O `totalPrice` do metadado deve corresponder ao que é enviado para a Stripe
                    const totalPrice = item.product.basePrice * item.quantity;
                    
                    return {
                        productId: item.product.id,
                        productName: item.product.name,
                        quantity: item.quantity,
                        totalPrice: totalPrice,
                        selectedFormat: item.selectedFormat,
                        selectedFinishing: item.selectedFinishing,
                    }
                }))
            }
        });

        return { sessionId: session.id };
    } catch (error: any) {
        console.error("Erro ao criar sessão de checkout da Stripe:", error.message);
        return { error: `Não foi possível criar a sessão de pagamento: ${error.message}` };
    }
}
