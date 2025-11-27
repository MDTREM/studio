'use client';
import { Suspense } from 'react';
import CatalogoClientPage from './CatalogoClientPage';

// This component acts as a Suspense boundary for the client component
// that uses useSearchParams().
export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="container max-w-7xl mx-auto px-4 py-12 text-center">Carregando produtos...</div>}>
      <CatalogoClientPage />
    </Suspense>
  );
}
