import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" aria-label="Voltar para a Home">
              <Logo />
            </Link>
          </div>
          <nav className="flex gap-4 sm:gap-6 text-sm font-medium mb-4 md:mb-0">
            <Link href="/catalogo" className="text-muted-foreground hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link href="/orcamento" className="text-muted-foreground hover:text-primary transition-colors">
              Orçamento
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              Minha Conta
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            &copy; {currentYear} Ouro Gráfica. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
