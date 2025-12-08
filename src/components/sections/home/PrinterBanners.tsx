'use client';
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const printerBannersData = [
  { banner: PlaceHolderImages.find(p => p.id === 'printer-banner-1'), href: '/servicos' },
  { banner: PlaceHolderImages.find(p => p.id === 'printer-banner-2'), href: '/servicos' },
  { banner: PlaceHolderImages.find(p => p.id === 'printer-banner-3'), href: 'https://wa.me/5531982190935' },
].filter(item => item.banner);


export default function PrinterBanners() {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {printerBannersData.map((item, index) => {
            const { banner, href } = item;
            return (
              <Link href={href} key={index} className="group block" target={href.startsWith('https') ? '_blank' : '_self'} rel="noopener noreferrer">
                <div className="relative aspect-video bg-primary rounded-lg flex items-center justify-center overflow-hidden">
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
            )
          })}
        </div>
      </div>
    </section>
  );
}
