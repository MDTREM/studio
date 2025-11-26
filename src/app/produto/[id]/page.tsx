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
        // Mostra um estado de carregamento enquanto o Firestore busca os dados.
        // Isso impede que a página pule para o 404 antes da hora.
        return <div>Carregando produto...</div>;
    }

    if (!product) {
        // Apenas chama notFound() se o carregamento terminou e o produto realmente não foi encontrado.
        notFound();
    }

    // Garante que imageUrls seja sempre um array, mesmo que venha como string do DB.
    const productData = {
        ...product,
        imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [product.imageUrls],
    };

    return <ProductPage product={productData} />;
}
