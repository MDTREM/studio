'use client';
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const bannerImages = [
  PlaceHolderImages.find(img => img.id === 'hero-banner-1'),
  PlaceHolderImages.find(img => img.id === 'hero-banner-2'),
  PlaceHolderImages.find(img => img.id === 'hero-banner-3'),
].filter(Boolean);


export default function PromoBanners() {
  return (
    <section className="py-12 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {bannerImages.map((banner, index) => (
            <Link href="/catalogo" key={banner?.id || index} className="group block">
              <div className="relative aspect-square bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                 {banner ? (
                    <Image 
                      src={banner.imageUrl}
                      alt={banner.description}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      data-ai-hint={banner.imageHint}
                    />
                 ) : (
                    <h2 className="text-2xl font-bold text-primary-foreground">Banner</h2>
                 )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
