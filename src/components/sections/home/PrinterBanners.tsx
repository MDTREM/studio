'use client';
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const printerBannerUrl = "https://i.imgur.com/3NgKXUQ.png";

export default function PrinterBanners() {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Banner da Imagem Fornecida */}
          <Link href="/servicos" className="group block">
            <div className="relative aspect-video bg-primary rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src={printerBannerUrl}
                alt="Aluguel de Impressoras"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>
          {/* Banners Estáticos Laranja */}
          {Array.from({ length: 2 }).map((_, index) => (
             <Link href="/servicos" key={index} className="group block">
              <div className="relative aspect-video bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                <h2 className="text-2xl font-bold text-primary-foreground">Banner</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
