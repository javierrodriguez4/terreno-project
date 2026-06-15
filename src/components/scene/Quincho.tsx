'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { site } from '@/data/site';

const FLOOR_Y = 0.12; // slab top, meters
const WALL_T = 0.2;
const COL = 0.2;
const ROOF_T = 0.12;
const OH = 0.4; // roof overhang

const SLAB = '#bdb8af';
const WALL = '#c8a07d';
const COL_C = '#a9a39a';
const ROOF = '#9aa0a6';

// Trapezoidal side wall: tall at the front, low at the back, following the roof slope.
function SideWall({
  x,
  zFront,
  qD,
  frontH,
  backH,
}: {
  x: number;
  zFront: number;
  qD: number;
  frontH: number;
  backH: number;
}) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); // front-bottom
    s.lineTo(qD, 0); // back-bottom
    s.lineTo(qD, backH); // back-top
    s.lineTo(0, frontH); // front-top
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: WALL_T, bevelEnabled: false });
  }, [qD, frontH, backH]);

  // rotation maps shape-x -> world z (depth), extrude -> world x (thickness)
  return (
    <mesh geometry={geo} rotation={[0, -Math.PI / 2, 0]} position={[x, FLOOR_Y, zFront]}>
      <meshStandardMaterial color={WALL} />
    </mesh>
  );
}

// Quincho at the back (north), lengthwise across the width: concrete slab, back + two
// side walls, open front with columns, single-slope chapa roof draining to the back.
export function Quincho() {
  const q = site.quincho;
  const d = site.depthM / 2;
  const hw = q.widthM / 2;
  const zBack = d - q.fenceGapM; // outer face of the back wall
  const zFront = zBack - q.depthM; // open front
  const zMid = (zBack + zFront) / 2;
  const frontH = q.frontHeightM;
  const backH = q.backHeightM;

  const columnsX = [];
  for (let i = 0; i < 4; i++) {
    columnsX.push(-hw + q.widthM * (i / 3));
  }

  const roofAngle = Math.atan2(frontH - backH, q.depthM);
  const roofY = FLOOR_Y + (frontH + backH) / 2 + ROOF_T / 2;

  return (
    <group>
      {/* concrete slab */}
      <mesh position={[0, FLOOR_Y / 2, zMid]}>
        <boxGeometry args={[q.widthM, FLOOR_Y, q.depthM]} />
        <meshStandardMaterial color={SLAB} />
      </mesh>

      {/* back wall (north, lower) */}
      <mesh position={[0, FLOOR_Y + backH / 2, zBack - WALL_T / 2]}>
        <boxGeometry args={[q.widthM, backH, WALL_T]} />
        <meshStandardMaterial color={WALL} />
      </mesh>

      {/* side walls (trapezoidal) */}
      <SideWall x={-hw + WALL_T} zFront={zFront} qD={q.depthM} frontH={frontH} backH={backH} />
      <SideWall x={hw} zFront={zFront} qD={q.depthM} frontH={frontH} backH={backH} />

      {/* front columns (open side) */}
      {columnsX.map((x, i) => (
        <mesh key={i} position={[x, FLOOR_Y + frontH / 2, zFront]}>
          <boxGeometry args={[COL, frontH, COL]} />
          <meshStandardMaterial color={COL_C} />
        </mesh>
      ))}

      {/* single-slope chapa roof */}
      <mesh position={[0, roofY, zMid]} rotation={[roofAngle, 0, 0]}>
        <boxGeometry args={[q.widthM + 2 * OH, ROOF_T, q.depthM + 2 * OH]} />
        <meshStandardMaterial color={ROOF} metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}
