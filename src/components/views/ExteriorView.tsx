'use client';

import { Stage3D } from './Stage3D';
import { InfoPanel } from '../InfoPanel';

// Exterior: orbit around the whole lot from outside.
export function ExteriorView() {
  return (
    <>
      <Stage3D cameraPosition={[22, 27, -43]} target={[0, 1, 0]} fov={50} />
      <InfoPanel />
    </>
  );
}
