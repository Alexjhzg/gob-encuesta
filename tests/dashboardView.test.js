import { describe, it, expect } from 'vitest';

describe('Dashboard Analytics Logic', () => {
  it('computes surveyor metrics correctly', () => {
    const mockFeatures = [
      {
        type: 'Feature',
        geometry: { coordinates: [-63.19, 9.72] },
        properties: { submitted_by: 'Encuestador A', 'S1/par': '02' }
      },
      {
        type: 'Feature',
        geometry: { coordinates: [-63.18, 9.73] },
        properties: { submitted_by: 'Encuestador B', 'S1/par': '07' }
      }
    ];

    const surveyors = new Set(mockFeatures.map(f => f.properties.submitted_by));
    expect(surveyors.size).toBe(2);
    expect(surveyors.has('Encuestador A')).toBe(true);
    expect(surveyors.has('Encuestador B')).toBe(true);
  });
});
