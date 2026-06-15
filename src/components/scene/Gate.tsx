import { site } from '@/data/site';

const HEIGHT = 1.3; // meters

// Double-leaf wooden gate (tranquera) centered on the front (south) edge.
export function Gate() {
  const d = site.depthM / 2;
  const leafW = site.gate.widthM / 2; // two leaves fill the opening
  return (
    <group position={[0, 0, -d]}>
      <mesh position={[-leafW / 2, HEIGHT / 2, 0]}>
        <boxGeometry args={[leafW - 0.05, HEIGHT, 0.06]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
      <mesh position={[leafW / 2, HEIGHT / 2, 0]}>
        <boxGeometry args={[leafW - 0.05, HEIGHT, 0.06]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
    </group>
  );
}
