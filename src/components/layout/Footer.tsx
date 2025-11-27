import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Social */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
                <Logo />
            </div>
            <div className="flex gap-4">
              <Link href="https://www.instagram.com/graficaouro/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.facebook.com/profile.php?id=61583717952045" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          {/* Políticas */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-4">Políticas</h3>
            <nav className="flex flex-col gap-2 text-sm text-gray-400">
              <Link href="/politica-de-cookies" className="hover:text-primary transition-colors">Política de Cookies</Link>
              <Link href="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</Link>
              <Link href="/politica-de-privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
            </nav>
          </div>

          {/* Segurança */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-4">Segurança</h3>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <Image src="https://i.imgur.com/Jno45zK.png" alt="Selo Site Seguro" width={120} height={32} />
              <Image src="https://i.imgur.com/eP7c5HZ.png" alt="Selo Site Blindado" width={120} height={32} />
            </div>
          </div>
          
          {/* CNPJ */}
           <div className="text-center md:text-left">
            <h3 className="font-bold mb-4">CNPJ</h3>
            <p className="text-sm text-gray-400">27.619.752/0001-91</p>
          </div>

        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {currentYear} Ouro Gráfica. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
