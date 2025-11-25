import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-lg font-bold">
      <Image
        src="https://i.imgur.com/nDzOzwX.png"
        alt="Ouro Gráfica Logo"
        width={180}
        height={40}
        className="w-auto h-10"
        priority
      />
    </div>
  );
}
