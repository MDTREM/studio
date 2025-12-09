'use client';

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FirebaseClientProvider } from "@/firebase";
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import WhatsappButton from "@/components/shared/WhatsappButton";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith('/produto/');
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <FirebaseClientProvider>
      <CartProvider>
        <div className="relative flex min-h-screen flex-col pb-16 md:pb-0">
          {!isAdminPage && <Header />}
          <main className="flex-1 bg-white">{children}</main>
          {!isAdminPage && <Footer />}
        </div>
        {!isProductPage && !isAdminPage && <BottomNav />}
        {!isAdminPage && <WhatsappButton />}
        <Toaster />
      </CartProvider>
    </FirebaseClientProvider>
  );
}
