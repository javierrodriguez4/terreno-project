import type { ReactElement } from 'react';
import { site } from '@/data/site';

const TRUNK_H = 4.2; // meters
const TRUNK_SEGS = 9; // stacked segments give a ringed palm-trunk look
const FROND_COUNT = 13;
const OFFSET = 0.5; // meters in from the front corner post, and behind the boards

const LEAF = '#3f7d3a';
const LEAF_DARK = '#356b31';
const TRUNK = '#8a6b43';

// An arching, drooping palm frond built from a few segments along a curve.
function Frond({ angle, tip }: { angle: number; tip: boolean }) {
  const segs = [
    { len: 0.85, tilt: 0.1, w: 0.26 },
    { len: 0.75, tilt: -0.4, w: 0.2 },
    { len: 0.6, tilt: -0.75, w: 0.13 },
  ];
  let x = 0;
  let y = 0;
  let acc = 0;
  const meshes: ReactElement[] = [];
  segs.forEach((s, i) => {
    acc += s.tilt;
    const cx = x + (Math.cos(acc) * s.len) / 2;
    const cy = y + (Math.sin(acc) * s.len) / 2;
    meshes.push(
      <mesh key={i} position={[cx, cy, 0]} rotation={[0, 0, acc]}>
        <boxGeometry args={[s.len, 0.04, s.w]} />
        <meshStandardMaterial color={tip ? LEAF_DARK : LEAF} />
      </mesh>,
    );
    x += Math.cos(acc) * s.len;
    y += Math.sin(acc) * s.len;
  });
  return <group rotation={[0, angle, 0]}>{meshes}</group>;
}

function Palm({ position }: { position: [number, number, number] }) {
  // ringed, slightly tapered trunk
  const trunk = [];
  const segH = TRUNK_H / TRUNK_SEGS;
  for (let i = 0; i < TRUNK_SEGS; i++) {
    const t = i / (TRUNK_SEGS - 1);
    const r = 0.19 - t * 0.08;
    const ring = i % 2 === 0 ? 1.08 : 1.0;
    trunk.push(
      <mesh key={i} position={[0, segH * (i + 0.5), 0]}>
        <cylinderGeometry args={[r * 0.95, r * ring, segH * 1.02, 8]} />
        <meshStandardMaterial color={TRUNK} />
      </mesh>,
    );
  }

  const fronds = [];
  for (let i = 0; i < FROND_COUNT; i++) {
    fronds.push(<Frond key={i} angle={(i / FROND_COUNT) * Math.PI * 2} tip={i % 2 === 0} />);
  }

  return (
    <group position={position}>
      {trunk}
      <group position={[0, TRUNK_H, 0]}>
        {fronds}
        {/* crown base / fruit cluster */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.16, 8, 8]} />
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
