import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import RootLayoutContent from "./RootLayoutContent";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ouro Gráfica - Marketplace",
  description: "Soluções em materiais gráficos para sua empresa. Orçamento online e WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Scripts de rastreamento (GTM, Meta Pixel) podem ser inseridos aqui, conforme o arquivo INSTRUCOES-INTEGRACOES.md */}
      </head>
      <body
        className={cn(
          "min-h-screen bg-white font-sans antialiased",
          ptSans.variable
        )}
      >
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
