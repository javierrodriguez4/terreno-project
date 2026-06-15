// Single source of truth for the lot and what we build on it. Everything else reads
// from here so phases (quincho, materials, walkthrough) build on top without churn.

export interface QuinchoConfig {
  /** Width along the lot width (x), in meters. */
  widthM: number;
  /** Depth front-to-back (z), in meters. */
  depthM: number;
  /** Discrete separation from the fences (back and sides), in meters. */
  fenceGapM: number;
  /** Height at the open front (south), in meters. */
  frontHeightM: number;
  /** Height at the back (north), in meters — lower, so the roof drains backward. */
  backHeightM: number;
}

export interface SiteConfig {
  /** Front-to-back length, in meters. */
  depthM: number;
  /** Side-to-side width, in meters. */
  widthM: number;
  gate: {
    /** Double-leaf gate opening, centered on the front (spans the width axis). */
    widthM: number;
    side: 'front';
  };
  /**
   * Orientation. 0 means the back (fondo) points north.
   * Hypothesis from the Maps Street View heading (~13deg); confirm on site.
   */
  northHeadingDeg: number;
  /** Quincho at the back (north), lengthwise across the width. */
  quincho: QuinchoConfig;
}

export const site: SiteConfig = {
  depthM: 40,
  widthM: 13,
  gate: { widthM: 4, side: 'front' },
  northHeadingDeg: 0,
  quincho: {
    widthM: 10,
    depthM: 4,
    fenceGapM: 1,
    frontHeightM: 3.0,
    backHeightM: 2.3,
  },
};

/** Lot area in square meters. */
export function areaM2(s: SiteConfig = site): number {
  return s.depthM * s.widthM;
}

/** Quincho covered area in square meters. */
export function quinchoAreaM2(s: SiteConfig = site): number {
  return s.quincho.widthM * s.quincho.depthM;
}

/** Returns a list of human-readable validation errors (empty when valid). */
export function validateSite(s: SiteConfig): string[] {
  const errors: string[] = [];
  if (s.depthM <= 0) errors.push('depthM must be positive');
  if (s.widthM <= 0) errors.push('widthM must be positive');
  if (s.gate.widthM <= 0) errors.push('gate.widthM must be positive');
  if (s.gate.widthM >= s.widthM) {
    errors.push('gate.widthM must be smaller than widthM');
  }

  const q = s.quincho;
  if (q.widthM <= 0) errors.push('quincho.widthM must be positive');
  if (q.depthM <= 0) errors.push('quincho.depthM must be positive');
  if (q.widthM + 2 * q.fenceGapM > s.widthM) {
    errors.push('quincho.widthM + side gaps must fit within the lot width');
  }
  if (q.depthM + q.fenceGapM > s.depthM) {
    errors.push('quincho.depthM + back gap must fit within the lot depth');
  }
  if (q.frontHeightM <= q.backHeightM) {
    errors.push('quincho.frontHeightM must be greater than backHeightM (roof slope)');
  }
  return errors;
}
