import { describe, it, expect } from 'vitest';
import { site, areaM2, quinchoAreaM2, validateSite, type SiteConfig } from './site';

describe('site config', () => {
  it('has no validation errors', () => {
    expect(validateSite(site)).toEqual([]);
  });

  it('computes area as depth * width', () => {
    expect(areaM2()).toBe(site.depthM * site.widthM);
  });

  it('keeps the gate narrower than the lot width', () => {
    expect(site.gate.widthM).toBeLessThan(site.widthM);
  });

  it('flags invalid configs', () => {
    const bad: SiteConfig = {
      depthM: 0,
      widthM: 13,
      gate: { widthM: 99, side: 'front' },
      northHeadingDeg: 0,
      quincho: { widthM: 11, depthM: 5, fenceGapM: 1, frontHeightM: 3, backHeightM: 2.3 },
    };
    expect(validateSite(bad)).not.toEqual([]);
  });
});

describe('quincho', () => {
  it('computes covered area as width * depth', () => {
    expect(quinchoAreaM2()).toBe(site.quincho.widthM * site.quincho.depthM);
  });

  it('fits within the lot with the fence gaps', () => {
    const q = site.quincho;
    expect(q.widthM + 2 * q.fenceGapM).toBeLessThanOrEqual(site.widthM);
    expect(q.depthM + q.fenceGapM).toBeLessThanOrEqual(site.depthM);
  });

  it('has a front higher than the back for roof slope', () => {
    expect(site.quincho.frontHeightM).toBeGreaterThan(site.quincho.backHeightM);
  });
});
