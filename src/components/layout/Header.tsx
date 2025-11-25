'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import UserNav from '@/components/shared/UserNav';
import { Menu, Search, ShoppingCart, MessageSquare, ChevronDown, Truck } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import TopBanner from './TopBanner';
import { Input } from '../ui/input';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/orcamento', label: 'Orçamento Online' },
];

const secondaryNavLinks = [
    { href: '#', label: 'Todos os produtos', icon: <Menu className="h-5 w-5" /> },
    { href: '/catalogo?categoria=agendas', label: 'Agendas', dropdown: true },
    { href: '/catalogo?categoria=banners', label: 'Banners' },
    { href: '/catalogo?categoria=cadernos', label: 'Cadernos para colorir' },
    { href: '/catalogo?categoria=mouse-pad', label: 'Mouse Pad Personalizado' },
    { href: '/catalogo?categoria=pastas', label: 'Pastas personalizadas' },
]

export default function Header() {
  return (
    <>
      <TopBanner>
        <div className="flex items-center justify-center gap-2">
            <Truck className="h-5 w-5" />
            <span>Primeira compra? Use o cupom OURO5</span>
        </div>
      </TopBanner>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black text-white">
        <div className="container flex h-20 max-w-7xl items-center justify-between gap-4">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 text-white hover:bg-white/10 hover:text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-black text-white">
                <div className="flex flex-col gap-6 pt-10">
                  <Link href="/" className="flex items-center gap-2">
                    <Logo />
                  </Link>
                  <nav className="flex flex-col gap-4 text-lg font-medium">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto">
                    <UserNav />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                <Search className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex justify-center flex-1 md:flex-none">
            <Link href="/">
                <Logo />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="relative h-10 w-10 md:hidden text-white hover:bg-white/10 hover:text-white">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">0</span>
                <span className="sr-only">Carrinho</span>
            </Button>
          </div>


          {/* Desktop Header */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
                <Input type="search" placeholder="Digite o que você procura" className="w-full rounded-full border-2 bg-white/20 text-white border-border/50 h-11 pl-6 pr-12 text-base placeholder:text-gray-300" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full text-white hover:bg-white/10 hover:text-white">
                    <Search className="h-5 w-5" />
                </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                    <MessageSquare className="h-6 w-6" />
                    <div>
                        <span className="text-gray-300 text-xs">Central de</span> <br/> <strong>Atendimento</strong>
                    </div>
                </Link>
                <UserNav />
                 <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-white/10 hover:text-white rounded-full">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">0</span>
                    <span className="sr-only">Carrinho</span>
                </Button>
          </div>
        </div>
        <div className="hidden md:block border-t border-white/20">
            <div className="container max-w-7xl">
                <nav className="flex items-center gap-6 text-sm font-medium h-12">
                {secondaryNavLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1 transition-colors text-gray-300 hover:text-primary"
                    >
                    {link.icon}
                    {link.label}
                    {link.dropdown && <ChevronDown className="h-4 w-4" />}
                    </Link>
                ))}
                </nav>
            </div>
        </div>
      </header>
    </>
  );
}
