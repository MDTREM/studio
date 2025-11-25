import ProductCard from '@/components/shared/ProductCard';
import { products } from '@/lib/data';
import { Product } from '@/lib/definitions';
import { Filter } from 'lucide-react';

export default function CatalogoPage({
  searchParams,
}: {
  searchParams?: { categoria?: string };
}) {
  const currentCategory = searchParams?.categoria;

  const filteredProducts = currentCategory
    ? products.filter((p) => p.category === currentCategory)
    : products;

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nosso Catálogo</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Explore nossa variedade de produtos e encontre a solução perfeita para divulgar sua marca.
        </p>
      </div>

      {/* TODO: Implementar filtros avançados */}
      <div className="flex items-center gap-2 mb-8">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <span className="font-semibold">Filtros:</span>
        <span className="text-sm text-muted-foreground">
          {currentCategory ? `Categoria: ${currentCategory}` : 'Todos os produtos'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
