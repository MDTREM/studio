'use server';

import { CartItem } from "@/lib/definitions";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { getSdks } from "@/firebase/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

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
            unit_amount: Math.round(item.totalPrice * 100),
        },
        // A quantidade é sempre 1 porque o preço total já está calculado para o conjunto de itens.
        quantity: 1,
    };
};

export async function createCheckoutSession(items: CartItem[], userId: string) {
    const origin = process.env.NEXT_PUBLIC_URL || headers().get('origin') || 'http://localhost:9003';
    const stripe = getStripe();
    const { firestore } = getSdks();
    
    try {
        const line_items = items.map(createLineItemFromCartItem);

        // 1. Criar um rascunho do pedido no Firestore para obter um ID
        const orderRef = await addDoc(collection(firestore, 'users', userId, 'orders'), {
            status: 'Pendente', // Status inicial
            createdAt: serverTimestamp(),
            customerId: userId,
            items: items.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                selectedFormat: item.selectedFormat,
                selectedFinishing: item.selectedFinishing,
                artworkFee: item.artworkFee || 0,
                totalPrice: item.totalPrice,
            }))
        });
        const orderId = orderRef.id;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/checkout/success?order_id=${orderId}`, // Passa o ID do pedido
            cancel_url: `${origin}/checkout/cancel`,
            client_reference_id: userId, 
            metadata: {
                orderId: orderId, // Armazena o ID do pedido do Firestore
            }
        });
        
        return { url: session.url };

    } catch (error: any) {
        console.error("Erro ao criar sessão de checkout da Stripe:", error.message);
        return { error: `Não foi possível criar a sessão de pagamento: ${error.message}` };
    }
}
