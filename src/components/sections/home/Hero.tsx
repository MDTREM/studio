"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] bg-black">
      {/* Imagem para Mobile */}
      <div className="md:hidden relative w-full h-full">
        <Image
          src="https://i.imgur.com/DHLrPss.png"
          alt="Banner para mobile"
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Imagem para Desktop */}
      <div className="hidden md:block relative w-full h-full">
        <Image
          src="https://i.imgur.com/T0wPi26.png"
          alt="Banner para desktop"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
