'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Category } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { collection, query } from "firebase/firestore";
import { ChevronRight, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CategoryWithChildren extends Category {
    children: CategoryWithChildren[];
}

const renderSubMenu = (categories: CategoryWithChildren[], currentCategory: string | null) => {
    return categories.map(category => (
        category.children.length > 0 ? (
            <DropdownMenuSub key={category.id}>
                <DropdownMenuSubTrigger>{category.name}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <Link href={`/catalogo?categoria=${category.id}`} passHref>
                             <DropdownMenuItem>Ver tudo em {category.name}</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {renderSubMenu(category.children, currentCategory)}
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
        ) : (
             <Link href={`/catalogo?categoria=${category.id}`} passHref key={category.id}>
                <DropdownMenuItem active={currentCategory === category.id}>{category.name}</DropdownMenuItem>
            </Link>
        )
    ));
}


export default function CategoryFilter() {
    const firestore = useFirestore();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('categoria');

    const categoriesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "categories"));
    }, [firestore]);

    const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

    const categoryTree = useMemo(() => {
        if (!categories) return [];
        
        const categoryMap = new Map<string, CategoryWithChildren>();
        const rootCategories: CategoryWithChildren[] = [];

        categories.forEach(category => {
            categoryMap.set(category.id, { ...category, children: [] });
        });

        categories.forEach(category => {
            if (category.parentId && categoryMap.has(category.parentId)) {
                categoryMap.get(category.parentId)?.children.push(categoryMap.get(category.id)!);
            } else {
                rootCategories.push(categoryMap.get(category.id)!);
            }
        });

        return rootCategories;
    }, [categories]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar por Categoria
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Categorias</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/catalogo" passHref>
                    <DropdownMenuItem active={!currentCategory}>Todos os Produtos</DropdownMenuItem>
                </Link>
                {isLoading ? (
                    <DropdownMenuItem disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Carregando...
                    </DropdownMenuItem>
                ) : (
                    renderSubMenu(categoryTree, currentCategory)
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
