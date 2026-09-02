import { describe, it, expect } from 'vitest';
import { SURVEY_ASSET_OPTIONS, DEFAULT_KPIS } from '../src/utils/headerHelpers.js';

describe('Header Helpers', () => {
  it('provides default KPI fallbacks', () => {
    expect(DEFAULT_KPIS).toEqual({
      total: 0,
      geocodedCount: 0,
      percentGeocoded: 0,
      lastSync: 'Reciente'
    });
  });

  it('contains survey asset options list with responsive label formatting', () => {
    expect(SURVEY_ASSET_OPTIONS.length).toBeGreaterThanOrEqual(2);
    expect(SURVEY_ASSET_OPTIONS[0]).toHaveProperty('uid');
    expect(SURVEY_ASSET_OPTIONS[0]).toHaveProperty('label');
  });
});
