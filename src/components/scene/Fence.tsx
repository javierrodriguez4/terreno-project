import { site } from '@/data/site';

const HEIGHT = 1.5; // meters
const POST_EVERY = 2.5; // meters

type Point = [number, number]; // [x, z]

function Rail({ from, to, y }: { from: Point; to: Point; y: number }) {
  const [x1, z1] = from;
  const [x2, z2] = to;
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  const len = Math.hypot(x2 - x1, z2 - z1);
  const alongX = Math.abs(x2 - x1) > Math.abs(z2 - z1);
  const args: [number, number, number] = alongX ? [len, 0.05, 0.05] : [0.05, 0.05, len];
  return (
    <mesh position={[cx, y, cz]}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#9a9a9a" />
    </mesh>
  );
}

function Posts({ from, to }: { from: Point; to: Point }) {
  const [x1, z1] = from;
  const [x2, z2] = to;
  const len = Math.hypot(x2 - x1, z2 - z1);
  const n = Math.max(1, Math.round(len / POST_EVERY));
  const posts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t;
    const z = z1 + (z2 - z1) * t;
    posts.push(
      <mesh key={i} position={[x, HEIGHT / 2, z]}>
        <boxGeometry args={[0.1, HEIGHT, 0.1]} />
        <meshStandardMaterial color="#6b6b6b" />
      </mesh>,
    );
  }
  return <group>{posts}</group>;
}

function Run({ from, to }: { from: Point; to: Point }) {
  return (
    <group>
      <Posts from={from} to={to} />
      <Rail from={from} to={to} y={HEIGHT * 0.4} />
      <Rail from={from} to={to} y={HEIGHT * 0.85} />
    </group>
  );
}

// Perimeter fence on all 4 sides. Lot is centered at the origin:
// x in [-w, w], z in [-d, d]. Front (gate) is the south edge at z = -d.
export function Fence() {
  const w = site.widthM / 2;
  const d = site.depthM / 2;
  const g = site.gate.widthM / 2;
  return (
    <group>
      {/* back (north) */}
      <Run from={[-w, d]} to={[w, d]} />
      {/* west */}
      <Run from={[-w, -d]} to={[-w, d]} />
      {/* east */}
      <Run from={[w, -d]} to={[w, d]} />
      {/* front (south), split around the centered gate opening */}
      <Run from={[-w, -d]} to={[-g, -d]} />
      <Run from={[g, -d]} to={[w, -d]} />
    </group>
  );
}
