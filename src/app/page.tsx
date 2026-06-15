'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ViewTabs, type ViewKey } from '@/components/views/ViewTabs';

const ExteriorView = dynamic(() => import('@/components/views/ExteriorView').then((m) => m.ExteriorView), {
  ssr: false,
  loading: () => <div className="loading">Cargando 3D&hellip;</div>,
});
const InteriorView = dynamic(() => import('@/components/views/InteriorView').then((m) => m.InteriorView), {
  ssr: false,
  loading: () => <div className="loading">Cargando 3D&hellip;</div>,
});
const PlanosView = dynamic(() => import('@/components/views/PlanosView').then((m) => m.PlanosView), {
  ssr: false,
  loading: () => <div className="loading">Cargando planos&hellip;</div>,
});

export default function Home() {
  const [view, setView] = useState<ViewKey>('exterior');
  return (
    <main className="app">
      <ViewTabs active={view} onChange={setView} />
      <div className="view">
        {view === 'exterior' && <ExteriorView />}
        {view === 'interior' && <InteriorView />}
        {view === 'planos' && <PlanosView />}
      </div>
    </main>
  );
}
