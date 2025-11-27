'use server';

import { CartItem } from "@/lib/definitions";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";

// A lógica de cálculo de preço foi movida para o servidor para segurança.
const calculatePrice = (product: CartItem['product'], quantity: number): number => {
    // Garante que o cálculo não falhe se as variações não existirem.
    const baseQuantity = product?.variations?.quantities?.[0] || 1;
    if (!product?.basePrice || baseQuantity <= 0 || quantity <= 0) {
        // Retorna 0 ou lança um erro se o produto for inválido
        // Lançar um erro pode ser mais seguro para evitar cobranças incorretas
        throw new Error(`Produto inválido, sem preço base ou quantidade base inválida: ${product.name}`);
    }
    const pricePerUnit = product.basePrice / baseQuantity;
    return Math.round(pricePerUnit * quantity * 100); // Retorna em centavos
};


export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = process.env.NEXT_PUBLIC_URL || headers().get('origin') || 'http://localhost:9003';
    // Obtém a instância da Stripe usando a função getStripe() em vez de importá-la diretamente.
    const stripe = getStripe();
    
    try {
        const line_items = items.map(item => {
            const product = item.product;

            // O preço total em centavos agora é calculado de forma segura no servidor.
            const totalAmountInCents = calculatePrice(product, item.quantity);

            const imageUrl = item.product.imageUrl && item.product.imageUrl.length > 0 ? item.product.imageUrl[0] : undefined;

            return {
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: item.product.name,
                        description: `${item.selectedFormat} / ${item.selectedFinishing}`,
                        ...(imageUrl && { images: [imageUrl] })
                    },
                    // Stripe espera o valor por unidade, então dividimos o total pela quantidade.
                    unit_amount: Math.round(totalAmountInCents / item.quantity),
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
                // Serializa os itens do carrinho para usar no webhook.
                // O preço aqui é apenas para referência, o cálculo real do pedido é feito no webhook.
                cartItems: JSON.stringify(items.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    // Recalcula o preço total em BRL para o metadata
                    totalPrice: calculatePrice(item.product, item.quantity) / 100, 
                    selectedFormat: item.selectedFormat,
                    selectedFinishing: item.selectedFinishing,
                })))
            }
        });
        
        return { url: session.url };

    } catch (error: any) {
        console.error("Erro ao criar sessão de checkout da Stripe:", error.message);
        return { error: `Não foi possível criar a sessão de pagamento: ${error.message}` };
    }
}
