import { describe, it, expect } from 'vitest';
import { parseGeopoint, transformKoboToGeoJSON } from '../server/geojsonTransformer.js';

describe('TDD 1.1: GeoJSON Transformer Module', () => {
  describe('parseGeopoint', () => {
    it('should parse standard Kobo geopoint string "lat lon alt precision"', () => {
      const input = "10.4806 -66.9036 125 3.5";
      const result = parseGeopoint(input);
      expect(result).not.toBeNull();
      expect(result.latitude).toBeCloseTo(10.4806);
      expect(result.longitude).toBeCloseTo(-66.9036);
      expect(result.altitude).toBe(125);
      expect(result.precision).toBe(3.5);
      expect(result.coordinates).toEqual([-66.9036, 10.4806]); // GeoJSON order: [lon, lat]
    });

    it('should handle array format [lat, lon]', () => {
      const input = [10.4806, -66.9036];
      const result = parseGeopoint(input);
      expect(result).not.toBeNull();
      expect(result.coordinates).toEqual([-66.9036, 10.4806]);
    });

    it('should return null for invalid, empty or null geopoint strings', () => {
      expect(parseGeopoint(null)).toBeNull();
      expect(parseGeopoint(undefined)).toBeNull();
      expect(parseGeopoint('')).toBeNull();
      expect(parseGeopoint('invalid data')).toBeNull();
    });
  });

  describe('transformKoboToGeoJSON', () => {
    it('should transform a list of Kobo submissions into a standard GeoJSON FeatureCollection', () => {
      const rawSubmissions = [
        {
          _id: 101,
          _submission_time: '2026-08-30T10:00:00Z',
          _submitted_by: 'encuestador_1',
          _geolocation: [10.4806, -66.9036],
          categoria: 'Infraestructura',
          observacion: 'Vía en mal estado'
        },
        {
          _id: 102,
          _submission_time: '2026-08-30T11:30:00Z',
          _submitted_by: 'encuestador_2',
          location: '10.5000 -66.9200 80 2.1',
          categoria: 'Salud',
          observacion: 'Ambulatorio operativo'
        },
        {
          _id: 103,
          _submission_time: '2026-08-30T12:00:00Z',
          _submitted_by: 'encuestador_1',
          categoria: 'Educación'
          // No geolocation
        }
      ];

      const result = transformKoboToGeoJSON(rawSubmissions);

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(2); // Only geocoded ones in features
      expect(result.meta.total).toBe(3);
      expect(result.meta.geocoded_count).toBe(2);
      expect(result.meta.non_geocoded_count).toBe(1);

      const feature1 = result.features[0];
      expect(feature1.type).toBe('Feature');
      expect(feature1.geometry.type).toBe('Point');
      expect(feature1.geometry.coordinates).toEqual([-66.9036, 10.4806]);
      expect(feature1.properties.id).toBe(101);
      expect(feature1.properties.submitted_by).toBe('encuestador_1');
      expect(feature1.properties.categoria).toBe('Infraestructura');
    });

    it('should handle empty submissions list gracefully', () => {
      const result = transformKoboToGeoJSON([]);
      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(0);
      expect(result.meta.total).toBe(0);
      expect(result.meta.geocoded_count).toBe(0);
    });
  });
});
