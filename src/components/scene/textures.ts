import * as THREE from 'three';

// Procedural exposed-brick texture ("ladrillo hueco a la vista"): running-bond courses
// of terracotta bricks with mortar joints. One tile = 1 m x 1 m of wall.
export function makeBrickTexture(): THREE.Texture {
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

/** Clone a texture with its own repeat (so different meshes can reuse one base). */
export function repeated(base: THREE.Texture, rx: number, ry: number): THREE.Texture {
  const t = base.clone();
  t.needsUpdate = true;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  return t;
}
