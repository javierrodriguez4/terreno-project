'use client';

import { site } from '@/data/site';
import { Stage3D } from './Stage3D';

// Interior: orbit from inside the quincho to inspect the parrilla, mesada, roof, etc.
// (Built to extend to other rooms — e.g. the future bathroom.)
export function InteriorView() {
  const q = site.quincho;
  const d = site.depthM / 2;
  const hw = q.widthM / 2;
  const zBack = d - q.fenceGapM;
  const zFront = zBack - q.depthM;
  const zMid = (zBack + zFront) / 2;
  const cx = site.widthM / 2 - q.fenceGapM - hw; // quincho group offset (interior center x)

  return (
    <Stage3D
      cameraPosition={[cx, 1.5, zFront + 0.3]}
      target={[cx, 1.3, zMid]}
      fov={75}
      minDistance={0.4}
      maxDistance={4}
    />
  );
}
