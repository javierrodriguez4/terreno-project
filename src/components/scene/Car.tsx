// White Toyota Corolla 2012 (sedan) at real scale: 4.545 x 1.760 x 1.475 m,
// wheelbase 2.60 m. Simple but proportioned body, glass cabin and four wheels.

type Vec3 = [number, number, number];

const BODY = '#eceeec';
const GLASS = '#2a2f36';
const TIRE = '#191919';
const HUB = '#b7b7b7';

const L = 4.545;
const W = 1.76;
const WB = 2.6;
const WHEEL_R = 0.31;

export function Car({ position, rotationY = 0 }: { position: Vec3; rotationY?: number }) {
  const wx = W / 2 - 0.06;
  const wheels: Vec3[] = [
    [wx, WHEEL_R, WB / 2],
    [-wx, WHEEL_R, WB / 2],
    [wx, WHEEL_R, -WB / 2],
    [-wx, WHEEL_R, -WB / 2],
  ];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* lower body */}
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[W - 0.04, 0.55, L - 0.2]} />
        <meshStandardMaterial color={BODY} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* cabin glass */}
      <mesh position={[0, 1.05, -0.15]}>
        <boxGeometry args={[W - 0.2, 0.5, 2.1]} />
        <meshStandardMaterial color={GLASS} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* roof */}
      <mesh position={[0, 1.34, -0.15]}>
        <boxGeometry args={[W - 0.16, 0.1, 1.95]} />
        <meshStandardMaterial color={BODY} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* wheels */}
      {wheels.map((w, i) => (
        <group key={i} position={w}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.2, 16]} />
            <meshStandardMaterial color={TIRE} roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[w[0] > 0 ? 0.055 : -0.055, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.21, 12]} />
            <meshStandardMaterial color={HUB} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
