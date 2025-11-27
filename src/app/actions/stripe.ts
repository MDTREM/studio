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
            
            // Lógica de cálculo do preço unitário
            const baseQuantity = product.variations.quantities?.[0];
            if (!baseQuantity || baseQuantity <= 0) {
                throw new Error(`Quantidade base inválida para o produto ${product.name}.`);
            }
            const pricePerUnit = product.basePrice / baseQuantity;
            const unitAmountInCents = Math.round(pricePerUnit * 100);

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
                    const baseQuantity = item.product.variations.quantities?.[0] || 1;
                    const pricePerUnit = item.product.basePrice / baseQuantity;
                    const totalPrice = pricePerUnit * item.quantity;
                    
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
        
        // Retorna a URL completa em vez de apenas o ID
        return { url: session.url };

    } catch (error: any) {
        console.error("Erro ao criar sessão de checkout da Stripe:", error.message);
        return { error: `Não foi possível criar a sessão de pagamento: ${error.message}` };
    }
}
