import { site } from '@/data/site';

const TRUNK_H = 3; // meters
const OFFSET = 0.5; // meters in from the front corner post, and behind the boards

function Frond({ angle, droop, length }: { angle: number; droop: number; length: number }) {
  return (
    <group rotation={[0, angle, 0]}>
      <mesh position={[length / 2, 0, 0]} rotation={[0, 0, droop]}>
        <boxGeometry args={[length, 0.05, 0.28]} />
        <meshStandardMaterial color="#3f7d3a" />
      </mesh>
    </group>
  );
}

function Palm({ position }: { position: [number, number, number] }) {
  const fronds = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    // alternate droop and length a little so the crown looks natural
    const droop = i % 2 === 0 ? -0.35 : -0.5;
    const length = i % 2 === 0 ? 1.7 : 1.4;
    fronds.push(<Frond key={i} angle={(i / n) * Math.PI * 2} droop={droop} length={length} />);
  }
  return (
    <group position={position}>
      <mesh position={[0, TRUNK_H / 2, 0]}>
        <cylinderGeometry args={[0.13, 0.2, TRUNK_H, 8]} />
        <meshStandardMaterial color="#8a6b43" />
      </mesh>
      <group position={[0, TRUNK_H, 0]}>
        {fronds}
        <mesh>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshStandardMaterial color="#5b4a2f" />
        </mesh>
      </group>
    </group>
  );
}

// One decorative palm on each side of the front, just inside the corner, behind the
// wood boards — so the lot looks nice from the street.
export function Palms() {
  const w = site.widthM / 2;
  const d = site.depthM / 2;
  const x = w - OFFSET;
  const z = -d + OFFSET;
  return (
    <group>
      <Palm position={[-x, 0, z]} />
      <Palm position={[x, 0, z]} />
    </group>
  );
}
