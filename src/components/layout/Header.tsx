'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import UserNav from '@/components/shared/UserNav';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import TopBanner from './TopBanner';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/orcamento', label: 'Orçamento Online' },
];

export default function Header() {
  return (
    <>
    <TopBanner text="Aproveite nossas ofertas de Black Friday!" />
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black text-white">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
            <div className="hidden md:block">
                <UserNav />
            </div>
            <Sheet>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-black text-white">
                    <div className="flex flex-col gap-6 pt-10">
                        <Link href="/" className="flex items-center gap-2">
                            <Logo />
                        </Link>
                        <nav className="flex flex-col gap-4 text-lg font-medium">
                        {navLinks.map((link) => (
                            <Link
                            key={link.href}
                            href={link.href}
                            className="transition-colors hover:text-white/80"
                            >
                            {link.label}
                            </Link>
                        ))}
                        </nav>
                        <UserNav />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
