'use client';
import Link from "next/link";
import { Package, ShoppingCart, Users, Tags } from "lucide-react";
import Logo from "@/components/shared/Logo";
import UserNav from "@/components/shared/UserNav";
import { FirebaseClientProvider, useUser } from "@/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdTokenResult } from "firebase/auth";

function AdminNavLinks() {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (user) {
      getIdTokenResult(user, true).then((idTokenResult) => {
        setIsAdmin(!!idTokenResult.claims.isAdmin);
        setIsCheckingAdmin(false);
      });
    } else {
      setIsAdmin(false);
      setIsCheckingAdmin(false);
    }
  }, [user, isUserLoading]);

  // Aguarda a verificação do usuário e do status de admin
  if (isUserLoading || isCheckingAdmin) {
    return (
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        <p className="px-3 py-2 text-muted-foreground">Verificando permissões...</p>
      </nav>
    );
  }

  if (!user) {
    return (
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        <p className="px-3 py-2 text-muted-foreground">Você precisa estar logado para acessar esta área.</p>
      </nav>
    );
  }
  
  if (!isAdmin) {
     return (
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        <p className="px-3 py-2 text-destructive">Acesso negado. Você não é um administrador.</p>
      </nav>
    );
  }

  // Se for admin, mostra os links
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link
        href="/admin"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Package className="h-4 w-4" />
        Produtos
      </Link>
      <Link
        href="/admin/categories"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Tags className="h-4 w-4" />
        Categorias
      </Link>
      <Link
        href="/admin/orders"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <ShoppingCart className="h-4 w-4" />
        Pedidos
      </Link>
      <Link
        href="/admin/customers"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Users className="h-4 w-4" />
        Clientes
      </Link>
    </nav>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redireciona se o carregamento terminar e não houver usuário
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Enquanto carrega, pode-se mostrar um layout skeleton ou uma mensagem global
  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando painel administrativo...
      </div>
    );
  }

  // Se não houver usuário, não renderiza o layout para evitar piscar de conteúdo
  if (!user) {
    return null;
  }

  return (
    <FirebaseClientProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo />
              </Link>
            </div>
            <div className="flex-1">
              <AdminNavLinks />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            {/* MobileNav can be added here */}
            <div className="w-full flex-1">
              {/* Search can be added here */}
            </div>
            <UserNav />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
