'use client';
import ProductPage from "@/components/sections/produto/ProductPage";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { Product } from "@/lib/definitions";
import { doc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";

// The params object is passed as a prop to the page component
export default function Page() {
    const firestore = useFirestore();
    const params = useParams();
    const productId = params.id as string;
    
    const productRef = useMemoFirebase(() => {
        if (!firestore || !productId) return null;
        return doc(firestore, "products", productId);
    }, [firestore, productId]);

    const { data: product, isLoading } = useDoc<Product>(productRef);

    if (isLoading) {
        // Shows a loading state while Firestore fetches the data.
        // This prevents the page from jumping to 404 prematurely.
        return <div>Carregando produto...</div>;
    }

    if (!product) {
        // Only calls notFound() if loading is finished and the product was not found.
        notFound();
    }

    // Ensures imageUrls is always an array, even if it comes as a string from the DB.
    const productData = {
        ...product,
        imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [product.imageUrls],
    };

    return <ProductPage product={productData} />;
}
