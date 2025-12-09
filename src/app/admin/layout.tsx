'use client';
import Link from "next/link";
import * as React from "react";
import { Package, ShoppingCart, Users, Tags, ShieldAlert, Loader2, Home } from "lucide-react";
import Logo from "@/components/shared/Logo";
import UserNav from "@/components/shared/UserNav";
import { FirebaseClientProvider, useUser } from "@/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdTokenResult } from "firebase/auth";

// 1. Criar o Contexto
interface AdminContextType {
  isAdmin: boolean;
  isCheckingAdmin: boolean;
}

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isCheckingAdmin: true,
});

// Hook customizado para usar o contexto
export const useAdmin = () => useContext(AdminContext);

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (user) {
      getIdTokenResult(user, true).then((idTokenResult) => {
        const claims = idTokenResult.claims;
        setIsAdmin(!!claims.isAdmin);
        setIsCheckingAdmin(false);
      });
    } else {
      setIsAdmin(false);
      setIsCheckingAdmin(false);
    }
  }, [user, isUserLoading]);

  return (
    // 2. Prover o contexto para os filhos
    <AdminContext.Provider value={{ isAdmin, isCheckingAdmin }}>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Search can be added here */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {isCheckingAdmin && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold">Verificando permissões...</h2>
                  <p className="text-muted-foreground">Aguarde um momento.</p>
              </div>
          )}
          {!isCheckingAdmin && !isAdmin && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
                  <h2 className="text-2xl font-bold">Acesso Negado</h2>
                  <p className="text-muted-foreground max-w-md">
                      Você não tem as permissões necessárias para acessar o painel de administração. Por favor, contate o suporte se você acredita que isso é um erro.
                  </p>
            </div>
          )}
          {!isCheckingAdmin && isAdmin && children}
        </main>
      </div>
    </AdminContext.Provider>
  );
}

function AdminNavLinks() {
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
        <Link
          href="/admin/home"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Gerenciar Home
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
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
        <AdminContent>{children}</AdminContent>
      </div>
    </FirebaseClientProvider>
  );
}
