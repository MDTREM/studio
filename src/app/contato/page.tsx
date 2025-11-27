import { Suspense } from 'react';
import ContatoClientPage from './ContatoClientPage';

// This component acts as a Suspense boundary for the client component
// that uses useSearchParams().
export default function ContatoPage() {
  return (
    <Suspense fallback={<div className="container max-w-2xl mx-auto px-4 py-12 text-center">Carregando...</div>}>
      <ContatoClientPage />
    </Suspense>
  );
}
