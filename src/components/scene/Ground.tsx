import { site } from '@/data/site';

// Flat ground plane at real scale (1 unit = 1 meter), laid on the XZ plane.
export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[site.widthM, site.depthM]} />
      <meshStandardMaterial color="#6f8f4a" />
    </mesh>
  );
}
