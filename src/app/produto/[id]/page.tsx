'use client';
import ProductPage from "@/components/sections/produto/ProductPage";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Product } from "@/lib/definitions";
import { doc } from "firebase/firestore";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
    const firestore = useFirestore();
    const productRef = useMemoFirebase(() => {
        if (!firestore || !params.id) return null;
        return doc(firestore, "products", params.id);
    }, [firestore, params.id]);
    const { data: product, isLoading } = useDoc<Product>(productRef);

    if (isLoading) {
        return <div>Carregando produto...</div>;
    }

    if (!product) {
        notFound();
    }

    return <ProductPage product={product} />;
}
