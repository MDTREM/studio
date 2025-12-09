
'use client';

import { Home, Search, Package, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/dashboard', label: 'Pedidos', icon: Package },
  { href: '/catalogo', label: 'Categorias', icon: LayoutGrid },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${searchQuery.trim()}`);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {/* Itens de Navegação Padrão */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Botão de Busca com Pop-up */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                'text-muted-foreground'
              )}
            >
              <Search className="w-5 h-5 mb-1" />
              <span className="text-xs">Buscar</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader>
              <SheetTitle>Buscar produtos</SheetTitle>
            </SheetHeader>
            <form className="flex w-full items-center space-x-2 py-4" onSubmit={handleSearch}>
              <Input 
                type="search" 
                placeholder="O que você procura?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">Buscar</Button>
            </form>
          </SheetContent>
        </Sheet>

      </div>
    </nav>
  );
}
