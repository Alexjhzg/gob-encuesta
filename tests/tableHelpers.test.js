import { describe, it, expect } from 'vitest';
import { extractKeyAnswer, sortFeatures } from '../src/utils/tableHelpers.js';

describe('DataTable Helpers', () => {
  describe('extractKeyAnswer', () => {
    it('extracts candidate preference when present', () => {
      const props = { 'g_preguntas/g_preferencia/si_hoy_tarjeta_electoral': '1_ernesto_luna' };
      expect(extractKeyAnswer(props)).toEqual({ label: 'Ernesto Luna', color: 'bg-blue-100 text-blue-800' });
    });

    it('extracts gestión evaluation when candidate preference is absent', () => {
      const props = { 'aspectos_politicos_sociales/g_gestion/gestion': '1_excelente' };
      expect(extractKeyAnswer(props)).toEqual({ label: 'Gestión: Excelente', color: 'bg-emerald-100 text-emerald-800' });
    });

    it('extracts propensión when candidate and gestión are absent', () => {
      const props = { 'g_preguntas/g_propension/si_elecciones_domingo': '1_def_si' };
      expect(extractKeyAnswer(props)).toEqual({ label: 'Votará: Def. Sí', color: 'bg-emerald-100 text-emerald-800' });
    });

    it('falls back to category or "Registrado"', () => {
      expect(extractKeyAnswer({ categoria: 'Vialidad' })).toEqual({ label: 'Vialidad', color: 'bg-slate-100 text-slate-700' });
      expect(extractKeyAnswer({})).toEqual({ label: 'Registrado', color: 'bg-slate-100 text-slate-700' });
    });
  });

  describe('sortFeatures', () => {
    const features = [
      { properties: { id: 2, submitted_by: 'Bob', submission_time: '2026-08-29T10:00:00Z' } },
      { properties: { id: 1, submitted_by: 'Alice', submission_time: '2026-08-28T10:00:00Z' } }
    ];

    it('sorts features by id ascending and descending', () => {
      const asc = sortFeatures(features, 'id', true);
      expect(asc[0].properties.id).toBe(1);

      const desc = sortFeatures(features, 'id', false);
      expect(desc[0].properties.id).toBe(2);
    });

    it('sorts features by submission_time correctly', () => {
      const asc = sortFeatures(features, 'submission_time', true);
      expect(asc[0].properties.id).toBe(1);
    });
  });
});
