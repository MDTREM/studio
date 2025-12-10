'use client';
import Link from "next/link";
import * as React from "react";
import { Package, User as UserIcon, Loader2, Home } from "lucide-react";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


function DashboardNavLinks() {
    const pathname = usePathname();
    const navLinks = [
        { href: "/dashboard/pedidos", label: "Meus Pedidos", icon: <Package className="h-4 w-4" /> },
        { href: "/dashboard/meus-dados", label: "Meus Dados", icon: <UserIcon className="h-4 w-4" /> },
    ]
    return (
      <nav className="grid items-start gap-2 text-sm font-medium">
        {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
                 <Link
                    key={link.label}
                    href={link.href}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive && "bg-muted text-primary")}
                >
                    {link.icon}
                    {link.label}
                </Link>
            )
        })}
      </nav>
    );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-20rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Seu Painel</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus pedidos e informações pessoais.</p>
        </div>
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-8 items-start">
            <aside className="hidden md:flex flex-col gap-4">
               <DashboardNavLinks />
            </aside>
            <main>{children}</main>
        </div>
      </div>
  );
}
