'use client';

import { useMemo } from 'react';
import type { Texture } from 'three';
import { site } from '@/data/site';
import { makeBrickTexture, repeated } from './textures';

// Argentine standard masonry parrilla (exposed brick) + concrete mesadas against the
// left wall (viewing from the front). The wall mesada and a facing "desayunador" island
// are open underneath (brick legs + concrete top) for storage. Standards: boca ~0.70 m,
// counter ~0.90 m, campana ~0.25 m above the boca, chimney above the roof.

const FLOOR_Y = 0.12;
const WALL_T = 0.2;

const CONCRETE = '#aca69b';
const CONCRETE_DARK = '#8f8a80';
const GRILL = '#3a3a3a';
const METAL = '#c2c6ca';

const COUNTER_H = 0.9;
const TOP_T = 0.08;
const BOCA_TOP = 1.6; // boca from 0.90 to 1.60 -> 0.70 m tall
const CAMPANA_BOTTOM = 1.85; // ~0.25 m above the boca
const CAMPANA_TOP = 2.45;
const GRILL_H = 1.05;
const CHIMNEY_TOP = 3.7; // above the roof for draft

const PARR_DEPTH = 0.7; // into the room (x)
const PARR_WIDTH = 1.2; // along the wall (z)
const THROAT = 0.45; // campana top opening / chimney flue
const MESADA_DEPTH = 0.6;
const AISLE = 0.9; // space to stand and cook between the two mesadas

// Brick corbelled campana (hood) that funnels the smoke from the parrilla footprint up
// to a hollow brick chimney with an open flue and a rain cap, so the smoke actually exits.
function Campana({ x, z, base, brick }: { x: number; z: number; base: number; brick: Texture }) {
  const N = 5;
  const dy = (CAMPANA_TOP - CAMPANA_BOTTOM) / N;
  const rings = [];
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    const xs = PARR_DEPTH + (THROAT - PARR_DEPTH) * t;
    const zs = PARR_WIDTH + (THROAT - PARR_WIDTH) * t;
    const yc = base + CAMPANA_BOTTOM + i * dy + dy / 2;
    const h = dy + 0.02;
    rings.push(
      <group key={i}>
        <mesh position={[x - xs / 2, yc, z]}><boxGeometry args={[0.08, h, zs]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
        <mesh position={[x + xs / 2, yc, z]}><boxGeometry args={[0.08, h, zs]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
        <mesh position={[x, yc, z - zs / 2]}><boxGeometry args={[xs, h, 0.08]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
        <mesh position={[x, yc, z + zs / 2]}><boxGeometry args={[xs, h, 0.08]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
      </group>,
    );
  }
  const Hc = CHIMNEY_TOP - CAMPANA_TOP;
  const cyc = base + (CAMPANA_TOP + CHIMNEY_TOP) / 2;
  const o = 0.25; // half outer size of the chimney
  return (
    <group>
      {rings}
      {/* hollow chimney tube (open flue) */}
      <mesh position={[x - o, cyc, z]}><boxGeometry args={[0.08, Hc, 2 * o]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
      <mesh position={[x + o, cyc, z]}><boxGeometry args={[0.08, Hc, 2 * o]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
      <mesh position={[x, cyc, z - o]}><boxGeometry args={[2 * o, Hc, 0.08]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
      <mesh position={[x, cyc, z + o]}><boxGeometry args={[2 * o, Hc, 0.08]} /><meshStandardMaterial map={brick} roughness={0.95} /></mesh>
      {/* rain cap (sombrerete) on short posts — smoke exits under it */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[x + sx * (o - 0.03), base + CHIMNEY_TOP + 0.12, z + sz * (o - 0.03)]}>
          <boxGeometry args={[0.05, 0.24, 0.05]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[x, base + CHIMNEY_TOP + 0.27, z]}>
        <boxGeometry args={[2 * o + 0.18, 0.06, 2 * o + 0.18]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.9} />
      </mesh>
    </group>
  );
}

// A counter open underneath: concrete top on brick legs, with an optional brick back
// panel (so storage opens toward one side only).
function OpenCounter({
  xc,
  zStart,
  zEnd,
  depthX,
  brickBase,
  backSign,
}: {
  xc: number;
  zStart: number;
  zEnd: number;
  depthX: number;
  brickBase: Texture;
  backSign?: number;
}) {
  const lenZ = zEnd - zStart;
  const zc = (zStart + zEnd) / 2;
  const topY = FLOOR_Y + COUNTER_H;
  const legH = COUNTER_H - TOP_T;
  const legTex = useMemo(() => repeated(brickBase, Math.max(0.5, depthX), 0.82), [brickBase, depthX]);
  const panelTex = useMemo(() => repeated(brickBase, Math.max(0.6, lenZ), 0.82), [brickBase, lenZ]);
  const legZs = [zStart + 0.12, zc, zEnd - 0.12];
  return (
    <group>
      {/* concrete top */}
      <mesh position={[xc, topY - TOP_T / 2, zc]}>
        <boxGeometry args={[depthX + 0.04, TOP_T, lenZ + 0.04]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
      {/* brick legs (open between them for storage) */}
      {legZs.map((lz, i) => (
        <mesh key={i} position={[xc, FLOOR_Y + legH / 2, lz]}>
          <boxGeometry args={[depthX, legH, 0.12]} />
          <meshStandardMaterial map={legTex} roughness={0.95} />
        </mesh>
      ))}
      {/* concrete shelf for storage */}
      <mesh position={[xc, FLOOR_Y + 0.42, zc]}>
        <boxGeometry args={[depthX - 0.06, 0.05, lenZ - 0.28]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
      {/* optional brick back panel (closes the far side) */}
      {backSign !== undefined && (
        <mesh position={[xc + backSign * (depthX / 2 - 0.03), FLOOR_Y + legH / 2, zc]}>
          <boxGeometry args={[0.06, legH, lenZ]} />
          <meshStandardMaterial map={panelTex} roughness={0.95} />
        </mesh>
      )}
    </group>
  );
}

export function Parrilla() {
  const q = site.quincho;
  const d = site.depthM / 2;
  const hw = q.widthM / 2;
  const zBack = d - q.fenceGapM;
  const zFront = zBack - q.depthM;
  const wallInner = hw - WALL_T; // inner face of the left wall
  const backInner = zBack - WALL_T;
  const base = FLOOR_Y;

  // parrilla toward the FRONT; mesada continues toward the BACK
  const parrZc = zFront + 0.1 + PARR_WIDTH / 2;
  const parrXc = wallInner - PARR_DEPTH / 2;
  const frontX = wallInner - PARR_DEPTH;

  // wall mesada (open underneath; back is the wall)
  const mesZStart = zFront + 0.1 + PARR_WIDTH;
  const mesZEnd = backInner;
  const mesXc = wallInner - MESADA_DEPTH / 2;
  const sinkZ = mesZEnd - 0.45;

  // desayunador island facing the wall mesada, across the aisle (open toward it)
  const desFrontX = wallInner - MESADA_DEPTH - AISLE; // face toward the aisle
  const desXc = desFrontX - MESADA_DEPTH / 2;

  const brickBase = useMemo(makeBrickTexture, []);
  const tex = useMemo(
    () => ({
      body: repeated(brickBase, 1.2, 0.9),
      jamb: repeated(brickBase, 0.7, 1),
      lintel: repeated(brickBase, 1.2, 0.3),
    }),
    [brickBase],
  );

  return (
    <group>
      {/* ---- wall mesada (concrete top, open underneath) ---- */}
      <OpenCounter xc={mesXc} zStart={mesZStart} zEnd={mesZEnd} depthX={MESADA_DEPTH} brickBase={brickBase} />
      {/* pileta (sink) + cold-water tap on the wall mesada */}
      <mesh position={[mesXc, base + COUNTER_H - 0.02, sinkZ]}>
        <boxGeometry args={[0.36, 0.12, 0.36]} />
        <meshStandardMaterial color={CONCRETE_DARK} roughness={0.95} />
      </mesh>
      <mesh position={[mesXc + 0.16, base + COUNTER_H + 0.11, sinkZ]}>
        <cylinderGeometry args={[0.016, 0.016, 0.22, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[mesXc + 0.08, base + COUNTER_H + 0.2, sinkZ]}>
        <boxGeometry args={[0.18, 0.025, 0.025]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* ---- desayunador island (open toward the wall mesada, brick back panel) ---- */}
      <OpenCounter
        xc={desXc}
        zStart={mesZStart}
        zEnd={mesZEnd}
        depthX={MESADA_DEPTH}
        brickBase={brickBase}
        backSign={-1}
      />

      {/* ---- parrilla (exposed brick) ---- */}
      {/* leñero: open underneath (like the mesada) to store cut firewood. Side legs
          carry the hearth slab; the front and middle stay open. */}
      {[-1, 1].map((s) => (
        <mesh key={`leg${s}`} position={[parrXc, base + COUNTER_H / 2, parrZc + s * (PARR_WIDTH / 2 - 0.08)]}>
          <boxGeometry args={[PARR_DEPTH, COUNTER_H, 0.16]} />
          <meshStandardMaterial map={tex.body} roughness={0.95} />
        </mesh>
      ))}
      {/* hearth slab (firebox floor, on top of the legs) */}
      <mesh position={[parrXc, base + COUNTER_H - 0.05, parrZc]}>
        <boxGeometry args={[PARR_DEPTH, 0.1, PARR_WIDTH]} />
        <meshStandardMaterial map={tex.body} roughness={0.95} />
      </mesh>
      {/* leñero shelf for stacking firewood */}
      <mesh position={[parrXc, base + 0.4, parrZc]}>
        <boxGeometry args={[PARR_DEPTH - 0.06, 0.05, PARR_WIDTH - 0.22]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
      {/* side jambs framing the boca */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[parrXc, base + (COUNTER_H + CAMPANA_BOTTOM) / 2, parrZc + s * (PARR_WIDTH / 2 - 0.075)]}
        >
          <boxGeometry args={[PARR_DEPTH, CAMPANA_BOTTOM - COUNTER_H, 0.15]} />
          <meshStandardMaterial map={tex.jamb} roughness={0.95} />
        </mesh>
      ))}
      {/* front lintel above the boca */}
      <mesh position={[frontX + 0.06, base + (BOCA_TOP + CAMPANA_BOTTOM) / 2, parrZc]}>
        <boxGeometry args={[0.12, CAMPANA_BOTTOM - BOCA_TOP, PARR_WIDTH]} />
        <meshStandardMaterial map={tex.lintel} roughness={0.95} />
      </mesh>
      {/* grill grate */}
      <mesh position={[parrXc, base + GRILL_H, parrZc]}>
        <boxGeometry args={[PARR_DEPTH - 0.12, 0.03, PARR_WIDTH - 0.22]} />
        <meshStandardMaterial color={GRILL} metalness={0.5} roughness={0.6} />
      </mesh>
      {/* brick corbelled campana + hollow chimney with rain cap */}
      <Campana x={parrXc} z={parrZc} base={base} brick={tex.body} />
    </group>
  );
}
