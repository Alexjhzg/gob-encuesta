import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatCoordinates,
  filterFeaturesByBounds,
  filterFeaturesByDateRange,
  filterFeaturesByEnumerator,
  filterFeaturesBySearchText,
  calculateKPIs
} from '../src/utils/formattersAndFilters.js';

describe('TDD 2.1: Formatters & Filters Engine', () => {
  const sampleFeatures = [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-66.9036, 10.4806] },
      properties: {
        id: 1,
        submitted_by: 'Maria Rodriguez',
        submission_time: '2026-08-01T10:00:00Z',
        categoria: 'Salud',
        observaciones: 'Ambulatorio operativo'
      }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-66.8500, 10.5000] },
      properties: {
        id: 2,
        submitted_by: 'Carlos Mendoza',
        submission_time: '2026-08-15T15:30:00Z',
        categoria: 'Vialidad',
        observaciones: 'Hueco en vía principal'
      }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-67.2000, 10.1000] }, // Outside caracas bounding box
      properties: {
        id: 3,
        submitted_by: 'Maria Rodriguez',
        submission_time: '2026-08-28T09:00:00Z',
        categoria: 'Salud',
        observaciones: 'Inspección de farmacia'
      }
    }
  ];

  it('formatDate should format ISO string into clean localized format', () => {
    const formatted = formatDate('2026-08-15T15:30:00Z');
    expect(formatted).toContain('2026');
    expect(formatted).toMatch(/15|ago/i);
  });

  it('formatCoordinates should format lat/lon to clear string', () => {
    const formatted = formatCoordinates(10.4806, -66.9036);
    expect(formatted).toBe('10.4806° N, 66.9036° W');
  });

  it('filterFeaturesByBounds should correctly filter features inside bounding box', () => {
    // Bounding box: south=10.40, west=-67.00, north=10.55, east=-66.80
    const bounds = { south: 10.40, west: -67.00, north: 10.55, east: -66.80 };
    const filtered = filterFeaturesByBounds(sampleFeatures, bounds);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(f => f.properties.id)).toEqual([1, 2]);
  });

  it('filterFeaturesByDateRange should filter features within start and end date', () => {
    const filtered = filterFeaturesByDateRange(sampleFeatures, '2026-08-10', '2026-08-20');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].properties.id).toBe(2);
  });

  it('filterFeaturesByEnumerator should filter features by submitted_by', () => {
    const filtered = filterFeaturesByEnumerator(sampleFeatures, 'Maria Rodriguez');
    expect(filtered).toHaveLength(2);
  });

  it('filterFeaturesBySearchText should match search query across properties', () => {
    const filtered = filterFeaturesBySearchText(sampleFeatures, 'Ambulatorio');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].properties.id).toBe(1);
  });

  it('calculateKPIs should compute total, geocoded counts and breakdown', () => {
    const kpis = calculateKPIs(sampleFeatures, 3);
    expect(kpis.total).toBe(3);
    expect(kpis.geocodedCount).toBe(3);
    expect(kpis.percentGeocoded).toBe(100);
    expect(kpis.categoryCounts['Salud']).toBe(2);
    expect(kpis.categoryCounts['Vialidad']).toBe(1);
  });
});
