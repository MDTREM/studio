import { categories } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoriesSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nossos Produtos</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Encontre a solução ideal para sua necessidade. De adesivos a grandes formatos.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/catalogo?categoria=${category.id}`} className="group">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={category.imageHint}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-center font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
