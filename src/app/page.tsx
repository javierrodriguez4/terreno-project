'use client';

import dynamic from 'next/dynamic';
import { InfoPanel } from '@/components/InfoPanel';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <div className="loading">Cargando 3D&hellip;</div>,
});

export default function Home() {
  return (
    <main className="stage">
      <Scene />
      <InfoPanel />
    </main>
  );
}
