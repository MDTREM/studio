import QuoteForm from "@/components/sections/orcamento/QuoteForm";
import { products } from "@/lib/data";

export default function OrcamentoPage({ searchParams }: { searchParams: { produto?: string } }) {
  const selectedProduct = products.find(p => p.id === searchParams.produto);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Orçamento Online</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Personalize seu produto e receba uma estimativa de preço instantaneamente.
        </p>
      </div>
      <QuoteForm products={products} selectedProductId={searchParams.produto} />
    </div>
  );
}
