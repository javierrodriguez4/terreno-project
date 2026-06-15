'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { site } from '@/data/site';
import { Parrilla } from './Parrilla';
import { Bathroom } from './Bathroom';
import { Table } from './Table';
import { BoxWallWithWindows } from './walls';
import { makeBrickTexture, repeated } from './textures';

const FLOOR_Y = 0.12; // slab top, meters
const WALL_T = 0.2;
const COL = 0.2;
const ROOF_T = 0.12;
const OH = 0.4; // roof overhang
const TILE = 1; // brick texture covers 1 m x 1 m of wall

const SLAB = '#bdb8af';
const COL_C = '#a9a39a';
const ROOF = '#9aa0a6';
const GUTTER = '#b8bcc0';
const PINE = '#c9a86a';

// Trapezoidal side wall: tall at the front, low at the back, following the roof slope.
function SideWall({
  x,
  zFront,
  qD,
  frontH,
  backH,
  map,
}: {
  x: number;
  zFront: number;
  qD: number;
  frontH: number;
  backH: number;
  map: THREE.Texture;
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
      <meshStandardMaterial map={map} roughness={0.9} />
    </mesh>
  );
}

// Quincho at the back (north), lengthwise across the width: concrete slab, exposed-brick
// back + side walls, open front with columns, single-slope chapa roof draining backward.
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

  // pine roof structure: cabios down the slope, clavadores across (chapa screws to these)
  const nCab = Math.max(2, Math.round(q.widthM / 0.9));
  const cabiosX = Array.from({ length: nCab + 1 }, (_, i) => -q.widthM / 2 + q.widthM * (i / nCab));
  const nCla = Math.max(2, Math.round(q.depthM / 0.8));
  const clavadoresZ = Array.from({ length: nCla + 1 }, (_, i) => -q.depthM / 2 + q.depthM * (i / nCla));

  // Low (back) roof edge — where the gutter hangs.
  const roofLen = q.depthM + 2 * OH;
  const gutterZ = zMid + (roofLen / 2) * Math.cos(roofAngle);
  const gutterY = roofY - (roofLen / 2) * Math.sin(roofAngle) - ROOF_T / 2 - 0.03;

  // Keep the left side (+x, viewing from the front) at fenceGap from the fence and let
  // the whole quincho sit offset toward that side, so the extra room is on the right.
  const centerX = site.widthM / 2 - q.fenceGapM - hw;

  const brickBase = useMemo(makeBrickTexture, []);
  // Side walls are extruded (UV in meters); the back wall (with windows) builds its own.
  const brickSide = useMemo(() => repeated(brickBase, 1 / TILE, 1 / TILE), [brickBase]);

  // light fixtures hanging over the table (centered, length along x)
  const lampSpots: [number, number][] = [
    [-0.85, zMid],
    [0, zMid],
    [0.85, zMid],
  ];

  // Corrugated chapa roof: a plane with sine ribs running down-slope so water drains.
  const roofGeo = useMemo(() => {
    const w = q.widthM + 2 * OH;
    const l = q.depthM + 2 * OH;
    const segX = Math.round(w / 0.03);
    const geo = new THREE.PlaneGeometry(w, l, segX, 1);
    const pos = geo.attributes.position;
    const amp = 0.04; // rib height
    const k = (2 * Math.PI) / 0.16; // ~16 cm pitch
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, Math.sin(pos.getX(i) * k) * amp);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [q.widthM, q.depthM]);

  return (
    <group position={[centerX, 0, 0]}>
      {/* concrete slab */}
      <mesh position={[0, FLOOR_Y / 2, zMid]}>
        <boxGeometry args={[q.widthM, FLOOR_Y, q.depthM]} />
        <meshStandardMaterial color={SLAB} />
      </mesh>

      {/* back wall (north, lower) — exposed brick with windows (galería + depósito) */}
      <BoxWallWithWindows
        cx={0}
        cz={zBack - WALL_T / 2}
        floorY={FLOOR_Y}
        axis="x"
        length={q.widthM}
        height={backH}
        thickness={WALL_T}
        brickBase={brickBase}
        windows={[
          { u: 0.6, w: 1.4, sill: 1.0, h: 0.9 },
          { u: -hw + WALL_T + q.bathroom.depthM / 2, w: 0.7, sill: 1.3, h: 0.55 },
        ]}
      />

      {/* side walls (trapezoidal) — exposed brick */}
      <SideWall x={-hw + WALL_T} zFront={zFront} qD={q.depthM} frontH={frontH} backH={backH} map={brickSide} />
      <SideWall x={hw} zFront={zFront} qD={q.depthM} frontH={frontH} backH={backH} map={brickSide} />

      {/* front columns (open side) */}
      {columnsX.map((x, i) => (
        <mesh key={i} position={[x, FLOOR_Y + frontH / 2, zFront]}>
          <boxGeometry args={[COL, frontH, COL]} />
          <meshStandardMaterial color={COL_C} />
        </mesh>
      ))}

      {/* single-slope corrugated chapa roof with real pine structure underneath */}
      <group position={[0, roofY, zMid]} rotation={[roofAngle, 0, 0]}>
        {/* chapa */}
        <mesh geometry={roofGeo} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={ROOF} metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* clavadores (alfajías) — across the width, just under the chapa */}
        {clavadoresZ.map((cz, i) => (
          <mesh key={`cl${i}`} position={[0, -0.06, cz]}>
            <boxGeometry args={[q.widthM + 2 * OH, 0.04, 0.06]} />
            <meshStandardMaterial color={PINE} roughness={0.85} />
          </mesh>
        ))}
        {/* cabios (tirantes) — down the slope, under the clavadores */}
        {cabiosX.map((cxp, i) => (
          <mesh key={`ca${i}`} position={[cxp, -0.12, 0]}>
            <boxGeometry args={[0.06, 0.1, q.depthM + 2 * OH]} />
            <meshStandardMaterial color={PINE} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* canaleta along the low (back) edge, draining to downspouts at both ends */}
      <mesh position={[0, gutterY, gutterZ]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, q.widthM + 0.2, 12]} />
        <meshStandardMaterial color={GUTTER} metalness={0.4} roughness={0.6} />
      </mesh>
      {[-hw, hw].map((x, i) => (
        <mesh key={i} position={[x, gutterY / 2, gutterZ]}>
          <cylinderGeometry args={[0.05, 0.05, gutterY, 10]} />
          <meshStandardMaterial color={GUTTER} metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* masonry parrilla + concrete mesada against the left wall */}
      <Parrilla />
      {/* small bathroom against the right wall, toward the front */}
      <Bathroom />

      {/* big wooden table for 10 in the middle */}
      <Table position={[0, 0, zMid]} />

      {/* hanging light fixtures over the table */}
      {lampSpots.map(([lx, lz], i) => (
        <group key={`lamp${i}`} position={[lx, 0, lz]}>
          <mesh position={[0, 2.3, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.32, 6]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 2.06, 0]}>
            <coneGeometry args={[0.13, 0.14, 14]} />
            <meshStandardMaterial color="#2a2a2a" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 1.99, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#fff3d0" emissive="#ffdf9e" emissiveIntensity={1.4} />
          </mesh>
          <pointLight position={[0, 1.95, 0]} intensity={4} distance={6} decay={2} color="#ffe6b0" />
        </group>
      ))}
    </group>
  );
}
