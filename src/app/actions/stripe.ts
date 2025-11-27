'use server';

import { CartItem } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = headers().get('origin') || 'http://localhost:9003';
    
    try {
        const line_items = items.map(item => {
            // --- Lógica de cálculo de preço segura e refeita ---

            if (!item.product?.basePrice || item.quantity <= 0) {
                throw new Error(`Produto inválido ou quantidade zero para ${item.product.name}.`);
            }

            // 1. Obter a quantidade base para o preço base (ex: 1000 unidades)
            const baseQuantity = item.product.variations?.quantities?.[0] || 1;

            // 2. Calcular o preço por unidade de forma linear e segura.
            const pricePerUnit = item.product.basePrice / (baseQuantity > 0 ? baseQuantity : 1);

            // 3. Calcular o preço total para a quantidade do item no carrinho.
            const totalPriceForItem = pricePerUnit * item.quantity;
            
            // 4. Converter o preço total para centavos PRIMEIRO, para evitar erros de ponto flutuante.
            const totalAmountInCents = Math.round(totalPriceForItem * 100);

            // 5. Derivar o valor unitário em centavos a partir do total em centavos. Esta é a etapa crucial.
            const unitAmountInCents = Math.floor(totalAmountInCents / item.quantity);

            // 6. Validação de segurança final.
            if (unitAmountInCents < 50) { // R$ 0,50 em centavos
                 throw new Error(`O valor unitário para o produto ${item.product.name} (R$${(unitAmountInCents/100).toFixed(2)}) é menor que o mínimo de R$0,50 permitido para pagamento.`);
            }

            const validImages = item.product.imageUrl.filter(url => url && url.startsWith('http'));

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
                    totalPrice: item.totalPrice, // Mantido para referência no webhook
                    selectedFormat: item.selectedFormat,
                    selectedFinishing: item.selectedFinishing,
                })))
            }
        });

        return { sessionId: session.id };
    } catch (error: any) {
        console.error("Erro ao criar sessão de checkout da Stripe:", error.message);
        return { error: `Não foi possível criar a sessão de pagamento: ${error.message}` };
    }
}
