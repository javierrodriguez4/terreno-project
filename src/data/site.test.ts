import { describe, it, expect } from 'vitest';
import { site, areaM2, validateSite } from './site';

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
    expect(
      validateSite({ depthM: 0, widthM: 13, gate: { widthM: 99, side: 'front' }, northHeadingDeg: 0 }),
    ).not.toEqual([]);
  });
});
