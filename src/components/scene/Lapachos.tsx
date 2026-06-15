import { site } from '@/data/site';

const TRUNK_H = 3; // meters
const FENCE_GAP = 0.5; // trunk distance from the east fence
const SPACING = 6; // center-to-center: a car fits between trees
const COUNT = 4;

const TRUNK = '#6b5034';
const GREENS = ['#4a7a32', '#3f6b2c', '#56883a'];

// Canopy blobs relative to the trunk top: [x, y, z, radius]
const CANOPY: [number, number, number, number][] = [
  [0, 0.3, 0, 1.5],
  [0.9, 0.5, 0.3, 1.1],
  [-0.8, 0.4, -0.4, 1.15],
  [0.3, 0.9, -0.7, 1.0],
  [-0.4, 0.8, 0.7, 1.05],
];

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, TRUNK_H / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, TRUNK_H, 8]} />
        <meshStandardMaterial color={TRUNK} />
      </mesh>
      <group position={[0, TRUNK_H, 0]}>
        {CANOPY.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 12, 12]} />
            <meshStandardMaterial color={GREENS[i % GREENS.length]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Four lapacho trees down the right side (when entering through the gate), ~0.5 m from
// the fence, starting near the quincho and spaced so a car fits between each pair.
export function Lapachos() {
  const x = -(site.widthM / 2 - FENCE_GAP);
  const d = site.depthM / 2;
  const quinchoFrontZ = d - site.quincho.fenceGapM - site.quincho.depthM;
  const startZ = quinchoFrontZ - 1; // first tree just in front of the quincho

  const trees = [];
  for (let i = 0; i < COUNT; i++) {
    trees.push(<Tree key={i} position={[x, 0, startZ - i * SPACING]} />);
  }
  return <group>{trees}</group>;
}
