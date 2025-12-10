'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Category } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { collection, query } from "firebase/firestore";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryWithChildren extends Category {
    children: CategoryWithChildren[];
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

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/2" />
            </div>
        )
    }

    return (
        <div className="sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <div className="space-y-2 flex flex-col items-start">
                <Link
                    href="/catalogo"
                    className={cn(
                        "font-medium hover:text-primary transition-colors",
                        !currentCategory && "text-primary"
                    )}
                >
                    Todos os Produtos
                </Link>

                <Accordion type="multiple" className="w-full">
                    {categoryTree.map(category => (
                        <div key={category.id}>
                            {category.children.length > 0 ? (
                                <AccordionItem value={category.id} className="border-b-0">
                                    <AccordionTrigger className={cn(
                                        "py-2 hover:no-underline font-medium hover:text-primary transition-colors",
                                        currentCategory === category.id && "text-primary"
                                    )}>
                                        <Link href={`/catalogo?categoria=${category.id}`} className="hover:text-primary">{category.name}</Link>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4">
                                        <div className="space-y-2 flex flex-col items-start">
                                        {category.children.map(child => (
                                            <Link
                                                key={child.id}
                                                href={`/catalogo?categoria=${child.id}`}
                                                className={cn(
                                                    "text-muted-foreground hover:text-primary transition-colors",
                                                    currentCategory === child.id && "text-primary font-semibold"
                                                )}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ) : (
                                <Link
                                    href={`/catalogo?categoria=${category.id}`}
                                    className={cn(
                                        "font-medium hover:text-primary transition-colors block py-2",
                                        currentCategory === category.id && "text-primary"
                                    )}
                                >
                                    {category.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}
