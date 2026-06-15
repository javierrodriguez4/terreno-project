# Terreno 3D — Phase 1 Design (Empty Lot Viewer)

Date: 2026-06-15
Status: Approved
Repo: https://github.com/javierrodriguez4/terreno-project

## Goal

A deployed web app that renders the empty lot in 3D at real scale, shareable via a
public URL so family and friends can see the base on which the quincho project will
be built. This is Phase 1 of an incremental, phased product (the construction is also
done in stages, with a limited budget).

## Phased roadmap (context)

1. **Phase 1 — Base (this doc):** empty lot in 3D, deployed on Vercel.
2. **Phase 2 — Quincho:** parametric 3D structure of the quincho.
3. **Phase 3 — Materials & cost:** quantities and budget derived from the 3D model.
4. **Phase 4 — Walkthrough:** first-person navigation and visual polish.

Each phase ships independently and adds value.

## Scope (Phase 1)

In scope:

- 3D scene at real scale (1 world unit = 1 meter): 40 m deep x 13 m wide ground plane.
- Perimeter fence on all 4 sides.
- Double-leaf gate centered on the front (south side).
- North / sun direction indicator.
- Orbit camera (drag to rotate, scroll to zoom). Mobile-friendly.
- Info overlay: dimensions, orientation, area (m2).
- Deployed to Vercel from the GitHub repo.

Out of scope (later phases): quincho geometry, material/cost calculator, first-person
walkthrough, auth, database, in-app editing. Sharing is the public Vercel URL.

## Architecture

Single source of truth for the lot data; everything else reads from it. This lets
Phase 2 build on top without touching existing code.

```
src/
  data/
    site.ts            # source of truth: lot dimensions, gate, orientation. Pure data.
  components/
    Scene.tsx          # assembles Canvas, camera, lights, controls
    InfoPanel.tsx      # 2D overlay: dimensions, orientation, area
    scene/
      Ground.tsx       # ground plane (40x13)
      Fence.tsx        # perimeter fence (4 sides)
      Gate.tsx         # double-leaf gate centered on front
      CompassNorth.tsx # north indicator + sun direction
app/
  page.tsx             # the page (renders Scene + InfoPanel)
  layout.tsx
  globals.css
```

### Data model (`src/data/site.ts`)

```ts
export interface SiteConfig {
  depthM: number;          // 40 (front-to-back)
  widthM: number;          // 13 (side-to-side)
  gate: {
    widthM: number;        // double-leaf gate opening, centered on front
    side: 'front';
  };
  northHeadingDeg: number; // 0 = fondo points north (current hypothesis)
}
```

Orientation hypothesis: fondo points north (derived from the Maps Street View heading
~13deg). Configurable here; flip in one place once confirmed on site.

### Units & coordinates

- World unit = 1 meter. Real scale so Phase 3 material math is trivial.
- Convention: lot centered at origin. +Z toward fondo (north), front (gate) at -Z.
  X across the width.

## Components / isolation

Each scene component does one thing and reads from `site.ts`:

- `Ground` — a plane sized depthM x widthM.
- `Fence` — four runs of posts + rails along the perimeter, leaving the gate opening.
- `Gate` — two leaves at the front opening.
- `CompassNorth` — arrow + label showing north toward the fondo.
- `Scene` — `<Canvas>`, lights, `OrbitControls`, composes the above.
- `InfoPanel` — plain DOM overlay (not 3D) with computed area = depthM * widthM.

## Error handling

- If WebGL is unavailable, show a clear fallback message instead of a blank canvas.
- Keep the scene lightweight for mobile GPUs (simple geometry, no heavy textures).

## Testing

Light but real (the value here is config correctness, not pixel rendering):

- Validate `site.ts`: positive dimensions, gate width less than lot width.
- Validate computed area = depthM * widthM.

## Tech / delivery

- Next.js (App Router) + TypeScript.
- react-three-fiber + @react-three/drei.
- Deployed on Vercel from the repo (free tier). Push to `main` -> auto deploy.

## Open items

- Confirm orientation on site (sunrise on the right when standing at the gate looking
  to the fondo => fondo = north). Until then, use the hypothesis in `site.ts`.
