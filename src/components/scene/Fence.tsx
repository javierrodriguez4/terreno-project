import { site } from '@/data/site';

const HEIGHT = 1.5; // meters
const POST_EVERY = 2.5; // meters
const WIRE_COUNT = 7; // strands of wire
const WIRE_BOTTOM = 0.25;
const WIRE_TOP = 1.45;

type Point = [number, number]; // [x, z]

function Wire({ from, to, y }: { from: Point; to: Point; y: number }) {
  const [x1, z1] = from;
  const [x2, z2] = to;
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  const len = Math.hypot(x2 - x1, z2 - z1);
  const alongX = Math.abs(x2 - x1) > Math.abs(z2 - z1);
  const args: [number, number, number] = alongX ? [len, 0.015, 0.015] : [0.015, 0.015, len];
  return (
    <mesh position={[cx, y, cz]}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#cfcfcf" metalness={0.4} roughness={0.6} />
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
        <meshStandardMaterial color="#6b5638" />
      </mesh>,
    );
  }
  return <group>{posts}</group>;
}

function Run({ from, to }: { from: Point; to: Point }) {
  const wires = [];
  for (let i = 0; i < WIRE_COUNT; i++) {
    const y = WIRE_BOTTOM + (WIRE_TOP - WIRE_BOTTOM) * (i / (WIRE_COUNT - 1));
    wires.push(<Wire key={i} from={from} to={to} y={y} />);
  }
  return (
    <group>
      <Posts from={from} to={to} />
      {wires}
    </group>
  );
}

// Perimeter wire fence (7 strands). Lot centered at origin: x in [-w, w], z in [-d, d].
// The front (south) edge is wood, handled by <FrontWall>, so it is not drawn here.
export function Fence() {
  const w = site.widthM / 2;
  const d = site.depthM / 2;
  return (
    <group>
      {/* back (north) */}
      <Run from={[-w, d]} to={[w, d]} />
      {/* west */}
      <Run from={[-w, -d]} to={[-w, d]} />
      {/* east */}
      <Run from={[w, -d]} to={[w, d]} />
    </group>
  );
}
