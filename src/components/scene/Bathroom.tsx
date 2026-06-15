'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { site } from '@/data/site';
import { makeBrickTexture, repeated } from './textures';
import { BoxWallWithWindows } from './walls';

// Bathroom + depósito in the front-right corner (opposite the parrilla). Exposed-brick
// partition walls that share the quincho's right wall and back wall and rise to meet the
// quincho roof (no separate ceiling). Two doors face the interior: bathroom (front),
// depósito/storage (behind).

const FLOOR_Y = 0.12;
const QWALL_T = 0.2;
const T = 0.12; // brick partition thickness
const DOOR_H = 2.0;
const DOOR_W = 0.75;
const WHITE = '#f1f0ea'; // porcelain
const METAL = '#c2c6ca';

export function Bathroom() {
  const q = site.quincho;
  const d = site.depthM / 2;
  const hw = q.widthM / 2;
  const zBack = d - q.fenceGapM;
  const zFront = zBack - q.depthM;
  const frontH = q.frontHeightM;
  const backH = q.backHeightM;
  const rightInner = -hw + QWALL_T; // inner face of the right wall
  const backInner = zBack - QWALL_T; // inner face of the back wall
  const b = q.bathroom;
  const innerX = rightInner + b.depthM; // partition facing the interior
  const xcWall = (rightInner + innerX) / 2;
  const segX = innerX - T / 2;
  const z0 = zFront + 0.05; // bathroom front
  const zPart = z0 + b.lengthM; // baño / depósito partition

  const roofH = (z: number) => frontH - ((frontH - backH) * (z - zFront)) / q.depthM;

  const banoDoorZ0 = z0 + 0.25;
  const banoDoorZ1 = banoDoorZ0 + DOOR_W;
  const depDoorZ0 = zPart + 0.35;
  const depDoorZ1 = depDoorZ0 + DOOR_W;

  const brickBase = useMemo(makeBrickTexture, []);
  const texWall = useMemo(() => repeated(brickBase, b.depthM, 2.8), [brickBase, b.depthM]);
  const texHeader = useMemo(() => repeated(brickBase, backInner - z0, 1), [brickBase, backInner, z0]);
  const texSeg = useMemo(() => repeated(brickBase, 1, 2), [brickBase]);

  // header band above the doors, sloped to meet the roof
  const headerGeo = useMemo(() => {
    const L = backInner - z0;
    const hF = roofH(z0);
    const hB = roofH(backInner);
    const s = new THREE.Shape();
    s.moveTo(0, DOOR_H);
    s.lineTo(L, DOOR_H);
    s.lineTo(L, hB);
    s.lineTo(0, hF);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: T, bevelEnabled: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backInner, z0, frontH, backH, q.depthM]);

  const seg = (za: number, zb: number, key: string) => (
    <mesh key={key} position={[segX, FLOOR_Y + DOOR_H / 2, (za + zb) / 2]}>
      <boxGeometry args={[T, DOOR_H, zb - za]} />
      <meshStandardMaterial map={texSeg} roughness={0.95} />
    </mesh>
  );

  return (
    <group>
      {/* front wall with a high ventiluz */}
      <BoxWallWithWindows
        cx={xcWall}
        cz={z0}
        floorY={FLOOR_Y}
        axis="x"
        length={b.depthM}
        height={roofH(z0)}
        thickness={T}
        brickBase={brickBase}
        windows={[{ u: 0, w: 0.6, sill: 1.65, h: 0.4 }]}
      />
      {/* partition between baño and depósito */}
      <mesh position={[xcWall, FLOOR_Y + roofH(zPart) / 2, zPart]}>
        <boxGeometry args={[b.depthM, roofH(zPart), T]} />
        <meshStandardMaterial map={texWall} roughness={0.95} />
      </mesh>
      {/* inner wall: sloped header band + segments leaving two door openings */}
      <mesh geometry={headerGeo} rotation={[0, -Math.PI / 2, 0]} position={[innerX, FLOOR_Y, z0]}>
        <meshStandardMaterial map={texHeader} roughness={0.95} />
      </mesh>
      {seg(z0, banoDoorZ0, 's1')}
      {seg(banoDoorZ1, depDoorZ0, 's2')}
      {seg(depDoorZ1, backInner, 's3')}

      {/* ---- bathroom fixtures ---- */}
      {/* inodoro: tank against the back partition, bowl + seat in front */}
      <mesh position={[rightInner + 0.4, FLOOR_Y + 0.6, zPart - 0.13]}>
        <boxGeometry args={[0.36, 0.4, 0.16]} />
        <meshStandardMaterial color={WHITE} />
      </mesh>
      <mesh position={[rightInner + 0.4, FLOOR_Y + 0.2, zPart - 0.46]}>
        <boxGeometry args={[0.36, 0.4, 0.5]} />
        <meshStandardMaterial color={WHITE} />
      </mesh>
      <mesh position={[rightInner + 0.4, FLOOR_Y + 0.42, zPart - 0.46]}>
        <boxGeometry args={[0.38, 0.06, 0.52]} />
        <meshStandardMaterial color={WHITE} />
      </mesh>
      {/* lavamanos against the right wall, toward the front, with a cold tap */}
      <mesh position={[rightInner + 0.27, FLOOR_Y + 0.85, z0 + 0.28]}>
        <boxGeometry args={[0.42, 0.12, 0.34]} />
        <meshStandardMaterial color={WHITE} />
      </mesh>
      <mesh position={[rightInner + 0.15, FLOOR_Y + 0.97, z0 + 0.28]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[rightInner + 0.23, FLOOR_Y + 1.06, z0 + 0.28]}>
        <boxGeometry args={[0.14, 0.025, 0.025]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
