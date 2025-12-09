'use client';

import { Home, Search, Package, LayoutGrid, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormEvent, useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Product } from '@/lib/definitions';
import { collection, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/dashboard', label: 'Pedidos', icon: Package },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !debouncedQuery) return null;
    return query(
        collection(firestore, 'products'), 
        where('keywords', 'array-contains', debouncedQuery.toLowerCase()),
        limit(10)
    );
  }, [firestore, debouncedQuery]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${searchQuery.trim()}`);
      setIsSheetOpen(false);
    }
  };

  const handleProductClick = () => {
    setIsSheetOpen(false);
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-40">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-6 h-6" />
            </Link>
          );
        })}
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Buscar"
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                'text-muted-foreground'
              )}
            >
              <Search className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg h-[80vh]">
            <SheetHeader>
              <SheetTitle>Buscar produtos</SheetTitle>
            </SheetHeader>
            <form className="flex w-full items-center space-x-2 py-4" onSubmit={handleSearchSubmit}>
              <Input 
                type="search" 
                placeholder="O que você procura?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">Buscar</Button>
            </form>
            <div className='overflow-y-auto h-[calc(100%-120px)]'>
                {isLoading && (
                    <div className='flex items-center justify-center mt-8'>
                        <Loader2 className='animate-spin text-muted-foreground' />
                    </div>
                )}
                {!isLoading && products && products.length > 0 && (
                    <div className='space-y-4'>
                        {products.map(product => (
                            <Link href={`/produto/${product.id}`} key={product.id} onClick={handleProductClick} className='flex items-center gap-4 p-2 rounded-md hover:bg-secondary'>
                                <Image 
                                    src={product.imageUrl?.[0] || 'https://placehold.co/100x100'} 
                                    alt={product.name} 
                                    width={64} 
                                    height={64}
                                    className='rounded-md aspect-square object-cover'
                                />
                                <div>
                                    <p className='font-semibold'>{product.name}</p>
                                    <p className='text-sm text-primary font-bold'>{product.basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                 {!isLoading && debouncedQuery && (!products || products.length === 0) && (
                    <p className='text-center text-muted-foreground mt-8'>Nenhum produto encontrado para "{debouncedQuery}".</p>
                 )}
            </div>
          </SheetContent>
        </Sheet>
         <Link
            href="/catalogo"
            aria-label="Categorias"
            className={cn(
            'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
            pathname.startsWith('/catalogo') ? 'text-primary' : 'text-muted-foreground'
            )}
        >
            <LayoutGrid className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}
