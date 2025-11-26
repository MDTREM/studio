'use server';

import { CartItem } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = headers().get('origin') || 'http://localhost:9003';
    
    try {
        const line_items = items.map(item => {
            // Lógica de cálculo do preço unitário correta, espelhando a da página do produto.
            const baseQuantity = item.product.variations.quantities[0] || 1;
            const pricePerUnit = (item.product.basePrice / (baseQuantity > 0 ? baseQuantity : 1));
            const unitAmountInCents = Math.round(pricePerUnit * 100);

            // Garante que a imagem é uma URL válida e pública antes de enviar para a Stripe
            const validImages = item.product.imageUrls.filter(url => url && url.startsWith('http'));

            return {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: item.product.name,
                        description: `${item.selectedFormat} / ${item.selectedFinishing}`,
                        ...(validImages.length > 0 && { images: [validImages[0]] })
                    },
                    unit_amount: unitAmountInCents, // Preço por unidade em centavos
                },
                quantity: item.quantity,
            };
        });

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
                    productName: item.product.name, // Adicionado para referência no webhook
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
