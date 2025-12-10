'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Esta página agora apenas redireciona para a página de pedidos.
export default function DashboardRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/pedidos');
    }, [router]);

    return null; // Não renderiza nada enquanto redireciona
}
