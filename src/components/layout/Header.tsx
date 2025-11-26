'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import UserNav from '@/components/shared/UserNav';
import { Menu, Search, ShoppingCart, MessageSquare, ChevronDown, Truck, User, Phone, Heart, Package, Wrench } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import TopBanner from './TopBanner';
import { Input } from '../ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Category } from '@/lib/definitions';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';


const mobileUserLinks = [
    { href: '/login', label: 'Entrar / Cadastro', icon: <User className="h-5 w-5" /> },
    { href: '/atendimento', label: 'Central de Atendimento', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Minha Conta', icon: <User className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Meus Pedidos', icon: <Package className="h-5 w-5" /> },
    { href: '/desejos', label: 'Desejos', icon: <Heart className="h-5 w-5" /> },
    { href: '/rastreio', label: 'Rastrear Pedido', icon: <Truck className="h-5 w-5" /> },
];

const mobileServiceLinks = [
    { href: '/servicos', label: 'Aluguel de Impressoras', icon: <Phone className="h-5 w-5" /> },
    { href: '/servicos', label: 'Conserto de Impressoras', icon: <Wrench className="h-5 w-5" /> },
]

export default function Header() {
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'));
  }, [firestore]);

  const { data: categories, isLoading: areCategoriesLoading } = useCollection<Category>(categoriesQuery);

  const categoryLinks = categories ? [
    { href: '/catalogo', label: 'Todos os produtos' },
    ...categories.map(c => ({ href: `/catalogo?categoria=${c.id}`, label: c.name }))
  ] : [{ href: '/catalogo', label: 'Todos os produtos' }];
  
  const secondaryNavLinks = categories ? [
      { href: '/catalogo', label: 'Todos os produtos', icon: <Menu className="h-5 w-5" />, dropdown: true },
      ...categories.slice(0, 5).map(c => ({ href: `/catalogo?categoria=${c.id}`, label: c.name }))
  ] : [];


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
                <SheetHeader className="p-6">
                  <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                  <Link href="/">
                      <Logo />
                  </Link>
                </SheetHeader>
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
                                        {areCategoriesLoading ? Array.from({length: 5}).map((_, i) => <Skeleton key={i} className='h-6 w-3/4 bg-gray-700' />) 
                                        : categoryLinks.map((link) => (
                                            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="services" className="border-b-0">
                                <div className="p-6 flex flex-col gap-4">
                                    {mobileServiceLinks.map((link, index) => (
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
                <Link href="/atendimento" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
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
                {areCategoriesLoading ? (
                  Array.from({length: 6}).map((_, i) => <Skeleton key={i} className='h-5 w-24 bg-gray-700' />)
                ) : (
                  secondaryNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1 transition-colors text-gray-300 hover:text-primary"
                    >
                      {link.icon}
                      {link.label}
                      {link.dropdown && <ChevronDown className="h-4 w-4" />}
                    </Link>
                  ))
                )}
                </nav>
            </div>
        </div>
      </header>
    </>
  );
}
