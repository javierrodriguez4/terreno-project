# Terreno 3D — Sauce, Corrientes

Web app to design, visualize, and budget a quincho (BBQ shelter) on a 40 x 13 m lot.
Built in phases so it can be shared early and grow over time.

**Phase 1 (current):** the empty lot rendered in 3D at real scale — ground, perimeter
fence, double-leaf gate, and north orientation — viewable in the browser and shareable
via the Vercel URL.

Roadmap: Phase 2 quincho geometry · Phase 3 materials & cost calculator · Phase 4
first-person walkthrough. See `docs/superpowers/specs/`.

## Stack

Next.js (App Router) + TypeScript · react-three-fiber + drei · Vitest · deployed on Vercel.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # config validation tests
npm run build    # production build
```

## Source of truth

`src/data/site.ts` holds the lot data (dimensions, gate, orientation). Everything reads
from it, so later phases build on top without touching existing code.
