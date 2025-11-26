import ProductPage from "@/components/sections/produto/ProductPage";
import { Product } from "@/lib/definitions";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { getSdks } from "@/firebase/server";

// Fetch data on the server
async function getProduct(productId: string): Promise<Product | null> {
    // We need to initialize a temporary admin-like instance here to fetch data on the server.
    // This is a read-only operation and is safe.
    const { firestore } = getSdks();
    const productRef = doc(firestore, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return null;
    }

    const productData = productSnap.data();

    return {
        id: productSnap.id,
        ...productData,
    } as Product;
}


// This is now a Server Component by default
export default async function Page({ params }: { params: { id: string } }) {
    const productId = params.id;
    const product = await getProduct(productId);

    if (!product) {
        // If the product is not found after server-side fetching, then show 404.
        notFound();
    }

    // Pass the fetched product data as a prop to the client component.
    return <ProductPage product={product} />;
}
