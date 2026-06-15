'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { SceneContent } from '../scene/SceneContent';

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

type Vec3 = [number, number, number];

interface Stage3DProps {
  cameraPosition: Vec3;
  target: Vec3;
  fov?: number;
  minDistance?: number;
  maxDistance?: number;
}

// Reusable 3D stage: a Canvas with the shared scene and orbit controls. Each view
// configures its own camera position, target and zoom limits.
export function Stage3D({ cameraPosition, target, fov = 50, minDistance, maxDistance }: Stage3DProps) {
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
    <Canvas camera={{ position: cameraPosition, fov }} style={{ width: '100%', height: '100%' }}>
      <SceneContent />
      <OrbitControls
        target={target}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        minDistance={minDistance}
        maxDistance={maxDistance}
      />
    </Canvas>
  );
}
