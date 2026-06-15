'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { Ground } from './scene/Ground';
import { Fence } from './scene/Fence';
import { FrontWall } from './scene/FrontWall';
import { Gate } from './scene/Gate';
import { Palms } from './scene/Palms';
import { CompassNorth } from './scene/CompassNorth';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function Scene() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  if (webgl === false) {
    return (
      <div className="fallback">
        Tu navegador no soporta 3D (WebGL). Probá con un navegador actualizado.
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [22, 27, -43], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <color attach="background" args={['#dfe7ef']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 30, 30]} intensity={1.1} />
      <Ground />
      <Grid
        args={[site.widthM, site.depthM]}
        cellSize={1}
        cellThickness={0.5}
        sectionSize={5}
        sectionThickness={1}
        cellColor="#5f7d40"
        sectionColor="#4a6332"
        fadeDistance={140}
        position={[0, 0.01, 0]}
      />
      <Fence />
      <FrontWall />
      <Gate />
      <Palms />
      <CompassNorth />
      <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2.05} enableDamping />
    </Canvas>
  );
}
