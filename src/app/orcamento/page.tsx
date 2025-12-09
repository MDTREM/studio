'use client';
import QuoteForm from "@/components/sections/orcamento/QuoteForm";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Product } from "@/lib/definitions";
import { collection, query } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

function OrcamentoPageContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('produto');
    const firestore = useFirestore();
    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "products"));
    }, [firestore]);
    const { data: products, isLoading } = useCollection<Product>(productsQuery);
  
    if (isLoading) {
        return <div>Carregando...</div>
    }

    if (!products) {
        return <div>Nenhum produto encontrado.</div>
    }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Orçamento Online</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Personalize seu produto e receba uma estimativa de preço instantaneamente.
        </p>
      </div>
      <QuoteForm products={products} selectedProductId={productId || undefined} />
    </div>
  );
}


import { Suspense } from 'react';

export default function OrcamentoPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <OrcamentoPageContent />
        </Suspense>
    )
}
