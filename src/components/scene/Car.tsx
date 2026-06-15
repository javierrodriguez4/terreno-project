'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

// White Toyota Corolla 2012 (sedan), real scale 4.545 x 1.760 x 1.475 m, wheelbase 2.60 m.
// The body is built from the side silhouette (sloped hood, raked windshield, roof, raked
// rear window, trunk) extruded across the width and bevelled, so it reads as a real car
// rather than a box. Glass greenhouse + four wheels on top.

type Vec3 = [number, number, number];

const BODY = '#eceeec';
const GLASS = '#23282f';
const TIRE = '#191919';
const HUB = '#b7b7b7';

const L = 4.545;
const W = 1.76;
const WB = 2.6;
const WHEEL_R = 0.31;

function extrudeProfile(points: [number, number][], width: number, bevel: number) {
  const s = new THREE.Shape();
  s.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1]);
  s.closePath();
  return new THREE.ExtrudeGeometry(s, {
    depth: width,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    steps: 1,
  });
}

export function Car({ position, rotationY = 0 }: { position: Vec3; rotationY?: number }) {
  // side silhouette: u = along length (-L/2 .. L/2, nose at +u), v = height
  const lowerGeo = useMemo(
    () =>
      extrudeProfile(
        [
          [2.27, 0.34],
          [2.27, 0.5],
          [1.55, 0.62],
          [1.1, 0.8],
          [-1.5, 0.8],
          [-1.98, 0.64],
          [-2.27, 0.5],
          [-2.27, 0.34],
        ],
        W - 0.06,
        0.06,
      ),
    [],
  );
  const cabinGeo = useMemo(
    () =>
      extrudeProfile(
        [
          [1.08, 0.82],
          [0.5, 1.42],
          [-0.9, 1.44],
          [-1.48, 0.82],
        ],
        W - 0.2,
        0.02,
      ),
    [],
  );

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
      <mesh geometry={lowerGeo} rotation={[0, -Math.PI / 2, 0]} position={[(W - 0.06) / 2, 0, 0]}>
        <meshStandardMaterial color={BODY} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* glass greenhouse */}
      <mesh geometry={cabinGeo} rotation={[0, -Math.PI / 2, 0]} position={[(W - 0.2) / 2, 0, 0]}>
        <meshStandardMaterial color={GLASS} metalness={0.4} roughness={0.2} />
      </mesh>
      {/* roof cap */}
      <mesh position={[0, 1.45, -0.2]}>
        <boxGeometry args={[W - 0.16, 0.05, 1.42]} />
        <meshStandardMaterial color={BODY} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* wheels */}
      {wheels.map((w, i) => (
        <group key={i} position={w}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.2, 18]} />
            <meshStandardMaterial color={TIRE} roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[w[0] > 0 ? 0.055 : -0.055, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.21, 14]} />
            <meshStandardMaterial color={HUB} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
