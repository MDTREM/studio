'use client';
import Link from "next/link";

export default function PromoBanners() {
  return (
    <section className="py-12 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Link href="/catalogo" key={index} className="group block">
              <div className="relative aspect-square bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                 <h2 className="text-2xl font-bold text-primary-foreground">Banner</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
