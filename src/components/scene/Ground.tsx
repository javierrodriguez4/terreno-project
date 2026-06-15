'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { site } from '@/data/site';

// Procedural grass texture: a green base speckled with short blade-like strokes in
// several green tones. Tiled across the ground so it reads as real grass.
function makeGrassTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#5e8038';
  ctx.fillRect(0, 0, size, size);

  const greens = ['#4f7330', '#6f9447', '#577d34', '#7aa052', '#456b2b', '#638b40'];
  for (let i = 0; i < 7000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.strokeStyle = greens[(Math.random() * greens.length) | 0];
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() * 2 - 1), y - (1 + Math.random() * 3));
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  // One tile per ~2 m for a natural blade density.
  tex.repeat.set(site.widthM / 2, site.depthM / 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Flat ground plane at real scale (1 unit = 1 meter), laid on the XZ plane.
export function Ground() {
  const grass = useMemo(() => makeGrassTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[site.widthM, site.depthM]} />
      <meshStandardMaterial map={grass} />
    </mesh>
  );
}
