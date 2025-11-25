'use client';
import { categories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function CategoriesSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Categorias Populares</h2>
        </div>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
                {categories.map((category) => (
                    <CarouselItem key={category.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                        <Link href={`/catalogo?categoria=${category.id}`} className="group p-1 block">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                                <CardContent className="p-0">
                                <div className="relative aspect-square bg-primary flex items-center justify-center">
                                    {/* Placeholder for image */}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-center font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {category.name}
                                    </h3>
                                </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
