'use server';

import { CartItem } from "@/lib/definitions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

// Preço linear simples para garantir precisão e consistência.
const getPriceForQuantity = (product: CartItem['product'], quantity: number): number => {
    if (!product?.basePrice || quantity <= 0) {
        return 0;
    }
    // Garante que a quantidade base seja pelo menos 1 para evitar divisão por zero.
    const baseQuantity = product.variations?.quantities?.[0] || 1;
    const pricePerUnit = (product.basePrice / (baseQuantity > 0 ? baseQuantity : 1));
    const totalPrice = pricePerUnit * quantity;
    return totalPrice;
};

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = headers().get('origin') || 'http://localhost:9003';
    
    try {
        const line_items = items.map(item => {

            if (!item.product?.basePrice || item.quantity <= 0) {
                throw new Error(`Produto inválido ou quantidade zero para ${item.product.name}.`);
            }

            // 1. Recalcula o preço total de forma segura e consistente, usando a mesma lógica do carrinho.
            const totalPriceForItem = getPriceForQuantity(item.product, item.quantity);
            
            // 2. Converte o preço total para centavos, arredondando para evitar frações de centavos.
            const totalAmountInCents = Math.round(totalPriceForItem * 100);

            // 3. Deriva o valor unitário em centavos a partir do total em centavos, usando Math.floor para garantir um inteiro.
            const unitAmountInCents = Math.floor(totalAmountInCents / item.quantity);

            // 4. Validação de segurança final. Se o valor for menor que 50 centavos, lança um erro claro.
            if (unitAmountInCents < 50) { 
                 throw new Error(`O valor unitário para o produto ${item.product.name} (R$${(unitAmountInCents/100).toFixed(2)}) é menor que o mínimo de R$0,50 permitido para pagamento.`);
            }

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
                cartItems: JSON.stringify(items.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    totalPrice: getPriceForQuantity(item.product, item.quantity), // Usa a função segura
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
