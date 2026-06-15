'use client';

import { site, areaM2, quinchoAreaM2 } from '@/data/site';

const INK = '#2a2a2a';
const LIGHT = '#9a9a9a';
const WALL_FILL = '#d7d2c8';
const ROOF_FILL = '#cdd2d6';
const BRICK_FILL = '#cf8f6e';
const SANS = 'ui-sans-serif, system-ui, sans-serif';

function DimH({ x1, x2, y, label, below }: { x1: number; x2: number; y: number; label: string; below?: boolean }) {
  return (
    <g stroke={LIGHT} strokeWidth={0.8}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <text
        x={(x1 + x2) / 2}
        y={below ? y + 12 : y - 5}
        fill={INK}
        fontSize="10"
        textAnchor="middle"
        stroke="none"
        fontFamily={SANS}
      >
        {label}
      </text>
    </g>
  );
}

function DimV({ y1, y2, x, label, right }: { y1: number; y2: number; x: number; label: string; right?: boolean }) {
  const tx = right ? x + 12 : x - 8;
  return (
    <g stroke={LIGHT} strokeWidth={0.8}>
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} />
      <text
        x={tx}
        y={(y1 + y2) / 2}
        fill={INK}
        fontSize="10"
        textAnchor="middle"
        stroke="none"
        fontFamily={SANS}
        transform={`rotate(-90 ${tx} ${(y1 + y2) / 2})`}
      >
        {label}
      </text>
    </g>
  );
}

function Label({ x, y, text, size = 10 }: { x: number; y: number; text: string; size?: number }) {
  return (
    <text x={x} y={y} fill={INK} fontSize={size} textAnchor="middle" fontFamily={SANS}>
      {text}
    </text>
  );
}

function North({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y + 16} x2={x} y2={y - 14} stroke={INK} strokeWidth={1.2} />
      <path d={`M ${x} ${y - 18} L ${x - 4} ${y - 8} L ${x + 4} ${y - 8} Z`} fill={INK} />
      <text x={x} y={y - 22} fill={INK} fontSize="10" textAnchor="middle" fontFamily={SANS}>
        N
      </text>
    </g>
  );
}

// ---------------------------------------------------------------- Implantación
function PlanImplantacion() {
  const s = 12;
  const W = site.widthM;
  const D = site.depthM;
  const ox = 95;
  const oy = 45;
  const q = site.quincho;

  const sx = (xw: number) => ox + (W / 2 - xw) * s; // west (+x) on the left
  const sy = (dd: number) => oy + (D - dd) * s; // fondo (north) on top
  const dd = (zw: number) => zw + D / 2;

  const leftX = W / 2 - q.fenceGapM; // +x wall
  const rightX = leftX - q.widthM;
  const qBack = D / 2 - q.fenceGapM;
  const qFront = qBack - q.depthM;

  const trees = [12, 6, 0, -6].map((zw) => ({ x: sx(-(W / 2 - 0.5)), y: sy(dd(zw)) }));
  const palms = [W / 2 - 0.5, -(W / 2 - 0.5)].map((xw) => ({ x: sx(xw), y: sy(dd(-D / 2 + 0.5)) }));

  return (
    <svg viewBox="0 0 300 580" width="100%" style={{ maxWidth: 360 }}>
      <rect x={ox} y={oy} width={W * s} height={D * s} fill="#f3f6ef" stroke={LIGHT} strokeWidth={1} strokeDasharray="4 3" />
      {/* gate gap on the front (bottom) */}
      <line x1={sx(2)} y1={oy + D * s} x2={sx(-2)} y2={oy + D * s} stroke="#fff" strokeWidth={3} />
      <Label x={sx(0)} y={oy + D * s + 14} text="portón" size={9} />
      {/* quincho */}
      <rect x={sx(leftX)} y={sy(qBack)} width={(leftX - rightX) * s} height={q.depthM * s} fill={WALL_FILL} stroke={INK} strokeWidth={1.2} />
      <Label x={(sx(leftX) + sx(rightX)) / 2} y={(sy(qBack) + sy(qFront)) / 2 + 3} text="QUINCHO" size={9} />
      {/* trees + palms */}
      {trees.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r={7} fill="#cfe0bf" stroke="#6f8f4a" />
      ))}
      {palms.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={6} fill="#d8e7c8" stroke="#6f8f4a" />
      ))}
      <Label x={sx(-(W / 2 - 0.5)) - 2} y={sy(dd(3))} text="" />
      {/* dims */}
      <DimV y1={oy} y2={oy + D * s} x={ox - 14} label={`${D} m`} />
      <DimH x1={ox} x2={ox + W * s} y={oy - 12} label={`${W} m`} />
      <North x={ox + W * s + 22} y={oy + 30} />
      <Label x={ox + W * s - 6} y={sy(dd(0))} text="" />
      <text x={sx(-(W / 2 - 0.5))} y={sy(dd(-9))} fill={INK} fontSize="8" textAnchor="middle" fontFamily={SANS} transform={`rotate(-90 ${sx(-(W / 2 - 0.5))} ${sy(dd(-9))})`}>
        4 lapachos
      </text>
    </svg>
  );
}

// ------------------------------------------------------------- Planta quincho
function PlanPlantaQuincho() {
  const s = 34;
  const q = site.quincho;
  const ox = 60;
  const oy = 45;
  const W = q.widthM;
  const D = q.depthM;
  const wt = 0.2 * s;

  // north up: back wall top, open front bottom; left (+x) wall on the left
  const x0 = ox;
  const y0 = oy;
  const x1 = ox + W * s;
  const y1 = oy + D * s;

  // parrilla toward the front (bottom) on the left wall; mesada toward the back (top)
  const parrW = 1.2 * s; // along the wall (vertical here)
  const parrD = 0.7 * s; // into the room
  const mesD = 0.6 * s;
  const parrY1 = y1 - 0.1 * s - parrW;
  const cols = [1, 2].map((i) => x0 + W * s * (i / 3));

  // bathroom on the right wall (east), toward the front (bottom)
  const b = q.bathroom;
  const bathD = b.depthM * s;
  const bathL = b.lengthM * s;
  const bathX = x1 - wt - bathD;
  const bathY1 = y1 - 0.1 * s;
  const bathY0 = bathY1 - bathL;

  return (
    <svg viewBox="0 0 520 260" width="100%" style={{ maxWidth: 640 }}>
      {/* slab outline */}
      <rect x={x0} y={y0} width={W * s} height={D * s} fill="#f6f4ef" stroke={LIGHT} strokeWidth={0.8} />
      {/* walls (brick) — back, left, right */}
      <rect x={x0} y={y0} width={W * s} height={wt} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      <rect x={x0} y={y0} width={wt} height={D * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      <rect x={x1 - wt} y={y0} width={wt} height={D * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      {/* open front (bottom) — roof edge dashed */}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={LIGHT} strokeWidth={1} strokeDasharray="5 3" />
      {/* columns */}
      {cols.map((cx, i) => (
        <rect key={i} x={cx - 0.1 * s} y={y1 - 0.2 * s} width={0.2 * s} height={0.2 * s} fill={INK} />
      ))}
      {/* parrilla (brick) */}
      <rect x={x0 + wt} y={parrY1} width={parrD} height={parrW} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      <Label x={x0 + wt + parrD + 26} y={parrY1 + parrW / 2} text="PARRILLA" size={9} />
      {/* mesada (concrete) */}
      <rect x={x0 + wt} y={y0 + wt} width={mesD} height={parrY1 - (y0 + wt) - 4} fill="#dedad2" stroke={INK} strokeWidth={1} />
      <Label x={x0 + wt + mesD + 24} y={(y0 + wt + parrY1) / 2} text="MESADA" size={9} />
      {/* pileta */}
      <rect x={x0 + wt + 0.12 * s} y={y0 + wt + 0.2 * s} width={0.36 * s} height={0.36 * s} fill="#c7c2b8" stroke={INK} strokeWidth={0.8} />
      <Label x={x0 + wt + 0.3 * s + 30} y={y0 + wt + 0.4 * s} text="pileta" size={8} />
      {/* bathroom + depósito (brick) */}
      <rect x={bathX} y={bathY0} width={bathD} height={bathL} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      <Label x={bathX + bathD / 2} y={(bathY0 + bathY1) / 2} text="BAÑO" size={8} />
      <rect x={bathX} y={y0 + wt} width={bathD} height={bathY0 - (y0 + wt)} fill="#e7ddcf" stroke={INK} strokeWidth={1} />
      <Label x={bathX + bathD / 2} y={(y0 + wt + bathY0) / 2} text="DEPÓSITO" size={8} />
      {/* dims */}
      <DimH x1={x0} x2={x1} y={y0 - 12} label={`${W} m`} />
      <DimV y1={y0} y2={y1} x={x0 - 12} label={`${D} m`} />
      <DimV y1={parrY1} y2={parrY1 + parrW} x={x1 + 14} label="1.20" right />
      <North x={x1 + 30} y={y0 + 14} />
      <Label x={(x0 + x1) / 2} y={y1 + 18} text="frente abierto (galería)" size={9} />
    </svg>
  );
}

// --------------------------------------------------------------- Vista lateral
function VistaLateral() {
  const s = 46;
  const q = site.quincho;
  const ox = 55;
  const groundY = 215;
  const D = q.depthM;
  const fH = q.frontHeightM;
  const bH = q.backHeightM;

  // front (high) on the left, back (low) on the right
  const xF = ox;
  const xB = ox + D * s;
  const yF = groundY - fH * s;
  const yB = groundY - bH * s;
  const oh = 0.4 * s;

  return (
    <svg viewBox="0 0 360 260" width="100%" style={{ maxWidth: 460 }}>
      {/* ground */}
      <line x1={20} y1={groundY} x2={340} y2={groundY} stroke={INK} strokeWidth={1.2} />
      {/* wall profile (trapezoid) */}
      <polygon
        points={`${xF},${groundY} ${xB},${groundY} ${xB},${yB} ${xF},${yF}`}
        fill={BRICK_FILL}
        stroke={INK}
        strokeWidth={1.2}
      />
      {/* roof */}
      <polygon
        points={`${xF - oh},${yF - 6} ${xB + oh},${yB - 6} ${xB + oh},${yB} ${xF - oh},${yF}`}
        fill={ROOF_FILL}
        stroke={INK}
        strokeWidth={1.2}
      />
      {/* chimney near the front */}
      <rect x={xF + 0.3 * s} y={groundY - 3.7 * s} width={0.4 * s} height={3.7 * s - bH * s + 0.4 * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      {/* dims */}
      <DimH x1={xF} x2={xB} y={groundY + 16} label={`${D} m`} below />
      <DimV y1={yF} y2={groundY} x={xF - 14} label={`${fH} m`} />
      <DimV y1={yB} y2={groundY} x={xB + 16} label={`${bH} m`} right />
      <Label x={xF + 6} y={groundY - 4} text="frente" size={8} />
      <Label x={xB - 6} y={groundY - 4} text="fondo" size={8} />
    </svg>
  );
}

// --------------------------------------------------------------- Vista frontal
function VistaFrontal() {
  const s = 34;
  const q = site.quincho;
  const ox = 55;
  const groundY = 200;
  const W = q.widthM;
  const fH = q.frontHeightM;

  const x0 = ox;
  const x1 = ox + W * s;
  const yTop = groundY - fH * s;
  const cols = [1, 2].map((i) => x0 + W * s * (i / 3));

  return (
    <svg viewBox="0 0 520 240" width="100%" style={{ maxWidth: 640 }}>
      <line x1={20} y1={groundY} x2={500} y2={groundY} stroke={INK} strokeWidth={1.2} />
      {/* roof overhang line */}
      <line x1={x0 - 0.4 * s} y1={yTop - 12} x2={x1 + 0.4 * s} y2={yTop - 12} stroke={INK} strokeWidth={1} />
      {/* side walls at the ends (brick) */}
      <rect x={x0} y={yTop} width={0.2 * s} height={fH * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      <rect x={x1 - 0.2 * s} y={yTop} width={0.2 * s} height={fH * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1} />
      {/* wooden front beam on columns + walls */}
      <rect x={x0} y={yTop - 4} width={W * s} height={0.18 * s} fill="#c9a86a" stroke={INK} strokeWidth={1} />
      {/* middle columns */}
      {cols.map((cx, i) => (
        <rect key={i} x={cx} y={yTop + 0.18 * s} width={0.2 * s} height={fH * s - 0.18 * s} fill="#cfcabf" stroke={INK} strokeWidth={1} />
      ))}
      {/* chimney behind */}
      <rect x={x0 + 0.5 * s} y={groundY - 3.7 * s} width={0.4 * s} height={3.7 * s - fH * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1} strokeDasharray="3 2" />
      {/* dims */}
      <DimH x1={x0} x2={x1} y={groundY + 16} label={`${W} m`} below />
      <DimV y1={yTop} y2={groundY} x={x0 - 14} label={`${fH} m`} />
      <Label x={(x0 + x1) / 2} y={yTop - 18} text="frente: viga de madera sobre 2 columnas + paredes" size={9} />
    </svg>
  );
}

// ------------------------------------------------------------ Detalle parrilla
function DetalleParrilla() {
  const s = 95;
  const ox = 70;
  const groundY = 360;
  const w = 1.2; // boca width

  const x0 = ox;
  const x1 = ox + w * s;
  const yG = groundY;
  const yCounter = groundY - 0.9 * s;
  const yBoca = groundY - 1.6 * s;
  const yCampB = groundY - 1.85 * s;
  const yCampT = groundY - 2.45 * s;
  const yChim = groundY - 3.7 * s;

  return (
    <svg viewBox="0 0 320 400" width="100%" style={{ maxWidth: 360 }}>
      <line x1={20} y1={yG} x2={300} y2={yG} stroke={INK} strokeWidth={1.2} />
      {/* base (leñero) */}
      <rect x={x0} y={yCounter} width={w * s} height={0.9 * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1.2} />
      {/* jambs + boca */}
      <rect x={x0} y={yCampB} width={0.18 * s} height={0.95 * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1.2} />
      <rect x={x1 - 0.18 * s} y={yCampB} width={0.18 * s} height={0.95 * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1.2} />
      {/* boca opening */}
      <rect x={x0 + 0.18 * s} y={yBoca} width={w * s - 0.36 * s} height={0.7 * s} fill="#3a3a3a" />
      {/* grill line */}
      <line x1={x0 + 0.18 * s} y1={groundY - 1.05 * s} x2={x1 - 0.18 * s} y2={groundY - 1.05 * s} stroke="#bbb" strokeWidth={1.5} strokeDasharray="3 2" />
      {/* lintel */}
      <rect x={x0} y={yBoca - 0.05 * s} width={w * s} height={0.25 * s} fill={BRICK_FILL} stroke={INK} strokeWidth={1.2} />
      {/* campana */}
      <polygon points={`${x0},${yCampB} ${x1},${yCampB} ${x0 + 0.78 * s},${yCampT} ${x0 + 0.42 * s},${yCampT}`} fill={BRICK_FILL} stroke={INK} strokeWidth={1.2} />
      {/* chimney */}
      <rect x={x0 + 0.42 * s} y={yChim} width={0.36 * s} height={yCampT - yChim} fill={BRICK_FILL} stroke={INK} strokeWidth={1.2} />
      {/* dims */}
      <DimV y1={yCounter} y2={yG} x={x0 - 14} label="0.90" />
      <DimV y1={yBoca} y2={yCounter} x={x1 + 16} label="0.70" right />
      <DimH x1={x0} x2={x1} y={yG + 16} label="1.20" below />
      <Label x={x0 + 0.6 * s} y={groundY - 1.05 * s - 6} text="parrilla" size={8} />
      <Label x={x0 + 0.6 * s} y={(yChim + yCampT) / 2} text="chimenea" size={8} />
    </svg>
  );
}

function Sheet({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="plan-sheet">
      <figcaption className="plan-title">{title}</figcaption>
      <div className="plan-canvas">{children}</div>
    </figure>
  );
}

export function PlanosView() {
  return (
    <div className="planos">
      <header className="planos-head">
        <h1>Planos del proyecto — Quincho, Sauce (Corrientes)</h1>
        <p>
          Lote {site.depthM}×{site.widthM} m ({areaM2()} m²) · Quincho {site.quincho.widthM}×
          {site.quincho.depthM} m ({quinchoAreaM2()} m²). Generados del modelo: se actualizan solos.
        </p>
      </header>
      <div className="planos-grid">
        <Sheet title="1 · Implantación">
          <PlanImplantacion />
        </Sheet>
        <Sheet title="2 · Planta del quincho">
          <PlanPlantaQuincho />
        </Sheet>
        <Sheet title="3 · Vista frontal">
          <VistaFrontal />
        </Sheet>
        <Sheet title="4 · Vista lateral (pendiente del techo)">
          <VistaLateral />
        </Sheet>
        <Sheet title="5 · Detalle de la parrilla">
          <DetalleParrilla />
        </Sheet>
      </div>
    </div>
  );
}
