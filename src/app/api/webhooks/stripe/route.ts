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
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Erro na verificação da assinatura do webhook: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Lida com o evento 'checkout.session.completed'
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Obtém o ID do pedido dos metadados
    const orderId = session.metadata?.orderId;
    const userId = session.client_reference_id;

    if (!orderId || !userId) {
        console.error('❌ orderId ou client_reference_id ausentes na sessão de checkout.');
        return new NextResponse('Webhook Error: Faltando metadados na sessão.', { status: 400 });
    }

    try {
        const { firestore } = getSdks();
        const orderRef = doc(firestore, 'users', userId, 'orders', orderId);
        
        // Pega os dados do usuário para salvar nome/email no pedido
        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
             console.error(`❌ Usuário não encontrado no Firestore com o ID: ${userId}`);
             return new NextResponse('Webhook Error: Usuário não encontrado.', { status: 404 });
        }
        const userData = userSnap.data();

        // Pega os itens do pedido que já foram salvos no rascunho
        const orderSnap = await getDoc(orderRef);
        const orderItems = orderSnap.data()?.items || [];
        
        // Atualiza o pedido com os detalhes finais do pagamento
        await updateDoc(orderRef, {
            id: orderId,
            status: 'Em análise',
            orderDate: new Date().toISOString(),
            totalAmount: session.amount_total ? session.amount_total / 100 : 0,
            customerName: userData.name,
            customerEmail: userData.email,
            items: orderItems, // Garante que os itens estão lá
            // Adiciona informações da Stripe se necessário
            stripeSessionId: session.id,
            paymentStatus: session.payment_status,
        });

    } catch (error) {
        console.error('❌ Erro ao atualizar o pedido no Firestore:', error);
        return new NextResponse('Webhook Error: Erro interno ao atualizar pedido.', { status: 500 });
    }
  }

  // Responde com sucesso
  return NextResponse.json({ received: true });
}
