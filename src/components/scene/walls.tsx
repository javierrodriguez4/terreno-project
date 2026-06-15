'use client';

import { useMemo } from 'react';
import type { Texture } from 'three';
import { repeated } from './textures';

const GLASS = '#aac4d2';

interface Win {
  u: number; // center along the wall, from the wall center
  w: number; // width
  sill: number; // height of the sill from the floor
  h: number; // opening height
}

// A brick box wall with real window openings (glass + frame). `axis` is the direction
// the wall runs; it stays thin on the other horizontal axis.
export function BoxWallWithWindows({
  cx,
  cz,
  floorY,
  axis,
  length,
  height,
  thickness,
  brickBase,
  frameColor = '#cdd1d4',
  windows,
}: {
  cx: number;
  cz: number;
  floorY: number;
  axis: 'x' | 'z';
  length: number;
  height: number;
  thickness: number;
  brickBase: Texture;
  frameColor?: string;
  windows: Win[];
}) {
  const top = floorY + height;
  const half = length / 2;

  const bricks = useMemo(() => {
    const arr: { uc: number; us: number; yc: number; ys: number }[] = [];
    const sorted = [...windows].sort((a, b) => a.u - b.u);
    let cursor = -half;
    sorted.forEach((w) => {
      const left = w.u - w.w / 2;
      if (left > cursor + 0.001) {
        arr.push({ uc: (cursor + left) / 2, us: left - cursor, yc: floorY + height / 2, ys: height });
      }
      arr.push({ uc: w.u, us: w.w, yc: floorY + w.sill / 2, ys: w.sill }); // under the sill
      const tb = floorY + w.sill + w.h;
      arr.push({ uc: w.u, us: w.w, yc: (tb + top) / 2, ys: top - tb }); // over the lintel
      cursor = w.u + w.w / 2;
    });
    if (cursor < half - 0.001) {
      arr.push({ uc: (cursor + half) / 2, us: half - cursor, yc: floorY + height / 2, ys: height });
    }
    return arr;
  }, [windows, half, floorY, height, top]);

  const texes = useMemo(
    () => bricks.map((b) => repeated(brickBase, Math.max(0.3, b.us), Math.max(0.3, b.ys))),
    [bricks, brickBase],
  );

  const pos = (uc: number, yc: number): [number, number, number] =>
    axis === 'x' ? [cx + uc, yc, cz] : [cx, yc, cz + uc];
  const dims = (us: number, ys: number): [number, number, number] =>
    axis === 'x' ? [us, ys, thickness] : [thickness, ys, us];

  return (
    <group>
      {bricks.map((b, i) => (
        <mesh key={`b${i}`} position={pos(b.uc, b.yc)}>
          <boxGeometry args={dims(b.us, b.ys)} />
          <meshStandardMaterial map={texes[i]} roughness={0.95} />
        </mesh>
      ))}
      {windows.map((w, i) => {
        const yc = floorY + w.sill + w.h / 2;
        return (
          <group key={`w${i}`}>
            <mesh position={pos(w.u, yc)}>
              <boxGeometry args={dims(w.w - 0.08, w.h - 0.08)} />
              <meshStandardMaterial color={GLASS} metalness={0.2} roughness={0.1} transparent opacity={0.5} />
            </mesh>
            <mesh position={pos(w.u, floorY + w.sill + 0.025)}>
              <boxGeometry args={dims(w.w, 0.05)} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
            <mesh position={pos(w.u, floorY + w.sill + w.h - 0.025)}>
              <boxGeometry args={dims(w.w, 0.05)} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
            <mesh position={pos(w.u - w.w / 2 + 0.025, yc)}>
              <boxGeometry args={dims(0.05, w.h)} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
            <mesh position={pos(w.u + w.w / 2 - 0.025, yc)}>
              <boxGeometry args={dims(0.05, w.h)} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
