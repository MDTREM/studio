import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSdks } from '@/firebase/server';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

// O segredo do webhook é obtido das variáveis de ambiente
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;
  // Obtém a instância da Stripe usando a função getStripe() em vez de importá-la diretamente.
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    // Verifica a assinatura do evento para garantir que ele veio da Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Erro na verificação da assinatura do webhook: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Lida com o evento 'checkout.session.completed'
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Verifica se a sessão tem os metadados e o ID do cliente necessários
    if (!session?.metadata?.cartItems || !session?.client_reference_id) {
        console.error('❌ Metadados ou client_reference_id ausentes na sessão de checkout.');
        return new NextResponse('Webhook Error: Faltando metadados na sessão.', { status: 400 });
    }

    try {
        const { firestore } = getSdks();
        const userId = session.client_reference_id;
        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.error(`❌ Usuário não encontrado no Firestore com o ID: ${userId}`);
            return new NextResponse('Webhook Error: Usuário não encontrado.', { status: 404 });
        }
        
        const userData = userSnap.data();

        // O carrinho está armazenado como uma string JSON nos metadados
        const cartItems = JSON.parse(session.metadata.cartItems);

        // Cria um pedido para cada item no carrinho
        for (const item of cartItems) {
            const newOrderRef = collection(firestore, 'users', userId, 'orders');
            const orderData = {
                customerId: userId,
                customerName: userData.name, // Obtido do documento do usuário
                customerEmail: userData.email, // Obtido do documento do usuário
                orderDate: new Date().toISOString(),
                status: 'Em análise',
                productName: item.productName,
                quantity: item.quantity,
                totalAmount: item.totalPrice,
                variation: {
                    format: item.selectedFormat,
                    finishing: item.selectedFinishing,
                },
                artworkUrl: '', // O cliente enviará a arte separadamente
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(newOrderRef, orderData);
            // Salva o ID gerado pelo Firestore dentro do próprio documento
            await updateDoc(docRef, { id: docRef.id });
        }

    } catch (error) {
        console.error('❌ Erro ao salvar o pedido no Firestore:', error);
        return new NextResponse('Webhook Error: Erro interno ao salvar pedido.', { status: 500 });
    }
  }

  // Responde com sucesso
  return NextResponse.json({ received: true });
}
