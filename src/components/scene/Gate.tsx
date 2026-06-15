import { site } from '@/data/site';

const HEIGHT = 1.2; // gate height, meters
const RAIL_COUNT = 4; // horizontal rails per leaf
const MEMBER = 0.06; // wood member thickness
const RAIL_BOTTOM = 0.15;
const RAIL_TOP = 1.05;
const WOOD = '#7a4a22';

// One leaf of a farm gate (tranquera): two vertical stiles, horizontal rails, and a
// diagonal brace. `flip` mirrors the diagonal so the two leaves form an "N".
function Leaf({ x0, x1, flip }: { x0: number; x1: number; flip: boolean }) {
  const w = Math.abs(x1 - x0);
  const cx = (x0 + x1) / 2;

  const rails = [];
  for (let i = 0; i < RAIL_COUNT; i++) {
    const y = RAIL_BOTTOM + (RAIL_TOP - RAIL_BOTTOM) * (i / (RAIL_COUNT - 1));
    rails.push(
      <mesh key={i} position={[cx, y, 0]}>
        <boxGeometry args={[w, MEMBER, MEMBER]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>,
    );
  }

  const braceAngle = (flip ? -1 : 1) * Math.atan2(HEIGHT - 0.2, w);
  const braceLen = Math.hypot(w, HEIGHT - 0.2);

  return (
    <group>
      {/* stiles */}
      <mesh position={[x0, HEIGHT / 2, 0]}>
        <boxGeometry args={[MEMBER, HEIGHT, MEMBER]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
      <mesh position={[x1, HEIGHT / 2, 0]}>
        <boxGeometry args={[MEMBER, HEIGHT, MEMBER]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
      {rails}
      {/* diagonal brace */}
      <mesh position={[cx, HEIGHT / 2, 0]} rotation={[0, 0, braceAngle]}>
        <boxGeometry args={[braceLen, MEMBER, MEMBER * 0.8]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
    </group>
  );
}

// Double-leaf farm gate (tranquera) centered on the front (south) edge.
export function Gate() {
  const d = site.depthM / 2;
  const g = site.gate.widthM / 2;
  return (
    <group position={[0, 0, -d]}>
      <Leaf x0={-g} x1={0} flip={false} />
      <Leaf x0={0} x1={g} flip={true} />
    </group>
  );
}
