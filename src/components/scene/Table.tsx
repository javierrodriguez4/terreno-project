// Large wooden table for 10 (4 per long side on benches + 1 chair at each end),
// for the middle of the quincho.

type Vec3 = [number, number, number];

const WOOD = '#7a4f2a';
const WOOD2 = '#8a5d33';

const L = 2.6; // table length (seats 4 per side)
const W = 0.9; // table width
const H = 0.75; // table height
const T = 0.06; // top thickness
const SEAT_H = 0.45;

function Leg({ x, z, h, top, size = 0.08, color = WOOD }: { x: number; z: number; h: number; top: number; size?: number; color?: string }) {
  return (
    <mesh position={[x, top - h / 2, z]}>
      <boxGeometry args={[size, h, size]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function Bench({ z }: { z: number }) {
  return (
    <group>
      <mesh position={[0, SEAT_H, z]}>
        <boxGeometry args={[2.4, 0.05, 0.3]} />
        <meshStandardMaterial color={WOOD2} roughness={0.85} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.0, SEAT_H / 2, z]}>
          <boxGeometry args={[0.06, SEAT_H - 0.05, 0.28]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Chair({ x }: { x: number }) {
  const sign = Math.sign(x);
  return (
    <group>
      {/* seat */}
      <mesh position={[x, SEAT_H, 0]}>
        <boxGeometry args={[0.42, 0.05, 0.42]} />
        <meshStandardMaterial color={WOOD2} roughness={0.85} />
      </mesh>
      {/* backrest on the outer side */}
      <mesh position={[x + sign * 0.19, SEAT_H + 0.22, 0]}>
        <boxGeometry args={[0.05, 0.42, 0.42]} />
        <meshStandardMaterial color={WOOD2} roughness={0.85} />
      </mesh>
      {/* legs */}
      {[-1, 1].map((a) =>
        [-1, 1].map((b) => (
          <Leg key={`${a}${b}`} x={x + a * 0.17} z={b * 0.17} h={SEAT_H - 0.05} top={SEAT_H - 0.05} size={0.05} />
        )),
      )}
    </group>
  );
}

export function Table({ position }: { position: Vec3 }) {
  const legX = L / 2 - 0.16;
  const legZ = W / 2 - 0.12;
  return (
    <group position={position}>
      {/* top */}
      <mesh position={[0, H - T / 2, 0]}>
        <boxGeometry args={[L, T, W]} />
        <meshStandardMaterial color={WOOD2} roughness={0.8} />
      </mesh>
      {/* aprons */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, H - 0.16, s * legZ]}>
          <boxGeometry args={[L - 0.2, 0.07, 0.06]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
      ))}
      {/* legs */}
      {[-1, 1].map((a) =>
        [-1, 1].map((b) => <Leg key={`${a}${b}`} x={a * legX} z={b * legZ} h={H - T} top={H - T} />),
      )}
      {/* benches (4 per side) */}
      <Bench z={-(W / 2 + 0.25)} />
      <Bench z={W / 2 + 0.25} />
      {/* chairs at the two ends */}
      <Chair x={-(L / 2 + 0.4)} />
      <Chair x={L / 2 + 0.4} />
    </group>
  );
}
