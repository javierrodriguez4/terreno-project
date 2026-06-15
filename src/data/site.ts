// Single source of truth for the lot. Everything else reads from here so later
// phases (quincho, materials, walkthrough) can build on top without touching it.

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
}

export const site: SiteConfig = {
  depthM: 40,
  widthM: 13,
  gate: { widthM: 4, side: 'front' },
  northHeadingDeg: 0,
};

/** Lot area in square meters. */
export function areaM2(s: SiteConfig = site): number {
  return s.depthM * s.widthM;
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
  return errors;
}
