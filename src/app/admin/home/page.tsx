'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '../layout';
import SectionManager from './_components/SectionManager';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddSectionDialog from './_components/AddSectionDialog';

export default function AdminHomePage() {
  const { isAdmin, isCheckingAdmin } = useAdmin();

  if (isCheckingAdmin) {
    return <div>Verificando permissões...</div>;
  }

  if (!isAdmin) {
    return <div>Acesso negado.</div>;
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Gerenciamento da Página Inicial</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddSectionDialog />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Seções de Produtos da Home</CardTitle>
          <CardDescription>
            Arraste para reordenar as seções. Adicione, edite ou remova produtos de cada seção.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SectionManager />
        </CardContent>
      </Card>
    </>
  );
}
