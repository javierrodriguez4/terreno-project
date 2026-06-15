'use client';

import { Html } from '@react-three/drei';
import { site } from '@/data/site';

// North indicator: an arrow pointing toward the fondo (+Z = north) with a label.
export function CompassNorth() {
  const d = site.depthM / 2;
  const x = site.widthM / 2 + 2; // just outside the east fence
  return (
    <group position={[x, 0, d - 3]}>
      {/* shaft */}
      <mesh position={[0, 0.05, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 2, 8]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      {/* head pointing +Z (north) */}
      <mesh position={[0, 0.05, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.6, 8]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      <Html position={[0, 0.6, 0.9]} center distanceFactor={28}>
        <div style={{ color: '#c0392b', fontWeight: 700, fontFamily: 'sans-serif' }}>N</div>
      </Html>
    </group>
  );
}
