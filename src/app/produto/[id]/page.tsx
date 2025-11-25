import ProductPage from "@/components/sections/produto/ProductPage";
import { products } from "@/lib/data";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
    const product = products.find(p => p.id === params.id);

    if (!product) {
        notFound();
    }

    return <ProductPage product={product} />;
}
