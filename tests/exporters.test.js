import { describe, it, expect } from 'vitest';
import { exportToGeoJSON, exportToCSV } from '../src/utils/exporters.js';

describe('TDD 2.2: Data Exporters Module', () => {
  const sampleFeatures = [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-66.9036, 10.4806] },
      properties: {
        id: 101,
        submitted_by: 'Maria Rodriguez',
        submission_time: '2026-08-01T10:00:00Z',
        categoria: 'Salud',
        estado_atencion: 'Resuelto',
        observaciones: 'Ambulatorio operativo'
      }
    }
  ];

  it('exportToGeoJSON should produce valid stringified GeoJSON FeatureCollection', () => {
    const jsonString = exportToGeoJSON(sampleFeatures);
    const parsed = JSON.parse(jsonString);
    expect(parsed.type).toBe('FeatureCollection');
    expect(parsed.features).toHaveLength(1);
    expect(parsed.features[0].geometry.coordinates).toEqual([-66.9036, 10.4806]);
  });

  it('exportToCSV should generate formatted CSV string with headers and escaped values', () => {
    const csvString = exportToCSV(sampleFeatures);
    const lines = csvString.trim().split('\n');
    expect(lines.length).toBe(2); // Header + 1 row
    expect(lines[0]).toContain('ID');
    expect(lines[0]).toContain('Encuestador');
    expect(lines[0]).toContain('Latitud');
    expect(lines[1]).toContain('101');
    expect(lines[1]).toContain('Maria Rodriguez');
    expect(lines[1]).toContain('10.4806');
    expect(lines[1]).toContain('-66.9036');
  });
});
