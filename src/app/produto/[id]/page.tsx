'use client';
import ProductPage from "@/components/sections/produto/ProductPage";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Product } from "@/lib/definitions";
import { doc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";

export default function Page() {
    const firestore = useFirestore();
    const params = useParams(); // Use o hook useParams
    const productId = params.id as string; // Obtenha o id
    
    const productRef = useMemoFirebase(() => {
        if (!firestore || !productId) return null;
        return doc(firestore, "products", productId);
    }, [firestore, productId]);

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
