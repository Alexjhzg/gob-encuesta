import { describe, it, expect } from 'vitest';
import { getPinBgClass } from '../src/utils/mapHelpers.js';

describe('MapView Helpers', () => {
  describe('getPinBgClass', () => {
    it('returns emerald for resolved / approved status', () => {
      expect(getPinBgClass('General', 'Resuelto')).toBe('bg-emerald-600');
      expect(getPinBgClass('General', 'approved')).toBe('bg-emerald-600');
    });

    it('returns amber for inspection or pending status', () => {
      expect(getPinBgClass('General', 'Inspección Requerida')).toBe('bg-amber-500');
      expect(getPinBgClass('General', 'Pendiente')).toBe('bg-amber-500');
    });

    it('returns category specific colors when status is generic', () => {
      expect(getPinBgClass('Salud', 'Registrado')).toBe('bg-pink-600');
      expect(getPinBgClass('Vialidad', 'Registrado')).toBe('bg-purple-600');
    });

    it('defaults to blue', () => {
      expect(getPinBgClass('Otros', 'Registrado')).toBe('bg-blue-600');
    });
  });
});
