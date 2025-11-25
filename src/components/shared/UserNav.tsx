'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { signOut, getIdTokenResult } from 'firebase/auth';
import type { User as AppUser } from '@/lib/definitions';
import { doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function UserNav() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      getIdTokenResult(user, true).then((idTokenResult) => {
        setIsAdmin(!!idTokenResult.claims.isAdmin);
      });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: appUser } = useDoc<AppUser>(userDocRef);

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
    }
  };

  if (isUserLoading) {
    return (
        <div className="flex items-center gap-2 text-sm font-medium text-white">
            <User className="h-6 w-6" />
            <div>
                <span className="text-gray-300">Carregando...</span>
            </div>
        </div>
    )
  }

  if (!user) {
    return (
        <Link href="/login" className="flex items-center gap-2 text-sm font-medium hover:text-primary text-white">
            <User className="h-6 w-6" />
            <div>
                <span className="text-gray-300">Bem-vindo(a)</span>
                <br/>
                <strong>Entrar ou Cadastrar</strong>
            </div>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user/100/100"} alt={user.displayName || user.email || 'User'} data-ai-hint="person face" />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{appUser?.name || user.displayName || 'Usuário'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Painel</span>
            </DropdownMenuItem>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
