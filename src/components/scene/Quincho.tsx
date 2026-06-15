'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { site } from '@/data/site';
import { Parrilla } from './Parrilla';

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

// Procedural exposed-brick texture ("ladrillo hueco a la vista"): running-bond courses
// of terracotta bricks with mortar joints. One tile = 1 m x 1 m of wall.
function makeBrickTexture(): THREE.Texture {
  const W = 300;
  const H = 300;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b3a596'; // mortar
  ctx.fillRect(0, 0, W, H);

  const rows = 5; // ~0.2 m courses
  const cols = 3; // ~0.33 m bricks
  const bh = H / rows;
  const bw = W / cols;
  const joint = 4;
  const bricks = ['#bf6b43', '#b5613b', '#c5744d', '#b0593a', '#c97c54'];

  for (let r = 0; r < rows; r++) {
    const y = r * bh;
    const off = (r % 2) * (bw / 2);
    for (let c = -1; c <= cols; c++) {
      const x = c * bw + off;
      ctx.fillStyle = bricks[Math.abs(r * 3 + c) % bricks.length];
      ctx.fillRect(x + joint / 2, y + joint / 2, bw - joint, bh - joint);
      // faint horizontal ridges of the hollow brick
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      for (let k = 1; k < 4; k++) {
        ctx.beginPath();
        ctx.moveTo(x + joint / 2, y + (bh / 4) * k);
        ctx.lineTo(x + bw - joint / 2, y + (bh / 4) * k);
        ctx.stroke();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function repeated(base: THREE.Texture, rx: number, ry: number): THREE.Texture {
  const t = base.clone();
  t.needsUpdate = true;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  return t;
}

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

  // Low (back) roof edge — where the gutter hangs.
  const roofLen = q.depthM + 2 * OH;
  const gutterZ = zMid + (roofLen / 2) * Math.cos(roofAngle);
  const gutterY = roofY - (roofLen / 2) * Math.sin(roofAngle) - ROOF_T / 2 - 0.03;

  // Keep the left side (+x, viewing from the front) at fenceGap from the fence and let
  // the whole quincho sit offset toward that side, so the extra room is on the right.
  const centerX = site.widthM / 2 - q.fenceGapM - hw;

  const brickBase = useMemo(makeBrickTexture, []);
  // Back wall is a box (UV 0..1 per face); side walls are extruded (UV in meters).
  const brickBack = useMemo(
    () => repeated(brickBase, q.widthM / TILE, backH / TILE),
    [brickBase, q.widthM, backH],
  );
  const brickSide = useMemo(() => repeated(brickBase, 1 / TILE, 1 / TILE), [brickBase]);

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

      {/* back wall (north, lower) — exposed brick */}
      <mesh position={[0, FLOOR_Y + backH / 2, zBack - WALL_T / 2]}>
        <boxGeometry args={[q.widthM, backH, WALL_T]} />
        <meshStandardMaterial map={brickBack} roughness={0.9} />
      </mesh>

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

      {/* single-slope corrugated chapa roof */}
      <group position={[0, roofY, zMid]} rotation={[roofAngle, 0, 0]}>
        <mesh geometry={roofGeo} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={ROOF} metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
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
    </group>
  );
}
