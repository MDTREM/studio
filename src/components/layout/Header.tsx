'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import UserNav from '@/components/shared/UserNav';
import { Menu, Search, ShoppingCart, MessageSquare, ChevronDown, Truck, User, Phone, Heart, Package, Wrench } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import TopBanner from './TopBanner';
import { Input } from '../ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/orcamento', label: 'Orçamento Online' },
];

const mobileUserLinks = [
    { href: '/login', label: 'Entrar / Cadastro', icon: <User className="h-5 w-5" /> },
    { href: '#', label: 'Central de Atendimento', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Minha Conta', icon: <User className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Meus Pedidos', icon: <Package className="h-5 w-5" /> },
    { href: '/desejos', label: 'Desejos', icon: <Heart className="h-5 w-5" /> },
    { href: '#', label: 'Rastrear Pedido', icon: <Truck className="h-5 w-5" /> },
];

const mobileServiceLinks = [
    { href: '#', label: 'Aluguel de Impressoras', icon: <Phone className="h-5 w-5" /> },
    { href: '#', label: 'Conserto de Impressoras', icon: <Wrench className="h-5 w-5" /> },
]

const categoryLinks = [
    { href: '/catalogo', label: 'Todos os produtos' },
    { href: '/catalogo?categoria=adesivos', label: 'Adesivos' },
    { href: '/catalogo?categoria=agendas', label: 'Agendas' },
    { href: '/catalogo?categoria=backdrop', label: 'Backdrop' },
    { href: '/catalogo?categoria=banners', label: 'Banners' },
    { href: '/catalogo?categoria=blocos-anotacoes', label: 'Blocos de anotações' },
    { href: '/catalogo?categoria=cardapios', label: 'Cardápios' },
    { href: '/catalogo?categoria=cartoes-agradecimento', label: 'Cartões de agradecimento' },
    { href: '/catalogo?categoria=cartoes-visita', label: 'Cartões de visitas' },
    { href: '/catalogo?categoria=crachas', label: 'Crachás' },
    { href: '/catalogo?categoria=etiquetas-tags', label: 'Etiquetas ou Tags' },
    { href: '/catalogo?categoria=panfletos', label: 'Panfletos' },
    { href: '/catalogo?categoria=placas', label: 'Placas' },
    { href: '/catalogo?categoria=plaquinhas-pix', label: 'Plaquinhas Pix' },
    { href: '/catalogo?categoria=plotagens', label: 'Plotagens' },
    { href: '/catalogo?categoria=taloes-comandas', label: 'Talões ou comandas' },
    { href: '/catalogo?categoria=wind-banner', label: 'Wind Banner' },
];

const secondaryNavLinks = [
    { href: '/catalogo', label: 'Todos os produtos', icon: <Menu className="h-5 w-5" />, dropdown: true },
    { href: '/catalogo?categoria=adesivos', label: 'Adesivos' },
    { href: '/catalogo?categoria=banners', label: 'Banners' },
    { href: '/catalogo?categoria=cartoes-visita', label: 'Cartões de Visitas' },
    { href: '/catalogo?categoria=panfletos', label: 'Panfletos' },
    { href: '/catalogo?categoria=placas', label: 'Placas' },
    { href: '/catalogo?categoria=wind-banner', label: 'Wind Banner' },
]

export default function Header() {
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${searchQuery.trim()}`);
    }
  };


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
              <SheetContent side="left" className="bg-black text-white p-0 flex flex-col">
                <div className="p-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
                <div className="overflow-y-auto flex-1">
                    <nav className="flex flex-col text-base font-medium">
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="user-links" className="border-b border-white/20">
                                <div className="p-6 flex flex-col gap-4">
                                {mobileUserLinks.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.href}
                                    className="flex items-center gap-3 transition-colors hover:text-primary"
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                                ))}
                                </div>
                            </AccordionItem>
                            <AccordionItem value="categories" className="border-b border-white/20">
                                <AccordionTrigger className="p-6 hover:no-underline text-base">Categorias</AccordionTrigger>
                                <AccordionContent className="bg-white/10">
                                    <div className="flex flex-col gap-4 p-6">
                                        {categoryLinks.map((link) => (
                                            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="services" className="border-b-0">
                                <div className="p-6 flex flex-col gap-4">
                                    {mobileServiceLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 transition-colors hover:text-primary"
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                    ))}
                                </div>
                            </AccordionItem>
                        </Accordion>
                    </nav>
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
            <Button asChild variant="ghost" size="icon" className="relative h-10 w-10 md:hidden text-white hover:bg-white/10 hover:text-white">
                <Link href="/carrinho">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{cartCount}</span>}
                    <span className="sr-only">Carrinho</span>
                </Link>
            </Button>
          </div>


          {/* Desktop Header */}
          <form className="hidden md:flex flex-1 max-w-xl" onSubmit={handleSearch}>
            <div className="relative w-full">
                <Input type="search" placeholder="Digite o que você procura" className="w-full rounded-full border-2 bg-white/20 text-white border-border/50 h-11 pl-6 pr-12 text-base placeholder:text-gray-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full text-white hover:bg-white/10 hover:text-white">
                    <Search className="h-5 w-5" />
                </Button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                    <MessageSquare className="h-6 w-6" />
                    <div>
                        <span className="text-gray-300 text-xs">Central de</span> <br/> <strong>Atendimento</strong>
                    </div>
                </Link>
                <UserNav />
                 <Button asChild variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-white/10 hover:text-white rounded-full">
                    <Link href="/carrinho">
                        <ShoppingCart className="h-6 w-6" />
                        {cartCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{cartCount}</span>}
                        <span className="sr-only">Carrinho</span>
                    </Link>
                </Button>
          </div>
        </div>
        <div className="hidden md:block border-t border-white/20">
            <div className="container max-w-7xl">
                <nav className="flex items-center justify-center gap-6 text-sm font-medium h-12">
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
