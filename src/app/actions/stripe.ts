'use server';

import { CartItem } from "@/lib/definitions";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";

// Esta função agora confia no totalPrice que já vem do carrinho.
const createLineItemFromCartItem = (item: CartItem) => {
    const imageUrl = item.product.imageUrl && item.product.imageUrl.length > 0 ? item.product.imageUrl[0] : undefined;
    const descriptionParts = [item.selectedFormat, item.selectedFinishing, item.artworkFee && item.artworkFee > 0 ? 'Com Design' : ''];
    const description = descriptionParts.filter(Boolean).join(' / ');

    return {
        price_data: {
            currency: 'brl',
            product_data: {
                name: item.product.name,
                description: description,
                ...(imageUrl && { images: [imageUrl] })
            },
            // Stripe espera o valor em centavos.
            unit_amount: Math.round((item.totalPrice / item.quantity) * 100),
        },
        quantity: item.quantity,
    };
};

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = process.env.NEXT_PUBLIC_URL || headers().get('origin') || 'http://localhost:9003';
    const stripe = getStripe();
    
    try {
        const line_items = items.map(createLineItemFromCartItem);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
            client_reference_id: userId, 
            metadata: {
                // Simplificado: A lógica principal agora está no webhook usando o valor total do Stripe.
                cartItems: JSON.stringify(items.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    selectedFormat: item.selectedFormat,
                    selectedFinishing: item.selectedFinishing,
                    artworkFee: item.artworkFee || 0,
                })))
            }
        });
        
        return { url: session.url };

    } catch (error: any) {
        console.error("Erro ao criar sessão de checkout da Stripe:", error.message);
        return { error: `Não foi possível criar a sessão de pagamento: ${error.message}` };
    }
}
