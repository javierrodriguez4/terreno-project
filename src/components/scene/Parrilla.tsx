'use client';

import { useMemo } from 'react';
import { site } from '@/data/site';
import { makeBrickTexture, repeated } from './textures';

// Argentine standard masonry parrilla (exposed brick) + concrete mesada with a small
// sink, against the left wall (viewing from the front). Parrilla sits toward the front;
// the mesada continues toward the back. Standards: boca ~0.70 m, counter ~0.90 m,
// campana ~0.25 m above the boca, chimney above the roof.

const FLOOR_Y = 0.12;
const WALL_T = 0.2;

const CONCRETE = '#aca69b';
const CONCRETE_DARK = '#8f8a80';
const GRILL = '#3a3a3a';
const METAL = '#c2c6ca';

const COUNTER_H = 0.9;
const BOCA_TOP = 1.6; // boca from 0.90 to 1.60 -> 0.70 m tall
const CAMPANA_BOTTOM = 1.85; // ~0.25 m above the boca
const CAMPANA_TOP = 2.45;
const GRILL_H = 1.05;
const CHIMNEY_TOP = 3.7; // above the roof for draft

const PARR_DEPTH = 0.7; // into the room (x)
const PARR_WIDTH = 1.2; // along the wall (z)
const MESADA_DEPTH = 0.6;

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
  const frontX = wallInner - PARR_DEPTH; // front face of the parrilla

  const mesZStart = zFront + 0.1 + PARR_WIDTH;
  const mesZEnd = backInner;
  const mesLen = mesZEnd - mesZStart;
  const mesZc = (mesZStart + mesZEnd) / 2;
  const mesXc = wallInner - MESADA_DEPTH / 2;
  const sinkZ = mesZEnd - 0.45;

  // exposed-brick textures for the parrilla (mesada stays concrete)
  const brickBase = useMemo(makeBrickTexture, []);
  const tex = useMemo(
    () => ({
      body: repeated(brickBase, 1.2, 0.9),
      jamb: repeated(brickBase, 0.7, 1),
      lintel: repeated(brickBase, 1.2, 0.3),
      campana: repeated(brickBase, 1, 0.6),
      chimney: repeated(brickBase, 0.4, 1),
    }),
    [brickBase],
  );

  return (
    <group>
      {/* ---- mesada (concrete) ---- */}
      <mesh position={[mesXc, base + COUNTER_H / 2, mesZc]}>
        <boxGeometry args={[MESADA_DEPTH, COUNTER_H, mesLen]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
      <mesh position={[mesXc - 0.02, base + COUNTER_H + 0.03, mesZc]}>
        <boxGeometry args={[MESADA_DEPTH + 0.06, 0.06, mesLen + 0.06]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
      {/* pileta (sink) + cold-water tap */}
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

      {/* ---- parrilla (exposed brick) ---- */}
      {/* base (leñero) */}
      <mesh position={[parrXc, base + COUNTER_H / 2, parrZc]}>
        <boxGeometry args={[PARR_DEPTH, COUNTER_H, PARR_WIDTH]} />
        <meshStandardMaterial map={tex.body} roughness={0.95} />
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
      {/* campana (hood) — square frustum */}
      <mesh
        position={[parrXc - 0.05, base + (CAMPANA_BOTTOM + CAMPANA_TOP) / 2, parrZc]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <cylinderGeometry args={[0.22, 0.82, CAMPANA_TOP - CAMPANA_BOTTOM, 4]} />
        <meshStandardMaterial map={tex.campana} roughness={0.95} />
      </mesh>
      {/* chimney above the roof */}
      <mesh position={[parrXc - 0.05, base + (CAMPANA_TOP + CHIMNEY_TOP) / 2, parrZc]}>
        <boxGeometry args={[0.4, CHIMNEY_TOP - CAMPANA_TOP, 0.4]} />
        <meshStandardMaterial map={tex.chimney} roughness={0.95} />
      </mesh>
    </group>
  );
}
