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
import { Input } from '../ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useCart } from '@/contexts/CartContext';
import { useState, useMemo, forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Category } from '@/lib/definitions';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';


const mobileUserLinks = [
    { href: '/login', label: 'Entrar / Cadastro', icon: <User className="h-5 w-5" /> },
    { href: '/atendimento', label: 'Central de Atendimento', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Minha Conta', icon: <User className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Meus Pedidos', icon: <Package className="h-5 w-5" /> },
    { href: '/desejos', label: 'Desejos', icon: <Heart className="h-5 w-5" /> },
];

const mobileServiceLinks = [
    { href: '/servicos', label: 'Aluguel de Impressoras', icon: <Phone className="h-5 w-5" /> },
    { href: '/servicos', label: 'Conserto de Impressoras', icon: <Wrench className="h-5 w-5" /> },
]

interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}


export default function Header() {
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const firestore = useFirestore();

  const allCategoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), where("showInMenu", "==", true));
  }, [firestore]);

  const { data: menuCategories, isLoading: areMenuCategoriesLoading } = useCollection<Category>(allCategoriesQuery);

  const categoryTree = useMemo(() => {
    if (!menuCategories) return [];
    
    const categoryMap = new Map<string, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    menuCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    menuCategories.forEach(category => {
      const categoryNode = categoryMap.get(category.id)!;
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parentNode = categoryMap.get(category.parentId)!;
        parentNode.children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }, [menuCategories]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${searchQuery.trim()}`);
    }
  };


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black text-white">
        <div className="container flex h-20 max-w-7xl items-center">
          
          <div className="flex-1 flex justify-start md:hidden">
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
                                    <div className="flex flex-col p-6">
                                        <Link href="/catalogo" className="transition-colors hover:text-primary mb-4">Todos os Produtos</Link>
                                        <Accordion type="multiple" className="w-full">
                                            {areMenuCategoriesLoading ? Array.from({length: 5}).map((_, i) => <Skeleton key={i} className='h-8 w-full bg-gray-700 mb-2' />) 
                                            : categoryTree.map((category) => (
                                                category.children && category.children.length > 0 ? (
                                                    <AccordionItem key={category.id} value={category.id} className="border-b border-white/20">
                                                        <AccordionTrigger className='py-3 hover:no-underline'>
                                                            <Link href={`/catalogo?categoria=${category.id}`} className='hover:text-primary'>{category.name}</Link>
                                                        </AccordionTrigger>
                                                        <AccordionContent className='pt-2 pl-4'>
                                                            <div className="flex flex-col gap-3">
                                                                {category.children.map(child => (
                                                                    <Link key={child.id} href={`/catalogo?categoria=${child.id}`} className="transition-colors hover:text-primary text-sm">
                                                                        {child.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ) : (
                                                    <Link key={category.id} href={`/catalogo?categoria=${category.id}`} className="transition-colors hover:text-primary py-3 block border-b border-white/20">
                                                        {category.name}
                                                    </Link>
                                                )
                                            ))}
                                        </Accordion>
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
          </div>
          
          <div className="flex-1 flex justify-center md:justify-start">
             <Link href="/">
                <Logo />
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form className="w-full max-w-xl" onSubmit={handleSearch}>
              <div className="relative w-full">
                  <Input type="search" placeholder="Digite o que você procura" className="w-full rounded-full border-2 bg-white/20 text-white border-border/50 h-11 pl-6 pr-12 text-base placeholder:text-gray-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full text-white hover:bg-white/10 hover:text-white">
                      <Search className="h-5 w-5" />
                  </Button>
              </div>
            </form>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:flex">
                <UserNav />
            </div>
             <Button asChild variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-white/10 hover:text-white rounded-full">
                <Link href="/carrinho">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{cartCount}</span>}
                    <span className="sr-only">Carrinho</span>
                </Link>
            </Button>
          </div>
        </div>

        <div className="hidden md:flex justify-center border-t border-white/20">
            <div className="container max-w-7xl flex justify-center">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='flex gap-2'>
                                <Menu className="h-4 w-4" />
                                Todos os produtos
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {areMenuCategoriesLoading ? (
                                        Array.from({length: 6}).map((_, i) => <Skeleton key={i} className='h-10 w-full bg-gray-700' />)
                                    ) : (
                                        categoryTree.map((category) => (
                                            <ListItem
                                                key={category.id}
                                                title={category.name}
                                                href={`/catalogo?categoria=${category.id}`}
                                            >
                                                <ul className='mt-2 space-y-1'>
                                                {category.children.map(child => (
                                                    <li key={child.id}>
                                                        <Link href={`/catalogo?categoria=${child.id}`} className='text-sm text-muted-foreground hover:text-primary'>
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                                </ul>
                                            </ListItem>
                                        ))
                                    )}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        {areMenuCategoriesLoading ? (
                             Array.from({length: 5}).map((_, i) => (
                                <NavigationMenuItem key={i}>
                                    <Skeleton className='h-5 w-24 bg-gray-700' />
                                </NavigationMenuItem>
                             ))
                        ) : (
                            categoryTree.map((category) => (
                                <NavigationMenuItem key={category.id}>
                                    {category.children && category.children.length > 0 ? (
                                        <>
                                            <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                                            <NavigationMenuContent>
                                                <ul className="grid w-[200px] gap-1 p-2 md:w-[250px]">
                                                    {category.children.map((subCategory) => (
                                                        <ListItem
                                                            key={subCategory.id}
                                                            title={subCategory.name}
                                                            href={`/catalogo?categoria=${subCategory.id}`}
                                                        />
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </>
                                    ) : (
                                        <Link href={`/catalogo?categoria=${category.id}`} legacyBehavior passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                {category.name}
                                            </NavigationMenuLink>
                                        </Link>
                                    )}
                                </NavigationMenuItem>
                            ))
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
      </header>
    </>
  );
}

const ListItem = forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">{title}</div>
          {children && (
              <div className="line-clamp-2 text-sm leading-snug text-gray-400">
                {children}
              </div>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
