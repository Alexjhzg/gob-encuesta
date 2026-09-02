import { describe, it, expect } from 'vitest';
import { generateMockGeoJSON, MOCK_ENUMERATORS, MOCK_CATEGORIES } from '../server/mockData.js';

describe('TDD 1.3: Mock Data Generator Module', () => {
  it('should generate a valid GeoJSON FeatureCollection with specified count', () => {
    const count = 30;
    const geojson = generateMockGeoJSON(count);

    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features).toHaveLength(count);
    expect(geojson.meta.total).toBe(count);
    expect(geojson.meta.is_mock).toBe(true);

    const firstFeature = geojson.features[0];
    expect(firstFeature.type).toBe('Feature');
    expect(firstFeature.geometry.type).toBe('Point');
    expect(firstFeature.geometry.coordinates).toHaveLength(2);
    
    // Check coordinates range (Venezuelan region bounds)
    const [lon, lat] = firstFeature.geometry.coordinates;
    expect(lat).toBeGreaterThanOrEqual(10.0);
    expect(lat).toBeLessThanOrEqual(11.0);
    expect(lon).toBeGreaterThanOrEqual(-67.5);
    expect(lon).toBeLessThanOrEqual(-66.0);

    expect(firstFeature.properties).toHaveProperty('id');
    expect(firstFeature.properties).toHaveProperty('submitted_by');
    expect(firstFeature.properties).toHaveProperty('categoria');
    expect(firstFeature.properties).toHaveProperty('estado_atencion');
  });

  it('should export list of mock enumerators and categories', () => {
    expect(Array.isArray(MOCK_ENUMERATORS)).toBe(true);
    expect(MOCK_ENUMERATORS.length).toBeGreaterThan(0);
    expect(Array.isArray(MOCK_CATEGORIES)).toBe(true);
    expect(MOCK_CATEGORIES.length).toBeGreaterThan(0);
  });
});
