'use client';

import React, { useEffect, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { HomepageSection, Product } from '@/lib/definitions';
import { collection, doc, query, orderBy, writeBatch, documentId, where, getDocs } from 'firebase/firestore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Loader2, Pencil, Trash2 } from 'lucide-react';
import ManageProductsDialog from './ManageProductsDialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import EditSectionDialog from './EditSectionDialog';
import DeleteSectionDialog from './DeleteSectionDialog';

function SortableSection({ section, products }: { section: HomepageSection; products: Product[] }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleStatusChange = (active: boolean) => {
    if (!firestore) return;
    const sectionRef = doc(firestore, 'homepage_sections', section.id);
    updateDocumentNonBlocking(sectionRef, { active });
    toast({ title: `Seção "${section.title}" ${active ? 'ativada' : 'desativada'}.` });
  };
  
  const sectionProducts = products.filter(p => section.productIds.includes(p.id));

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <button {...attributes} {...listeners} className="cursor-grab p-1">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
            <CardTitle>{section.title}</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Switch 
                    id={`status-${section.id}`} 
                    checked={section.active}
                    onCheckedChange={handleStatusChange}
                />
                <Label htmlFor={`status-${section.id}`}>{section.active ? 'Ativa' : 'Inativa'}</Label>
            </div>
            <ManageProductsDialog section={section} allProducts={products} />
            <EditSectionDialog section={section} />
            <DeleteSectionDialog section={section} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sectionProducts.length > 0 ? (
                sectionProducts.map(p => (
                    <div key={p.id} className="border rounded-md p-2 text-center text-xs">
                        <p className="truncate font-medium">{p.name}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground col-span-full">Nenhum produto nesta seção.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SectionManager() {
  const firestore = useFirestore();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const [sections, setSections] = useState<HomepageSection[]>([]);
  
  const sectionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'homepage_sections'), orderBy('order', 'asc'));
  }, [firestore]);
  
  const { data: initialSections, isLoading: isLoadingSections } = useCollection<HomepageSection>(sectionsQuery);
  
  const allProductsQuery = useMemoFirebase(() => {
      if(!firestore) return null;
      return query(collection(firestore, 'products'));
  }, [firestore]);
  const { data: allProducts, isLoading: isLoadingProducts } = useCollection<Product>(allProductsQuery);

  useEffect(() => {
    if (initialSections) {
      setSections(initialSections);
    }
  }, [initialSections]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        if (firestore) {
          const batch = writeBatch(firestore);
          newOrder.forEach((section, index) => {
            const sectionRef = doc(firestore, 'homepage_sections', section.id);
            batch.update(sectionRef, { order: index });
          });
          batch.commit();
        }
        
        return newOrder;
      });
    }
  };

  if (isLoadingSections || isLoadingProducts) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!sections) {
    return <p>Nenhuma seção encontrada.</p>
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <SortableSection key={section.id} section={section} products={allProducts || []} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
